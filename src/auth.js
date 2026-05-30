/* ===================== AUTH LAYER =====================
   Single abstraction over Supabase auth + user_progress storage.
   While Supabase env vars are missing, we run a LOCAL-ONLY mock that
   persists users + progress to localStorage. The API surface is identical,
   so swapping in the real Supabase client later is a one-import change.

   Public API:
     getCurrentSession()       → { user, profile } | null  (synchronous)
     onAuthChange(cb)          → unsubscribe  (cb gets the latest session)
     signUpWithEmail({ email, password, name }) → { error? }
     signInWithEmail({ email, password })       → { error? }
     signInWithGoogle()                         → { error? }
     signOut()                                  → void
     loadProgress(userId)      → Promise<state>
     saveProgress(userId, st)  → Promise<void>
*/

import { createClient } from '@supabase/supabase-js'

const SB_URL  = import.meta.env.VITE_SUPABASE_URL  || ''
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const USE_REAL = Boolean(SB_URL && SB_ANON)

let supabase = null
if (USE_REAL) {
  try {
    supabase = createClient(SB_URL, SB_ANON, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  } catch (e) {
    console.warn('[auth] Supabase init failed — falling back to local mock:', e.message)
  }
}

/* ============================================================
   LOCAL MOCK (no Supabase env vars). Stores users + progress in
   localStorage so the UI is fully testable during development. */
const MOCK_USERS_KEY    = 'novoacademy_mock_users'
const MOCK_SESSION_KEY  = 'novoacademy_mock_session'
const MOCK_PROGRESS_KEY = 'novoacademy_mock_progress'

const _loadMockUsers   = () => { try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY)   || '{}') } catch { return {} } }
const _saveMockUsers   = (u) => { try { localStorage.setItem(MOCK_USERS_KEY,   JSON.stringify(u)) } catch {} }
const _loadMockSession = ()  => { try { return JSON.parse(localStorage.getItem(MOCK_SESSION_KEY) || 'null') } catch { return null } }
const _saveMockSession = (s) => {
  try {
    if (s) localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(s))
    else   localStorage.removeItem(MOCK_SESSION_KEY)
  } catch {}
}
const _loadMockProgress = (uid) => {
  try { return JSON.parse(localStorage.getItem(`${MOCK_PROGRESS_KEY}_${uid}`) || '{}') } catch { return {} }
}
const _saveMockProgress = (uid, p) => {
  try { localStorage.setItem(`${MOCK_PROGRESS_KEY}_${uid}`, JSON.stringify(p)) } catch {}
}

const _uuid = () => {
  try {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
  } catch {
    // Fallback for very old browsers without crypto.getRandomValues
    return 'mock-' + Date.now() + '-' + Math.random().toString(36).slice(2)
  }
}

/* ============================================================
   PUBLIC API */

const listeners = new Set()
let _cachedSession = null

const _emit = () => {
  for (const cb of listeners) {
    try { cb(_cachedSession) } catch {}
  }
}

const _refreshSession = async () => {
  if (USE_REAL && supabase) {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user) {
      const u = data.session.user
      _cachedSession = {
        user: { id: u.id, email: u.email },
        profile: { name: u.user_metadata?.name || u.user_metadata?.full_name || u.email },
      }
    } else {
      _cachedSession = null
    }
  } else {
    _cachedSession = _loadMockSession()
  }
  return _cachedSession
}

// Initialise synchronously from cache so first render isn't blank
_cachedSession = USE_REAL ? null : _loadMockSession()
if (USE_REAL && supabase) {
  // Hydrate async — components subscribe via onAuthChange
  _refreshSession().then(_emit)
  supabase.auth.onAuthStateChange((_event, _session) => {
    _refreshSession().then(_emit)
  })
}

export const getCurrentSession = () => _cachedSession

export const onAuthChange = (cb) => {
  listeners.add(cb)
  // Fire once immediately with current state
  try { cb(_cachedSession) } catch {}
  return () => listeners.delete(cb)
}

export const signUpWithEmail = async ({ email, password, name }) => {
  if (!email || !password) return { error: 'invalid' }
  if (password.length < 8) return { error: 'weak' }

  if (USE_REAL && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (error) {
      const msg = String(error.message || '').toLowerCase()
      if (msg.includes('registered') || msg.includes('exists')) return { error: 'taken' }
      return { error: error.message || 'unknown' }
    }
    // With email confirm off, Supabase signs the user in immediately
    return {}
  }

  // ----- Mock -----
  const users = _loadMockUsers()
  if (users[email]) return { error: 'taken' }
  const id = _uuid()
  users[email] = { id, email, password, name: name || email }
  _saveMockUsers(users)
  _cachedSession = { user: { id, email }, profile: { name: name || email } }
  _saveMockSession(_cachedSession)
  _emit()
  return {}
}

export const signInWithEmail = async ({ email, password }) => {
  if (!email || !password) return { error: 'invalid' }

  if (USE_REAL && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'invalid' }
    return {}
  }

  // ----- Mock -----
  const users = _loadMockUsers()
  const u = users[email]
  if (!u || u.password !== password) return { error: 'invalid' }
  _cachedSession = { user: { id: u.id, email: u.email }, profile: { name: u.name } }
  _saveMockSession(_cachedSession)
  _emit()
  return {}
}

export const signInWithGoogle = async () => {
  if (USE_REAL && supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
    if (error) return { error: error.message }
    return {}
  }
  // Mock: pretend to sign in as a demo Google user
  const id = 'mock-google-' + Date.now()
  _cachedSession = { user: { id, email: 'demo.google@example.com' }, profile: { name: 'Demo Google User' } }
  _saveMockSession(_cachedSession)
  _emit()
  return {}
}

export const signOut = async () => {
  if (USE_REAL && supabase) {
    // Supabase's onAuthStateChange will call _refreshSession + _emit for us.
    // Don't manually emit again here to avoid double re-renders.
    await supabase.auth.signOut()
    return
  }
  _cachedSession = null
  _saveMockSession(null)
  _emit()
}

/* ===== Per-user progress storage ===== */

export const loadProgress = async (userId) => {
  if (!userId) return {}
  if (USE_REAL && supabase) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('course_uid, watched, test_passed, test_score')
      .eq('user_id', userId)
    if (error || !data) return {}
    const out = {}
    for (const row of data) {
      out[row.course_uid] = {
        watched: row.watched,
        testPassed: row.test_passed,
        testScore: row.test_score,
      }
    }
    return out
  }
  return _loadMockProgress(userId)
}

export const saveProgress = async (userId, state) => {
  if (!userId) return
  if (USE_REAL && supabase) {
    const rows = Object.entries(state).map(([course_uid, v]) => ({
      user_id: userId,
      course_uid,
      watched: !!v?.watched,
      test_passed: !!v?.testPassed,
      test_score: Number(v?.testScore || 0),
      updated_at: new Date().toISOString(),
    }))
    if (rows.length === 0) return
    await supabase.from('user_progress').upsert(rows, { onConflict: 'user_id,course_uid' })
    return
  }
  _saveMockProgress(userId, state)
}

export const isUsingRealSupabase = () => USE_REAL

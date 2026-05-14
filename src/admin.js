/* NOVO ACADEMY Admin / Backend helpers
   --------------------------------------
   The platform is a static React app — there is no real server. The admin
   panel persists its state in the browser (localStorage for permanent flags,
   sessionStorage for the unlock state) and the data layer respects those
   flags when building the home tree.

   Admin scope (current):
   - hide / show individual courses
   - hide / show whole categories (sections)
   - simple password gate to enter the admin page

   For deeper changes (adding new courses, editing content), use the
   content-folder workflow described in `content/README.md`. */

const KEY_HIDDEN_COURSES    = 'novoacademy_hidden_courses'
const KEY_HIDDEN_CATEGORIES = 'novoacademy_hidden_categories'
const KEY_COURSE_OVERRIDES  = 'novoacademy_course_overrides'
const KEY_SECTION_ORDER     = 'novoacademy_section_order'
const KEY_COURSE_ORDER      = 'novoacademy_course_order'
const KEY_UNLOCKED          = 'novoacademy_admin_unlocked'
const PASSWORD              = 'Novosapiens'

/* ---- Snapshot of original courses, captured BEFORE any override is applied.
   Stored on the COURSES module itself so we can revert an override to the
   true factory value without re-importing the module. */
let _baseline = null
const ensureBaseline = (COURSES) => {
  if (_baseline) return _baseline
  _baseline = {}
  for (const c of COURSES) {
    // deep clone the relevant fields so overrides can't leak back
    _baseline[c.id] = JSON.parse(JSON.stringify(c))
  }
  return _baseline
}
export const getBaseline = (COURSES) => ensureBaseline(COURSES)

/* ---- read state ---- */
const readSet = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}
export const getHiddenCourseIds   = () => readSet(KEY_HIDDEN_COURSES)
export const getHiddenCategories  = () => readSet(KEY_HIDDEN_CATEGORIES)

/* ---- write state ---- */
const writeSet = (key, set) => {
  localStorage.setItem(key, JSON.stringify([...set]))
  // Notify listeners so the UI can refresh
  window.dispatchEvent(new CustomEvent('novoacademy-admin-change'))
}
export const toggleCourseHidden = (id) => {
  const s = getHiddenCourseIds()
  if (s.has(id)) s.delete(id); else s.add(id)
  writeSet(KEY_HIDDEN_COURSES, s)
  return s
}
export const toggleCategoryHidden = (cat) => {
  const s = getHiddenCategories()
  if (s.has(cat)) s.delete(cat); else s.add(cat)
  writeSet(KEY_HIDDEN_CATEGORIES, s)
  return s
}
export const resetHidden = () => {
  writeSet(KEY_HIDDEN_COURSES, new Set())
  writeSet(KEY_HIDDEN_CATEGORIES, new Set())
}

/* ---- password gate ---- */
export const isUnlocked = () => sessionStorage.getItem(KEY_UNLOCKED) === '1'
export const unlock = (pw) => {
  if (pw === PASSWORD) {
    sessionStorage.setItem(KEY_UNLOCKED, '1')
    return true
  }
  return false
}
export const lock = () => {
  sessionStorage.removeItem(KEY_UNLOCKED)
  window.dispatchEvent(new CustomEvent('novoacademy-admin-change'))
}

/* ---- course content overrides ----
   Per-course partial objects stored in localStorage that replace fields
   on the matching COURSES entry.  Used by the admin editor to let the
   platform owner tweak descriptions, bullets, questions, documents etc.
   without touching data.js. */
export const getCourseOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY_COURSE_OVERRIDES) || '{}')
  } catch {
    return {}
  }
}
const writeCourseOverrides = (obj) => {
  localStorage.setItem(KEY_COURSE_OVERRIDES, JSON.stringify(obj))
  window.dispatchEvent(new CustomEvent('novoacademy-admin-change'))
}
export const setCourseOverride = (id, partial) => {
  const all = getCourseOverrides()
  all[id] = { ...(all[id] || {}), ...partial }
  writeCourseOverrides(all)
}
export const replaceCourseOverride = (id, fullOverride) => {
  const all = getCourseOverrides()
  all[id] = fullOverride
  writeCourseOverrides(all)
}
export const resetCourseOverride = (id) => {
  const all = getCourseOverrides()
  delete all[id]
  writeCourseOverrides(all)
}
export const hasOverride = (id) => Boolean(getCourseOverrides()[id])

/* Apply all stored overrides on top of the baseline.  Mutates the COURSES
   array in-place so every consumer (HomePage, CourseLandingPage, …) sees
   the edited values automatically.  Call at app startup and after every
   edit. */
export const applyCourseOverrides = (COURSES) => {
  const baseline = ensureBaseline(COURSES)
  const overrides = getCourseOverrides()
  for (let i = 0; i < COURSES.length; i++) {
    const c = COURSES[i]
    const base = baseline[c.id]
    if (!base) continue
    // Reset to baseline values first
    for (const k of Object.keys(c)) {
      if (!(k in base)) delete c[k]
    }
    Object.assign(c, JSON.parse(JSON.stringify(base)))
    // Apply override
    const ov = overrides[c.id]
    if (ov) Object.assign(c, JSON.parse(JSON.stringify(ov)))
  }
}

/* ---- custom display order (drag & drop) ----
   Two-level state, both keyed by name/id:
   - KEY_SECTION_ORDER:  { "<MainCategory>": ["<Section>", ...] }
   - KEY_COURSE_ORDER:   { "<Section>":      ["<courseId>",   ...] }
   Items not listed in a custom order fall back to natural order, appended
   at the end. */
const readJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) }
  catch { return fallback }
}
const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('novoacademy-admin-change'))
}

export const getSectionOrder = () => readJson(KEY_SECTION_ORDER, {})
export const getCourseOrder  = () => readJson(KEY_COURSE_ORDER, {})
export const setSectionOrder = (mainCategory, sectionNames) => {
  const all = getSectionOrder()
  all[mainCategory] = sectionNames
  writeJson(KEY_SECTION_ORDER, all)
}
export const setCourseOrder = (category, courseIds) => {
  const all = getCourseOrder()
  all[category] = courseIds
  writeJson(KEY_COURSE_ORDER, all)
}
export const resetOrders = () => {
  writeJson(KEY_SECTION_ORDER, {})
  writeJson(KEY_COURSE_ORDER, {})
}

/* Apply stored custom orders to a groups tree.
   Sections/courses listed in the custom order come first in that order;
   anything missing falls back to its natural position (appended). */
export const reorderGroups = (groups) => {
  const secOrders = getSectionOrder()
  const crsOrders = getCourseOrder()
  const orderBy = (items, customOrder, keyFn) => {
    if (!customOrder?.length) return items
    const indexOf = (k) => {
      const i = customOrder.indexOf(k)
      return i === -1 ? Number.MAX_SAFE_INTEGER : i
    }
    return [...items].sort((a, b) => indexOf(keyFn(a)) - indexOf(keyFn(b)))
  }
  return groups.map(g => ({
    ...g,
    sections: orderBy(g.sections, secOrders[g.mainCategory], s => s.category)
      .map(s => ({
        ...s,
        items: orderBy(s.items, crsOrders[s.category], c => c.id)
      }))
  }))
}

/* ---- filter helper: applies the hidden flags to a groups tree
   (as produced by data.js groupForDisplay).
   Returns a new tree with hidden courses / categories removed,
   plus any sections that became empty as a result. */
export const filterGroups = (groups) => {
  const hc = getHiddenCourseIds()
  const hk = getHiddenCategories()
  return groups
    .map(g => ({
      ...g,
      sections: g.sections
        .filter(s => !hk.has(s.category))
        .map(s => ({ ...s, items: s.items.filter(i => !hc.has(i.id)) }))
        .filter(s => s.items.length > 0)
    }))
    .filter(g => g.sections.length > 0)
}

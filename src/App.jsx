import React, { useState, useMemo, useRef, useEffect, useContext, createContext } from 'react'
import { downloadCertificate } from './generateCert.js'
import CertTemplateBg from './CertTemplateBg.jsx'
import PdfThumb from './PdfThumb.jsx'
import { COURSES, isCertifiable, isCertified, buildInitialState, groupForDisplay, SAMPLE_COURSE_LIST, CATEGORY_CONTENT, HOME_VIDEO_SECTION, getHomeVideoSection, getHomeTopVideos, getContentTags, courseKey, t as tBase, getSampleCourseList, assetUrl, bestDisplayName } from './data.js'
import {
  getCurrentSession, onAuthChange, signUpWithEmail, signInWithEmail,
  signInWithGoogle, signOut, loadProgress, saveProgress, isUsingRealSupabase,
  getMyProfile, updateMyLang, adminLoadAllUsers, adminSetUserCourseState,
  adminSetIsAdmin, adminUpdateUserName, adminResetAllProgress,
  adminSoftDeleteUser, adminUndeleteUser,
} from './auth.js'

/* ===================== I18N CONTEXT =====================
   Liefert die aktive Sprache an alle Komponenten ohne Prop-Drilling.
   `useT()` gibt eine t(key)-Funktion für die aktive Sprache zurück. */
const LangContext = createContext('de')
const useLang = () => useContext(LangContext)
const useT = () => {
  const lang = useLang()
  return (key) => tBase(lang, key)
}

/* ===================== ICONS ===================== */
const Icon = {
  Grid: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>),
  Bag: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l-1 13H6L5 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>),
  Clipboard: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z" fill="currentColor" stroke="none"/><path d="M8 11h8M8 15h6"/></svg>),
  People: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.3"/><path d="M15 14c2 0 5 1.5 5 4"/></svg>),
  Briefcase: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>),
  Book: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13h7a3 3 0 0 0 3-3V4z"/></svg>),
  Network: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2M12 12v2"/></svg>),
  User: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>),
  Bell: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4L6 17z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>),
  Gear: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>),
  Camera: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 4l-1.5 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.5L15 4H9z"/><circle cx="12" cy="13" r="4" fill="#fff"/></svg>),
  PlatformIcon: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 13h6M7 16h4"/></svg>),
  Check: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6"/></svg>),
  Play: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>),
  Doc: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  ArrowLeft: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18"/></svg>),
  ArrowRight: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>),
  ChevronLeft: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18"/></svg>),
  Download: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>),
  Eye: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-11-7-11-7a18.66 18.66 0 0 1 4.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/><line x1="1" y1="1" x2="23" y2="23"/></svg>),
  Lock: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Drag: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>),
  Scale: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7h14M3 12l2-5 2 5a2 2 0 1 1-4 0zM17 12l2-5 2 5a2 2 0 1 1-4 0z"/></svg>),
  Apple: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6c-3 0-6 2-6 7s3 9 6 9 6-4 6-9-3-7-6-7z"/><path d="M12 6c0-2 1-4 3-4M12 6c-1-1-1-2 0-3"/></svg>),
  Pill: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="M9 15l6-6"/></svg>),
  Lightning: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>),
  Stack: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 7 12 12 22 7"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/><polyline points="2 7 12 2 22 7"/></svg>),
  CertIcon: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>),
  Cap: () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/></svg>),
  Quiz: () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3"/><path d="M9 11h6M9 14h6M9 17h4"/></svg>),
  Info: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8h.01M11 12h1v5h1"/></svg>),
  Shield: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>),
}

/* ===================== REUSABLE BRAND NOTICE =====================
   Verwendet in mehreren Kursen, um auf Marken- und Design-Variationen
   der Berichte hinzuweisen. */
function BrandNotice() {
  const t = useT()
  return (
    <aside className="brand-notice">
      <div className="brand-notice-icon"><Icon.Info /></div>
      <div className="brand-notice-body">
        <div className="brand-notice-title">{t('brand_notice_title')}</div>
        <p className="brand-notice-text">{t('brand_notice_text')}</p>
      </div>
    </aside>
  )
}

const CATEGORY_ICONS = {
  // DE
  'Die Gen-Diät': Icon.Scale,
  'Gewichtsmanagement-Genetik': Icon.Scale, // legacy fallback
  'Genetik der gesunden Ernährung': Icon.Apple,
  'Personalisierte Nahrungsergänzung': Icon.Pill,
  'Leistungs-Genetik': Icon.Lightning,
  'Rechtlich sicher werben mit Produkten': Icon.Shield,
  // EN — match CATEGORIES_EN values from data.en.js
  'The Gene-Diet': Icon.Scale,
  'Eat Healthy by Your Genes': Icon.Apple,
  'Personalized Supplementation': Icon.Pill,
  'Athletic Performance': Icon.Lightning,
  'Legally Safe Advertising with Products': Icon.Shield,
}

/* Sidebar component was removed — the academy ships as a standalone site
   (className "app no-sidebar" on the root), so the legacy Sidebar was dead code. */

/* ===================== SEAL (real stamp — serrated, banner, stars) ===================== */
function Seal({ certified, certifiable, size = 'normal' }) {
  const lang = useLang()
  if (!certifiable) return null

  const color = certified ? '#3FA85C' : '#D5D5D5'
  const colorDark = certified ? '#2F8546' : '#BFBFBF'
  const sealText = lang === 'en' ? 'CERTIFIED' : 'ZERTIFIZIERT'

  // Serrated outer edge (path)
  const N = 32
  const ROUT = 49
  const RIN = 44
  const pts = []
  for (let i = 0; i < N * 2; i++) {
    const r = i % 2 === 0 ? ROUT : RIN
    const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  const serratedD = `M${pts.join(' L')} Z`

  // 5-point star path (centered on origin, radius ~3.5)
  const starD = (cx, cy, r = 3.2) => {
    const out = []
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      out.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`)
    }
    return `M${out.join(' L')} Z`
  }

  return (
    <div className={`seal-stamp${certified ? ' is-certified' : ' is-pending'}${size === 'big' ? ' is-big' : ''}`}>
      <svg viewBox="0 0 100 100" className="seal-stamp-svg" xmlns="http://www.w3.org/2000/svg">
        {/* Serrated outer */}
        <path d={serratedD} fill={color} />
        {/* Inner ring background (paper) */}
        <circle cx="50" cy="50" r="36" fill="#FAFAFA" />
        {/* Two decorative inner rings */}
        <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="2.2" />
        <circle cx="50" cy="50" r="32" fill="none" stroke={color} strokeWidth="0.9" />
        {/* Stars: 2 above banner, 2 below */}
        <path d={starD(38, 28)} fill={color} />
        <path d={starD(62, 28)} fill={color} />
        <path d={starD(38, 72)} fill={color} />
        <path d={starD(62, 72)} fill={color} />
        {/* Diagonal banner across center */}
        <g transform="rotate(-10 50 50)">
          <rect x="-4" y="42" width="108" height="16" fill={color} />
          <rect x="-4" y="42" width="108" height="1.2" fill={colorDark} />
          <rect x="-4" y="56.8" width="108" height="1.2" fill={colorDark} />
          <text x="50" y="53.5" textAnchor="middle"
                fill="#fff"
                fontSize="9.5"
                fontWeight="900"
                fontFamily="Montserrat, sans-serif"
                letterSpacing="1.2">
            {sealText}
          </text>
        </g>
      </svg>
    </div>
  )
}

/* ===================== TILE ===================== */
function Tile({ course, state, onClick }) {
  // Placeholder tile (COMING SOON) — gray, non-clickable, distinct visual
  if (course.placeholder) {
    return (
      <article className="tile is-placeholder" aria-disabled="true">
        <div className="tile-thumb-wrap">
          <div className="thumb thumb-placeholder">
            <span className="placeholder-label">COMING SOON</span>
          </div>
        </div>
        <div className="tile-meta">
          <h3 className="tile-title tile-title-placeholder">{course.category}</h3>
          <p className="tile-desc">{course.description}</p>
        </div>
      </article>
    )
  }

  const certifiable = isCertifiable(course)
  const certified = isCertified(course, { [courseKey(course)]: state })
  const watch = state.watched ? 'completed' : (state.progress > 0 ? 'in-progress' : 'unseen')
  const tileClass = [
    'tile',
    `state-${watch}`,
    certified ? 'is-certified' : '',
    certifiable ? 'is-certifiable' : '',
    course.contentType === 'supplementary' ? 'is-supp' : '',
  ].filter(Boolean).join(' ')

  return (
    <article className={tileClass} onClick={onClick} role="button" tabIndex={0}
             onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}>
      <div className="tile-thumb-wrap">
        <div className="thumb has-img">
          <img className="thumb-img" src={course.thumbnail} alt={course.topic} loading="lazy" />
          {!certified && watch === 'unseen' && certifiable && <span className="watch-pip" />}
          {watch === 'completed' && !certified && <span className="watch-check"><Icon.Check /></span>}
          {watch === 'completed' && !certified && <span className="watch-overlay" />}
          {watch === 'in-progress' && state.progress > 0 && (
            <span className="progress-bar" style={{ width: `${state.progress}%` }} />
          )}
        </div>
        {/* Seal sits OUTSIDE .thumb so it isn't clipped by overflow:hidden */}
        <Seal certified={certified} certifiable={certifiable} />
      </div>

      <div className="tile-meta">
        <h3 className="tile-title">{course.category}: {course.topic}</h3>
        <p className="tile-desc">{course.description}</p>
        <ContentTags course={course} size="sm" />
      </div>
    </article>
  )
}

const TAG_CLASS = {
  'Video': 'tag-video',
  'Test': 'tag-test',
  'Download Material': 'tag-download',
  'Text Explanation': 'tag-text',
}

/* Inline content-tag row — shows which materials the course offers. */
function ContentTags({ course, size = 'sm' }) {
  const lang = useLang()
  const tags = getContentTags(course, lang)
  if (!tags.length) return null
  return (
    <div className={`content-tags is-${size}`}>
      {tags.map((tg, i) => (
        <span key={i} className={`tag ${tg.className}`}>{tg.label}</span>
      ))}
    </div>
  )
}

/* ===================== CATEGORY ROW (conditional scroll buttons) ===================== */
function CategoryRow({ category, label, items, courseState, navigate }) {
  const ref = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const lang = useLang()
  const Ico = CATEGORY_ICONS[category] || Icon.Book
  const scroll = (dir) => ref.current && ref.current.scrollBy({ left: dir * 620, behavior: 'smooth' })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])

  return (
    <div className="cat-row">
      <header className="cat-row-head">
        <div className="cat-row-icon"><Ico /></div>
        <h2 className="cat-row-title">
          {category}
          {label && <span className="cat-row-products"> ({label})</span>}
        </h2>
        <span className="cat-row-accent" />
      </header>

      <div className="row-wrap">
        {canLeft && (
          <button className="scroll-btn left" onClick={() => scroll(-1)} aria-label={lang === 'en' ? 'Previous' : 'Zurück'}>
            <Icon.ArrowLeft />
          </button>
        )}
        <div className="row" ref={ref}>
          {items.map(c => (
            <Tile key={c.id} course={c} state={courseState[courseKey(c)] || {}}
                  onClick={() => c.placeholder ? null : navigate({ name: 'course-landing', courseId: c.id })} />
          ))}
        </div>
        {canRight && (
          <button className="scroll-btn right" onClick={() => scroll(1)} aria-label={lang === 'en' ? 'Next' : 'Weiter'}>
            <Icon.ArrowRight />
          </button>
        )}
      </div>
    </div>
  )
}

/* ===================== COOKIE CONSENT =====================
   Stores 'all' | 'necessary' in localStorage key 'nova-cookie-consent'.
   'all'       = user accepted all cookies (YouTube iframes load normally)
   'necessary' = user declined optional cookies (YouTube iframes show a
                 consent placeholder instead of loading)
   null/undefined = not yet decided → banner is shown */
const COOKIE_KEY = 'nova-cookie-consent'
function useCookieConsent() {
  const [consent, setConsentState] = useState(() => localStorage.getItem(COOKIE_KEY))
  const setConsent = (val) => { localStorage.setItem(COOKIE_KEY, val); setConsentState(val) }
  return [consent, setConsent]
}

function CookieBanner({ onAccept, onNecessary, onOpenPrivacy }) {
  const t = useT()
  return (
    <div className="cookie-banner" role="dialog" aria-label={t('cookie_title')}>
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <strong>{t('cookie_title')}</strong>
          <p>{t('cookie_text')} <button className="cookie-link" onClick={onOpenPrivacy}>{t('cookie_privacy_link')}</button></p>
        </div>
        <div className="cookie-banner-btns">
          <button className="btn-secondary cookie-btn-necessary" onClick={onNecessary}>{t('cookie_necessary')}</button>
          <button className="btn-primary cookie-btn-accept" onClick={onAccept}>{t('cookie_accept_all')}</button>
        </div>
      </div>
    </div>
  )
}

/* Tiny inline placeholder shown instead of a YouTube iframe when the user
   has not given consent for third-party cookies. */
function YtConsentPlaceholder({ onAllow }) {
  const t = useT()
  return (
    <div className="yt-consent-placeholder">
      <div className="yt-consent-icon">▶</div>
      <p className="yt-consent-hint">{t('cookie_yt_blocked_hint')}</p>
      <button className="btn-primary yt-consent-btn" onClick={onAllow}>{t('cookie_yt_allow')}</button>
    </div>
  )
}

/* ===================== YOUTUBE EMBED HELPERS =====================
   Modern browsers (Chrome/Edge/Safari) block iframe autoplay with sound
   unless the iframe is mounted via a direct user gesture AND already had
   permission to play audio. Because React mounts the iframe after a click
   (state-update + render), the gesture is often considered "consumed".

   Workaround: load the embed muted (which is always allowed to autoplay)
   and use the YouTube IFrame Player API via postMessage to unmute after
   onLoad. Net effect: video plays with sound on the first click, no
   second click needed. */
const YT_EMBED_PARAMS = 'autoplay=1&mute=1&enablejsapi=1&rel=0&playsinline=1'

function ytUnmuteOnLoad(e) {
  const win = e.target.contentWindow
  if (!win) return
  const cmd = (func, args = []) =>
    win.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  // YouTube IFrame API needs ~200-600ms to be ready; we try a few times.
  let tries = 0
  const tick = () => {
    cmd('unMute')
    cmd('setVolume', [100])
    cmd('playVideo')
    if (++tries < 6) setTimeout(tick, 250)
  }
  setTimeout(tick, 200)
}

/* ===================== WELCOME VIDEO ===================== */
/* Pass `youtubeId` to embed an actual YouTube video; otherwise shows a click-to-play thumbnail */
function WelcomePlayer({ youtubeId = null, coverImage = null }) {
  const [playing, setPlaying] = useState(false)
  const [consent, setConsent] = useCookieConsent()
  // Use explicit coverImage if provided (for videos without public YouTube thumbnails,
  // e.g. unlisted/private). Otherwise fall back to YouTube CDN thumbnail.
  const primarySrc = coverImage || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null)
  return (
    <div className="welcome-player" onClick={() => !playing && consent === 'all' && setPlaying(true)}>
      {playing && youtubeId && consent === 'all' ? (
        <iframe
          className="welcome-iframe"
          src={`https://www.youtube.com/embed/${youtubeId}?${YT_EMBED_PARAMS}`}
          title="NOVO ACADEMY video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={ytUnmuteOnLoad}
        />
      ) : (
        <>
          <div className="welcome-thumb-fallback" />
          {primarySrc && (
            <img
              className="welcome-thumb"
              src={primarySrc}
              alt=""
              onLoad={(e) => {
                // YouTube returns a 120×90 placeholder when maxresdefault doesn't exist —
                // detect by naturalWidth and fall back to hqdefault (always available).
                if (e.target.src.includes('maxresdefault') && e.target.naturalWidth < 320) {
                  e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                }
              }}
              onError={(e) => {
                if (e.target.src.includes('maxresdefault')) {
                  e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                } else {
                  e.target.style.display = 'none'
                }
              }}
            />
          )}
          {consent !== 'necessary' ? (
            <button className="welcome-play" aria-label="Play video" onClick={() => setPlaying(true)}>
              <Icon.Play />
            </button>
          ) : (
            <YtConsentPlaceholder onAllow={() => setConsent('all')} />
          )}
          {playing && !youtubeId && <div className="welcome-fake">▶ Playback (demo — YouTube ID missing)</div>}
        </>
      )}
    </div>
  )
}

function WelcomeText({ title, sub }) {
  return (
    <div className="welcome-text">
      <h2 className="welcome-title">{title}</h2>
      <p className="welcome-sub">{sub}</p>
    </div>
  )
}

/* ===================== HOME PAGE ===================== */
function HomePage({ courseState, navigate, certName, setCertName, completedCertifiableCount, certifiedTitles, lang = 'de' }) {
  const mains = useMemo(
    () => groupForDisplay(lang),
    [lang]
  )
  // Exclude placeholders from progress count — they aren't real modules
  // and respect the current language (only the visible courses count toward "100%")
  const realCourses = COURSES.filter(c => c.contentType !== 'placeholder' && (c.lang || 'de') === lang)
  const totalModules = realCourses.length
  const completedModules = realCourses.filter(c => courseState[courseKey(c)]?.watched).length
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  const topVideos = getHomeTopVideos(lang)
  const t = (k) => tBase(lang, k)

  return (
    <div className="content">
      {/* Two introduction videos side-by-side, each ~2 tile widths.
          Title + description sit underneath each video. */}
      <div className="home-top-row">
        {topVideos.map((v, i) => (
          <div key={i} className="welcome-block">
            <WelcomePlayer youtubeId={v.youtubeId} coverImage={v.coverImage} />
            <WelcomeText title={v.title} sub={v.sub} />
          </div>
        ))}
      </div>

      {/* Clear demarcation: course section starts here */}
      <div className="courses-section-header">
        <h2 className="courses-section-title">
          <span className="cs-text">{t('home_courses_section_title')}</span>
          <span className="cs-accent" />
        </h2>
        <p className="courses-section-sub">{t('home_courses_section_sub')}</p>

        <section className="academy-progress">
          <div className="ap-text">
            <div className="ap-stats">
              <span className="ap-num">{completedModules}</span>
              <span className="ap-of">{t('home_progress_of')}</span>
              <span className="ap-total">{totalModules}</span>
              <span className="ap-label">{t('home_progress_label')}</span>
            </div>
            <div className="ap-pct">{pct}%</div>
          </div>
          <div className="ap-bar">
            <div className="ap-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </section>
      </div>

      {mains.map(main => (
        <section key={main.mainCategory} className="main-cat">
          <h2 className="main-cat-title">
            <span className="main-cat-text">{main.mainCategory}</span>
            <span className="main-cat-accent" />
          </h2>
          {main.sections.map(s => (
            <CategoryRow
              key={s.category}
              category={s.category}
              label={s.label}
              items={s.items}
              courseState={courseState}
              navigate={navigate}
            />
          ))}
        </section>
      ))}

      {/* Letzte Sektion: Bonus-Videos — sprach-spezifisch */}
      {(() => {
        const hvs = getHomeVideoSection(lang)
        if (!hvs?.videos?.length) return null
        return (
          <section className="home-bonus-videos">
            <h2 className="home-bonus-title">{hvs.category}</h2>
            {hvs.subtitle && <p className="home-bonus-sub">{hvs.subtitle}</p>}
            <div className="home-bonus-grid">
              {hvs.videos.map((v, i) => (
                <RelatedVideoTile key={i} youtubeId={v.youtubeId} title={v.title} coverImage={v.coverImage} />
              ))}
            </div>
          </section>
        )
      })()}

      <CertificateCTA
        name={certName}
        onNameChange={setCertName}
        onGenerate={() => navigate({ name: 'certificate', isSample: false })}
        onShowSample={() => navigate({ name: 'certificate', isSample: true })}
        completedCount={completedCertifiableCount}
        certifiedTitles={certifiedTitles}
      />
    </div>
  )
}

/* ===================== MINI CERTIFICATE PREVIEW (new portrait Genoacademy-style) ===================== */
function CertificateMini({ name }) {
  const t = useT()
  const displayName = name ?? (useLang() === 'en' ? 'Jane Doe' : 'Maria Mustermann')
  return (
    <div className="cert-mini">
      <div className="cert-mini-paper">
        <svg className="cert-mini-wedge" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="1058" width="794" height="65" fill="#6B1F47" />
          <path d="M 794 700 Q 740 770, 690 870 Q 660 950, 600 1058 L 794 1058 Z" fill="#6B1F47" />
        </svg>
        <div className="cert-mini-content">
          <div className="cert-mini-head">
            <div className="cert-mini-logo">
              <div className="cert-mini-mark" />
              <span className="cert-mini-word">novogenia</span>
            </div>
          </div>
          <div className="cert-mini-novo-title">NOVOGENIA</div>
          <div className="cert-mini-coach-title">{t('cert_mini_genetik_coach')}</div>
          <div className="cert-mini-presented">{t('cert_mini_presented')}</div>
          <div className="cert-mini-name">{displayName}</div>
          <div className="cert-mini-rules"><span /><span /><span /></div>
        </div>
      </div>
    </div>
  )
}

/* ===================== CERTIFICATE CTA (on home, wine bg with seal + preview) ===================== */
function CertificateCTA({ name, onNameChange, onGenerate, onShowSample, completedCount }) {
  const t = useT()
  return (
    <section className="cert-cta">
      <div className="cert-cta-body">
        <h2>{t('cert_cta_title')}</h2>
        <p>
          {t('cert_cta_intro_a')}<strong>Novogenia Genetics Coach</strong>{t('cert_cta_intro_b')}<strong>{completedCount}</strong>{t('cert_cta_intro_c')}
        </p>
        <div className="cert-form">
          <label className="cert-input-wrap">
            <span>{t('cert_cta_name_label')}</span>
            <input type="text" value={name} onChange={e => onNameChange(e.target.value.slice(0, 80))} placeholder={t('cert_cta_name_placeholder')} maxLength={80} />
          </label>
          <div className="cert-actions">
            <button className="btn-primary" onClick={onGenerate} disabled={!name.trim() || completedCount === 0}>
              {t('cert_cta_generate')}
            </button>
            <button className="btn-ghost" onClick={onShowSample}>{t('cert_cta_sample')}</button>
          </div>
          {completedCount === 0 && <p className="cert-hint">{t('cert_cta_empty_hint')}</p>}
        </div>
      </div>

      <div className="cert-cta-visual">
        <div className="cert-cta-stack">
          <CertificateMini name={name?.trim() || t('cert_cta_name_placeholder_seal')} />
          <div className="cert-cta-bigseal">
            <Seal certified={true} certifiable={true} size="big" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===================== COURSE LANDING PAGE ===================== */
function CourseLandingPage({ course, state, navigate, onBack }) {
  const t = useT()
  const lang = useLang()
  const certifiable = isCertifiable(course)
  const certified = isCertified(course, { [courseKey(course)]: state })
  const tagBadge = course.contentType === 'course' ? t('cl_tag_course')
    : course.contentType === 'training' ? t('cl_tag_training')
    : course.contentType === 'faq' ? t('cl_tag_faq')
    : t('cl_tag_supplementary')

  const startLabel = course.contentType === 'faq'
    ? (state.watched ? (lang === 'en' ? 'Re-open FAQ collection' : 'FAQ-Sammlung erneut öffnen') : t('cl_open_faq'))
    : (state.watched ? (lang === 'en' ? 'Re-watch course' : 'Kurs erneut ansehen') : t('cl_start_course'))

  const testLabel = state.testPassed
    ? (lang === 'en' ? 'Retake test' : 'Test wiederholen')
    : (lang === 'en' ? 'Start test' : 'Test starten')

  const testDoneLabel = lang === 'en'
    ? `✓ Test passed (${state.testScore}%)`
    : `✓ Test erfolgreich abgeschlossen (${state.testScore}%)`

  return (
    <div className="course-landing">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> {t('cl_back')}</button>
      </div>

      <div className="course-hero">
        <img className="course-hero-img" src={course.thumbnail} alt={course.topic} />
        <div className="course-hero-shade" />
        <div className="course-hero-text">
          <span className="course-hero-cat">{course.category}</span>
          <h1 className="course-hero-title">{course.topic}</h1>
        </div>
      </div>

      <div className="course-body">
        <div className="course-tag-row">
          <span className={`type-pill type-${course.contentType}`}>{tagBadge}</span>
          {certifiable
            ? <span className="cert-info">{t('cl_certifiable_yes')}</span>
            : <span className="cert-info muted">{t('cl_certifiable_no')}</span>}
          {certified && <span className="cert-info success">{t('cl_certified_done')}</span>}
        </div>

        <p className="course-paragraph">{course.longDescription}</p>
        <ContentTags course={course} size="lg" />

        <h3 className="course-bullets-h">{t('cl_bullets_h_prefix')}{tagBadge}{t('cl_bullets_h_suffix')}</h3>
        <ul className="course-bullets">
          {course.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>

        <div className="course-actions">
          <button className="btn-primary big" onClick={() => navigate({ name: 'course-content', courseId: course.id })}>
            ▶ {startLabel}
          </button>
          {certifiable && (
            <div className="course-test-wrap">
              <button className="btn-ghost big" onClick={() => navigate({ name: 'test', courseId: course.id })}>
                ✎ {testLabel}
              </button>
              {state.testPassed && (
                <span className="test-completed">{testDoneLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================== COURSE CONTENT PAGE ===================== */
function VideoBlock({ video, course }) {
  const [playing, setPlaying] = useState(false)
  const t = useT()
  const lang = useLang()
  return (
    <div className="vid-block">
      <div className="vid-frame" onClick={() => setPlaying(true)}>
        <img src={course.thumbnail} alt="" className="vid-thumb" />
        {!playing && (
          <button className="vid-play" aria-label={lang === 'en' ? 'Play' : 'Abspielen'}>
            <Icon.Play />
          </button>
        )}
        {playing && <div className="vid-fake-playing">{lang === 'en' ? '▶ Playback (demo)' : '▶ Wiedergabe (Demo)'}</div>}
        <span className="vid-duration">{video.duration}</span>
      </div>
      <div className="vid-meta">
        <span className="vid-title">{video.title}</span>
        <span className="vid-hint">{t('cc_video_optional')}</span>
      </div>
    </div>
  )
}

function FullVideo({ course, youtubeId, title }) {
  const [playing, setPlaying] = useState(false)
  const [consent, setConsent] = useCookieConsent()
  const lang = useLang()
  const v = course.videos?.[0]
  const yt = youtubeId || course.youtubeId
  const explicitCover = course.coverImage
  const stillSrc = explicitCover
    || (yt ? `https://img.youtube.com/vi/${yt}/maxresdefault.jpg` : course.thumbnail)
  return (
    <div className="cc-video-full" onClick={() => !playing && consent === 'all' && setPlaying(true)}>
      {playing && yt && consent === 'all' ? (
        <iframe
          className="cc-video-iframe"
          src={`https://www.youtube.com/embed/${yt}?${YT_EMBED_PARAMS}`}
          title={title || course.topic}
          frameBorder="0"
          onLoad={ytUnmuteOnLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : consent === 'necessary' && yt ? (
        <YtConsentPlaceholder onAllow={() => setConsent('all')} />
      ) : (
        <>
          <img src={stillSrc} alt="" className="cc-video-thumb"
               onLoad={(e) => {
                 if (!explicitCover && yt && e.target.src.includes('maxresdefault') && e.target.naturalWidth < 320) {
                   e.target.src = `https://img.youtube.com/vi/${yt}/hqdefault.jpg`
                 }
               }}
               onError={(e) => {
                 if (!explicitCover && yt && e.target.src.includes('maxresdefault')) {
                   e.target.src = `https://img.youtube.com/vi/${yt}/hqdefault.jpg`
                 }
               }} />
          {!playing && (
            <button className="cc-video-play" aria-label={lang === 'en' ? 'Play' : 'Abspielen'}>
              <Icon.Play />
            </button>
          )}
          {playing && !yt && <div className="cc-video-fake">{lang === 'en' ? '▶ Playback (demo)' : '▶ Wiedergabe (Demo)'}</div>}
          {!yt && v?.duration && <span className="cc-video-duration">{v.duration}</span>}
        </>
      )}
    </div>
  )
}

/* ===================== FAQ PAGE =====================
   Rendert eine themenklassifizierte FAQ-Sammlung als Accordion.
   Jede Frage ist anklickbar — die Antwort klappt aus.
   Am Ende: PDF-Download der kompletten Sammlung. */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="faq-q-text">{q}</span>
        <span className="faq-q-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  )
}

/* Compact YouTube tile — used for "Weitere relevante Inhalte" section.
   Tile size matches a course-preview tile. Click → inline iframe playback. */
function RelatedVideoTile({ youtubeId, title, coverImage = null }) {
  const [playing, setPlaying] = useState(false)
  // Use explicit coverImage if provided (for unlisted videos whose YouTube
  // thumbnails return 404). Otherwise fall back to YouTube CDN.
  const stillSrc = coverImage || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  return (
    <div className="related-video-tile" onClick={() => !playing && setPlaying(true)}>
      {playing ? (
        <iframe
          className="related-video-iframe"
          src={`https://www.youtube.com/embed/${youtubeId}?${YT_EMBED_PARAMS}`}
          title={title || 'YouTube Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={ytUnmuteOnLoad}
        />
      ) : (
        <>
          <img src={stillSrc} alt="" className="related-video-thumb"
               onLoad={(e) => {
                 if (!coverImage && e.target.src.includes('maxresdefault') && e.target.naturalWidth < 320) {
                   e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                 }
               }}
               onError={(e) => {
                 if (!coverImage && e.target.src.includes('maxresdefault')) {
                   e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                 }
               }} />
          <button className="related-video-play" aria-label="Play video">
            <Icon.Play />
          </button>
        </>
      )}
    </div>
  )
}

function FaqPage({ course, state, onComplete, onBack }) {
  const [expandedAll, setExpandedAll] = useState(false)
  const lang = useLang()
  const L = lang === 'en'
  return (
    <div className="course-content-page faq-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> {L ? 'Back to course overview' : 'Zurück zur Kursübersicht'}</button>
      </div>

      <div className="cc-wrap">
        <div className="cc-title-row">
          <h1 className="cc-title">{course.category}: {course.topic}</h1>
        </div>

        <p className="cc-paragraph">{course.longDescription}</p>

        <div className="faq-toolbar">
          <span className="faq-hint">{L ? 'Click a question to reveal the answer — perfect for self-testing.' : 'Klicke auf eine Frage, um die Antwort einzublenden — perfekt zum Selbsttest.'}</span>
        </div>

        {course.faqGroups?.map((group, gi) => (
          <section key={gi} className="faq-group">
            <h2 className="faq-group-title">{group.title}</h2>
            <div className="faq-list">
              {group.items.map((item, ii) => (
                <FaqItem key={`${gi}-${ii}-${expandedAll}`} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}

        {course.hasDownload && course.documents?.length > 0 && (
          <>
            <h2 className="cc-h">{L ? 'Complete FAQ collection as PDF' : 'Komplette FAQ-Sammlung als PDF'}</h2>
            <p className="cc-paragraph">
              {L
                ? 'Download the entire collection as a Novogenia/Novodaily-branded PDF — perfect as a reference for consultation sessions or for printing.'
                : 'Lade die gesamte Sammlung als Novogenia/Novodaily-gebrandetes PDF herunter — ideal als Nachschlagewerk für Beratungsgespräche oder zum Ausdrucken.'}
            </p>
            <div className="cc-docs">
              {course.documents.map((d, i) => {
                const ext = (d.type || '').toUpperCase() || 'PDF'
                const Wrapper = d.url ? 'a' : 'div'
                const wrapProps = d.url
                  ? { href: d.url, download: '', target: '_blank', rel: 'noopener noreferrer' }
                  : { onClick: (e) => e.preventDefault() }
                return (
                  <Wrapper key={i} className="cc-doc" {...wrapProps}>
                    {d.thumbnail
                      ? <img className="cc-doc-thumb" src={d.thumbnail} alt="" />
                      : (d.type === 'pdf' && d.url)
                      ? <PdfThumb url={d.url} />
                      : null /* no preview available — render nothing instead of placeholder icon */}
                    <span className="cc-doc-text">
                      <span className="cc-doc-title">{d.title}</span>
                      <span className="cc-doc-meta">{ext}{d.size && d.size !== 'PDF' ? ` · ${d.size}` : ''}</span>
                    </span>
                    <span className="cc-doc-action"><Icon.Download /></span>
                  </Wrapper>
                )
              })}
            </div>
          </>
        )}

        <div className="cc-complete">
          {state.watched
            ? <p className="cc-already">{L ? 'You have already gone through this FAQ collection.' : 'Du hast diese FAQ-Sammlung bereits durchgesehen.'}</p>
            : <p className="cc-prompt">{L ? 'When you have gone through all questions, you can mark the module as viewed.' : 'Wenn du alle Fragen durchgegangen bist, kannst du das Modul als angesehen markieren.'}</p>}
          <div className="cc-actions-row">
            <button className="cc-action-btn" onClick={onComplete}>
              <span className="cc-action-icon"><Icon.Cap /></span>
              <span className="cc-action-text">
                <span className="cc-action-title">{L ? 'Complete module' : 'Modul abschließen'}</span>
                <span className="cc-action-sub">{L ? 'Mark the FAQ collection as viewed' : 'Markiere die FAQ-Sammlung als durchgesehen'}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseContentPage({ course, state, onComplete, onBack, onStartTest }) {
  const lang = useLang()
  const L = lang === 'en'
  // CATEGORY_CONTENT is only keyed for German categories. For EN courses
  // (which always use introText/introQuestions), this lookup returns {} and is unused.
  const content = CATEGORY_CONTENT[course.category] || {}
  // Per-course introText / introQuestions overrides the generic "Warum Gene…" block
  const useIntroText = !!course.introText || !!course.introQuestions
  const certifiable = isCertifiable(course)
  return (
    <div className="course-content-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> {L ? 'Back to course overview' : 'Zurück zur Kursübersicht'}</button>
      </div>

      <div className="cc-wrap">
        <div className="cc-title-row">
          <h1 className="cc-title">{course.category}: {course.topic}</h1>
          {certifiable && (
            <div className="cc-cert-badge">
              <Seal certified={false} certifiable={true} />
              <span className="cc-cert-label">{L ? 'CERTIFIABLE COURSE' : 'ZERTIFIZIERBARER KURS'}</span>
            </div>
          )}
        </div>

        {useIntroText ? (
          <>
            {course.introQuestionsHeader && (
              <p className="cc-paragraph"><strong>{course.introQuestionsHeader}</strong></p>
            )}
            {course.introQuestions && (
              <ul className="cc-question-list">
                {course.introQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            )}
            {course.introText && <p className="cc-paragraph">{course.introText}</p>}
          </>
        ) : (
          <>
            {content.whyHeading && <h2 className="cc-h">{content.whyHeading}</h2>}
            {content.whyText && <p className="cc-paragraph">{content.whyText}</p>}
          </>
        )}

        {course.brandNoticeAboveVideos && <BrandNotice />}

        {course.articleSections?.length ? (
          // Text-based training (no video) — render structured article sections
          course.articleSections.map((sec, i) => {
            // Normalise callout: accept string or {text, tone}
            const callout = sec.callout
              ? (typeof sec.callout === 'string' ? { text: sec.callout, tone: 'neutral' } : sec.callout)
              : null
            const calloutLabel = callout && (L
              ? (callout.tone === 'safe' ? 'SAFE'
                : callout.tone === 'critical' ? 'CRITICAL'
                : callout.tone === 'caveat' ? 'WITH DISCLAIMER'
                : 'IMPORTANT')
              : (callout.tone === 'safe' ? 'SICHER'
                : callout.tone === 'critical' ? 'KRITISCH'
                : callout.tone === 'caveat' ? 'MIT DISCLAIMER'
                : 'WICHTIG')
            )
            return (
            <section key={i} className="cc-article-section">
              {sec.title && <h2 className="cc-h">{sec.title}</h2>}
              {sec.paragraphs?.map((p, j) => <p key={j} className="cc-paragraph">{p}</p>)}
              {sec.bullets?.length > 0 && (
                <ul className="cc-question-list">
                  {sec.bullets.map((b, j) => {
                    // Bullet can be a string (neutral) or { text, tone }
                    const norm = typeof b === 'string' ? { text: b, tone: 'neutral' } : b
                    const cls = norm.tone && norm.tone !== 'neutral' ? `cc-bullet-${norm.tone}` : ''
                    return <li key={j} className={cls}>{norm.text}</li>
                  })}
                </ul>
              )}
              {callout && (
                <aside className={`cc-article-callout tone-${callout.tone || 'neutral'}`}>
                  <div className="cc-article-callout-label">{calloutLabel}</div>
                  <div className="cc-article-callout-text">{callout.text}</div>
                </aside>
              )}
            </section>
            )
          })
        ) : course.videoSegments?.length ? (
          // Multi-chapter consultation course — render each video as its own segment
          course.videoSegments.map((seg, i) => (
            <section key={i} className="cc-video-segment">
              {seg.title && <h2 className="cc-h">{seg.title}</h2>}
              {seg.description && <p className="cc-paragraph">{seg.description}</p>}
              <FullVideo course={course} youtubeId={seg.youtubeId} title={seg.title} />
            </section>
          ))
        ) : course.youtubeId ? (
          <FullVideo course={course} />
        ) : (
          // No video available — show a notice instead of an unclickable empty player.
          <aside className="brand-notice">
            <div className="brand-notice-icon"><Icon.Info /></div>
            <div className="brand-notice-body">
              <div className="brand-notice-title">{L ? 'VIDEO COMING SOON' : 'VIDEO IN VORBEREITUNG'}</div>
              <p className="brand-notice-text">
                {L
                  ? 'A dedicated English video for this module has not been recorded yet. The training content and test below remain fully functional — the video segment will be added as soon as the recording is available.'
                  : 'Ein passendes Video für dieses Modul ist noch in Vorbereitung. Die Inhalte und der Test funktionieren bereits vollständig — der Video-Block wird ergänzt, sobald die Aufnahme verfügbar ist.'}
              </p>
            </div>
          </aside>
        )}

        {course.postVideoText && <p className="cc-paragraph">{course.postVideoText}</p>}

        {!useIntroText && content.moreText && <p className="cc-paragraph">{content.moreText}</p>}

        {!useIntroText && content.resultsHeading && <h2 className="cc-h">{content.resultsHeading}</h2>}
        {!useIntroText && content.resultsText && <p className="cc-paragraph">{content.resultsText}</p>}

        {course.hasDownload && (
          <>
            <h2 className="cc-h">{L ? 'Documents to take with you' : 'Dokumente zum Mitnehmen'}</h2>
            {course.brandNoticeAboveDownloads && <BrandNotice />}
            <div className="cc-docs">
              {course.documents.map((d, i) => {
                const ext = (d.type || '').toUpperCase() || 'PDF'
                const Wrapper = d.url ? 'a' : 'div'
                const wrapProps = d.url
                  ? { href: d.url, download: '', target: '_blank', rel: 'noopener noreferrer' }
                  : { onClick: (e) => e.preventDefault() }
                return (
                  <Wrapper key={i} className="cc-doc" {...wrapProps}>
                    {d.thumbnail
                      ? <img className="cc-doc-thumb" src={d.thumbnail} alt="" />
                      : (d.type === 'pdf' && d.url)
                      ? <PdfThumb url={d.url} />
                      : null /* no preview available — render nothing instead of placeholder icon */}
                    <span className="cc-doc-text">
                      <span className="cc-doc-title">{d.title}</span>
                      <span className="cc-doc-meta">{ext} · {d.size}</span>
                    </span>
                    <span className="cc-doc-action"><Icon.Download /></span>
                  </Wrapper>
                )
              })}
            </div>
          </>
        )}

        <div className="cc-complete">
          {state.watched
            ? <p className="cc-already">{L ? 'You have already successfully completed this module.' : 'Du hast dieses Modul bereits erfolgreich abgeschlossen.'}</p>
            : <p className="cc-prompt">{L ? 'When you have watched all relevant content, complete the module and take your test.' : 'Wenn du alle relevanten Inhalte angesehen hast, schließe das Modul ab und lege deinen Test ab.'}</p>}
          <div className="cc-actions-row">
            <button className="cc-action-btn" onClick={onComplete}>
              <span className="cc-action-icon"><Icon.Cap /></span>
              <span className="cc-action-text">
                <span className="cc-action-title">{L ? 'Complete training' : 'Training abschließen'}</span>
                <span className="cc-action-sub">{L ? 'Mark this module as successfully completed' : 'Markiere dieses Modul als erfolgreich abgeschlossen'}</span>
              </span>
            </button>
            {isCertifiable(course) && onStartTest && (
              <button className="cc-action-btn cc-action-btn-alt" onClick={onStartTest}>
                <span className="cc-action-icon"><Icon.Quiz /></span>
                <span className="cc-action-text">
                  <span className="cc-action-title">{L ? 'Start the test' : 'Test beginnen'}</span>
                  <span className="cc-action-sub">{L ? 'Prove your knowledge and secure your certificate' : 'Stelle dein Wissen unter Beweis und sichere dein Zertifikat'}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================== TEST PAGE ===================== */

/* Reusable demo "Genreport" image — shown above the first question for demo purposes */
function GenReportDemo({ title = 'Fettempfindlichkeit hoch', position = 20, text }) {
  return (
    <div className="test-img-demo">
      <h3>{title}</h3>
      <div className="test-img-bar">
        <div className="test-img-marker" style={{ left: `${position}%` }} />
      </div>
      <p>{text}</p>
    </div>
  )
}

function TestPage({ course, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({})
  const lang = useLang()
  const L = lang === 'en'

  const submit = () => {
    if (Object.keys(answers).length < course.questions.length) {
      if (!confirm(L
        ? 'You haven\'t answered all questions. Submit anyway?'
        : 'Du hast nicht alle Fragen beantwortet. Trotzdem abgeben?')) return
    }
    let correct = 0
    course.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    const score = Math.round((correct / course.questions.length) * 100)
    const passed = score >= 80
    onSubmit({ score, passed })
  }

  return (
    <div className="test-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> {L ? 'Back to course overview' : 'Zurück zur Kursübersicht'}</button>
      </div>

      <div className="cc-wrap">
        <h1 className="cc-title">{L ? 'Test' : 'Test'}: {course.category}: {course.topic}</h1>
        <p className="cc-sub">
          {L ? (
            <>Answer all questions in a single attempt. Pass threshold: <strong>80&nbsp;% correct answers</strong>. After submission you will only receive the overall result (no per-question breakdown).</>
          ) : (
            <>Beantworte alle Fragen in einem Durchgang. Bestehensgrenze: <strong>80&nbsp;% korrekte Antworten</strong>. Du erhältst nach Abgabe nur das Gesamtergebnis (keine Einzelauflösung).</>
          )}
        </p>

        <div className="test-questions">
          {course.questions.map((q, qi) => {
            let visual = null
            if (q.screenshot) {
              visual = <img src={q.screenshot} alt="" className="test-q-screenshot" />
            } else if (q.screenshotNote) {
              visual = <div className="test-q-screenshot-placeholder">📷 {L ? 'Screenshot coming' : 'Screenshot folgt'} — {q.screenshotNote}</div>
            } else if (q.image) {
              visual = q.image
            }
            return (
              <fieldset key={qi} className="test-q">
                <legend className="test-q-legend"><span className="test-q-no">{L ? 'Question' : 'Frage'} {qi + 1}</span> {q.q}</legend>
                {visual && <div className="test-q-image">{visual}</div>}
                <div className="test-options">
                  {q.options.map((o, oi) => (
                    <label key={oi} className={`test-opt${answers[qi] === oi ? ' is-selected' : ''}`}>
                      <input type="radio" name={`q-${qi}`} checked={answers[qi] === oi}
                             onChange={() => setAnswers(a => ({ ...a, [qi]: oi }))} />
                      <span className="test-opt-letter">{String.fromCharCode(65 + oi)}</span>
                      <span className="test-opt-text">{o}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>

        <div className="test-submit">
          <button className="btn-primary big" onClick={submit}>
            {L
              ? `Finish test (${Object.keys(answers).length}/${course.questions.length} answered)`
              : `Test abschließen (${Object.keys(answers).length}/${course.questions.length} beantwortet)`}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================== TEST RESULT ===================== */
function TestResultPage({ course, score, passed, navigate, onBack }) {
  const lang = useLang()
  const L = lang === 'en'
  return (
    <div className="test-result">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> {L ? 'Back to course overview' : 'Zurück zur Kursübersicht'}</button>
      </div>

      <div className="tr-card">
        <div className={`tr-score-ring${passed ? ' passed' : ' failed'}`}>
          <svg viewBox="0 0 120 120" className="tr-ring">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#eee" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                    stroke={passed ? '#18A455' : '#B61E58'}
                    strokeDasharray={`${(score / 100) * 339.29} 339.29`}
                    transform="rotate(-90 60 60)" />
          </svg>
          <div className="tr-score-num">{score}<span>%</span></div>
        </div>

        <h1 className={`tr-h ${passed ? 'pass' : 'fail'}`}>
          {passed ? (L ? 'Passed!' : 'Bestanden!') : (L ? 'Unfortunately not passed' : 'Leider nicht bestanden')}
        </h1>
        <p className="tr-msg">
          {passed
            ? (L
                ? `You passed the "${course.topic}" test with ${score}%. The module is now marked as "Certified".`
                : `Du hast den Test zu „${course.topic}" mit ${score}% erfolgreich bestanden. Das Modul ist ab sofort als „Zertifiziert" markiert.`)
            : (L
                ? `You achieved ${score}% correct answers. At least 80% is required to pass. Review the course once more and try again.`
                : `Du hast ${score}% korrekte Antworten erreicht. Zum Bestehen sind mindestens 80% erforderlich. Schau dir den Kurs noch einmal an und versuche es erneut.`)}
        </p>

        <div className="tr-actions">
          {passed
            ? (<>
                <button className="btn-primary big" onClick={onBack}>{L ? 'To course overview' : 'Zur Kursübersicht'}</button>
                <button className="btn-ghost big" onClick={() => navigate({ name: 'home' })}>{L ? 'All courses' : 'Alle Kurse'}</button>
              </>)
            : (<>
                <button className="btn-primary big" onClick={() => navigate({ name: 'test', courseId: course.id })}>{L ? 'Try again' : 'Erneut versuchen'}</button>
                <button className="btn-ghost big" onClick={() => navigate({ name: 'course-content', courseId: course.id })}>{L ? 'Review course' : 'Kurs nochmal ansehen'}</button>
              </>)}
        </div>
      </div>
    </div>
  )
}

/* ===================== CERTIFICATE PAGE ===================== */
function Signature() {
  const [err, setErr] = useState(false)
  if (err) return <span className="sig-empty" aria-hidden="true" />
  return <img className="sig-img" src={assetUrl("/signature.png")} alt="Dr. Daniel Wallerstorfer" onError={() => setErr(true)} />
}

const formatDateDE = (d = new Date()) =>
  d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
const formatDateEN = (d = new Date()) =>
  d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
const formatDate = (lang, d) => lang === 'en' ? formatDateEN(d) : formatDateDE(d)

/* Novogenia logo — uses /novogenia-logo.png if dropped in /public, otherwise inline SVG fallback */
function NovogeniaLogo({ className = '' }) {
  const [err, setErr] = useState(false)
  if (!err) {
    return (
      <img
        className={`ng-logo-img ${className}`}
        src={assetUrl("/novogenia-logo.png")}
        alt="Novogenia"
        onError={() => setErr(true)}
      />
    )
  }
  return (
    <div className={`ng-logo ${className}`}>
      <svg viewBox="0 0 56 56" className="ng-logo-mark" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="52" height="52" rx="9" fill="none" stroke="#C8D44A" strokeWidth="3.5"/>
        <path d="M16 41 V18 L40 41 V18" stroke="#1a1a1a" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ng-logo-word">novogenia</span>
    </div>
  )
}

/* Faux QR code (decorative) */
function FauxQR({ size = 88 }) {
  const N = 17
  let seed = 12345
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const cells = []
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const isFinder =
        (x < 7 && y < 7) ||
        (x >= N - 7 && y < 7) ||
        (x < 7 && y >= N - 7)
      if (isFinder) {
        const lx = x < 7 ? x : x - (N - 7)
        const ly = y < 7 ? y : y - (N - 7)
        const onBorder = lx === 0 || lx === 6 || ly === 0 || ly === 6
        const onInner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
        if (onBorder || onInner) cells.push([x, y])
      } else if (rand() > 0.55) {
        cells.push([x, y])
      }
    }
  }
  const cell = size / N
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="cert-qr-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width={size} height={size} fill="#fff"/>
      {cells.map(([x, y], i) => (
        <rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill="#1a1a1a"/>
      ))}
    </svg>
  )
}

function CertificatePage({ name, courses, isSample, onBack }) {
  const lang = useLang()
  const t = useT()
  const L = lang === 'en'
  const fallbackName = L ? 'Jane Doe' : 'Maria Mustermann'
  const dateStr = formatDate(lang, isSample ? new Date(2026, 4, 5) : new Date())
  const [downloading, setDownloading] = useState(false)

  const downloadPdf = async () => {
    setDownloading(true)
    try {
      await downloadCertificate({ name: name || fallbackName, courses, dateStr, lang })
    } catch (err) {
      console.error('PDF generation failed', err)
      alert(L ? 'Failed to generate the PDF. Please try again.' : 'PDF konnte nicht erstellt werden. Bitte erneut versuchen.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="cert-view">
      <div className="cert-toolbar">
        <button className="btn-ghost" onClick={onBack}><Icon.ChevronLeft /> {L ? 'Back' : 'Zurück'}</button>
        <div className="cert-toolbar-spacer" />
        {isSample && <span className="sample-badge">{L ? 'EXAMPLE' : 'BEISPIEL'}</span>}
        <button className="btn-primary" onClick={downloadPdf} disabled={downloading}>
          <Icon.Download /> {downloading ? (L ? 'Generating...' : 'Wird erstellt...') : (L ? 'Download as PDF' : 'Als PDF herunterladen')}
        </button>
      </div>

      <div className="cert-canvas">
        <div className="certificate" id="certificate-print">
          {/* The on-screen certificate now uses the actual PDF as background.
              Logo, signature, wine wedge — all baked into cert-template.pdf. */}
          <CertTemplateBg />

          <div className="cert-content">
            <p className="cert-novo">NOVOGENIA</p>
            <p className="cert-coach">{t('cert_mini_genetik_coach')}</p>

            {/* Recipient block */}
            <p className="cert-confirm">{t('certpage_presented_to')}</p>
            <p className="cert-name">{name}</p>

            {/* Date sentence */}
            <p className="cert-completion-text">
              {t('certpage_completed_on')} <strong>{dateStr}</strong>{t('certpage_completed_suffix')}
            </p>

            {/* Module list — SemiBold category + Light topic */}
            <ul className="cert-modules">
              {courses.map((c, i) => {
                const idx = c.indexOf(': ')
                const cat = idx > -1 ? c.slice(0, idx) : c
                const topic = idx > -1 ? c.slice(idx + 2) : ''
                return (
                  <li key={i}>
                    <span className="cert-mod-cat">{cat}{topic ? ':' : ''}</span>
                    {topic && <> <span className="cert-mod-topic">{topic}</span></>}
                  </li>
                )
              })}
            </ul>

          </div>

          {/* "Dr. Daniel Wallerstorfer" is already baked into the template; we only add the role line */}
          <div className="cert-sig-block">
            <div className="cert-sig-role">{L ? 'CEO of Novogenia' : 'CEO von Novogenia'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================== APP ===================== */

/* User-state persistence
   ----------------------
   The per-course progress (watched / testPassed / testScore / …) is keyed
   by the COURSE'S STABLE UID — never by the human-readable slug. That way
   renaming a slug in data.js does NOT lose user completion data.

   Migration: legacy state (keyed by slug) is detected on first load and
   automatically migrated to uid-keying via the current COURSES lookup. */
const STATE_KEY = 'novoacademy_user_state'

const loadUserState = () => {
  const fresh = buildInitialState()
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return fresh
    const stored = JSON.parse(raw)
    // Build slug→uid map to detect+migrate legacy keys
    const slugToUid = {}
    for (const c of COURSES) if (c.uid) slugToUid[c.id] = c.uid
    const merged = { ...fresh }
    for (const [k, v] of Object.entries(stored)) {
      // If the key matches an existing uid, use as-is.
      // If it matches a legacy slug, migrate to that course's uid.
      const targetKey = (k in fresh) ? k : (slugToUid[k] || null)
      if (targetKey) merged[targetKey] = { ...merged[targetKey], ...v }
    }
    return merged
  } catch {
    return fresh
  }
}

const saveUserState = (state) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)) } catch {}
}

const LANG_KEY = 'novoacademy_lang'
const LANG_CHOSEN_KEY = 'novoacademy_lang_chosen'   // marker so we know lang-pick was done
const loadLang = () => {
  try { return localStorage.getItem(LANG_KEY) || 'de' } catch { return 'de' }
}
const hasChosenLang = () => {
  try { return localStorage.getItem(LANG_CHOSEN_KEY) === '1' } catch { return false }
}

export default function App() {
  // ---- Outer flow ----
  // Phase: 'lang-pick' (first visit) → 'landing' (intro) → 'auth' (signup/login) → 'app' (logged-in academy)
  const [langChosen, setLangChosen] = useState(hasChosenLang)
  const [session, setSession] = useState(() => getCurrentSession())
  const [profile, setProfile] = useState(null)
  const [outerRoute, setOuterRoute] = useState(null) // null = derived from phase; otherwise 'landing'|'auth-signup'|'auth-login'|'impressum'|'datenschutz'
  const [authBusy, setAuthBusy] = useState(false)
  const [consent, setConsent] = useCookieConsent()
  const showBanner = consent === null

  // Subscribe to auth changes (Supabase session + mock session)
  useEffect(() => {
    const unsub = onAuthChange((s) => setSession(s))
    return unsub
  }, [])

  // When logged in, load the user's profile (so we know if they're admin)
  useEffect(() => {
    if (!session?.user?.id) { setProfile(null); return }
    let cancelled = false
    ;(async () => {
      const p = await getMyProfile()
      if (!cancelled) setProfile(p)
    })()
    return () => { cancelled = true }
  }, [session?.user?.id])

  // ---- Inner academy state ----
  const [route, setRoute] = useState({ name: 'home' })
  const [courseState, setCourseState] = useState({})
  const [certName, setCertName] = useState('')
  const [lastTestResult, setLastTestResult] = useState(null)
  const [lang, setLangState] = useState(loadLang)

  const setLang = (newLang) => {
    setLangState(newLang)
    try {
      localStorage.setItem(LANG_KEY, newLang)
      localStorage.setItem(LANG_CHOSEN_KEY, '1')
    } catch {}
    setLangChosen(true)
    // Persist to user profile (for admin language stats)
    updateMyLang(newLang).catch(() => {})
  }
  useEffect(() => { try { localStorage.setItem(LANG_KEY, lang) } catch {} }, [lang])

  // Set <html lang> attribute for screen readers (must come after `lang` is declared)
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'de'
  }, [lang])

  // Track whether the remote load has finished — guard writes until then
  // so we don't overwrite local edits made before load resolves,
  // and so we don't immediately upsert the just-loaded data.
  const progressLoadedRef = useRef(false)
  const saveTimerRef = useRef(null)

  // Load per-user progress when session becomes available
  useEffect(() => {
    if (!session?.user?.id) {
      progressLoadedRef.current = false
      setCourseState({})
      return
    }
    let cancelled = false
    progressLoadedRef.current = false
    ;(async () => {
      const remote = await loadProgress(session.user.id)
      if (cancelled) return
      // Merge initial defaults with remote, then preserve any local edits
      // made BEFORE the load finished (e.g. user marked a course complete fast)
      const fresh = buildInitialState()
      const merged = { ...fresh }
      for (const [k, v] of Object.entries(remote || {})) {
        merged[k] = { ...merged[k], ...v }
      }
      setCourseState(local => {
        const out = { ...merged }
        for (const [k, v] of Object.entries(local || {})) {
          // Local watched/passed wins (user explicitly did it during load)
          if (v?.watched || v?.testPassed) {
            out[k] = { ...out[k], ...v }
          }
        }
        return out
      })
      // Only fill cert name if user hasn't already typed one
      // Pre-fill the certificate name with a nicely capitalised version,
      // never with the raw email. Don't overwrite if the user already typed
      // something themselves.
      setCertName(prev => prev || bestDisplayName(session.profile?.name, session.user?.email))
      progressLoadedRef.current = true
    })()
    return () => { cancelled = true }
  }, [session?.user?.id])

  // Persist progress — debounced, only after the initial load has resolved
  useEffect(() => {
    if (!session?.user?.id) return
    if (!progressLoadedRef.current) return
    if (Object.keys(courseState).length === 0) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveProgress(session.user.id, courseState)
    }, 800)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [courseState, session?.user?.id])

  // Browser / phone Back-button support: mirror in-app navigation into the
  // History API so Back and Forward move between app screens instead of leaving
  // the site. The URL stays the same (GitHub Pages has no SPA server routing);
  // the route object is stashed in history.state and restored on popstate.
  const navigate = (r) => {
    window.scrollTo(0, 0)
    try { window.history.pushState({ __novoRoute: r }, '') } catch {}
    setRoute(r)
  }

  const routeRef = useRef(route)
  routeRef.current = route
  useEffect(() => {
    // Seed the current history entry so the first Back returns here, not off-site.
    try { window.history.replaceState({ __novoRoute: routeRef.current }, '') } catch {}
    const onPop = (e) => {
      const r = e.state && e.state.__novoRoute
      window.scrollTo(0, 0)
      setRoute(r || { name: 'home' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const markCompleted = (course) => {
    const k = courseKey(course)
    setCourseState(s => ({ ...s, [k]: { ...s[k], watched: true } }))
  }
  const recordTest = (course, score, passed) => {
    const k = courseKey(course)
    setCourseState(s => ({ ...s, [k]: { ...s[k], testScore: score, testPassed: passed || s[k]?.testPassed } }))
  }

  const courseById = (id) => COURSES.find(c => c.id === id)

  const certifiedCourses = useMemo(() =>
    COURSES.filter(c => isCertified(c, courseState)).map(c => `${c.category}: ${c.topic}`),
  [courseState])

  const sampleName = lang === 'en' ? 'Jane Doe' : 'Maria Mustermann'

  /* ===== Decide which top-level screen to render ===== */
  let page

  const legalFooterProps = {
    onImpressum:     () => setOuterRoute('impressum'),
    onDatenschutz:   () => setOuterRoute('datenschutz'),
    onCookieSettings:() => setConsent(null),
  }

  if (outerRoute === 'impressum') {
    page = (
      <div className="legal-page-wrap">
        <ImpressumPage onBack={() => setOuterRoute(null)} />
        <LegalFooter {...legalFooterProps} />
      </div>
    )
  } else if (outerRoute === 'datenschutz') {
    page = (
      <div className="legal-page-wrap">
        <DatenschutzPage onBack={() => setOuterRoute(null)} onCookieSettings={() => setConsent(null)} />
        <LegalFooter {...legalFooterProps} />
      </div>
    )
  } else if (!langChosen) {
    page = <LangPickPage onPick={(l) => setLang(l)} />
  } else if (!session) {
    // Not logged in — show landing or auth
    const mode = outerRoute === 'auth-signup' ? 'signup'
              : outerRoute === 'auth-login'  ? 'login'
              : 'landing'
    if (mode === 'landing') {
      page = (
        <LandingPage
          lang={lang}
          setLang={setLang}
          onSignUp={() => setOuterRoute('auth-signup')}
          onLogIn={() => setOuterRoute('auth-login')}
          onImpressum={legalFooterProps.onImpressum}
          onDatenschutz={legalFooterProps.onDatenschutz}
          onCookieSettings={legalFooterProps.onCookieSettings}
        />
      )
    } else {
      page = (
        <AuthPage
          mode={mode}
          lang={lang}
          setLang={setLang}
          busy={authBusy}
          setBusy={setAuthBusy}
          onSwitchMode={() => setOuterRoute(mode === 'signup' ? 'auth-login' : 'auth-signup')}
          onBackToLanding={() => setOuterRoute('landing')}
        />
      )
    }
  } else if (route.name === 'course-landing') {
    const course = courseById(route.courseId)
    page = <CourseLandingPage course={course} state={courseState[courseKey(course)] || {}} navigate={navigate} onBack={() => navigate({ name: 'home' })} />
  } else if (route.name === 'course-content') {
    const course = courseById(route.courseId)
    if (course.contentType === 'faq') {
      page = <FaqPage course={course} state={courseState[courseKey(course)] || {}}
        onComplete={() => { markCompleted(course); navigate({ name: 'course-landing', courseId: course.id }) }}
        onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
    } else {
      page = <CourseContentPage course={course} state={courseState[courseKey(course)] || {}}
        onComplete={() => { markCompleted(course); navigate({ name: 'course-landing', courseId: course.id }) }}
        onStartTest={() => navigate({ name: 'test', courseId: course.id })}
        onBack={() => navigate({ name: 'course-landing', courseId: course.id })}
        navigate={navigate} />
    }
  } else if (route.name === 'test') {
    const course = courseById(route.courseId)
    page = <TestPage course={course}
      onSubmit={({ score, passed }) => {
        recordTest(course, score, passed)
        setLastTestResult({ courseId: course.id, score, passed })
        navigate({ name: 'test-result', courseId: course.id })
      }}
      onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
  } else if (route.name === 'test-result') {
    const course = courseById(route.courseId)
    page = <TestResultPage course={course} score={lastTestResult?.score || 0} passed={lastTestResult?.passed || false}
      navigate={navigate} onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
  } else if (route.name === 'certificate') {
    page = <CertificatePage name={route.isSample ? sampleName : certName}
      courses={route.isSample ? getSampleCourseList(lang) : certifiedCourses}
      isSample={route.isSample} onBack={() => navigate({ name: 'home' })} />
  } else if (route.name === 'admin' && profile?.is_admin) {
    page = (
      <div className="app no-sidebar">
        <main className="main" id="main-content">
          <TopBar lang={lang} setLang={setLang} session={session} profile={profile} navigate={navigate} />
          <AdminPage onBack={() => navigate({ name: 'home' })} />
        </main>
        <LegalFooter {...legalFooterProps} />
      </div>
    )
  } else {
    page = (
      <div className="app no-sidebar">
        <main className="main" id="main-content">
          <TopBar lang={lang} setLang={setLang} session={session} profile={profile} navigate={navigate} />
          <HomePage
            courseState={courseState}
            navigate={navigate}
            certName={certName}
            setCertName={setCertName}
            completedCertifiableCount={certifiedCourses.length}
            certifiedTitles={certifiedCourses}
            lang={lang}
          />
        </main>
        <LegalFooter {...legalFooterProps} />
      </div>
    )
  }

  return (
    <LangContext.Provider value={lang}>
      <a className="skip-to-content" href="#main-content">
        {lang === 'en' ? 'Skip to content' : 'Zum Inhalt springen'}
      </a>
      {page}
      {showBanner && (
        <CookieBanner
          onAccept={() => setConsent('all')}
          onNecessary={() => setConsent('necessary')}
          onOpenPrivacy={() => setOuterRoute('datenschutz')}
        />
      )}
    </LangContext.Provider>
  )
}

/* ===================== TOP BAR ===================== */
function TopBar({ lang, setLang, session, profile, navigate }) {
  const t = useT()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const isAdmin = Boolean(profile?.is_admin)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  return (
    <div className="topbar">
      <div className="page-title">
        <h1 className="page-title-logo"><span className="pt-novo">NOVO</span><span className="pt-academy">ACADEMY</span></h1>
      </div>
      <div className="topbar-actions">
        {lang && setLang && (
          <div className="lang-switcher" title="Language / Sprache">
            <button
              className={`lang-btn${lang === 'de' ? ' is-active' : ''}`}
              onClick={() => setLang('de')}
            >DE</button>
            <button
              className={`lang-btn${lang === 'en' ? ' is-active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
          </div>
        )}
        {isAdmin && navigate && (
          <button
            className="admin-gear-btn"
            onClick={() => navigate({ name: 'admin' })}
            aria-label={t('admin_title')}
            title={t('admin_title')}
          >
            <Icon.Gear />
          </button>
        )}
        {session && (() => {
          const displayName = bestDisplayName(session.profile?.name, session.user?.email)
          return (
          <div className="user-menu" ref={menuRef}>
            <button className="user-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-haspopup="true" aria-expanded={menuOpen}>
              <span className="user-menu-avatar">{(displayName || '?').charAt(0).toUpperCase()}</span>
              <span className="user-menu-name">{displayName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {menuOpen && (
              <div className="user-menu-pop" role="menu">
                <div className="user-menu-pop-label">{t('user_signed_in_as')}</div>
                <div className="user-menu-pop-email">{session.user?.email}</div>
                <button className="user-menu-pop-action" onClick={() => { setMenuOpen(false); signOut() }}>
                  {t('user_logout')}
                </button>
              </div>
            )}
          </div>
          )
        })()}
      </div>
    </div>
  )
}

/* ===================== LANGUAGE PICKER (first visit) ===================== */
function LangPickPage({ onPick }) {
  return (
    <div className="langpick-page">
      <div className="langpick-card">
        <div className="langpick-logo">
          <span className="pt-novo">NOVO</span><span className="pt-academy">ACADEMY</span>
        </div>
        <h2 className="langpick-title">Choose your language · Sprache wählen</h2>
        <p className="langpick-sub">You can change this later. · Du kannst dies später ändern.</p>
        <div className="langpick-options">
          <button className="langpick-option" onClick={() => onPick('de')}>
            <span className="langpick-flag" aria-hidden="true">🇩🇪</span>
            <span className="langpick-label">Deutsch</span>
          </button>
          <button className="langpick-option" onClick={() => onPick('en')}>
            <span className="langpick-flag" aria-hidden="true">🇬🇧</span>
            <span className="langpick-label">English</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================== LANDING PAGE (logged-out intro) ===================== */
function LandingPage({ lang, setLang, onSignUp, onLogIn, onImpressum, onDatenschutz, onCookieSettings }) {
  const t = useT()
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <span className="pt-novo">NOVO</span><span className="pt-academy">ACADEMY</span>
          </div>
          <div className="landing-header-right">
            <div className="lang-switcher" title="Language / Sprache">
              <button className={`lang-btn${lang === 'de' ? ' is-active' : ''}`} onClick={() => setLang('de')}>DE</button>
              <button className={`lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="btn-ghost landing-login-btn" onClick={onLogIn}>{t('landing_cta_login')}</button>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-inner">
          <h1 className="landing-hero-title">{t('landing_hero_title')}</h1>
          <p className="landing-hero-sub">{t('landing_hero_sub')}</p>
          <div className="landing-hero-cta">
            <button className="btn-primary big landing-signup-btn" onClick={onSignUp}>{t('landing_cta_signup')}</button>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-features-grid">
          <article className="landing-feature">
            <div className="landing-feature-ico"><Icon.Cap /></div>
            <h3>{t('landing_feature_videos_t')}</h3>
            <p>{t('landing_feature_videos_d')}</p>
          </article>
          <article className="landing-feature">
            <div className="landing-feature-ico"><Icon.CertIcon /></div>
            <h3>{t('landing_feature_certs_t')}</h3>
            <p>{t('landing_feature_certs_d')}</p>
          </article>
          <article className="landing-feature">
            <div className="landing-feature-ico"><Icon.Check /></div>
            <h3>{t('landing_feature_progress_t')}</h3>
            <p>{t('landing_feature_progress_d')}</p>
          </article>
          <article className="landing-feature">
            <div className="landing-feature-ico"><Icon.Play /></div>
            <h3>{t('landing_feature_pace_t')}</h3>
            <p>{t('landing_feature_pace_d')}</p>
          </article>
        </div>
      </section>

      <section className="landing-who">
        <div className="landing-who-inner">
          <h2 className="landing-who-title">{t('landing_who_title')}</h2>
          <ul className="landing-who-list">
            <li>{t('landing_who_resellers')}</li>
            <li>{t('landing_who_pros')}</li>
            <li>{t('landing_who_curious')}</li>
          </ul>
        </div>
      </section>

      <section className="landing-final-cta">
        <h2>{t('landing_hero_title')}</h2>
        <button className="btn-primary big landing-signup-btn" onClick={onSignUp}>{t('landing_cta_signup')}</button>
      </section>

      <footer className="landing-footer">
        <LegalFooter
          onImpressum={onImpressum}
          onDatenschutz={onDatenschutz}
          onCookieSettings={onCookieSettings}
        />
      </footer>
    </div>
  )
}

/* ===================== LEGAL FOOTER ===================== */
function LegalFooter({ onImpressum, onDatenschutz, onCookieSettings }) {
  const t = useT()
  return (
    <footer className="legal-footer">
      <span>© {new Date().getFullYear()} Novogenia GmbH</span>
      <span className="legal-footer-sep">·</span>
      <button className="legal-footer-link" onClick={onImpressum}>{t('footer_impressum')}</button>
      <span className="legal-footer-sep">·</span>
      <button className="legal-footer-link" onClick={onDatenschutz}>{t('footer_datenschutz')}</button>
      <span className="legal-footer-sep">·</span>
      <button className="legal-footer-link" onClick={onCookieSettings}>{t('cookie_settings')}</button>
    </footer>
  )
}

/* ===================== IMPRESSUM PAGE ===================== */
function ImpressumPage({ onBack }) {
  const t = useT()
  const lang = useLang()
  const L = lang === 'en'
  return (
    <div className="legal-page content">
      <button className="btn-back" onClick={onBack}>{t('footer_back')}</button>
      <h1 className="legal-page-title">{t('impressum_title')}</h1>

      <section className="legal-section">
        <h2>{t('impressum_operator')}</h2>
        <p>
          Novogenia GmbH<br />
          Strass 19<br />
          5301 Eugendorf<br />
          {L ? 'Austria' : 'Österreich'}
        </p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_managing')}</h2>
        <p>Matthias Probst</p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_register')}</h2>
        <p>FN 531162 x · {L ? 'Regional Court Salzburg' : 'Landesgericht Salzburg'}</p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_uidde')}</h2>
        <p>ATU64713304</p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_contact')}</h2>
        <p>
          E-Mail: <a href="mailto:service@novogenia.com" rel="noopener noreferrer">service@novogenia.com</a>
        </p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_authority')}</h2>
        <p>
          Bezirkshauptmannschaft Salzburg-Umgebung<br />
          Karl-Wurmb-Straße 17, 5020 Salzburg<br />
          {L ? 'Federal Ministry for Social Affairs, Health, Care and Consumer Protection' : 'Bundesministerium für Soziales, Gesundheit, Pflege und Konsumentenschutz'}
        </p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_applicable_law')}</h2>
        <p>
          {L
            ? 'Austrian Trade Regulations 1994 (GewO), Genetic Technology Act (GTG), accessible via RIS Austria (ris.bka.gv.at).'
            : 'Gewerbeordnung 1994, Gentechnikgesetz (GTG), abrufbar über RIS Austria (ris.bka.gv.at).'}
        </p>
      </section>

      <section className="legal-section">
        <h2>{t('impressum_liability')}</h2>
        <p>{t('impressum_liability_text')}</p>
      </section>
    </div>
  )
}

/* ===================== DATENSCHUTZ PAGE ===================== */
function DatenschutzPage({ onBack, onCookieSettings }) {
  const t = useT()
  const lang = useLang()
  const [consent] = useCookieConsent()
  const L = lang === 'en'
  return (
    <div className="legal-page content">
      <button className="btn-back" onClick={onBack}>{t('footer_back')}</button>
      <h1 className="legal-page-title">{t('datenschutz_title')}</h1>

      <section className="legal-section">
        <h2>{L ? 'Responsible Party' : 'Verantwortlicher'}</h2>
        <p>
          Novogenia GmbH<br />
          Strass 19, 5301 Eugendorf, {L ? 'Austria' : 'Österreich'}<br />
          E-Mail: <a href="mailto:datenschutz@novogenia.com" rel="noopener noreferrer">datenschutz@novogenia.com</a>
        </p>
      </section>

      <section className="legal-section">
        <h2>{L ? 'What data we process' : 'Welche Daten wir verarbeiten'}</h2>
        <p>{L
          ? 'When you create an account, we store your e-mail address, your chosen display name, your language preference, and your course progress (which videos you watched and which tests you passed). This data is stored in Supabase (eu-central-1, Frankfurt, Germany) and processed exclusively for operating NOVO ACADEMY.'
          : 'Bei Kontoerstellung speichern wir Ihre E-Mail-Adresse, Ihren gewählten Anzeigenamen, Ihre Spracheinstellung und Ihren Kursfortschritt (welche Videos gesehen, welche Tests bestanden). Diese Daten werden in Supabase (eu-central-1, Frankfurt) gespeichert und ausschließlich zum Betrieb von NOVO ACADEMY verarbeitet.'}</p>
      </section>

      <section className="legal-section">
        <h2>{L ? 'Legal basis' : 'Rechtsgrundlage'}</h2>
        <p>{L
          ? 'Processing is based on your consent (Art. 6(1)(a) GDPR) when you register, and on contract performance (Art. 6(1)(b) GDPR) for providing the academy service.'
          : 'Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) bei der Registrierung sowie zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) für die Erbringung des Akademie-Dienstes.'}</p>
      </section>

      <section className="legal-section">
        <h2>{L ? 'Cookies' : 'Cookies'}</h2>
        <p>{L
          ? 'NOVO ACADEMY uses session cookies that are technically necessary for the login function (Supabase Auth). If you consent to optional cookies, embedded YouTube videos load additional cookies from Google/YouTube. You can withdraw your consent at any time.'
          : 'NOVO ACADEMY verwendet Session-Cookies, die technisch notwendig für die Login-Funktion sind (Supabase Auth). Wenn Sie optionalen Cookies zustimmen, laden eingebettete YouTube-Videos zusätzlich Cookies von Google/YouTube. Ihre Einwilligung können Sie jederzeit widerrufen.'}</p>
        <button className="btn-secondary legal-cookie-btn" onClick={onCookieSettings}>
          {consent === 'all'
            ? t('cookie_revoke')
            : t('cookie_settings')}
        </button>
      </section>

      <section className="legal-section">
        <h2>{L ? 'Third-party services' : 'Drittanbieter'}</h2>
        <ul className="legal-list">
          <li><strong>Supabase</strong> — {L ? 'Auth & database (eu-central-1 Frankfurt, Germany). Privacy policy: supabase.com/privacy' : 'Auth & Datenbank (eu-central-1 Frankfurt). Datenschutz: supabase.com/privacy'}</li>
          <li><strong>YouTube / Google</strong> — {L ? 'Video embedding (only with your consent). Privacy policy: policies.google.com/privacy' : 'Video-Einbettung (nur mit Ihrer Einwilligung). Datenschutz: policies.google.com/privacy'}</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{L ? 'Your rights' : 'Ihre Rechte'}</h2>
        <p>{L
          ? 'You have the right to access, correct, delete, or export your data, and to lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde, Barichgasse 40–42, 1030 Vienna, dsb.gv.at).'
          : 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung oder Datenübertragbarkeit sowie das Recht, Beschwerde bei der österreichischen Datenschutzbehörde einzulegen (Barichgasse 40–42, 1030 Wien, dsb.gv.at).'}</p>
        <p>{L
          ? 'To exercise your rights, contact: datenschutz@novogenia.com'
          : 'Zur Ausübung Ihrer Rechte wenden Sie sich an: datenschutz@novogenia.com'}</p>
      </section>
    </div>
  )
}

/* ===================== ADMIN PAGE =====================
   Visible only to users with `profiles.is_admin = true`. Two tabs:
   – Dashboard: total / new / active / certified user stats + language split + growth sparkline
   – Users: searchable list with expandable per-course toggles */
function AdminPage({ onBack }) {
  const t = useT()
  const lang = useLang()
  const [tab, setTab] = useState('dashboard')
  const [users, setUsers] = useState(null) // null = loading, [] = loaded
  const [error, setError] = useState(null)
  const [showDeleted, setShowDeleted] = useState(false)

  const reload = async () => {
    try {
      const list = await adminLoadAllUsers({ includeDeleted: showDeleted })
      setUsers(list || [])
    } catch (e) {
      setError(e.message || String(e))
      setUsers([])
    }
  }
  useEffect(() => { reload() }, [showDeleted])

  return (
    <div className="content admin-page">
      <div className="admin-bar">
        <button className="btn-back" onClick={onBack}>{t('admin_back')}</button>
        <div className="admin-tabs">
          <button className={`admin-tab${tab === 'dashboard' ? ' is-active' : ''}`} onClick={() => setTab('dashboard')}>
            {t('admin_tab_dashboard')}
          </button>
          <button className={`admin-tab${tab === 'users' ? ' is-active' : ''}`} onClick={() => setTab('users')}>
            {t('admin_tab_users')}{users ? ` (${users.length})` : ''}
          </button>
        </div>
        {tab === 'users' && (
          <label className="admin-toggle-deleted">
            <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} />
            <span>{t('admin_show_deleted')}</span>
          </label>
        )}
      </div>

      {users === null && <p className="admin-loading">{t('admin_loading')}</p>}
      {error && <p className="auth-error">{error}</p>}
      {users && users.length === 0 && !error && <p className="admin-loading">{t('admin_no_users')}</p>}

      {users && users.length > 0 && tab === 'dashboard' && <AdminDashboard users={users} />}
      {users && users.length > 0 && tab === 'users' && (
        <AdminUserList users={users} onChanged={reload} />
      )}
    </div>
  )
}

/* ----- Helpers for course-level analysis ----- */
const _certifiableUidsByLang = (() => {
  // Pre-compute which UIDs are certifiable per lang so admin code stays fast
  const out = { de: new Set(), en: new Set() }
  for (const c of COURSES) {
    if (isCertifiable(c)) {
      const l = c.lang || 'de'
      if (out[l]) out[l].add(c.uid)
    }
  }
  return out
})()

const _userActiveCount = (u) =>
  Object.values(u.progress || {}).filter(p => p?.watched).length
const _userCertifiedCount = (u) =>
  Object.values(u.progress || {}).filter(p => p?.watched && p?.testPassed).length

/* ----- Dashboard ----- */
function AdminDashboard({ users }) {
  const t = useT()
  const stats = useMemo(() => {
    const now = Date.now()
    const day7 = now - 7 * 24 * 60 * 60 * 1000
    const day30 = now - 30 * 24 * 60 * 60 * 1000

    let new7 = 0, new30 = 0, active = 0, certified = 0, completions = 0
    const langCount = {}
    const growth = new Array(30).fill(0) // bucket index 0 = oldest, 29 = today

    for (const u of users) {
      const created = u.created_at ? new Date(u.created_at).getTime() : 0
      if (created >= day7) new7++
      if (created >= day30) new30++
      langCount[u.lang || 'de'] = (langCount[u.lang || 'de'] || 0) + 1
      const watched = _userActiveCount(u)
      if (watched > 0) active++
      const cert = _userCertifiedCount(u)
      if (cert > 0) certified++
      completions += watched
      // growth bucket — newest bucket is today
      if (created >= day30) {
        const ageDays = Math.floor((now - created) / (24 * 60 * 60 * 1000))
        const idx = Math.max(0, 29 - ageDays)
        growth[idx]++
      }
    }
    return { total: users.length, new7, new30, active, certified, completions, langCount, growth }
  }, [users])

  const langTotal = Object.values(stats.langCount).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="admin-dashboard">
      <div className="admin-stat-grid">
        <StatCard label={t('admin_stat_total_users')}    value={stats.total} />
        <StatCard label={t('admin_stat_new_7d')}         value={stats.new7} />
        <StatCard label={t('admin_stat_new_30d')}        value={stats.new30} />
        <StatCard label={t('admin_stat_active')}         value={stats.active} />
        <StatCard label={t('admin_stat_certified')}      value={stats.certified} />
        <StatCard label={t('admin_stat_total_progress')} value={stats.completions} />
      </div>

      <div className="admin-chart-row">
        <section className="admin-chart-card">
          <h3 className="admin-chart-title">{t('admin_stat_growth')}</h3>
          <GrowthSparkline buckets={stats.growth} />
        </section>
        <section className="admin-chart-card">
          <h3 className="admin-chart-title">{t('admin_stat_lang_split')}</h3>
          <ul className="admin-lang-list">
            {Object.entries(stats.langCount).sort((a, b) => b[1] - a[1]).map(([code, n]) => (
              <li key={code} className="admin-lang-row">
                <span className="admin-lang-code">{code.toUpperCase()}</span>
                <div className="admin-lang-bar-wrap">
                  <div className="admin-lang-bar" style={{ width: `${(n / langTotal) * 100}%` }} />
                </div>
                <span className="admin-lang-num">{n}</span>
                <span className="admin-lang-pct">{Math.round((n / langTotal) * 100)}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-num">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  )
}

function GrowthSparkline({ buckets }) {
  // 30 buckets, each = users signed up that day. Cumulative line.
  const W = 600, H = 120, PAD = 8
  let acc = 0
  const cumulative = buckets.map(n => (acc += n, acc))
  const max = Math.max(1, cumulative[cumulative.length - 1])
  const points = cumulative.map((v, i) => {
    const x = PAD + (i / (cumulative.length - 1)) * (W - 2 * PAD)
    const y = H - PAD - (v / max) * (H - 2 * PAD)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const area = `M${PAD},${H - PAD} L${points} L${W - PAD},${H - PAD} Z`
  return (
    <svg className="admin-spark-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <path d={area} fill="var(--wine-soft, #f5e9ef)" />
      <polyline points={points} fill="none" stroke="var(--wine)" strokeWidth="2" />
      <text x={W - PAD} y={14} textAnchor="end" fontSize="11" fill="#888">{max} total</text>
    </svg>
  )
}

/* ----- User list with per-course toggles ----- */
function AdminUserList({ users, onChanged }) {
  const t = useT()
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [busyKey, setBusyKey] = useState(null) // `${userId}:${courseUid}`

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      (u.email || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q)
    )
  }, [users, query])

  const setCourse = async (userId, courseUid, action) => {
    setBusyKey(`${userId}:${courseUid}`)
    await adminSetUserCourseState(userId, courseUid, action)
    setBusyKey(null)
    onChanged && onChanged()
  }

  return (
    <div className="admin-userlist">
      <input
        className="admin-search"
        placeholder={t('admin_users_search')}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="admin-loading">{t('admin_no_matches')}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin_users_col_user')}</th>
              <th>{t('admin_users_col_signup')}</th>
              <th>{t('admin_users_col_lang')}</th>
              <th>{t('admin_users_col_progress')}</th>
              <th>{t('admin_users_col_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const watched = _userActiveCount(u)
              const certified = _userCertifiedCount(u)
              const isOpen = expandedId === u.id
              return (
                <React.Fragment key={u.id}>
                  <tr className={u.is_admin ? 'is-admin-row' : ''}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="user-menu-avatar admin-user-avatar">
                          {(bestDisplayName(u.name, u.email) || '?').charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="admin-user-name">
                            {bestDisplayName(u.name, u.email)}
                            {u.is_admin && <span className="admin-badge">{t('admin_user_admin_badge')}</span>}
                          </div>
                          <div className="admin-user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-user-meta">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td className="admin-user-meta">{(u.lang || 'de').toUpperCase()}</td>
                    <td className="admin-user-meta">
                      <span title={t('admin_users_col_progress')}>{watched}× watched</span>
                      {' · '}
                      <span style={{ color: 'var(--wine)' }}>{certified}× cert</span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="btn-ghost admin-expand-btn" onClick={() => setExpandedId(isOpen ? null : u.id)}>
                          {isOpen ? t('admin_user_collapse') : t('admin_user_expand')}
                        </button>
                        <AdminUserActionsMenu user={u} onChanged={onChanged} />
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="admin-courses-row">
                      <td colSpan={5}>
                        <AdminUserCourses
                          user={u}
                          onSet={(courseUid, action) => setCourse(u.id, courseUid, action)}
                          busyKey={busyKey}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

function AdminUserCourses({ user, onSet, busyKey }) {
  const t = useT()
  // Show ALL courses (both langs) — admin needs to see/manage every uid.
  const realCourses = COURSES.filter(c => c.contentType !== 'placeholder')
  return (
    <div className="admin-courses-grid">
      {realCourses.map(c => {
        const p = user.progress?.[c.uid] || {}
        const certifiable = isCertifiable(c)
        const state = (p.watched && p.testPassed) ? 'done'
                    : (p.watched ? 'partial' : 'open')
        const key = `${user.id}:${c.uid}`
        const busy = busyKey === key
        return (
          <div key={c.uid} className={`admin-course-row state-${state}`}>
            <div className="admin-course-meta">
              <span className={`admin-course-state-dot state-${state}`} />
              <div>
                <div className="admin-course-title">
                  <span className="admin-course-lang">{(c.lang || 'de').toUpperCase()}</span>{' '}
                  {c.category}: {c.topic}
                </div>
                <div className="admin-course-status">
                  {state === 'done' && t('admin_course_state_done')}
                  {state === 'partial' && t('admin_course_state_partial')}
                  {state === 'open' && t('admin_course_state_open')}
                  {certifiable ? '' : ' · (' + t('cl_certifiable_no').slice(0, 24) + '…)'}
                </div>
              </div>
            </div>
            <div className="admin-course-actions">
              {state !== 'done' && (
                <button
                  className="btn-primary admin-course-btn"
                  disabled={busy}
                  onClick={() => onSet(c.uid, 'complete')}
                >
                  ✓ {t('admin_course_set_done')}
                </button>
              )}
              {state !== 'open' && (
                <button
                  className="btn-ghost admin-course-btn"
                  disabled={busy}
                  onClick={() => onSet(c.uid, 'reset')}
                >
                  ↻ {t('admin_course_reset')}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ----- Per-user actions menu (promote/demote, rename, reset, delete) ----- */
function AdminUserActionsMenu({ user, onChanged }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const wrap = async (fn) => {
    setBusy(true)
    try { await fn() } finally { setBusy(false); setOpen(false); onChanged && onChanged() }
  }

  const togglePromote = () => wrap(() => adminSetIsAdmin(user.id, !user.is_admin))
  const rename = () => wrap(async () => {
    const suggestion = bestDisplayName(user.name, user.email)
    const newName = window.prompt(t('admin_action_rename_prompt'), suggestion)
    if (newName && newName.trim() && newName.trim() !== user.name) {
      await adminUpdateUserName(user.id, newName.trim())
    }
  })
  const resetAll = () => wrap(async () => {
    if (window.confirm(t('admin_action_reset_confirm'))) {
      await adminResetAllProgress(user.id)
    }
  })
  const softDelete = () => wrap(async () => {
    if (window.confirm(t('admin_action_delete_confirm'))) {
      await adminSoftDeleteUser(user.id)
    }
  })
  const undelete = () => wrap(() => adminUndeleteUser(user.id))

  const isDeleted = Boolean(user.deleted_at)

  return (
    <div className="admin-actions-menu" ref={ref}>
      <button
        className="admin-actions-btn"
        onClick={() => setOpen(o => !o)}
        disabled={busy}
        aria-label="User actions"
        aria-haspopup="true"
        aria-expanded={open}
      >⋯</button>
      {open && (
        <div className="admin-actions-pop" role="menu">
          {isDeleted ? (
            <button className="admin-actions-item" onClick={undelete} disabled={busy}>
              ↺ Undelete
            </button>
          ) : (
            <>
              <button className="admin-actions-item" onClick={togglePromote} disabled={busy}>
                {user.is_admin ? '↓ ' + t('admin_action_demote') : '↑ ' + t('admin_action_promote')}
              </button>
              <button className="admin-actions-item" onClick={rename} disabled={busy}>
                ✎ {t('admin_action_rename')}
              </button>
              <button className="admin-actions-item" onClick={resetAll} disabled={busy}>
                ↻ {t('admin_action_reset_all')}
              </button>
              <div className="admin-actions-sep" />
              <button className="admin-actions-item is-danger" onClick={softDelete} disabled={busy}>
                ✕ {t('admin_action_delete')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ===================== AUTH PAGE (signup / login) ===================== */
function AuthPage({ mode, lang, setLang, busy, setBusy, onSwitchMode, onBackToLanding }) {
  const t = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorKey, setErrorKey] = useState(null)

  const isSignup = mode === 'signup'

  const submit = async (e) => {
    e?.preventDefault?.()
    setErrorKey(null)
    setBusy(true)
    try {
      const fn = isSignup ? signUpWithEmail : signInWithEmail
      const args = isSignup ? { email, password, name } : { email, password }
      const { error } = await fn(args)
      if (error) {
        const map = { invalid: 'auth_error_invalid', taken: 'auth_error_taken', weak: 'auth_error_weak' }
        setErrorKey(map[error] || 'auth_error_invalid')
      }
      // On success, onAuthChange will swap us into the app
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setErrorKey(null)
    setBusy(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) setErrorKey('auth_error_invalid')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <button className="auth-back" onClick={onBackToLanding} aria-label="Back">
            <Icon.ChevronLeft />
          </button>
          <div className="landing-logo" onClick={onBackToLanding} style={{ cursor: 'pointer' }}>
            <span className="pt-novo">NOVO</span><span className="pt-academy">ACADEMY</span>
          </div>
          <div className="landing-header-right">
            <div className="lang-switcher" title="Language / Sprache">
              <button className={`lang-btn${lang === 'de' ? ' is-active' : ''}`} onClick={() => setLang('de')}>DE</button>
              <button className={`lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      </header>

      <div className="auth-card-wrap">
        <div className="auth-card">
          <h1 className="auth-title">{isSignup ? t('auth_signup_title') : t('auth_login_title')}</h1>
          <p className="auth-sub">{isSignup ? t('auth_signup_sub') : t('auth_login_sub')}</p>

          <button className="auth-google" onClick={google} disabled={busy}>
            <GoogleIcon /> <span>{t('auth_google')}</span>
          </button>

          <div className="auth-divider"><span>{t('auth_or_continue_with')}</span></div>

          <form className="auth-form" onSubmit={submit}>
            {isSignup && (
              <label className="auth-field">
                <span className="auth-label">{t('auth_name_label')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 80))}
                  placeholder={t('auth_name_placeholder')}
                  autoComplete="name"
                  maxLength={80}
                />
                <span className="auth-hint">{t('auth_name_hint')}</span>
              </label>
            )}
            <label className="auth-field">
              <span className="auth-label">{t('auth_email_label')}</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.slice(0, 254))}
                placeholder={t('auth_email_placeholder')}
                autoComplete="email"
                maxLength={254}
                required
              />
            </label>
            <label className="auth-field">
              <span className="auth-label">{t('auth_password_label')}</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value.slice(0, 128))}
                placeholder={t('auth_password_placeholder')}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                maxLength={128}
                minLength={isSignup ? 8 : undefined}
              />
            </label>

            {errorKey && <div className="auth-error">{t(errorKey)}</div>}

            <button type="submit" className="btn-primary big auth-submit" disabled={busy}>
              {busy ? t('auth_loading') : (isSignup ? t('auth_submit_signup') : t('auth_submit_login'))}
            </button>
          </form>

          <button className="auth-switch" onClick={onSwitchMode} disabled={busy}>
            {isSignup ? t('auth_switch_to_login') : t('auth_switch_to_signup')}
          </button>

          {!isUsingRealSupabase() && (
            <div className="auth-local-notice">
              <Icon.Info /> {lang === 'en'
                ? 'Local-only mode: accounts live in this browser. Configure Supabase to sync across devices.'
                : 'Lokaler Modus: Konten existieren nur in diesem Browser. Konfiguriere Supabase, um geräteübergreifend zu synchronisieren.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  )
}

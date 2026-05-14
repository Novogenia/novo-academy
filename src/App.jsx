import React, { useState, useMemo, useRef, useEffect } from 'react'
import { downloadCertificate } from './generateCert.js'
import CertTemplateBg from './CertTemplateBg.jsx'
import PdfThumb from './PdfThumb.jsx'
import { COURSES, isCertifiable, isCertified, buildInitialState, groupForDisplay, SAMPLE_COURSE_LIST, CATEGORY_CONTENT, HOME_VIDEO_SECTION, getContentTags } from './data.js'
import * as admin from './admin.js'

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
  return (
    <aside className="brand-notice">
      <div className="brand-notice-icon"><Icon.Info /></div>
      <div className="brand-notice-body">
        <div className="brand-notice-title">WICHTIG ZU WISSEN</div>
        <p className="brand-notice-text">
          Die Analyseprogramme gibt es unter verschiedenen Marken und in
          verschiedenen Ausführungen, also kann es sein, dass die Designs
          und Covers der in den Materialien gezeigten Berichte nicht 1:1
          mit den eigenen Designs zusammenpassen. Diese Schulungen sind
          aber markenübergreifend gültig.
        </p>
      </div>
    </aside>
  )
}

const CATEGORY_ICONS = {
  'Die Gen-Diät': Icon.Scale,
  'Gewichtsmanagement-Genetik': Icon.Scale, // legacy fallback
  'Genetik der gesunden Ernährung': Icon.Apple,
  'Personalisierte Nahrungsergänzung': Icon.Pill,
  'Leistungs-Genetik': Icon.Lightning,
  'Rechtlich sicher werben mit Produkten': Icon.Shield,
}

/* ===================== SIDEBAR ===================== */
function Sidebar() {
  const items = [
    { key: 'home', label: 'Home', Icon: Icon.Grid },
    { key: 'shop', label: 'Shop', Icon: Icon.Bag },
    { key: 'orders', label: 'Bestellungen', Icon: Icon.Clipboard },
    { key: 'customers', label: 'Kunden', Icon: Icon.People },
    { key: 'finance', label: 'Finanzen', Icon: Icon.Briefcase },
    { key: 'akademie', label: 'Akademie', Icon: Icon.Book, active: true },
    { key: 'referral', label: 'Weiterempfehlungs-⁠Programm', Icon: Icon.Network },
  ]
  const bottom = [
    { key: 'profile', label: 'Profil', Icon: Icon.User },
    { key: 'inbox', label: 'Postfach', Icon: Icon.Bell, count: 24 },
    { key: 'settings', label: 'Einstellungen', Icon: Icon.Gear },
  ]
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo"><span className="novo">NOVO</span><span className="pilot">PILOT</span></div>
        <div className="brand-sub"><Icon.PlatformIcon /><span>Partner- und Reseller-Plattform</span></div>
      </div>
      <div className="divider" />
      <div className="profile">
        <div className="avatar-wrap">
          <div className="avatar">DW</div>
          <div className="avatar-cam"><Icon.Camera /></div>
        </div>
        <div className="name">Daniel Wallersorfer</div>
        <div className="sub">Daniel Wallerstorfer</div>
      </div>
      <div className="divider" />
      <nav className="nav">
        {items.map(it => (
          <button key={it.key} className={`nav-item${it.active ? ' active' : ''}`}>
            <span className="icon"><it.Icon /></span>
            <span className="label">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-bottom">
        <nav className="nav">
          {bottom.map(it => (
            <button key={it.key} className="nav-item">
              <span className="icon"><it.Icon /></span>
              <span className="label">{it.label}</span>
              {it.count != null && <span className="count">{it.count}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

/* ===================== SEAL (real stamp — serrated, banner, stars) ===================== */
function Seal({ certified, certifiable, size = 'normal' }) {
  if (!certifiable) return null

  const color = certified ? '#3FA85C' : '#D5D5D5'
  const colorDark = certified ? '#2F8546' : '#BFBFBF'

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
            ZERTIFIZIERT
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
  const certified = isCertified(course, { [course.id]: state })
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
  const tags = getContentTags(course)
  if (!tags.length) return null
  return (
    <div className={`content-tags is-${size}`}>
      {tags.map((t, i) => (
        <span key={i} className={`tag ${t.className}`}>{t.label}</span>
      ))}
    </div>
  )
}

/* ===================== CATEGORY ROW (conditional scroll buttons) ===================== */
function CategoryRow({ category, label, items, courseState, navigate }) {
  const ref = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
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
          <button className="scroll-btn left" onClick={() => scroll(-1)} aria-label="zurück">
            <Icon.ArrowLeft />
          </button>
        )}
        <div className="row" ref={ref}>
          {items.map(c => (
            <Tile key={c.id} course={c} state={courseState[c.id]}
                  onClick={() => c.placeholder ? null : navigate({ name: 'course-landing', courseId: c.id })} />
          ))}
        </div>
        {canRight && (
          <button className="scroll-btn right" onClick={() => scroll(1)} aria-label="weiter">
            <Icon.ArrowRight />
          </button>
        )}
      </div>
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
  // Use explicit coverImage if provided (for videos without public YouTube thumbnails,
  // e.g. unlisted/private). Otherwise fall back to YouTube CDN thumbnail.
  const primarySrc = coverImage || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null)
  return (
    <div className="welcome-player" onClick={() => !playing && setPlaying(true)}>
      {playing && youtubeId ? (
        <iframe
          className="welcome-iframe"
          src={`https://www.youtube.com/embed/${youtubeId}?${YT_EMBED_PARAMS}`}
          title="Einleitung zur NOVO ACADEMY"
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
          <button className="welcome-play" aria-label="Abspielen">
            <Icon.Play />
          </button>
          {playing && !youtubeId && <div className="welcome-fake">▶ Wiedergabe (Demo — YouTube-ID fehlt)</div>}
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
function HomePage({ courseState, navigate, certName, setCertName, completedCertifiableCount, certifiedTitles }) {
  const [adminRevision, setAdminRevision] = useState(0)
  // React to admin-toggle changes so home re-renders without page reload
  useEffect(() => {
    const onChange = () => setAdminRevision(r => r + 1)
    window.addEventListener('novoacademy-admin-change', onChange)
    return () => window.removeEventListener('novoacademy-admin-change', onChange)
  }, [])
  const mains = useMemo(
    () => admin.reorderGroups(admin.filterGroups(groupForDisplay())),
    [adminRevision]
  )
  // Exclude placeholders from progress count — they aren't real modules
  const realCourses = COURSES.filter(c => c.contentType !== 'placeholder')
  const totalModules = realCourses.length
  const completedModules = realCourses.filter(c => courseState[c.id]?.watched).length
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="content">
      {/* Two introduction videos side-by-side, each ~2 tile widths.
          Title + description sit underneath each video. */}
      <div className="home-top-row">
        <div className="welcome-block">
          <WelcomePlayer youtubeId="71EHqtv3NOA" />
          <WelcomeText
            title="Einleitung zur NOVO ACADEMY"
            sub="Wer ist Novogenia und was kann man in diesem Schulungsportal erwarten?"
          />
        </div>
        <div className="welcome-block">
          <WelcomePlayer youtubeId="CFtFwezScLs" coverImage="/thumbnails/firmentour-cover.jpg" />
          <WelcomeText
            title="TOUR durch das UNTERNEHMEN"
            sub="Lass dir von Dr. Wallerstorfer zeigen, wie Genanalysen durchgeführt werden, wie personalisierte Nahrungsergänzung und Kosmetik produziert werden kann und wir von Probe und Rohstoffen zu fertigen Produkten kommen."
          />
        </div>
      </div>

      {/* Clear demarcation: course section starts here */}
      <div className="courses-section-header">
        <h2 className="courses-section-title">
          <span className="cs-text">DEINE ONLINE KURSE</span>
          <span className="cs-accent" />
        </h2>
        <p className="courses-section-sub">Wähle ein Modul aus den folgenden Themen und beginne dein Training.</p>

        <section className="academy-progress">
          <div className="ap-text">
            <div className="ap-stats">
              <span className="ap-num">{completedModules}</span>
              <span className="ap-of">von</span>
              <span className="ap-total">{totalModules}</span>
              <span className="ap-label">verfügbaren Modulen absolviert</span>
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

      {/* Letzte Sektion: Bonus-Videos (Longevity etc.) */}
      {HOME_VIDEO_SECTION?.videos?.length > 0 && (
        <section className="home-bonus-videos">
          <h2 className="home-bonus-title">{HOME_VIDEO_SECTION.category}</h2>
          {HOME_VIDEO_SECTION.subtitle && (
            <p className="home-bonus-sub">{HOME_VIDEO_SECTION.subtitle}</p>
          )}
          <div className="home-bonus-grid">
            {HOME_VIDEO_SECTION.videos.map((v, i) => (
              <RelatedVideoTile key={i} youtubeId={v.youtubeId} title={v.title} coverImage={v.coverImage} />
            ))}
          </div>
        </section>
      )}

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
function CertificateMini({ name = 'Maria Mustermann' }) {
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
          <div className="cert-mini-coach-title">GENETIK COACH</div>
          <div className="cert-mini-presented">Dieses Zertifikat bestätigt, dass</div>
          <div className="cert-mini-name">{name}</div>
          <div className="cert-mini-rules"><span /><span /><span /></div>
        </div>
      </div>
    </div>
  )
}

/* ===================== CERTIFICATE CTA (on home, wine bg with seal + preview) ===================== */
function CertificateCTA({ name, onNameChange, onGenerate, onShowSample, completedCount }) {
  return (
    <section className="cert-cta">
      <div className="cert-cta-body">
        <h2>Zertifikat erstellen</h2>
        <p>
          Bestätige deinen Lernerfolg mit dem offiziellen <strong>Novogenia Genetics Coach</strong>-Zertifikat.
          Es enthält alle <strong>{completedCount}</strong> abgeschlossenen und mit Test bestandenen Module deines Kontos
          und wird mit der Unterschrift von Dr.&nbsp;Daniel Wallerstorfer ausgestellt.
        </p>
        <div className="cert-form">
          <label className="cert-input-wrap">
            <span>Name auf dem Zertifikat</span>
            <input type="text" value={name} onChange={e => onNameChange(e.target.value)} placeholder="z. B. Maria Mustermann" />
          </label>
          <div className="cert-actions">
            <button className="btn-primary" onClick={onGenerate} disabled={!name.trim() || completedCount === 0}>
              Zertifikat generieren →
            </button>
            <button className="btn-ghost" onClick={onShowSample}>Beispiel ansehen</button>
          </div>
          {completedCount === 0 && <p className="cert-hint">Du hast noch keine Kurse zertifiziert. Sieh dir ein Beispielzertifikat an.</p>}
        </div>
      </div>

      <div className="cert-cta-visual">
        <div className="cert-cta-stack">
          <CertificateMini name={name?.trim() || 'Dein Name hier'} />
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
  const certifiable = isCertifiable(course)
  const certified = isCertified(course, { [course.id]: state })
  const tagBadge = course.contentType === 'course' ? 'Kurs'
    : course.contentType === 'training' ? 'Training'
    : course.contentType === 'faq' ? 'FAQ-Sammlung'
    : 'Zusatzmaterial'

  return (
    <div className="course-landing">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Akademie</button>
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
            ? <span className="cert-info">Zertifizierbar — bestehst du den Test, fließt dieses Modul in dein Zertifikat ein.</span>
            : <span className="cert-info muted">Reines Zusatzmaterial — wird nicht im Zertifikat ausgewiesen.</span>}
          {certified && <span className="cert-info success">✓ Du hast dieses Modul bereits zertifiziert abgeschlossen.</span>}
        </div>

        <p className="course-paragraph">{course.longDescription}</p>
        <ContentTags course={course} size="lg" />

        <h3 className="course-bullets-h">Was dieser {tagBadge} dir vermittelt</h3>
        <ul className="course-bullets">
          {course.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>

        <div className="course-actions">
          <button className="btn-primary big" onClick={() => navigate({ name: 'course-content', courseId: course.id })}>
            ▶ {course.contentType === 'faq'
                ? (state.watched ? 'FAQ-Sammlung erneut öffnen' : 'FAQ-Sammlung öffnen')
                : (state.watched ? 'Kurs erneut ansehen' : 'Kurs starten')}
          </button>
          {certifiable && (
            <div className="course-test-wrap">
              <button className="btn-ghost big" onClick={() => navigate({ name: 'test', courseId: course.id })}>
                ✎ {state.testPassed ? 'Test wiederholen' : 'Test starten'}
              </button>
              {state.testPassed && (
                <span className="test-completed">✓ Test erfolgreich abgeschlossen ({state.testScore}%)</span>
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
  return (
    <div className="vid-block">
      <div className="vid-frame" onClick={() => setPlaying(true)}>
        <img src={course.thumbnail} alt="" className="vid-thumb" />
        {!playing && (
          <button className="vid-play" aria-label="Abspielen">
            <Icon.Play />
          </button>
        )}
        {playing && <div className="vid-fake-playing">▶ Wiedergabe (Demo)</div>}
        <span className="vid-duration">{video.duration}</span>
      </div>
      <div className="vid-meta">
        <span className="vid-title">{video.title}</span>
        <span className="vid-hint">Optional ansehen — die Reihenfolge ist nicht zwingend.</span>
      </div>
    </div>
  )
}

function FullVideo({ course, youtubeId, title }) {
  const [playing, setPlaying] = useState(false)
  const v = course.videos?.[0]
  const yt = youtubeId || course.youtubeId
  // 1. explicit coverImage on course (for unlisted videos with no public YT thumb)
  // 2. YouTube CDN thumbnail
  // 3. fallback to tile thumbnail
  const explicitCover = course.coverImage
  const stillSrc = explicitCover
    || (yt ? `https://img.youtube.com/vi/${yt}/maxresdefault.jpg` : course.thumbnail)
  return (
    <div className="cc-video-full" onClick={() => !playing && setPlaying(true)}>
      {playing && yt ? (
        <iframe
          className="cc-video-iframe"
          src={`https://www.youtube.com/embed/${yt}?${YT_EMBED_PARAMS}`}
          title={title || course.topic}
          frameBorder="0"
          onLoad={ytUnmuteOnLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
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
            <button className="cc-video-play" aria-label="Abspielen">
              <Icon.Play />
            </button>
          )}
          {playing && !yt && <div className="cc-video-fake">▶ Wiedergabe (Demo)</div>}
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
/* ===================== ADMIN PAGE =====================
   Password-gated management view for the platform owner.
   - shows all sections + courses currently in data.js
   - per-course / per-section visibility toggles persisted in localStorage
   - data.js stays the source of truth; this layer only adds a hide-flag.
   - lock/unlock state is sessionStorage so it expires when the tab closes. */
function AdminPage({ onBack }) {
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [unlocked, setUnlocked] = useState(admin.isUnlocked())
  const [revision, setRevision] = useState(0)
  const [editingCourseId, setEditingCourseId] = useState(null)
  // Drag state. dragging = { kind: 'section' | 'course', main?, category?, id? }
  const [dragging, setDragging] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)  // for visual indicator

  // Listen for cross-component admin state changes
  useEffect(() => {
    const onChange = () => setRevision(r => r + 1)
    window.addEventListener('novoacademy-admin-change', onChange)
    return () => window.removeEventListener('novoacademy-admin-change', onChange)
  }, [])

  const tryUnlock = (e) => {
    e?.preventDefault?.()
    if (admin.unlock(pw)) {
      setUnlocked(true)
      setPwError(false)
      setPw('')
    } else {
      setPwError(true)
    }
  }

  if (!unlocked) {
    return (
      <div className="admin-page">
        <div className="admin-gate">
          <div className="admin-gate-card">
            <Icon.Lock />
            <h2>Admin-Bereich</h2>
            <p>Zugang nur für Administratoren. Bitte Passwort eingeben.</p>
            <form onSubmit={tryUnlock} className="admin-gate-form">
              <input
                type="password"
                className={`admin-gate-input${pwError ? ' is-error' : ''}`}
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(false) }}
                placeholder="Passwort"
                autoFocus
              />
              <button type="submit" className="btn-primary big">Entsperren</button>
            </form>
            {pwError && <p className="admin-gate-error">Falsches Passwort.</p>}
            <button className="btn-ghost" onClick={onBack}>Zurück zur Akademie</button>
          </div>
        </div>
      </div>
    )
  }

  // Build group tree but ignore the visibility filter (admin sees everything).
  // We still apply reorderGroups so the admin sees items in the current
  // (custom) order — and rearranging here directly updates that order.
  const allGroups = admin.reorderGroups(groupForDisplay())
  const hiddenCourses = admin.getHiddenCourseIds()
  const hiddenCategories = admin.getHiddenCategories()
  const totalHidden = hiddenCourses.size + hiddenCategories.size
  const customOrders = Object.keys(admin.getSectionOrder()).length
                     + Object.keys(admin.getCourseOrder()).length

  /* ---- drag-and-drop helpers ---- */
  const moveItem = (list, fromIdx, toIdx) => {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return list
    const next = list.slice()
    const [item] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, item)
    return next
  }
  const dropSection = (mainCat, fromCategory, toCategory) => {
    const main = allGroups.find(g => g.mainCategory === mainCat)
    if (!main) return
    const cur = main.sections.map(s => s.category)
    const fromIdx = cur.indexOf(fromCategory)
    const toIdx = cur.indexOf(toCategory)
    admin.setSectionOrder(mainCat, moveItem(cur, fromIdx, toIdx))
  }
  const dropCourse = (category, fromId, toId) => {
    const sec = allGroups.flatMap(g => g.sections).find(s => s.category === category)
    if (!sec) return
    const cur = sec.items.map(c => c.id)
    const fromIdx = cur.indexOf(fromId)
    const toIdx = cur.indexOf(toId)
    admin.setCourseOrder(category, moveItem(cur, fromIdx, toIdx))
  }

  return (
    <div className="admin-page">
      <div className="admin-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Akademie</button>
        <button className="btn-ghost" onClick={() => { admin.lock(); setUnlocked(false) }}>
          <Icon.Lock /> Abmelden
        </button>
      </div>

      <div className="admin-wrap">
        <header className="admin-header">
          <h1>Admin — Kursverwaltung</h1>
          <p className="admin-sub">
            Hier kannst du Sektionen und Kurse für Lernende ausblenden. Die Inhalte bleiben
            in der Plattform — sie sind nur nicht mehr in der Übersicht sichtbar.
          </p>
          <div className="admin-stats">
            <span className="admin-stat"><strong>{COURSES.length}</strong> Kurse insgesamt</span>
            <span className="admin-stat"><strong>{allGroups.reduce((s,g)=>s+g.sections.length,0)}</strong> Sektionen</span>
            <span className="admin-stat is-hidden-stat">
              <strong>{totalHidden}</strong> aktuell ausgeblendet
            </span>
            {totalHidden > 0 && (
              <button className="admin-reset" onClick={() => admin.resetHidden()}>
                Alle wieder anzeigen
              </button>
            )}
            {customOrders > 0 && (
              <button className="admin-reset" onClick={() => admin.resetOrders()}>
                Reihenfolge zurücksetzen
              </button>
            )}
          </div>
          <p className="admin-hint">
            💡 <strong>Tipp:</strong> Du kannst Sektionen und Kurse per Drag-and-Drop am ≡-Symbol neu sortieren.
          </p>
        </header>

        {allGroups.map(g => (
          <section key={g.mainCategory} className="admin-main-cat">
            <h2 className="admin-main-cat-title">{g.mainCategory}</h2>
            {g.sections.map(s => {
              const catHidden = hiddenCategories.has(s.category)
              const isSectionDragOver = dropTarget?.kind === 'section'
                                        && dropTarget.main === g.mainCategory
                                        && dropTarget.category === s.category
              return (
                <div
                  key={s.category}
                  className={[
                    'admin-section',
                    catHidden ? 'is-hidden' : '',
                    dragging?.kind === 'section' && dragging.category === s.category ? 'is-dragging' : '',
                    isSectionDragOver ? 'is-drop-target' : '',
                  ].filter(Boolean).join(' ')}
                  onDragOver={(e) => {
                    if (dragging?.kind === 'section' && dragging.main === g.mainCategory
                        && dragging.category !== s.category) {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      setDropTarget({ kind: 'section', main: g.mainCategory, category: s.category })
                    }
                  }}
                  onDragLeave={() => {
                    if (isSectionDragOver) setDropTarget(null)
                  }}
                  onDrop={(e) => {
                    if (dragging?.kind === 'section' && dragging.main === g.mainCategory) {
                      e.preventDefault()
                      dropSection(g.mainCategory, dragging.category, s.category)
                      setDragging(null); setDropTarget(null)
                    }
                  }}
                >
                  <div className="admin-section-head">
                    <span
                      className="admin-drag-handle"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move'
                        e.dataTransfer.setData('text/plain', `section:${s.category}`)
                        setDragging({ kind: 'section', main: g.mainCategory, category: s.category })
                      }}
                      onDragEnd={() => { setDragging(null); setDropTarget(null) }}
                      title="Verschieben"
                    >
                      <Icon.Drag />
                    </span>
                    <div className="admin-section-info">
                      <span className="admin-section-name">{s.category}</span>
                      {s.label && <span className="admin-section-label">{s.label}</span>}
                      <span className="admin-section-count">{s.items.length} Kurs{s.items.length !== 1 ? 'e' : ''}</span>
                    </div>
                    <button
                      className={`admin-toggle ${catHidden ? 'is-off' : 'is-on'}`}
                      onClick={() => admin.toggleCategoryHidden(s.category)}
                      title={catHidden ? 'Sektion einblenden' : 'Ganze Sektion ausblenden'}
                    >
                      {catHidden ? <Icon.EyeOff /> : <Icon.Eye />}
                      <span>{catHidden ? 'Ausgeblendet' : 'Sichtbar'}</span>
                    </button>
                  </div>
                  <ul className="admin-course-list">
                    {s.items.map(c => {
                      const courseHidden = hiddenCourses.has(c.id) || catHidden
                      const isModified = admin.hasOverride(c.id)
                      const isCourseDragOver = dropTarget?.kind === 'course'
                                               && dropTarget.category === s.category
                                               && dropTarget.id === c.id
                      return (
                        <li
                          key={c.id}
                          className={[
                            'admin-course',
                            courseHidden ? 'is-hidden' : '',
                            dragging?.kind === 'course' && dragging.id === c.id ? 'is-dragging' : '',
                            isCourseDragOver ? 'is-drop-target' : '',
                          ].filter(Boolean).join(' ')}
                          onDragOver={(e) => {
                            if (dragging?.kind === 'course' && dragging.category === s.category
                                && dragging.id !== c.id) {
                              e.preventDefault()
                              e.dataTransfer.dropEffect = 'move'
                              setDropTarget({ kind: 'course', category: s.category, id: c.id })
                            }
                          }}
                          onDragLeave={() => {
                            if (isCourseDragOver) setDropTarget(null)
                          }}
                          onDrop={(e) => {
                            if (dragging?.kind === 'course' && dragging.category === s.category) {
                              e.preventDefault()
                              dropCourse(s.category, dragging.id, c.id)
                              setDragging(null); setDropTarget(null)
                            }
                          }}
                        >
                          <span
                            className="admin-drag-handle small"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = 'move'
                              e.dataTransfer.setData('text/plain', `course:${c.id}`)
                              setDragging({ kind: 'course', category: s.category, id: c.id })
                            }}
                            onDragEnd={() => { setDragging(null); setDropTarget(null) }}
                            title="Verschieben"
                          >
                            <Icon.Drag />
                          </span>
                          <span className="admin-course-meta">
                            <span className={`admin-course-type type-${c.contentType}`}>{c.topic}</span>
                            <span className="admin-course-id">{c.id}</span>
                            {isModified && <span className="admin-course-modified" title="Manuell bearbeitet">●&nbsp;bearbeitet</span>}
                          </span>
                          <span className="admin-course-actions">
                            <button
                              className="admin-edit"
                              onClick={() => setEditingCourseId(c.id)}
                              title="Kurs bearbeiten"
                            >
                              Bearbeiten
                            </button>
                            <button
                              className={`admin-toggle small ${hiddenCourses.has(c.id) ? 'is-off' : 'is-on'}`}
                              onClick={() => admin.toggleCourseHidden(c.id)}
                              disabled={catHidden}
                              title={catHidden ? 'Sektion ist ausgeblendet — entsperre sie zuerst' : (hiddenCourses.has(c.id) ? 'Kurs einblenden' : 'Kurs ausblenden')}
                            >
                              {hiddenCourses.has(c.id) ? <Icon.EyeOff /> : <Icon.Eye />}
                            </button>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </section>
        ))}

        {/* Editor modal */}
        {editingCourseId && (
          <CourseEditor
            key={editingCourseId + ':' + revision}
            courseId={editingCourseId}
            onClose={() => setEditingCourseId(null)}
          />
        )}

        {/* Cowork workflow info */}
        <section className="admin-cowork">
          <h2>Neue Kurse hinzufügen — Workflow mit Claude Cowork</h2>
          <p>
            Für neue Kurse gibt es einen vordefinierten Ordner-Aufbau. Ein neuer Kurs ist
            ein Ordner unter <code>content/courses/&lt;course-id&gt;/</code> mit standardisierten Dateien.
            Cowork kann diese Ordnerstruktur für dich erzeugen — Vollständige Anleitung
            in <code>content/README.md</code>.
          </p>
          <pre className="admin-pre">{`content/
└─ courses/
   └─ <course-id>/                         ← z. B. "supp-sci"
      ├─ course.json                       ← Metadaten (Titel, Kategorie, Topic, Tags)
      ├─ article.md          (optional)    ← Texteinhalte für training-Kurse
      ├─ questions.json      (optional)    ← Test-Fragen (für certifiable Kurse)
      ├─ faqs.json           (optional)    ← Frage/Antwort-Paare (für faq Kurse)
      └─ documents/
         ├─ powerpoint.pptx
         ├─ demo-bericht.pdf
         └─ science-review.pdf`}
          </pre>
          <p className="admin-cowork-hint">
            <strong>Workflow:</strong> Du sagst Cowork „Mach mir einen neuen Kurs zu XY",
            es legt den Ordner an, du fügst Assets hinzu — beim nächsten Build werden
            die neuen Kurse automatisch aufgenommen.
          </p>
        </section>
      </div>
    </div>
  )
}

/* ===================== COURSE EDITOR =====================
   Modal that lets the admin edit any course's content. Values are stored
   as a per-course override in localStorage; on save we re-apply them on
   top of the baseline COURSES array (in admin.applyCourseOverrides). */

// Tiny string-list editor: each row is an input + a delete button, plus
// an "add row" link at the bottom. Used for bullets and intro-questions.
function StringListEditor({ items = [], onChange, placeholder = '' }) {
  return (
    <div className="ed-list">
      {items.map((v, i) => (
        <div key={i} className="ed-list-row">
          <textarea
            className="ed-input"
            value={v}
            rows={Math.min(4, Math.max(1, Math.ceil((v || '').length / 80)))}
            placeholder={placeholder}
            onChange={e => {
              const next = items.slice()
              next[i] = e.target.value
              onChange(next)
            }}
          />
          <button type="button" className="ed-del" title="Entfernen"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="ed-add"
              onClick={() => onChange([...items, ''])}>＋ Hinzufügen</button>
    </div>
  )
}

// Test-question editor: each row has the prompt, 4 options, and a "correct" radio.
function QuestionListEditor({ items = [], onChange }) {
  const updateAt = (idx, patch) => {
    const next = items.slice()
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }
  const updateOpt = (idx, optIdx, value) => {
    const next = items.slice()
    const options = (next[idx].options || ['', '', '', '']).slice()
    options[optIdx] = value
    next[idx] = { ...next[idx], options }
    onChange(next)
  }
  return (
    <div className="ed-questions">
      {items.map((q, i) => (
        <div key={i} className="ed-question">
          <div className="ed-question-head">
            <span className="ed-question-idx">Frage {i + 1}</span>
            <button type="button" className="ed-del" title="Frage entfernen"
                    onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </div>
          <textarea
            className="ed-input"
            value={q.q || ''}
            rows={2}
            placeholder="Frage-Text"
            onChange={e => updateAt(i, { q: e.target.value })}
          />
          {(q.options || ['', '', '', '']).map((opt, oi) => (
            <div key={oi} className="ed-question-opt">
              <input
                type="radio"
                name={`correct-${i}`}
                checked={q.correct === oi}
                onChange={() => updateAt(i, { correct: oi })}
              />
              <input
                type="text"
                className="ed-input"
                value={opt}
                placeholder={`Antwort ${oi + 1}`}
                onChange={e => updateOpt(i, oi, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <button type="button" className="ed-add"
              onClick={() => onChange([...items, { q: '', options: ['', '', '', ''], correct: 0 }])}>
        ＋ Frage hinzufügen
      </button>
    </div>
  )
}

// Document editor: list of { title, size, type, url, thumbnail }
function DocumentListEditor({ items = [], onChange }) {
  const updateAt = (idx, patch) => {
    const next = items.slice()
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }
  return (
    <div className="ed-docs">
      {items.map((d, i) => (
        <div key={i} className="ed-doc">
          <div className="ed-doc-head">
            <span className="ed-doc-idx">Dokument {i + 1}</span>
            <button type="button" className="ed-del" title="Dokument entfernen"
                    onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </div>
          <label className="ed-field">
            <span>Titel</span>
            <input type="text" className="ed-input" value={d.title || ''}
                   onChange={e => updateAt(i, { title: e.target.value })} />
          </label>
          <div className="ed-row">
            <label className="ed-field" style={{ flex: 1 }}>
              <span>Größe</span>
              <input type="text" className="ed-input" value={d.size || ''}
                     placeholder="z. B. 78 MB"
                     onChange={e => updateAt(i, { size: e.target.value })} />
            </label>
            <label className="ed-field" style={{ width: 110 }}>
              <span>Typ</span>
              <select className="ed-input" value={d.type || 'pdf'}
                      onChange={e => updateAt(i, { type: e.target.value })}>
                <option value="pdf">pdf</option>
                <option value="pptx">pptx</option>
                <option value="docx">docx</option>
                <option value="xlsx">xlsx</option>
              </select>
            </label>
          </div>
          <label className="ed-field">
            <span>URL (Pfad zur Datei)</span>
            <input type="text" className="ed-input" value={d.url || ''}
                   placeholder="/course-materials/.../file.pdf"
                   onChange={e => updateAt(i, { url: e.target.value })} />
          </label>
          <label className="ed-field">
            <span>Thumbnail (optional, Pfad zum Bild)</span>
            <input type="text" className="ed-input" value={d.thumbnail || ''}
                   placeholder="/thumbnails/pptx-template.jpg"
                   onChange={e => updateAt(i, { thumbnail: e.target.value || undefined })} />
          </label>
        </div>
      ))}
      <button type="button" className="ed-add"
              onClick={() => onChange([...items, { title: '', size: '', type: 'pdf', url: '' }])}>
        ＋ Dokument hinzufügen
      </button>
    </div>
  )
}

// Video-segment editor: list of { title, youtubeId }
function VideoSegmentEditor({ items = [], onChange }) {
  const updateAt = (idx, patch) => {
    const next = items.slice()
    next[idx] = { ...next[idx], ...patch }
    onChange(next)
  }
  return (
    <div className="ed-list">
      {items.map((seg, i) => (
        <div key={i} className="ed-video-row">
          <input type="text" className="ed-input" value={seg.title || ''}
                 placeholder="Titel des Video-Kapitels"
                 onChange={e => updateAt(i, { title: e.target.value })} />
          <input type="text" className="ed-input ed-input-mono" value={seg.youtubeId || ''}
                 placeholder="YouTube-ID"
                 onChange={e => updateAt(i, { youtubeId: e.target.value })} />
          <button type="button" className="ed-del" title="Entfernen"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="ed-add"
              onClick={() => onChange([...items, { title: '', youtubeId: '' }])}>
        ＋ Video-Kapitel
      </button>
    </div>
  )
}

function CourseEditor({ courseId, onClose }) {
  const baseline = admin.getBaseline(COURSES)
  const baseCourse = baseline[courseId]
  const current = COURSES.find(c => c.id === courseId)
  const hasOv = admin.hasOverride(courseId)
  // Form state starts from the *current* (possibly overridden) course
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(current)))

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const save = () => {
    // Build the override as the diff vs. baseline, so we only persist
    // what was actually changed.  Reduces noise and keeps localStorage small.
    const override = {}
    const fields = [
      'category', 'topic', 'contentType', 'description', 'longDescription',
      'bullets', 'thumbnail', 'coverImage', 'youtubeId',
      'introQuestionsHeader', 'introQuestions',
      'postVideoText', 'brandNoticeAboveVideos', 'brandNoticeAboveDownloads',
      'videoSegments', 'questions', 'documents',
      'hasDownload', 'hasText',
    ]
    for (const k of fields) {
      const a = JSON.stringify(form[k] ?? null)
      const b = JSON.stringify(baseCourse[k] ?? null)
      if (a !== b) override[k] = form[k]
    }
    admin.replaceCourseOverride(courseId, override)
    onClose()
  }

  const resetToOriginal = () => {
    if (!confirm('Alle Änderungen an diesem Kurs zurücksetzen?')) return
    admin.resetCourseOverride(courseId)
    onClose()
  }

  return (
    <div className="ed-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="ed-modal">
        <div className="ed-modal-head">
          <div>
            <span className="ed-modal-id">{courseId}</span>
            <h2>Kurs bearbeiten {hasOv && <span className="ed-mod-badge">geändert</span>}</h2>
          </div>
          <button type="button" className="ed-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="ed-modal-body">
          {/* ---- Grunddaten ---- */}
          <fieldset className="ed-group">
            <legend>Grunddaten</legend>
            <label className="ed-field">
              <span>Kategorie (Sektion)</span>
              <input type="text" className="ed-input" value={form.category || ''}
                     onChange={e => set('category', e.target.value)} />
            </label>
            <label className="ed-field">
              <span>Topic</span>
              <select className="ed-input" value={form.topic || ''}
                      onChange={e => set('topic', e.target.value)}>
                <option value="Wissenschaftliche Basis">Wissenschaftliche Basis</option>
                <option value="Beratungsschulung">Beratungsschulung</option>
                <option value="Häufige Fragen">Häufige Fragen</option>
                <option value={form.topic}>{form.topic}</option>
              </select>
            </label>
            <label className="ed-field">
              <span>Content-Type</span>
              <select className="ed-input" value={form.contentType || ''}
                      onChange={e => set('contentType', e.target.value)}>
                <option value="course">course (Video + Test)</option>
                <option value="training">training (Text-basiert)</option>
                <option value="faq">faq (Fragen-Sammlung)</option>
                <option value="supplementary">supplementary (nur Material)</option>
              </select>
            </label>
          </fieldset>

          {/* ---- Texte ---- */}
          <fieldset className="ed-group">
            <legend>Beschreibungstexte</legend>
            <label className="ed-field">
              <span>Kurzbeschreibung (Tile)</span>
              <textarea className="ed-input" rows={2} value={form.description || ''}
                        onChange={e => set('description', e.target.value)} />
            </label>
            <label className="ed-field">
              <span>Lange Beschreibung (Kurs-Detail)</span>
              <textarea className="ed-input" rows={4} value={form.longDescription || ''}
                        onChange={e => set('longDescription', e.target.value)} />
            </label>
            <label className="ed-field">
              <span>Bullets (Was dieser Kurs vermittelt)</span>
              <StringListEditor items={form.bullets || []}
                                onChange={v => set('bullets', v)}
                                placeholder="Stichpunkt" />
            </label>
          </fieldset>

          {/* ---- Intro-Fragen ---- */}
          <fieldset className="ed-group">
            <legend>Intro-Fragen (oberhalb Video)</legend>
            <label className="ed-field">
              <span>Header-Zeile</span>
              <input type="text" className="ed-input" value={form.introQuestionsHeader || ''}
                     placeholder="z. B. In dieser Schulung lernst du:"
                     onChange={e => set('introQuestionsHeader', e.target.value)} />
            </label>
            <label className="ed-field">
              <span>Fragen-Liste</span>
              <StringListEditor items={form.introQuestions || []}
                                onChange={v => set('introQuestions', v)}
                                placeholder="Frage, die das Video beantwortet" />
            </label>
            <label className="ed-field">
              <span>Text nach den Videos (postVideoText)</span>
              <textarea className="ed-input" rows={3} value={form.postVideoText || ''}
                        onChange={e => set('postVideoText', e.target.value)} />
            </label>
          </fieldset>

          {/* ---- Bilder & Video ---- */}
          <fieldset className="ed-group">
            <legend>Bilder & Video</legend>
            <label className="ed-field">
              <span>Tile-Thumbnail (Pfad oder T(N))</span>
              <input type="text" className="ed-input ed-input-mono" value={form.thumbnail || ''}
                     placeholder="/thumbnails/course-xy.jpg"
                     onChange={e => set('thumbnail', e.target.value)} />
            </label>
            <label className="ed-field">
              <span>YouTube-ID (Haupt-Video)</span>
              <input type="text" className="ed-input ed-input-mono" value={form.youtubeId || ''}
                     placeholder="abc123XYZ"
                     onChange={e => set('youtubeId', e.target.value || undefined)} />
            </label>
            <label className="ed-field">
              <span>Cover-Image (Override für YouTube-Thumb, optional)</span>
              <input type="text" className="ed-input ed-input-mono" value={form.coverImage || ''}
                     placeholder="/thumbnails/xy-cover.jpg"
                     onChange={e => set('coverImage', e.target.value || undefined)} />
            </label>
            {(form.videoSegments?.length > 0 || form.contentType === 'course') && (
              <label className="ed-field">
                <span>Video-Kapitel (für Beratungsschulungen)</span>
                <VideoSegmentEditor items={form.videoSegments || []}
                                    onChange={v => set('videoSegments', v.length ? v : undefined)} />
              </label>
            )}
          </fieldset>

          {/* ---- Test-Fragen ---- */}
          {(form.contentType === 'course' || form.contentType === 'training') && (
            <fieldset className="ed-group">
              <legend>Test-Fragen (für Zertifizierung)</legend>
              <QuestionListEditor items={form.questions || []}
                                  onChange={v => set('questions', v)} />
            </fieldset>
          )}

          {/* ---- Downloads ---- */}
          <fieldset className="ed-group">
            <legend>Downloads (Dokumente)</legend>
            <DocumentListEditor items={form.documents || []}
                                onChange={v => set('documents', v)} />
            <div className="ed-row">
              <label className="ed-checkbox">
                <input type="checkbox" checked={!!form.hasDownload}
                       onChange={e => set('hasDownload', e.target.checked)} />
                <span>hasDownload (Download-Bereich anzeigen)</span>
              </label>
              <label className="ed-checkbox">
                <input type="checkbox" checked={!!form.hasText}
                       onChange={e => set('hasText', e.target.checked)} />
                <span>hasText (Text-Inhalt anzeigen)</span>
              </label>
            </div>
          </fieldset>

          {/* ---- Branding ---- */}
          <fieldset className="ed-group">
            <legend>Brand-Hinweise</legend>
            <label className="ed-checkbox">
              <input type="checkbox" checked={!!form.brandNoticeAboveVideos}
                     onChange={e => set('brandNoticeAboveVideos', e.target.checked)} />
              <span>BrandNotice oberhalb der Videos anzeigen</span>
            </label>
            <label className="ed-checkbox">
              <input type="checkbox" checked={!!form.brandNoticeAboveDownloads}
                     onChange={e => set('brandNoticeAboveDownloads', e.target.checked)} />
              <span>BrandNotice oberhalb der Downloads anzeigen</span>
            </label>
          </fieldset>
        </div>

        <div className="ed-modal-foot">
          {hasOv && (
            <button type="button" className="ed-reset" onClick={resetToOriginal}>
              Original wiederherstellen
            </button>
          )}
          <div className="ed-modal-foot-right">
            <button type="button" className="btn-ghost" onClick={onClose}>Abbrechen</button>
            <button type="button" className="btn-primary big" onClick={save}>Speichern</button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <button className="related-video-play" aria-label="Video abspielen">
            <Icon.Play />
          </button>
        </>
      )}
    </div>
  )
}

function FaqPage({ course, state, onComplete, onBack }) {
  const [expandedAll, setExpandedAll] = useState(false)
  return (
    <div className="course-content-page faq-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Kursübersicht</button>
      </div>

      <div className="cc-wrap">
        <div className="cc-title-row">
          <h1 className="cc-title">{course.category}: {course.topic}</h1>
        </div>

        <p className="cc-paragraph">{course.longDescription}</p>

        <div className="faq-toolbar">
          <span className="faq-hint">Klicke auf eine Frage, um die Antwort einzublenden — perfekt zum Selbsttest.</span>
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
            <h2 className="cc-h">Komplette FAQ-Sammlung als PDF</h2>
            <p className="cc-paragraph">
              Lade die gesamte Sammlung als Novogenia/Novodaily-gebrandetes PDF herunter — ideal als Nachschlagewerk für Beratungsgespräche oder zum Ausdrucken.
            </p>
            <div className="cc-docs">
              {course.documents.map((d, i) => {
                const ext = (d.type || '').toUpperCase() || 'PDF'
                const Wrapper = d.url ? 'a' : 'div'
                const wrapProps = d.url
                  ? { href: d.url, download: '', target: '_blank', rel: 'noopener' }
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
            ? <p className="cc-already">Du hast diese FAQ-Sammlung bereits durchgesehen.</p>
            : <p className="cc-prompt">Wenn du alle Fragen durchgegangen bist, kannst du das Modul als angesehen markieren.</p>}
          <div className="cc-actions-row">
            <button className="cc-action-btn" onClick={onComplete}>
              <span className="cc-action-icon"><Icon.Cap /></span>
              <span className="cc-action-text">
                <span className="cc-action-title">Modul abschließen</span>
                <span className="cc-action-sub">Markiere die FAQ-Sammlung als durchgesehen</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseContentPage({ course, state, onComplete, onBack, onStartTest }) {
  const content = CATEGORY_CONTENT[course.category] || {}
  // Per-course introText / introQuestions overrides the generic "Warum Gene…" block
  const useIntroText = !!course.introText || !!course.introQuestions
  const certifiable = isCertifiable(course)
  return (
    <div className="course-content-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Kursübersicht</button>
      </div>

      <div className="cc-wrap">
        <div className="cc-title-row">
          <h1 className="cc-title">{course.category}: {course.topic}</h1>
          {certifiable && (
            <div className="cc-cert-badge">
              <Seal certified={false} certifiable={true} />
              <span className="cc-cert-label">ZERTIFIZIERBARER KURS</span>
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
            const calloutLabel = callout && (
              callout.tone === 'safe' ? 'SICHER'
              : callout.tone === 'critical' ? 'KRITISCH'
              : callout.tone === 'caveat' ? 'MIT DISCLAIMER'
              : 'WICHTIG'
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
        ) : (
          <FullVideo course={course} />
        )}

        {course.postVideoText && <p className="cc-paragraph">{course.postVideoText}</p>}

        {!useIntroText && content.moreText && <p className="cc-paragraph">{content.moreText}</p>}

        {!useIntroText && content.resultsHeading && <h2 className="cc-h">{content.resultsHeading}</h2>}
        {!useIntroText && content.resultsText && <p className="cc-paragraph">{content.resultsText}</p>}

        {course.hasDownload && (
          <>
            <h2 className="cc-h">Dokumente zum Mitnehmen</h2>
            {course.brandNoticeAboveDownloads && <BrandNotice />}
            <div className="cc-docs">
              {course.documents.map((d, i) => {
                const ext = (d.type || '').toUpperCase() || 'PDF'
                const Wrapper = d.url ? 'a' : 'div'
                const wrapProps = d.url
                  ? { href: d.url, download: '', target: '_blank', rel: 'noopener' }
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
            ? <p className="cc-already">Du hast dieses Modul bereits erfolgreich abgeschlossen.</p>
            : <p className="cc-prompt">Wenn du alle relevanten Inhalte angesehen hast, schließe das Modul ab und lege deinen Test ab.</p>}
          <div className="cc-actions-row">
            <button className="cc-action-btn" onClick={onComplete}>
              <span className="cc-action-icon"><Icon.Cap /></span>
              <span className="cc-action-text">
                <span className="cc-action-title">Training abschließen</span>
                <span className="cc-action-sub">Markiere dieses Modul als erfolgreich abgeschlossen</span>
              </span>
            </button>
            {isCertifiable(course) && onStartTest && (
              <button className="cc-action-btn cc-action-btn-alt" onClick={onStartTest}>
                <span className="cc-action-icon"><Icon.Quiz /></span>
                <span className="cc-action-text">
                  <span className="cc-action-title">Test beginnen</span>
                  <span className="cc-action-sub">Stelle dein Wissen unter Beweis und sichere dein Zertifikat</span>
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

  const submit = () => {
    if (Object.keys(answers).length < course.questions.length) {
      if (!confirm('Du hast nicht alle Fragen beantwortet. Trotzdem abgeben?')) return
    }
    let correct = 0
    course.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    const score = Math.round((correct / course.questions.length) * 100)
    const passed = score >= 80
    onSubmit({ score, passed })
  }

  // Demo: attach a genreport image to the first question of every test
  const demoImage = (
    <GenReportDemo
      title="Fettempfindlichkeit hoch"
      position={22}
      text="Aufgrund deiner Gene tendierst du dazu, mehr Fett aus dem Darm aufzunehmen und zu speichern als Menschen mit anderen Genen. Ein hoher Fettgehalt in Lebensmitteln führt somit zu Übergewicht. Dabei geht es hauptsächlich um das Gesamtfett. Deshalb wäre das gesunde, ungesättigte Fett zu bevorzugen."
    />
  )

  return (
    <div className="test-page">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Kursübersicht</button>
      </div>

      <div className="cc-wrap">
        <h1 className="cc-title">Test: {course.category}: {course.topic}</h1>
        <p className="cc-sub">
          Beantworte alle Fragen in einem Durchgang. Bestehensgrenze: <strong>80&nbsp;% korrekte Antworten</strong>.
          Du erhältst nach Abgabe nur das Gesamtergebnis (keine Einzelauflösung).
        </p>

        <div className="test-questions">
          {course.questions.map((q, qi) => {
            // Determine what visual aid (if any) to show with the question:
            //   1. q.screenshot  → URL string of an actual screenshot image
            //   2. q.screenshotNote → placeholder marker until a real screenshot is dropped in
            //   3. q.image  → custom JSX (legacy support)
            //   4. fallback: only the very first question on courses without ANY of the above gets the demo Genreport
            let visual = null
            if (q.screenshot) {
              visual = <img src={q.screenshot} alt="" className="test-q-screenshot" />
            } else if (q.screenshotNote) {
              visual = <div className="test-q-screenshot-placeholder">📷 Screenshot folgt — {q.screenshotNote}</div>
            } else if (q.image) {
              visual = q.image
            }
            return (
              <fieldset key={qi} className="test-q">
                <legend className="test-q-legend"><span className="test-q-no">Frage {qi + 1}</span> {q.q}</legend>
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
          <button className="btn-primary big" onClick={submit}>Test abschließen ({Object.keys(answers).length}/{course.questions.length} beantwortet)</button>
        </div>
      </div>
    </div>
  )
}

/* ===================== TEST RESULT ===================== */
function TestResultPage({ course, score, passed, navigate, onBack }) {
  return (
    <div className="test-result">
      <div className="course-landing-bar">
        <button className="btn-back" onClick={onBack}><Icon.ChevronLeft /> Zurück zur Kursübersicht</button>
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
          {passed ? 'Bestanden!' : 'Leider nicht bestanden'}
        </h1>
        <p className="tr-msg">
          {passed
            ? `Du hast den Test zu „${course.topic}" mit ${score}% erfolgreich bestanden. Das Modul ist ab sofort als „Zertifiziert" markiert.`
            : `Du hast ${score}% korrekte Antworten erreicht. Zum Bestehen sind mindestens 80% erforderlich. Schau dir den Kurs noch einmal an und versuche es erneut.`}
        </p>

        <div className="tr-actions">
          {passed
            ? (<>
                <button className="btn-primary big" onClick={onBack}>Zur Kursübersicht</button>
                <button className="btn-ghost big" onClick={() => navigate({ name: 'home' })}>Alle Kurse</button>
              </>)
            : (<>
                <button className="btn-primary big" onClick={() => navigate({ name: 'test', courseId: course.id })}>Erneut versuchen</button>
                <button className="btn-ghost big" onClick={() => navigate({ name: 'course-content', courseId: course.id })}>Kurs nochmal ansehen</button>
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
  return <img className="sig-img" src="/signature.png" alt="Dr. Daniel Wallerstorfer" onError={() => setErr(true)} />
}

const formatDateDE = (d = new Date()) =>
  d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })

/* Novogenia logo — uses /novogenia-logo.png if dropped in /public, otherwise inline SVG fallback */
function NovogeniaLogo({ className = '' }) {
  const [err, setErr] = useState(false)
  if (!err) {
    return (
      <img
        className={`ng-logo-img ${className}`}
        src="/novogenia-logo.png"
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
  const dateStr = formatDateDE(isSample ? new Date(2026, 4, 5) : new Date())
  const [downloading, setDownloading] = useState(false)

  const downloadPdf = async () => {
    setDownloading(true)
    try {
      await downloadCertificate({ name: name || 'Maria Mustermann', courses, dateStr })
    } catch (err) {
      console.error('PDF generation failed', err)
      alert('PDF konnte nicht erstellt werden. Bitte erneut versuchen.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="cert-view">
      <div className="cert-toolbar">
        <button className="btn-ghost" onClick={onBack}><Icon.ChevronLeft /> Zurück</button>
        <div className="cert-toolbar-spacer" />
        {isSample && <span className="sample-badge">BEISPIEL</span>}
        <button className="btn-primary" onClick={downloadPdf} disabled={downloading}>
          <Icon.Download /> {downloading ? 'Wird erstellt...' : 'Als PDF herunterladen'}
        </button>
      </div>

      <div className="cert-canvas">
        <div className="certificate" id="certificate-print">
          {/* The on-screen certificate now uses the actual PDF as background.
              Logo, signature, wine wedge — all baked into cert-template.pdf. */}
          <CertTemplateBg />

          <div className="cert-content">
            {/* Title block: NOVOGENIA (wine, Medium 26pt) + GENETIK COACH (black, Bold 48pt) */}
            <p className="cert-novo">NOVOGENIA</p>
            <p className="cert-coach">GENETIK COACH</p>

            {/* Recipient block */}
            <p className="cert-confirm">Dieses Zertifikat bestätigt, dass</p>
            <p className="cert-name">{name}</p>

            {/* Date sentence */}
            <p className="cert-completion-text">
              Am <strong>{dateStr}</strong> erfolgreich die folgenden Schulungsmodule absolviert und bestanden hat:
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
            <div className="cert-sig-role">CEO von Novogenia</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================== APP ===================== */
// Apply any stored course overrides ONCE at module-load time so every
// downstream consumer sees the edited values from the very first render.
admin.applyCourseOverrides(COURSES)

export default function App() {
  const [route, setRoute] = useState({ name: 'home' })
  const [courseState, setCourseState] = useState(buildInitialState)
  const [certName, setCertName] = useState('')
  const [lastTestResult, setLastTestResult] = useState(null)
  // Re-apply overrides on each admin change (e.g. when the editor saves).
  // The applyCourseOverrides mutates the COURSES array in place; the state
  // bump below is just to force re-render of consumers that already hold
  // references to course objects.
  const [, setOverrideRev] = useState(0)
  useEffect(() => {
    const onChange = () => {
      admin.applyCourseOverrides(COURSES)
      setOverrideRev(r => r + 1)
    }
    window.addEventListener('novoacademy-admin-change', onChange)
    return () => window.removeEventListener('novoacademy-admin-change', onChange)
  }, [])

  const navigate = (r) => {
    window.scrollTo(0, 0)
    setRoute(r)
  }

  const markCompleted = (id) => setCourseState(s => ({ ...s, [id]: { ...s[id], watched: true } }))
  const recordTest = (id, score, passed) => setCourseState(s => ({ ...s, [id]: { ...s[id], testScore: score, testPassed: passed || s[id].testPassed } }))

  const courseById = (id) => COURSES.find(c => c.id === id)

  const certifiedCourses = useMemo(() =>
    COURSES.filter(c => isCertified(c, courseState)).map(c => `${c.category}: ${c.topic}`),
  [courseState])

  if (route.name === 'course-landing') {
    const course = courseById(route.courseId)
    return <CourseLandingPage course={course} state={courseState[course.id]} navigate={navigate} onBack={() => navigate({ name: 'home' })} />
  }
  if (route.name === 'course-content') {
    const course = courseById(route.courseId)
    if (course.contentType === 'faq') {
      return <FaqPage course={course} state={courseState[course.id]}
        onComplete={() => { markCompleted(course.id); navigate({ name: 'course-landing', courseId: course.id }) }}
        onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
    }
    return <CourseContentPage course={course} state={courseState[course.id]}
      onComplete={() => { markCompleted(course.id); navigate({ name: 'course-landing', courseId: course.id }) }}
      onStartTest={() => navigate({ name: 'test', courseId: course.id })}
      onBack={() => navigate({ name: 'course-landing', courseId: course.id })}
      navigate={navigate} />
  }
  if (route.name === 'test') {
    const course = courseById(route.courseId)
    return <TestPage course={course}
      onSubmit={({ score, passed }) => {
        recordTest(course.id, score, passed)
        setLastTestResult({ courseId: course.id, score, passed })
        navigate({ name: 'test-result', courseId: course.id })
      }}
      onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
  }
  if (route.name === 'test-result') {
    const course = courseById(route.courseId)
    return <TestResultPage course={course} score={lastTestResult?.score || 0} passed={lastTestResult?.passed || false}
      navigate={navigate} onBack={() => navigate({ name: 'course-landing', courseId: course.id })} />
  }
  if (route.name === 'certificate') {
    return <CertificatePage name={route.isSample ? 'Maria Mustermann' : certName}
      courses={route.isSample ? SAMPLE_COURSE_LIST : certifiedCourses}
      isSample={route.isSample} onBack={() => navigate({ name: 'home' })} />
  }

  if (route.name === 'admin') {
    return (
      <div className="app">
        <Sidebar />
        <main className="main">
          <TopBar navigate={navigate} />
          <AdminPage onBack={() => navigate({ name: 'home' })} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <TopBar navigate={navigate} />
        <HomePage
          courseState={courseState}
          navigate={navigate}
          certName={certName}
          setCertName={setCertName}
          completedCertifiableCount={certifiedCourses.length}
          certifiedTitles={certifiedCourses}
        />
      </main>
    </div>
  )
}

/* ===================== TOP BAR (with admin gear) ===================== */
function TopBar({ navigate }) {
  return (
    <div className="topbar">
      <div className="page-title">
        <h1 className="page-title-logo"><span className="pt-novo">NOVO</span><span className="pt-academy">ACADEMY</span></h1>
      </div>
      <button
        className="topbar-admin"
        title="Admin — Kurse verwalten"
        onClick={() => navigate({ name: 'admin' })}
      >
        <Icon.Gear />
      </button>
    </div>
  )
}

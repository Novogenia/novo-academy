/**
 * Certificate PDF generator — overlays dynamic text on the empty design template.
 * Uses real Montserrat TTFs (Light / Regular / Medium / SemiBold / Bold)
 * embedded via @pdf-lib/fontkit, so the downloaded PDF matches the on-screen preview.
 *
 * Coordinate system: PDF default (origin bottom-left, Y goes up).
 * A4 portrait page in points: 595.28 × 841.89
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const A4_W = 595.28
const A4_H = 841.89

const COLOR_WINE = rgb(0x5e / 255, 0x00 / 255, 0x47 / 255)
const COLOR_BLACK = rgb(0.10, 0.10, 0.10)

/* Load all five Montserrat weights once; cache the bytes for re-use.
   BASE_URL handles the GitHub Pages subpath (e.g. /novo-academy/) */
const _BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
const FONT_URLS = {
  light:    `${_BASE}/fonts/Montserrat-Light.ttf`,
  regular:  `${_BASE}/fonts/Montserrat-Regular.ttf`,
  medium:   `${_BASE}/fonts/Montserrat-Medium.ttf`,
  semibold: `${_BASE}/fonts/Montserrat-SemiBold.ttf`,
  bold:     `${_BASE}/fonts/Montserrat-Bold.ttf`,
}
const CERT_TEMPLATE_URL = `${_BASE}/cert-template.pdf`
const fontBytesCache = {}
async function loadFontBytes(weight) {
  if (fontBytesCache[weight]) return fontBytesCache[weight]
  const res = await fetch(FONT_URLS[weight])
  if (!res.ok) throw new Error(`failed to fetch ${FONT_URLS[weight]}`)
  fontBytesCache[weight] = await res.arrayBuffer()
  return fontBytesCache[weight]
}

async function loadFonts(pdfDoc) {
  try {
    pdfDoc.registerFontkit(fontkit)
    const [light, regular, medium, semibold, bold] = await Promise.all(
      ['light', 'regular', 'medium', 'semibold', 'bold'].map(w =>
        loadFontBytes(w).then(b => pdfDoc.embedFont(b, { subset: true }))
      )
    )
    return { light, regular, medium, semibold, bold }
  } catch (e) {
    console.warn('Montserrat embed failed — falling back to Helvetica:', e.message)
    const r = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const b = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    return { light: r, regular: r, medium: r, semibold: b, bold: b }
  }
}

/**
 * Coordinates below were measured directly from the on-screen preview
 * (which renders the same cert-template.pdf via pdf.js) so the downloaded
 * PDF matches the on-screen layout 1:1.
 *
 * Conversion factor: 1 pt = 1.333 px (96 DPI), so 1 px = 0.75 pt.
 * Y values are baselines in PDF coordinates (origin bottom-left).
 */
export async function generateCertificatePdf({ name, courses, dateStr, lang = 'de' }) {
  const L = lang === 'en'
  const templateBytes = await fetch(CERT_TEMPLATE_URL).then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const page = pdfDoc.getPages()[0]
  const fonts = await loadFonts(pdfDoc)

  /* Helper: draw text */
  const draw = (text, { x, y, size, font, color = COLOR_BLACK, maxWidth, lineHeight }) => {
    page.drawText(text, { x, y, size, font, color, maxWidth, lineHeight })
  }

  // 1) NOVOGENIA — wine, Medium, 26pt
  draw('NOVOGENIA', {
    x: 52.5, y: 665, size: 26,
    font: fonts.medium, color: COLOR_WINE,
  })

  // 2) GENETIK COACH / GENETICS COACH — black, Bold, 48pt
  draw(L ? 'GENETICS COACH' : 'GENETIK COACH', {
    x: 52.5, y: 617.5, size: 48,
    font: fonts.bold, color: COLOR_BLACK,
  })

  // 3) "Dieses Zertifikat bestätigt, dass" — black, SemiBold, 9.7pt
  draw(L ? 'This certificate confirms that' : 'Dieses Zertifikat bestätigt, dass', {
    x: 52.5, y: 578, size: 9.7,
    font: fonts.semibold, color: COLOR_BLACK,
  })

  // 4) Recipient name — wine, Medium, 24pt (matches NOVOGENIA style, slightly smaller)
  draw(name || (L ? 'Jane Doe' : 'Maria Mustermann'), {
    x: 52.5, y: 549, size: 24,
    font: fonts.medium, color: COLOR_WINE,
  })

  // 5) Date sentence — black, SemiBold, 9.7pt with bold inline date
  // (drawn as parts so the date is bold and the rest is regular)
  const datePrefix = L ? 'On ' : 'Am '
  const dateBold = dateStr
  const dateSuffix = L
    ? ' successfully completed and passed the following training modules:'
    : ' erfolgreich die folgenden Schulungsmodule absolviert und bestanden hat:'
  let dx = 52.5
  const dy = 516
  const dsize = 9.7
  draw(datePrefix, { x: dx, y: dy, size: dsize, font: fonts.regular, color: COLOR_BLACK })
  dx += fonts.regular.widthOfTextAtSize(datePrefix, dsize)
  draw(dateBold, { x: dx, y: dy, size: dsize, font: fonts.bold, color: COLOR_BLACK })
  dx += fonts.bold.widthOfTextAtSize(dateBold, dsize)
  // The suffix may need to wrap. Use maxWidth so pdf-lib breaks at the right point.
  draw(dateSuffix, {
    x: dx, y: dy, size: dsize,
    font: fonts.regular, color: COLOR_BLACK,
    maxWidth: 540 - (dx - 52.5),  // remaining room on first line
    lineHeight: 13,
  })

  // 6) Module list — bullet • + "Category:" SemiBold + " Topic" Light
  const BULLET_X = 60
  const CAT_X = 70
  let y = 491
  const lineGap = 17
  const modSize = 9.7
  for (const c of courses) {
    const idx = c.indexOf(': ')
    const cat = idx > -1 ? c.slice(0, idx) : c
    const topic = idx > -1 ? c.slice(idx + 2) : ''
    page.drawCircle({ x: BULLET_X, y: y + 3, size: 1.4, color: COLOR_BLACK })
    const catText = `${cat}:`
    draw(catText, { x: CAT_X, y, size: modSize, font: fonts.semibold, color: COLOR_BLACK })
    if (topic) {
      const catWidth = fonts.semibold.widthOfTextAtSize(catText, modSize)
      draw(` ${topic}`, { x: CAT_X + catWidth, y, size: modSize, font: fonts.light, color: COLOR_BLACK })
    }
    y -= lineGap
  }

  // 7) "CEO von Novogenia" / "CEO of Novogenia" — small, Regular
  draw(L ? 'CEO of Novogenia' : 'CEO von Novogenia', {
    x: 78.7, y: 77, size: 10.5,
    font: fonts.regular, color: COLOR_BLACK,
  })

  return await pdfDoc.save()
}

/** Trigger a browser download of the generated PDF. */
export async function downloadCertificate({ name, courses, dateStr, lang = 'de' }) {
  const bytes = await generateCertificatePdf({ name, courses, dateStr, lang })
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const filenamePrefix = lang === 'en' ? 'NovoAcademy_Certificate' : 'NovoAcademy_Zertifikat'
  const fallback = lang === 'en' ? 'Example' : 'Beispiel'
  // Sanitise: only keep ASCII alphanumerics, dot, underscore, hyphen — protects
  // against path traversal / null bytes / invalid filename chars across OSes.
  const safeName = (name || fallback)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^[_.]+|[_.]+$/g, '')
    .slice(0, 80) || fallback
  link.download = `${filenamePrefix}_${safeName}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

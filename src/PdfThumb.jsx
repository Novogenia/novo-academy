import React, { useEffect, useRef } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Set the worker URL once at module load
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

/**
 * Renders the first page of a PDF as a canvas.
 * Uses range-requests + disableAutoFetch so only the bytes needed for page 1
 * are downloaded — no need to grab the full file just to make a thumbnail.
 */
export default function PdfThumb({ url, className = 'cc-doc-thumb' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let doc = null
    ;(async () => {
      try {
        const loadingTask = pdfjs.getDocument({
          url,
          disableStream: false,
          disableAutoFetch: true, // only fetch what's needed for page 1
        })
        doc = await loadingTask.promise
        const page = await doc.getPage(1)
        if (cancelled || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        // Render at 2× scale for crisp display in 228×132 box
        const viewport = page.getViewport({ scale: 1.2 })
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
      } catch (err) {
        // Silent fallback — caller can render an icon instead if canvas stays empty
        console.warn('[PdfThumb] could not render', url, err?.message)
      }
    })()
    return () => {
      cancelled = true
      if (doc) doc.destroy()
    }
  }, [url])

  // Wrap the canvas so the rendered PDF page keeps its aspect ratio while the box
  // stays at the consistent 228×132 thumbnail size (top of the page is shown).
  return (
    <div className={`${className} pdf-thumb`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

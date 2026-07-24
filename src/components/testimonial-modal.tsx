import { useEffect, useRef, useState } from 'react'
import type { Testimonial } from '@/types/content.types'

interface TestimonialModalProps {
  testimonial: Testimonial | null
  onClose: () => void
}

export function TestimonialModal({ testimonial, onClose }: TestimonialModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [rendered, setRendered] = useState<Testimonial | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (testimonial) {
      setRendered(testimonial)
      dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [testimonial])

  return (
    <dialog
      ref={dialogRef}
      className="testimonial-modal"
      aria-label={rendered ? `Testimonio de ${rendered.n}` : undefined}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      onTransitionEnd={(e) => {
        if (e.target === dialogRef.current && !dialogRef.current?.open) {
          setRendered(null)
        }
      }}
    >
      {rendered && (
        <div className="relative bg-neutral-50 flex flex-col" style={{ borderRadius: '14px' }}>
          <div className="flex items-start justify-between gap-3 p-6 pb-0 pr-14 md:p-8 md:pb-0 md:pr-16">
            <div className="text-status-amber" style={{ fontSize: '15px', letterSpacing: '3px' }}>
              ★★★★★
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="overflow-y-auto p-6 pt-4 md:p-8 md:pt-4">
            <p
              className="font-serif text-brand-900"
              style={{ fontSize: '18px', lineHeight: 1.6, margin: 0, textWrap: 'pretty' }}
            >
              {rendered.q}
            </p>

            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-neutral-200">
              <div
                className="flex items-center justify-center rounded-full font-semibold text-[15px] bg-brand-200 text-brand-800 shrink-0"
                style={{ width: '38px', height: '38px' }}
              >
                {rendered.i}
              </div>
              <div className="text-sm font-semibold text-neutral-700">{rendered.n}</div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

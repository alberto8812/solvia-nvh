import { useEffect, useRef, useState } from 'react'
import { contact } from '@/data'
import { Badge, Eyebrow, IconRow } from '@/components/ui'
import { formatDate } from '@/lib/format'
import type { JobOpening } from '@/types/content.types'

interface JobModalProps {
  job: JobOpening | null
  onClose: () => void
}

export function JobModal({ job, onClose }: JobModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [rendered, setRendered] = useState<JobOpening | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (job) {
      setRendered(job)
      dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [job])

  return (
    <dialog
      ref={dialogRef}
      className="job-modal"
      aria-label={rendered?.title}
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
        <div className="relative bg-neutral-50 flex flex-col h-full" style={{ borderRadius: '14px' }}>
          {/* Header — stays put; the body scrolls independently, so the close
              button and title are always reachable regardless of description length. */}
          <div className="flex items-start justify-between gap-3 p-6 pb-0 pr-14 md:p-8 md:pb-0 md:pr-16 shrink-0">
            <h2
              className="font-sans font-semibold text-brand-900"
              style={{ fontSize: '21px', letterSpacing: '-0.01em', margin: 0 }}
            >
              {rendered.title}
            </h2>
            <Badge>{rendered.modality}</Badge>
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

          {/* Body — the only scrollable region, capped by .job-modal's max-height.
              min-h-0 overrides the flex-item default (min-height:auto) that would
              otherwise let this grow past the parent and defeat overflow-y-auto. */}
          <div className="overflow-y-auto flex-1 min-h-0 flex flex-col p-6 pt-4 md:p-8 md:pt-4">
            <IconRow icon="home">{rendered.location}</IconRow>

            <Eyebrow size="sm" className="mt-1">
              Publicado el {formatDate(rendered.publishedAt, 'long')}
            </Eyebrow>

            <p className="text-[15px] leading-[1.6] text-neutral-600 mt-5" style={{ textWrap: 'pretty' }}>
              {rendered.description}
            </p>

            {rendered.salary && (
              <div className="mt-5 pt-5 border-t border-neutral-200">
                <Eyebrow size="sm" className="mb-1">
                  Salario
                </Eyebrow>
                <div className="text-[15px] font-medium text-brand-900">{rendered.salary}</div>
              </div>
            )}

            {/* Pinned to the body's bottom edge when content is short — so the
                fixed-size modal reads as a deliberate layout, not empty leftover
                space, regardless of description length. */}
            <div className="mt-auto pt-5 border-t border-neutral-200">
              <Eyebrow size="sm" className="mb-3">
                Contacto
              </Eyebrow>
              <div className="flex flex-col gap-2.5">
                <IconRow
                  icon="phone"
                  iconSize={15}
                  iconClassName="stroke-brand-600"
                  gapClassName="gap-2.5"
                  textClassName="text-[14px] text-neutral-600"
                  href={contact.telHref}
                >
                  {contact.phone}
                </IconRow>
                <IconRow
                  icon="mail"
                  iconSize={15}
                  iconClassName="stroke-brand-600"
                  gapClassName="gap-2.5"
                  textClassName="text-[14px] text-neutral-600"
                >
                  {contact.email}
                </IconRow>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

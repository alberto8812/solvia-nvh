import { useEffect, useRef, useState } from 'react'
import { legal } from '@/data'
import { Eyebrow, Icon } from '@/components/ui'

interface ComplianceModalProps {
  documentId: string | null
  onClose: () => void
}

export function ComplianceModal({ documentId, onClose }: ComplianceModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [renderedId, setRenderedId] = useState<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (documentId) {
      setRenderedId(documentId)
      dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [documentId])

  const doc = legal.documents.find((d) => d.id === renderedId)

  return (
    <dialog
      ref={dialogRef}
      className="compliance-modal"
      aria-label={doc?.title}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      onTransitionEnd={(e) => {
        if (e.target === dialogRef.current && !dialogRef.current?.open) {
          setRenderedId(null)
        }
      }}
    >
      {doc && (
        <div className="relative bg-neutral-50 flex flex-col h-full" style={{ borderRadius: '14px' }}>
          {/* Header — fixed, separated from the scrolling body by a hairline
              (not decorative: it's the only visual cue the title stays put
              while dense legal text scrolls underneath it). The shield chip
              echoes the BCB trust badge in the footer, so the document reads
              as regulatory material the moment the modal opens. */}
          <div className="flex items-start gap-3.5 p-6 pb-5 pr-14 md:p-8 md:pb-5 md:pr-16 border-b border-neutral-100 shrink-0">
            <div
              className="flex items-center justify-center shrink-0 bg-brand-50 text-brand-700"
              style={{ width: '38px', height: '38px', borderRadius: '10px' }}
            >
              <Icon name="shield" size={18} />
            </div>
            <div>
              <Eyebrow size="sm">Atualizado: {doc.updatedAt}</Eyebrow>
              <h2
                className="font-sans font-semibold text-brand-900 mt-1"
                style={{ fontSize: '20px', letterSpacing: '-0.01em', lineHeight: 1.25, margin: 0 }}
              >
                {doc.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Body — each section keyed to its own numbered badge (same
              font-mono index-badge language as the FAQ accordion) instead of
              inline "1. Objetivo" text, so a 6-7 section legal document scans
              like a list, not a wall of prose. Hairline dividers between
              sections do the section-break work that spacing alone can't
              carry across this much body text.
              `legal-scroll` gives the scrollbar itself a visible thin thumb
              (reused from the old legal document viewer) and the edge mask
              fades the top/bottom few pixels of content — together they're
              the only cue, on a fixed-height panel, that there's more to
              scroll to when a document runs to 6-7 sections. */}
          <div
            className="legal-scroll overflow-y-auto flex-1 min-h-0 px-6 pt-5 pb-6 md:px-8 md:pt-6 md:pb-8"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)',
            }}
          >
            {doc.sections.map((section, index) => {
              const [, number, heading] = section.heading.match(/^(\d+)\.\s*(.*)$/) ?? [null, null, section.heading]
              return (
                <div
                  key={section.heading}
                  className={index > 0 ? 'mt-5 pt-5 border-t border-neutral-100' : ''}
                >
                  <div className="flex items-baseline gap-2.5">
                    {number && (
                      <span
                        className="shrink-0 flex items-center justify-center font-mono text-[11px] font-medium bg-neutral-100 text-neutral-500"
                        style={{ width: '22px', height: '22px', borderRadius: '6px' }}
                      >
                        {number}
                      </span>
                    )}
                    <h3 className="font-sans font-semibold text-[15px] text-brand-900">
                      {heading}
                    </h3>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-neutral-600" style={{ textWrap: 'pretty' }}>
                    {section.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </dialog>
  )
}

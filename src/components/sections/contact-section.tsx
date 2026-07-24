import { motion } from 'motion/react'
import { contact } from '@/data'
import { slideInLeft, slideInRight } from '@/components/motion'
import { Button, Container } from '@/components/ui'
import { openSolviaChat } from '@/lib/chat-bridge'

const VP = { once: true, amount: 0.2 } as const

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
    <path d="M4 4h16v12H8l-4 4V4z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ContactSection() {
  return (
    <section
      id="contacto"
      className="bg-neutral-100 border-t border-neutral-200 py-14 md:py-[76px]"
    >
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: info — slides from left */}
        <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={VP}>
          <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
            {contact.eyebrow}
          </div>
          <h2
            className="font-sans font-semibold text-brand-900"
            style={{
              fontSize: 'clamp(26px, 6vw, 34px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
              margin: '14px 0 18px',
              textWrap: 'balance',
            }}
          >
            {contact.headline}{' '}
            <span className="font-serif italic font-medium">{contact.headlineItalic}</span>
          </h2>
          <p
            className="text-base leading-[1.65] text-neutral-600"
            style={{ margin: '0 0 28px', maxWidth: '400px' }}
          >
            {contact.subtext}
          </p>

          {/* Contact details */}
          <div
            className="flex flex-col gap-3 pt-[22px] border-t border-neutral-200"
          >
            <a
              href={contact.telHref}
              className="flex items-center gap-3 text-[15px] no-underline hover:text-brand-900 transition-colors text-neutral-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="stroke-brand-600">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
              </svg>
              {contact.phone}
            </a>
            <div className="flex items-center gap-3 text-[15px] text-neutral-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="stroke-brand-600">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {contact.email}
            </div>
          </div>
        </motion.div>

        {/* Right: chat preview card — slides from right */}
        <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={VP}>
          <div className="solvia-card flex flex-col rounded-xl bg-neutral-50 border border-neutral-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-900 text-on-brand font-serif italic text-lg">
                {contact.assistantName.charAt(0)}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-brand-900 leading-tight">
                  {contact.assistantName}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-whatsapp" />
                  Online · {contact.assistantRole}
                </div>
              </div>
            </div>
            <p className="text-[15px] leading-[1.6] m-0 mb-6 text-neutral-600">
              {contact.greeting}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={openSolviaChat}
              icon={<ChatIcon />}
              className="justify-center w-full"
            >
              Conversar com {contact.assistantName}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

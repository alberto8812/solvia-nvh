import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { contact, jobApplication, jobs } from '@/data'
import { Button } from '@/components/ui'
import { CHAT_OPEN_EVENT, type ChatOpenSeed } from '@/lib/chat-bridge'

const PANEL_EASE = [0.23, 1, 0.32, 1] as const

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.05 21.5h-.04a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1 14.6-11.62 9.34 9.34 0 0 1 2.75 6.66 9.42 9.42 0 0 1-9.4 9.4zM20.06 3.9A11.34 11.34 0 0 0 2.2 17.58L.5 23.75l6.33-1.66a11.32 11.32 0 0 0 5.22 1.33h.01a11.35 11.35 0 0 0 8-19.52z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
  </svg>
)

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full bg-on-brand/15 text-on-brand font-serif italic"
      style={{ width: size, height: size, fontSize: size * 0.44 }}
    >
      {contact.assistantName.charAt(0)}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="self-start flex items-center gap-1 rounded-2xl rounded-bl-sm bg-neutral-100 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400 chat-typing-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-start max-w-[82%] rounded-2xl rounded-bl-sm bg-neutral-100 text-neutral-700 text-[13.5px] leading-[1.5] px-3.5 py-2.5">
      {children}
    </div>
  )
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-end max-w-[82%] rounded-2xl rounded-br-sm bg-brand-900 text-on-brand text-[13.5px] leading-[1.5] px-3.5 py-2.5">
      {children}
    </div>
  )
}

type ChatMode = 'loan' | 'application'

interface WidgetQuestion {
  id: string
  label: string
  type: 'text' | 'boolean' | 'choice'
  options?: string[]
}

interface ChatState {
  open: boolean
  teaser: 'pending' | 'shown' | 'dismissed'
  mode: ChatMode
  jobTitle?: string
  questions: WidgetQuestion[]
  step: number
  answers: Record<string, string>
  inputValue: string
  typing: boolean
  done: boolean
  monto?: string
  plazoDias?: number
  turnstileToken: string | null
}

const VACANTE_QUESTION_ID = 'vacante'

function activeJobTitles() {
  return jobs.filter((job) => job.active).map((job) => `${job.title} — ${job.location}`)
}

function buildQuestions(mode: ChatMode, jobTitle: string | undefined): WidgetQuestion[] {
  if (mode === 'loan') return contact.questions
  if (jobTitle) return jobApplication.questions
  const options = activeJobTitles()
  return [
    {
      id: VACANTE_QUESTION_ID,
      label: 'A qual vaga você gostaria de se candidatar?',
      type: 'choice',
      options: options.length ? options : ['Outra vaga'],
    },
    ...jobApplication.questions,
  ]
}

function initialState(mode: ChatMode, jobTitle?: string): ChatState {
  return {
    open: false,
    teaser: 'pending',
    mode,
    jobTitle,
    questions: buildQuestions(mode, jobTitle),
    step: 0,
    answers: {},
    inputValue: '',
    typing: true,
    done: false,
    turnstileToken: null,
  }
}

export function FloatingChatWidget() {
  const location = useLocation()
  const routeMode: ChatMode = location.pathname.startsWith('/careers') ? 'application' : 'loan'
  const routeModeRef = useRef(routeMode)

  const [chat, setChat] = useState<ChatState>(() => initialState(routeMode))
  const bottomRef = useRef<HTMLDivElement>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    routeModeRef.current = routeMode
  }, [routeMode])

  // Keep the idle (closed) widget's mode synced to the current route, so the
  // teaser/greeting shown before the first open already match the page —
  // but never touch an in-progress or open conversation.
  useEffect(() => {
    setChat((prev) => {
      if (prev.open || prev.mode === routeMode) return prev
      return initialState(routeMode)
    })
  }, [routeMode, chat.open])

  useEffect(() => {
    const teaserTimer = setTimeout(() => {
      setChat((prev) => (prev.open || prev.teaser !== 'pending' ? prev : { ...prev, teaser: 'shown' }))
    }, 3200)
    return () => clearTimeout(teaserTimer)
  }, [])

  useEffect(() => {
    const openFromEvent = (e: Event) => {
      const detail = (e as CustomEvent<ChatOpenSeed>).detail
      const mode = detail?.mode ?? routeModeRef.current
      const jobTitle = detail?.jobTitle

      setChat((prev) => {
        const contextChanged = prev.mode !== mode || prev.jobTitle !== jobTitle
        const shouldReset = contextChanged || prev.done

        if (shouldReset) {
          return {
            ...initialState(mode, jobTitle),
            open: true,
            teaser: 'dismissed',
            monto: detail?.monto ?? prev.monto,
            plazoDias: detail?.plazoDias ?? prev.plazoDias,
          }
        }

        return {
          ...prev,
          open: true,
          teaser: 'dismissed',
          monto: detail?.monto ?? prev.monto,
          plazoDias: detail?.plazoDias ?? prev.plazoDias,
        }
      })
    }
    window.addEventListener(CHAT_OPEN_EVENT, openFromEvent)
    return () => window.removeEventListener(CHAT_OPEN_EVENT, openFromEvent)
  }, [])

  useEffect(() => {
    if (!chat.open || !chat.typing) return
    const t = setTimeout(() => setChat((prev) => ({ ...prev, typing: false })), 650)
    return () => clearTimeout(t)
  }, [chat.open, chat.typing, chat.step, chat.done])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chat.step, chat.done, chat.typing])

  // Client-side only: no backend to verify the token server-side, so this only
  // filters headless/simple bots, not a bot that calls the wa.me link directly.
  useEffect(() => {
    if (!chat.open || !chat.done) return
    setChat((prev) => (prev.turnstileToken === null ? prev : { ...prev, turnstileToken: null }))

    let cancelled = false
    let pollId: ReturnType<typeof setInterval> | null = null

    const tryRenderWidget = () => {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile) return false
      const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
      if (!siteKey) return false
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token) => setChat((prev) => ({ ...prev, turnstileToken: token })),
        'expired-callback': () => setChat((prev) => ({ ...prev, turnstileToken: null })),
      })
      return true
    }

    if (!tryRenderWidget()) {
      pollId = setInterval(() => {
        if (tryRenderWidget() && pollId) clearInterval(pollId)
      }, 150)
    }

    return () => {
      cancelled = true
      if (pollId) clearInterval(pollId)
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [chat.open, chat.done])

  const currentQuestion = chat.questions[chat.step]
  const isApplication = chat.mode === 'application'
  const greeting = isApplication ? jobApplication.greeting : contact.greeting
  const teaserText = isApplication ? jobApplication.teaser : contact.teaser

  function answer(value: string) {
    const trimmed = value.trim()
    if (!trimmed || !currentQuestion) return
    const nextAnswers = { ...chat.answers, [currentQuestion.id]: trimmed }
    const isLast = chat.step + 1 >= chat.questions.length
    setChat((prev) => ({
      ...prev,
      step: isLast ? prev.step : prev.step + 1,
      answers: nextAnswers,
      jobTitle: currentQuestion.id === VACANTE_QUESTION_ID ? trimmed : prev.jobTitle,
      inputValue: '',
      typing: true,
      done: isLast,
    }))
  }

  const waText = isApplication
    ? [
        chat.jobTitle
          ? jobApplication.waIntroTemplate.replace('{jobTitle}', chat.jobTitle)
          : jobApplication.waIntroGeneric,
        '',
        ...chat.questions
          .filter((q) => q.id !== VACANTE_QUESTION_ID)
          .map((q) => `${q.label}: ${chat.answers[q.id] ?? ''}`),
      ].join('\n')
    : [
        contact.waIntro,
        '',
        ...(chat.monto ? [`Valor solicitado: ${chat.monto}`] : []),
        ...(chat.plazoDias ? [`Produto: ${chat.plazoDias} dias`] : []),
        ...(chat.monto || chat.plazoDias ? [''] : []),
        ...chat.questions.map((q) => `${q.label}: ${chat.answers[q.id] ?? ''}`),
      ].join('\n')
  const waHref = `https://wa.me/${contact.waNumber}?text=${encodeURIComponent(waText)}`

  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {chat.open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: PANEL_EASE }}
            style={{ transformOrigin: 'bottom right', maxHeight: 'min(600px, calc(100vh - 96px))' }}
            className="flex flex-col w-[min(360px,92vw)] rounded-2xl bg-neutral-50 shadow-2xl border border-neutral-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-brand-900">
              <Avatar />
              <div className="flex-1 min-w-0">
                <div className="text-on-brand text-[14px] font-semibold leading-tight">
                  {contact.assistantName}
                </div>
                <div className="flex items-center gap-1.5 text-brand-200 text-[11px] leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-whatsapp" />
                  Online · {contact.assistantRole}
                </div>
                {isApplication && chat.jobTitle && (
                  <div className="text-brand-300 text-[11px] leading-tight mt-0.5 truncate">
                    Candidatura: {chat.jobTitle}
                  </div>
                )}
              </div>
              <button
                onClick={() => setChat((prev) => ({ ...prev, open: false }))}
                aria-label="Fechar chat"
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-brand-200 hover:bg-on-brand/10 hover:text-on-brand transition-colors duration-200 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {chat.done ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: PANEL_EASE }}
                  className="flex flex-col"
                >
                  <p className="text-[13.5px] leading-[1.6] m-0 px-4 pt-4 pb-3 text-neutral-600 shrink-0">
                    Revise suas respostas antes de enviá-las:
                  </p>

                  {/* Independently scrollable, capped regardless of question
                      count — the send action below must always stay
                      reachable, whether there are 3 answers or 12. */}
                  <ul
                    className="overflow-y-auto flex flex-col gap-2 px-4 text-[13.5px] text-neutral-600"
                    style={{
                      paddingLeft: '16px',
                      listStyle: 'none',
                      maxHeight: '272px',
                      maskImage: 'linear-gradient(to bottom, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)',
                    }}
                  >
                    {chat.monto && (
                      <li className="flex flex-col gap-0.5 py-2 border-b border-neutral-100">
                        <span className="text-[11.5px] text-neutral-400">Valor solicitado</span>
                        <span className="text-brand-900 font-medium">{chat.monto}</span>
                      </li>
                    )}
                    {chat.plazoDias && (
                      <li className="flex flex-col gap-0.5 py-2 border-b border-neutral-100">
                        <span className="text-[11.5px] text-neutral-400">Produto</span>
                        <span className="text-brand-900 font-medium">{chat.plazoDias} dias</span>
                      </li>
                    )}
                    {chat.questions.map((q) => (
                      <li key={q.id} className="flex flex-col gap-0.5 py-2 border-b border-neutral-100 last:border-0">
                        <span className="text-[11.5px] text-neutral-400">{q.label}</span>
                        <span className="text-brand-900 font-medium">{chat.answers[q.id]}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="shrink-0 px-4 pt-3 pb-4 border-t border-neutral-100">
                    <div ref={turnstileContainerRef} className="flex justify-center mb-3.5" />
                    <Button
                      variant="whatsapp"
                      size="lg"
                      href={chat.turnstileToken ? waHref : undefined}
                      target={chat.turnstileToken ? '_blank' : undefined}
                      rel={chat.turnstileToken ? 'noopener noreferrer' : undefined}
                      icon={<WaIcon />}
                      className={`justify-center w-full ${chat.turnstileToken ? '' : 'opacity-50 pointer-events-none'}`}
                    >
                      Enviar pelo WhatsApp
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col"
                >
                  <div
                    className="flex flex-col gap-2.5 px-4 py-4"
                    style={{ maxHeight: '340px', overflowY: 'auto' }}
                  >
                    <BotBubble>{greeting}</BotBubble>
                    {chat.questions.slice(0, chat.step).map((q) => (
                      <div key={q.id} className="flex flex-col gap-2.5">
                        <BotBubble>{q.label}</BotBubble>
                        <UserBubble>{chat.answers[q.id]}</UserBubble>
                      </div>
                    ))}
                    {chat.typing ? (
                      <TypingDots />
                    ) : (
                      currentQuestion && <BotBubble>{currentQuestion.label}</BotBubble>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <div className="px-3 py-3 border-t border-neutral-100">
                    {chat.typing ? (
                      <div className="h-10" />
                    ) : currentQuestion?.type === 'boolean' ? (
                      <div className="flex gap-2">
                        {['Sí', 'No'].map((option) => (
                          <button
                            key={option}
                            onClick={() => answer(option)}
                            className="font-medium text-sm px-5 py-2.5 rounded-full cursor-pointer transition-colors duration-200 border border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-brand-900 hover:bg-brand-900 hover:text-on-brand"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : currentQuestion?.type === 'choice' ? (
                      <div className="flex flex-col gap-2">
                        {(currentQuestion.options ?? []).map((option) => (
                          <button
                            key={option}
                            onClick={() => answer(option)}
                            className="font-medium text-sm px-4 py-2.5 rounded-lg text-left cursor-pointer transition-colors duration-200 border border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-brand-900 hover:bg-brand-900 hover:text-on-brand"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          answer(chat.inputValue)
                        }}
                        className="flex gap-2"
                      >
                        <input
                          autoFocus
                          type="text"
                          value={chat.inputValue}
                          onChange={(e) => setChat((prev) => ({ ...prev, inputValue: e.target.value }))}
                          placeholder="Escreva sua resposta..."
                          className="solvia-input flex-1 rounded-md text-[14px] font-sans border border-neutral-300 bg-neutral-50 text-brand-900"
                          style={{ padding: '9px 12px' }}
                        />
                        <button
                          type="submit"
                          aria-label="Enviar resposta"
                          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-brand-900 text-on-brand cursor-pointer hover:bg-brand-800 transition-colors duration-200"
                        >
                          <SendIcon />
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!chat.open && chat.teaser === 'shown' && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: PANEL_EASE }}
            style={{ transformOrigin: 'bottom right' }}
            className="relative max-w-[240px] rounded-2xl rounded-br-sm bg-neutral-50 shadow-lg border border-neutral-200 pl-4 pr-7 py-3 text-[13.5px] text-neutral-700 cursor-pointer"
            onClick={() => setChat((prev) => ({ ...prev, open: true, teaser: 'dismissed' }))}
          >
            {teaserText}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setChat((prev) => ({ ...prev, teaser: 'dismissed' }))
              }}
              aria-label="Fechar aviso"
              className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200 cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" stroke="currentColor">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setChat((prev) => ({ ...prev, open: !prev.open, teaser: 'dismissed' }))}
        aria-label={chat.open ? 'Fechar chat' : 'Abrir chat'}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-on-brand cursor-pointer transition-colors duration-200"
        style={{ boxShadow: 'var(--shadow-whatsapp)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={chat.open ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {chat.open ? <CloseIcon /> : <WaIcon />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

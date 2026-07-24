import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToHash() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // On a hard/direct load, the browser already scrolls to the fragment (or
    // top) natively — skip that first render so we don't double-scroll.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!hash) {
      // Client-side route change with no anchor (e.g. navbar "Trabalhe
      // conosco" to /careers) — the SPA doesn't reload, so the browser keeps
      // whatever scroll position the previous page was at unless we reset it.
      window.scrollTo(0, 0)
      return
    }

    const id = hash.slice(1)

    // The page transition in Layout delays the new route's mount past this
    // effect's commit (it waits for the outgoing page's exit animation), so
    // the target section may not exist yet — poll until it does instead of
    // giving up (e.g. navigating from /careers to /#servicios).
    let pollId: ReturnType<typeof setInterval> | null = null
    let attempts = 0
    const MAX_ATTEMPTS = 40 // ~2s at 50ms, well past the 0.28s exit animation
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView({ behavior: 'smooth' })
      return true
    }

    if (!tryScroll()) {
      pollId = setInterval(() => {
        attempts += 1
        if ((tryScroll() || attempts >= MAX_ATTEMPTS) && pollId) {
          clearInterval(pollId)
          pollId = null
        }
      }, 50)
    }

    return () => {
      if (pollId) clearInterval(pollId)
    }
  }, [pathname, hash])

  return null
}

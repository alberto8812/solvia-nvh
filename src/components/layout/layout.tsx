import { useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useLocation, useOutlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingChatWidget } from "@/components/floating-chat-widget";
import { ScrollToHash } from "@/lib/scroll-to-hash";
import { EASE } from "@/components/motion";

export function Layout() {
  const { pathname } = useLocation();
  // useOutlet (not <Outlet />) captures the current route's element so it can be
  // keyed and handed to AnimatePresence — <Outlet /> swaps immediately on
  // navigation and gives exit animations nothing to animate.
  const element = useOutlet();

  // Tracks only the very first paint of the whole app. Skipping the route
  // wrapper's own enter fade on that first paint used to be done via
  // `<AnimatePresence initial={false}>`, but that prop leaks through
  // PresenceContext to every descendant motion component — including each
  // section's `whileInView` — silencing their entrance animations on first
  // load. Scoping the flag to this local ref keeps it off AnimatePresence
  // entirely, so it only affects this one motion.div, on this one render.
  const isFirstRenderRef = useRef(true);
  const isFirstRender = isFirstRenderRef.current;
  isFirstRenderRef.current = false;

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <ScrollToHash />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={isFirstRender ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {element}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <FloatingChatWidget />
    </MotionConfig>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { videos } from "@/data";
import type { VideoItem } from "@/types/content.types";
import { fadeUp, staggerContainer, staggerItem } from "@/components/motion";
import { Container } from "@/components/ui";

const VP = { once: true, amount: 0.2 } as const;

export function VideosSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [openVideo, setOpenVideo] = useState<VideoItem | null>(null);

  return (
    <section
      id="videos"
      className="bg-brand-50 border-t border-neutral-200 py-14 md:py-[76px]"
    >
      <Container>
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className="font-mono text-xs tracking-[.14em] uppercase text-brand-600">
            Experiências em vídeo
          </div>
          <h2
            className="font-sans font-semibold mt-[14px] text-brand-900"
            style={{
              fontSize: "clamp(26px, 6vw, 34px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              maxWidth: "560px",
              textWrap: "balance",
              marginBottom: "10px",
            }}
          >
            Conheça-nos{" "}
            <span className="font-serif italic font-medium">melhor.</span>
          </h2>
          <p className="text-[15px] m-0 mb-10 text-neutral-500">
            Passe o cursor para ver uma prévia — clique para assistir completo.
          </p>
        </motion.div>

        {/* Cards — stagger entrance, CSS hover preserved */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {videos.map((v, i) => (
            <motion.div key={v.t} variants={staggerItem}>
              <VideoCard
                video={v}
                isActive={activeIdx === i}
                onEnter={() => setActiveIdx(i)}
                onLeave={() => setActiveIdx(null)}
                onOpen={() => setOpenVideo(v)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
}

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
}

function VideoCard({
  video,
  isActive,
  onEnter,
  onLeave,
  onOpen,
}: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={`Ver vídeo completo: ${video.t}`}
      className="group relative block w-full cursor-pointer overflow-hidden border border-neutral-200 bg-brand-900 p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
      style={{
        aspectRatio: "16/10",
        borderRadius: "10px",
        transition: "transform 0.28s cubic-bezier(0.2,0.8,0.2,1)",
        transform: isActive ? "scale(1.02)" : "scale(1)",
      }}
    >
      <img
        src={video.poster}
        alt={video.t}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{
          opacity: isActive ? 0.7 : 0.85,
          filter: isActive
            ? "saturate(1) brightness(0.85)"
            : "saturate(0.8) brightness(0.75)",
        }}
        loading="lazy"
      />

      <div
        className="absolute left-3 bottom-3 flex items-center gap-[9px] rounded-full px-3.5 py-2 transition-all duration-300 bg-neutral-50/94"
        style={{
          boxShadow: "var(--shadow-brand-md)",
          transform: isActive ? "scale(1.05)" : "scale(1)",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          className="fill-brand-800"
          style={{ marginLeft: "1px" }}
        >
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
        <span className="font-mono text-xs font-medium text-brand-900">
          {video.t}
        </span>
      </div>
    </button>
  );
}

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rendered, setRendered] = useState<VideoItem | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (video) {
      setRendered(video);
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [video]);

  return (
    <dialog
      ref={dialogRef}
      className="video-modal"
      aria-label={rendered?.t}
      onClose={() => {
        // The dialog can visually linger for the fade-out transition, but
        // the "close" event fires immediately for every close path (button,
        // Escape, backdrop) — pause here so audio/video never keeps running
        // behind a hidden modal.
        videoRef.current?.pause();
        onClose();
      }}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      onTransitionEnd={(e) => {
        if (e.target === dialogRef.current && !dialogRef.current?.open) {
          setRendered(null);
        }
      }}
    >
      {rendered && (
        <div className="relative">
          <video
            ref={videoRef}
            key={rendered.url}
            src={rendered.url}
            poster={rendered.poster}
            controls
            autoPlay
            playsInline
            className="block w-full bg-neutral-800"
            style={{
              borderRadius: "20px",
              aspectRatio: "9/16",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />

          <div
            className="absolute left-4 top-4 flex items-center gap-[9px] rounded-full px-3.5 py-2 bg-neutral-50/94"
            style={{ boxShadow: "var(--shadow-brand-md)" }}
          >
            <span className="font-mono text-xs font-medium text-brand-900">
              {rendered.t}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Fechar vídeo"
            className="absolute -right-2 -top-2 sm:right-3 sm:top-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-50/94 text-brand-900 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            style={{ boxShadow: "var(--shadow-brand-md-strong)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Project } from '../data/projects';

interface ProjectMediaProps {
  project: Project;
  /** card: loop plays while hovered or focused. study: loops on its own, with a pause button. */
  mode: 'card' | 'study';
  className?: string;
  /** Lazy-load the poster image (cards below the fold). */
  lazy?: boolean;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

/** MP4 first (small, hardware decoded), then a WebM copy next to it for browsers without H.264. */
const Sources: React.FC<{ src: string }> = ({ src }) => (
  <>
    <source src={src} type="video/mp4" />
    <source src={src.replace(/\.mp4$/, '.webm')} type="video/webm" />
  </>
);

/**
 * A project screenshot with a short screen recording of the demo on top.
 * The still image is always underneath, so the card looks right before (and without) the video.
 */
const ProjectMedia: React.FC<ProjectMediaProps> = ({ project, mode, className = '', lazy = true }) => {
  const box = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = !!(project.videoLight && project.videoDark);

  /** The <video> for the current theme is the one that is actually displayed. */
  const visibleVideo = useCallback(() => {
    const vids = box.current?.querySelectorAll('video') ?? [];
    return Array.from(vids).find((v) => v.offsetParent !== null) ?? null;
  }, []);

  const play = useCallback(() => {
    const v = visibleVideo();
    if (!v) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [visibleVideo]);

  const stop = useCallback(() => {
    box.current?.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
    setPlaying(false);
  }, []);

  // Card: play on hover or keyboard focus of the whole card, never on touch or with reduced motion.
  useEffect(() => {
    if (mode !== 'card' || !hasVideo) return;
    const host = box.current?.closest<HTMLElement>('[data-media-host]');
    if (!host || prefersReducedMotion() || !canHover()) return;
    const onIn = () => play();
    const onOut = (e: Event) => {
      if (e instanceof FocusEvent && host.contains(e.relatedTarget as Node | null)) return;
      stop();
    };
    host.addEventListener('pointerenter', onIn);
    host.addEventListener('pointerleave', onOut);
    host.addEventListener('focusin', onIn);
    host.addEventListener('focusout', onOut);
    return () => {
      host.removeEventListener('pointerenter', onIn);
      host.removeEventListener('pointerleave', onOut);
      host.removeEventListener('focusin', onIn);
      host.removeEventListener('focusout', onOut);
    };
  }, [mode, hasVideo, play, stop]);

  // Case study: start on its own unless reduced motion is requested; pause when the page is hidden.
  useEffect(() => {
    if (mode !== 'study' || !hasVideo || prefersReducedMotion()) return;
    play();
    const onVis = () => (document.hidden ? visibleVideo()?.pause() : visibleVideo()?.play().catch(() => undefined));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [mode, hasVideo, play, visibleVideo, project.id]);

  const toggle = () => {
    const v = visibleVideo();
    if (!v) return;
    if (v.paused) play();
    else {
      v.pause();
      setPlaying(false);
    }
  };

  // In a tilting card the picture slides against the tilt (see .pmedia in index.css).
  const img = `absolute inset-0 h-full w-full object-cover object-top ${mode === 'card' ? 'pmedia' : ''}`;
  const vid = `${img} transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div ref={box} className={`relative aspect-[16/10] w-full overflow-hidden ${className}`}>
      <img
        src={project.imageLight}
        alt={mode === 'study' ? `${project.title} screenshot` : project.title}
        width={project.imageWidth}
        height={project.imageHeight}
        loading={lazy ? 'lazy' : 'eager'}
        className={`${img} dark:hidden`}
      />
      <img
        src={project.imageDark}
        alt=""
        aria-hidden
        width={project.imageWidth}
        height={project.imageHeight}
        loading={lazy ? 'lazy' : 'eager'}
        className={`${img} hidden dark:block`}
      />
      {hasVideo && (
        <>
          <video
            key={project.videoLight}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden
            className={`${vid} dark:hidden`}
          >
            <Sources src={project.videoLight!} />
          </video>
          <video
            key={project.videoDark}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden
            className={`${vid} hidden dark:block`}
          >
            <Sources src={project.videoDark!} />
          </video>
        </>
      )}
      {mode === 'study' && hasVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause the demo recording' : 'Play the demo recording'}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-black/70 px-3.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? 'Pause' : 'Play'}
        </button>
      )}
    </div>
  );
};

export default ProjectMedia;

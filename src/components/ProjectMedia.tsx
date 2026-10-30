import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Project } from '../data/projects';
import { useTheme } from '../lib/theme';

interface ProjectMediaProps {
  project: Project;
  mode: 'card' | 'study';
  className?: string;
  lazy?: boolean;
}

/** One theme-appropriate image. Case-study recordings load only when a visitor presses play. */
const ProjectMedia: React.FC<ProjectMediaProps> = ({ project, mode, className = '', lazy = true }) => {
  const { dark } = useTheme();
  const box = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const source = dark ? project.videoDark : project.videoLight;
  const poster = dark ? project.imageDark : project.imageLight;

  useEffect(() => {
    setPlaying(false);
    setUnavailable(false);
  }, [source]);

  useEffect(() => {
    const node = box.current;
    if (mode !== 'study' || !node) return;
    const pause = () => video.current?.pause();
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    observer.observe(node);
    const onVisibility = () => { if (document.hidden) pause(); };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { if (motion.matches) pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  }, [mode]);

  const toggle = async () => {
    const node = video.current;
    if (!node) return;
    if (!node.paused) { node.pause(); return; }
    try { await node.play(); setUnavailable(false); }
    catch { setUnavailable(true); }
  };

  return (
    <div ref={box} className={`relative aspect-[16/10] w-full overflow-hidden ${className}`}>
      <img src={poster} alt={`${project.title} screenshot`} width={project.imageWidth} height={project.imageHeight}
        loading={lazy ? 'lazy' : 'eager'} decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
      {mode === 'study' && source && <>
        <video key={source} ref={video} muted loop playsInline preload="none" tabIndex={-1} aria-hidden
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover object-top ${playing ? 'opacity-100' : 'opacity-0'}`}>
          <source src={source} type="video/mp4" />
          <source src={source.replace(/\.mp4$/, '.webm')} type="video/webm" />
        </video>
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause the demo recording' : 'Play the demo recording'}
          className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-neutral-950 px-4 text-xs font-semibold text-white focus-visible:outline-white">
          {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
          {playing ? 'Pause' : 'Watch walkthrough'}
        </button>
        {unavailable && <p role="status" className="absolute inset-x-0 top-0 bg-neutral-950 p-3 text-sm text-white">Recording unavailable. You can still open the live demo above.</p>}
      </>}
    </div>
  );
};

export default ProjectMedia;

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, Menu, MessageCircle, Moon, Sun, Plus, X } from 'lucide-react';
import { SITE } from './data/site';
import { PROJECTS, type Project } from './data/projects';
import { STORY } from './data/content';
import { useDialog } from './lib/useDialog';
import { copyText } from './lib/clipboard';
import { toggleTheme, useTheme } from './lib/theme';
import { SECTIONS } from './lib/sections';
import Background from './components/Background';
import Certifications from './components/Certifications';
import Building from './components/Building';
import ContactModal from './components/ContactModal';
import LandingHero from './components/studio/LandingHero';
import SystemsLab from './components/studio/SystemsLab';
import ChatPanel from './components/ChatPanel';
import WorkIndex from './components/studio/WorkIndex';
const DemoOverlay = lazy(() => import('./components/DemoOverlay'));

const NAV = SECTIONS.filter(item => item.id !== 'contact');

function ProjectDialog({ project, onClose, onDemo }: { project: Project | null; onClose: () => void; onDemo: (p: Project) => void }) {
  const { dark } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(!!project, onClose, ref);
  if (!project) return null;
  return <div className="studio-overlay" ref={ref} role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" tabIndex={-1}>
    <div className="studio-backdrop" onClick={onClose} />
    <div className="studio-project-dialog"><div className="dialog-top"><span className="mono">Project notes / {project.category}</span><button onClick={onClose} aria-label="Close project"><X size={18} /></button></div>
      <h2 id="project-dialog-title">{project.title}</h2><p className="dialog-description">{project.description}</p>
      <div className="dialog-buttons">{project.demo && <button className="studio-button primary" onClick={() => onDemo(project)}>Try live demo <ArrowUpRight size={18} /></button>}{project.repo && <a className="studio-button secondary" href={project.repo} target="_blank" rel="noreferrer"><Github size={18} />View source</a>}{project.live && <a className="studio-button secondary" href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={18} /></a>}</div>
      <img className="dialog-preview" src={dark ? project.imageDark : project.imageLight} alt={project.imageAlt ?? `${project.title} interface`} width={project.imageWidth} height={project.imageHeight} />
      <div className="dialog-section"><span className="mono">The problem</span><p>{project.study.problem}</p></div>
      <div className="dialog-section"><span className="mono">The implementation</span><ul>{project.study.built.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="dialog-section"><span className="mono">What I learned</span><p>{project.study.learned}</p></div>
      <div className="dialog-section"><span className="mono">Trade-offs & limits</span><ul>{project.study.limits.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="project-tags">{project.study.stack.map(item => <span key={item}>{item}</span>)}</div>
    </div>
  </div>;
}

function App() {
  const { dark } = useTheme();
  const [menu, setMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [demo, setDemo] = useState<Project | null>(null);
  const [copied, setCopied] = useState('');
  const [active, setActive] = useState('');
  const [labOpen, setLabOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const syncHash = () => { const id = window.location.hash.match(/^#\/work\/([^/]+)$/)?.[1]; setSelected(PROJECTS.find(p => p.id === id) ?? null); };
    syncHash(); window.addEventListener('hashchange', syncHash);
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
    let frame = 0;
    function updateActiveSection() {
      frame = 0;
      const marker = Math.min(160, window.innerHeight / 4);
      let visible = 'home';
      for (const section of sections) {
        if (section.getBoundingClientRect().top > marker) break;
        visible = section.id;
      }
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atEnd ? 'contact' : visible);
    }
    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateActiveSection);
    }
    updateActiveSection();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      clearTimeout(copyTimer.current);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); document.getElementById('mobile-menu-button')?.focus(); } };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, [menu]);
  const openChat = () => {
    if (menu) document.getElementById('mobile-menu-button')?.focus();
    setMenu(false);
    setChatOpen(true);
  };
  const openProject = (project: Project) => { window.history.pushState(null, '', `#/work/${project.id}`); setSelected(project); };
  const closeProject = () => { window.history.replaceState(null, '', '#work'); setSelected(null); };
  const copyEmail = async () => { const success = await copyText(SITE.email); setCopied(success ? 'Email copied' : 'Select the email above to copy'); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(''), 3500); };
  return <><div className="studio">
    <a href="#main" className="studio-skip">Skip to content</a>
    <header className="minimal-header">
      <div className="studio-container minimal-header-inner">
        <a href="#home" className="minimal-brand" aria-label="Aditya Tiwari home"><span className="brand-initials" aria-hidden="true">AT</span><span className="brand-name">{SITE.name}</span></a>
        <nav className="minimal-nav" aria-label="Main navigation">
          {NAV.map(({ id, label }) => <a key={id} aria-current={active === id ? 'location' : undefined} className={active === id ? 'is-active' : ''} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="header-tools">
          <a className="header-resume" href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a>
          <button className="header-contact" onClick={() => { setMenu(false); setContactOpen(true); }}>Let’s talk</button>
          <button className="theme-toggle" onClick={() => toggleTheme()} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>{dark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}</button>
        <button id="mobile-menu-button" className="mobile-menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {menu && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{SECTIONS.map(item => <a aria-current={active === item.id ? 'location' : undefined} href={`#${item.id}`} key={item.id} onClick={() => setMenu(false)}>{item.label}<ArrowUpRight size={18} /></a>)}
        <a href={SITE.resume} target="_blank" rel="noreferrer" onClick={() => setMenu(false)}>Résumé (PDF) <ArrowUpRight size={18} /></a>
        <button onClick={openChat}>Ask about my work <MessageCircle size={18} /></button>
      </nav>}
    </header>
    <main id="main" tabIndex={-1}>
      <LandingHero />

      {!PROJECTS.length && <section id="building" className="studio-container minimal-section"><Building /></section>}
      <WorkIndex dark={dark} onRead={openProject} onDemo={setDemo} />

      <section id="story" className="profile-section">
        <span id="about" aria-hidden="true" />
        <div className="content-width profile-spread">
          <figure className="about-portrait-photo">
            <img src="/aditya-profile.jpeg" alt="Black-and-white portrait of Aditya Tiwari" loading="lazy" width="662" height="886" />
          </figure>
          <div className="profile-text">
            <p className="chapter-label">About me</p>
            <h2>Curious by nature.<br />Learning by building.</h2>
            <p>{STORY.lead}</p>
            <p>I like to start with a small example I can follow by hand. With a search algorithm, that means tracing the first few decisions, then comparing my notes with what the solver actually did.</p>
            <a className="text-action" href={SITE.socials.github} target="_blank" rel="noreferrer">See my GitHub <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section id="background" className="content-width background-section-new"><Background /></section>

      <Certifications />

      <section id="playground" className="minimal-playground-wrap"><div className="studio-container minimal-playground">
        <div><h2>Engineering experiments</h2><p>Trace a cached request or step through a sorting algorithm.</p></div>
        <button className="playground-toggle" aria-expanded={labOpen} aria-controls="experiments" onClick={() => setLabOpen(!labOpen)}>{labOpen ? 'Close experiments' : 'Explore experiments'}<Plus size={18} className={labOpen ? 'is-open' : ''} /></button>
        <div id="experiments" className="playground-content" hidden={!labOpen}>{labOpen && <SystemsLab />}</div>
      </div></section>

    </main>
    <footer id="contact" className="portfolio-footer content-width">
      <div className="footer-contact">
        <h2>Contact</h2>
        <div className="footer-email">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <button onClick={copyEmail} aria-label="Copy email address" title="Copy email address">{copied === 'Email copied' ? <Check /> : <Copy />}</button>
        </div>
        <span role="status">{copied}</span>
      </div>
      <nav aria-label="Footer links">
        <a href={SITE.socials.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
        <a href={SITE.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
        <a href={SITE.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight /></a>
      </nav>
      <div className="footer-base"><span>© {new Date().getFullYear()} {SITE.name}</span><a href="#home">Back to top ↑</a></div>
    </footer>
    <button className="chat-launcher" onClick={openChat} aria-label="Ask AI about Aditya" aria-haspopup="dialog" title="Ask AI about Aditya"><MessageCircle size={18} strokeWidth={1.5} /></button>
    <ProjectDialog project={selected} onClose={closeProject} onDemo={setDemo} />
    {demo && <Suspense fallback={<div className="demo-loading" role="status">Opening demo…</div>}><DemoOverlay project={demo} onClose={() => setDemo(null)} /></Suspense>}
  </div><ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} /><ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} /></>;
}
export default App;

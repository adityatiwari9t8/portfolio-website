import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { PROJECTS, type Project } from '../../data/projects';
import ProjectPreview from './ProjectPreview';
import ProjectStack from './ProjectStack';

const PAGE_SIZE = 6;
const stackProjects = [...PROJECTS].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
const listPreference = '(prefers-reduced-motion: reduce), (max-height: 560px)';
const categories = [...new Set(PROJECTS.map(project => project.category))].sort();

type Props = {
  dark: boolean;
  onRead: (project: Project) => void;
  onDemo: (project: Project) => void;
};

export default function WorkIndex({ dark, onRead, onDemo }: Props) {
  const section = useRef<HTMLElement>(null);
  const listControl = useRef<HTMLButtonElement>(null);
  const [preferList, setPreferList] = useState(() => matchMedia(listPreference).matches);
  const [list, setList] = useState(false);
  const showStack = !list && !preferList && stackProjects.length > 1;
  useEffect(() => {
    const media = matchMedia(listPreference);
    const update = () => setPreferList(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  function openList() {
    setList(true);
    requestAnimationFrame(() => {
      section.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      listControl.current?.focus({ preventScroll: true });
    });
  }
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const term = query.trim().toLowerCase();
  const matches = PROJECTS.filter(project =>
    (!category || project.category === category) &&
    [project.title, project.category, project.summary, project.description, ...project.study.stack]
      .some(field => field?.toLowerCase().includes(term))
  );

  return (
    <section ref={section} id="work" className="index-section content-width" aria-labelledby="work-title">
      <div className="chapter-heading">
        <h2 id="work-title">Selected work</h2>
        {!preferList && stackProjects.length > 1 && <div className="deck-mode" role="group" aria-label="Project view">
          <button aria-pressed={showStack} onClick={() => setList(false)}>Stack</button>
          <button ref={listControl} aria-pressed={!showStack} onClick={() => setList(true)}>List</button>
        </div>}
      </div>
      {showStack ? <ProjectStack projects={stackProjects} dark={dark} onRead={onRead} onDemo={onDemo} onList={openList} /> : <>
        <div className="catalogue-tools catalogue-filters">
          {PROJECTS.length > PAGE_SIZE && <label className="catalogue-search">
            <Search aria-hidden="true" />
            <input type="search" aria-label="Search projects" placeholder="Search projects"
              value={query} onChange={event => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} />
          </label>}
          {categories.length > 1 && <label className="index-filter">
            <span className="sr-only">Filter projects by category</span>
            <select value={category} onChange={event => { setCategory(event.target.value); setLimit(PAGE_SIZE); }}>
              <option value="">All categories</option>
              {categories.map(item => <option key={item}>{item}</option>)}
            </select>
            <ChevronDown aria-hidden="true" />
          </label>}
        </div>
      <div className="project-catalogue">
        {matches.slice(0, limit).map(project => (
          <article className="catalogue-entry" key={project.id}>
            <ProjectPreview project={project} dark={dark} onOpen={() => onRead(project)} />
            <div className="catalogue-copy">
              <p className="catalogue-category">{project.category}</p>
              <h3><button onClick={() => onRead(project)}>{project.title}</button></h3>
              <p>{project.summary ?? project.description}</p>
            </div>
            <div className="catalogue-actions">
              <button onClick={() => onRead(project)} aria-label={`Read case study for ${project.title}`}>Case study <ArrowRight /></button>
              {project.demo && <button onClick={() => onDemo(project)} aria-label={`Try demo for ${project.title}`}>Try demo <ArrowUpRight /></button>}
              {!project.demo && project.repo && <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`Source code for ${project.title}`}>Source code <ArrowUpRight aria-hidden="true" /></a>}
            </div>
          </article>
        ))}
      </div>
      {matches.length === 0 && <p className="catalogue-empty">No matching projects. <button onClick={() => {
        setQuery(''); setCategory(''); setLimit(PAGE_SIZE);
      }}>Clear filters</button></p>}
      {matches.length > limit && <button className="more-projects" onClick={() => setLimit(limit + PAGE_SIZE)}>Show more projects <ChevronDown /></button>}
      <span role="status" className="sr-only">Showing {Math.min(limit, matches.length)} of {matches.length} projects</span>
      </>}
    </section>
  );
}

import { PROJECTS, type Project } from '../../data/projects';
import ProjectStack from './ProjectStack';

const projects = [...PROJECTS].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

type Props = {
  dark: boolean;
  onRead: (project: Project) => void;
  onDemo: (project: Project) => void;
};

export default function WorkIndex({ dark, onRead, onDemo }: Props) {
  if (!projects.length) return null;

  return (
    <section id="work" className="index-section content-width" aria-labelledby="work-title">
      <div className="chapter-heading" data-scroll-reveal>
        <h2 id="work-title">Selected work</h2>
      </div>
      <ProjectStack projects={projects} dark={dark} onRead={onRead} onDemo={onDemo} />
    </section>
  );
}

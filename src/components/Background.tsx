import { ArrowUpRight } from 'lucide-react';
import { EDUCATION, EXPERIENCE, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';

export default function Background() {
  return (
    <div className="resume-spread">
      <header className="resume-heading">
        <h2>Background</h2>
        <a className="text-action" href={SITE.resume} target="_blank" rel="noreferrer">Résumé PDF <ArrowUpRight /></a>
      </header>
      <div className="resume-columns">
        <div className="resume-history">
          <section>
            <h3>Education</h3>
            <article>
              <p className="resume-date">{EDUCATION.period}</p>
              <h4>{EDUCATION.degree}</h4>
              <p>{EDUCATION.school} · CGPA {EDUCATION.gpa}</p>
              <p>{EDUCATION.coursework.join(' · ')}</p>
            </article>
          </section>
          {EXPERIENCE.length > 0 && <section>
            <h3>Experience</h3>
            {EXPERIENCE.map(item => <article key={item.org + item.role}>
              <p className="resume-date">{item.period}</p>
              <h4>{item.role}</h4><p>{item.org}</p>
              <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
            </article>)}
          </section>}
        </div>
        <div className="resume-side">
          <h3>Technical toolkit</h3>
          <dl>{TOOLKIT.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(', ')}</dd></div>)}</dl>
        </div>
      </div>
    </div>
  );
}

import { ArrowUpRight } from 'lucide-react';
import { EDUCATION, EXPERIENCE, TOOLKIT } from '../data/content';
import { SITE } from '../data/site';

export default function Background() {
  return (
    <div className="background-content">
      <header className="profile-section-heading" data-scroll-reveal>
        <h2 id="background-heading">Background</h2>
        <a className="profile-action" href={SITE.resume} target="_blank" rel="noreferrer">
          Résumé PDF <ArrowUpRight aria-hidden="true" />
        </a>
      </header>
      <div className="background-columns">
        <div className="background-history" data-timeline>
          <section aria-labelledby="education-heading" data-scroll-reveal="depth">
            <h3 id="education-heading">Education</h3>
            <article className="background-entry">
              <p className="mono profile-label">{EDUCATION.period}</p>
              <h4>{EDUCATION.degree}</h4>
              <p className="background-meta">{EDUCATION.school} · CGPA {EDUCATION.gpa}</p>
              <ul className="background-coursework" aria-label="Coursework">
                {EDUCATION.coursework.map(course => <li key={course}>{course}</li>)}
              </ul>
            </article>
          </section>
          {EXPERIENCE.length > 0 && <section aria-labelledby="experience-heading" data-scroll-reveal="depth">
            <h3 id="experience-heading">Experience</h3>
            {EXPERIENCE.map(item => <article className="background-entry" key={item.org + item.role}>
              <p className="mono profile-label">{item.period}</p>
              <h4>{item.role}</h4>
              <p className="background-meta">{item.org}</p>
              <ul className="background-details">{item.points.map(point => <li key={point}>{point}</li>)}</ul>
            </article>)}
          </section>}
        </div>
        <section className="background-toolkit" aria-labelledby="toolkit-heading" data-scroll-reveal="depth">
          <h3 id="toolkit-heading">Technical toolkit</h3>
          <dl>
            {TOOLKIT.map(group => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>
                  <ul className="skill-items" role="list">
                    {group.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}

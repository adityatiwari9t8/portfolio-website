import { RoadmapModule } from './types';
import { SUBJECT_MODELS } from './constants';

export const missingFrom = (have: string[], need: string[]) => need.filter(n => !have.includes(n));

export const generateRoadmap = (sel: string[]): RoadmapModule[] => {
  if (!sel.length) return [];
  
  const activated = SUBJECT_MODELS.filter(m => m.triggers.some(t => sel.includes(t)));
  const modules: RoadmapModule[] = [];

  activated.forEach(model => {
    const missing = missingFrom(sel, model.requires);
    if (missing.length > 0) {
      modules.push({
        phase: 'Bridge Phase', subject: `Foundations for ${model.name}`, effort: 'High', color: model.color,
        desc: `Strengthen prerequisite concepts (${missing.join(', ')}) before progressing.`,
        details: { objectives: ['Close conceptual gaps', `Prepare for ${model.name}`], topics: missing, resources: ['MIT OpenCourseWare', 'Coursera Fundamentals'] }
      });
    } else {
      modules.push({
        phase: model.level === 'advanced' ? 'Advanced Track' : 'Core Track', subject: model.name, effort: model.level === 'advanced' ? 'Advanced' : 'Critical', color: model.color,
        desc: 'The next logical step based on your current demonstrated skill profile.',
        details: { objectives: [`Master ${model.name}`, 'Apply concepts to real-world projects'], topics: model.triggers.slice(0, 4), resources: ['Top University Courses', 'Industry Playbooks'] }
      });
    }
  });

  const uniqueModules = Array.from(new Map(modules.map(m => [m.subject, m])).values())
    .sort((a, b) => (a.phase === 'Bridge Phase' ? -1 : 1))
    .slice(0, 3);

  if (uniqueModules.length === 0) {
    return [{
      phase: 'Exploration Track', subject: 'Broaden Your Foundations', effort: 'Variable', color: 'slate',
      desc: 'Your current selections are niche. Consider expanding your core fundamentals to generate a specific roadmap.',
      details: { objectives: ['Explore core CS concepts', 'Identify a specialization'], topics: ['General Computing', 'Software Architecture'], resources: ['Roadmap.sh', 'TeachYourselfCS'] }
    }];
  }

  return uniqueModules;
};
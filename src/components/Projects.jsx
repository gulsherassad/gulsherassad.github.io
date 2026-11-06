import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import projects from '../data/projects.js';
import ProjectRow from './ProjectRow.jsx';
import { pad } from './pad.js';
import './Projects.css';

export default function Projects() {
  const [openId, setOpenId] = useState(null);
  const reduceMotion = useReducedMotion();

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section
      id="projects"
      className="projects container"
      aria-labelledby="projects-heading"
    >
      <h2 id="projects-heading" className="section-label projects__label">
        Selected work ({pad(projects.length)})
      </h2>
      <ul className="projects__list">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            isOpen={openId === project.id}
            onToggle={() => toggle(project.id)}
            reduceMotion={reduceMotion}
          />
        ))}
      </ul>
    </section>
  );
}

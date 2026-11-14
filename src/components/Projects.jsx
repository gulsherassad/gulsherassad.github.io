import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import projects from '../data/projects.js';
import ProjectRow from './ProjectRow.jsx';
import { pad } from './pad.js';
import './Projects.css';

const idFromHash = () => {
  const id = window.location.hash.slice(1);
  return projects.some((project) => project.id === id) ? id : null;
};

export default function Projects() {
  // A project can be linked directly: /#darkwater opens that row.
  const [openId, setOpenId] = useState(idFromHash);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const scrollToOpen = () => {
      const id = idFromHash();
      if (!id) return;
      setOpenId(id);
      document.getElementById(id)?.scrollIntoView();
    };
    scrollToOpen();
    window.addEventListener('hashchange', scrollToOpen);
    return () => window.removeEventListener('hashchange', scrollToOpen);
  }, []);

  const toggle = (id) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    // Keep the URL shareable without adding a history entry per click.
    const { pathname, search } = window.location;
    window.history.replaceState(
      null,
      '',
      next ? `#${next}` : pathname + search,
    );
  };

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

import { AnimatePresence, m } from 'motion/react';
import ExternalLink from './ExternalLink.jsx';
import ProjectShowcase from './ProjectShowcase.jsx';
import { pad } from './pad.js';

const EASE = [0.22, 1, 0.36, 1];

export default function ProjectRow({
  project,
  index,
  isOpen,
  onToggle,
  reduceMotion,
}) {
  const hasImages = project.images.length > 0;
  const buttonId = `project-${project.id}-button`;
  const panelId = `project-${project.id}-panel`;

  return (
    <m.li
      className="project"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.7, ease: EASE, delay: index * 0.08 }
      }
    >
      <h3 className="project__heading">
        <button
          type="button"
          id={buttonId}
          className="project__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="project__index" aria-hidden="true">
            {pad(index + 1)}
          </span>
          <span className="project__main">
            <span className="project__title">{project.title}</span>
            <span className="project__tagline">{project.tagline}</span>
          </span>
          <span className="project__highlight">{project.highlight}</span>
          <span className="project__year">{project.year}</span>
          <span className="project__icon" aria-hidden="true">
            <span className="project__plus" />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="project__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.5, ease: EASE }
            }
          >
            <div
              className={
                hasImages
                  ? 'project__panel-inner project__panel-inner--media'
                  : 'project__panel-inner'
              }
            >
              <div className="project__text">
                <p className="project__description">{project.description}</p>
                <ul className="project__stack" aria-label="Tech stack">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <ul className="project__meta">
                  <li className="project__meta-role">Role: {project.role}</li>
                  <li>
                    <ExternalLink href={project.repo} className="tap-target">
                      Code
                    </ExternalLink>
                  </li>
                  {project.live && (
                    <li>
                      <ExternalLink href={project.live} className="tap-target">
                        Live
                      </ExternalLink>
                      {project.liveNote && (
                        <span className="project__live-note">
                          {' '}
                          ({project.liveNote})
                        </span>
                      )}
                    </li>
                  )}
                </ul>
              </div>
              <ProjectShowcase
                images={project.images}
                theme={project.theme}
                reduceMotion={reduceMotion}
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.li>
  );
}

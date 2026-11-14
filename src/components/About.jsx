import { m, useReducedMotion } from 'motion/react';
import PageMetrics from './PageMetrics.jsx';
import './About.css';

const EASE = [0.22, 1, 0.36, 1];

const PARAGRAPHS = [
  'I’m a fourth-year Computer Science student at UBC Okanagan, graduating in August 2027. Most of what I build sits where software meets data: models that make predictions, tools that turn questions into queries, systems that have to hold up against real numbers.',
  'I care about the step most projects skip: checking whether the thing actually works. Everything on this page has a backtest, benchmark or evaluation behind it, and I’d rather report an honest modest number than an impressive untested one.',
  'I’m looking for 2027 co-op roles in software engineering and machine learning.',
];

// Only tools used in the projects above.
const TOOLBOX = [
  ['Languages', 'Python, Go, TypeScript, JavaScript, SQL'],
  ['ML and data', 'PyTorch, scikit-learn, pandas, ONNX Runtime, PuLP'],
  ['Backend', 'FastAPI, PostgreSQL, SQLite, WebSockets, Docker'],
  ['Frontend', 'React, Next.js, deck.gl'],
];

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="about container"
      aria-labelledby="about-heading"
    >
      <div className="split">
        <h2 id="about-heading" className="section-label">
          About
        </h2>
        <div className="about__body">
          {PARAGRAPHS.map((text, i) => (
            <m.p
              key={i}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.7, ease: EASE, delay: i * 0.08 }
              }
            >
              {text}
            </m.p>
          ))}
          <dl className="about__toolbox">
            {TOOLBOX.map(([group, tools]) => (
              <div key={group}>
                <dt>{group}</dt>
                <dd>{tools}</dd>
              </div>
            ))}
          </dl>
          <PageMetrics reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}

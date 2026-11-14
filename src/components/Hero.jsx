import { useRef } from 'react';
import { m, useReducedMotion } from 'motion/react';
import TrackField from './effects/TrackField.jsx';
import ExternalLink from './ExternalLink.jsx';
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../data/links.js';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1];

const LINES = [
  <>I build software and ML systems&nbsp;—</>,
  <>
    and <em>measure</em> whether
  </>,
  <>they actually work.</>,
];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const titleRef = useRef(null);

  return (
    <section id="hero" className="hero">
      <TrackField clearRef={titleRef} />
      <div className="hero__inner container">
        <m.p
          className="hero__status-line"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Projects.jsx opens the Darkwater row when the hash changes. */}
          <a className="hero__status tap-target" href="#darkwater">
            <span className="hero__status-dot" aria-hidden="true" />
            Building Darkwater: live AIS tracking and trajectory prediction
          </a>
        </m.p>

        <h1 className="hero__title" ref={titleRef}>
          {LINES.map((line, i) => (
            <span className="hero__mask" key={i}>
              <m.span
                className="hero__line"
                initial={reduceMotion ? false : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
              >
                {line}
              </m.span>
            </span>
          ))}
        </h1>

        <m.div
          className="hero__meta"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <p className="hero__intro">
            Fourth-year Computer Science student at UBC Okanagan. Looking for
            2027 co-op roles in software engineering and ML.
          </p>
          <p className="hero__location">Kelowna, BC · Available 2027</p>
          <ul className="hero__links">
            <li>
              <a className="tap-target" href="#projects">
                See the work <span aria-hidden="true">↓</span>
              </a>
            </li>
            <li>
              <ExternalLink href={RESUME_URL} className="tap-target">
                Resume
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={GITHUB_URL} className="tap-target">
                GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={LINKEDIN_URL} className="tap-target">
                LinkedIn
              </ExternalLink>
            </li>
          </ul>
        </m.div>
      </div>
    </section>
  );
}

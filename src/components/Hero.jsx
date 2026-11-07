import { m, useReducedMotion } from 'motion/react';
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

  return (
    <section id="hero" className="hero container">
      <h1 className="hero__title">
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
          Fourth-year Computer Science student at UBC Okanagan. Looking for 2027
          co-op roles in software engineering and ML.
        </p>
        <p className="hero__location">Kelowna, BC · Available 2027</p>
      </m.div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';

const DURATION = 900; // ms
// prefix (−, +) · number with optional thousands separators and decimals ·
// suffix (%, "M rows/s")
const PATTERN = /^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/;

function parse(value) {
  const match = PATTERN.exec(value);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const plain = digits.replaceAll(',', '');
  return {
    prefix,
    suffix,
    target: Number(plain),
    decimals: plain.split('.')[1]?.length ?? 0,
    grouped: digits.includes(','),
  };
}

function format({ prefix, suffix, decimals, grouped }, number) {
  const digits = number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return `${prefix}${digits}${suffix}`;
}

/**
 * Counts a metric up from zero to `value` (e.g. "−14.3%", "50,927",
 * "1.3M rows/s"), starting once it is on screen: straight away for a panel
 * the visitor opens, on scroll for one that starts open below the fold.
 * Screen readers get the final value throughout; reduced motion shows it
 * without counting.
 */
export default function CountUp({ value, reduceMotion }) {
  const ref = useRef(null);
  // The text being counted, or null when the final value is shown as is.
  const [live, setLive] = useState(() => {
    const parsed = reduceMotion ? null : parse(value);
    return parsed ? format(parsed, 0) : null;
  });
  const counting = live !== null && !reduceMotion;

  useEffect(() => {
    const parsed = parse(value);
    if (reduceMotion || !parsed) return undefined;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        if (t === 1) {
          setLive(null);
          return;
        }
        const eased = 1 - (1 - t) ** 3; // ease-out
        setLive(format(parsed, parsed.target * eased));
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduceMotion]);

  return (
    <span className="countup" ref={ref}>
      {counting ? (
        <>
          <span className="countup__final">{value}</span>
          <span className="countup__live" aria-hidden="true">
            {live}
          </span>
        </>
      ) : (
        value
      )}
    </span>
  );
}

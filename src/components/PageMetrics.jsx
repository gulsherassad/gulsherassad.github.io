import { useEffect, useRef, useState } from 'react';
import CountUp from './CountUp.jsx';

const supported = (type) =>
  typeof PerformanceObserver !== 'undefined' &&
  PerformanceObserver.supportedEntryTypes?.includes(type);

/**
 * The page's own numbers, measured in the visitor's browser with the
 * Performance API: time to render, bytes transferred and layout shift. Nothing
 * is hard-coded, and a metric the browser can't report is left out. The
 * snapshot is taken once, just before the block scrolls into view.
 */
export default function PageMetrics({ reduceMotion }) {
  const ref = useRef(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return undefined;

    const seen = { fcp: null, lcp: null, cls: 0 };
    const observers = [];
    const watch = (type, onEntry) => {
      if (!supported(type)) return;
      const observer = new PerformanceObserver((list) =>
        list.getEntries().forEach(onEntry),
      );
      observer.observe({ type, buffered: true });
      observers.push(observer);
    };

    watch('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') seen.fcp = entry.startTime;
    });
    watch('largest-contentful-paint', (entry) => {
      seen.lcp = entry.startTime;
    });
    // Layout shift counts only unexpected movement. A project panel takes
    // half a second to open, a little longer than the browser's own grace
    // period after input, so shifts within a second of a tap or key are
    // left out too.
    let lastInput = -Infinity;
    const onInput = (event) => {
      lastInput = event.timeStamp;
    };
    const inputOptions = { capture: true, passive: true };
    window.addEventListener('pointerdown', onInput, inputOptions);
    window.addEventListener('keydown', onInput, inputOptions);
    watch('layout-shift', (entry) => {
      const afterInput =
        entry.hadRecentInput || entry.startTime - lastInput < 1000;
      if (!afterInput) seen.cls += entry.value;
    });

    const snapshot = () => {
      const next = [];
      const render = seen.lcp ?? seen.fcp;
      if (render != null) {
        next.push({
          value: `${(render / 1000).toFixed(2)}s`,
          label: seen.lcp != null ? 'to largest paint' : 'to first paint',
        });
      }
      // Bytes over the network per resource; a cache hit reports a
      // transferSize of 0, so its encoded size stands in.
      const bytes = [
        ...performance.getEntriesByType('navigation'),
        ...performance.getEntriesByType('resource'),
      ].reduce(
        (sum, entry) =>
          sum + (entry.transferSize || entry.encodedBodySize || 0),
        0,
      );
      if (bytes > 0) {
        next.push({
          value: `${Math.round(bytes / 1024).toLocaleString('en-US')} KB`,
          label: 'transferred so far, fonts and images included',
        });
      }
      if (supported('layout-shift')) {
        next.push({ value: seen.cls.toFixed(2), label: 'layout shift' });
      }
      if (next.length > 0) setMetrics(next);
    };

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        viewObserver.disconnect();
        snapshot();
      },
      { rootMargin: '200px' },
    );
    viewObserver.observe(ref.current);

    return () => {
      viewObserver.disconnect();
      window.removeEventListener('pointerdown', onInput, inputOptions);
      window.removeEventListener('keydown', onInput, inputOptions);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="page-metrics" ref={ref}>
      <p className="page-metrics__label">
        This page, measured in your browser just now
      </p>
      {/* Same look as a project's headline numbers (Projects.css). */}
      {metrics && (
        <dl className="project__metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                <CountUp value={metric.value} reduceMotion={reduceMotion} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

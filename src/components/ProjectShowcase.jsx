import { motion } from 'motion/react';
import { assetUrl } from './assetUrl.js';
import './ProjectShowcase.css';

const EASE = [0.22, 1, 0.36, 1];
const LIFT = { type: 'spring', stiffness: 400, damping: 28 };
const FALLBACK_BG = '#E6E2DA';

/** WCAG relative luminance of a #rrggbb colour, 0 (black) to 1 (white). */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function BrowserFrame({ image, url, dark }) {
  return (
    <div className={dark ? 'browser browser--dark' : 'browser'}>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots">
          <span />
          <span />
          <span />
        </span>
        {url && <span className="browser__url">{url}</span>}
      </div>
      <img
        className="browser__image"
        src={assetUrl(image.src)}
        alt={image.alt}
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Screenshots composed in browser frames on a tinted backdrop. One image sits
 * centred and bleeds off the bottom; a second overlaps the first bottom-right.
 */
export default function ProjectShowcase({ images, theme, reduceMotion }) {
  if (images.length === 0) return null;

  const bg = theme?.bg ?? FALLBACK_BG;
  const dark = luminance(bg) < 0.35;
  const [primary, secondary] = images;

  // Entrance: each frame fades/rises in. Lift: the inner wrapper sets no
  // animate of its own, so it inherits the backdrop's whileHover="lifted"
  // (Motion's hover ignores touch, so this is mouse/pen only).
  const enter = (from, delay) =>
    reduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4, delay },
        }
      : {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, x: 0, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  const lift = reduceMotion
    ? {}
    : { variants: { lifted: { y: -4 } }, transition: LIFT };

  return (
    <motion.div
      className={
        secondary ? 'showcase showcase--pair' : 'showcase showcase--single'
      }
      style={{ backgroundColor: bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      {...(reduceMotion ? {} : { whileHover: 'lifted' })}
    >
      <motion.div
        className="showcase__slot showcase__slot--primary"
        {...enter({ y: 32 }, 0.1)}
      >
        <motion.div {...lift}>
          <BrowserFrame image={primary} url={theme?.url} dark={dark} />
        </motion.div>
      </motion.div>

      {secondary && (
        <motion.div
          className="showcase__slot showcase__slot--secondary"
          {...enter({ x: 32, y: 16 }, 0.25)}
        >
          <motion.div {...lift}>
            <BrowserFrame image={secondary} url={theme?.url} dark={dark} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

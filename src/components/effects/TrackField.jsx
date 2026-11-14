import { useEffect, useRef } from 'react';
import './TrackField.css';

const SEED = 0x0da7e5; // fixed, so the field looks the same on every load
const TRAIL = 30; // past positions kept per ship
const SAMPLE = 4.5; // px travelled between trail positions
const MARGIN = 180; // lanes run this far past the canvas, hiding wrap-arounds
const FRAME_MS = 32; // ~30fps; ships move well under 1px per frame
const MAX_DPR = 2;
// Hover forecast: how far ahead it looks, and the toy scale behind its label.
const HORIZON = 140; // px
const HORIZON_LABEL = '15 min';
const METRES_PER_PX = 40;
const PICK_RADIUS = 48; // px from the pointer to a ship

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sets a ship's x, y and heading from its distance `s` along its lane. */
function place(ship) {
  const { lane, s, offset, dir } = ship;
  const wave = lane.k * s + lane.phase;
  const lateral = lane.amp * Math.sin(wave) + offset;
  const slope = lane.amp * lane.k * Math.cos(wave);
  ship.x = lane.ox + s * lane.cos - lateral * lane.sin;
  ship.y = lane.oy + s * lane.sin + lateral * lane.cos;
  ship.heading = Math.atan2(
    dir * (lane.sin + slope * lane.cos),
    dir * (lane.cos - slope * lane.sin),
  );
}

/** Where a ship will actually be after `distance` more px along its lane. */
function ahead(ship, distance) {
  const probe = { ...ship, s: ship.s + ship.dir * distance };
  place(probe);
  return probe;
}

/** Past either end of the lane: re-enter at the other end with no trail. */
function wrap(ship) {
  const { half } = ship.lane;
  if (Math.abs(ship.s) <= half) return;
  ship.s -= Math.sign(ship.s) * 2 * half;
  ship.count = 0;
  ship.acc = 0;
}

function advance(ship, distance) {
  ship.acc += distance;
  if (ship.acc >= SAMPLE) {
    ship.acc -= SAMPLE;
    ship.trail[ship.head * 2] = ship.x;
    ship.trail[ship.head * 2 + 1] = ship.y;
    ship.head = (ship.head + 1) % TRAIL;
    ship.count = Math.min(ship.count + 1, TRAIL);
  }
  ship.s += ship.dir * distance;
  wrap(ship);
  place(ship);
}

/**
 * Lanes are gently curved (a sine wave along a straight line): most run
 * roughly left to right across the top of the hero, every fourth crosses
 * steeply on the right. Ships keep to one side of their lane per direction.
 * Rebuilding after a resize keeps each ship's progress along its lane.
 */
function createWorld(width, height, previous) {
  const rand = mulberry32(SEED);
  const compact = width < 700;
  const shipCount = compact ? 18 : 40;
  const laneCount = compact ? 5 : 8;
  const diagonal = Math.hypot(width, height);

  const lanes = Array.from({ length: laneCount }, (_, i) => {
    const [a, b, c, d, e, f] = Array.from({ length: 6 }, rand);
    const crossing = i % 4 === 3;
    const ox = width * (crossing ? 0.7 + 0.22 * a : 0.3 + 0.4 * a);
    const oy = height * (crossing ? 0.6 : 0.04 + 0.42 * b);
    const angle = crossing
      ? (c < 0.5 ? -1 : 1) * (0.95 + 0.4 * d)
      : (c - 0.5) * 0.45;
    return {
      ox,
      oy,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      amp: 10 + 22 * d,
      k: (2 * Math.PI) / (500 + 600 * e),
      phase: 2 * Math.PI * f,
      half: diagonal / 2 + MARGIN + Math.hypot(ox - width / 2, oy - height / 2),
    };
  });

  const keep = previous?.ships.length === shipCount;
  const ships = Array.from({ length: shipCount }, (_, i) => {
    const [a, b, c, d] = Array.from({ length: 4 }, rand);
    const lane = lanes[i % laneCount];
    const dir = b < 0.5 ? -1 : 1;
    const before = keep ? previous.ships[i] : null;
    const progress = before ? before.s / before.lane.half : a * 2 - 1;
    const ship = {
      lane,
      dir,
      offset: dir * (4 + 10 * c),
      speed: 7 + 7 * d, // px per second
      accent: i % 8 === 3,
      s: progress * lane.half - dir * TRAIL * SAMPLE,
      x: 0,
      y: 0,
      heading: 0,
      trail: new Float32Array(TRAIL * 2),
      head: 0,
      count: 0,
      acc: 0,
    };
    // Start one trail-length back and sail forward, so the first frame (the
    // only frame, for reduced motion) already has full trails.
    wrap(ship);
    place(ship);
    for (let n = 0; n < TRAIL; n += 1) advance(ship, SAMPLE);
    return ship;
  });

  return { ships };
}

function draw(ctx, ships, colors, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  // Trails: one stroke per age step across all ships, fading with age.
  ctx.strokeStyle = colors.muted;
  for (let i = 0; i < TRAIL; i += 1) {
    ctx.globalAlpha = 0.6 * (1 - i / TRAIL) ** 1.5;
    ctx.beginPath();
    for (const ship of ships) {
      if (i >= ship.count) continue;
      const to = ((ship.head - 1 - i + TRAIL * 2) % TRAIL) * 2;
      if (i === 0) {
        ctx.moveTo(ship.x, ship.y);
      } else {
        const from = ((ship.head - i + TRAIL * 2) % TRAIL) * 2;
        ctx.moveTo(ship.trail[from], ship.trail[from + 1]);
      }
      ctx.lineTo(ship.trail[to], ship.trail[to + 1]);
    }
    ctx.stroke();
  }

  // Dead-reckoning forecast: a short dashed line straight ahead. The lane
  // curves, so the ship drifts off it, as real ones do.
  ctx.globalAlpha = 0.55;
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  for (const ship of ships) {
    const cos = Math.cos(ship.heading);
    const sin = Math.sin(ship.heading);
    const reach = 8 + ship.speed * 3;
    ctx.moveTo(ship.x + cos * 8, ship.y + sin * 8);
    ctx.lineTo(ship.x + cos * reach, ship.y + sin * reach);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Heads: small arrows pointing along the heading.
  for (const accent of [false, true]) {
    ctx.fillStyle = accent ? colors.accent : colors.text;
    ctx.globalAlpha = accent ? 0.9 : 0.5;
    ctx.beginPath();
    for (const ship of ships) {
      if (ship.accent !== accent) continue;
      const cos = Math.cos(ship.heading);
      const sin = Math.sin(ship.heading);
      ctx.moveTo(ship.x + cos * 5, ship.y + sin * 5);
      ctx.lineTo(ship.x - cos * 3 - sin * 2.6, ship.y - sin * 3 + cos * 2.6);
      ctx.lineTo(ship.x - cos * 3 + sin * 2.6, ship.y - sin * 3 - cos * 2.6);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * The hovered ship's forecast against where it actually goes: a dashed
 * straight line (dead reckoning) and the curved path it really follows, with
 * the gap between their end points marked. Returns that gap and where to put
 * its label.
 */
function drawForecast(ctx, ship, colors) {
  const cos = Math.cos(ship.heading);
  const sin = Math.sin(ship.heading);
  const predicted = { x: ship.x + cos * HORIZON, y: ship.y + sin * HORIZON };
  const actual = ahead(ship, HORIZON);

  ctx.lineWidth = 1.25;
  ctx.globalAlpha = 1;

  // Actual path
  ctx.strokeStyle = colors.text;
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y);
  for (let d = 7; d < HORIZON; d += 7) {
    const point = ahead(ship, d);
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineTo(actual.x, actual.y);
  ctx.stroke();

  // Dead reckoning, and the miss between the two end points
  ctx.strokeStyle = colors.accent;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y);
  ctx.lineTo(predicted.x, predicted.y);
  ctx.stroke();
  ctx.setLineDash([1, 3]);
  ctx.beginPath();
  ctx.moveTo(predicted.x, predicted.y);
  ctx.lineTo(actual.x, actual.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(predicted.x, predicted.y, 3, 0, 2 * Math.PI);
  ctx.moveTo(ship.x + 9, ship.y);
  ctx.arc(ship.x, ship.y, 9, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = colors.text;
  ctx.beginPath();
  ctx.arc(actual.x, actual.y, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 1;

  return {
    error: Math.hypot(actual.x - predicted.x, actual.y - predicted.y),
    x: Math.max(predicted.x, actual.x) + 12,
    y: (predicted.y + actual.y) / 2,
  };
}

/**
 * Decorative canvas behind the hero: ships moving slowly along curved lanes,
 * each with a fading trail and a dashed dead-reckoning forecast ahead of it.
 * `clearRef` is the headline; the CSS mask fades the field out across it so
 * nothing is drawn behind the text below. With a mouse or pen, pointing at a
 * ship shows its forecast against its real path and the error between them.
 */
export default function TrackField({ clearRef }) {
  const canvasRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let world = null;
    let colors = null;
    let width = 0;
    let height = 0;
    let inView = false;
    let frame = 0;
    let last = 0;
    let fadeFrom = 0; // the mask's fade across the headline, in canvas px
    let fadeTo = 0;
    let pointer = null; // mouse / pen position in canvas px
    let hovered = null; // the ship under it
    let hoverFrame = 0;
    const label = labelRef.current;
    const wide = window.matchMedia('(min-width: 900px)');

    // How much of the field the CSS mask shows at a point (TrackField.css).
    const maskAlpha = (x, y) => {
      let alpha = 0;
      if (y < 48) alpha = y / 48;
      else if (y <= fadeFrom) alpha = 1;
      else if (y < fadeTo) alpha = 1 - (y - fadeFrom) / (fadeTo - fadeFrom);
      if (wide.matches) {
        const fromRight = Math.hypot(
          (x - width) / (0.38 * width),
          (y - 0.8 * height) / (0.5 * height),
        );
        alpha = Math.max(alpha, 1 - fromRight);
      }
      return alpha;
    };

    // Nearest clearly visible ship to the pointer; the current one is kept
    // until the pointer is well away, so the forecast doesn't flicker.
    const pick = () => {
      if (!pointer || !world) return null;
      let best = null;
      let bestDistance = PICK_RADIUS;
      for (const ship of world.ships) {
        const distance = Math.hypot(ship.x - pointer.x, ship.y - pointer.y);
        const reach = ship === hovered ? distance - PICK_RADIUS / 2 : distance;
        if (reach < bestDistance && maskAlpha(ship.x, ship.y) > 0.5) {
          best = ship;
          bestDistance = reach;
        }
      }
      return best;
    };

    const readColors = () => {
      const style = getComputedStyle(canvas);
      const read = (name) => style.getPropertyValue(name).trim();
      colors = {
        text: read('--text'),
        muted: read('--muted'),
        accent: read('--accent'),
      };
    };

    const paint = () => {
      if (!world) return;
      draw(ctx, world.ships, colors, width, height);
      hovered = pick();
      label.classList.toggle('track-field__label--visible', Boolean(hovered));
      if (!hovered) return;
      const miss = drawForecast(ctx, hovered, colors);
      const metres = Math.round((miss.error * METRES_PER_PX) / 10) * 10;
      label.textContent = `Dead reckoning vs actual, ${HORIZON_LABEL} ahead: off by ${metres} m`;
      const x = Math.max(8, Math.min(miss.x, width - label.offsetWidth - 8));
      const y = Math.max(8, miss.y - label.offsetHeight / 2);
      label.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    };

    // While the loop is paused (reduced motion), pointer moves repaint.
    const paintSoon = () => {
      if (frame || hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        paint();
      });
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      paintSoon();
    };

    const onPointerLeave = () => {
      pointer = null;
      paintSoon();
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < FRAME_MS) return;
      last = now;
      const dt = Math.min(elapsed, 100) / 1000;
      for (const ship of world.ships) advance(ship, ship.speed * dt);
      paint();
    };

    // The one rAF loop runs only while the canvas is on screen, the tab is
    // visible and motion is allowed.
    const sync = () => {
      const run = world && inView && !document.hidden && !reducedMotion.matches;
      if (run && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      // Tell the CSS mask where the headline is.
      const clear = clearRef?.current?.getBoundingClientRect();
      if (clear) {
        fadeFrom = Math.round(clear.top - rect.top);
        fadeTo = Math.round(fadeFrom + clear.height * 0.55);
        canvas.style.setProperty('--fade-from', `${fadeFrom}px`);
        canvas.style.setProperty('--fade-to', `${fadeTo}px`);
      } else {
        fadeFrom = rect.height * 0.24; // the CSS fallbacks
        fadeTo = rect.height * 0.55;
      }

      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (!nextWidth || !nextHeight) return;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      world = createWorld(width, height, world);
      paint(); // also the single static frame for reduced motion
      sync();
    };

    const onMotionChange = () => {
      sync();
      paint();
    };

    readColors();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (clearRef?.current) resizeObserver.observe(clearRef.current);

    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    viewObserver.observe(canvas);

    // Colours come from the theme's CSS variables: redraw when it changes.
    const themeObserver = new MutationObserver(() => {
      readColors();
      paint();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // The canvas sits behind the hero's content, so listen on the hero.
    const hero = canvas.parentElement;
    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);

    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(hoverFrame);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, [clearRef]);

  return (
    <>
      <canvas ref={canvasRef} className="track-field" aria-hidden="true" />
      <div ref={labelRef} className="track-field__label" aria-hidden="true" />
    </>
  );
}

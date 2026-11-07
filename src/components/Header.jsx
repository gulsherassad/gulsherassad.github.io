import { useEffect, useRef, useState } from 'react';
import ExternalLink from './ExternalLink.jsx';
import { RESUME_URL } from '../data/links.js';
import './Header.css';

const NAV_LINKS = [
  { href: '#projects', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Publish the header's real height (it changes with breakpoints and when the
  // nav wraps) so html's scroll-padding-top keeps anchors and focus clear of it.
  useEffect(() => {
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.target.offsetHeight;
      root.style.setProperty('--header-height', `${Math.ceil(height)}px`);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className={scrolled ? 'header header--scrolled' : 'header'}
    >
      <div className="header__inner container">
        <a className="header__name" href="#hero">
          Gulsher Assad
        </a>
        <nav aria-label="Primary">
          <ul className="header__nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="tap-target" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <ExternalLink href={RESUME_URL} className="tap-target">
                Resume
              </ExternalLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

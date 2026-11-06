import { useEffect, useState } from 'react';
import './Header.css';

const NAV_LINKS = [
  { href: '#projects', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={scrolled ? 'header header--scrolled' : 'header'}>
      <div className="header__inner container">
        <a className="header__name" href="#hero">
          Gulsher Assad
        </a>
        <nav aria-label="Primary">
          <ul className="header__nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            <li>
              {/* TODO: link to the resume PDF (and open in a new tab) once it exists. */}
              <a href="#">
                Resume <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

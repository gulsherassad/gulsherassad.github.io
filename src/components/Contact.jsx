import { useEffect, useRef, useState } from 'react';
import ExternalLink from './ExternalLink.jsx';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../data/links.js';
import './Contact.css';

const BUTTON_LABEL = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' };
const ANNOUNCEMENT = {
  idle: '',
  copied: 'Email address copied',
  failed: 'Could not copy the email address',
};

export default function Contact() {
  // 'idle' | 'copied' | 'failed'; copied/failed revert to idle after 2s.
  const [status, setStatus] = useState('idle');
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    let next = 'copied';
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      next = 'failed'; // Clipboard unavailable or permission denied.
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <section
      id="contact"
      className="contact container"
      aria-labelledby="contact-heading"
    >
      <div className="split">
        <h2 id="contact-heading" className="section-label">
          Contact
        </h2>
        <div className="contact__body">
          <p className="contact__lead">Let’s talk.</p>

          <div className="contact__email-row">
            <a className="contact__email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button
              type="button"
              className="contact__copy tap-target"
              onClick={copyEmail}
            >
              {BUTTON_LABEL[status]}
              <span className="visually-hidden"> email address</span>
            </button>
            <span className="visually-hidden" aria-live="polite">
              {ANNOUNCEMENT[status]}
            </span>
          </div>

          <ul className="contact__links">
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
            <li>
              <ExternalLink href={RESUME_URL} className="tap-target">
                Resume
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

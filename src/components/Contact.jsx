import { useEffect, useRef, useState } from 'react';
import ExternalLink from './ExternalLink.jsx';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../data/links.js';
import './Contact.css';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return; // Clipboard unavailable or denied: fail silently.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
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
            <button type="button" className="contact__copy" onClick={copyEmail}>
              {copied ? 'Copied' : 'Copy'}
              <span className="visually-hidden"> email address</span>
            </button>
            <span className="visually-hidden" aria-live="polite">
              {copied ? 'Email address copied' : ''}
            </span>
          </div>

          <ul className="contact__links">
            <li>
              <ExternalLink href={GITHUB_URL}>GitHub</ExternalLink>
            </li>
            <li>
              <ExternalLink href={LINKEDIN_URL}>LinkedIn</ExternalLink>
            </li>
            <li>
              <ExternalLink href={RESUME_URL}>Resume</ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

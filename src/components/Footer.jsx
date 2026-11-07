import './Footer.css';

// Scroll to the top and put focus on the skip link, so the next Tab starts
// from the very beginning of the page (skip link → header nav) rather than
// past the header. Scrolling follows html's scroll-behavior, which global.css
// sets to smooth and reset.css turns off for reduced motion. The href is the
// no-JS fallback.
const backToTop = (event) => {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) return;
  event.preventDefault();
  window.scrollTo({ top: 0 });
  skipLink.focus({ preventScroll: true });
};

export default function Footer() {
  return (
    <footer className="footer container">
      <div className="footer__inner">
        <p>© 2026 Gulsher Assad</p>
        <a className="tap-target" href="#main" onClick={backToTop}>
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

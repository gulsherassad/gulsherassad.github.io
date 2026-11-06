import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer container">
      <div className="footer__inner">
        <p>© 2026 Gulsher Assad</p>
        {/* Anchor rather than JS so focus moves to the top too; smooth scrolling
            comes from global.css and is turned off for reduced motion. */}
        <a href="#hero">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}

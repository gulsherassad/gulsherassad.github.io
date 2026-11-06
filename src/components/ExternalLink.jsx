/** Link that opens in a new tab, with a ↗ marker and a screen-reader hint. */
export default function ExternalLink({ href, className, children }) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} <span aria-hidden="true">↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

import './ResultsChart.css';

/**
 * Baseline-vs-model bars for a project's headline result. Bars are drawn
 * with CSS widths; the numbers are real text, so nothing depends on the bars.
 */
export default function ResultsChart({ chart }) {
  const max = Math.max(...chart.rows.flatMap((r) => [r.baseline, r.model]));
  const width = (value) => `${(value / max) * 100}%`;

  return (
    <figure className="chart">
      <figcaption className="chart__title">
        {chart.title} ({chart.unit})
      </figcaption>
      <ul className="chart__legend" aria-hidden="true">
        <li className="chart__key chart__key--baseline">{chart.baseline}</li>
        <li className="chart__key chart__key--model">{chart.model}</li>
      </ul>
      <ul className="chart__rows">
        {chart.rows.map((row) => (
          <li className="chart__row" key={row.label}>
            <span className="chart__label">{row.label}</span>
            <span className="chart__bars">
              <Bar
                kind="baseline"
                name={chart.baseline}
                value={row.baseline}
                unit={chart.unit}
                width={width(row.baseline)}
              />
              <Bar
                kind="model"
                name={chart.model}
                value={row.model}
                unit={chart.unit}
                width={width(row.model)}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="chart__note">{chart.note}</p>
    </figure>
  );
}

function Bar({ kind, name, value, unit, width }) {
  return (
    <span className="chart__bar-line">
      <span
        className={`chart__bar chart__bar--${kind}`}
        style={{ width }}
        aria-hidden="true"
      />
      <span className="chart__value">
        <span className="visually-hidden">{name}: </span>
        {value.toFixed(2)}
        <span className="visually-hidden"> {unit}</span>
      </span>
    </span>
  );
}

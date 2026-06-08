import PageHero from "../../components/PageHero.jsx";
import {
  breakpoints,
  spacingScale,
  typographyScale,
} from "../../data/guides.js";

export default function TypographyPage() {
  return (
    <>
      <PageHero
        eyebrow="Font Size Guide"
        title="Responsive typography for mobile, tablet and desktop"
        description="Students can use this page to decide heading sizes, body sizes, button sizes, line-height, spacing and breakpoint checks."
      />

      <section className="section-block">
        <div className="section-heading">
          <h2>Font size list</h2>
          <p>Use this as a safe starting point for modern websites.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Text Type</th>
                <th>Mobile</th>
                <th>Tablet</th>
                <th>Desktop</th>
                <th>Line Height</th>
                <th>Weight</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {typographyScale.map((row) => (
                <tr key={row.name}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>{row.mobile}</td>
                  <td>{row.tablet}</td>
                  <td>{row.desktop}</td>
                  <td>{row.lineHeight}</td>
                  <td>{row.weight}</td>
                  <td>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-block two-column">
        <article className="info-panel">
          <h2>Typography do</h2>
          <ul className="nice-list">
            <li>Use one main font family for most websites.</li>
            <li>Keep body text at least 15px on mobile.</li>
            <li>Use shorter line length for paragraphs.</li>
            <li>Use clear hierarchy: H1 bigger than H2, H2 bigger than H3.</li>
          </ul>
        </article>
        <article className="info-panel danger-soft">
          <h2>Typography don’t</h2>
          <ul className="nice-list">
            <li>Do not use 10px or 12px for main paragraph text.</li>
            <li>Do not use many font families.</li>
            <li>Do not make all headings same size.</li>
            <li>Do not use very long paragraphs without spacing.</li>
          </ul>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Spacing scale</h2>
        </div>
        <div className="grid four">
          {spacingScale.map((item) => (
            <article className="token-card" key={item.token}>
              <strong>{item.token}</strong>
              <span>{item.value}</span>
              <p>{item.use}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Screen size checklist</h2>
        </div>
        <div className="grid three">
          {breakpoints.map((item) => (
            <article className="info-panel" key={item.name}>
              <h3>{item.name}</h3>
              <strong>{item.width}</strong>
              <p>{item.check}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

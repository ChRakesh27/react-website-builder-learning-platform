import CopyBox from "../../components/CopyBox.jsx";
import PageHero from "../../components/PageHero.jsx";

const cssTokens = `:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #7c3aed;
  --background: #f8fafc;
  --surface: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --radius-card: 24px;
  --radius-button: 14px;
  --shadow-soft: 0 20px 50px rgba(15, 23, 42, 0.08);
}`;

export default function StyleGuidePage() {
  const colors = [
    ["Primary", "#2563eb"],
    ["Secondary", "#7c3aed"],
    ["Success", "#16a34a"],
    ["Warning", "#f59e0b"],
    ["Danger", "#dc2626"],
    ["Background", "#f8fafc"],
    ["Text", "#0f172a"],
    ["Muted", "#64748b"],
  ];
  return (
    <>
      <PageHero
        eyebrow="Design System"
        title="Colors, spacing, radius, shadows and UI rules"
        description="Use this page as the visual design guide for the project. Students can learn how to keep UI consistent."
      />

      <section id="style-colors" className="section-block">
        <div className="section-heading">
          <h2>Color palette</h2>
          <p>Use fewer colors and repeat them consistently.</p>
        </div>
        <div className="grid four">
          {colors.map(([name, value]) => (
            <article className="color-card" key={name}>
              <span style={{ background: value }} />
              <strong>{name}</strong>
              <code>{value}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block two-column">
        <article className="info-panel">
          <h2>Button rules</h2>
          <ul className="nice-list">
            <li>Primary button should be used for the main action.</li>
            <li>Secondary button should be used for supporting action.</li>
            <li>Button text should clearly explain the action.</li>
            <li>Use same border radius and padding everywhere.</li>
          </ul>
        </article>
        <article className="info-panel">
          <h2>Card rules</h2>
          <ul className="nice-list">
            <li>Use same border color and shadow style.</li>
            <li>Keep card content aligned.</li>
            <li>Do not mix too many card designs.</li>
            <li>Use hover only when card is clickable.</li>
          </ul>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>UI tokens example</h2>
        </div>
        <CopyBox title="CSS Design Tokens" text={cssTokens} />
      </section>
    </>
  );
}

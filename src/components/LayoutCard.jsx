import CopyBox from './CopyBox.jsx';

export default function LayoutCard({ layout }) {
  return (
    <article className="layout-card">
      <div>
        <span className="pill">Layout</span>
        <h3>{layout.title}</h3>
        <p>{layout.bestFor}</p>
      </div>
      <div className="layout-flow">
        {layout.sections.map((item) => <span key={item}>{item}</span>)}
      </div>
      <p className="muted"><strong>Flow:</strong> {layout.structure}</p>
      <CopyBox title="AI Prompt" text={layout.prompt} type="prompt" />
    </article>
  );
}

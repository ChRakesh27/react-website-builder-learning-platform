import CodeBlock from './CodeBlock.jsx';
import PromptBox from './PromptBox.jsx';
import PreviewMockup from './PreviewMockup.jsx';

function SectionDetail({ section, onBack }) {
  return (
    <div className="detail-page">
      <button type="button" className="back-button" onClick={onBack}>← Back to Sections</button>

      <section className="detail-hero">
        <div>
          <p className="eyebrow">Section Guide</p>
          <h1>{section.emoji} {section.title}</h1>
          <p>{section.intro}</p>
          <div className="info-grid small">
            <article>
              <strong>Where to place</strong>
              <p>{section.place}</p>
            </article>
            <article>
              <strong>Used for</strong>
              <p>{section.usedFor}</p>
            </article>
          </div>
        </div>
        <PreviewMockup type={section.slug} />
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Examples</p>
            <h2>Different {section.title} layouts</h2>
          </div>
        </div>
        <div className="card-grid three">
          {section.examples.map((example) => (
            <article className="example-card" key={example.name}>
              <PreviewMockup type={section.slug} />
              <h3>{example.name}</h3>
              <p>{example.description}</p>
              <span>Best for: {example.bestFor}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-block">
        <article className="guide-card success">
          <h2>Do</h2>
          <ul>{section.dos.map((item) => <li key={item}>✅ {item}</li>)}</ul>
        </article>
        <article className="guide-card danger">
          <h2>Don’t</h2>
          <ul>{section.donts.map((item) => <li key={item}>❌ {item}</li>)}</ul>
        </article>
      </section>

      <section className="section-block">
        <p className="eyebrow">Design Guidelines</p>
        <h2>How this section should be</h2>
        <div className="checklist-grid">
          {section.guidelines.map((item) => (
            <div className="check-item" key={item}>✓ {item}</div>
          ))}
        </div>
      </section>

      <PromptBox title={`Generate ${section.title}`} prompt={section.prompt} />
      <CodeBlock label={`${section.title} React Example`} code={section.code} />
    </div>
  );
}

export default SectionDetail;

import { Link, useParams } from "react-router-dom";
import CopyBox from "../../components/CopyBox.jsx";
import { sections } from "../../data/sections.js";

export default function SectionDetailsPage() {
  const { slug } = useParams();
  const section = sections.find((item) => item.slug === slug);

  if (!section) {
    return (
      <section className="page-hero">
        <h1>Section not found</h1>
        <Link className="primary-button" to="/sections">
          Back to sections
        </Link>
      </section>
    );
  }

  return (
    <>
      <Link className="back-link" to="/sections">
        &larr; Back to all sections
      </Link>
      <section className="detail-hero">
        <div>
          <p className="eyebrow">
            {section.category} � {section.level}
          </p>
          <h1>{section.title}</h1>
          <p>{section.intro}</p>
          <div className="detail-meta">
            <span>Layout examples</span>
            <span>Do / Don't</span>
            <span>Prompt</span>
            <span>Code</span>
          </div>
        </div>
        <div className="section-live-preview">
          <div className="preview-nav">Navigation + CTA</div>
          <div className="preview-hero-row">
            <span>Main headline and subtext</span>
            <span>Visual support panel</span>
          </div>
          <div className="preview-card-row">
            <span>Benefit 1</span>
            <span>Benefit 2</span>
            <span>Benefit 3</span>
          </div>
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-panel large">
          <p className="eyebrow">When to use</p>
          <h2>Purpose of this section</h2>
          <p>{section.whenToUse}</p>
        </article>
        <article className="info-panel">
          <p className="eyebrow">Student note</p>
          <h3>Simple rule</h3>
          <p>
            Do not add a section only because it looks nice. Add it only if it
            helps the user understand or take action.
          </p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Layout examples</p>
          <h2>Different ways to design this section</h2>
        </div>
        <div className="grid three">
          {section.layouts.map((layout, index) => (
            <article className="example-card" key={layout.name}>
              <div className={`example-preview type-${index % 4}`}>
                <span>Structure</span>
                <span>Spacing</span>
                <span>Hierarchy</span>
                <span>CTA</span>
              </div>
              <h3>{layout.name}</h3>
              <p>{layout.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block two-column">
        <article className="rule-card">
          <h2>Design Guidelines</h2>
          <ul className="nice-list">
            {section.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
        <div className="do-dont-grid">
          <article className="do-card">
            <h3>Do</h3>
            <ul>
              {section.dos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="dont-card">
            <h3>Don't</h3>
            <ul>
              {section.donts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-block two-column">
        <CopyBox title="Copy AI Prompt" text={section.prompt} type="prompt" />
        <CopyBox title="Copy React Code" text={section.code} />
      </section>
    </>
  );
}

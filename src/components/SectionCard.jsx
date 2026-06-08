import { Link } from 'react-router-dom';

export default function SectionCard({ section }) {
  const previewPoints = [
    section.layouts?.[0]?.name || 'Layout',
    section.rules?.[0] ? section.rules[0].replace('.', '') : 'Rules',
    section.dos?.[0] || 'Best practice'
  ];

  return (
    <article className="section-card">
      <div className="section-card__top">
        <span className="pill">{section.category}</span>
        <span className="level">{section.level}</span>
      </div>
      <h3>{section.title}</h3>
      <p>{section.intro}</p>
      <div className="mini-preview" aria-hidden="true">
        {previewPoints.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </div>
      <Link to={`/sections/${section.slug}`} className="card-link">Open guide -&gt;</Link>
    </article>
  );
}

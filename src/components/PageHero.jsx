export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="page-hero__actions">{children}</div>}
    </section>
  );
}

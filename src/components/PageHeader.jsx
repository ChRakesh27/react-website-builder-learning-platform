function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export default PageHeader;

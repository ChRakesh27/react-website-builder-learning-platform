import CopyBox from "../../components/CopyBox.jsx";
import PageHero from "../../components/PageHero.jsx";
import { codeExamples } from "../../data/guides.js";
import { sections } from "../../data/sections.js";

export default function CodeLabPage() {
  return (
    <>
      <PageHero
        eyebrow="Code Lab"
        title="Beginner-friendly React code examples"
        description="Students can study reusable components, data mapping, folder structure, routing, sitemap and section code."
      />
      <section className="section-block">
        <div className="grid two">
          {codeExamples.map((item) => (
            <CopyBox key={item.title} title={item.title} text={item.code} />
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Section Code</p>
          <h2>Example components</h2>
        </div>
        <div className="grid two">
          {sections.slice(0, 10).map((section) => (
            <CopyBox
              key={section.slug}
              title={`${section.title} Code`}
              text={section.code}
            />
          ))}
        </div>
      </section>
    </>
  );
}

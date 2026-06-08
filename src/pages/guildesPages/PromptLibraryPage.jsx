import CopyBox from "../../components/CopyBox.jsx";
import PageHero from "../../components/PageHero.jsx";
import { promptGroups } from "../../data/guides.js";
import { sections } from "../../data/sections.js";

export default function PromptLibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Prompt Library"
        title="Copy prompts to generate layouts, code and UI improvements"
        description="Students can copy these prompts into AI tools and learn how to ask for better website sections and React code."
      />
      <section className="section-block">
        <div className="grid two">
          {promptGroups.map((group) => (
            <article className="info-panel" key={group.title}>
              <h2>{group.title}</h2>
              {group.prompts.map((prompt, index) => (
                <CopyBox
                  key={index}
                  title={`Prompt ${index + 1}`}
                  text={prompt}
                  type="prompt"
                />
              ))}
            </article>
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Section Prompts</p>
          <h2>Prompts from every section guide</h2>
        </div>
        <div className="grid two">
          {sections.slice(0, 16).map((section) => (
            <CopyBox
              key={section.slug}
              title={section.title}
              text={section.prompt}
              type="prompt"
            />
          ))}
        </div>
      </section>
    </>
  );
}

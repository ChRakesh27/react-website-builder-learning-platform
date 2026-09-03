import { useMemo, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import PageHero from "../../components/PageHero.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import { sectionCategories, sections } from "../../data/sections.js";

export default function SectionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [ref, isVisible] = useScrollReveal();

  const filtered = useMemo(() => {
    return sections.filter((section) => {
      const matchCategory = category === "All" || section.category === category;
      const matchQuery = `${section.title} ${section.intro} ${section.category}`
        .toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  return (
    <>
      <PageHero
        eyebrow="A-Z Section Library"
        title="Every important website section with examples, rules, prompt and code"
        description="Students can learn when to use each section, how to design it, what mistakes to avoid, and how to generate it using AI."
      />

      <div className="toolbar animate-fade-in-down">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hero, pricing, forms, dashboard..."
        />
        <div className="filter-row">
          {sectionCategories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="result-count scroll-reveal">
        Showing {filtered.length} section guides
      </div>
      <div ref={ref} className="grid three">
        {filtered.map((section, i) => (
          <div key={section.slug} className="scroll-reveal" style={{ transitionDelay: `${i * 60}ms`, animationFillMode: 'both', animation: isVisible ? `fadeInUp 0.4s ease-out ${i * 60}ms both` : 'none' }}>
            <SectionCard section={section} />
          </div>
        ))}
      </div>
    </>
  );
}
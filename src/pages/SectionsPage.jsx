import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import SectionCard from '../components/SectionCard.jsx';
import { sections, sectionCategories } from '../data/sections.js';

export default function SectionsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return sections.filter((section) => {
      const matchCategory = category === 'All' || section.category === category;
      const matchQuery = `${section.title} ${section.intro} ${section.category}`.toLowerCase().includes(query.toLowerCase());
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

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hero, pricing, forms, dashboard..." />
        <div className="filter-row">
          {sectionCategories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
      </div>

      <div className="result-count">Showing {filtered.length} section guides</div>
      <div className="grid three">
        {filtered.map((section) => <SectionCard key={section.slug} section={section} />)}
      </div>
    </>
  );
}

import LayoutCard from "../../components/LayoutCard.jsx";
import PageHero from "../../components/PageHero.jsx";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import { layouts } from "../../data/layouts.js";

export default function LayoutsPage() {
  const [ref, isVisible] = useScrollReveal();
  return (
    <>
      <PageHero
        eyebrow="Layout Library"
        title="Choose the right page flow before designing"
        description="A layout is the order of sections. Students should first understand the website type, then choose the correct sections."
      />
      <div ref={ref} className={`section-block-wrap ${isVisible ? 'animate-fade-in-up' : ''}`}>
      <div className="grid two">
        {layouts.map((layout) => (
          <LayoutCard key={layout.slug} layout={layout} />
        ))}
      </div>
      </div>
    </>
  );
}

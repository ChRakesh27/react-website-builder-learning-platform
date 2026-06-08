import LayoutCard from "../../components/LayoutCard.jsx";
import PageHero from "../../components/PageHero.jsx";
import { layouts } from "../../data/layouts.js";

export default function LayoutsPage() {
  return (
    <>
      <PageHero
        eyebrow="Layout Library"
        title="Choose the right page flow before designing"
        description="A layout is the order of sections. Students should first understand the website type, then choose the correct sections."
      />
      <div className="grid two">
        {layouts.map((layout) => (
          <LayoutCard key={layout.slug} layout={layout} />
        ))}
      </div>
    </>
  );
}

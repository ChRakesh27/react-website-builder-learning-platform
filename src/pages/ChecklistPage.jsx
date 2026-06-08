import PageHero from '../components/PageHero.jsx';
import ChecklistGroup from '../components/ChecklistGroup.jsx';
import { uiChecklist } from '../data/guides.js';

export default function ChecklistPage() {
  return (
    <>
      <PageHero eyebrow="Before Production" title="UI/UX and production checklist" description="Before deployment, students should check spacing, typography, colors, buttons, responsive behavior, SEO and build errors." />
      <div className="grid two">
        {uiChecklist.map((group) => <ChecklistGroup key={group.group} group={group} />)}
      </div>
      <section className="section-block action-panel">
        <div><h2>Final student rule</h2><p>Do not deploy only after desktop check. Always test mobile, tablet and real production build.</p></div>
      </section>
    </>
  );
}

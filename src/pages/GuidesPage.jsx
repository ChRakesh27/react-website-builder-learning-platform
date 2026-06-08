import PageHero from '../components/PageHero.jsx';
import CopyBox from '../components/CopyBox.jsx';
import { learningPath, setupSteps } from '../data/guides.js';

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="End-to-End Flow"
        title="Complete website creation guide from planning to deployment"
        description="This page teaches students what to do before coding, how to build React files, and what to check before production."
      />

      <section className="section-block">
        <div className="section-heading"><h2>Website creation roadmap</h2></div>
        <div className="timeline-list">
          {learningPath.map((item) => (
            <article key={item.step} className="timeline-item">
              <span>{item.step}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><p className="eyebrow">React Setup</p><h2>Commands students should learn</h2></div>
        <div className="grid two">
          {setupSteps.map((step) => (
            <article className="command-card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <CopyBox title="Command" text={step.command} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

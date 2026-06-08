import PageHero from '../components/PageHero.jsx';
import CopyBox from '../components/CopyBox.jsx';
import { deploymentSteps } from '../data/guides.js';

export default function DeploymentPage() {
  return (
    <>
      <PageHero eyebrow="Deployment" title="From local project to live website" description="A clear deployment flow for React + Vite projects. Students can follow the commands and final checks." />
      <div className="grid two">
        {deploymentSteps.map((step) => <article className="command-card" key={step.title}><h3>{step.title}</h3><p>{step.text}</p><CopyBox title="Command / Setting" text={step.command} /></article>)}
      </div>
      <section className="section-block info-panel">
        <h2>Recommended hosting for beginners</h2>
        <p>Use Vercel or Netlify first because they are simple for React projects. Use Firebase Hosting or Hostinger when you need a specific hosting setup.</p>
      </section>
    </>
  );
}

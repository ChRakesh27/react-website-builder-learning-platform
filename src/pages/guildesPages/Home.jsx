import { Link } from "react-router-dom";
import SectionCard from "../../components/SectionCard.jsx";
import { learningPath } from "../../data/guides.js";
import { sections } from "../../data/sections.js";

export default function Home() {
  const featured = sections.filter((section) =>
    ["hero", "features", "responsive-layout", "accessibility"].includes(
      section.slug,
    ),
  );

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Complete React learning project</p>
          <h1>Teach students how to build websites from A to Z.</h1>
          <p className="lead">
            A clean, practical platform with section examples, layout flows,
            React code, AI prompts, font-size rules, naming rules, UI/UX checks,
            SEO, sitemap and deployment steps.
          </p>
          <div className="button-row">
            <Link className="primary-button" to="/sections">
              Explore A-Z Sections
            </Link>
            <Link className="secondary-button" to="/guides">
              Start End-to-End Guide
            </Link>
          </div>
          <div className="hero-points">
            <span>30+ section guides</span>
            <span>Copy prompts</span>
            <span>Responsive rules</span>
          </div>
        </div>
        <div className="hero-product-card">
          <div className="browser-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="product-grid">
            <div className="product-sidebar">
              <span>Plan</span>
              <span>Sections</span>
              <span>Style</span>
              <span>Deploy</span>
            </div>
            <div className="product-main">
              <div className="product-title">Student Website Builder</div>
              <div className="product-subtitle">
                Track progress from idea to launch
              </div>
              <div className="product-cards">
                <span>Layout</span>
                <span>Prompt</span>
                <span>Checklist</span>
              </div>
              <div className="product-wide">
                Current Task: Build responsive hero + CTA section
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Learning Flow</p>
          <h2>From idea to live website</h2>
          <p>
            Students learn what to do before coding, while coding, before
            production and after deployment.
          </p>
        </div>
        <div className="path-grid">
          {learningPath.slice(0, 6).map((item) => (
            <article className="path-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-band">
        <div>
          <p className="eyebrow">Practical Learning UI</p>
          <h2>Every section teaches layout, rules, prompt and code.</h2>
          <p>
            The user can click Hero, Navbar, About, Pricing, Dashboard, Forms,
            Tables, Accessibility and many more topics to learn clearly with
            examples.
          </p>
        </div>
        <div className="band-list">
          <span>What is this section?</span>
          <span>Where to use it?</span>
          <span>Do and Don't</span>
          <span>AI Prompt</span>
          <span>React Code</span>
          <span>UI Checklist</span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading row">
          <div>
            <p className="eyebrow">Featured Guides</p>
            <h2>Start with these important sections</h2>
          </div>
          <Link className="text-link" to="/sections">
            View all sections -&gt;
          </Link>
        </div>
        <div className="grid four">
          {featured.map((section) => (
            <SectionCard key={section.slug} section={section} />
          ))}
        </div>
      </section>

      <section className="section-block action-panel">
        <div>
          <p className="eyebrow">For students</p>
          <h2>Build, check, improve and deploy with confidence.</h2>
          <p>
            Use this as a classroom project, self-learning project, UI/UX
            checklist, and AI prompt library.
          </p>
        </div>
        <Link className="primary-button" to="/typography">
          Open Font Size Guide
        </Link>
      </section>
    </>
  );
}

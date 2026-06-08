import PageHero from '../components/PageHero.jsx';
import { namingRules } from '../data/guides.js';
import CopyBox from '../components/CopyBox.jsx';

const structure = `src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── SectionCard.jsx
│   └── CopyBox.jsx
├── pages/
│   ├── Home.jsx
│   ├── SectionsPage.jsx
│   └── TypographyPage.jsx
├── data/
│   ├── sections.js
│   └── guides.js
├── assets/
│   ├── images/
│   │   └── hero-banner.png
│   └── icons/
└── utils/
    └── formatDate.js`;

export default function NamingRulesPage() {
  return (
    <>
      <PageHero
        eyebrow="Naming Rules"
        title="camelCase, PascalCase, kebab-case and uppercase rules"
        description="Students learn how to name files, folders, components, variables, functions, routes, images and environment variables."
      />
      <section className="section-block">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Style</th><th>Good</th><th>Bad</th><th>Why</th></tr></thead>
            <tbody>
              {namingRules.map((rule) => <tr key={rule.item}><td><strong>{rule.item}</strong></td><td>{rule.style}</td><td><code>{rule.good}</code></td><td><code>{rule.bad}</code></td><td>{rule.why}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <section className="section-block two-column">
        <article className="do-card"><h2>Do</h2><ul><li>Use clear meaningful names.</li><li>Keep component file and component name same.</li><li>Use kebab-case for routes and images.</li><li>Use camelCase for variables and functions.</li></ul></article>
        <article className="dont-card"><h2>Don’t</h2><ul><li>Do not use spaces in file names.</li><li>Do not use random names like file1.jsx.</li><li>Do not mix naming styles inside same folder.</li><li>Do not create too many index.jsx files for beginners.</li></ul></article>
      </section>
      <CopyBox title="Recommended Project Structure" text={structure} />
    </>
  );
}

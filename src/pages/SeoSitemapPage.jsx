import PageHero from '../components/PageHero.jsx';
import CopyBox from '../components/CopyBox.jsx';
import { seoSteps } from '../data/guides.js';

const metaExample = `<title>Website Builder Learning Platform</title>
<meta name="description" content="Learn website creation with React section examples, UI guidelines, SEO, sitemap and deployment steps." />
<meta property="og:title" content="Website Builder Learning Platform" />
<meta property="og:description" content="A practical React project for students to learn website creation from A to Z." />
<meta property="og:image" content="https://your-domain.com/og-image.png" />`;

const sitemapExample = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain.com/</loc></url>
  <url><loc>https://your-domain.com/sections</loc></url>
  <url><loc>https://your-domain.com/layouts</loc></url>
  <url><loc>https://your-domain.com/guides</loc></url>
</urlset>`;

const robotsExample = `User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml`;

export default function SeoSitemapPage() {
  return (
    <>
      <PageHero eyebrow="SEO + Sitemap" title="Make the website understandable for Google and users" description="Students learn titles, descriptions, headings, image alt text, sitemap.xml, robots.txt and Google Search Console submission flow." />
      <section className="section-block">
        <div className="timeline-list">
          {seoSteps.map((step, index) => <article className="timeline-item" key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}
        </div>
      </section>
      <section className="section-block two-column">
        <CopyBox title="Meta Tags Example" text={metaExample} />
        <CopyBox title="robots.txt Example" text={robotsExample} />
      </section>
      <CopyBox title="sitemap.xml Example" text={sitemapExample} />
    </>
  );
}

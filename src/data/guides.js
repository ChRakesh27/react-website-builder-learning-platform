export const learningPath = [
  { step: '01', title: 'Understand the website goal', text: 'Before coding, write what the website is for, who will use it, and what action users should take.' },
  { step: '02', title: 'Choose layout type', text: 'Select landing page, business, portfolio, SaaS, NGO, e-commerce or dashboard layout.' },
  { step: '03', title: 'Select needed sections', text: 'Pick sections like hero, about, features, pricing, FAQ, contact and footer based on the website goal.' },
  { step: '04', title: 'Create wireframe', text: 'Draw simple boxes before designing. Decide section order, content and CTA placement.' },
  { step: '05', title: 'Create React project', text: 'Use Vite, create folders, components, pages, data files and style files.' },
  { step: '06', title: 'Build reusable components', text: 'Create Navbar, Footer, SectionCard, CodeBlock, PromptBox, Button, Input and LayoutPreview components.' },
  { step: '07', title: 'Add responsive design', text: 'Check mobile, tablet, laptop and desktop layouts. Fix spacing, text size and grids.' },
  { step: '08', title: 'Check UI/UX quality', text: 'Review padding, margins, font sizes, colors, borders, radius, shadows, hover states and alignment.' },
  { step: '09', title: 'Add SEO and sitemap', text: 'Add titles, meta descriptions, alt text, sitemap.xml, robots.txt and clean page URLs.' },
  { step: '10', title: 'Test and deploy', text: 'Run build, fix errors, test live preview, deploy to Vercel/Netlify/Firebase/Hostinger.' }
];

export const setupSteps = [
  { title: 'Install Node.js', command: 'node -v\nnpm -v', text: 'Check that Node.js and npm are installed.' },
  { title: 'Create Vite React project', command: 'npm create vite@latest my-website -- --template react', text: 'Create a new React app using Vite.' },
  { title: 'Open project folder', command: 'cd my-website', text: 'Move inside your project folder.' },
  { title: 'Install packages', command: 'npm install', text: 'Install all dependencies.' },
  { title: 'Start development server', command: 'npm run dev', text: 'Open the local URL in browser.' },
  { title: 'Create folders', command: 'mkdir src/components src/pages src/data src/assets src/utils', text: 'Organize the project properly.' },
  { title: 'Build for production', command: 'npm run build', text: 'Create optimized production files inside dist folder.' },
  { title: 'Preview build', command: 'npm run preview', text: 'Check final production build before deployment.' }
];

export const namingRules = [
  { item: 'React component file', style: 'PascalCase', good: 'HeroSection.jsx', bad: 'hero-section.jsx', why: 'Component files should match component names and start with uppercase.' },
  { item: 'React component name', style: 'PascalCase', good: 'HeroSection', bad: 'heroSection', why: 'React treats uppercase names as components.' },
  { item: 'Folder name', style: 'lowercase / kebab-case', good: 'section-library', bad: 'Section_Library', why: 'Lowercase folders are clean and URL-friendly.' },
  { item: 'Variable name', style: 'camelCase', good: 'sectionTitle', bad: 'section_title', why: 'JavaScript variables commonly use camelCase.' },
  { item: 'Function name', style: 'camelCase', good: 'handleSubmit', bad: 'Handle_Submit', why: 'Functions are actions, so camelCase keeps them readable.' },
  { item: 'Custom hook', style: 'camelCase starting with use', good: 'useCopyText', bad: 'copyTextHook', why: 'React hooks must start with use.' },
  { item: 'Constant', style: 'UPPERCASE_WITH_UNDERSCORE', good: 'API_BASE_URL', bad: 'apiBaseUrl', why: 'Use uppercase only for values that never change.' },
  { item: 'CSS class', style: 'kebab-case', good: 'hero-section', bad: 'heroSection', why: 'Kebab-case is common for CSS class names.' },
  { item: 'Image file', style: 'kebab-case', good: 'hero-banner.png', bad: 'Hero Banner.png', why: 'No spaces. Lowercase names work better across systems.' },
  { item: 'Route URL', style: 'kebab-case', good: '/seo-sitemap', bad: '/Seo_Sitemap', why: 'Clean lowercase URLs are better for users and SEO.' },
  { item: 'Environment variable', style: 'VITE_UPPERCASE', good: 'VITE_API_URL', bad: 'apiUrl', why: 'Vite exposes browser env variables only when they start with VITE_.' },
  { item: 'Git branch', style: 'kebab-case', good: 'feature/hero-section', bad: 'FeatureHero', why: 'Readable branch names help teams understand work.' }
];

export const typographyScale = [
  { name: 'Hero heading', mobile: '36px / 2.25rem', tablet: '48px / 3rem', desktop: '64px / 4rem', lineHeight: '1.05 - 1.15', weight: '700 - 800', use: 'Main landing page heading only.' },
  { name: 'Page heading H1', mobile: '32px / 2rem', tablet: '42px / 2.625rem', desktop: '56px / 3.5rem', lineHeight: '1.1 - 1.2', weight: '700 - 800', use: 'Top heading of normal pages.' },
  { name: 'Section heading H2', mobile: '28px / 1.75rem', tablet: '36px / 2.25rem', desktop: '44px / 2.75rem', lineHeight: '1.15 - 1.25', weight: '700', use: 'Main heading for sections.' },
  { name: 'Card heading H3', mobile: '20px / 1.25rem', tablet: '22px / 1.375rem', desktop: '24px / 1.5rem', lineHeight: '1.25 - 1.35', weight: '650 - 700', use: 'Card and subsection titles.' },
  { name: 'Body large', mobile: '17px', tablet: '18px', desktop: '20px', lineHeight: '1.6', weight: '400', use: 'Hero subtitles and important descriptions.' },
  { name: 'Body normal', mobile: '15px', tablet: '16px', desktop: '16px - 17px', lineHeight: '1.6 - 1.75', weight: '400', use: 'Most paragraphs.' },
  { name: 'Small text', mobile: '13px', tablet: '14px', desktop: '14px', lineHeight: '1.5', weight: '400 - 500', use: 'Captions, labels, helper text.' },
  { name: 'Button text', mobile: '14px', tablet: '15px', desktop: '15px - 16px', lineHeight: '1', weight: '600 - 700', use: 'CTA and action buttons.' },
  { name: 'Navigation links', mobile: '15px', tablet: '15px', desktop: '14px - 15px', lineHeight: '1', weight: '600', use: 'Navbar and sidebar links.' }
];

export const spacingScale = [
  { token: 'xs', value: '4px', use: 'Icon gaps, tiny labels' },
  { token: 'sm', value: '8px', use: 'Small gaps inside buttons/cards' },
  { token: 'md', value: '16px', use: 'Normal element spacing' },
  { token: 'lg', value: '24px', use: 'Card padding, form groups' },
  { token: 'xl', value: '32px', use: 'Large cards, grid gaps' },
  { token: '2xl', value: '48px', use: 'Small section spacing' },
  { token: '3xl', value: '64px', use: 'Normal section spacing mobile/tablet' },
  { token: '4xl', value: '96px', use: 'Desktop section spacing' }
];

export const breakpoints = [
  { name: 'Small mobile', width: '320px - 374px', check: 'No horizontal scroll, readable text, buttons not clipped.' },
  { name: 'Mobile', width: '375px - 767px', check: 'Single column layout, navbar menu, 44px tap targets.' },
  { name: 'Tablet', width: '768px - 1023px', check: 'Two-column grids where possible, good side padding.' },
  { name: 'Laptop', width: '1024px - 1279px', check: 'Container width and layout balance.' },
  { name: 'Desktop', width: '1280px - 1535px', check: 'Full layout with good whitespace.' },
  { name: 'Large desktop', width: '1536px+', check: 'Max-width container prevents stretched content.' }
];

export const uiChecklist = [
  {
    group: 'Layout & Spacing',
    items: ['Every section has enough top and bottom padding.', 'Cards have equal gap.', 'No random empty spaces.', 'Containers use max-width.', 'Mobile layout stacks correctly.']
  },
  {
    group: 'Typography',
    items: ['Only 1 or 2 fonts used.', 'Headings are bigger than body text.', 'Line height is readable.', 'No paragraph is too wide.', 'Mobile text is not too small.']
  },
  {
    group: 'Colors',
    items: ['Primary color is consistent.', 'Text contrast is readable.', 'Backgrounds are not too harsh.', 'Hover colors are visible.', 'Success/error/warning colors are clear.']
  },
  {
    group: 'Buttons & Forms',
    items: ['Buttons have clear labels.', 'All inputs have labels.', 'Error states are visible.', 'Buttons have hover/focus states.', 'Tap targets are large enough.']
  },
  {
    group: 'Responsive',
    items: ['Check 360px mobile.', 'Check 768px tablet.', 'Check 1024px laptop.', 'Check 1440px desktop.', 'No horizontal scrolling.']
  },
  {
    group: 'Production',
    items: ['No console errors.', 'No broken links.', 'Images are compressed.', 'Meta title and description added.', 'Sitemap and robots files added.', 'Build command works.']
  }
];

export const seoSteps = [
  { title: 'Write unique page title', text: 'Each page should have a clear title around 50 to 60 characters.' },
  { title: 'Write meta description', text: 'Explain the page in 140 to 160 characters with user benefit.' },
  { title: 'Use one H1 per page', text: 'Use H1 for the page title, H2 for sections and H3 for cards.' },
  { title: 'Add image alt text', text: 'Describe what the image shows. Do not write only image or photo.' },
  { title: 'Create sitemap.xml', text: 'List all important page URLs and place it in public folder.' },
  { title: 'Create robots.txt', text: 'Allow search engines and mention your sitemap URL.' },
  { title: 'Submit to Google Search Console', text: 'After deployment, submit your sitemap and inspect important URLs.' }
];

export const deploymentSteps = [
  { title: 'Final local check', command: 'npm run dev', text: 'Open all pages and test UI manually.' },
  { title: 'Production build', command: 'npm run build', text: 'Build optimized files into dist folder.' },
  { title: 'Preview production', command: 'npm run preview', text: 'Check the real production output before uploading.' },
  { title: 'Push to GitHub', command: 'git add .\ngit commit -m "Initial website"\ngit push', text: 'Upload code to GitHub.' },
  { title: 'Deploy to Vercel/Netlify', command: 'Build command: npm run build\nOutput folder: dist', text: 'Import GitHub project and deploy.' },
  { title: 'Connect domain', command: 'Add DNS records from hosting provider', text: 'Add custom domain and enable HTTPS.' },
  { title: 'Post-deployment test', command: 'Test live URL on mobile and desktop', text: 'Check pages, links, forms, SEO and speed.' }
];

export const promptGroups = [
  {
    title: 'Full Website Prompts',
    prompts: [
      'Create a complete React + Vite website for a learning platform. Include navbar, hero, layout library, section library, guide pages, SEO guide, sitemap guide, deployment guide and footer. Use clean responsive UI.',
      'Create a modern landing page for a SaaS product using React. Include dashboard hero, features, process, pricing, testimonials, FAQ and CTA. Use premium spacing, rounded cards and mobile responsive layout.'
    ]
  },
  {
    title: 'UI Improvement Prompts',
    prompts: [
      'Improve this React UI. Check spacing, typography, colors, alignment, border radius, shadows, hover states and responsive design. Explain changes and provide updated code.',
      'Make this section look premium and user-friendly. Keep content simple, improve layout hierarchy, add better card design and make it responsive.'
    ]
  },
  {
    title: 'Code Review Prompts',
    prompts: [
      'Review this React component for clean code, naming rules, reusable structure, accessibility and responsive design. Show what to improve.',
      'Convert this repeated JSX into reusable components and data mapping. Use beginner-friendly code and explain each file.'
    ]
  },
  {
    title: 'SEO Prompts',
    prompts: [
      'Create SEO title, meta description, H1, H2 section headings and image alt text for this page. Keep the language simple and search-friendly.',
      'Generate sitemap.xml and robots.txt examples for a React website with these pages: Home, Sections, Layouts, Guides, Typography, SEO, Deployment and Contact.'
    ]
  }
];

export const codeExamples = [
  {
    title: 'Recommended Folder Structure',
    code: `src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CopyBox.jsx
│   └── SectionCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── SectionsPage.jsx
│   └── GuidesPage.jsx
├── data/
│   ├── sections.js
│   └── guides.js
├── assets/
├── App.jsx
└── main.jsx`
  },
  {
    title: 'Reusable Card Component',
    code: `export default function InfoCard({ title, text, icon }) {
  return (
    <article className="info-card">
      <span className="info-card__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}`
  },
  {
    title: 'Data Mapping Example',
    code: `const features = [
  { title: 'Section Library', text: 'Learn every website section.' },
  { title: 'AI Prompts', text: 'Copy prompts and generate layouts.' }
];

export default function FeatureGrid() {
  return (
    <div className="grid three">
      {features.map((feature) => (
        <article key={feature.title} className="card">
          <h3>{feature.title}</h3>
          <p>{feature.text}</p>
        </article>
      ))}
    </div>
  );
}`
  },
  {
    title: 'React Router Page Setup',
    code: `import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SectionsPage from './pages/SectionsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sections" element={<SectionsPage />} />
    </Routes>
  );
}`
  },
  {
    title: 'Sitemap Example',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain.com/</loc></url>
  <url><loc>https://your-domain.com/sections</loc></url>
  <url><loc>https://your-domain.com/guides</loc></url>
</urlset>`
  }
];

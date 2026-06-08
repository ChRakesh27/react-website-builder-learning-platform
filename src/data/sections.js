const makeCode = (componentName, title, description) => `export default function ${componentName}() {
  return (
    <section className="section ${componentName.toLowerCase()}">
      <div className="container">
        <p className="eyebrow">Section Example</p>
        <h2>${title}</h2>
        <p>${description}</p>
        <div className="section-card-grid">
          <article className="card">Add your first content block here.</article>
          <article className="card">Add your second content block here.</article>
          <article className="card">Add your third content block here.</article>
        </div>
      </div>
    </section>
  );
}`;

const baseRules = [
  'Keep one main purpose for this section.',
  'Use clear heading, short paragraph and proper spacing.',
  'Check mobile, tablet and desktop before finalizing.',
  'Use consistent colors, border radius and font sizes.'
];

export const sectionCategories = ['All', 'Core', 'Content', 'Conversion', 'Trust', 'Navigation', 'App UI', 'Advanced'];

export const sections = [
  {
    slug: 'announcement-bar',
    title: 'Announcement Bar',
    category: 'Navigation',
    level: 'Beginner',
    intro: 'A small top message used for offers, updates, events, launches or important notices.',
    whenToUse: 'Use it above the navbar when you need to highlight one short update without disturbing the full page.',
    layouts: [
      { name: 'Centered Notice', description: 'Single line centered message with one link.' },
      { name: 'Split Notice', description: 'Message on left and action button on right.' },
      { name: 'Dismissible Notice', description: 'Small close icon so users can hide the message.' }
    ],
    rules: [...baseRules, 'Keep announcement text under 90 characters.', 'Do not add many links in this small area.'],
    dos: ['Use for limited offers or important updates.', 'Keep contrast high.', 'Add one clear action link.'],
    donts: ['Do not make it taller than the navbar.', 'Do not use blinking text.', 'Do not add long paragraphs.'],
    prompt: 'Create a clean announcement bar for a React website. It should show a short launch message, one action link, high contrast colors, mobile responsive alignment, and a close button.',
    code: makeCode('AnnouncementBar', 'Launching new templates this week', 'Use this space for one important message.')
  },
  {
    slug: 'navbar',
    title: 'Navbar Section',
    category: 'Navigation',
    level: 'Beginner',
    intro: 'The navbar helps users move between the main pages of a website.',
    whenToUse: 'Use it at the top of almost every website. It should show logo, important links and main call-to-action.',
    layouts: [
      { name: 'Simple Navbar', description: 'Logo on left, links in center, button on right.' },
      { name: 'Sticky Navbar', description: 'Navbar stays visible while scrolling.' },
      { name: 'App Navbar', description: 'Logo, product links, login button and signup button.' },
      { name: 'Mobile Drawer Navbar', description: 'Links collapse into a menu icon on mobile.' }
    ],
    rules: [...baseRules, 'Show only important links.', 'Use active state for current page.', 'Make mobile menu easy to tap.'],
    dos: ['Use clear link labels.', 'Keep logo readable.', 'Use 44px minimum tap height.'],
    donts: ['Do not add too many links.', 'Do not hide important actions.', 'Do not use tiny text on mobile.'],
    prompt: 'Create a responsive React navbar with logo, navigation links, active link style, CTA button, and mobile hamburger menu. Use clean spacing, rounded button and professional colors.',
    code: `export default function Navbar() {
  const links = ['Home', 'Sections', 'Guides', 'SEO', 'Deploy'];
  return (
    <header className="navbar">
      <a className="brand" href="/">WebGuide</a>
      <nav>{links.map((link) => <a key={link} href={'#' + link.toLowerCase()}>{link}</a>)}</nav>
      <button className="primary-button">Start Learning</button>
    </header>
  );
}`
  },
  {
    slug: 'hero',
    title: 'Hero Section',
    category: 'Core',
    level: 'Beginner',
    intro: 'The hero is the first main section. It explains the website value quickly.',
    whenToUse: 'Use it at the top of landing pages, SaaS pages, portfolios, apps and product pages.',
    layouts: [
      { name: 'Text + Image Hero', description: 'Left side content, right side image or mockup.' },
      { name: 'Centered Hero', description: 'Big title, short subtitle and CTA buttons in center.' },
      { name: 'Dashboard Preview Hero', description: 'Perfect for SaaS tools with product screenshot.' },
      { name: 'App Phone Hero', description: 'Best for mobile apps with phone mockup.' }
    ],
    rules: [...baseRules, 'Heading should be clear in 5 seconds.', 'Use one primary CTA and one secondary CTA.', 'Avoid too much text.'],
    dos: ['Use strong headline.', 'Show benefit first.', 'Add trust text or small proof.'],
    donts: ['Do not add 5 buttons.', 'Do not use low-quality images.', 'Do not make the heading vague.'],
    prompt: 'Create a premium hero section for a React website. Include a strong headline, short subtitle, two CTA buttons, trust badges, and a right-side dashboard preview. Use modern clean UI, responsive design, good spacing, rounded cards and soft shadows.',
    code: `export default function HeroSection() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Beginner friendly</p>
        <h1>Build better websites step by step</h1>
        <p>Learn layouts, sections, UI rules, SEO and deployment with examples.</p>
        <div className="button-row">
          <button>Start learning</button>
          <button className="ghost">View sections</button>
        </div>
      </div>
      <div className="dashboard-preview">Product preview here</div>
    </section>
  );
}`
  },
  {
    slug: 'logo-cloud',
    title: 'Logo Cloud / Trusted By',
    category: 'Trust',
    level: 'Beginner',
    intro: 'A small section that shows client logos, partner logos or tools used.',
    whenToUse: 'Use after the hero to build quick trust.',
    layouts: [
      { name: 'Simple Row', description: 'Logos in one horizontal row.' },
      { name: 'Two Row Grid', description: 'Better for many logos.' },
      { name: 'With Heading', description: 'Short heading above logos.' }
    ],
    rules: [...baseRules, 'Use same logo height.', 'Make logos grayscale if needed.', 'Keep spacing equal.'],
    dos: ['Use real logos only with permission.', 'Keep logos aligned.', 'Compress images.'],
    donts: ['Do not stretch logos.', 'Do not mix random sizes.', 'Do not add fake logos.'],
    prompt: 'Create a trusted-by logo cloud section in React with a short heading and responsive logo grid. Keep all logos aligned, same visual size, subtle grayscale style and clean spacing.',
    code: makeCode('LogoCloud', 'Trusted by teams and students', 'Add partner logos or tool logos here.')
  },
  {
    slug: 'about',
    title: 'About Section',
    category: 'Content',
    level: 'Beginner',
    intro: 'The about section explains who you are, what you do and why users should care.',
    whenToUse: 'Use after hero or features when users need background information.',
    layouts: [
      { name: 'Text + Image', description: 'Good for company or personal story.' },
      { name: 'Mission Cards', description: 'Mission, vision and values in cards.' },
      { name: 'Story Timeline', description: 'Show journey or history step by step.' },
      { name: 'Founder Note', description: 'Personal brand or startup intro.' }
    ],
    rules: [...baseRules, 'Explain clearly in simple words.', 'Use real numbers or proof where possible.', 'Keep story short.'],
    dos: ['Tell user benefit.', 'Add mission and vision.', 'Use human language.'],
    donts: ['Do not write a long company essay.', 'Do not use too much jargon.', 'Do not hide important proof.'],
    prompt: 'Create a modern About section for a React website. Include a short story, mission card, vision card, values card, and an image placeholder. Use clean layout, simple language and responsive design.',
    code: makeCode('AboutSection', 'About our learning platform', 'We help beginners understand website creation with examples and guides.')
  },
  {
    slug: 'features',
    title: 'Features Grid',
    category: 'Core',
    level: 'Beginner',
    intro: 'A features section explains important product or website benefits in small cards.',
    whenToUse: 'Use when your product, app or service has multiple benefits to explain.',
    layouts: [
      { name: '3 Card Grid', description: 'Best for simple websites.' },
      { name: 'Bento Grid', description: 'Premium layout with different card sizes.' },
      { name: 'Icon Feature List', description: 'Good for services and apps.' },
      { name: 'Screenshot Feature', description: 'Feature text with product image.' }
    ],
    rules: [...baseRules, 'Start every feature with a benefit.', 'Use consistent icon size.', 'Keep cards equal height if possible.'],
    dos: ['Use 3 to 6 features.', 'Use icons carefully.', 'Keep text short.'],
    donts: ['Do not add 15 features on one screen.', 'Do not repeat same point.', 'Do not use different card styles randomly.'],
    prompt: 'Create a modern responsive features section in React with 6 feature cards. Each card should have an icon placeholder, title, short description, hover effect, rounded corners and clean spacing.',
    code: makeCode('FeaturesSection', 'Everything students need to learn', 'Show your important features in clear cards.')
  },
  {
    slug: 'services',
    title: 'Services Section',
    category: 'Content',
    level: 'Beginner',
    intro: 'A services section lists what a business or person offers.',
    whenToUse: 'Use for agencies, freelancers, companies, NGOs and consultants.',
    layouts: [
      { name: 'Service Cards', description: 'Each service has title, text and link.' },
      { name: 'Service List', description: 'Left menu list and right description.' },
      { name: 'Icon Services', description: 'Use icons to explain service categories.' }
    ],
    rules: [...baseRules, 'Name services clearly.', 'Add result or benefit for each service.', 'Use CTA after services.'],
    dos: ['Use action-oriented service names.', 'Mention who it is for.', 'Add starting price if needed.'],
    donts: ['Do not use unclear service names.', 'Do not write long paragraphs in cards.', 'Do not mix products and services without labels.'],
    prompt: 'Create a clean services section for a React website with 4 service cards, icons, titles, short descriptions, learn more links and a CTA button. Make it responsive and beginner friendly.',
    code: makeCode('ServicesSection', 'Services we provide', 'Explain what users can get from your website or business.')
  },
  {
    slug: 'how-it-works',
    title: 'How It Works / Process',
    category: 'Core',
    level: 'Beginner',
    intro: 'A process section explains steps users need to follow.',
    whenToUse: 'Use for products, apps, services, learning platforms, booking flows and onboarding.',
    layouts: [
      { name: '3 Step Process', description: 'Simple horizontal steps.' },
      { name: 'Vertical Timeline', description: 'Good for mobile and detailed process.' },
      { name: 'Numbered Cards', description: 'Cards with step numbers.' }
    ],
    rules: [...baseRules, 'Use clear step numbers.', 'Do not add too many steps.', 'Keep action words simple.'],
    dos: ['Use 3 to 5 steps.', 'Start each step with a verb.', 'Show expected result.'],
    donts: ['Do not make the process confusing.', 'Do not hide required actions.', 'Do not use long technical wording.'],
    prompt: 'Create a How It Works section in React with 4 numbered steps. Each step should have a short title, explanation, icon placeholder and connecting line on desktop. Make it stack on mobile.',
    code: makeCode('HowItWorks', 'How it works', 'Explain the journey in simple steps.')
  },
  {
    slug: 'stats',
    title: 'Stats / Numbers Section',
    category: 'Trust',
    level: 'Beginner',
    intro: 'Stats show proof using numbers such as users, projects, countries or success rate.',
    whenToUse: 'Use after about, hero or testimonials to build trust.',
    layouts: [
      { name: 'Simple Stat Row', description: '3 or 4 numbers in a row.' },
      { name: 'Stats with Image', description: 'Numbers beside image.' },
      { name: 'Gradient Stats Band', description: 'Strong visual strip with high contrast.' }
    ],
    rules: [...baseRules, 'Use real numbers.', 'Add labels below numbers.', 'Avoid fake proof.'],
    dos: ['Use concise labels.', 'Round large numbers carefully.', 'Add context if number is not clear.'],
    donts: ['Do not invent numbers.', 'Do not use too many statistics.', 'Do not use tiny labels.'],
    prompt: 'Create a stats section for a React website with 4 statistic cards, large numbers, short labels and a clean responsive grid. Use professional spacing and subtle background.',
    code: makeCode('StatsSection', 'Numbers that build trust', 'Use real proof points here.')
  },
  {
    slug: 'cta',
    title: 'Call To Action Section',
    category: 'Conversion',
    level: 'Beginner',
    intro: 'A CTA section asks users to take one important action.',
    whenToUse: 'Use after benefits, pricing, FAQ or at the bottom of a page.',
    layouts: [
      { name: 'Centered CTA', description: 'Heading, text and one button.' },
      { name: 'Split CTA', description: 'Text on left and button on right.' },
      { name: 'Gradient CTA', description: 'High energy section for conversion.' }
    ],
    rules: [...baseRules, 'Use one main action.', 'Make button text clear.', 'Repeat value before asking action.'],
    dos: ['Use strong button label.', 'Place after trust-building content.', 'Keep text short.'],
    donts: ['Do not add many CTAs together.', 'Do not make CTA look like normal text.', 'Do not use vague button text like click here.'],
    prompt: 'Create a high-converting CTA section in React with a strong heading, short supportive text and one primary button. Use a premium card style, responsive layout and clean spacing.',
    code: makeCode('CtaSection', 'Ready to build your first website?', 'Guide the user to the next step.')
  },
  {
    slug: 'pricing',
    title: 'Pricing Section',
    category: 'Conversion',
    level: 'Intermediate',
    intro: 'Pricing explains plans, features and cost clearly so users can choose.',
    whenToUse: 'Use for SaaS, courses, services, subscriptions or product packages.',
    layouts: [
      { name: '3 Tier Pricing', description: 'Basic, Pro and Business.' },
      { name: 'Toggle Pricing', description: 'Monthly and yearly switch.' },
      { name: 'Single Plan Pricing', description: 'For one simple offer.' },
      { name: 'Comparison Pricing', description: 'Pricing with feature comparison table.' }
    ],
    rules: [...baseRules, 'Highlight recommended plan.', 'Show what is included.', 'Make price easy to read.'],
    dos: ['Use clear feature bullets.', 'Show billing period.', 'Add FAQ below pricing.'],
    donts: ['Do not hide important limits.', 'Do not use confusing discounts.', 'Do not make all plans look same.'],
    prompt: 'Create a responsive pricing section in React with 3 pricing cards, feature lists, recommended badge, CTA buttons and monthly/yearly toggle design. Use clean modern UI.',
    code: makeCode('PricingSection', 'Simple pricing for every learner', 'Show plans and benefits clearly.')
  },
  {
    slug: 'testimonials',
    title: 'Testimonials Section',
    category: 'Trust',
    level: 'Beginner',
    intro: 'Testimonials show user feedback and social proof.',
    whenToUse: 'Use after features, services or pricing to build confidence.',
    layouts: [
      { name: '3 Testimonial Cards', description: 'Simple row of feedback cards.' },
      { name: 'Carousel Style', description: 'Good when many reviews are available.' },
      { name: 'Featured Review', description: 'One strong review with image.' }
    ],
    rules: [...baseRules, 'Use real names/photos if allowed.', 'Keep reviews short.', 'Use context like role or company.'],
    dos: ['Use specific results.', 'Use readable quote length.', 'Add rating if relevant.'],
    donts: ['Do not use fake reviews.', 'Do not add long paragraphs.', 'Do not overfill with too many cards.'],
    prompt: 'Create a testimonials section in React with 3 review cards, avatar placeholders, names, roles, ratings and short quotes. Use clean spacing, rounded cards and responsive design.',
    code: makeCode('TestimonialsSection', 'What students say', 'Add real feedback to build trust.')
  },
  {
    slug: 'faq',
    title: 'FAQ Section',
    category: 'Trust',
    level: 'Beginner',
    intro: 'FAQ answers common questions before users contact you.',
    whenToUse: 'Use near the bottom of pages, after pricing or service details.',
    layouts: [
      { name: 'Accordion FAQ', description: 'Click question to open answer.' },
      { name: 'Two Column FAQ', description: 'Good for many questions.' },
      { name: 'FAQ with Contact CTA', description: 'Add support button below questions.' }
    ],
    rules: [...baseRules, 'Use real user questions.', 'Answer in simple words.', 'Group questions by topic if many.'],
    dos: ['Keep answers direct.', 'Use accordions for long FAQ.', 'Add contact link after FAQ.'],
    donts: ['Do not write marketing lines as questions.', 'Do not use very long answers.', 'Do not repeat same information.'],
    prompt: 'Create a responsive FAQ section in React using accordion cards. Include 6 questions, simple answers, smooth open/close behavior and a contact support CTA below.',
    code: `import { useState } from 'react';

const faqs = [
  { q: 'Can beginners use this?', a: 'Yes, every step is explained in simple words.' },
  { q: 'Do I need design experience?', a: 'No, use the layout examples and checklists.' }
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);
  return <section>{faqs.map((item, index) => (
    <button key={item.q} onClick={() => setOpen(index)}>
      <strong>{item.q}</strong>
      {open === index && <p>{item.a}</p>}
    </button>
  ))}</section>;
}`
  },
  {
    slug: 'contact',
    title: 'Contact Section',
    category: 'Conversion',
    level: 'Beginner',
    intro: 'Contact section allows users to message, call, email or locate you.',
    whenToUse: 'Use at the bottom of service websites, portfolios, business pages and support pages.',
    layouts: [
      { name: 'Contact Form', description: 'Name, email, message and submit button.' },
      { name: 'Contact Cards', description: 'Email, phone, location cards.' },
      { name: 'Map + Form', description: 'Location map beside form.' }
    ],
    rules: [...baseRules, 'Ask only required fields.', 'Show success/error states.', 'Make form labels clear.'],
    dos: ['Use labels for inputs.', 'Add contact alternatives.', 'Check mobile keyboard experience.'],
    donts: ['Do not ask unnecessary fields.', 'Do not hide validation errors.', 'Do not make button unclear.'],
    prompt: 'Create a contact section in React with a clean form, name/email/message fields, contact info cards and responsive two-column layout. Include validation-friendly labels.',
    code: makeCode('ContactSection', 'Contact us', 'Give users a simple way to reach you.')
  },
  {
    slug: 'footer',
    title: 'Footer Section',
    category: 'Navigation',
    level: 'Beginner',
    intro: 'Footer contains useful links, company info, legal links and contact information.',
    whenToUse: 'Use at the end of every website.',
    layouts: [
      { name: 'Simple Footer', description: 'Logo, short text and links.' },
      { name: 'Mega Footer', description: 'Multiple link columns for big websites.' },
      { name: 'Newsletter Footer', description: 'Footer with email subscribe form.' }
    ],
    rules: [...baseRules, 'Add important links only.', 'Include copyright.', 'Add privacy and terms links.'],
    dos: ['Group links by topic.', 'Keep contact visible.', 'Use enough spacing.'],
    donts: ['Do not make footer messy.', 'Do not repeat entire navbar.', 'Do not forget legal pages.'],
    prompt: 'Create a professional responsive footer in React with logo, short description, four link columns, newsletter input, social icons placeholders, privacy link and copyright line.',
    code: makeCode('FooterSection', 'Footer navigation', 'Help users find important pages at the end.')
  },
  {
    slug: 'blog-cards',
    title: 'Blog Cards Section',
    category: 'Content',
    level: 'Beginner',
    intro: 'Blog cards show latest articles, guides, news or activities.',
    whenToUse: 'Use on blogs, NGO websites, learning platforms, portfolios and company sites.',
    layouts: [
      { name: '3 Article Cards', description: 'Image, category, title and excerpt.' },
      { name: 'Featured + Small Cards', description: 'One big post and smaller post list.' },
      { name: 'Masonry Blog Grid', description: 'Different card heights.' }
    ],
    rules: [...baseRules, 'Use consistent image ratio.', 'Keep excerpts short.', 'Show date or category.'],
    dos: ['Use meaningful article titles.', 'Add read more link.', 'Compress images.'],
    donts: ['Do not use different image sizes randomly.', 'Do not add too much text in card.', 'Do not hide post category.'],
    prompt: 'Create a blog cards section in React with 3 latest article cards, image placeholders, category label, title, short excerpt, date and read more link. Make it responsive.',
    code: makeCode('BlogCards', 'Latest learning articles', 'Show new articles or activities in cards.')
  },
  {
    slug: 'gallery',
    title: 'Gallery / Portfolio Grid',
    category: 'Content',
    level: 'Intermediate',
    intro: 'Gallery shows images, projects, events or portfolio work in a visual grid.',
    whenToUse: 'Use for portfolios, events, NGOs, photographers, restaurants and product showcases.',
    layouts: [
      { name: 'Equal Grid', description: 'Same size image cards.' },
      { name: 'Masonry Gallery', description: 'Pinterest-style different heights.' },
      { name: 'Filterable Portfolio', description: 'Category filter buttons above grid.' }
    ],
    rules: [...baseRules, 'Use optimized images.', 'Keep image ratio consistent.', 'Add alt text.'],
    dos: ['Use real high quality images.', 'Add category filters if many items.', 'Use lightbox if useful.'],
    donts: ['Do not upload huge images.', 'Do not mix unrelated images.', 'Do not ignore mobile layout.'],
    prompt: 'Create a responsive portfolio gallery section in React with category filter buttons, project image cards, titles and hover overlay. Use clean modern styling.',
    code: makeCode('GallerySection', 'Project gallery', 'Show work, events or portfolio items visually.')
  },
  {
    slug: 'team',
    title: 'Team Section',
    category: 'Trust',
    level: 'Beginner',
    intro: 'Team section introduces people behind a company, project or organization.',
    whenToUse: 'Use when credibility depends on people, experts, founders or staff.',
    layouts: [
      { name: 'Team Cards', description: 'Photo, name, role and short bio.' },
      { name: 'Founder Feature', description: 'Large founder card with message.' },
      { name: 'Compact Team Grid', description: 'Many members in small cards.' }
    ],
    rules: [...baseRules, 'Use consistent photo style.', 'Show role clearly.', 'Keep bio short.'],
    dos: ['Use real photos with permission.', 'Add social links if needed.', 'Keep card alignment clean.'],
    donts: ['Do not use inconsistent crop sizes.', 'Do not write very long bios.', 'Do not add personal info unnecessarily.'],
    prompt: 'Create a modern team section in React with 4 member cards, avatar images, names, roles, short bios and social link placeholders. Make it responsive and professional.',
    code: makeCode('TeamSection', 'Meet the team', 'Introduce people behind the work.')
  },
  {
    slug: 'comparison-table',
    title: 'Comparison Table',
    category: 'Conversion',
    level: 'Intermediate',
    intro: 'A comparison table helps users compare plans, products, features or competitors.',
    whenToUse: 'Use near pricing, product pages or tool comparison pages.',
    layouts: [
      { name: 'Plan Comparison', description: 'Features in rows, plans in columns.' },
      { name: 'Before vs After', description: 'Compare old and new workflow.' },
      { name: 'Competitor Comparison', description: 'Compare your product with alternatives.' }
    ],
    rules: [...baseRules, 'Keep columns limited on mobile.', 'Highlight important differences.', 'Make table scrollable on small screens.'],
    dos: ['Use check icons and clear labels.', 'Group features by category.', 'Highlight best choice.'],
    donts: ['Do not create very wide tables without scroll.', 'Do not hide important limitations.', 'Do not use unclear symbols.'],
    prompt: 'Create a responsive comparison table in React for three plans. Include feature rows, check/cross symbols, highlighted recommended plan and horizontal scroll on mobile.',
    code: makeCode('ComparisonTable', 'Compare plans clearly', 'Help users choose the right option.')
  },
  {
    slug: 'newsletter',
    title: 'Newsletter Section',
    category: 'Conversion',
    level: 'Beginner',
    intro: 'Newsletter section collects emails for updates, guides or offers.',
    whenToUse: 'Use for blogs, learning platforms, communities and product launches.',
    layouts: [
      { name: 'Simple Subscribe Box', description: 'Heading, input and button.' },
      { name: 'Newsletter Card', description: 'Centered card with benefit bullets.' },
      { name: 'Footer Newsletter', description: 'Subscribe form inside footer.' }
    ],
    rules: [...baseRules, 'Tell users what they receive.', 'Use email validation.', 'Do not ask too many fields.'],
    dos: ['Show frequency if possible.', 'Add privacy reassurance.', 'Use clear button text.'],
    donts: ['Do not force subscribe.', 'Do not use misleading text.', 'Do not ask phone number for simple newsletter.'],
    prompt: 'Create a newsletter signup section in React with heading, short benefit text, email input, subscribe button and privacy note. Use clean card UI and responsive layout.',
    code: makeCode('NewsletterSection', 'Get weekly website tips', 'Collect emails with clear value.')
  },
  {
    slug: 'auth-login',
    title: 'Login / Signup UI',
    category: 'App UI',
    level: 'Intermediate',
    intro: 'Auth pages allow users to login, signup, reset password or verify account.',
    whenToUse: 'Use in apps, dashboards, SaaS tools and gated learning platforms.',
    layouts: [
      { name: 'Centered Auth Card', description: 'Simple form in center of screen.' },
      { name: 'Split Auth Page', description: 'Form on one side, illustration on other.' },
      { name: 'Social Login Auth', description: 'Google/GitHub buttons plus email form.' }
    ],
    rules: [...baseRules, 'Use labels and error messages.', 'Keep forms short.', 'Make password rules visible.'],
    dos: ['Add forgot password link.', 'Show loading state.', 'Use accessible inputs.'],
    donts: ['Do not use placeholder only.', 'Do not hide error message.', 'Do not make small tap targets.'],
    prompt: 'Create a clean login page in React with email and password fields, labels, forgot password link, social login button, validation message space and responsive centered card design.',
    code: makeCode('LoginPage', 'Welcome back', 'Create a simple and accessible login form.')
  },
  {
    slug: 'dashboard-layout',
    title: 'Dashboard Layout',
    category: 'App UI',
    level: 'Intermediate',
    intro: 'Dashboard layout organizes app pages with sidebar, topbar, widgets and tables.',
    whenToUse: 'Use for admin panels, SaaS apps, analytics tools and internal portals.',
    layouts: [
      { name: 'Sidebar Dashboard', description: 'Sidebar navigation and main content.' },
      { name: 'Topbar Dashboard', description: 'Top navigation with widgets below.' },
      { name: 'Analytics Dashboard', description: 'Stats cards, charts and tables.' }
    ],
    rules: [...baseRules, 'Keep navigation predictable.', 'Use consistent card sizes.', 'Show important data first.'],
    dos: ['Use clear sidebar labels.', 'Group related data.', 'Add empty and loading states.'],
    donts: ['Do not overload first screen.', 'Do not use unclear icons only.', 'Do not forget mobile layout.'],
    prompt: 'Create a responsive dashboard layout in React with sidebar, topbar, stats cards, chart placeholder, recent activity table and clean app UI spacing.',
    code: makeCode('DashboardLayout', 'Dashboard overview', 'Organize app data using cards and navigation.')
  },
  {
    slug: 'forms',
    title: 'Forms & Inputs',
    category: 'App UI',
    level: 'Beginner',
    intro: 'Forms collect user data such as contact messages, profile details or feedback.',
    whenToUse: 'Use anywhere users need to submit information.',
    layouts: [
      { name: 'Single Column Form', description: 'Best for mobile and simple forms.' },
      { name: 'Two Column Form', description: 'Good for profile or checkout forms.' },
      { name: 'Stepper Form', description: 'Break long forms into steps.' }
    ],
    rules: [...baseRules, 'Use visible labels.', 'Show helper text and error states.', 'Keep required fields clear.'],
    dos: ['Use correct input type.', 'Show success state.', 'Use clear submit button.'],
    donts: ['Do not use placeholder as only label.', 'Do not ask unnecessary details.', 'Do not forget keyboard navigation.'],
    prompt: 'Create a reusable React form component with labels, inputs, select, textarea, validation message placeholders and submit button. Use accessible markup and clean responsive styling.',
    code: makeCode('FormSection', 'User form', 'Collect information with clean inputs.')
  },
  {
    slug: 'tables',
    title: 'Tables & Lists',
    category: 'App UI',
    level: 'Intermediate',
    intro: 'Tables show structured data like users, orders, reports or tasks.',
    whenToUse: 'Use in dashboards, admin panels, reports and management tools.',
    layouts: [
      { name: 'Basic Table', description: 'Rows and columns with simple data.' },
      { name: 'Table with Actions', description: 'Edit, delete or view buttons.' },
      { name: 'Responsive Card Table', description: 'Rows become cards on mobile.' }
    ],
    rules: [...baseRules, 'Keep columns necessary.', 'Add empty state.', 'Make table scroll on mobile.'],
    dos: ['Use clear column names.', 'Add search/filter if many rows.', 'Align numbers properly.'],
    donts: ['Do not make unreadable wide tables.', 'Do not use random column widths.', 'Do not forget loading state.'],
    prompt: 'Create a responsive data table in React with headers, rows, status badges, action buttons, search bar and mobile horizontal scroll. Use clean dashboard UI.',
    code: makeCode('DataTable', 'Student progress table', 'Show structured data in rows and columns.')
  },
  {
    slug: 'modal',
    title: 'Modal / Popup',
    category: 'Advanced',
    level: 'Intermediate',
    intro: 'Modal shows important focused content above the current page.',
    whenToUse: 'Use for confirmations, quick forms, details preview or important alerts.',
    layouts: [
      { name: 'Confirmation Modal', description: 'Confirm delete or submit action.' },
      { name: 'Form Modal', description: 'Short form inside popup.' },
      { name: 'Content Modal', description: 'Show details without leaving page.' }
    ],
    rules: [...baseRules, 'Provide close button.', 'Trap focus for accessibility.', 'Do not overuse modals.'],
    dos: ['Use clear title.', 'Add cancel and confirm actions.', 'Close on escape if possible.'],
    donts: ['Do not show modal on every page load.', 'Do not hide close action.', 'Do not put huge content in modal.'],
    prompt: 'Create an accessible React modal component with backdrop, close button, title, content area, cancel button and primary action button. Include open/close state example.',
    code: `import { useState } from 'react';

export default function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && <div className="modal-backdrop">
        <div className="modal-card">
          <button onClick={() => setOpen(false)}>Close</button>
          <h2>Confirm action</h2>
          <p>Are you sure you want to continue?</p>
        </div>
      </div>}
    </>
  );
}`
  },
  {
    slug: 'tabs-accordion',
    title: 'Tabs & Accordion',
    category: 'Advanced',
    level: 'Intermediate',
    intro: 'Tabs and accordions organize content without making the page too long.',
    whenToUse: 'Use tabs for related categories and accordions for questions or hidden details.',
    layouts: [
      { name: 'Horizontal Tabs', description: 'Good for desktop.' },
      { name: 'Pill Tabs', description: 'Modern rounded tab buttons.' },
      { name: 'Accordion List', description: 'Stacked questions and answers.' }
    ],
    rules: [...baseRules, 'Use clear active state.', 'Do not hide critical content.', 'Keep labels short.'],
    dos: ['Use tabs for same-level content.', 'Use accordions for FAQs.', 'Make keyboard friendly.'],
    donts: ['Do not put unrelated pages in tabs.', 'Do not make 10 tabs in one row.', 'Do not hide main CTA inside closed accordion.'],
    prompt: 'Create a React tabs component with three tabs, active state, smooth content change and responsive pill-style tab buttons. Also include accordion example below.',
    code: makeCode('TabsSection', 'Organized learning topics', 'Use tabs to group related content.')
  },
  {
    slug: 'breadcrumbs',
    title: 'Breadcrumbs',
    category: 'Navigation',
    level: 'Beginner',
    intro: 'Breadcrumbs show users where they are inside the website structure.',
    whenToUse: 'Use for large websites with nested pages, documentation, e-commerce and learning platforms.',
    layouts: [
      { name: 'Simple Breadcrumb', description: 'Home / Category / Page.' },
      { name: 'Icon Breadcrumb', description: 'Home icon and chevron separators.' },
      { name: 'Compact Breadcrumb', description: 'Short version for mobile.' }
    ],
    rules: [...baseRules, 'Keep path accurate.', 'Last item should be current page.', 'Use small readable text.'],
    dos: ['Link previous levels.', 'Use separator clearly.', 'Hide less important levels on mobile.'],
    donts: ['Do not use breadcrumbs for one-page websites.', 'Do not make last item clickable to same page.', 'Do not use long labels.'],
    prompt: 'Create a breadcrumb component in React with Home, category and current page links. Use chevron separators, small text, active current page and responsive behavior.',
    code: makeCode('Breadcrumbs', 'Home / Sections / Hero', 'Show current page path clearly.')
  },
  {
    slug: 'empty-states',
    title: 'Empty / Loading / Error States',
    category: 'Advanced',
    level: 'Intermediate',
    intro: 'State screens explain what is happening when there is no data, loading data or an error.',
    whenToUse: 'Use in apps, dashboards, forms, API data pages and search results.',
    layouts: [
      { name: 'Empty State Card', description: 'Icon, message and action button.' },
      { name: 'Loading Skeleton', description: 'Placeholder while content loads.' },
      { name: 'Error State', description: 'Friendly error with retry button.' }
    ],
    rules: [...baseRules, 'Tell users what happened.', 'Give next action.', 'Do not show blank screen.'],
    dos: ['Use friendly language.', 'Add retry button for errors.', 'Use skeletons for loading.'],
    donts: ['Do not show technical error only.', 'Do not leave page empty.', 'Do not blame user.'],
    prompt: 'Create React empty, loading and error state components. Each should have an icon placeholder, clear message, supporting text and action button. Use friendly UI.',
    code: makeCode('StateMessage', 'No sections found', 'Give a helpful message and next action.')
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Basics',
    category: 'Advanced',
    level: 'Intermediate',
    intro: 'Accessibility makes websites usable for keyboard users, screen readers and all people.',
    whenToUse: 'Use accessibility rules in every section, component and page.',
    layouts: [
      { name: 'Accessible Buttons', description: 'Real button elements with labels.' },
      { name: 'Accessible Forms', description: 'Label connected to input.' },
      { name: 'Focus States', description: 'Visible focus outline for keyboard use.' }
    ],
    rules: [...baseRules, 'Use semantic HTML.', 'Add alt text for images.', 'Keep color contrast readable.', 'Use button for actions and link for navigation.'],
    dos: ['Use labels.', 'Use keyboard focus style.', 'Use heading order correctly.'],
    donts: ['Do not remove outline without replacement.', 'Do not use div as button.', 'Do not use color alone for meaning.'],
    prompt: 'Review this React section for accessibility. Improve semantic HTML, labels, alt text, keyboard focus, button/link usage, heading order and color contrast. Explain changes simply.',
    code: `export default function AccessibleForm() {
  return (
    <form aria-label="Contact form">
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}`
  },
  {
    slug: 'responsive-layout',
    title: 'Responsive Layout Rules',
    category: 'Advanced',
    level: 'Intermediate',
    intro: 'Responsive design makes websites work properly on mobile, tablet and desktop.',
    whenToUse: 'Use it for every page and every component.',
    layouts: [
      { name: 'Stack on Mobile', description: 'Columns become one column on small screens.' },
      { name: 'Grid Responsive', description: '1 column mobile, 2 tablet, 3 desktop.' },
      { name: 'Flexible Container', description: 'Max width container with side padding.' }
    ],
    rules: [...baseRules, 'Design mobile first.', 'Test at 360px, 768px, 1024px and 1440px.', 'Avoid fixed widths.'],
    dos: ['Use max-width containers.', 'Use relative units.', 'Check tap targets.'],
    donts: ['Do not use fixed large widths.', 'Do not hide important content on mobile.', 'Do not ignore landscape tablet.'],
    prompt: 'Make this React page fully responsive. Use mobile-first layout, proper breakpoints, flexible grids, readable font sizes, good spacing and test for mobile, tablet and desktop.',
    code: makeCode('ResponsiveGrid', 'Responsive grid', 'Make layouts adapt to every screen size.')
  }
];

import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { sections } from '../data/sections.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/sections', label: 'A-Z Sections' },
  { to: '/layouts', label: 'Layouts' },
  { to: '/guides', label: 'End-to-End Guide' },
  { to: '/typography', label: 'Font Sizes' },
  { to: '/naming-rules', label: 'Naming Rules' },
  { to: '/style-guide', label: 'Style Guide' },
  { to: '/ui-checklist', label: 'UI Checklist' },
  { to: '/seo-sitemap', label: 'SEO + Sitemap' },
  { to: '/deployment', label: 'Deployment' },
  { to: '/prompt-library', label: 'Prompts' },
  { to: '/code-lab', label: 'Code Lab' }
];

const searchItems = [
  ...navItems.map((item) => ({
    id: `page-${item.to}`,
    label: item.label,
    to: item.to,
    type: 'Page',
    meta: 'Main navigation'
  })),
  ...sections.map((section) => ({
    id: `section-${section.slug}`,
    label: section.title,
    to: `/sections/${section.slug}`,
    type: 'Section',
    meta: `${section.category} - ${section.level}`
  }))
];

const microSearchItems = [
  { id: 'micro-color', label: 'Style Guide - Color palette', to: '/style-guide#style-colors', type: 'Quick Jump', meta: 'Colors and color panel' },
  { id: 'micro-typography', label: 'Font Sizes', to: '/typography', type: 'Quick Jump', meta: 'Typography scale and text sizing' },
  { id: 'micro-seo', label: 'SEO + Sitemap', to: '/seo-sitemap', type: 'Quick Jump', meta: 'Metadata, sitemap, indexing' },
  { id: 'micro-navbar', label: 'Navbar Section', to: '/sections/navbar', type: 'Quick Jump', meta: 'Navigation section details' }
];

export default function AppLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...microSearchItems, ...searchItems];

    const microMatches = microSearchItems.filter((item) =>
      [item.label, item.meta, item.type].join(' ').toLowerCase().includes(q)
    );

    if (q.includes('color') || q.includes('colour') || q.includes('palette')) {
      const colorJump = microSearchItems.find((item) => item.id === 'micro-color');
      if (colorJump && !microMatches.some((item) => item.id === colorJump.id)) {
        microMatches.unshift(colorJump);
      }
    }

    const pageMatches = searchItems.filter((item) =>
      [item.label, item.meta, item.type].join(' ').toLowerCase().includes(q)
    );
    return [...microMatches, ...pageMatches];
  }, [query]);

  const openSearch = () => {
    setQuery('');
    setIsSearchOpen(true);
  };

  const closeSearch = () => setIsSearchOpen(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span>WG</span>
          <div>
            <strong>WebGuide</strong>
            <small>Learn websites A-Z</small>
          </div>
        </Link>
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>Student Goal</strong>
          <p>Learn what to create, how to code, how to check UI and how to deploy.</p>
        </div>
      </aside>

      <div className="main-shell">
        <header className="mobile-topbar">
          <Link to="/" className="brand small"><span>WG</span><strong>WebGuide</strong></Link>
          <button type="button" className="nav-search-btn" aria-label="Open website search" onClick={openSearch}>
            <Search size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="main-content">
          <button type="button" className="floating-search-btn" onClick={openSearch}>
            <Search size={16} aria-hidden="true" />
            Search Website
          </button>
          <Outlet />
        </main>
        <footer className="site-footer">
          <div>
            <strong>Website Builder Learning Platform</strong>
            <p>React project for students to learn website creation from planning to production.</p>
          </div>
          <div className="footer-tags">
            <span>React</span><span>UI/UX</span><span>SEO</span><span>Deployment</span>
          </div>
        </footer>
      </div>

      {isSearchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Website search" onClick={closeSearch}>
          <div className="search-modal" onClick={(event) => event.stopPropagation()}>
            <div className="search-head">
              <h3>Search the full website</h3>
              <button type="button" className="search-close" onClick={closeSearch} aria-label="Close search">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Search pages, sections, guides..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="search-results">
              {filteredItems.map((item) => (
                <Link key={item.id} to={item.to} className="search-item" onClick={closeSearch}>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.meta}</small>
                  </div>
                  <span>{item.type}</span>
                </Link>
              ))}
              {!filteredItems.length && <p className="muted">No matches found.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

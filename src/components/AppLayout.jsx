import { useMemo, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/projects/new', label: 'Create Project' },
  { to: '/teams', label: 'Teams' },
  { to: '/login', label: 'Login' }
];

export default function AppLayout() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span>PM</span>
          <div>
            <strong>Project Hub</strong>
            <small>Manage projects, teams, tasks</small>
          </div>
        </Link>
        <div className="sidebar-search">
          <button type="button" className="floating-search-btn w-full justify-start" onClick={() => setOpen(true)}>
            <Search size={16} aria-hidden="true" />
            Search
          </button>
        </div>
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>Workspace</strong>
          <p>Track projects, assign teams, create tasks, and manage subtasks with CRUD-backed data.</p>
        </div>
      </aside>
      <div className="main-shell">
        <header className="mobile-topbar">
          <Link to="/" className="brand small"><span>PM</span><strong>Project Hub</strong></Link>
          <button type="button" className="nav-search-btn" aria-label="Open search" onClick={() => setOpen(true)}>
            <Search size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search navigation" onClick={() => setOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-head">
              <h3>Search navigation</h3>
              <button type="button" className="search-close" onClick={() => setOpen(false)} aria-label="Close search">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <input autoFocus type="text" placeholder="Search pages..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="search-results">
              {filteredNav.map((item) => (
                <Link key={item.to} to={item.to} className="search-item" onClick={() => setOpen(false)}>
                  <div>
                    <strong>{item.label}</strong>
                    <small>Navigation</small>
                  </div>
                  <span>Page</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadDashboard } from '../../api/dashboard.js';

export default function HomePage() {
  const [stats, setStats] = useState({ projects: 0, teams: 0, tasks: 0 });

  useEffect(() => {
    (async () => {
      const { projects, teams, tasks } = await loadDashboard();
      setStats({
        projects: projects.data?.length || 0,
        teams: teams.data?.length || 0,
        tasks: tasks.data?.length || 0
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Project control center</h1>
          <p>View workload, team activity, and delivery trends in one place.</p>
        </div>
        <div className="button-row">
          <Link className="primary-button" to="/projects/new">New Project</Link>
          <Link className="secondary-button" to="/projects">Open Projects</Link>
        </div>
      </section>

      <section className="grid four">
        <article className="section-card"><span className="pill">Projects</span><h3>{stats.projects}</h3><p>Active project records</p></article>
        <article className="section-card"><span className="pill">Teams</span><h3>{stats.teams}</h3><p>Team records in database</p></article>
        <article className="section-card"><span className="pill">Tasks</span><h3>{stats.tasks}</h3><p>Task items being tracked</p></article>
        <article className="section-card"><span className="pill">Velocity</span><h3>78%</h3><p>Delivery pace this sprint</p></article>
      </section>

      <section className="grid two">
        <article className="section-card">
          <h2>Workload chart</h2>
          <div className="dashboard-bars">
            <div><span style={{ width: '78%' }} /><small>Design</small></div>
            <div><span style={{ width: '54%' }} /><small>Development</small></div>
            <div><span style={{ width: '31%' }} /><small>QA</small></div>
            <div><span style={{ width: '68%' }} /><small>Deployment</small></div>
          </div>
        </article>
        <article className="section-card">
          <h2>Activity stream</h2>
          <div className="timeline-list">
            <div className="timeline-item"><span>1</span><div><strong>Project kickoff</strong><p>New project request arrives and gets assigned.</p></div></div>
            <div className="timeline-item"><span>2</span><div><strong>Task creation</strong><p>Tasks and subtasks are broken down by team.</p></div></div>
            <div className="timeline-item"><span>3</span><div><strong>Status update</strong><p>Work moves from To Do to Done through the board.</p></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}

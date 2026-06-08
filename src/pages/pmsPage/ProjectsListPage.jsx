import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects.js';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await projectsApi.list();
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Projects</p>
          <h1>All projects</h1>
          <p>Open a project to see tasks, subtasks, teams, dates, and CRUD actions.</p>
        </div>
        <Link className="primary-button" to="/projects/new">Create Project</Link>
      </section>
      {loading ? <p className="muted">Loading...</p> : null}
      <div className="grid three">
        {projects.map((project) => (
          <article key={project.id} className="section-card">
            <Link to={`/projects/${project.id}`}>
              <span className="pill">{project.key}</span>
              <h3>{project.name}</h3>
              <p>{project.status || 'Planning'} • {project.owner || 'No owner'}</p>
              <div className="project-meta-row">
                <span>Start: {project.start_date || '-'}</span>
                <span>Deadline: {project.deadline || '-'}</span>
              </div>
            </Link>
            <button
              type="button"
              className="secondary-button"
              onClick={async () => {
                await projectsApi.remove(project.id);
                const { data } = await projectsApi.list();
                setProjects(data || []);
              }}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

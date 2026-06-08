import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
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
        <Button asChild>
          <Link to="/projects/new">Create Project</Link>
        </Button>
      </section>

      {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardDescription>{project.key}</CardDescription>
              <CardTitle className="text-xl">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {project.status || 'Planning'} - {project.owner || 'No owner'}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Start: {project.start_date || '-'}</span>
                <span>Deadline: {project.deadline || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link to={`/projects/${project.id}`}>Open</Link>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    await projectsApi.remove(project.id);
                    const { data } = await projectsApi.list();
                    setProjects(data || []);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

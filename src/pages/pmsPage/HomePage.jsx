import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { loadDashboard } from '../../api/dashboard.js';

export default function HomePage() {
  const [stats, setStats] = useState({ projects: 0, employees: 0, tasks: 0 });

  useEffect(() => {
    (async () => {
      const { projects, employees, tasks } = await loadDashboard();
      setStats({
        projects: projects.data?.length || 0,
        employees: employees.data?.length || 0,
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
          <Button asChild>
            <Link to="/projects/new">New Project</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/projects">Open Projects</Link>
          </Button>
        </div>
      </section>

      <section className="grid four">
        <Card><CardHeader><CardDescription>Projects</CardDescription><CardTitle>{stats.projects}</CardTitle></CardHeader><CardContent>Active project records</CardContent></Card>
        <Card><CardHeader><CardDescription>Employees</CardDescription><CardTitle>{stats.employees}</CardTitle></CardHeader><CardContent>Employee records in database</CardContent></Card>
        <Card><CardHeader><CardDescription>Tasks</CardDescription><CardTitle>{stats.tasks}</CardTitle></CardHeader><CardContent>Task items being tracked</CardContent></Card>
        <Card><CardHeader><CardDescription>Velocity</CardDescription><CardTitle>78%</CardTitle></CardHeader><CardContent>Delivery pace this sprint</CardContent></Card>
      </section>

      <section className="grid two">
        <Card>
          <CardHeader>
            <CardTitle>Workload chart</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="dashboard-bars">
            <div><span style={{ width: '78%' }} /><small>Design</small></div>
            <div><span style={{ width: '54%' }} /><small>Development</small></div>
            <div><span style={{ width: '31%' }} /><small>QA</small></div>
            <div><span style={{ width: '68%' }} /><small>Deployment</small></div>
          </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity stream</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="timeline-list">
            <div className="timeline-item"><span>1</span><div><strong>Project kickoff</strong><p>New project request arrives and gets assigned.</p></div></div>
            <div className="timeline-item"><span>2</span><div><strong>Task creation</strong><p>Tasks and subtasks are broken down by team.</p></div></div>
            <div className="timeline-item"><span>3</span><div><strong>Status update</strong><p>Work moves from To Do to Done through the board.</p></div></div>
          </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

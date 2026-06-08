import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { projectsApi } from '../../api/projects.js';
import { tasksApi } from '../../api/tasks.js';
import { subtasksApi } from '../../api/subtasks.js';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, t, s] = await Promise.all([projectsApi.get(id), tasksApi.list(), subtasksApi.list()]);
      setProject(p.data);
      setTasks((t.data || []).filter((task) => String(task.project_id) === String(id)).map((task) => ({
        ...task,
        subtasks: (s.data || []).filter((subtask) => String(subtask.task_id) === String(task.id))
      })));
    })();
  }, [id]);

  if (!project) return <p className="text-sm text-slate-500">Loading project...</p>;

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Project Detail</p>
          <h1>{project.name}</h1>
          <p>{project.description || 'No project description yet.'}</p>
        </div>
        <div className="button-row">
          <Button asChild variant="outline">
            <Link to="/projects">Back</Link>
          </Button>
          <Button asChild>
            <Link to="/projects/new">Edit / New</Link>
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={async () => {
              await projectsApi.remove(id);
              navigate('/projects');
            }}
          >
            Delete
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardDescription>Start</CardDescription><CardTitle>{project.start_date || '-'}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Deadline</CardDescription><CardTitle>{project.deadline || '-'}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Owner</CardDescription><CardTitle>{project.owner || '-'}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Status</CardDescription><CardTitle>{project.status || 'Planning'}</CardTitle></CardHeader></Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Click a task to open its subtasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <Button key={task.id} asChild variant="outline" className="w-full justify-start">
                <Link to={`/projects/${id}/tasks/${task.id}`}>
                  {task.title} - {task.status} - {task.priority}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>Assigned users and roles belong in the team/member tables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Assigned team: {project.team_name || 'Not assigned yet'}</p>
            <p>Working users: {project.members || 0}</p>
            <p>Start date: {project.start_date || '-'}</p>
            <p>Deadline: {project.deadline || '-'}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

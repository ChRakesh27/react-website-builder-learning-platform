import { useEffect, useMemo, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('description');

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

  const tabs = useMemo(
    () => [
      { id: 'description', label: 'Description' },
      { id: 'team', label: 'Team' },
      { id: 'task', label: 'Task' },
      { id: 'database', label: 'Database' },
      { id: 'integration', label: 'Integration' }
    ],
    []
  );

  if (!project) return <p className="text-sm text-slate-500">Loading project...</p>;

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Project Detail</p>
          <h1 className="text-2xl md:text-3xl">{project.name}</h1>
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

      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-full"
          >
            {tab.label}
          </Button>
        ))}
      </section>

      {activeTab === 'description' ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card><CardHeader><CardDescription>Start</CardDescription><CardTitle>{project.start_date || '-'}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Deadline</CardDescription><CardTitle>{project.deadline || '-'}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Owner</CardDescription><CardTitle>{project.owner || '-'}</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Status</CardDescription><CardTitle>{project.status || 'Planning'}</CardTitle></CardHeader></Card>
        </section>
      ) : null}

      {activeTab === 'team' ? (
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>Assigned users and roles belong in the team/member tables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Assigned team: {project.team_name || 'Not assigned yet'}</p>
            <p>Working users: {project.members || 0}</p>
            <p>Lead: {project.owner || '-'}</p>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'task' ? (
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Click a task to open its subtasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length ? tasks.map((task) => (
              <Button key={task.id} asChild variant="outline" className="w-full justify-start">
                <Link to={`/projects/${id}/tasks/${task.id}`}>
                  {task.title} - {task.status} - {task.priority}
                </Link>
              </Button>
            )) : <p className="text-sm text-slate-500">No tasks found for this project.</p>}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'database' ? (
        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription>Optional database information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Database name: {project.database_name || 'Not added yet'}</p>
            <p>Database plan: {project.database_plan || 'Not added yet'}</p>
            <p>Account name: {project.account_name || 'Not added yet'}</p>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'integration' ? (
        <Card>
          <CardHeader>
            <CardTitle>Integration</CardTitle>
            <CardDescription>Optional integration details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Integration details are not stored in the current project record.</p>
            <p>Add integrations in the create form if you want them saved in a future schema update.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

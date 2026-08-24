import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Users, CalendarDays, Flag, Circle, CheckCircle2, Ellipsis, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { projectsApi } from '../../api/projects.js';
import { teamsApi } from '../../api/teams.js';
import { tasksApi } from '../../api/tasks.js';
import { subtasksApi } from '../../api/subtasks.js';

const emptyProject = { name: '', key: '', status: 'Planning', progress: 0, owner: '', members: 1, due: '' };
const emptyTeam = { name: '', lead: '', members: 1 };
const emptyTask = { title: '', type: 'Task', priority: 'Medium', status: 'To Do', assignee: '', project_id: '' };
const emptySubtask = { title: '', task_id: '' };

function StatCard({ label, value, description }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [subtaskForm, setSubtaskForm] = useState(emptySubtask);

  async function loadData() {
    setLoading(true);
    const [p, t, ta] = await Promise.all([projectsApi.list(), teamsApi.list(), tasksApi.list()]);
    if (p.error || t.error || ta.error) {
      setError(p.error?.message || t.error?.message || ta.error?.message || 'Failed to load data.');
    } else {
      setProjects(p.data || []);
      setTeams(t.data || []);
      setTasks(ta.data || []);
      setError('');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) => [project.name, project.key, project.owner, project.status].join(' ').toLowerCase().includes(q));
  }, [projects, query]);

  const submitProject = async (event) => {
    event.preventDefault();
    const { error: insertError } = await projectsApi.create({
      ...projectForm,
      progress: Number(projectForm.progress || 0),
      members: Number(projectForm.members || 0)
    });
    if (insertError) return setError(insertError.message);
    setProjectForm(emptyProject);
    await loadData();
  };

  const submitTeam = async (event) => {
    event.preventDefault();
    const { error: insertError } = await teamsApi.create({ ...teamForm, members: Number(teamForm.members || 0) });
    if (insertError) return setError(insertError.message);
    setTeamForm(emptyTeam);
    await loadData();
  };

  const submitTask = async (event) => {
    event.preventDefault();
    const { error: insertError } = await tasksApi.create(taskForm);
    if (insertError) return setError(insertError.message);
    setTaskForm(emptyTask);
    await loadData();
  };

  const submitSubtask = async (event) => {
    event.preventDefault();
    const { error: insertError } = await subtasksApi.create(subtaskForm);
    if (insertError) return setError(insertError.message);
    setSubtaskForm(emptySubtask);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Project Management</p>
          <h1>Projects</h1>
          <p>Manage projects, teams, tasks, and subtasks.</p>
        </div>
        <Button asChild>
          <Link to="/projects/new">Create Project</Link>
        </Button>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading data...</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={projects.length} description="Project records" />
        <StatCard label="Teams" value={teams.length} description="Team records" />
        <StatCard label="Tasks" value={tasks.length} description="Task records" />
        <StatCard label="Subtasks" value={tasks.reduce((sum, task) => sum + (task.subtasks?.length || 0), 0)} description="Subtask records" />
      </section>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <Input className="border-0 p-0 shadow-none" placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="px-3"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={16} className="mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="px-3"
                  onClick={() => setViewMode('table')}
                >
                  <List size={16} className="mr-2" />
                  Table
                </Button>
              </div>
              <Button variant="outline" type="button">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'grid' ? (
        <section className="grid gap-4 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardDescription>{project.key}</CardDescription>
                <CardTitle className="text-xl">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{project.status || 'Planning'} • {project.owner || 'Unassigned'}</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Users size={14} /> Members</span><span>{project.members ?? 0}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Due</span><span>{project.due || '-'}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Flag size={14} /> Progress</span><span>{project.progress ?? 0}%</span></div>
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
                      await loadData();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.key}</TableCell>
                  <TableCell>{project.status || 'Planning'}</TableCell>
                  <TableCell>{project.members ?? 0}</TableCell>
                  <TableCell>{project.due || '-'}</TableCell>
                  <TableCell>{project.progress ?? 0}%</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/projects/${project.id}`}>Open</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        await projectsApi.remove(project.id);
                        await loadData();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create task</CardTitle>
            <CardDescription>Add a new task to a project.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submitTask}>
              <Input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Assignee" value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })} />
                <Input placeholder="Project ID" value={taskForm.project_id} onChange={(e) => setTaskForm({ ...taskForm, project_id: e.target.value })} />
                <Select value={taskForm.type} onValueChange={(value) => setTaskForm({ ...taskForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Story">Story</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Bug">Bug</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select className="md:col-span-2" value={taskForm.status} onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create Task</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create subtask</CardTitle>
            <CardDescription>Add a subtask under a task.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submitSubtask}>
              <Input placeholder="Subtask title" value={subtaskForm.title} onChange={(e) => setSubtaskForm({ ...subtaskForm, title: e.target.value })} />
              <Input placeholder="Task ID" value={subtaskForm.task_id} onChange={(e) => setSubtaskForm({ ...subtaskForm, task_id: e.target.value })} />
              <Button type="submit">Create Subtask</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>New project</CardTitle>
            <CardDescription>Create project records in Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submitProject}>
              <Input placeholder="Project name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
              <Input placeholder="Key" value={projectForm.key} onChange={(e) => setProjectForm({ ...projectForm, key: e.target.value.toUpperCase() })} />
              <Input placeholder="Owner" value={projectForm.owner} onChange={(e) => setProjectForm({ ...projectForm, owner: e.target.value })} />
              <Input placeholder="Due date" value={projectForm.due} onChange={(e) => setProjectForm({ ...projectForm, due: e.target.value })} />
              <Input placeholder="Members" type="number" value={projectForm.members} onChange={(e) => setProjectForm({ ...projectForm, members: e.target.value })} />
              <Button type="submit">Create Project</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New team</CardTitle>
            <CardDescription>Create a team and capture skills or role notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submitTeam}>
              <Input placeholder="Team name" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
              <Input placeholder="Team lead" value={teamForm.lead} onChange={(e) => setTeamForm({ ...teamForm, lead: e.target.value })} />
              <Input placeholder="Members" type="number" value={teamForm.members} onChange={(e) => setTeamForm({ ...teamForm, members: e.target.value })} />
              <Textarea placeholder="Skills / roles" value={teamForm.skills} onChange={(e) => setTeamForm({ ...teamForm, skills: e.target.value })} />
              <Button type="submit">Create Team</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

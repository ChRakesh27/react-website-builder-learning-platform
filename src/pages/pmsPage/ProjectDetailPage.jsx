import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Users, ListTodo, FileText, Database, Plug, Trash2, Save, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../components/ui/sheet.jsx';
import { projectsApi } from '../../api/projects.js';
import { tasksApi } from '../../api/tasks.js';
import { subtasksApi } from '../../api/subtasks.js';
import { projectMembersApi } from '../../api/projectMembers.js';

const emptyTask = { title: '', type: 'Task', priority: 'Medium', status: 'To Do', assignee: '', project_id: '' };
const emptySubtask = { title: '', task_id: '' };
const emptyMember = { name: '', role: '', email: '' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [subtaskForm, setSubtaskForm] = useState(emptySubtask);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [openSubtaskFor, setOpenSubtaskFor] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState('task');

  const memberOptions = useMemo(
    () => members.map((member) => ({
      id: String(member.id),
      label: member.name || `Member ${member.id}`
    })),
    [members]
  );

  const tabs = useMemo(
    () => [
      { id: 'description', label: 'Description', icon: FileText },
      { id: 'team', label: 'Team', icon: Users },
      { id: 'task', label: 'Task', icon: ListTodo },
      { id: 'database', label: 'Database', icon: Database },
      { id: 'integration', label: 'Integration', icon: Plug }
    ],
    []
  );

  async function loadData() {
    const [p, t, s, m] = await Promise.all([projectsApi.get(id), tasksApi.list(), subtasksApi.list(), projectMembersApi.list(id)]);
    setProject(p.data);
    setDescription(p.data?.description || '');
    setTasks(
      (t.data || [])
        .filter((task) => String(task.project_id) === String(id))
        .map((task) => ({
          ...task,
          subtasks: (s.data || []).filter((subtask) => String(subtask.task_id) === String(task.id))
        }))
    );
    setMembers(m.data || []);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (!project) return <p className="text-sm text-slate-500">Loading project...</p>;

  const saveDescription = async () => {
    const { error: updateError } = await projectsApi.update(id, { description });
    if (updateError) return setError(updateError.message);
    setError('');
    await loadData();
  };

  const submitMember = async (event) => {
    event.preventDefault();
    const { error: insertError } = await projectMembersApi.create({
      project_id: id,
      name: memberForm.name,
      role: memberForm.role || null,
      email: memberForm.email || null
    });
    if (insertError) return setError(insertError.message);
    setMemberForm(emptyMember);
    await loadData();
  };

  const submitTask = async (event) => {
    event.preventDefault();
    const { error: insertError } = await tasksApi.create({ ...taskForm, project_id: id });
    if (insertError) return setError(insertError.message);
    setTaskForm(emptyTask);
    setSheetOpen(false);
    await loadData();
  };

  const submitSubtask = async (event) => {
    event.preventDefault();
    const { error: insertError } = await subtasksApi.create({
      ...subtaskForm,
      task_id: subtaskForm.task_id || openSubtaskFor
    });
    if (insertError) return setError(insertError.message);
    setSubtaskForm(emptySubtask);
    setOpenSubtaskFor('');
    setSheetOpen(false);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Project Detail</p>
          <h1 className="text-xl md:text-2xl">{project.name}</h1>
          <p>{project.description || 'No project description yet.'}</p>
        </div>
        <div className="button-row">
          <Button asChild variant="outline">
            <Link to="/projects">Back</Link>
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
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full"
            >
              <Icon className="mr-2 size-4" />
              {tab.label}
            </Button>
          );
        })}
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {activeTab === 'description' ? (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Edit the project description here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write project description..."
              className="min-h-40"
            />
            <Button onClick={saveDescription}>
              <Save className="mr-2 size-4" />
              Save Description
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === 'team' ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Members assigned to this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.length ? (
                members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <div>
                      <p className="font-medium text-black">{member.name}</p>
                      <p className="text-sm text-black">
                        {member.role || 'Member'}
                        {member.email ? ` • ${member.email}` : ''}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={async () => {
                        await projectMembersApi.remove(member.id);
                        await loadData();
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No team members added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Member</CardTitle>
              <CardDescription>Add team members to this project from the sidebar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                onClick={() => {
                  setSheetMode('member');
                  setMemberForm(emptyMember);
                  setSheetOpen(true);
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                Open Team Sidebar
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === 'task' ? (
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Use the sidebar to create tasks and subtasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => {
                  setSheetMode('task');
                  setTaskForm({ ...emptyTask, project_id: id });
                  setSheetOpen(true);
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                Create Task
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSheetMode('subtask');
                  setSubtaskForm(emptySubtask);
                  setSheetOpen(true);
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                Create Subtask
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSheetMode('member');
                  setMemberForm(emptyMember);
                  setSheetOpen(true);
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                Add Team Member
              </Button>
            </div>

            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Button asChild variant="outline" className="justify-start">
                      <Link to={`/projects/${id}/tasks/${task.id}`}>
                        {task.title} - {task.status} - {task.priority}
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSheetMode('subtask');
                        setOpenSubtaskFor(task.id);
                        setSubtaskForm({ title: '', task_id: task.id });
                        setSheetOpen(true);
                      }}
                    >
                      <Plus className="mr-2 size-4" />
                      Add Subtask
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(task.subtasks || []).map((subtask) => (
                      <div key={subtask.id} className="rounded-lg border border-border px-3 py-2 text-sm text-black">
                        {subtask.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No tasks found for this project.</p>
            )}
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="border-b border-border px-4 pb-4 pt-6">
            <SheetTitle>{sheetMode === 'task' ? 'Create Task' : 'Create Subtask'}</SheetTitle>
            <SheetDescription>
              {sheetMode === 'task'
                ? 'Create a new task for this project from the sidebar.'
                : 'Create a subtask for the selected task from the sidebar.'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sheetMode === 'task' ? (
              <form className="grid gap-3" onSubmit={submitTask}>
                <Input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm({ ...taskForm, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.length ? memberOptions.map((member) => (
                      <SelectItem key={member.id} value={member.label}>{member.label}</SelectItem>
                    )) : <SelectItem value="unassigned">No team members yet</SelectItem>}
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Create Task
                </Button>
              </form>
            ) : sheetMode === 'subtask' ? (
              <form className="grid gap-3" onSubmit={submitSubtask}>
                <Input placeholder="Subtask title" value={subtaskForm.title} onChange={(e) => setSubtaskForm({ ...subtaskForm, title: e.target.value })} />
                <Input placeholder="Task ID" value={subtaskForm.task_id} onChange={(e) => setSubtaskForm({ ...subtaskForm, task_id: e.target.value })} />
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Create Subtask
                </Button>
              </form>
            ) : (
              <form className="grid gap-3" onSubmit={submitMember}>
                <Select value={memberForm.name} onValueChange={(value) => setMemberForm({ ...memberForm, name: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.length ? memberOptions.map((member) => (
                      <SelectItem key={member.id} value={member.label}>{member.label}</SelectItem>
                    )) : <SelectItem value="new-member">No members yet</SelectItem>}
                  </SelectContent>
                </Select>
                <Input placeholder="Role" value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} />
                <Input placeholder="Email" type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Add Team Member
                </Button>
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

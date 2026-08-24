import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Users, ListTodo, FileText, Database, Plug, Trash2, Save, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../components/ui/sheet.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { projectsApi } from '../../api/projects.js';
import { tasksApi } from '../../api/tasks.js';
import { subtasksApi } from '../../api/subtasks.js';
import { projectMembersApi } from '../../api/projectMembers.js';
import { employeesApi } from '../../api/employees.js';

const emptyTask = { title: '', type: 'Task', priority: 'Medium', status: 'To Do', assignee: '', project_id: '' };
const emptySubtask = { title: '', task_id: '' };
const emptyMember = { employee_id: '' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [globalEmployees, setGlobalEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [subtaskForm, setSubtaskForm] = useState(emptySubtask);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [openSubtaskFor, setOpenSubtaskFor] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState('task');
  const [tasksViewMode, setTasksViewMode] = useState('table');

  const [editForm, setEditForm] = useState({ name: '', start_date: '', deadline: '', status: 'Planning' });

  const globalEmployeeOptions = useMemo(
    () => globalEmployees.map((emp) => ({
      id: String(emp.id),
      label: emp.name || `Employee ${emp.id}`
    })),
    [globalEmployees]
  );

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
      { id: 'team', label: 'Employees', icon: Users },
      { id: 'task', label: 'Task', icon: ListTodo },
      { id: 'database', label: 'Database', icon: Database },
      { id: 'integration', label: 'Integration', icon: Plug }
    ],
    []
  );

  async function loadData() {
    const [p, t, s, m, emps] = await Promise.all([
      projectsApi.get(id),
      tasksApi.list(),
      subtasksApi.list(),
      projectMembersApi.list(id),
      employeesApi.list()
    ]);
    setProject(p.data);
    setDescription(p.data?.description || '');
    if (p.data) {
      setEditForm({
        name: p.data.name || '',
        start_date: p.data.start_date || '',
        deadline: p.data.deadline || '',
        status: p.data.status || 'Planning'
      });
    }
    setTasks(
      (t.data || [])
        .filter((task) => String(task.project_id) === String(id))
        .map((task) => ({
          ...task,
          subtasks: (s.data || []).filter((subtask) => String(subtask.task_id) === String(task.id))
        }))
    );
    setMembers(m.data || []);
    setGlobalEmployees(emps.data || []);
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
    if (!memberForm.employee_id) return setError('Please select an employee.');
    const selectedEmp = globalEmployees.find(e => String(e.id) === memberForm.employee_id);
    if (!selectedEmp) return setError('Selected employee not found.');

    const { error: insertError } = await projectMembersApi.create({
      project_id: id,
      employee_id: selectedEmp.id,
      name: selectedEmp.name,
      role: selectedEmp.role || null,
      email: selectedEmp.email || null
    });
    if (insertError) return setError(insertError.message);
    setMemberForm(emptyMember);
    await loadData();
    setSheetOpen(false);
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
          <p className="eyebrow">Project Detail - {project.status}</p>
          <h1 className="text-xl md:text-2xl">{project.name}</h1>
          <p>{project.description || 'No project description yet.'}</p>
          <div className="mt-2 flex gap-4 text-sm text-slate-500">
            {project.start_date && <span>Start: {project.start_date}</span>}
            {project.deadline && <span>Deadline: {project.deadline}</span>}
          </div>
        </div>
        <div className="button-row">
          <Link to="/projects">
            <Button variant="outline">Back</Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSheetMode('edit');
              setSheetOpen(true);
            }}
          >
            Edit
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
            Assign Employee
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
              <CardTitle>Assigned Employees</CardTitle>
              <CardDescription>Employees assigned to this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.length ? (
                members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <div>
                      <p className="font-medium text-black">{member.name}</p>
                      <p className="text-sm text-black">
                        {member.role || 'Employee'}
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
                <p className="text-sm text-slate-500">No employees added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Employee</CardTitle>
              <CardDescription>Assign an employee to this project from the sidebar.</CardDescription>
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
                Assign Employee
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === 'task' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Use the sidebar to create tasks and subtasks.</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                <Button
                  variant={tasksViewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="px-3"
                  onClick={() => setTasksViewMode('grid')}
                >
                  <LayoutGrid size={16} className="mr-2" />
                  Grid
                </Button>
                <Button
                  variant={tasksViewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="px-3"
                  onClick={() => setTasksViewMode('table')}
                >
                  <List size={16} className="mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
                Assign Employee
              </Button>
            </div>

            {tasks.length ? (
              tasksViewMode === 'grid' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="space-y-3 rounded-xl border border-border p-4 bg-white shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <Link to={`/projects/${id}/tasks/${task.id}`}>
                          <Button variant="outline" className="justify-start">
                            {task.title} - {task.status} - {task.priority}
                          </Button>
                        </Link>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
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
                          <div key={subtask.id} className="rounded-lg border border-border px-3 py-2 text-sm text-black bg-slate-50">
                            {subtask.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Subtasks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <Link to={`/projects/${id}/tasks/${task.id}`} className="hover:underline">
                              {task.title}
                            </Link>
                          </TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell>{task.assignee || 'Unassigned'}</TableCell>
                          <TableCell>{task.subtasks?.length || 0}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
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
            <SheetTitle>
              {sheetMode === 'task' ? 'Create Task' : sheetMode === 'subtask' ? 'Create Subtask' : 'Assign Employee'}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === 'task'
                ? 'Create a new task for this project from the sidebar.'
                : sheetMode === 'subtask'
                ? 'Create a subtask for the selected task from the sidebar.'
                : 'Select an employee from the workspace to assign to this project.'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sheetMode === 'task' ? (
              <form className="grid gap-3" onSubmit={submitTask}>
                <Input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm({ ...taskForm, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.length ? memberOptions.map((member) => (
                      <SelectItem key={member.id} value={member.label}>{member.label}</SelectItem>
                    )) : <SelectItem value="unassigned">No employees assigned to project</SelectItem>}
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
            ) : sheetMode === 'member' ? (
              <form className="grid gap-3" onSubmit={submitMember}>
                <Select value={memberForm.employee_id} onValueChange={(value) => setMemberForm({ ...memberForm, employee_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalEmployeeOptions.length ? globalEmployeeOptions.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.label}</SelectItem>
                    )) : <SelectItem value="no-employees">No employees in workspace</SelectItem>}
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Assign Employee
                </Button>
              </form>
            ) : sheetMode === 'edit' ? (
              <form className="grid gap-3" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  console.log("=== STARTING PROJECT UPDATE ===");
                  const payload = { ...editForm };
                  if (!payload.start_date) payload.start_date = null;
                  if (!payload.deadline) payload.deadline = null;
                  
                  console.log("Payload being sent:", payload);
                  console.log("Project ID:", id);
                  
                  const response = await projectsApi.update(id, payload);
                  
                  console.log("Update response:", response);
                  
                  if (response.error) {
                    console.error("Supabase API Error:", response.error);
                    return setError(response.error.message || JSON.stringify(response.error));
                  }
                  
                  setSheetOpen(false);
                  await loadData();
                  console.log("=== UPDATE SUCCESSFUL ===");
                } catch (err) {
                  console.error("Caught Exception during update:", err);
                  setError(err.message || "An unexpected error occurred during update.");
                }
              }}>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" value={editForm.start_date || ''} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Input type="date" value={editForm.deadline || ''} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

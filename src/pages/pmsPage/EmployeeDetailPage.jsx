import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, Briefcase, ListTodo, Calendar, ArrowLeft, LayoutGrid, List, Search } from 'lucide-react';
import { useToast } from '../../components/Toast.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { employeesApi } from '../../api/employees.js';
import { projectMembersApi } from '../../api/projectMembers.js';
import { tasksApi } from '../../api/tasks.js';
import { projectsApi } from '../../api/projects.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

function Avatar({ name, src, size = 'size-10' }) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase();
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-pink-600', 'bg-indigo-600'];
  const colorClass = colors[name.length % colors.length];
  return src ? (
    <img src={src} alt={name || 'Employee avatar'} className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`flex ${size} items-center justify-center rounded-full ${colorClass} text-sm font-semibold text-white`}>
      {initial}
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [viewModeProjects, setViewModeProjects] = useState('grid');
  const [viewModeTasks, setViewModeTasks] = useState('grid');
  const [taskQuery, setTaskQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const tabs = useMemo(
    () => [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'projects', label: 'Projects', icon: Briefcase },
      { id: 'tasks', label: 'Tasks', icon: ListTodo }
    ],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const [empRes, membersRes, tasksRes, projectsRes] = await Promise.all([
          employeesApi.get(id),
          projectMembersApi.listByEmployee(id),
          tasksApi.list(),
          projectsApi.list()
        ]);
        setEmployee(empRes.data);
        const assignedProjects = (membersRes.data || []).map(m => m.projects).filter(Boolean);
        setProjects(assignedProjects);
        const allProjects = projectsRes.data || [];
        const empName = empRes.data?.name;
        const empTasks = (tasksRes.data || []).filter(t => t.assignee === empName);
        const tasksWithProject = empTasks.map(t => {
          const p = allProjects.find(p => String(p.id) === String(t.project_id));
          return { ...t, projectName: p ? p.name : 'Unknown Project' };
        }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setTasks(tasksWithProject);
      } catch (err) {
        console.error(err);
        toast('Failed to load employee details', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-slate-100 rounded-3xl skeleton" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 h-12 bg-slate-100 rounded-xl skeleton" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-white p-6 space-y-3">
              <div className="skeleton skeleton-line" style={{ width: `${30 + Math.random() * 40}%` }} />
              <div className="skeleton skeleton-line" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!employee) return <div className="text-sm text-red-500">Employee not found.</div>;

  const filteredTasks = useMemo(() => {
    const q = taskQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(t =>
      [t.title, t.projectName, t.type, t.priority, t.status].join(' ').toLowerCase().includes(q)
    );
  }, [tasks, taskQuery]);

  const handleDelete = async () => {
    try {
      await employeesApi.remove(id);
      toast('Employee deleted', 'success');
      navigate('/employees');
    } catch (err) {
      toast('Failed to delete employee', 'error');
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <section className="page-hero animate-fade-in-up">
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar name={employee.name} src={employee.avatar_url} size="size-16 text-xl" />
          <div>
            <p className="eyebrow">Employee Detail</p>
            <h1 className="text-xl md:text-2xl">{employee.name}</h1>
            <p>{employee.role || 'No specific role assigned.'}</p>
          </div>
        </div>
        <div className="flex gap-2 button-row">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 size-4" /> Back to Directory
          </Button>
          <Button onClick={() => navigate(`/employees/${id}/edit`)}>Edit Employee</Button>
        </div>
      </section>

      <section className="flex flex-wrap gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm animate-fade-in-down">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id} type="button" variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)} className="rounded-full"
            >
              <Icon className="mr-2 size-4" /> {tab.label}
            </Button>
          );
        })}
      </section>

      {activeTab === 'profile' && (
        <Card className="animate-scale-in">
          <CardHeader><CardTitle>Profile Details</CardTitle><CardDescription>Contact and organizational information.</CardDescription></CardHeader>
          <CardContent className="space-y-4 text-sm">
            {[
              ['Full Name', employee.name],
              ['Role', employee.role || '-'],
              ['Email', employee.email || '-'],
              ['Phone', employee.phone || '-'],
              ['Added On', employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[150px_1fr] gap-4 py-2 border-b">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className="text-black">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'projects' && (
        <Card className="animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Assigned Projects</CardTitle>
                <CardDescription>Projects this employee is actively contributing to.</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                <Button variant={viewModeProjects === 'grid' ? 'default' : 'ghost'} size="sm" className="px-3" onClick={() => setViewModeProjects('grid')}>
                  <LayoutGrid size={16} className="mr-2" /> Grid
                </Button>
                <Button variant={viewModeProjects === 'table' ? 'default' : 'ghost'} size="sm" className="px-3" onClick={() => setViewModeProjects('table')}>
                  <List size={16} className="mr-2" /> Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? viewModeProjects === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <Link to={`/projects/${project.id}`} key={project.id} className="block group">
                    <div className="rounded-xl border border-border p-5 bg-white transition-all group-hover:border-black group-hover:shadow-md h-full">
                      <div className="font-semibold text-lg text-black mb-2">{project.name}</div>
                      <div className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description || 'No description available.'}</div>
                      <div className="flex flex-wrap gap-4 text-xs font-medium">
                        <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><Briefcase className="size-3 mr-1" />{project.status || 'Planning'}</div>
                        {project.deadline && <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-md"><Calendar className="size-3 mr-1" />Due: {project.deadline}</div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <Table><TableHeader><TableRow><TableHead>Project Name</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead>Deadline</TableHead></TableRow></TableHeader>
                <TableBody>{projects.map((project) => (
                  <TableRow key={project.id}><TableCell className="font-medium"><Link to={`/projects/${project.id}`} className="hover:underline">{project.name}</Link></TableCell><TableCell className="max-w-[300px] truncate">{project.description || '-'}</TableCell><TableCell>{project.status || 'Planning'}</TableCell><TableCell>{project.deadline || '-'}</TableCell></TableRow>
                ))}</TableBody></Table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Not assigned to any projects yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card className="animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>All tasks assigned to this employee.</CardDescription>
              </div>
              <Input placeholder="Filter tasks..." value={taskQuery} onChange={(e) => setTaskQuery(e.target.value)} className="w-full md:w-64" />
            </div>
          </CardHeader>
          <CardContent>
            {filteredTasks.length > 0 ? viewModeTasks === 'grid' ? (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-border p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                    <div className="space-y-1">
                      <div className="font-semibold text-black">{task.title}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Project: <Link to={`/projects/${task.project_id}`} className="hover:underline font-medium text-black">{task.projectName}</Link></span>
                        <span>•</span>
                        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700">{task.type || 'Task'}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${task.priority === 'High' ? 'bg-red-50 text-red-700' : task.priority === 'Medium' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>{task.priority || 'Medium'}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium border">{task.status || 'To Do'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <Table><TableHeader><TableRow><TableHead>Task Title</TableHead><TableHead>Project</TableHead><TableHead>Type</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
                <TableBody>{filteredTasks.map((task) => (
                  <TableRow key={task.id}><TableCell className="font-medium">{task.title}</TableCell><TableCell><Link to={`/projects/${task.project_id}`} className="hover:underline">{task.projectName}</Link></TableCell><TableCell>{task.type || 'Task'}</TableCell><TableCell>{task.priority || 'Medium'}</TableCell><TableCell>{task.status || 'To Do'}</TableCell><TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell></TableRow>
                ))}</TableBody></Table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tasks currently assigned.</p>
            )}
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
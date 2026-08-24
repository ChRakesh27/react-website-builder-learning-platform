import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, Briefcase, ListTodo, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { employeesApi } from '../../api/employees.js';
import { projectMembersApi } from '../../api/projectMembers.js';
import { tasksApi } from '../../api/tasks.js';
import { projectsApi } from '../../api/projects.js';

function Avatar({ name, src, size = 'size-10' }) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase();
  return src ? (
    <img src={src} alt={name || 'Employee avatar'} className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`flex ${size} items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white`}>
      {initial}
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="text-sm text-slate-500">Loading employee details...</div>;
  if (!employee) return <div className="text-sm text-red-500">Employee not found.</div>;

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div className="flex items-center gap-4">
          <Avatar name={employee.name} src={employee.avatar_url} size="size-16 text-xl" />
          <div>
            <p className="eyebrow">Employee Detail</p>
            <h1 className="text-xl md:text-2xl">{employee.name}</h1>
            <p>{employee.role || 'No specific role assigned.'}</p>
          </div>
        </div>
        <div className="button-row">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Directory
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

      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Contact and organizational information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-[150px_1fr] gap-4 py-2 border-b">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="text-black">{employee.name}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 py-2 border-b">
              <span className="text-slate-500 font-medium">Role</span>
              <span className="text-black">{employee.role || '-'}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 py-2 border-b">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="text-black">{employee.email || '-'}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 py-2 border-b">
              <span className="text-slate-500 font-medium">Phone Number</span>
              <span className="text-black">{employee.phone || '-'}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4 py-2">
              <span className="text-slate-500 font-medium">Added On</span>
              <span className="text-black">
                {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'projects' && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Projects</CardTitle>
            <CardDescription>Projects this employee is actively contributing to.</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <Link to={`/projects/${project.id}`} key={project.id} className="block group">
                    <div className="rounded-xl border border-border p-5 bg-white transition-all group-hover:border-black group-hover:shadow-md h-full">
                      <div className="font-semibold text-lg text-black mb-2">{project.name}</div>
                      <div className="text-sm text-slate-500 mb-4 line-clamp-2">
                        {project.description || 'No description available.'}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs font-medium">
                        <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          <Briefcase className="size-3 mr-1" />
                          {project.status || 'Planning'}
                        </div>
                        {project.deadline && (
                          <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                            <Calendar className="size-3 mr-1" />
                            Due: {project.deadline}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Not assigned to any projects yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks (Date Wise)</CardTitle>
            <CardDescription>All tasks currently assigned to this employee, sorted by most recent.</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-border p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-black">{task.title}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Project: <Link to={`/projects/${task.project_id}`} className="hover:underline font-medium text-black">{task.projectName}</Link></span>
                        <span>•</span>
                        <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700">
                        {task.type || 'Task'}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        task.priority === 'High' ? 'bg-red-50 text-red-700' :
                        task.priority === 'Medium' ? 'bg-orange-50 text-orange-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {task.priority || 'Medium'}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium border">
                        {task.status || 'To Do'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tasks currently assigned.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

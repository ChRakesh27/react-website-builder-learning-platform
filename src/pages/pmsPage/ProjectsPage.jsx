import { Plus, Filter, Search, Users, CalendarDays, Flag, CheckCircle2, Circle, Ellipsis } from 'lucide-react';

const projects = [
  { name: 'Website Redesign', key: 'WEB', status: 'Active', progress: 72, owner: 'Rakesh', members: 8, due: 'Aug 18' },
  { name: 'Mobile App Launch', key: 'MOB', status: 'At Risk', progress: 41, owner: 'Asha', members: 5, due: 'Aug 02' },
  { name: 'SEO Migration', key: 'SEO', status: 'Planning', progress: 18, owner: 'Nikhil', members: 4, due: 'Aug 30' }
];

const tasks = [
  {
    id: 'PROJ-102',
    title: 'Design dashboard overview screen',
    type: 'Task',
    priority: 'High',
    status: 'In Progress',
    assignee: 'Rakesh',
    subtasks: 4,
    checklist: 2,
    due: 'Tomorrow'
  },
  {
    id: 'PROJ-118',
    title: 'Create sprint planning workflow',
    type: 'Epic',
    priority: 'Critical',
    status: 'Review',
    assignee: 'Asha',
    subtasks: 8,
    checklist: 6,
    due: 'Aug 10'
  },
  {
    id: 'PROJ-131',
    title: 'Add team permission matrix',
    type: 'Story',
    priority: 'Medium',
    status: 'To Do',
    assignee: 'Nikhil',
    subtasks: 3,
    checklist: 1,
    due: 'Aug 21'
  }
];

const workflow = [
  {
    title: 'Backlog',
    count: 12,
    items: [
      'Create release roadmap',
      'Break down API contracts',
      'Prepare QA checklist'
    ]
  },
  {
    title: 'In Progress',
    count: 6,
    items: [
      'Design dashboard overview screen',
      'Write component structure',
      'Set up drag and drop board'
    ]
  },
  {
    title: 'Review',
    count: 3,
    items: [
      'Approve sprint scope',
      'Validate assigned subtasks',
      'Check blockers with QA'
    ]
  },
  {
    title: 'Done',
    count: 18,
    items: [
      'Create project templates',
      'Build login page',
      'Set up auth wrapper'
    ]
  }
];

const activity = [
  'Rakesh moved PROJ-102 to In Progress',
  'Asha assigned 3 subtasks to QA team',
  'Nikhil added a blocker to PROJ-118',
  'Sprint review scheduled for Friday'
];

function StatusPill({ children, tone = 'slate' }) {
  const styles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone] || styles.slate}`}>
      {children}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Project Management</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Jira-style project control center</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Plan projects, create tasks and subtasks, assign owners, track blockers, and move work through a team workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950">
              <Plus size={16} /> New Project
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 xl:grid-cols-[280px_1fr]">
        <aside className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Projects</h2>
              <StatusPill tone="blue">3 Active</StatusPill>
            </div>
            <div className="mt-4 grid gap-3">
              {projects.map((project) => (
                <div key={project.key} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{project.name}</p>
                      <p className="text-xs text-slate-400">{project.key}</p>
                    </div>
                    <StatusPill tone={project.status === 'Active' ? 'green' : project.status === 'At Risk' ? 'red' : 'amber'}>
                      {project.status}
                    </StatusPill>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-sky-400" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{project.progress}% complete</span>
                    <span>Due {project.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold text-white">Team overview</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                <span className="inline-flex items-center gap-2"><Users size={16} /> Developers</span>
                <span>12</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                <span className="inline-flex items-center gap-2"><Flag size={16} /> QA</span>
                <span>5</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> Active sprints</span>
                <span>2</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="grid gap-6">
          <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Search projects, tasks, subtasks..."
              />
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-white">
              <Filter size={16} /> Filters
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-medium text-white">
              <Plus size={16} /> Add Issue
            </button>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Open issues', value: '28', tone: 'blue' },
              { label: 'In progress', value: '11', tone: 'amber' },
              { label: 'Blocked', value: '4', tone: 'red' },
              { label: 'Done this week', value: '19', tone: 'green' }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <strong className="text-4xl font-semibold text-white">{item.value}</strong>
                  <StatusPill tone={item.tone}>Live</StatusPill>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-slate-950/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{task.id}</p>
                    <h3 className="mt-2 text-lg font-semibold">{task.title}</h3>
                  </div>
                  <Ellipsis size={18} className="text-slate-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusPill tone="blue">{task.type}</StatusPill>
                  <StatusPill tone={task.priority === 'Critical' ? 'red' : task.priority === 'High' ? 'amber' : 'slate'}>
                    {task.priority}
                  </StatusPill>
                  <StatusPill tone={task.status === 'In Progress' ? 'blue' : task.status === 'Review' ? 'amber' : 'slate'}>
                    {task.status}
                  </StatusPill>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><Circle size={14} /> Assignee</span>
                    <span className="font-medium text-slate-900">{task.assignee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} /> Subtasks</span>
                    <span className="font-medium text-slate-900">{task.subtasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} /> Checklist</span>
                    <span className="font-medium text-slate-900">{task.checklist}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Due</span>
                    <span className="font-medium text-slate-900">{task.due}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Workflow board</h2>
                <StatusPill tone="slate">Drag and drop ready</StatusPill>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-4">
                {workflow.map((column) => (
                  <div key={column.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                      <span className="text-xs text-slate-400">{column.count}</span>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {column.items.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Recent activity</h2>
              <div className="mt-4 grid gap-3">
                {activity.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

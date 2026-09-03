import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, MessageSquare, Tag, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '../../components/Toast.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { subtasksApi } from '../../api/subtasks.js';
import { tasksApi } from '../../api/tasks.js';

const priorityColors = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-orange-50 text-orange-700 border-orange-200',
  Low: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusStyles = {
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-yellow-50 text-yellow-700',
  'Done': 'bg-green-50 text-green-700',
};

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-24 bg-slate-100 rounded-3xl skeleton" />
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-6 space-y-3">
            <div className="skeleton skeleton-line" style={{ width: `${40 + Math.random() * 30}%` }} />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" style={{ width: `${60 + Math.random() * 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaskDetailPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [taskRef, taskVisible] = useScrollReveal();
  const [subRef, subVisible] = useScrollReveal();

  useEffect(() => {
    (async () => {
      try {
        const [taskRes, subRes] = await Promise.all([tasksApi.get(taskId), subtasksApi.list()]);
        setTask(taskRes.data);
        setSubtasks((subRes.data || []).filter((item) => String(item.task_id) === String(taskId)));
      } catch (err) {
        console.error(err);
        toast('Failed to load task details', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, toast]);

  if (loading) return <Skeleton />;
  if (!task) return <p className="text-sm text-red-500">Task not found.</p>;

  return (
    <div className="space-y-6">
      <section className="page-hero animate-fade-in-up">
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link to={`/projects/${id}`}><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <p className="eyebrow">Task Detail</p>
            <h1>{task.title}</h1>
            <p className="text-sm text-slate-500">{task.status} — {task.priority}</p>
          </div>
        </div>
      </section>

      <section ref={subRef} className={`grid gap-4 xl:grid-cols-2 ${subVisible ? 'animate-fade-in-up' : ''}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle className="size-5 text-primary" />Subtasks</CardTitle>
            <CardDescription>Each subtask belongs to this task.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subtasks.length > 0 ? subtasks.map((subtask) => (
              <Card key={subtask.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4 flex items-center gap-3">
                  {subtask.completed ?
                    <CheckCircle className="size-5 text-green-500 shrink-0" /> :
                    <Circle className="size-5 text-slate-300 shrink-0" />}
                  <p className="text-sm font-medium flex-1">{subtask.title}</p>
                  {subtask.deadline && <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="size-3" />{new Date(subtask.deadline).toLocaleDateString()}</span>}
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8 text-sm text-slate-400">
                <MessageSquare className="size-8 mx-auto mb-2 opacity-30" />
                No subtasks yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card ref={taskRef} className={taskVisible ? 'animate-scale-in' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Tag className="size-5 text-primary" />Task Details</CardTitle>
            <CardDescription>Stored in Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Project:</span>
              <Link to={`/projects/${task.project_id}`} className="text-primary hover:underline font-medium">{task.project_id || '-'}</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Type:</span>
              <Badge variant="outline"><Tag className="size-3 mr-1" />{task.type || '-'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Status:</span>
              <Badge className={statusStyles[task.status] || 'bg-slate-100 text-slate-700'}>{task.status || '-'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Priority:</span>
              <Badge className={priorityColors[task.priority] || 'bg-slate-100 text-slate-700'}><AlertTriangle className="size-3 mr-1" />{task.priority || '-'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Assignee:</span>
              <span className="font-medium">{task.assignee || '-'}</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
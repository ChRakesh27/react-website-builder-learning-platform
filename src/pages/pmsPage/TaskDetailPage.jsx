import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { subtasksApi } from '../../api/subtasks.js';
import { tasksApi } from '../../api/tasks.js';

export default function TaskDetailPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    (async () => {
      const [taskRes, subRes] = await Promise.all([tasksApi.get(taskId), subtasksApi.list()]);
      setTask(taskRes.data);
      setSubtasks((subRes.data || []).filter((item) => String(item.task_id) === String(taskId)));
    })();
  }, [taskId]);

  if (!task) return <p className="text-sm text-slate-500">Loading task...</p>;

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Task Detail</p>
          <h1>{task.title}</h1>
          <p>{task.status} - {task.priority}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/projects/${id}`}>Back to project</Link>
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subtasks</CardTitle>
            <CardDescription>Each subtask belongs to this task.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subtasks.map((subtask) => (
              <Card key={subtask.id}>
                <CardContent className="py-4">
                  <p className="text-sm font-medium">{subtask.title}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task data</CardTitle>
            <CardDescription>Stored in Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Project: {task.project_id}</p>
            <p>Type: {task.type}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Assignee: {task.assignee || '-'}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

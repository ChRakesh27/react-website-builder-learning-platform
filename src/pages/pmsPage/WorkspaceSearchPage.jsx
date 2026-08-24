import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FolderKanban, Users, ListTodo, SquareCheckBig, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Button } from '../../components/ui/button.jsx';
import { searchApi } from '../../api/search.js';

const iconByEntity = {
  project: FolderKanban,
  task: ListTodo,
  subtask: SquareCheckBig,
  employee: Users
};

export default function WorkspaceSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error: searchError } = await searchApi.workspace(q, 30);
      if (!active) return;

      if (searchError) {
        setResults([]);
        setError(searchError.message);
      } else {
        setResults(data || []);
        setError('');
      }
      setLoading(false);
    };

    const timer = setTimeout(runSearch, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Workspace Search</p>
          <h1>Fast search across projects, tasks, employees, and subtasks</h1>
          <p>Uses indexed Postgres search for better speed and relevance.</p>
        </div>
        <Button asChild>
          <Link to="/projects">Open Projects</Link>
        </Button>
      </section>

      <Card>
        <CardContent className="pt-6">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <Input
              className="border-0 p-0 shadow-none"
              placeholder="Search by project name, task title, team skill, owner, assignee, status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Searching indexed data...</p> : null}

      <section className="grid gap-4">
        {!loading && query.trim() && !results.length ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No matches found.
            </CardContent>
          </Card>
        ) : null}

        {results.map((item) => {
          const Icon = iconByEntity[item.entity] || Search;
          const title = item.title || item.name || item.key || `Record ${item.id}`;

          return (
            <Card key={`${item.entity}-${item.id}`}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.entity}
                  {item.rank ? <span className="inline-flex items-center gap-1 text-xs"><Sparkles className="size-3" /> ranked</span> : null}
                </CardDescription>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.snippet || item.content || item.description || ''}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.entity === 'project' ? <span>Project ID: {item.id}</span> : null}
                  {item.entity === 'task' ? <span>Task ID: {item.id}</span> : null}
                  {item.entity === 'subtask' ? <span>Subtask ID: {item.id}</span> : null}
                  {item.entity === 'employee' ? <span>Employee ID: {item.id}</span> : null}
                  {typeof item.score === 'number' ? <span>Score: {item.score.toFixed(3)}</span> : null}
                </div>
                <div className="flex gap-2">
                  {item.entity === 'project' ? (
                    <Button asChild variant="outline">
                      <Link to={`/projects/${item.id}`}>Open project</Link>
                    </Button>
                  ) : null}
                  {item.entity === 'employee' ? (
                    <Button asChild variant="outline">
                      <Link to="/employees">Open employees</Link>
                    </Button>
                  ) : null}
                  {item.entity === 'task' && item.project_id ? (
                    <Button asChild variant="outline">
                      <Link to={`/projects/${item.project_id}/tasks/${item.id}`}>Open task</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

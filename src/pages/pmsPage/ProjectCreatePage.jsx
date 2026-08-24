import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { projectsApi } from '../../api/projects.js';
import { auth } from '../../api/auth.js';

const initial = {
  name: '',
  key: '',
  description: '',
  start_date: '',
  deadline: '',
  status: 'Planning',
  database_name: '',
  database_plan: '',
  account_name: '',
  integrations: []
};

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  const makeProjectKey = (value) =>
    String(value || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 12);

  useEffect(() => {
    (async () => {
      const { data } = await auth.get();
      setUserId(data?.user?.id || '');
    })();
  }, []);

  const addIntegration = () => {
    setForm((current) => ({
      ...current,
      integrations: [
        ...current.integrations,
        { name: '', details: '' }
      ]
    }));
  };

  const updateIntegration = (index, field, value) => {
    setForm((current) => ({
      ...current,
      integrations: current.integrations.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const key = form.key || makeProjectKey(form.name);
    const { error: insertError } = await projectsApi.create({
      key,
      name: form.name,
      description: form.description || null,
      start_date: form.start_date || null,
      deadline: form.deadline || null,
      status: form.status,
      owner_id: userId || null,
      database_name: form.database_name || null,
      database_plan: form.database_plan || null,
      account_name: form.account_name || null
    });
    if (insertError) return setError(insertError.message);
    navigate('/projects');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Enter project details. Database and integration details are optional.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={submit}>
          <section className="grid gap-4">
            <div>
              <h3 className="text-base font-semibold">Project details</h3>
              <p className="text-sm text-muted-foreground">Basic project information. Project key is generated automatically.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Project name</label>
                <Input
                  placeholder="Project name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, key: makeProjectKey(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Project key</label>
                <Input placeholder="Auto-generated" value={form.key || makeProjectKey(form.name)} readOnly />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
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
                <label className="text-sm font-medium">Start date</label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Deadline</label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <h3 className="text-base font-semibold">Database details</h3>
              <p className="text-sm text-muted-foreground">Optional. Fill only if needed.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Database name</label>
                <Input placeholder="Database name" value={form.database_name} onChange={(e) => setForm({ ...form, database_name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Database plan</label>
                <Input placeholder="Database plan" value={form.database_plan} onChange={(e) => setForm({ ...form, database_plan: e.target.value })} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Account name</label>
                <Input placeholder="Account name" value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Integration details</h3>
                <p className="text-sm text-muted-foreground">Optional. Add integrations only if needed.</p>
              </div>
              <Button type="button" variant="outline" onClick={addIntegration}>
                Add integration
              </Button>
            </div>

            <div className="grid gap-4">
              {form.integrations.map((item, index) => (
                <div key={`${index}-${item.name}`} className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Integration name</label>
                      <Input
                        placeholder="Example: WhatsApp"
                        value={item.name}
                        onChange={(e) => updateIntegration(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Integration details</label>
                      <Textarea
                        placeholder="Integration details"
                        value={item.details}
                        onChange={(e) => updateIntegration(index, 'details', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {!form.integrations.length ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No integrations added yet.
                </div>
              ) : null}
            </div>
          </section>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit">Save Project</Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { teamsApi } from '../../api/teams.js';

const initial = { name: '', lead: '', members: 1, skills: '' };

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(initial);

  useEffect(() => {
    (async () => {
      const { data } = await teamsApi.list();
      setTeams(data || []);
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await teamsApi.create({ ...form, members: Number(form.members || 0) });
    setForm(initial);
    const { data } = await teamsApi.list();
    setTeams(data || []);
  };

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Teams</p>
          <h1>Team and role management</h1>
          <p>Create teams and define skills, roles, and member count.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create team</CardTitle>
            <CardDescription>Store team data in Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={submit}>
              <Input placeholder="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Lead" value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} />
              <Input placeholder="Members" type="number" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} />
              <Textarea placeholder="Skills / roles" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <Button type="submit">Save Team</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>{team.lead || '-'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Members: {team.members || 0}</p>
                <p>Skills: {team.skills || 'Not set'}</p>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    await teamsApi.remove(team.id);
                    const { data } = await teamsApi.list();
                    setTeams(data || []);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

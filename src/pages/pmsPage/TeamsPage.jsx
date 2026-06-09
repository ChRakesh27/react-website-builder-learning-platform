import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { teamsApi } from '../../api/teams.js';

function Avatar({ name, src }) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase();
  return src ? (
    <img src={src} alt={name || 'Team avatar'} className="size-10 rounded-full object-cover" />
  ) : (
    <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
      {initial}
    </div>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await teamsApi.list();
      setTeams(data || []);
      setLoading(false);
    })();
  }, []);

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter((team) =>
      [team.name, team.lead, team.role, team.skills, team.email, team.phone].join(' ').toLowerCase().includes(q)
    );
  }, [teams, query]);

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Teams</p>
          <h1>Team and role management</h1>
          <p>Search teams, view avatars, and manage records.</p>
        </div>
        <Button asChild>
          <Link to="/teams/new">Create Team</Link>
        </Button>
      </section>

      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search teams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? <p className="text-sm text-muted-foreground">Loading teams...</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Team Table</CardTitle>
          <CardDescription>Team records with avatars and role details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Team</th>
                  <th className="py-3 pr-4 font-medium">Lead</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Members</th>
                  <th className="py-3 pr-4 font-medium">Skills</th>
                  <th className="py-3 pr-4 font-medium">Contact</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="border-b">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={team.name} src={team.avatar_url} />
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-muted-foreground">{team.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{team.lead || '-'}</td>
                    <td className="py-4 pr-4">{team.role || '-'}</td>
                    <td className="py-4 pr-4">{team.members || 0}</td>
                    <td className="py-4 pr-4">{team.skills || '-'}</td>
                    <td className="py-4 pr-4">{team.phone || '-'}</td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Textarea } from '../../components/ui/textarea.jsx';
import { teamsApi } from '../../api/teams.js';

const initial = {
  name: '',
  lead: '',
  members: 1,
  skills: '',
  role: '',
  avatar_url: '',
  email: '',
  phone: ''
};

export default function TeamCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const { error: insertError } = await teamsApi.create({
      ...form,
      members: Number(form.members || 0)
    });
    if (insertError) return setError(insertError.message);
    navigate('/teams');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Team</CardTitle>
        <CardDescription>Add team details and save them to Supabase.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input placeholder="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Lead</label>
            <Input placeholder="Team lead" value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Members</label>
              <Input type="number" placeholder="Members" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Avatar URL</label>
            <Input placeholder="Avatar URL" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Skills / Roles</label>
            <Textarea placeholder="Skills / roles" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit">Save Team</Button>
        </form>
      </CardContent>
    </Card>
  );
}

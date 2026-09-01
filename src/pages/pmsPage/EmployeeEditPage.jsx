import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { employeesApi } from '../../api/employees.js';

const initial = {
  name: '',
  role: '',
  avatar_url: '',
  email: '',
  phone: ''
};

export default function EmployeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await employeesApi.get(id);
        if (data) {
          setForm({
            name: data.name || '',
            role: data.role || '',
            avatar_url: data.avatar_url || '',
            email: data.email || '',
            phone: data.phone || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: updateError } = await employeesApi.update(id, form);
    if (updateError) return setError(updateError.message);
    navigate('/employees');
  };

  if (loading) return <div className="text-sm text-slate-500">Loading employee...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Employee</CardTitle>
        <CardDescription>Update employee details and save changes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Employee Name</label>
            <Input placeholder="Employee name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
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
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
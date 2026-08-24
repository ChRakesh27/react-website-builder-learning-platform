import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { employeesApi } from '../../api/employees.js';

function Avatar({ name, src }) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase();
  return src ? (
    <img src={src} alt={name || 'Employee avatar'} className="size-10 rounded-full object-cover" />
  ) : (
    <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
      {initial}
    </div>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await employeesApi.list();
      setEmployees(data || []);
      setLoading(false);
    })();
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) =>
      [emp.name, emp.role, emp.email, emp.phone].join(' ').toLowerCase().includes(q)
    );
  }, [employees, query]);

  const handleEmployeeClick = (emp) => {
    navigate(`/employees/${emp.id}`);
  };

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Employees</p>
          <h1>Employee Management</h1>
          <p>Search employees, view avatars, and manage records.</p>
        </div>
        <Button asChild>
          <Link to="/employees/new">Create Employee</Link>
        </Button>
      </section>

      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search employees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? <p className="text-sm text-muted-foreground">Loading employees...</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Employee records with avatars and details. Click an employee to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Employee</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Contact</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => handleEmployeeClick(emp)}>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} src={emp.avatar_url} />
                        <div>
                          <div className="font-medium text-black">{emp.name}</div>
                          <div className="text-muted-foreground">{emp.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{emp.role || '-'}</td>
                    <td className="py-4 pr-4">{emp.phone || '-'}</td>
                    <td className="py-4 pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={async () => {
                            if (!window.confirm("Are you sure you want to delete this employee?")) return;
                            await employeesApi.remove(emp.id);
                            const { data } = await employeesApi.list();
                            setEmployees(data || []);
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

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
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
  const [viewMode, setViewMode] = useState('table');
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
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <Input
              placeholder="Search employees..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="px-3"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} className="mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="px-3"
                onClick={() => setViewMode('table')}
              >
                <List size={16} className="mr-2" />
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? <p className="text-sm text-muted-foreground">Loading employees...</p> : null}

      {viewMode === 'grid' ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredEmployees.map((emp) => (
            <Card key={emp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEmployeeClick(emp)}>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <Avatar name={emp.name} src={emp.avatar_url} />
                </div>
                <CardTitle>{emp.name}</CardTitle>
                <CardDescription>{emp.role || 'No Role'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground space-y-3">
                <div>{emp.email || 'No email'}</div>
                <div>{emp.phone || 'No phone'}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!window.confirm("Are you sure you want to delete this employee?")) return;
                    await employeesApi.remove(emp.id);
                    const { data } = await employeesApi.list();
                    setEmployees(data || []);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="cursor-pointer" onClick={() => handleEmployeeClick(emp)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} src={emp.avatar_url} />
                      <div>
                        <div className="font-medium text-black">{emp.name}</div>
                        <div className="text-muted-foreground">{emp.email || '-'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.role || '-'}</TableCell>
                  <TableCell>{emp.phone || '-'}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

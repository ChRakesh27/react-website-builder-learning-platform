import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Search } from 'lucide-react';
import { useToast } from '../../components/Toast.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.jsx';
import { employeesApi } from '../../api/employees.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

function Avatar({ name, src }) {
  const initial = (name || '?').trim().slice(0, 1).toUpperCase();
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'];
  const colorClass = colors[name.length % colors.length];
  return src ? (
    <img src={src} alt={name || 'Employee avatar'} className="size-10 rounded-full object-cover" />
  ) : (
    <div className={`flex size-10 items-center justify-center rounded-full ${colorClass} text-sm font-semibold text-white`}>
      {initial}
    </div>
  );
}

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState('table');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await employeesApi.list();
      setEmployees(data || []);
      setLoading(false);
      toast('Employees loaded', 'success', 2000);
    })();
  }, [toast]);

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) =>
      [emp.name, emp.role, emp.email, emp.phone].join(' ').toLowerCase().includes(q)
    );
  }, [employees, query]);

  const handleEmployeeClick = (emp) => { navigate(`/employees/${emp.id}`); };

  const handleDelete = async (id) => {
    try {
      await employeesApi.remove(id);
      const { data } = await employeesApi.list();
      setEmployees(data || []);
      toast('Employee deleted', 'success');
    } catch (err) {
      toast('Failed to delete employee', 'error');
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-slate-100 rounded-3xl skeleton" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-white p-6 space-y-3">
              <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }} />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="page-hero animate-fade-in-up">
        <div>
          <p className="eyebrow">Employees</p>
          <h1>Employee Management</h1>
          <p>Search employees, view avatars, and manage records.</p>
        </div>
        <Button asChild><Link to="/employees/new">Create Employee</Link></Button>
      </section>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <Input placeholder="Search employees..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" className="px-3" onClick={() => setViewMode('grid')}>
                <LayoutGrid size={16} className="mr-2" /> Grid
              </Button>
              <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" className="px-3" onClick={() => setViewMode('table')}>
                <List size={16} className="mr-2" /> Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredEmployees.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-icon"><Search size={48} /></div>
          <h3>No employees found</h3>
          <p>Try adjusting your search or create a new employee.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredEmployees.map((emp, i) => (
            <div key={emp.id} className="animate-card-enter" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
              <Card className="cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => handleEmployeeClick(emp)}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2"><Avatar name={emp.name} src={emp.avatar_url} /></div>
                  <CardTitle>{emp.name}</CardTitle>
                  <CardDescription>{emp.role || 'No Role'}</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground space-y-3">
                  <div>{emp.email || 'No email'}</div>
                  <div>{emp.phone || 'No phone'}</div>
                  <Button variant="outline" size="sm" className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setConfirmDelete({ id: emp.id }); }}>Delete</Button>
                </CardContent>
              </Card>
            </div>
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
                <TableRow key={emp.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleEmployeeClick(emp)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} src={emp.avatar_url} />
                      <div><div className="font-medium text-black">{emp.name}</div><div className="text-muted-foreground">{emp.email || '-'}</div></div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.role || '-'}</TableCell>
                  <TableCell>{emp.phone || '-'}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmDelete({ id: emp.id })}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => handleDelete(confirmDelete?.id)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
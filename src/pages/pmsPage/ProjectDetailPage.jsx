import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  LayoutGrid,
  List,
  ListTodo,
  Pencil,
  Plug,
  Plus,
  PlusCircle,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { employeesApi } from "../../api/employees.js";
import { projectMembersApi } from "../../api/projectMembers.js";
import { projectsApi } from "../../api/projects.js";
import { subtasksApi } from "../../api/subtasks.js";
import { tasksApi } from "../../api/tasks.js";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.jsx";
import { Textarea } from "../../components/ui/textarea.jsx";

const emptyTask = {
  title: "",
  type: "Task",
  priority: "Medium",
  status: "to-do",
  assignee: "",
  project_id: "",
  start_date: "",
  deadline: "",
};
const emptySubtask = { title: "", task_id: "" };
const emptyMember = { employee_id: "" };
const taskStatusOptions = [
  "on-hold",
  "to-do",
  "on-going",
  "review",
  "deploy",
  "completed",
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [globalEmployees, setGlobalEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [subtaskForm, setSubtaskForm] = useState(emptySubtask);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [openSubtaskFor, setOpenSubtaskFor] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("task");
  const [tasksViewMode, setTasksViewMode] = useState("table");

  const [editForm, setEditForm] = useState({
    name: "",
    key: "",
    start_date: "",
    deadline: "",
    status: "Planning",
  });

  const globalEmployeeOptions = useMemo(
    () =>
      globalEmployees.map((emp) => ({
        id: String(emp.id),
        label: emp.name || `Employee ${emp.id}`,
      })),
    [globalEmployees],
  );

  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        id: String(member.id),
        label: member.name || `Member ${member.id}`,
      })),
    [members],
  );

  const tabs = useMemo(
    () => [
      { id: "description", label: "Description", icon: FileText },
      { id: "team", label: "Employees", icon: Users },
      { id: "task", label: "Task", icon: ListTodo },
      { id: "database", label: "Database", icon: Database },
      { id: "integration", label: "Integration", icon: Plug },
    ],
    [],
  );

  async function loadData() {
    const [p, t, s, m, emps] = await Promise.all([
      projectsApi.get(id),
      tasksApi.list(),
      subtasksApi.list(),
      projectMembersApi.list(id),
      employeesApi.list(),
    ]);
    setProject(p.data);
    setDescription(p.data?.description || "");
    if (p.data) {
      setEditForm({
        name: p.data.name || "",
        key: p.data.key || "",
        start_date: p.data.start_date || "",
        deadline: p.data.deadline || "",
        status: p.data.status || "Planning",
      });
    }
    setTasks(
      (t.data || [])
        .filter((task) => String(task.project_id) === String(id))
        .map((task) => ({
          ...task,
          subtasks: (s.data || []).filter(
            (subtask) => String(subtask.task_id) === String(task.id),
          ),
        })),
    );
    setMembers(m.data || []);
    setGlobalEmployees(emps.data || []);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (!project)
    return <p className="text-sm text-slate-500">Loading project...</p>;

  const saveDescription = async () => {
    const { error: updateError } = await projectsApi.update(id, {
      description,
    });
    if (updateError) return setError(updateError.message);
    setError("");
    await loadData();
  };

  const submitMember = async (event) => {
    event.preventDefault();
    if (!memberForm.employee_id) return setError("Please select an employee.");
    const selectedEmp = globalEmployees.find(
      (e) => String(e.id) === memberForm.employee_id,
    );
    if (!selectedEmp) return setError("Selected employee not found.");

    const { error: insertError } = await projectMembersApi.create({
      project_id: id,
      employee_id: selectedEmp.id,
      name: selectedEmp.name,
      role: selectedEmp.role || null,
      email: selectedEmp.email || null,
    });
    if (insertError) return setError(insertError.message);
    setMemberForm(emptyMember);
    await loadData();
    setSheetOpen(false);
  };

  const submitTask = async (event) => {
    event.preventDefault();
    if (editingTaskId) {
      const payload = {
        title: taskForm.title,
        status: taskForm.status,
        assignee: taskForm.assignee,
        priority: taskForm.priority,
        type: taskForm.type,
        start_date: taskForm.start_date || null,
        deadline: taskForm.deadline || null,
      };
      const { error: updateError } = await tasksApi.update(
        editingTaskId,
        payload,
      );
      if (updateError) return setError(updateError.message);
    } else {
      const payload = {
        title: taskForm.title,
        status: taskForm.status,
        assignee: taskForm.assignee,
        priority: taskForm.priority,
        type: taskForm.type,
        start_date: taskForm.start_date || null,
        deadline: taskForm.deadline || null,
        project_id: parseInt(id, 10),
      };
      const { error: insertError } = await tasksApi.create(payload);
      if (insertError) return setError(insertError.message);
    }
    setTaskForm(emptyTask);
    setEditingTaskId(null);
    setSheetOpen(false);
    await loadData();
  };

  const submitSubtask = async (event) => {
    event.preventDefault();
    const { error: insertError } = await subtasksApi.create({
      title: subtaskForm.title,
      task_id: openSubtaskFor,
    });
    if (insertError) return setError(insertError.message);
    setSubtaskForm(emptySubtask);
    setOpenSubtaskFor("");
    setSheetOpen(false);
    await loadData();
  };

  const normalizeTaskStatus = (status) => {
    const normalized = String(status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    const aliases = {
      todo: "to-do",
      "to-do": "to-do",
      ongoing: "on-going",
      "on-going": "on-going",
      onhold: "on-hold",
      "on-hold": "on-hold",
    };
    return aliases[normalized] || normalized || "to-do";
  };

  const updateTaskStatus = async (task, status) => {
    const { error: updateError } = await tasksApi.update(task.id, { status });
    if (updateError) setError(updateError.message);
    else await loadData();
  };

  return (
    <div className="space-y-6">
      <Link to="/projects">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </Link>
      <section className="page-hero">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="size-4" />
            <span>Project workspace</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="!text-3xl md:!text-4xl">{project.name}</h1>
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
              {project.status || "Planning"}
            </span>
          </div>
          <p className="mt-2">
            {project.description || "No project description yet."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Start {project.start_date || "Not set"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Due {project.deadline || "Not set"}
            </span>
          </div>
        </div>
        <div className="button-row shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSheetMode("edit");
              setSheetOpen(true);
            }}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            variant="ghost"
            type="button"
            onClick={async () => {
              await projectsApi.remove(id);
              navigate("/projects");
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </section>

      <section className="flex flex-wrap gap-1  bg-white p-1.5 ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              type="button"
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="mr-1 size-4" />
              {tab.label}
            </Button>
          );
        })}
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {activeTab === "description" ? (
        <Card>
          <CardHeader className="border-b border-border/70">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              Description
            </CardTitle>
            <CardDescription>
              Edit the project description here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write project description..."
              className="min-h-40"
            />
            <Button onClick={saveDescription}>
              <Save className="mr-2 size-4" />
              Save Description
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "team" ? (
        <Card>
          <CardHeader className="border-b border-border/70">
            <CardTitle className="">
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  Assigned Employees
                </div>
                <div className="">
                  <Button
                    type="button"
                    onClick={() => {
                      setSheetMode("member");
                      setMemberForm(emptyMember);
                      setSheetOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Assign Employee
                  </Button>
                </div>
              </div>
            </CardTitle>

          </CardHeader>
          <CardContent className="space-y-3">
            {members.length ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-black">{member.name}</p>
                    <p className="text-sm text-black">
                      {member.role || "Employee"}
                      {member.email ? ` • ${member.email}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={async () => {
                      await projectMembersApi.remove(member.id);
                      await loadData();
                    }}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No employees added yet.</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "task" ? (
        <Card>
          <CardHeader className="border-b border-border/70">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-muted-foreground" />
                  Tasks
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">
                    {tasks.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  Use the sidebar to create tasks and subtasks.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <Button
                  variant={tasksViewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="px-3"
                  onClick={() => setTasksViewMode("grid")}
                >
                  <LayoutGrid size={16} className="mr-2" />
                  Grid
                </Button>
                <Button
                  variant={tasksViewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="px-3"
                  onClick={() => setTasksViewMode("table")}
                >
                  <List size={16} className="mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                onClick={() => {
                  setSheetMode("task");
                  setEditingTaskId(null);
                  setTaskForm({ ...emptyTask, project_id: id });
                  setSheetOpen(true);
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                New task
              </Button>
              <p className="text-xs text-muted-foreground">
                Click a task row to view its subtasks.
              </p>
            </div>

            {tasks.length ? (
              tasksViewMode === "grid" ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <ClipboardList className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {task.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {task.priority || "Medium"} priority
                            </p>
                          </div>
                        </div>
                        <Select
                          value={normalizeTaskStatus(task.status)}
                          onValueChange={(status) =>
                            updateTaskStatus(task, status)
                          }
                        >
                          <SelectTrigger className="w-[120px] shrink-0 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taskStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          <span>{task.deadline || "No deadline"}</span>
                          <span className="text-slate-300">|</span>
                          <span>{task.subtasks?.length || 0} subtasks</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSheetMode("task");
                              setEditingTaskId(task.id);
                              setTaskForm({ ...task });
                              setSheetOpen(true);
                            }}
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSheetMode("subtask");
                              setOpenSubtaskFor(task.id);
                              setSubtaskForm({ title: "", task_id: task.id });
                              setSheetOpen(true);
                            }}
                          >
                            <Plus className="mr-2 size-4" />
                            Add Subtask
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(task.subtasks || []).map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-slate-700"
                          >
                            <CircleDot className="size-3.5 text-slate-400" />
                            {subtask.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Subtasks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <Fragment key={task.id}>
                          <TableRow
                            className="cursor-pointer"
                            onClick={() =>
                              setExpandedTaskId(
                                expandedTaskId === String(task.id)
                                  ? ""
                                  : String(task.id),
                              )
                            }
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {expandedTaskId === String(task.id) ? (
                                  <ChevronUp className="size-4 text-slate-500" />
                                ) : (
                                  <ChevronDown className="size-4 text-slate-500" />
                                )}
                                <span>{task.title}</span>
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <Select
                                value={normalizeTaskStatus(task.status)}
                                onValueChange={(status) =>
                                  updateTaskStatus(task, status)
                                }
                              >
                                <SelectTrigger className="w-[125px] bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {taskStatusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={task.start_date || ""}
                                onChange={async (e) => {
                                  const { error } = await tasksApi.update(
                                    task.id,
                                    { start_date: e.target.value || null },
                                  );
                                  if (error) setError(error.message);
                                  else loadData();
                                }}
                                className="h-8 text-xs w-[130px]"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={task.deadline || ""}
                                onChange={async (e) => {
                                  const { error } = await tasksApi.update(
                                    task.id,
                                    { deadline: e.target.value || null },
                                  );
                                  if (error) setError(error.message);
                                  else loadData();
                                }}
                                className="h-8 text-xs w-[130px]"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell>
                              {task.assignee || "Unassigned"}
                            </TableCell>
                            <TableCell>{task.subtasks?.length || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSheetMode("task");
                                    setEditingTaskId(task.id);
                                    setTaskForm({ ...task });
                                    setSheetOpen(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSheetMode("subtask");
                                    setOpenSubtaskFor(task.id);
                                    setSubtaskForm({
                                      title: "",
                                      task_id: task.id,
                                    });
                                    setSheetOpen(true);
                                  }}
                                >
                                  <Plus className="mr-2 size-4" />
                                  Add Subtask
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedTaskId === String(task.id) ? (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-slate-50">
                                <div className="space-y-3 p-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-700">
                                      Subtasks
                                    </p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSheetMode("subtask");
                                        setOpenSubtaskFor(task.id);
                                        setSubtaskForm({
                                          title: "",
                                          task_id: task.id,
                                        });
                                        setSheetOpen(true);
                                      }}
                                    >
                                      <Plus className="mr-2 size-4" />
                                      Add Subtask
                                    </Button>
                                  </div>
                                  {(task.subtasks || []).length ? (
                                    <div className="grid gap-2">
                                      {task.subtasks.map((subtask) => (
                                        <div
                                          key={subtask.id}
                                          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-black"
                                        >
                                          {subtask.title}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-slate-500">
                                      No subtasks yet.
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <p className="text-sm text-slate-500">
                No tasks found for this project.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "database" ? (
        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription>Optional database information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Database name: {project.database_name || "Not added yet"}</p>
            <p>Database plan: {project.database_plan || "Not added yet"}</p>
            <p>Account name: {project.account_name || "Not added yet"}</p>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "integration" ? (
        <Card>
          <CardHeader>
            <CardTitle>Integration</CardTitle>
            <CardDescription>Optional integration details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>
              Integration details are not stored in the current project record.
            </p>
            <p>
              Add integrations in the create form if you want them saved in a
              future schema update.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="border-b border-border px-4 pb-4 pt-6">
            <SheetTitle>
              {sheetMode === "task"
                ? editingTaskId
                  ? "Edit Task"
                  : "Create Task"
                : sheetMode === "subtask"
                  ? "Create Subtask"
                  : "Assign Employee"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "task"
                ? "Create a new task for this project from the sidebar."
                : sheetMode === "subtask"
                  ? "Create a subtask for the selected task from the sidebar."
                  : "Select an employee from the workspace to assign to this project."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sheetMode === "task" ? (
              <form className="grid gap-3" onSubmit={submitTask}>
                <Input
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={taskForm.start_date || ""}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={taskForm.deadline || ""}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, deadline: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Select
                  value={taskForm.status}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={taskForm.assignee}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, assignee: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberOptions.length ? (
                      memberOptions.map((member) => (
                        <SelectItem key={member.id} value={member.label}>
                          {member.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="unassigned">
                        No employees assigned to project
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  {editingTaskId ? "Update Task" : "Create Task"}
                </Button>
              </form>
            ) : sheetMode === "subtask" ? (
              <form className="grid gap-3" onSubmit={submitSubtask}>
                <Input
                  placeholder="Subtask title"
                  value={subtaskForm.title}
                  onChange={(e) =>
                    setSubtaskForm({ ...subtaskForm, title: e.target.value })
                  }
                />
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Create Subtask
                </Button>
              </form>
            ) : sheetMode === "member" ? (
              <form className="grid gap-3" onSubmit={submitMember}>
                <Select
                  value={memberForm.employee_id}
                  onValueChange={(value) =>
                    setMemberForm({ ...memberForm, employee_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalEmployeeOptions.length ? (
                      globalEmployeeOptions.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-employees">
                        No employees in workspace
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <PlusCircle className="mr-2 size-4" />
                  Assign Employee
                </Button>
              </form>
            ) : sheetMode === "edit" ? (
              <form
                className="grid gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    console.log("=== STARTING PROJECT UPDATE ===");
                    const payload = {
                      ...editForm,
                      // projectsApi.update uses upsert, so preserve required fields.
                      key: project.key || editForm.key,
                    };
                    if (!payload.start_date) payload.start_date = null;
                    if (!payload.deadline) payload.deadline = null;

                    console.log("Payload being sent:", payload);
                    console.log("Project ID:", id);

                    const response = await projectsApi.update(id, payload);

                    console.log("Update response:", response);

                    if (response.error) {
                      console.error("Supabase API Error:", response.error);
                      return setError(
                        response.error.message ||
                          JSON.stringify(response.error),
                      );
                    }

                    setSheetOpen(false);
                    await loadData();
                    console.log("=== UPDATE SUCCESSFUL ===");
                  } catch (err) {
                    console.error("Caught Exception during update:", err);
                    setError(
                      err.message ||
                        "An unexpected error occurred during update.",
                    );
                  }
                }}
              >
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
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
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={editForm.start_date || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={editForm.deadline || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, deadline: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

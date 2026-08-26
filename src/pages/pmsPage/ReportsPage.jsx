import { ChevronDown, Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { projectsApi } from "../../api/projects.js";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.jsx";

export default function ReportsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedProjectIds, setSelectedProjectIds] = useState([]); // [] means all
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [pRes, tRes] = await Promise.all([
        projectsApi.list(),
        tasksApi.list(),
      ]);

      if (pRes.error || tRes.error) {
        setError(
          pRes.error?.message || tRes.error?.message || "Failed to load data.",
        );
      } else {
        setProjects(pRes.data || []);
        setTasks(tRes.data || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by Project (Multiple)
      if (
        selectedProjectIds.length > 0 &&
        !selectedProjectIds.includes(String(task.project_id))
      ) {
        return false;
      }

      // Filter by Status
      if (selectedStatus !== "all" && task.status !== selectedStatus) {
        return false;
      }

      // Filter by Date
      const taskDate = task.start_date || task.created_at;

      if (startDate && taskDate) {
        if (new Date(taskDate) < new Date(startDate)) return false;
      }
      if (endDate && taskDate) {
        if (new Date(taskDate) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [tasks, selectedProjectIds, selectedStatus, startDate, endDate]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.status).filter(Boolean)));
  }, [tasks]);

  const exportToExcel = () => {
    const dataToExport = filteredTasks.map((task) => {
      const proj = projects.find(
        (p) => String(p.id) === String(task.project_id),
      );
      return {
        "Task ID": task.id,
        Title: task.title,
        Project: proj ? proj.name : "Unknown",
        Status: task.status,
        Priority: task.priority,
        Type: task.type,
        "Start Date":
          task.start_date || task.created_at
            ? new Date(task.start_date || task.created_at).toLocaleDateString()
            : "",
        Deadline: task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "",
        Assignee: task.assignee || "Unassigned",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Tasks_Report_${dateStr}.xlsx`);
  };

  const toggleProjectSelection = (id) => {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjectIds(selectedProjectIds.filter((pId) => pId !== id));
    } else {
      setSelectedProjectIds([...selectedProjectIds, id]);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading reports data...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Filter and export your project tasks data.
          </p>
        </div>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down the tasks data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Projects</label>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm cursor-pointer hover:bg-accent/50"
                  onClick={() =>
                    setIsProjectDropdownOpen(!isProjectDropdownOpen)
                  }
                >
                  <span className="truncate">
                    {selectedProjectIds.length === 0
                      ? "All Projects"
                      : `${selectedProjectIds.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>

                {isProjectDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1">
                    <div
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                      onClick={() => setSelectedProjectIds([])}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProjectIds.length === 0}
                        readOnly
                        className="rounded border-primary text-primary focus:ring-primary"
                      />
                      <span>All Projects</span>
                    </div>
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                        onClick={() => toggleProjectSelection(String(p.id))}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(String(p.id))}
                          readOnly
                          className="rounded border-primary text-primary focus:ring-primary"
                        />
                        <span className="truncate">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                className="h-9"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                className="h-9"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No tasks match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const proj = projects.find(
                      (p) => String(p.id) === String(task.project_id),
                    );
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>{proj?.name || "Unknown"}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>
                          {task.start_date || task.created_at
                            ? new Date(
                                task.start_date || task.created_at,
                              ).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

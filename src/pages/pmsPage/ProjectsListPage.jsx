import {
  CalendarDays,
  CircleDot,
  FolderKanban,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { projectsApi } from "../../api/projects.js";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";

const statusStyles = {
  planning: "border-slate-200 bg-slate-50 text-slate-600",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  "at risk": "border-amber-200 bg-amber-50 text-amber-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function StatusBadge({ status }) {
  const label = status || "Planning";
  const className =
    statusStyles[String(label).toLowerCase()] ||
    "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <CircleDot className="size-3" />
      {label}
    </span>
  );
}

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/projects/${project.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/projects/${project.id}`);
        }
      }}
    >
      <CardHeader className="gap-3 border-b border-border/70">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FolderKanban className="size-5" />
            </div>
            <div className="min-w-0">
              <CardDescription className="font-medium uppercase tracking-wider">
                {project.key || "Project"}
              </CardDescription>
              <CardTitle className="truncate text-lg">{project.name}</CardTitle>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0" />
            <span className="truncate">{project.owner || "No owner"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            <span>Due {project.deadline || "Not set"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Started {project.start_date || "Not set"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              title="Delete project"
              aria-label={`Delete ${project.name}`}
              className="text-slate-400 hover:bg-red-50 hover:text-red-600"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(project);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    const { data, error: listError } = await projectsApi.list();
    if (listError) setError(listError.message);
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete ${project.name}? This cannot be undone.`))
      return;
    const { error: deleteError } = await projectsApi.remove(project.id);
    if (deleteError) return setError(deleteError.message);
    await loadProjects();
  };

  return (
    <div className="space-y-6">
      <section className="page-hero !mb-0 !p-7 md:!p-9">
        <div className="flex items-start gap-4">
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white sm:flex">
            <FolderKanban className="size-6" />
          </div>
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="!text-3xl md:!text-4xl">Projects</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Keep projects, tasks, people, and deadlines in one clear view.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {loading
              ? "Loading projects..."
              : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Select a project to manage its workspace.
          </p>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : projects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FolderKanban className="size-7" />
            </div>
            <CardTitle className="text-xl">No projects yet</CardTitle>
            <CardDescription className="mt-2 max-w-sm">
              Create your first project to start organizing tasks and your team.
            </CardDescription>
            <Button asChild className="mt-5">
              <Link to="/projects/new">Create project</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

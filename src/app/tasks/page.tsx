// SSR - needs real-time user task data
import { getSession } from "@/lib/auth";
import { taskDb, projectDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_DOT, formatDate, isOverdue } from "@/lib/utils";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskActions from "@/components/tasks/TaskActions";

export const dynamic = "force-dynamic";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ status?: string; priority?: string; projectId?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  const sp = await searchParams;
  const filters = { status: sp.status, priority: sp.priority, projectId: sp.projectId };
  const tasks = taskDb.findAll(session.id, filters);
  const projects = projectDb.findAll(session.id);

  const statuses = ["", "todo", "in_progress", "done", "cancelled"];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded px-2 py-0.5 inline-block mb-2">SSR — Server Side Rendered</div>
          <h1 className="text-3xl font-black tracking-tight">Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{tasks.length} task{tasks.length !== 1 ? "s" : ""} {Object.values(filters).some(Boolean) ? "matching filters" : "total"}</p>
        </div>
        <CreateTaskModal projects={projects} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => {
          const active = (sp.status || "") === s;
          const label = s === "" ? "All" : STATUS_LABELS[s];
          const url = s ? `?status=${s}` : "/tasks";
          return (
            <a key={s} href={url}
              className={"text-sm px-4 py-1.5 rounded-full border font-medium transition-colors " +
                (active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400")}>
              {label}
            </a>
          );
        })}
      </div>

      {/* Task list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {tasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No tasks found</h3>
            <p className="text-slate-400 text-sm">Create your first task to get started</p>
          </div>
        )}
        {tasks.map((task, i) => {
          const project = projects.find((p) => p.id === task.projectId);
          const overdue = isOverdue(task.dueDate, task.status);
          return (
            <div key={task.id} className={"flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors " + (i !== tasks.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : "")}>
              <span className={"w-2.5 h-2.5 rounded-full flex-shrink-0 " + PRIORITY_DOT[task.priority]} />
              <div className="flex-1 min-w-0">
                <div className={"font-medium text-sm " + (task.status === "done" ? "line-through text-slate-400" : "text-slate-900 dark:text-white")}>{task.title}</div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {task.description && <span className="text-xs text-slate-400 truncate max-w-xs">{task.description}</span>}
                  {project && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                      {project.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className={"text-xs " + (overdue ? "text-red-500 font-medium" : "text-slate-400")}>
                      {overdue ? "⚠ Overdue · " : "Due "}{formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <span className={"text-xs px-2.5 py-1 rounded-full font-medium shrink-0 " + STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</span>
              <span className={"text-xs px-2.5 py-1 rounded-full font-medium shrink-0 " + PRIORITY_COLORS[task.priority]}>{PRIORITY_LABELS[task.priority]}</span>
              <TaskActions task={task} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

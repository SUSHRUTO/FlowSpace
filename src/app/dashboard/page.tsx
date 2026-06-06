// SSR - Server Side Rendering (user-specific real-time data)
import { getSession } from "@/lib/auth";
import { taskDb, projectDb } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_DOT, formatDate, isOverdue } from "@/lib/utils";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const stats = taskDb.stats(session.id);
  const recentTasks = taskDb.findAll(session.id).slice(0, 8);
  const projects = projectDb.findAll(session.id);

  const statCards = [
    { label: "Total Tasks", value: stats.total, color: "from-indigo-500 to-violet-600", bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
    { label: "In Progress", value: stats.in_progress, color: "from-blue-500 to-cyan-600", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    { label: "Completed", value: stats.done, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    { label: "Urgent", value: stats.urgent, color: "from-red-500 to-rose-600", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded px-2 py-0.5 inline-block mb-2">SSR — Server Side Rendered</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Good day, {session.name.split(" ")[0]} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's on your plate today.</p>
        </div>
        <CreateTaskModal projects={projects} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className={"rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}>
            <div className={`text-3xl font-black mb-1 ${s.text}`}>{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base">Recent Tasks</h2>
            <Link href="/tasks" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTasks.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No tasks yet. Create your first task!</div>
            )}
            {recentTasks.map((task) => (
              <div key={task.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className={"w-2 h-2 rounded-full flex-shrink-0 " + PRIORITY_DOT[task.priority]} />
                <div className="flex-1 min-w-0">
                  <div className={"text-sm font-medium truncate " + (task.status === "done" ? "line-through text-slate-400" : "text-slate-900 dark:text-white")}>{task.title}</div>
                  {task.dueDate && (
                    <div className={"text-xs mt-0.5 " + (isOverdue(task.dueDate, task.status) ? "text-red-500" : "text-slate-400")}>
                      {isOverdue(task.dueDate, task.status) ? "⚠ " : ""}Due {formatDate(task.dueDate)}
                    </div>
                  )}
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + STATUS_COLORS[task.status]}>
                  {STATUS_LABELS[task.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-bold text-base mb-4">Completion Rate</h2>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-3">{completionRate}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all" style={{ width: completionRate + "%" }} />
            </div>
            <div className="text-xs text-slate-400">{stats.done} of {stats.total} tasks done</div>
            {stats.overdue > 0 && (
              <div className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                ⚠ {stats.overdue} task{stats.overdue > 1 ? "s" : ""} overdue
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base">Projects</h2>
              <Link href="/projects" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">View all →</Link>
            </div>
            {projects.length === 0 && <div className="text-xs text-slate-400 text-center py-3">No projects yet</div>}
            <div className="space-y-2">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 py-1">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

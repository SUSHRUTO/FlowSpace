// SSG - Static Site Generation (no dynamic data needed)
export const dynamic = "force-static";

export default function AboutPage() {
  const stack = [
    { cat: "Framework", items: ["Next.js 14 (App Router)", "React 18", "TypeScript"] },
    { cat: "Styling", items: ["Tailwind CSS v4", "CSS Variables"] },
    { cat: "Database", items: ["JSON File DB", "uuid for IDs", "bcryptjs"] },
    { cat: "Auth", items: ["JWT tokens", "HTTP-only cookies", "Server sessions"] },
    { cat: "Next.js Concepts", items: ["SSR · SSG · ISR", "API Routes (REST)", "Server Actions", "File-based Routing", "Layouts"] },
  ];
  const routes = [
    { method: "GET", path: "/api/tasks", desc: "Fetch all tasks" },
    { method: "POST", path: "/api/tasks", desc: "Create a new task" },
    { method: "GET", path: "/api/tasks/[id]", desc: "Get a single task" },
    { method: "PUT", path: "/api/tasks/[id]", desc: "Update a task" },
    { method: "DELETE", path: "/api/tasks/[id]", desc: "Delete a task" },
    { method: "GET", path: "/api/projects", desc: "Fetch all projects" },
    { method: "POST", path: "/api/projects", desc: "Create a project" },
    { method: "PUT", path: "/api/projects/[id]", desc: "Update a project" },
    { method: "DELETE", path: "/api/projects/[id]", desc: "Delete a project" },
    { method: "POST", path: "/api/auth/register", desc: "Register user" },
    { method: "POST", path: "/api/auth/login", desc: "Login user" },
    { method: "GET", path: "/api/stats", desc: "Dashboard statistics" },
  ];
  const mc: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="inline-block text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded px-3 py-1 mb-4">SSG — Statically Generated</div>
        <h1 className="text-4xl font-black tracking-tight mb-3">Tech Stack &amp; Architecture</h1>
        <p className="text-slate-500 dark:text-slate-400">This page is statically generated at build time since it never changes.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {stack.map((s) => (
          <div key={s.cat} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="text-xs font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-3">{s.cat}</div>
            <ul className="space-y-1.5">
              {s.items.map((i) => (
                <li key={i} className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-5">API Reference</h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-10">
        {routes.map((r, i) => (
          <div key={i} className={"flex items-center gap-4 px-5 py-3.5 text-sm" + (i !== routes.length - 1 ? " border-b border-slate-100 dark:border-slate-800" : "")}>
            <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 " + mc[r.method]}>{r.method}</span>
            <code className="font-mono text-xs text-slate-600 dark:text-slate-300">{r.path}</code>
            <span className="text-slate-400 text-xs ml-auto">{r.desc}</span>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6">
        <div className="font-mono text-xs text-slate-400 mb-3">// Rendering strategies used</div>
        <div className="space-y-2 font-mono text-xs">
          <div><span className="text-indigo-400">SSR</span> <span className="text-slate-400">→ Dashboard, Tasks page (request-time user data)</span></div>
          <div><span className="text-emerald-400">SSG</span> <span className="text-slate-400">→ About page (static, built at compile time)</span></div>
          <div><span className="text-amber-400">ISR</span> <span className="text-slate-400">→ Projects page (revalidate: 60s)</span></div>
          <div><span className="text-purple-400">Server Actions</span> <span className="text-slate-400">→ create task, create project, login, register</span></div>
        </div>
      </div>
    </div>
  );
}

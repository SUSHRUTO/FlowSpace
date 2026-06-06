import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const features = [
    { icon: "✦", title: "Smart Task Management", desc: "Create, organize, and track tasks with priorities, due dates, and status updates." },
    { icon: "◈", title: "Project Workspaces", desc: "Group tasks under projects with custom colors to keep your work organized." },
    { icon: "⬡", title: "Real-time Dashboard", desc: "Visualize your progress with live stats, completion rates, and activity feeds." },
    { icon: "◎", title: "Priority System", desc: "Four-level priority system — Low, Medium, High, Urgent — to focus on what matters." },
    { icon: "⌘", title: "Full REST API", desc: "Complete API with GET, POST, PUT, DELETE endpoints and structured responses." },
    { icon: "▣", title: "Server Actions", desc: "Form submissions powered by Next.js Server Actions for instant, seamless UX." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">T</div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Sign in</Link>
            <Link href="/auth/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg font-medium">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Next.js 14 · App Router · Server Actions · REST API
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
          Ship tasks,<br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">not excuses.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          TaskFlow is a full-stack Next.js project manager with SSR, SSG, ISR, API routes, Server Actions, and a real database.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-500 transition-all text-white font-semibold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-indigo-500/25">
            Start for free →
          </Link>
          <Link href="/about" className="bg-slate-800 hover:bg-slate-700 transition-all text-slate-200 font-semibold px-8 py-3.5 rounded-xl text-base border border-slate-700">
            View tech stack
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["SSR", "Dynamic Pages"], ["SSG", "Static Pages"], ["ISR", "Revalidation"], ["REST", "Full API"]].map(([v, l]) => (
            <div key={v}>
              <div className="text-3xl font-black text-indigo-400 mb-1">{v}</div>
              <div className="text-sm text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Everything in one place</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">Built to cover every major Next.js concept from the cohort syllabus.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all group">
              <div className="text-2xl mb-4 text-indigo-400 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to get organized?</h2>
          <p className="text-indigo-200 mb-8">Create your account in seconds. No credit card required.</p>
          <Link href="/auth/register" className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl text-base hover:bg-indigo-50 transition-colors inline-block">
            Create free account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>TaskFlow · Built for Web Dev Cohort 2026 · Next.js Full Stack Assignment</p>
      </footer>
    </div>
  );
}

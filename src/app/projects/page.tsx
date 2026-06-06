// ISR - Incremental Static Regeneration with revalidation
import { getSession } from "@/lib/auth";
import { taskDb, projectDb } from "@/lib/db";
import { redirect } from "next/navigation";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const projects = projectDb.findAll(session.id);
  const projectsWithStats = projects.map((p) => {
    const tasks = taskDb.findAll(session.id, { projectId: p.id });
    return {
      ...p,
      taskCount: tasks.length,
      doneCount: tasks.filter((t) => t.status === "done").length,
      inProgressCount: tasks.filter((t) => t.status === "in_progress").length,
    };
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded px-2 py-0.5 inline-block mb-2">ISR — Revalidates every 60s</div>
          <h1 className="text-3xl font-black tracking-tight">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <CreateProjectModal />
      </div>

      {projectsWithStats.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl mb-3">◈</div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No projects yet</h3>
          <p className="text-slate-400 text-sm">Create your first project to group your tasks</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectsWithStats.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

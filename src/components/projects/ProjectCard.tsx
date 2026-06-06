"use client";
import { deleteProjectAction } from "@/lib/actions";
import { useState } from "react";

interface ProjectWithStats {
  id: string; name: string; description?: string; color: string;
  taskCount: number; doneCount: number; inProgressCount: number;
  createdAt: string;
}

export default function ProjectCard({ project }: { project: ProjectWithStats }) {
  const [loading, setLoading] = useState(false);
  const completion = project.taskCount > 0 ? Math.round((project.doneCount / project.taskCount) * 100) : 0;

  async function handleDelete() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setLoading(true);
    await deleteProjectAction(project.id);
    window.location.reload();
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: project.color }}>
            {project.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{project.name}</h3>
            {project.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{project.description}</p>}
          </div>
        </div>
        <button onClick={handleDelete} disabled={loading}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all text-xs px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
          Delete
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{project.taskCount} tasks</span>
          <span>{completion}% done</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div className="h-1.5 rounded-full transition-all" style={{ width: completion + "%", backgroundColor: project.color }} />
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{project.doneCount} done</span>
          <span className="text-blue-600 dark:text-blue-400">{project.inProgressCount} in progress</span>
          <span className="text-slate-400">{project.taskCount - project.doneCount - project.inProgressCount} todo</span>
        </div>
      </div>
    </div>
  );
}

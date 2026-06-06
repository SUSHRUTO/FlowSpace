"use client";
import { useState } from "react";
import { deleteTaskAction, updateTaskStatusAction } from "@/lib/actions";
import { Task } from "@/lib/db";

export default function TaskActions({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "cancelled", label: "Cancelled" },
  ];

  async function handleStatus(status: string) {
    setLoading(true);
    await updateTaskStatusAction(task.id, status);
    setOpen(false);
    setLoading(false);
    window.location.reload();
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setLoading(true);
    await deleteTaskAction(task.id);
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="relative flex items-center gap-1">
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs">
          ⋯
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl min-w-[150px] overflow-hidden">
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">Set Status</div>
                {statuses.map((s) => (
                  <button key={s.value} onClick={() => handleStatus(s.value)} disabled={loading || task.status === s.value}
                    className={"w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors " + (task.status === s.value ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-slate-700 dark:text-slate-300")}>
                    {s.label}
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                <button onClick={handleDelete} disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Delete task
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

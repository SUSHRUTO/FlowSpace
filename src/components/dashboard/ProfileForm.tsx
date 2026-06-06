"use client";
import { useState } from "react";
import { updateProfileAction } from "@/lib/actions";
import { User } from "@/lib/db";

export default function ProfileForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setSuccess(false); setError("");
    const result = await updateProfileAction(new FormData(e.currentTarget));
    if (result?.error) { setError(result.error); }
    else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
      {success && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl px-4 py-3">Profile updated!</div>}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
        <input name="name" defaultValue={user.name} required
          className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
        <input value={user.email} disabled
          className="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
        <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
      </div>
      <button type="submit" disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

// SSR - user-specific data
import { getSession } from "@/lib/auth";
import { taskDb, projectDb } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  const stats = taskDb.stats(session.id);
  const projectCount = projectDb.findAll(session.id).length;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(session.name)}
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{session.name}</div>
            <div className="text-slate-400 text-sm">{session.email}</div>
            <div className="text-xs text-slate-400 mt-1">Member since {new Date(session.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
          </div>
        </div>
        <ProfileForm user={session} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="font-bold mb-4">Activity Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Projects", value: projectCount },
            { label: "Total Tasks", value: stats.total },
            { label: "Completed", value: stats.done },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar user={session} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 h-14 flex items-center">
        <Link href="/" className="font-bold text-slate-900 dark:text-white">← TaskFlow</Link>
      </nav>
      {children}
    </div>
  );
}

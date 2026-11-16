import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, Lock, Activity, Key } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { env } from "@/lib/env";

export default async function AdminUsersPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const allowedEmails = env.ADMIN_EMAILS.split(",").map((e) => e.trim());

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Access & Security</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Identity & Governance</div>
            <h1 className="serif mt-1 text-3xl">Admin Users & Access Control</h1>
            <p className="mt-1 text-xs text-muted">
              Server-side role-based authorization rules, allowed administrator emails, and audit log policies.
            </p>
          </div>
        </div>

        {/* Security Alert */}
        <div className="mt-6 rounded bg-[#17212b] p-5 text-white shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c58b69]">
            <Lock size={15} /> Zero Frontend-Only Trust Policy
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/70 max-w-3xl">
            Access to all <code>/admin/*</code> routes and <code>/api/*</code> mutation handlers is strictly validated server-side against cryptographically verified Firebase session cookies and the server-side environment allowlist. Frontend route guarding is supplemented by unconditional server rejection.
          </p>
        </div>

        {/* Whitelisted Admins Table */}
        <div className="mt-8 bg-white rounded shadow-soft border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-ink">
              Authorized Administrative Accounts
            </h2>
          </div>
          <div className="divide-y divide-line">
            {allowedEmails.map((email) => {
              const isCurrent = user.email.toLowerCase() === email.toLowerCase();
              return (
                <div key={email} className="flex items-center justify-between p-4 hover:bg-[#faf9f6]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#f4f3ef] text-accent flex items-center justify-center font-bold text-xs">
                      {email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-ink">{email}</div>
                      <div className="text-[10px] text-muted">Role: Superadmin (Server Whitelist)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCurrent && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        Current Session
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <ShieldCheck size={13} /> Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

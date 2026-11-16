import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const settings = await dbService.getSiteSettings();

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Platform Settings</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-10">
        <div>
          <div className="eyebrow">Global Configuration</div>
          <h1 className="serif mt-1 text-3xl">Platform Settings & Policy</h1>
          <p className="mt-1 text-xs text-muted">
            Configure site metadata, platform currency, affiliate disclosures, and privacy consent defaults.
          </p>
        </div>

        <SettingsForm initialSettings={settings} />
      </div>
    </main>
  );
}

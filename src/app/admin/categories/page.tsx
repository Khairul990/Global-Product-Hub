import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderTree, Plus, Layers } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const categories = await dbService.getCategories();
  const products = await dbService.getProducts({ publishedOnly: false });

  // Count products per category
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Taxonomy & Categories</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Taxonomy Hierarchy</div>
            <h1 className="serif mt-1 text-3xl">Product Categories</h1>
            <p className="mt-1 text-xs text-muted">
              Organize editorial taxonomy, navigation pills, and category-level discovery filters.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          {/* Categories List */}
          <div className="bg-white rounded shadow-soft border border-line overflow-hidden">
            <div className="px-5 py-4 border-b border-line">
              <h2 className="font-semibold text-xs uppercase tracking-wider text-ink">Active Categories</h2>
            </div>
            <div className="divide-y divide-line">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 hover:bg-[#faf9f6]">
                  <div>
                    <div className="font-semibold text-sm text-ink">{c.name}</div>
                    <div className="text-[10px] text-muted font-mono">slug: /{c.slug} · order: #{c.order}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-[#f4f3ef] px-2.5 py-1 text-xs font-medium text-ink">
                      {counts[c.name] || 0} products
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <CategoryManager />
        </div>
      </div>
    </main>
  );
}

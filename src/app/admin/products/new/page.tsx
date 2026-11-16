import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const user = await getServerAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  const categories = await dbService.getCategories();
  const merchants = await dbService.getMerchants();

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/admin/products" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Products
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">New Considered Find</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-10">
        <div>
          <div className="eyebrow">Inventory Addition</div>
          <h1 className="serif mt-1 text-3xl">Add New Product</h1>
          <p className="mt-1 text-xs text-muted">
            Configure verified pricing, country availability, and authenticated retailer affiliate links.
          </p>
        </div>

        <ProductForm categories={categories} merchants={merchants} />
      </div>
    </main>
  );
}

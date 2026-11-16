"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { DbProduct } from "@/types/database";

export default function ProductActions({ product }: { product: DbProduct }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublished = async () => {
    setLoading(true);
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !product.published }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={togglePublished}
        disabled={loading}
        title={product.published ? "Unpublish item" : "Publish item"}
        className="rounded p-1.5 text-muted hover:bg-neutral-100 hover:text-ink transition"
      >
        {product.published ? <EyeOff size={14} /> : <Eye size={14} className="text-emerald-600" />}
      </button>

      <Link
        href={`/products/${product.slug}`}
        target="_blank"
        title="View public page"
        className="rounded p-1.5 text-muted hover:bg-neutral-100 hover:text-ink transition"
      >
        <ExternalLink size={14} />
      </Link>

      <Link
        href={`/admin/products/${product.id}/edit`}
        title="Edit item"
        className="rounded p-1.5 text-muted hover:bg-neutral-100 hover:text-ink transition"
      >
        <Edit size={14} />
      </Link>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="Delete item"
        className="rounded p-1.5 text-muted hover:bg-red-50 hover:text-red-600 transition"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

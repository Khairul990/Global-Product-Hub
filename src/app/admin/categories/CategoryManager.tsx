"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderPlus, AlertCircle } from "lucide-react";

export default function CategoryManager() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          order: 99,
          active: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      setName("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow-soft border border-line p-6 h-fit">
      <div className="flex items-center gap-2 text-ink font-semibold text-sm">
        <FolderPlus size={16} className="text-accent" /> Add New Category
      </div>
      <p className="mt-1 text-xs text-muted">Categories define public discovery menus and filters.</p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink">Category Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Travel & Luggage"
            className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">Description (Optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Considered items for transit and voyages."
            className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center !py-2.5 text-xs flex items-center gap-2"
        >
          <Plus size={14} /> {loading ? "Adding..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, CheckCircle2, XCircle, Save, AlertCircle } from "lucide-react";
import { DbAdSlot } from "@/types/database";

export default function AdSlotManager({ initialSlots }: { initialSlots: DbAdSlot[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState<DbAdSlot[]>(initialSlots);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const toggleSlotActive = async (slot: DbAdSlot) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/ads/${slot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !slot.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, active: !s.active } : s)));
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Failed to toggle slot");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHtml = async (slotId: string) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/ads/${slotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: htmlContent.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, htmlContent: htmlContent.trim() } : s)));
      setEditingId(null);
      setMsg("Saved slot creative successfully");
      setTimeout(() => setMsg(null), 3000);
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Failed to update HTML");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {msg && (
        <div className="rounded bg-neutral-800 p-3 text-xs text-white">
          {msg}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const isEditing = editingId === slot.id;

          return (
            <div key={slot.id} className="bg-white p-5 rounded shadow-soft border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-[#f4f3ef] px-2 py-0.5 text-[10px] font-mono text-muted uppercase">
                    {slot.slug}
                  </span>
                  <button
                    onClick={() => toggleSlotActive(slot)}
                    disabled={loading}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                      slot.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {slot.active ? "Active" : "Disabled"}
                  </button>
                </div>

                <h3 className="mt-3 text-base font-semibold text-ink">{slot.name}</h3>
                <div className="mt-1 text-xs text-muted">Format: {slot.format}</div>
                <div className="mt-1 text-[11px] text-muted">
                  Consent Required: {slot.requireConsent ? "Yes (GDPR Gated)" : "No"}
                </div>

                {isEditing ? (
                  <div className="mt-4">
                    <label className="block text-[11px] font-semibold text-ink">Custom Snippet / Partner HTML</label>
                    <textarea
                      rows={3}
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<div>Partner Ad Content</div>"
                      className="mt-1 w-full rounded border border-line p-2 text-xs font-mono focus:border-ink focus:outline-none"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleSaveHtml(slot.id)}
                        disabled={loading}
                        className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1"
                      >
                        <Save size={12} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-secondary !py-1.5 !px-3 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-muted">
                    {slot.htmlContent ? (
                      <span className="text-emerald-700 font-mono">Custom HTML snippet configured</span>
                    ) : (
                      <span className="text-neutral-400">Default brand placeholder</span>
                    )}
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="mt-5 pt-3 border-t border-line flex justify-end">
                  <button
                    onClick={() => {
                      setEditingId(slot.id);
                      setHtmlContent(slot.htmlContent || "");
                    }}
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    Edit Creative Snippet
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

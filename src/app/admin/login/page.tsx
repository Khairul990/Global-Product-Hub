"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (auth) {
        // Live Firebase Auth Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, email }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to establish admin session");
        }
      } else {
        // Fallback / Demo Flow when Firebase keys not set in env
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email || "admin@globalproducthub.com", isDemo: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Demo authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Invalid credentials or unauthorized account.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@globalproducthub.com", isDemo: true }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Demo login failed");
      }
    } catch (err: any) {
      setError(err?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="text-2xl font-bold tracking-tight">GLOBAL<span className="text-accent">.</span></div>
            <div className="text-[10px] tracking-[.25em] text-muted">CONTROL ROOM</div>
          </Link>
          <h2 className="serif mt-6 text-3xl font-semibold text-ink">Admin Sign In</h2>
          <p className="mt-2 text-xs text-muted">Authorized editorial and commerce personnel only</p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 shadow-soft sm:rounded-lg sm:px-10 border border-line">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <div>{error}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@globalproducthub.com"
                  className="w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Admin"}
              <ArrowRight size={15} className="ml-2" />
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-6">
            <div className="rounded bg-[#f7f7f4] p-4 text-xs">
              <div className="flex items-center gap-2 font-semibold text-ink">
                <Sparkles size={14} className="text-accent" /> Quick Evaluation Mode
              </div>
              <p className="mt-1 text-muted leading-relaxed">
                No Firebase credentials configured yet? Test all admin functionality using verified demo credentials:
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="btn-secondary mt-3 w-full justify-center bg-white hover:bg-neutral-50"
              >
                Sign In as Demo Superadmin
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted">
            <ShieldCheck size={14} className="text-accent" />
            <span>Strict server-side session authentication</span>
          </div>
        </div>
      </div>
    </main>
  );
}

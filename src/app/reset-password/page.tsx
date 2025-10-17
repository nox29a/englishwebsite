"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      });

      if (error) throw error;

      setSuccessMsg(
        "Wysłaliśmy instrukcje resetowania hasła. Sprawdź swoją skrzynkę e-mail."
      );
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Nie udało się wysłać instrukcji resetowania hasła.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-4 py-16">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1D4ED8]/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-24 translate-y-20 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-lg flex-col items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(3,7,18,0.65)] backdrop-blur-2xl">
            <button
              onClick={() => router.push("/login")}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Powrót do logowania
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D4ED8]/80 to-[#1E3A8A]/80 text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-semibold tracking-wide text-slate-100">Resetuj hasło</h2>
              <p className="mt-3 text-base text-slate-400">
                Podaj adres e-mail powiązany z Twoim kontem, a wyślemy instrukcje resetu.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Adres email"
                  value={email}
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 pl-14 text-base text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />
              </div>

              {errorMsg && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200 backdrop-blur">
                  <p className="text-center font-medium">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200 backdrop-blur">
                  <p className="text-center font-medium">{successMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-4 text-lg font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554] hover:shadow-[0_20px_40px_rgba(29,78,216,0.35)] disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Wysyłanie...
                  </div>
                ) : (
                  "Wyślij instrukcje"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

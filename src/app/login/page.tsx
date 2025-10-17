"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun, Chrome, Mail, Lock, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Na początku komponentu LoginPage dodaj:
  useEffect(() => {
    // Sprawdź parametry URL pod kątem błędów
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      setErrorMsg(error)
    }
  }, [])

  // Zapobiegaj hydratacji until theme is loaded
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`, // wraca od razu na stronę główną
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Nie udało się zalogować przez Google.");
      setGoogleLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black flex items-center justify-center px-4 py-16">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-24 translate-y-24 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_25px_80px_rgba(3,7,18,0.65)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.01]">
            <div className="text-center mb-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D4ED8]/80 to-[#1E3A8A]/80 text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-wide text-slate-100">Zaloguj się</h2>
              <p className="mt-3 text-base text-slate-400">Wróć do nauki i rozwijaj swoje umiejętności</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Adres email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 pl-14 text-base text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 pl-14 text-base text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="/reset-password"
                  className="text-sm font-medium text-[#60A5FA] transition hover:text-[#93C5FD]"
                >
                  Zapomniałeś hasła?
                </a>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200 backdrop-blur">
                  <p className="text-center font-medium">{errorMsg}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-4 text-lg font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554] hover:shadow-[0_20px_40px_rgba(29,78,216,0.35)] disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Logowanie...
                  </div>
                ) : (
                  "Zaloguj się"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1 text-slate-400 backdrop-blur">
                  Lub kontynuuj z
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-100 transition hover:bg-white/10 disabled:opacity-70"
            >
              <Chrome className="h-6 w-6 text-[#1D4ED8]" />
              {googleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Przekierowanie...
                </div>
              ) : (
                "Kontynuuj przez Google"
              )}
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="mb-4 text-slate-400">
                Nie masz konta?{" "}
                <a
                  href="/register"
                  className="font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/50 underline-offset-4 transition hover:text-[#60A5FA]"
                >
                  Zarejestruj się
                </a>
              </p>
            </div>

            {/* Theme Toggle */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                aria-label="Przełącz motyw"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6 text-amber-300" />
                ) : (
                  <Moon className="h-6 w-6 text-[#1D4ED8]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
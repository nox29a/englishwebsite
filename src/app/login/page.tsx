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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-indigo-400/30 rounded-full animate-bounce"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Main Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15">
            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Zaloguj się
              </h2>
              <p className="text-gray-300">Wróć do nauki i rozwijaj swoje umiejętności</p>
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
                  className="w-full pl-14 pr-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20"
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
                  className="w-full pl-14 pr-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
                  <p className="text-red-300 font-medium text-center">{errorMsg}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:transform-none disabled:shadow-none text-lg"
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
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full border border-white/10">
                  Lub kontynuuj z
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105 font-medium text-lg flex items-center justify-center disabled:opacity-70 disabled:transform-none"
            >
              <Chrome className="w-6 h-6 mr-3" />
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
            <div className="text-center mt-8">
              <p className="text-gray-300 mb-4">
                Nie masz konta?{" "}
                <a 
                  href="/register" 
                  className="text-purple-400 font-bold hover:text-purple-300 transition-colors underline decoration-purple-400/50 hover:decoration-purple-300"
                >
                  Zarejestruj się
                </a>
              </p>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-110 flex items-center justify-center"
                aria-label="Przełącz motyw"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-purple-400" />
                )}
              </button>
            </div>
          </div>

          {/* Additional Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30 animate-bounce"></div>
        </div>
      </div>
    </>
  );
}
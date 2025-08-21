"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun, Chrome } from "lucide-react";
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

// W pliku LoginPage, dodaj useEffect do sprawdzania sesji

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
            Zaloguj się
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Adres email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition"
            />

            <input
              type="password"
              placeholder="Hasło"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition"
            />

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition font-semibold"
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Lub kontynuuj z
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition shadow-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 mr-2" />
              {googleLoading ? "Przekierowanie..." : "Kontynuuj przez Google"}
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
            Nie masz konta?{" "}
            <a 
              href="/register" 
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              Zarejestruj się
            </a>
          </p>

          {/* Przełącznik motywu */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Przełącz motyw"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
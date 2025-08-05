"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreed) {
      setErrorMsg("Musisz zaakceptować regulamin.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            first_name: firstName,
            last_name: lastName,
          },
        ]);

      if (profileError) {
        setErrorMsg("Błąd przy tworzeniu profilu: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Załóż konto
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Imię"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Nazwisko"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <input
            type="email"
            placeholder="Adres email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Hasło"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Powtórz hasło"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="accent-indigo-600"
            />
            <span>
              Akceptuję{" "}
              <a href="/regulamin" className="underline text-indigo-600 hover:text-indigo-800">
                regulamin
              </a>
            </span>
          </label>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            {loading ? "Rejestruję..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Masz już konto?{" "}
          <a href="/login" className="text-indigo-600 underline hover:text-indigo-800">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Walidacja
    if (!formData.agreed) {
      setErrorMsg("Musisz zaakceptować regulamin.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Hasła nie są identyczne.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);

    try {
      // 1. Rejestracja użytkownika
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (error) throw error;

      // 2. Dodatkowe dane profilowe (jeśli potrzebne)
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
           
          });

        if (profileError) throw profileError;
      }

      // 3. Weryfikacja email
      if (data.user?.identities?.length === 0) {
        setErrorMsg("Użytkownik już istnieje. Spróbuj zalogować się.");
        setLoading(false);
        return;
      }

      // 4. Przekierowanie po sukcesie
      router.push("/verify-email"); // Nowa strona z informacją o weryfikacji
    } catch (error: any) {
      setErrorMsg(error.message || "Wystąpił błąd podczas rejestracji");
      setLoading(false);
    }
  };

  return (
          <>
          <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Załóż konto
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              type="text"
              placeholder="Imię"
              value={formData.firstName}
              required
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Nazwisko"
              value={formData.lastName}
              required
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Adres email"
            value={formData.email}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Hasło (min. 6 znaków)"
            value={formData.password}
            required
            minLength={6}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Powtórz hasło"
            value={formData.confirmPassword}
            required
            minLength={6}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              name="agreed"
              type="checkbox"
              checked={formData.agreed}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            <span>
              Akceptuję{" "}
              <a href="/regulamin" className="underline text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400">
                regulamin
              </a>
            </span>
          </label>

          {errorMsg && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl transition font-semibold ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {loading ? "Rejestruję..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Masz już konto?{" "}
          <a href="/login" className="text-indigo-600 underline hover:text-indigo-800 dark:hover:text-indigo-400">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-4 py-16">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#1D4ED8]/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] translate-x-20 translate-y-16 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(3,7,18,0.65)] backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold tracking-wide text-slate-100">Załóż konto</h2>
              <p className="mt-2 text-sm text-slate-400">
                W kilka minut dołączysz do AxonAI i zyskasz dostęp do spersonalizowanej nauki.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="firstName"
                  type="text"
                  placeholder="Imię"
                  value={formData.firstName}
                  required
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Nazwisko"
                  value={formData.lastName}
                  required
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder="Adres email"
                value={formData.email}
                required
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
              />

              <input
                name="password"
                type="password"
                placeholder="Hasło (min. 6 znaków)"
                value={formData.password}
                required
                minLength={6}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                required
                minLength={6}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
              />

              <label className="flex items-center gap-3 text-sm text-slate-400">
                <input
                  name="agreed"
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border border-white/20 bg-black/40 text-[#1D4ED8] focus:ring-[#1D4ED8]/60"
                />
                <span>
                  Akceptuję{" "}
                  <a
                    href="/regulamin"
                    className="font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/50 underline-offset-4 hover:text-[#60A5FA]"
                  >
                    regulamin
                  </a>
                </span>
              </label>

              {errorMsg && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200 backdrop-blur">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_15px_45px_rgba(29,78,216,0.45)] transition hover:from-[#1E40AF] hover:to-[#172554] disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
              >
                {loading ? "Rejestruję..." : "Zarejestruj się"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Masz już konto?{" "}
              <a
                href="/login"
                className="font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/50 underline-offset-4 hover:text-[#60A5FA]"
              >
                Zaloguj się
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
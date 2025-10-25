"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";
import Navbar from "@/components/Navbar";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // hasło
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          if (isAuthSessionMissingError(error)) {
            setLoading(false);
            return;
          }
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        if (!user) {
          setErrorMsg("Brak zalogowanego użytkownika.");
          setLoading(false);
          return;
        }

        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          setErrorMsg(profileError.message);
        } else if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
        }
      } catch (err: unknown) {
        if (!isAuthSessionMissingError(err)) {
          const message = err instanceof Error ? err.message : String(err ?? "Nieoczekiwany błąd.");
          setErrorMsg(message || "Nieoczekiwany błąd.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveChanges = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", user.id);

    if (error) {
      setErrorMsg(error.message);
      setSuccessMsg("");
    } else {
      setErrorMsg("");
      setSuccessMsg("✅ Dane zostały zapisane pomyślnie.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // jeśli konto przez Google → nie pozwól zmienić
    if (user.app_metadata?.provider === "google") {
      setPasswordMsg(
        "🔒 Konto Google – hasło jest zarządzane przez Google, nie możesz go zmienić tutaj."
      );
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg("Nowe hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg("❌ " + error.message);
    } else {
      setPasswordMsg("✅ Hasło zostało zmienione.");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;
  if (!user) return <p>Musisz być zalogowany, aby edytować profil.</p>;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-24 translate-y-20 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-2xl space-y-10 text-slate-100">
          <header className="text-center">
            <h1 className="text-3xl font-semibold tracking-wide">Ustawienia konta</h1>
            <p className="mt-3 text-sm text-slate-400">
              Aktualizuj swoje dane i zarządzaj bezpieczeństwem w jednym miejscu.
            </p>
          </header>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(3,7,18,0.65)] backdrop-blur-2xl">
            <div className="space-y-8">
              {/* Dane profilu */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">Dane osobowe</h2>

                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Imię"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />

                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nazwisko"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                />

                <button
                  onClick={saveChanges}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_15px_45px_rgba(29,78,216,0.45)] transition hover:from-[#1E40AF] hover:to-[#172554]"
                >
                  Zapisz zmiany
                </button>

                {successMsg && <p className="text-sm text-emerald-300">{successMsg}</p>}
              </section>

              {/* Zmiana hasła */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">Zmiana hasła</h2>

                {user.app_metadata?.provider === "google" ? (
                  <p className="text-sm text-slate-400">
                    🔒 Zalogowałeś się przez Google – zmiana hasła dostępna jest tylko w ustawieniach konta Google.
                  </p>
                ) : (
                  <>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Aktualne hasło"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                    />

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nowe hasło"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
                    />

                    <button
                      onClick={handlePasswordChange}
                      className="w-full rounded-2xl bg-[#1D4ED8]/20 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-[#1D4ED8]/30"
                    >
                      Zmień hasło
                    </button>
                  </>
                )}

                {passwordMsg && <p className="text-sm text-slate-300">{passwordMsg}</p>}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

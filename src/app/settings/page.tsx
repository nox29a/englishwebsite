"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
      } catch (err: any) {
        setErrorMsg(err.message || "Nieoczekiwany błąd.");
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
    <div className="max-w-lg mx-auto p-8 bg-gray-900 text-gray-100 rounded-2xl shadow-2xl space-y-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-400">Ustawienia konta</h1>

      {/* Dane profilu */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-indigo-300">Dane osobowe</h2>

        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Imię"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nazwisko"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

        <button
          onClick={saveChanges}
          className="w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
          Zapisz zmiany
        </button>

        {successMsg && <p className="text-green-400">{successMsg}</p>}
      </div>

      {/* Zmiana hasła */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-indigo-300">Zmiana hasła</h2>

        {user.app_metadata?.provider === "google" ? (
            <p className="text-gray-400 text-sm">
            🔒 Zalogowałeś się przez Google – zmiana hasła dostępna jest tylko w
            ustawieniach konta Google.
          </p>
        ) : (
            <>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Aktualne hasło"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nowe hasło"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            <button
              onClick={handlePasswordChange}
              className="w-full bg-pink-600 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
              >
              Zmień hasło
            </button>
          </>
        )}

        {passwordMsg && <p className="text-sm">{passwordMsg}</p>}
      </div>
    </div>
        </>
  );
}

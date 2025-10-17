// pages/kontakt.tsx
"use client"
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/navigation/PageHeader";
import Link from "next/link";
import { useState } from "react";

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[var(--page-gradient-from)] to-[var(--page-gradient-to)] text-[var(--foreground)] px-6 py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
          <PageHeader
            title="Skontaktuj się z AxonAI"
            description="Odpowiadamy w ciągu jednego dnia roboczego. Wybierz formę kontaktu, która najlepiej pasuje do Twoich potrzeb."
            anchors={[
              { href: "#formularz", label: "Formularz" },
              { href: "#inne-formy", label: "Inne formy kontaktu" },
            ]}
          />

          <section
            id="formularz"
            className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur md:grid-cols-[1.2fr_1fr]"
          >
            <form className="space-y-6" aria-labelledby="contact-heading">
              <div className="space-y-2">
                <h2 id="contact-heading" className="text-2xl font-semibold text-white">
                  Formularz kontaktowy
                </h2>
                <p className="text-sm text-indigo-100/80">
                  Wypełnij pola poniżej. Jeśli wolisz spotkanie online, napisz o dogodnych godzinach.
                </p>
              </div>
              <div className="space-y-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-indigo-100/90">
                  Imię i nazwisko
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border border-white/10 bg-indigo-950/60 px-4 py-3 text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-indigo-100/90">
                  Adres e-mail
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border border-white/10 bg-indigo-950/60 px-4 py-3 text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-indigo-100/90">
                  Wiadomość
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="rounded-xl border border-white/10 bg-indigo-950/60 px-4 py-3 text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3 text-sm font-semibold text-indigo-950 shadow-lg transition hover:from-emerald-300 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              >
                Wyślij wiadomość
              </button>
            </form>

            <aside className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-indigo-900/60 p-6 text-sm text-indigo-100/80">
              <div>
                <h3 className="text-lg font-semibold text-white">Szybki kontakt</h3>
                <p className="mt-2">support@axonai.pl</p>
                <p className="text-xs text-indigo-100/60">Odpowiadamy od poniedziałku do piątku w godzinach 9:00–17:00.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Częste pytania</h3>
                <p className="mt-2">
                  Zanim napiszesz, zobacz sekcję <Link href="/pricing" className="underline decoration-emerald-300/60 underline-offset-4 hover:text-white">Cennik</Link> lub nasze <Link href="/regulamin" className="underline decoration-emerald-300/60 underline-offset-4 hover:text-white">regulaminy</Link>.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Społeczność</h3>
                <p className="mt-2">
                  Dołącz do naszej grupy na Discordzie i ucz się z innymi. Link otrzymasz po rejestracji konta.
                </p>
              </div>
            </aside>
          </section>

          <section
            id="inne-formy"
            className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-indigo-100/80 shadow-xl backdrop-blur md:grid-cols-3"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">Wsparcie techniczne</h3>
              <p>
                Masz problem z logowaniem lub płatnością? Odwiedź panel <Link href="/settings" className="underline decoration-emerald-300/60 underline-offset-4 hover:text-white">Ustawienia</Link> i sprawdź poradniki krok po kroku.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">Partnerstwa</h3>
              <p>
                Chcesz wdrożyć AxonAI w swojej szkole? Napisz w temacie wiadomości „Partnerstwo” – przygotujemy ofertę demo.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">Media i PR</h3>
              <p>
                Szukasz materiałów prasowych? Skontaktuj się z nami i otrzymaj pakiet brandingowy oraz historię projektu.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

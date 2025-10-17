"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-4 py-16 text-slate-100">
        <div className="pointer-events-none absolute -top-20 -left-32 h-72 w-72 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#1E3A8A]/20 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-10 text-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_15px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#1D4ED8]/30 bg-[#1D4ED8]/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-slate-200">
              <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
              Weryfikacja
            </div>
            <h2 className="text-3xl font-bold tracking-wide text-slate-100">
              Potwierdź swój adres email
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Wysłaliśmy wiadomość z linkiem aktywacyjnym. Kliknij w niego, aby ukończyć proces rejestracji i uzyskać dostęp do wszystkich funkcji AxonAI.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-[#1D4ED8]/20 bg-[#1D4ED8]/10 p-6 text-left text-slate-200">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Nie widzisz wiadomości?
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>Sprawdź folder spam lub oferty.</li>
                <li>Dodaj nadawcę do zaufanych kontaktów.</li>
                <li>Wyślij prośbę o nowy link weryfikacyjny z poziomu aplikacji.</li>
              </ul>
            </div>

            <Link
              href="/"
              className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-3 text-base font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/50"
            >
              Przejdź do strony głównej
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            Masz już konto?{" "}
            <Link href="/login" className="font-semibold text-[#1D4ED8] transition hover:text-[#1E40AF]">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

type CheckoutState = "loading" | "ready" | "anonymous" | "premium";

type Feature = {
  title: string;
  description: string;
};

const PREMIUM_FEATURES: Feature[] = [
  {
    title: "Pełny dostęp do AxonAI",
    description: "Odblokuj wszystkie ćwiczenia, moduły AI oraz rozszerzone plany nauki.",
  },
  {
    title: "Zaawansowane analizy",
    description: "Otrzymuj raporty postępów i rekomendacje ćwiczeń dopasowane do Twojego stylu nauki.",
  },
  {
    title: "Wsparcie 24/7",
    description: "Skorzystaj z natychmiastowej pomocy native speakerów AI zawsze wtedy, gdy jej potrzebujesz.",
  },
];

export default function PremiumPage() {
  const [state, setState] = useState<CheckoutState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Nie udało się pobrać użytkownika:", error);
          setError("Nie udało się pobrać danych konta. Spróbuj ponownie później.");
        }
        setState("anonymous");
        return;
      }

      if (!user) {
        setState("anonymous");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (profile?.user_type?.toLowerCase() === "premium") {
        setState("premium");
        return;
      }

      setState("ready");
    };

    fetchProfile();
  }, []);

  const handleCheckout = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Nie udało się rozpocząć płatności." }));
        throw new Error(payload.error || "Nie udało się rozpocząć płatności.");
      }

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }

      throw new Error("Nie otrzymano adresu płatności.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.";
      setError(message);
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    if (state === "loading") {
      return <p className="text-slate-300">Ładujemy dane konta...</p>;
    }

    if (state === "anonymous") {
      return (
        <div className="space-y-6 text-center">
          <p className="text-lg text-slate-300">
            Aby przejść na plan Premium musisz się najpierw zalogować lub założyć konto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-8 py-3 text-base font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554]"
            >
              <Link href="/login">Zaloguj się</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-2xl border-white/15 bg-white/5 px-8 py-3 text-base font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <Link href="/register">Załóż konto</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (state === "premium") {
      return (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-emerald-300">Dziękujemy! Twoje konto jest już Premium.</h2>
          <p className="text-slate-300">
            Możesz od razu przejść do panelu, aby wykorzystać nowe funkcje AxonAI.
          </p>
          <Button
            asChild
            className="rounded-2xl bg-emerald-500 px-8 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Link href="/dashboard">Przejdź do panelu</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          {PREMIUM_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(3,7,18,0.45)] backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-slate-100">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-2xl border border-red-500/40 bg-red-500/15 p-4 text-sm text-red-200 backdrop-blur">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_30px_80px_rgba(3,7,18,0.6)] backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-slate-100">AxonAI Premium</h2>
          <p className="text-5xl font-extrabold text-slate-100">
            14,99 zł <span className="text-lg font-semibold text-slate-400">/ mies.</span>
          </p>
          <p className="text-slate-300">
            Płatność odnawiana automatycznie. Możesz zrezygnować w dowolnym momencie.
          </p>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-10 py-4 text-lg font-semibold text-slate-100 shadow-[0_15px_45px_rgba(29,78,216,0.45)] transition hover:from-[#1E40AF] hover:to-[#172554]"
          >
            {isProcessing ? "Przekierowujemy do Stripe..." : "Przejdź na Premium"}
          </Button>
          <p className="text-xs text-slate-400">
            Klikając przycisk zostaniesz przekierowany do bezpiecznej płatności Stripe.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1D4ED8]/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-32 translate-y-16 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12">
          <header className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold tracking-wide md:text-5xl">Ulepsz naukę z AxonAI Premium</h1>
            <p className="text-lg text-slate-300 md:text-xl">
              Inteligentne narzędzia, personalizowane wskazówki i nieograniczony dostęp do konwersacji AI.
            </p>
          </header>

          {renderContent()}
        </div>
      </div>
    </>
  );
}

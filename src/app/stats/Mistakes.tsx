"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";

import { statsCardClass, subtleTextClass } from "./cardStyles";

interface MistakeSummary {
  incorrect: number;
  total: number;
}

export default function Mistakes() {
  const [summary, setSummary] = useState<MistakeSummary>({ incorrect: 0, total: 0 });

  useEffect(() => {
    const fetchMistakes = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Nie udało się pobrać sesji użytkownika:", error);
        }
        return;
      }

      if (!user) return;

      const { data, error: mistakesError } = await supabase
        .from("answer_events")
        .select("is_correct")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(500);

      if (mistakesError || !data?.length) return;

      const incorrect = data.filter((attempt) => !attempt.is_correct).length;

      setSummary({ incorrect, total: data.length });
    };

    fetchMistakes();
  }, []);

  const accuracy = summary.total > 0 ? Math.round(((summary.total - summary.incorrect) / summary.total) * 100) : 0;

  return (
    <Card className={`${statsCardClass} gap-6`}>
      <div>
        <h2 className="text-xl font-semibold tracking-wide">Analiza błędów</h2>
        <p className={subtleTextClass}>Szybki przegląd najczęstszych potknięć i rekomendacje dalszych działań.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Błędne odpowiedzi</p>
          <p className="mt-2 text-3xl font-semibold text-[#F87171]">{summary.incorrect}</p>
          <p className="text-xs text-slate-400">odpowiedzi wymagają powtórki</p>
        </div>
        <div className="rounded-xl border border-[#1D4ED8]/40 bg-[#1D4ED8]/15 p-4 text-slate-100">
          <p className="text-xs uppercase tracking-[0.3em] text-[#93C5FD]">Skuteczność</p>
          <p className="mt-2 text-3xl font-semibold">{accuracy}%</p>
          <p className="text-xs text-slate-300">ogólny wynik poprawności</p>
        </div>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>Przejrzyj pytania z niską skutecznością w zakładce powtórek.</li>
        <li>Ustal plan powtórek co 2-3 dni, aby utrwalić nowe informacje.</li>
        <li>Wykorzystaj tryb ćwiczeń tematycznych, by skupić się na słabszych obszarach.</li>
      </ul>
    </Card>
  );
}

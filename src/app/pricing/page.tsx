import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/navigation/PageHeader";
import Link from "next/link";

const plans = [
  {
    name: "Darmowy",
    price: "0 zł / mies.",
    features: [
      "Podstawowe lekcje AI",
      "Ćwiczenia z czasów gramatycznych",
      "Fiszki (do 1000 słów)",
      "Śledzenie postępów",
    ],
    cta: "Rozpocznij za darmo",
    href: "/register",
    badge: "Start",
  },
  {
    name: "Premium",
    price: "14.99 zł / mies.",
    features: [
      "Dostęp do wszystkich narzędzi",
      "Native speakerzy AI 24/7",
      "Podsumowania nauki",
      "Zaawansowane analizy postępów",
      "Priorytetowe wsparcie",
    ],
    cta: "Wybierz Premium",
    href: "/premium",
    badge: "Najpopularniejszy",
  },
];

const FAQ = [
  {
    question: "Czy mogę zmienić plan w dowolnym momencie?",
    answer: "Tak. W ustawieniach konta możesz przejść z planu darmowego na premium i odwrotnie, a zmiany aktywują się natychmiast.",
  },
  {
    question: "Czy oferujecie zniżki dla szkół lub firm?",
    answer: "Tak, napisz do nas poprzez formularz kontaktowy. Przygotujemy spersonalizowaną wycenę dla zespołów od 10 osób.",
  },
  {
    question: "Jak działa okres próbny?",
    answer: "Po aktywacji konta premium masz 7 dni na rezygnację bez podawania przyczyny. Wszystkie materiały pozostają dostępne do końca miesiąca.",
  },
];

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black py-16 px-6 text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-48 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#1D4ED8]/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-24 translate-y-20 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16">
          <PageHeader
            title="Plany subskrypcji AxonAI"
            description="Wybierz wariant, który najlepiej odpowiada Twoim celom. Możesz rozpocząć od planu darmowego i w dowolnym momencie przejść na premium."
            anchors={[
              { href: "#plany", label: "Porównanie planów" },
              { href: "#faq", label: "FAQ" },
            ]}
          />

          <section id="plany" className="space-y-8 text-center">
            <div className="mx-auto max-w-3xl space-y-3 text-slate-300">
              <h2 className="text-3xl font-semibold text-slate-100">Porównanie planów</h2>
              <p>
                Każdy plan zawiera dostęp do podstawowych modułów AxonAI. Plan premium rozszerza je o personalizowane rekomendacje i rozbudowane statystyki.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className="h-full rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(3,7,18,0.6)] backdrop-blur-xl transition-transform hover:scale-[1.02]"
                >
                  <CardContent className="flex h-full flex-col gap-8 p-8 text-left">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold text-slate-100">{plan.name}</h3>
                        {plan.badge && (
                          <span className="rounded-full bg-[#1D4ED8]/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#60A5FA]">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-4xl font-bold text-slate-100">{plan.price}</p>
                      <ul className="space-y-3 text-sm text-slate-300">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#60A5FA]" aria-hidden="true" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-3 text-sm font-semibold text-slate-100 shadow-[0_12px_35px_rgba(29,78,216,0.45)] transition hover:from-[#1E40AF] hover:to-[#172554]"
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            id="faq"
            className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-[0_25px_80px_rgba(3,7,18,0.55)] backdrop-blur-xl md:grid-cols-2"
            aria-labelledby="faq-heading"
          >
            <div className="space-y-4">
              <h2 id="faq-heading" className="text-3xl font-semibold text-slate-100">
                Najczęstsze pytania
              </h2>
              <p className="text-sm text-slate-400">
                Nie znalazłeś odpowiedzi? Skontaktuj się z nami bezpośrednio przez <Link href="/contact" className="text-[#60A5FA] underline decoration-[#60A5FA]/50 underline-offset-4 hover:text-[#93C5FD]">formularz kontaktowy</Link>.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              {FAQ.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
                  <summary className="cursor-pointer text-base font-semibold text-slate-100">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

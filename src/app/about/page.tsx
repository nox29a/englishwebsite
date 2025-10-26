import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/navigation/PageHeader";

const HIGHLIGHTS = [
  {
    title: "Projekt zrodzony z potrzeby",
    description:
      "AxonAI powstało, gdy szukałem sposobu na uporządkowaną naukę angielskiego dla siebie. Każdy moduł odzwierciedla realne wyzwania, z którymi mierzyłem się w codziennej nauce.",
    id: "misja-poczatek",
  },
  {
    title: "Społeczność, która rośnie",
    description:
      "Po pierwszych tygodniach udostępniłem prototyp znajomym. Do dziś to ich sugestie oraz potrzeby kolejnych użytkowników decydują o kierunku rozwoju platformy.",
    id: "spolecznosc",
  },
  {
    title: "Kod tworzony w vibe-codingu",
    description:
      "Większość funkcji powstała przy pomocy vibe-codingu — swobodnych sesji tworzenia z AI, które pozwoliły szybko eksperymentować i dopracowywać doświadczenie nauki.",
    id: "vibe-coding",
  },
];

const TIMELINE = [
  {
    year: "2022",
    title: "Potrzebuję własnego narzędzia",
    description: "Powstaje prywatny zestaw ćwiczeń, który ma pomóc mi przełamać barierę w mówieniu po angielsku.",
  },
  {
    year: "2023",
    title: "Dzielę się z innymi",
    description: "Znajomi proszą o dostęp do aplikacji, a ich feedback pozwala uporządkować ścieżki i materiały.",
  },
  {
    year: "2024",
    title: "Vibe-coding napędza rozwój",
    description: "Wspólnie z AI dopracowujemy kolejne moduły i automatyzujemy powtórki, dzięki czemu społeczność rośnie szybciej niż kiedykolwiek.",
  },
];

export default function ONas() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[var(--page-gradient-from)] to-[var(--page-gradient-to)] text-[var(--foreground)] px-6 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
          <PageHeader
            title="Poznaj AxonAI"
            description="Zaczęło się od mojej potrzeby nauki angielskiego. Zbudowałem narzędzie dla siebie, a dziś korzystają z niego tysiące osób."
            anchors={[
              { href: "#misja", label: "Misja i wartości" },
              { href: "#zespol", label: "Zespół" },
              { href: "#technologia", label: "Technologia" },
              { href: "#historia", label: "Historia" },
            ]}
          />

          <section id="misja" className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl backdrop-blur">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Dlaczego powstało AxonAI?</h2>
              <p className="text-lg text-indigo-100/80">
                Szukałem sposobu, by uczyć się angielskiego konsekwentnie i bez poczucia chaosu. Brakowało mi narzędzia, które łączy plan,
                natychmiastową informację zwrotną i motywujący rytm nauki. AxonAI jest odpowiedzią na te potrzeby — najpierw moją, a teraz również Twoją.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {HIGHLIGHTS.map((highlight) => (
                <article
                  key={highlight.id}
                  id={highlight.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-indigo-900/60 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                  <p className="text-sm text-indigo-100/80">{highlight.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="zespol"
            className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl backdrop-blur md:grid-cols-[1.2fr_1fr]"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ludzie, którzy stoją za AxonAI</h2>
              <p className="text-lg text-indigo-100/80">
                Projekt wciąż prowadzi osoba, która stworzyła go dla siebie, ale jego rozwój jest efektem pracy wielu wolontariuszy, mentorów
                i testerów. Każda nowa funkcja zaczyna się od rzeczywistego wyzwania z nauki i kończy na wspólnej iteracji z użytkownikami.
              </p>
              <ul className="grid gap-3 text-sm text-indigo-100/90">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                  Dedykowany opiekun ścieżki na poziomie premium, który pomaga ustalić plan działania.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                  Konsultacje z lingwistami dbającymi o poprawność materiałów i przykładów.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                  Regularne badania użytkowników, na podstawie których wprowadzamy nowe funkcje.
                </li>
              </ul>
            </div>
            <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-indigo-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">Chcesz do nas dołączyć?</h3>
              <p className="text-sm text-indigo-100/80">
                Sprawdź sekcję <Link href="/contact" className="underline decoration-emerald-300/60 underline-offset-4 hover:text-white">Kontakt</Link> i napisz kilka słów o sobie.
              </p>
              <p className="text-sm text-indigo-100/80">
                Wspieramy wolontariuszy i partnerów edukacyjnych. Razem tworzymy kolejne moduły kursów.
              </p>
            </aside>
          </section>

          <section id="technologia" className="rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl backdrop-blur">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Technologia AxonAI</h2>
                <p className="text-lg text-indigo-100/80">
                  Większość kodu pisaliśmy w vibe-codingu — improwizowanych sesjach z AI, które pozwoliły błyskawicznie prototypować,
                  testować i poprawiać kluczowe funkcje. Dzięki temu system analizuje odpowiedzi, dobiera trudność zadań i natychmiast udziela informacji zwrotnej,
                  dając poczucie ciągłego progresu bez przytłoczenia.
                </p>
                <p className="text-sm text-indigo-100/80">
                  Wszystkie dane traktujemy z najwyższą ostrożnością. Użytkownik decyduje, co przechowywać i jak długo korzystać z historii nauki.
                </p>
              </div>
              <div className="grid gap-4 text-sm text-indigo-100/80">
                <div className="rounded-2xl border border-white/10 bg-indigo-900/60 p-6">
                  <h3 className="text-lg font-semibold text-white">Moduły adaptacyjne</h3>
                  <p className="mt-2">Ćwiczenia dopasowane do poziomu z automatycznymi sugestiami powtórek.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-indigo-900/60 p-6">
                  <h3 className="text-lg font-semibold text-white">Panel wyników</h3>
                  <p className="mt-2">Śledź tygodniowe statystyki i porównuj swoje osiągnięcia z poprzednimi miesiącami.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="historia" className="rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl backdrop-blur">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Nasza historia</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {TIMELINE.map((item) => (
                  <article key={item.year} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-indigo-900/60 p-6 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-200/80">{item.year}</span>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-indigo-100/80">{item.description}</p>
                  </article>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-indigo-900/60 p-6 text-sm text-indigo-100/80">
                <p>
                  Dołączając do AxonAI, otrzymujesz dostęp do ścieżek na różnych poziomach zaawansowania. Zobacz jak wyglądają nasze
                  plany w sekcji <Link href="/pricing" className="underline decoration-emerald-300/60 underline-offset-4 hover:text-white">Cennik</Link>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

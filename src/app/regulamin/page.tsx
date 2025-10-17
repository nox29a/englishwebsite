// pages/regulamin.tsx
import Navbar from "@/components/Navbar";
export default function Regulamin() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-24 translate-y-16 rounded-full bg-[#1E3A8A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-10">
          <header className="text-center">
            <h1 className="text-4xl font-semibold tracking-wide text-slate-100">Regulamin</h1>
            <p className="mt-3 text-sm text-slate-400">
              Poznaj zasady korzystania z platformy AxonAI, aby w pełni wykorzystać dostępne narzędzia.
            </p>
          </header>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(3,7,18,0.6)] backdrop-blur-2xl">
            <div className="space-y-8 text-sm leading-relaxed text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-slate-100">1. Postanowienia ogólne</h2>
                <p className="mt-2">
                  Treść regulaminu opisuje zasady korzystania z serwisu LearnEnglishAI...
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-slate-100">2. Korzystanie z platformy</h2>
                <p className="mt-2">
                  Użytkownik zobowiązuje się do przestrzegania przepisów prawa oraz zasad netykiety...
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-slate-100">3. Prawa autorskie</h2>
                <p className="mt-2">
                  Wszelkie materiały dostępne na platformie stanowią własność LearnEnglishAI...
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

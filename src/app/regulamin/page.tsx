// pages/regulamin.tsx
import Navbar from "@/components/Navbar";
export default function Regulamin() {
  return (
          <>
          <Navbar />
    <main className="min-h-screen bg-gradient-to-b from-[#1a1446] to-[#0d0a23] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Regulamin</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Postanowienia ogólne</h2>
            <p>Treść regulaminu opisuje zasady korzystania z serwisu LearnEnglishAI...</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Korzystanie z platformy</h2>
            <p>Użytkownik zobowiązuje się do przestrzegania przepisów prawa oraz zasad netykiety...</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Prawa autorskie</h2>
            <p>Wszelkie materiały dostępne na platformie stanowią własność LearnEnglishAI...</p>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

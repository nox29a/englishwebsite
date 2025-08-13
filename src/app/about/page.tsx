// pages/o-nas.tsx
export default function ONas() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1446] to-[#0d0a23] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">O nas</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-12 text-center">
          LearnEnglishAI to interaktywna platforma do nauki języka angielskiego z wykorzystaniem AI.
          Tworzymy nowoczesne, spersonalizowane lekcje oraz narzędzia, które pomogą Ci w codziennym
          posługiwaniu się językiem.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1e1a4b] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Nasza misja</h3>
            <p className="text-gray-300">Pomagamy ludziom przełamywać bariery językowe...</p>
          </div>
          <div className="bg-[#1e1a4b] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Zespół</h3>
            <p className="text-gray-300">Składa się z doświadczonych nauczycieli, programistów i lingwistów...</p>
          </div>
          <div className="bg-[#1e1a4b] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Dlaczego AI?</h3>
            <p className="text-gray-300">Sztuczna inteligencja pozwala tworzyć dynamiczne i dopasowane lekcje...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import { QUESTION_BANKS, type Question } from "@/components/words/questions"
import { LANGUAGE_OPTIONS, type LearningLanguage } from "@/components/words/language_packs"
import { useLanguage } from "@/contexts/LanguageContext"

export default function TestPage() {
  const { language } = useLanguage()
  const [level, setLevel] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(3600)
  const [finished, setFinished] = useState(false)

  const currentLanguageOption = LANGUAGE_OPTIONS.find(option => option.code === language)
  const targetLabel = currentLanguageOption?.label ?? "Angielski"

  // Timer
  useEffect(() => {
    if (level && !finished && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
    if (timeLeft === 0) setFinished(true)
  }, [level, finished, timeLeft])

  useEffect(() => {
    setLevel(null)
    setQuestions([])
    setAnswers([])
    setFinished(false)
    setCurrentQ(0)
    setTimeLeft(3600)
  }, [language])

  // Start testu
  const startTest = (lvl: string) => {
    const pool = QUESTION_BANKS[language]?.[lvl] ?? []
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 10)
    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(null))
    setLevel(lvl)
    setTimeLeft(3600)
    setFinished(false)
    setCurrentQ(0)
  }

  // wybór odpowiedzi (choice)
  const selectAnswer = (idx: number) => {
    const newAns = [...answers]
    newAns[currentQ] = idx
    setAnswers(newAns)
  }

  // wpisanie odpowiedzi (fill)
  const typeAnswer = (val: string) => {
    const newAns = [...answers]
    newAns[currentQ] = val
    setAnswers(newAns)
  }

  // wynik
  const calculateScore = () =>
    answers.filter((ans, i) => {
      const q = questions[i]
      if (q.type === "choice") return ans === q.answer
      if (q.type === "fill") 
        return typeof ans === "string" && ans.trim().toLowerCase() === (q.answer as string).toLowerCase()
      return false
    }).length

  // format czasu
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  // --- EKRAN STARTOWY ---
  if (!level) {
    return (
      <>
        <Navbar />
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
          <div className="pointer-events-none absolute -top-24 -left-28 h-72 w-72 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#1E3A8A]/20 blur-3xl" />

          <div className="relative z-10 w-full max-w-4xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
              Tryb testu
            </div>
            <h1 className="mt-8 text-4xl font-bold tracking-wide text-slate-100 md:text-5xl">
              🎯 Wybierz poziom testu
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Ustal język i poziom trudności, aby sprawdzić swoje umiejętności językowe w AxonAI.
            </p>

            <p className="mt-10 text-base text-slate-300">
              Aktualny język testu: <span className="font-semibold text-slate-100">{targetLabel}</span>
              <br />
              <span className="text-sm text-slate-400">Możesz go zmienić, klikając odpowiednią flagę w nawigacji.</span>
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
              {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => startTest(lvl)}
                  className="rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-3 font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554] hover:shadow-[0_18px_40px_rgba(29,78,216,0.45)]"
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  // --- EKRAN WYNIKU ---
  if (finished) {
    const score = calculateScore()
    return (
      <>
        <Navbar />
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#1D4ED8/25,transparent_60%)]" />
          <Card className="relative z-10 w-full max-w-lg border border-white/10 bg-white/5 text-center shadow-[0_20px_45px_rgba(15,23,42,0.6)] backdrop-blur-xl">
            <CardContent className="space-y-6 px-10 py-12">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-widest text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Wynik testu
              </div>
              <h2 className="text-3xl font-bold text-slate-100">🏆 Twój wynik</h2>
              <p className="text-sm text-slate-400">
                Język testu: <span className="font-semibold text-slate-100">{targetLabel}</span>
              </p>
              <p className="text-5xl font-semibold text-[#60A5FA]">
                {score} / {questions.length}
              </p>
              <button
                onClick={() => setLevel(null)}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-3 text-base font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/50"
              >
                Spróbuj ponownie
              </button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const q = questions[currentQ]

  // --- EKRAN PYTAŃ ---
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#1D4ED8/12,transparent_65%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-slate-400">Język testu</div>
              <div className="text-lg font-semibold text-slate-100">{targetLabel}</div>
            </div>
            <div className="text-right text-slate-300">
              <div className="text-sm">Pytanie {currentQ + 1}/{questions.length}</div>
              <div className="text-lg font-semibold text-slate-100">⏳ {formatTime(timeLeft)}</div>
            </div>
          </div>

          <Card className="relative overflow-hidden border border-white/10 bg-white/5 shadow-[0_15px_40px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full bg-[#1D4ED8]/10 blur-3xl" />
            <CardContent className="relative space-y-6 p-8">
              <h2 className="text-2xl font-bold leading-snug text-slate-100">{q.q}</h2>

              {q.type === "choice" && (
                <div className="space-y-3">
                  {q.options!.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-base transition-all duration-200 ${
                        answers[currentQ] === idx
                          ? "bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)]"
                          : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "fill" && (
                <input
                  type="text"
                  value={answers[currentQ] || ""}
                  onChange={(e) => typeAnswer(e.target.value)}
                  placeholder="Wpisz odpowiedź..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50"
                />
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-4 text-slate-100 sm:flex-row sm:justify-between">
            <button
              onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
              disabled={currentQ === 0}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Wstecz
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((c) => c + 1)}
                className="rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-6 py-3 font-semibold text-slate-100 shadow-[0_10px_30px_rgba(29,78,216,0.35)] transition hover:from-[#1E40AF] hover:to-[#172554]"
              >
                Dalej
              </button>
            ) : (
              <button
                onClick={() => setFinished(true)}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-3 font-semibold text-slate-100 shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition hover:from-emerald-400 hover:to-emerald-600"
              >
                Zakończ test
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

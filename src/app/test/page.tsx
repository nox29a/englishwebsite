"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import { questionsDB, Question } from "@/components/words/questions"

export default function TestPage() {
  const [level, setLevel] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(3600)
  const [finished, setFinished] = useState(false)

  // Timer
  useEffect(() => {
    if (level && !finished && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
    if (timeLeft === 0) setFinished(true)
  }, [level, finished, timeLeft])

  // Start testu
  const startTest = (lvl: string) => {
    const pool = questionsDB[lvl]
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
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <h1 className="text-4xl font-bold mb-10">🎯 Wybierz poziom testu</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startTest(lvl)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                {lvl}
              </button>
            ))}
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
        <div className="min-h-screen flex items-center justify-center text-white p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Card className="bg-white/10 backdrop-blur-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🏆 Twój wynik</h2>
            <p className="text-4xl font-semibold mb-2 text-purple-400">
              {score} / {questions.length}
            </p>
            <button
              onClick={() => setLevel(null)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl"
            >
              Spróbuj ponownie
            </button>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6 text-gray-300">
            <span>Pytanie {currentQ + 1}/{questions.length}</span>
            <span className="font-semibold">⏳ {formatTime(timeLeft)}</span>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg p-6">
            <h2 className="text-xl font-bold mb-4">{q.q}</h2>

            {q.type === "choice" && (
              <div className="space-y-3">
                {q.options!.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    className={`w-full px-4 py-3 rounded-xl transition-all ${
                      answers[currentQ] === idx
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                        : "bg-white/10 hover:bg-white/20"
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
    className="w-full px-4 py-3 rounded-xl bg-transparent border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
  />
)}
          </Card>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
              disabled={currentQ === 0}
              className="px-6 py-3 bg-white/10 rounded-xl disabled:opacity-40"
            >
              Wstecz
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((c) => c + 1)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
              >
                Dalej
              </button>
            ) : (
              <button
                onClick={() => setFinished(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl"
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

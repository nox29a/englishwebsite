"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { questionsDB } from "@/components/words/questions"
import Navbar from "@/components/Navbar"

export default function TestPage() {
  const [level, setLevel] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
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
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 40)
    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(-1))
    setLevel(lvl)
    setTimeLeft(3600)
    setFinished(false)
    setCurrentQ(0)
  }

  // wybór odpowiedzi
  const selectAnswer = (idx: number) => {
    const newAns = [...answers]
    newAns[currentQ] = idx
    setAnswers(newAns)
  }

  // wynik
  const calculateScore = () =>
    answers.filter((ans, i) => ans === questions[i]?.answer).length

  // format czasu
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  // EKRAN STARTOWY
  if (!level) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <h1 className="text-4xl font-bold mb-10 animate-fade-in">🎯 Wybierz poziom testu</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startTest(lvl)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  // EKRAN WYNIKU
  if (finished) {
    const score = calculateScore()
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Card className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">🏆 Twój wynik</h2>
            <p className="text-4xl font-semibold mb-2 text-purple-400">
              {score} / {questions.length}
            </p>
            <p className="text-gray-300 mb-6">Poziom: {level}</p>
            <button
              onClick={() => setLevel(null)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Spróbuj ponownie
            </button>
          </Card>
        </div>
      </>
    )
  }

  const q = questions[currentQ]

  // EKRAN PYTAŃ
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6 text-gray-300">
            <span className="text-lg">Pytanie {currentQ + 1}/{questions.length}</span>
            <span className="font-semibold">⏳ {formatTime(timeLeft)}</span>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 mb-6 animate-slide-up">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{q.q}</h2>
              <div className="space-y-3">
                {q.options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 transform ${
                      answers[currentQ] === idx
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-[1.02]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
              disabled={currentQ === 0}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-105 disabled:opacity-40 disabled:transform-none"
            >
              Wstecz
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((c) => c + 1)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Dalej
              </button>
            ) : (
              <button
                onClick={() => setFinished(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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

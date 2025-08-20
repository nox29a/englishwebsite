"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { questionsDB } from "@/components/words/questions"
// przykładowa struktura pytań (można trzymać w osobnym pliku JSON)


export default function TestPage() {
  const [level, setLevel] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(3600) // 1h = 3600s
  const [finished, setFinished] = useState(false)
  const [dragAnswers, setDragAnswers] = useState<(string[] | null)[]>([])

  
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
    // losujemy 40 pytań (lub mniej jeśli baza mniejsza)
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

  // oblicz wynik
  const calculateScore = () => {
    return answers.filter((ans, i) => ans === questions[i]?.answer).length
  }

  // format czasu
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Wybierz poziom testu</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
            <Button
              key={lvl}
              onClick={() => startTest(lvl)}
              className="bg-indigo-700 hover:bg-yellow-600 rounded-xl px-6 py-3 text-white"
            >
              {lvl}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  if (finished) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 flex flex-col items-center justify-center text-white p-6">
        <Card className="bg-indigo-800 border border-indigo-700 max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Twój wynik</h2>
          <p className="text-3xl font-semibold mb-2">{score} / {questions.length}</p>
          <p className="text-indigo-200 mb-6">Poziom: {level}</p>
          <Button onClick={() => setLevel(null)} className="bg-indigo-600 hover:bg-indigo-500">
            Spróbuj ponownie
          </Button>
        </Card>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-6">
          <span className="text-lg">Pytanie {currentQ + 1}/{questions.length}</span>
          <span className="font-semibold">⏳ {formatTime(timeLeft)}</span>
        </div>
        <Card className="bg-indigo-800 border border-indigo-700 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{q.q}</h2>
            <div className="space-y-3">
              {q.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${
                    answers[currentQ] === idx
                      ? "bg-yellow-600 border-indigo-400"
                      : "bg-indigo-700 border-indigo-600 hover:bg-indigo-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
            disabled={currentQ === 0}
            className="bg-indigo-700 hover:bg-yellow-600 text-white"
          >
            Wstecz
          </Button>
          {currentQ < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQ((c) => c + 1)}
              className="bg-indigo-700 hover:bg-yellow-600 text-white"
            >
              Dalej
            </Button>
          ) : (
            <Button
              onClick={() => setFinished(true)}
              className="bg-green-600 hover:bg-green-500"
            >
              Zakończ test
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

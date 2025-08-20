"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { useStreak } from "@/app/hooks/useStreak";

import { easy } from "@/components/words/flashcards_words";
import { medium } from "@/components/words/flashcards_words";
import { hard } from "@/components/words/flashcards_words";

export default function FlashcardGame() {
  const [level, setLevel] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [direction, setDirection] = useState<"pl-en" | "en-pl">("pl-en");
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(easy);
  const [current, setCurrent] = useState(easy[0]);
  const [score, setScore] = useState(0);
  const [feedbackColor, setFeedbackColor] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);

  const { streak, markToday } = useStreak();

  // --- Speech recognition ---
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript); // tylko wstawia tekst do inputa
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (e: any) => {
          // prosty handler — wyłącz nasłuchiwanie przy błędzie
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };
      }
    }
  }, [direction]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.start();
      } catch (err) {
        console.error("Cannot start recognition:", err);
        setIsListening(false);
      }
    }
  };

  // --- TTS (odsłuchaj) ---
  const speak = (text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      // opcjonalnie: wybór głosu (można rozwinąć)
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const playPrompt = () => {
    const prompt = direction === "pl-en" ? current.pl : current.en;
    const lang = direction === "pl-en" ? "pl-PL" : "en-US";
    speak(prompt, lang);
  };

  // --- DB handling ---
  const getWords = () =>
    level === "Easy" ? easy : level === "Medium" ? medium : hard;

  const loadProgress = async () => {
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("flashcards_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("level", level)
      .eq("direction", direction)
      .single();

    if (error || !data) {
      setRemaining(getWords());
      setCurrent(getWords()[0]);
      setScore(0);
      setTotalTimeSpent(0);
    } else {
      const remainingWords = getWords().filter((word) =>
        data.remaining_ids.includes(word.id)
      );
      setRemaining(remainingWords);
      setCurrent(remainingWords[0] || getWords()[0]);
      setScore(data.correct_answers);
      setTotalTimeSpent(data.time_spend || 0);
    }
    setStartTime(new Date());
    setLoading(false);
  };

  const saveProgress = async () => {
    if (!startTime) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return;
    }

    const currentTime = new Date();
    const timeSpentSinceLastSave = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );
    const newTotalTimeSpent = totalTimeSpent + timeSpentSinceLastSave;

    const progressData = {
      user_id: user.id,
      level,
      direction,
      remaining_ids: remaining.map((word) => word.id),
      correct_answers: score,
      total_answers: score + (getWords().length - remaining.length),
      time_spend: newTotalTimeSpent,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("flashcards_progress")
      .upsert(progressData, { onConflict: "user_id,level,direction" });

    if (error) {
      console.error("Error saving progress:", error);
    } else {
      setTotalTimeSpent(newTotalTimeSpent);
      setStartTime(new Date());
    }
  };

  useEffect(() => {
    loadProgress();
    return () => {
      if (startTime) {
        saveProgress().catch(console.error);
      }
    };
  }, [level, direction]);

  useEffect(() => {
    if (!loading) {
      saveProgress();
    }
  }, [remaining, score]);

  // --- GAME LOGIC ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const wordToCheck =
      remaining.find((w) => w.id === current.id) || current;

    const correct =
      direction === "pl-en"
        ? wordToCheck.en.toLowerCase().trim()
        : wordToCheck.pl.toLowerCase().trim();

    const userAnswer = input.trim().toLowerCase();

    let updatedList = remaining;

    if (userAnswer === correct) {
      setFeedbackColor("bg-green-500");
      updatedList = remaining.filter((word) => word.id !== wordToCheck.id);
      setScore((prev) => prev + 1);
    } else {
      setFeedbackColor("bg-red-500");
      setCorrectAnswer(correct);
    }

    if (updatedList.length === 0) {
      setTimeout(() => {
        setCurrent({ id: -1, pl: "Koniec!", en: "The End!" });
        setFeedbackColor("");
        setCorrectAnswer("");
        setInput("");
        setRemaining([]);
      }, 1000);
      return;
    }

    const nextIndex = Math.floor(Math.random() * updatedList.length);
    const next = updatedList[nextIndex];

    setTimeout(() => {
      setCurrent(next);
      setFeedbackColor("");
      setCorrectAnswer("");
      setInput("");
      setRemaining(updatedList);
    }, 1000);
  };

  const resetGame = () => {
    const newWords = getWords();
    setRemaining(newWords);
    setCurrent(newWords[0]);
    setInput("");
    setScore(0);
    setFeedbackColor("");
    setCorrectAnswer("");
    setTotalTimeSpent(0);
    setStartTime(new Date());
  };

  const handleLevelChange = (lvl: "Easy" | "Medium" | "Hard") => {
    setLevel(lvl);
  };

  const handleDirectionChange = (dir: "pl-en" | "en-pl") => {
    setDirection(dir);
  };

  // --- UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e1a] text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        <p className="mt-4">Ładowanie postępów...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0e0e1a] text-white flex flex-col items-center justify-center p-4 space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400">FISZKI</h1>

        {/* Poziom */}
        <div className="text-sm text-gray-400">Wybierz poziom trudności:</div>
        <div className="grid grid-cols-3 gap-2">
          {["Easy", "Medium", "Hard"].map((lvl) => (
            <Button
              key={lvl}
              onClick={() => handleLevelChange(lvl as any)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                level === lvl
                  ? "bg-blue-500 text-white hover:bg-yellow-400"
                  : "bg-white text-black hover:bg-yellow-400"
              }`}
            >
              {lvl}
            </Button>
          ))}
        </div>

        {/* Kierunek */}
        <div className="text-sm text-gray-400">Wybierz kierunek tłumaczenia:</div>
        <div className="flex space-x-4">
          <Button
            onClick={() => handleDirectionChange("pl-en")}
            className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
              direction === "pl-en"
                ? "bg-blue-500 text-white hover:bg-yellow-400"
                : "bg-white text-black hover:bg-yellow-400"
            }`}
          >
            <span>🇵🇱 Polski</span>
          </Button>
          <Button
            onClick={() => handleDirectionChange("en-pl")}
            className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
              direction === "en-pl"
                ? "bg-blue-500 text-white hover:bg-yellow-400"
                : "bg-white text-black hover:bg-yellow-400"
            }`}
          >
            <span>🇬🇧 Angielski</span>
          </Button>
        </div>

        {/* Aktualne słowo */}
        <div className={`text-2xl font-semibold text-blue-400 px-6 py-2 rounded`}>
          {direction === "pl-en" ? current.pl : current.en}
        </div>

        {/* Input + sprawdzanie */}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            className={`text-white transition-colors duration-200 ${feedbackColor}`}
            placeholder="Wpisz tłumaczenie..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            className={`border border-white transition-colors duration-200 ${feedbackColor}`}
          >
            Sprawdź
          </Button>
        </form>

        {/* Mikrofon + Odsłuchaj */}
        <div className="flex space-x-3 mt-2">
          <Button
            onClick={startListening}
            disabled={isListening}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2"
          >
            🎤 {isListening ? "Słucham..." : "Mów"}
          </Button>

          <Button
            onClick={playPrompt}
            className="bg-white text-black hover:bg-yellow-400 rounded-full px-4 py-2"
          >
            🔊 Odsłuchaj
          </Button>
        </div>

        {/* Wyniki */}
        {correctAnswer && (
          <div className="text-red-400 text-sm">
            Poprawna odpowiedź:{" "}
            <span className="font-semibold">{correctAnswer}</span>
          </div>
        )}

        <div className="text-sm text-gray-400">
          Odgadnięte słowa: {score}
        </div>

        <div className="text-sm text-gray-400">
          Czas nauki: {Math.floor(totalTimeSpent / 60)} minut
        </div>

        <Button onClick={resetGame} variant="outline" className="text-white">
          Reset
        </Button>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { verbs } from "@/components/words/irreagular_verbs";




export default function IrregularVerbsTrainer() {
  const getRandomVerb = (list: typeof verbs) =>
    list[Math.floor(Math.random() * list.length)];

  const [remainingVerbs, setRemainingVerbs] = useState([...verbs]);
  const [currentVerb, setCurrentVerb] = useState(getRandomVerb(verbs));
  const [inputBase, setInputBase] = useState("");
  const [inputPast, setInputPast] = useState("");
  const [inputParticiple, setInputParticiple] = useState("");
  const baseInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<number>(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);



  const loadUserData = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return;
    }
  };

  // Ładowanie postępów


const loadProgress = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Pobieranie danych z profiles
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  if (!profileError && profileData) {
    setFirstName(profileData.first_name);
  }

  // Pobieranie postępów
  const { data, error } = await supabase
    .from('irregular_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (data) {
    setProgressId(data.id);
    const remainingVerbObjects = verbs.filter(verb => 
      data.remaining_verbs.includes(verb.index)
    );
    
    const verbsToUse = remainingVerbObjects.length > 0 ? remainingVerbObjects : [...verbs];
    setRemainingVerbs(verbsToUse);
    setCurrentVerb(getRandomVerb(verbsToUse)); // Ustaw currentVerb dopiero po załadowaniu
    setCorrectAnswers(data.correct_answers || 0);
    setTotalAnswers(data.total_answers || 0);
    setTimeSpent(data.time_spent || 0);
  } else {
    // Jeśli nie ma zapisanych postępów, użyj pełnej listy
    setCurrentVerb(getRandomVerb(verbs));
  }
};

  // Zapisywanie postępów
const saveProgress = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Najpierw sprawdź czy istnieje jakikolwiek wpis dla tego użytkownika
  const { data: existingData } = await supabase
    .from('irregular_progress')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  const progressData = {
    user_id: user.id,
    remaining_verbs: remainingVerbs.map(verb => verb.index),
    correct_answers: correctAnswers,
    total_answers: totalAnswers,
    time_spent: timeSpent + sessionTime,
    updated_at: new Date().toISOString()
  };

  if (existingData) {
    await supabase
      .from('irregular_progress')
      .update(progressData)
      .eq('id', existingData.id);
    setProgressId(existingData.id);
  } else {
    const { data, error } = await supabase
      .from('irregular_progress')
      .insert(progressData)
      .select()
      .single();
    
    if (data) {
      setProgressId(data.id);
    }
  }
};

useEffect(() => {
  const loadData = async () => {
    await loadUserData();
    await loadProgress();
  };
  loadData();
}, []);
  // Timer do śledzenia czasu sesji
useEffect(() => {
  const timerId = window.setTimeout(() => {
    saveProgress();
  }, 1000);

  return () => {
    window.clearTimeout(timerId);
  };
}, [remainingVerbs, correctAnswers, totalAnswers, timeSpent, sessionTime]);

  // Autozapis co sekundę
useEffect(() => {
  const timer = setTimeout(() => {
    saveProgress();
  }, 5000); // Zwiększ interwał do 5 sekund
  
  return () => clearTimeout(timer);
}, [remainingVerbs, correctAnswers, totalAnswers, timeSpent, sessionTime]);
  const resetTrainer = async () => {
    const freshVerbs = [...verbs];
    const randomVerb = getRandomVerb(freshVerbs);
    setRemainingVerbs(freshVerbs);
    setCurrentVerb(randomVerb);
    setInputBase("");
    setInputPast("");
    setInputParticiple("");
    setResult("");
    setShowAnswer(false);
    setAnsweredCorrectly(false);
    setTotalAnswers(0);
    setCorrectAnswers(0);
    setSessionTime(0);
    setTimeSpent(0);

    await saveProgress();
  };

  const checkAnswers = () => {
    const isBaseCorrect = inputBase.trim().toLowerCase() === currentVerb.base.toLowerCase();
    const isPastCorrect = inputPast.trim().toLowerCase() === currentVerb.past.toLowerCase();
    const isParticipleCorrect =
      inputParticiple.trim().toLowerCase() === currentVerb.participle.toLowerCase();

    setTotalAnswers((prev) => prev + 1);

    if (isBaseCorrect && isPastCorrect && isParticipleCorrect) {
      setResult("✅ Wszystko poprawnie!");
      setCorrectAnswers((prev) => prev + 1);
      setAnsweredCorrectly(true);

      setRemainingVerbs((prev) =>
        prev.filter((v) => v.base !== currentVerb.base)
      );
    } else {
      setResult("❌ Błąd. Spróbuj ponownie lub pokaż odpowiedź.");
    }
  };

  const nextVerb = () => {
    if (remainingVerbs.length === 0) {
      setResult("🎉 Wszystkie czasowniki zostały rozwiązane!");
      return;
    }

    const randomVerb = getRandomVerb(remainingVerbs);
    setCurrentVerb(randomVerb);
    setInputBase("");
    setInputPast("");
    setInputParticiple("");
    setResult("");
    setShowAnswer(false);
    setAnsweredCorrectly(false);
    
    setTimeout(() => {
      baseInputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (showAnswer || answeredCorrectly) {
        nextVerb();
      } else {
        checkAnswers();
      }
    } else if (e.key === " ") {
      e.preventDefault();
      setShowAnswer(true);
    }
  };

  const getAccuracy = () => {
    if (totalAnswers === 0) return 0;
    return Math.round((correctAnswers / totalAnswers) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = getAccuracy();
  const accuracyColor = accuracy >= 80 ? "text-green-600" : "text-red-600";
  const totalTimeSpent = timeSpent + sessionTime;

  return (
          <>
          <Navbar />
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} max-w-3xl mx-auto mt-10 p-4 rounded shadow-md`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <div className="text-left">
          {firstName && (
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm md:text-base`}>
              Cześć, <strong>{firstName}</strong>!
            </p>
          )}
        </div>
        
        <div className={`text-center md:text-right text-sm md:text-base ${accuracyColor}`}>
          <p>Poprawne: <strong>{correctAnswers}</strong></p>
          <p>Pozostało: <strong>{remainingVerbs.length} z {verbs.length}</strong></p>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Czas: <strong>{formatTime(totalTimeSpent)}</strong>
          </p>
        </div>
      </div>

      <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} shadow-xl`}>
        <CardContent className="space-y-4">
          <h2 className={`text-xl font-semibold text-center md:text-left ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Tłumaczenie:{" "}
            <span>{currentVerb.translation}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`${darkMode ? "text-gray-300" : "text-gray-700"} block mb-1`}>Base:</label>
              <input
                ref={baseInputRef}
                value={inputBase}
                onChange={(e) => setInputBase(e.target.value)}
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} w-full border rounded px-2 py-1`}
              />
            </div>
            <div>
              <label className={`${darkMode ? "text-gray-300" : "text-gray-700"} block mb-1`}>Past Simple:</label>
              <Input
                value={inputPast}
                onChange={(e) => setInputPast(e.target.value)}
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} w-full`}
              />
            </div>
            <div>
              <label className={`${darkMode ? "text-gray-300" : "text-gray-700"} block mb-1`}>
                Past Participle:
              </label>
              <Input
                value={inputParticiple}
                onChange={(e) => setInputParticiple(e.target.value)}
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} w-full`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2 gap-2">
            <Button
              onClick={() => {
                if (showAnswer || answeredCorrectly) {
                  nextVerb();
                } else {
                  checkAnswers();
                }
              }}
              className="w-full sm:w-auto"
            >
              Sprawdź
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                if (!answeredCorrectly && !showAnswer) {
                  setTotalAnswers((prev) => prev + 1);
                }
                nextVerb();
              }}
              className="w-full sm:w-auto"
            >
              Następne
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (!showAnswer && !answeredCorrectly) {
                  setTotalAnswers((prev) => prev + 1);
                }
                setShowAnswer(true);
              }}
              className="w-full sm:w-auto"
            >
              Pokaż odpowiedź
            </Button>

            <Button
              variant="destructive"
              onClick={resetTrainer}
              className="w-full sm:w-auto"
            >
              Resetuj
            </Button>
          </div>

          {result && (
            <p className={`text-lg font-medium text-center md:text-left ${darkMode ? "text-green-400" : "text-green-700"}`}>
              {result}
            </p>
          )}

          {showAnswer && (
            <div className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm text-center md:text-left`}>
              <p>
                Base: <strong>{currentVerb.base}</strong>
              </p>
              <p>
                Past: <strong>{currentVerb.past}</strong>
              </p>
              <p>
                Participle: <strong>{currentVerb.participle}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
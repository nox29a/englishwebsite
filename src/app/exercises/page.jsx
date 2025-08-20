"use client"
import React, { useState, useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import Navbar from '@/components/Navbar';

import { tasks } from "@/components/words/tasks";

  const levels = ["Wszystkie", "Łatwy", "Średni", "Trudny"];

// Funkcja do mieszania tablicy (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function ZadaniaPage() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [activeLevel, setActiveLevel] = useState("Wszystkie");
  const [darkMode, setDarkMode] = useState(true);
  const [shuffledTasks, setShuffledTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState({
    correct: 0,
    totalAttempts: 0,
    completedTasks: []
  });
  const [loading, setLoading] = useState(true);

  // Załaduj postępy użytkownika
  const loadProgress = async () => {
    setLoading(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('User not authenticated, progress will be local only');
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from('tasks_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      // Brak zapisanych postępów - inicjalizacja
      setProgress({
        correct: 0,
        totalAttempts: 0,
        completedTasks: []
      });
    } else {
      // Przywróć zapisane postępy
      setProgress({
        correct: data.correct_answers,
        totalAttempts: data.total_attempts,
        completedTasks: data.completed_tasks || []
      });
    }
    setLoading(false);
  };

  // Zapisz postępy do bazy danych
  const saveProgress = async () => {
    if (!userId) return;

    const progressData = {
      user_id: userId,
      correct_answers: progress.correct,
      total_attempts: progress.totalAttempts,
      completed_tasks: progress.completedTasks,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('tasks_progress')
      .upsert(progressData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    setShuffledTasks(shuffleArray(tasks));
    loadProgress();
  }, []);

  useEffect(() => {
    if (!loading && userId) {
      saveProgress();
    }
  }, [progress]);

  const handleAnswer = (taskIdx, selected) => {
    const task = filteredTasks[taskIdx];
    const isCorrect = selected === task.answer;
    const taskAlreadyCompleted = progress.completedTasks.includes(task.id);

    setSelectedAnswers((prev) => ({ ...prev, [taskIdx]: selected }));

    // Aktualizuj postępy tylko jeśli zadanie nie było wcześniej ukończone
    if (!taskAlreadyCompleted) {
      setProgress(prev => ({
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        totalAttempts: prev.totalAttempts + 1,
        completedTasks: isCorrect 
          ? [...prev.completedTasks, task.id] 
          : prev.completedTasks
      }));
    }

    // Zapisz odpowiedź w osobnej tabeli
    if (userId) {
      supabase
        .from('task_answers')
        .insert([
          { 
            user_id: userId, 
            task_id: task.id,
            answer: selected,
            is_correct: isCorrect,
            answered_at: new Date().toISOString()
          }
        ]);
    }
  };
  // Inicjalizacja przetasowanych zadań przy pierwszym renderowaniu
  useEffect(() => {
    setShuffledTasks(shuffleArray(tasks));
  }, []);

  

  const filteredTasks =
    activeLevel === "Wszystkie"
      ? shuffledTasks
      : shuffledTasks.filter((task) => task.level === activeLevel);

  return (
          <>
      <Navbar />
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"
      }`}
    >
      <header className="flex justify-between items-center max-w-3xl mx-auto mb-6">
        <h1
          className={`text-3xl md:text-4xl font-bold text-center ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          Zadania – Ćwicz angielski ✍️
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`ml-4 px-4 py-2 rounded-full border text-sm font-medium transition
            ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-indigo-300 hover:bg-gray-700"
                : "bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200"
            }`}
          aria-label="Toggle tryb jasny/ciemny"
        >
          {darkMode ? "Jasny tryb" : "Ciemny tryb"}
        </button>
      </header>

      <div className="flex justify-center gap-4 mb-8 flex-wrap max-w-3xl mx-auto">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
              activeLevel === level
                ? darkMode
                  ? "bg-indigo-500 text-white border-indigo-400"
                  : "bg-indigo-600 text-white border-indigo-600"
                : darkMode
                ? "bg-gray-800 text-indigo-300 border-gray-700 hover:bg-gray-700"
                : "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {filteredTasks.map((task, idx) => {
          const selected = selectedAnswers[idx];
          const isCorrect = selected === task.answer;

          return (
            <Card
              key={idx}
              className={`border rounded-xl p-4 w-full transition-colors duration-300 ${
                darkMode
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-indigo-50 border-indigo-300"
              }`}
            >
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <h2
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-indigo-700"
                    }`}
                  >
                    Poziom: {task.level}
                  </h2>
                </div>
                <p className={`${darkMode ? "text-white" : "text-gray-800"} text-sm mb-4`}>
                  {task.question}
                </p>
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {task.options.map((opt, i) => (
                    <li
                      key={i}
                      onClick={() => handleAnswer(idx, opt)}
                      className={`transition text-sm rounded-lg px-3 py-2 text-center cursor-pointer border select-none
                        ${
                          selected === opt
                            ? isCorrect
                              ? "bg-green-600 border-green-500 text-white"
                              : "bg-red-600 border-red-500 text-white"
                            : darkMode
                            ? "bg-indigo-800 border-indigo-700 text-indigo-300 hover:bg-indigo-700"
                            : "bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200"
                        }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                {selected && (
                  <div className="mt-3 text-sm">
                    <p
                      className={`font-medium ${
                        isCorrect
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {isCorrect
                        ? "✅ Dobrze!"
                        : `❌ Źle! Poprawna odpowiedź: ${task.answer}`}
                    </p>
                    <p className={`${darkMode ? "text-white" : "text-gray-800"} mt-1`}>
                      💡 {task.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
    </>
  );
}
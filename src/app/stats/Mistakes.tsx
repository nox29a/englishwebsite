"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// Interfejsy
interface QuestionAttempt {
  id: string;
  user_id: string;
  question_type: string;
  question_id: string;
  is_correct: boolean;
  time_taken: number;
  created_at: string;
}

interface Word {
  id: number;
  pl: string;
  en: string;
  difficulty?: string;
}

// Dane słówek
import { easy } from "@/components/words/flashcards_words";
import { medium } from "@/components/words/flashcards_words";
import { hard } from "@/components/words/flashcards_words";

const easyWithDifficulty: Word[] = easy.map((w) => ({ ...w, difficulty: "easy" }));
const mediumWithDifficulty: Word[] = medium.map((w) => ({ ...w, difficulty: "medium" }));
const hardWithDifficulty: Word[] = hard.map((w) => ({ ...w, difficulty: "hard" }));

const allWords: Word[] = [...easyWithDifficulty, ...mediumWithDifficulty, ...hardWithDifficulty];

export default function ErrorStatistics() {
  const [errorWords, setErrorWords] = useState<Word[]>([]);
  const [errorAttempts, setErrorAttempts] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Pobieranie błędnych prób
  useEffect(() => {
    const fetchErrors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("question_attempts")
          .select("*")
          .eq("is_correct", false)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Supabase error:", JSON.stringify(error, null, 2));
          return;
        }

        if (data) {
          setErrorAttempts(data);

          // mapowanie prób na słowa
          const wordsWithErrors: Word[] = [];
          data.forEach((attempt) => {
            const word = allWords.find((w) => w.id.toString() === attempt.question_id);
            if (word && !wordsWithErrors.some((w) => w.id === word.id && w.difficulty === word.difficulty)) {
              wordsWithErrors.push(word);
            }
          });

          setErrorWords(wordsWithErrors);
        }
      } catch (err) {
        console.error("❌ Błąd podczas pobierania statystyk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  // filtrowanie wg trudności
  const filteredWords =
    selectedDifficulty === "all"
      ? errorWords
      : errorWords.filter((w) => w.difficulty === selectedDifficulty);

  // filtrowanie wg czasu
  const furtherFilteredWords =
    timeFilter === "all"
      ? filteredWords
      : filteredWords.filter((word) => {
          const attemptsForWord = errorAttempts.filter(
            (a) => a.question_id === word.id.toString()
          );

          return attemptsForWord.some((attempt) => {
            const attemptDate = new Date(attempt.created_at);
            const now = new Date();

            if (timeFilter === "week") {
              const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return attemptDate >= oneWeekAgo;
            } else if (timeFilter === "month") {
              const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return attemptDate >= oneMonthAgo;
            }
            return true;
          });
        });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });

  const translateDifficulty = (d: string) =>
    d === "easy" ? "Łatwy" : d === "medium" ? "Średni" : d === "hard" ? "Trudny" : d;

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300 mx-auto"></div>
          <p className="mt-2 text-indigo-200 text-sm">Ładowanie statystyk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-900 rounded-xl shadow-lg p-4">
      {/* nagłówek */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white">Statystyki błędów</h1>
        <p className="text-indigo-200 text-sm">Słowa, w których popełniłeś błędy</p>
      </div>

      {/* filtry */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="difficulty" className="block text-xs font-medium text-indigo-200 mb-1">
            Poziom trudności
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="block w-full pl-2 pr-8 py-1.5 text-xs bg-indigo-800 border-indigo-700 text-indigo-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Wszystkie</option>
            <option value="easy">Łatwy</option>
            <option value="medium">Średni</option>
            <option value="hard">Trudny</option>
          </select>
        </div>

        <div>
          <label htmlFor="time" className="block text-xs font-medium text-indigo-200 mb-1">
            Przedział czasowy
          </label>
          <select
            id="time"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="block w-full pl-2 pr-8 py-1.5 text-xs bg-indigo-800 border-indigo-700 text-indigo-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Cały czas</option>
            <option value="week">Ostatni tydzień</option>
            <option value="month">Ostatni miesiąc</option>
          </select>
        </div>
      </div>

      {/* tabela */}
      <div className="mb-4">
        {furtherFilteredWords.length === 0 ? (
          <div className="text-center py-4 bg-indigo-800/50 rounded-lg">
            <svg className="mx-auto h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-1 text-sm font-medium text-indigo-200">Brak błędów!</h3>
            <p className="text-xs text-indigo-300">Świetna robota!</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-60 rounded-lg">
            <table className="min-w-full divide-y divide-indigo-700/50">
              <thead className="bg-indigo-800/40">
                <tr>
                  <th className="py-2 pl-3 pr-1 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">EN</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">PL</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Poziom</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Ostatni błąd</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Błędy</th>
                </tr>
              </thead>
              <tbody className="bg-indigo-800/20 divide-y divide-indigo-700/30">
                {furtherFilteredWords.map((word) => {
                  const attemptsForWord = errorAttempts.filter((a) => a.question_id === word.id.toString());
                  const lastErrorDate = attemptsForWord.length > 0 ? new Date(attemptsForWord[0].created_at) : null;

                  return (
                    <tr key={`${word.id}-${word.difficulty}`} className="hover:bg-indigo-700/30 transition-colors">
                      <td className="py-2 pl-3 pr-1 whitespace-nowrap text-sm font-medium text-white">{word.en}</td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm text-indigo-100">{word.pl}</td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            word.difficulty === "easy"
                              ? "bg-green-800/40 text-green-300"
                              : word.difficulty === "medium"
                              ? "bg-yellow-800/40 text-yellow-300"
                              : "bg-red-800/40 text-red-300"
                          }`}
                        >
                          {translateDifficulty(word.difficulty || "")}
                        </span>
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-xs text-indigo-200">
                        {lastErrorDate ? formatDate(lastErrorDate.toISOString()) : "-"}
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-800/40 text-red-300">
                          {attemptsForWord.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* podsumowanie */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-indigo-700/50">
        <div className="text-center">
          <p className="text-xs text-indigo-300">Łączne błędy</p>
          <p className="text-lg font-bold text-white">{errorAttempts.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-indigo-300">Słowa z błędami</p>
          <p className="text-lg font-bold text-white">{furtherFilteredWords.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-indigo-300">Średnia błędów</p>
          <p className="text-lg font-bold text-white">
            {furtherFilteredWords.length > 0 ? (errorAttempts.length / furtherFilteredWords.length).toFixed(1) : "0"}
          </p>
        </div>
      </div>
    </div>
  );
}

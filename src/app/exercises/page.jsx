"use client"
import React, { useState, useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

const tasks = [
  // === Łatwy ===
  {
    id: 1,
    level: "Łatwy",
    question: "She ____ to school every day.",
    options: ["go", "goes", "went", "gone"],
    answer: "goes",
    explanation: "Używamy 'goes', ponieważ zdanie jest w Present Simple, 3. osoba liczby pojedynczej (she) wymaga końcówki -es."
  },
  {
    id: 2,
    level: "Łatwy",
    question: "They ____ playing football now.",
    options: ["are", "is", "was", "be"],
    answer: "are",
    explanation: "Używamy 'are', bo to zdanie w Present Continuous – 'now' sugeruje teraźniejszość, a 'they' wymaga 'are'."
  },
  {
    id: 3,
    level: "Łatwy",
    question: "He ____ TV every evening.",
    options: ["watch", "watches", "watched", "watching"],
    answer: "watches",
    explanation: "'Every evening' wskazuje na nawyk, więc używamy Present Simple z końcówką -es dla 3. osoby."
  },
  {
    id: 4,
    level: "Łatwy",
    question: "I ____ a sandwich right now.",
    options: ["eat", "ate", "am eating", "eating"],
    answer: "am eating",
    explanation: "'Right now' to znak czasu Present Continuous – podmiot 'I' + 'am' + czasownik z -ing."
  },
  {
    id: 5,
    level: "Łatwy",
    question: "She ____ to music at the moment.",
    options: ["listen", "listens", "is listening", "listened"],
    answer: "is listening",
    explanation: "'At the moment' sugeruje Present Continuous. 'She' → 'is'."
  },
  {
    id: 6,
    level: "Łatwy",
    question: "Tom and Jerry ____ in the park every Sunday.",
    options: ["runs", "run", "ran", "running"],
    answer: "run",
    explanation: "'Every Sunday' → Present Simple, podmiot jest w liczbie mnogiej, więc nie dodajemy -s."
  },
  {
    id: 7,
    level: "Łatwy",
    question: "I usually ____ coffee in the morning.",
    options: ["drink", "drinks", "drank", "drinking"],
    answer: "drink",
    explanation: "'Usually' wskazuje Present Simple. 'I' → bez końcówki -s."
  },
  {
    id: 8,
    level: "Łatwy",
    question: "My parents ____ at work now.",
    options: ["are", "is", "were", "be"],
    answer: "are",
    explanation: "'Now' sugeruje Present Continuous. 'My parents' → liczba mnoga → 'are'."
  },
  {
    id: 9,
    level: "Łatwy",
    question: "The baby ____ now.",
    options: ["sleep", "is sleeping", "slept", "sleeps"],
    answer: "is sleeping",
    explanation: "'Now' → Present Continuous, 'The baby' → 'is' + czasownik -ing."
  },
  {
    id: 10,
    level: "Łatwy",
    question: "I ____ my homework after school every day.",
    options: ["do", "does", "did", "doing"],
    answer: "do",
    explanation: "'Every day' → Present Simple. 'I' → 'do'."
  },

  // === Średni ===
  {
    id: 11,
    level: "Średni",
    question: "I ____ already eaten my lunch.",
    options: ["have", "had", "has", "will have"],
    answer: "have",
    explanation: "'Already' sugeruje Present Perfect. Dla 'I' używamy 'have'."
  },
  {
    id: 12,
    level: "Średni",
    question: "He ____ a book when I entered the room.",
    options: ["reads", "was reading", "is reading", "read"],
    answer: "was reading",
    explanation: "Używamy Past Continuous, bo akcja była w trakcie, gdy wydarzyło się coś innego w przeszłości."
  },
  {
    id: 13,
    level: "Średni",
    question: "We ____ in Paris since 2010.",
    options: ["lived", "have lived", "live", "are living"],
    answer: "have lived",
    explanation: "'Since 2010' → Present Perfect."
  },
  {
    id: 14,
    level: "Średni",
    question: "They ____ to the cinema when it started to rain.",
    options: ["went", "were going", "go", "had gone"],
    answer: "were going",
    explanation: "Past Continuous – akcja trwała, kiedy coś innego się wydarzyło."
  },
  {
    id: 15,
    level: "Średni",
    question: "She ____ in five movies so far.",
    options: ["acted", "has acted", "acts", "was acting"],
    answer: "has acted",
    explanation: "'So far' → Present Perfect."
  },
  {
    id: 16,
    level: "Średni",
    question: "They ____ breakfast before school yesterday.",
    options: ["have", "had", "have had", "has"],
    answer: "had",
    explanation: "Czas przeszły – wczoraj."
  },
  {
    id: 17,
    level: "Średni",
    question: "I ____ to London last year.",
    options: ["have been", "went", "go", "was going"],
    answer: "went",
    explanation: "Konkretna przeszłość → Past Simple."
  },
  {
    id: 18,
    level: "Średni",
    question: "They ____ working for three hours.",
    options: ["have been", "are", "were", "has been"],
    answer: "have been",
    explanation: "Present Perfect Continuous → czynność trwająca do teraz."
  },
  {
    id: 19,
    level: "Średni",
    question: "You ____ the movie yet?",
    options: ["saw", "see", "have seen", "has seen"],
    answer: "have seen",
    explanation: "'Yet' → Present Perfect."
  },
  {
    id: 20,
    level: "Średni",
    question: "They ____ here for a long time.",
    options: ["live", "lived", "have lived", "are living"],
    answer: "have lived",
    explanation: "'For a long time' → Present Perfect."
  },

  // === Trudny ===
  {
    id: 21,
    level: "Trudny",
    question: "If she ____ earlier, she would have caught the train.",
    options: ["left", "had left", "leaves", "has left"],
    answer: "had left",
    explanation: "To trzeci tryb warunkowy – używamy Past Perfect ('had left') dla warunku w przeszłości."
  },
  {
    id: 22,
    level: "Trudny",
    question: "By next year, they ____ in this city for a decade.",
    options: ["will live", "will be living", "will have lived", "lived"],
    answer: "will have lived",
    explanation: "To Future Perfect – coś się wydarzy do określonego momentu w przyszłości."
  },
  {
    id: 23,
    level: "Trudny",
    question: "If I ____ more time, I would finish it.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – warunek nierealny w teraźniejszości → Past Simple."
  },
  {
    id: 24,
    level: "Trudny",
    question: "She said she ____ the movie before.",
    options: ["saw", "had seen", "has seen", "see"],
    answer: "had seen",
    explanation: "Reported speech – czas zaprzeszły."
  },
  {
    id: 25,
    level: "Trudny",
    question: "They ____ the car fixed before the trip.",
    options: ["have", "had", "will have", "has"],
    answer: "had",
    explanation: "Past Perfect – coś zostało zrobione przed inną przeszłą czynnością."
  },
  {
    id: 26,
    level: "Trudny",
    question: "The house ____ by the workers last week.",
    options: ["was painted", "painted", "is painted", "has painted"],
    answer: "was painted",
    explanation: "Strona bierna w Past Simple – 'was' + III forma."
  },
  {
    id: 27,
    level: "Trudny",
    question: "By the time we arrive, they ____.",
    options: ["will leave", "left", "will have left", "leave"],
    answer: "will have left",
    explanation: "Future Perfect – coś się skończy przed innym momentem."
  },
  {
    id: 28,
    level: "Trudny",
    question: "If you ____ me, I would help you.",
    options: ["ask", "asked", "would ask", "asks"],
    answer: "asked",
    explanation: "Second Conditional – Past Simple po 'if'."
  },
  {
    id: 29,
    level: "Trudny",
    question: "He ____ that he had seen her before.",
    options: ["said", "says", "was said", "say"],
    answer: "said",
    explanation: "Reported speech – czas przeszły."
  },
  {
    id: 30,
    level: "Trudny",
    question: "The documents ____ by the lawyer yesterday.",
    options: ["was signed", "signed", "were signed", "has signed"],
    answer: "were signed",
    explanation: "Past Simple Passive – 'were' + III forma."
  },
  {
id: 31,
level: "Łatwy",
question: "We ____ to the gym three times a week.",
options: ["go", "goes", "went", "going"],
answer: "go",
explanation: "'Three times a week' wskazuje na nawyk, więc Present Simple. 'We' → bez końcówki -s."
},
{
id: 32,
level: "Łatwy",
question: "The dog ____ barking loudly right now.",
options: ["is", "are", "was", "be"],
answer: "is",
explanation: "'Right now' sugeruje Present Continuous. 'The dog' → 'is'."
},
{
id: 33,
level: "Łatwy",
question: "She ____ her friends every weekend.",
options: ["meet", "meets", "met", "meeting"],
answer: "meets",
explanation: "'Every weekend' → Present Simple, 3. osoba → -s."
},
{
id: 34,
level: "Łatwy",
question: "I ____ reading a book at the moment.",
options: ["am", "is", "was", "be"],
answer: "am",
explanation: "Present Continuous z 'at the moment'. 'I' → 'am'."
},
{
id: 35,
level: "Łatwy",
question: "Birds ____ south in winter.",
options: ["fly", "flies", "flew", "flying"],
answer: "fly",
explanation: "Fakt ogólny → Present Simple, liczba mnoga → bez -s."
},
{
id: 36,
level: "Łatwy",
question: "He ____ his bike now.",
options: ["ride", "rides", "is riding", "rode"],
answer: "is riding",
explanation: "'Now' → Present Continuous. 'He' → 'is'."
},
{
id: 37,
level: "Łatwy",
question: "Children ____ games after school.",
options: ["play", "plays", "played", "playing"],
answer: "play",
explanation: "Nawyk → Present Simple, liczba mnoga → bez -s."
},
{
id: 38,
level: "Łatwy",
question: "It ____ raining outside.",
options: ["is", "are", "was", "be"],
answer: "is",
explanation: "Present Continuous dla pogody. 'It' → 'is'."
},
{
id: 39,
level: "Łatwy",
question: "My sister ____ piano lessons twice a week.",
options: ["take", "takes", "took", "taking"],
answer: "takes",
explanation: "'Twice a week' → Present Simple, 3. osoba → -s."
},
{
id: 40,
level: "Łatwy",
question: "We ____ waiting for the bus now.",
options: ["am", "is", "are", "be"],
answer: "are",
explanation: "'Now' → Present Continuous. 'We' → 'are'."
},
// === Średni === (kontynuacja)
{
id: 41,
level: "Średni",
question: "She ____ just finished her work.",
options: ["has", "had", "have", "will have"],
answer: "has",
explanation: "'Just' → Present Perfect. 'She' → 'has'."
},
{
id: 42,
level: "Średni",
question: "While I ____ TV, the phone rang.",
options: ["watch", "watched", "was watching", "am watching"],
answer: "was watching",
explanation: "Past Continuous dla akcji trwającej, przerwanej przez inną."
},
{
id: 43,
level: "Średni",
question: "I ____ this city for ten years.",
options: ["lived", "have lived", "live", "am living"],
answer: "have lived",
explanation: "'For ten years' → Present Perfect."
},
{
id: 44,
level: "Średni",
question: "They ____ home when the storm started.",
options: ["walk", "were walking", "walked", "have walked"],
answer: "were walking",
explanation: "Past Continuous – akcja w trakcie."
},
{
id: 45,
level: "Średni",
question: "He ____ three books this month.",
options: ["read", "has read", "reads", "was reading"],
answer: "has read",
explanation: "'This month' → Present Perfect dla okresu do teraz."
},
{
id: 46,
level: "Średni",
question: "We ____ dinner at 7 PM yesterday.",
options: ["have", "had", "have had", "has had"],
answer: "had",
explanation: "Konkretny czas w przeszłości → Past Simple."
},
{
id: 47,
level: "Średni",
question: "She ____ to New York twice.",
options: ["went", "has gone", "goes", "was going"],
answer: "has gone",
explanation: "Doświadczenie w życiu → Present Perfect."
},
{
id: 48,
level: "Średni",
question: "I ____ studying all night.",
options: ["have been", "am", "was", "has been"],
answer: "have been",
explanation: "Present Perfect Continuous dla akcji trwającej."
},
{
id: 49,
level: "Średni",
question: "Have you ____ the news today?",
options: ["hear", "heard", "have heard", "has heard"],
answer: "heard",
explanation: "Present Perfect w pytaniu. Poprawna forma: 'Have you heard'."
},
{
id: 50,
level: "Średni",
question: "He ____ waiting for hours.",
options: ["has been", "is", "was", "have been"],
answer: "has been",
explanation: "Present Perfect Continuous. 'He' → 'has been'."
},
// === Trudny === (kontynuacja)
{
id: 51,
level: "Trudny",
question: "If he ____ studied harder, he would have passed.",
options: ["had", "has", "have", "would have"],
answer: "had",
explanation: "Third Conditional – Past Perfect po 'if'."
},
{
id: 52,
level: "Trudny",
question: "By tomorrow, I ____ the project.",
options: ["will finish", "will have finished", "finish", "finished"],
answer: "will have finished",
explanation: "Future Perfect dla akcji ukończonej przed przyszłością."
},
{
id: 53,
level: "Trudny",
question: "If it ____ rain, we will go out.",
options: ["doesn't", "didn't", "won't", "wouldn't"],
answer: "doesn't",
explanation: "First Conditional – Present Simple po 'if'."
},
{
id: 54,
level: "Trudny",
question: "He told me he ____ the book already.",
options: ["read", "had read", "has read", "reads"],
answer: "had read",
explanation: "Reported Speech – przesunięcie do Past Perfect."
},
{
id: 55,
level: "Trudny",
question: "The letter ____ sent before noon.",
options: ["was", "had been", "has been", "will be"],
answer: "had been",
explanation: "Past Perfect Passive – akcja przed inną w przeszłości."
},
{
id: 56,
level: "Trudny",
question: "The cake ____ by my mother.",
options: ["baked", "was baked", "bakes", "has baked"],
answer: "was baked",
explanation: "Past Simple Passive – 'was' + III forma."
},
{
id: 57,
level: "Trudny",
question: "By the end of the day, we ____ everything.",
options: ["will do", "will have done", "do", "did"],
answer: "will have done",
explanation: "Future Perfect."
},
{
id: 58,
level: "Trudny",
question: "If I were you, I ____ that.",
options: ["won't do", "wouldn't do", "don't do", "didn't do"],
answer: "wouldn't do",
explanation: "Second Conditional – rada hipotetyczna."
},
{
id: 59,
level: "Trudny",
question: "She said that she ____ tired.",
options: ["is", "was", "has been", "had been"],
answer: "was",
explanation: "Reported Speech – Present Simple do Past Simple."
},
  {
  id: 60,
  level: "Trudny",
  question: "The report ____ prepared by the team.",
  options: ["was", "were", "has", "have"],
  answer: "was",
  explanation: "Past Simple Passive – 'The report' (liczba pojedyncza) → 'was'."
  }
  ];

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
  );
}
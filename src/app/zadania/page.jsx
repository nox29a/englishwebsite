"use client"
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const tasks = [
  // === Łatwy ===
  {
    level: "Łatwy",
    question: "She ____ to school every day.",
    options: ["go", "goes", "went", "gone"],
    answer: "goes",
    explanation: "Używamy 'goes', ponieważ zdanie jest w Present Simple, 3. osoba liczby pojedynczej (she) wymaga końcówki -es."
  },
  {
    level: "Łatwy",
    question: "They ____ playing football now.",
    options: ["are", "is", "was", "be"],
    answer: "are",
    explanation: "Używamy 'are', bo to zdanie w Present Continuous – 'now' sugeruje teraźniejszość, a 'they' wymaga 'are'."
  },
  {
    level: "Łatwy",
    question: "He ____ TV every evening.",
    options: ["watch", "watches", "watched", "watching"],
    answer: "watches",
    explanation: "'Every evening' wskazuje na nawyk, więc używamy Present Simple z końcówką -es dla 3. osoby."
  },
  {
    level: "Łatwy",
    question: "I ____ a sandwich right now.",
    options: ["eat", "ate", "am eating", "eating"],
    answer: "am eating",
    explanation: "'Right now' to znak czasu Present Continuous – podmiot 'I' + 'am' + czasownik z -ing."
  },
  {
    level: "Łatwy",
    question: "She ____ to music at the moment.",
    options: ["listen", "listens", "is listening", "listened"],
    answer: "is listening",
    explanation: "'At the moment' sugeruje Present Continuous. 'She' → 'is'."
  },
  {
    level: "Łatwy",
    question: "Tom and Jerry ____ in the park every Sunday.",
    options: ["runs", "run", "ran", "running"],
    answer: "run",
    explanation: "'Every Sunday' → Present Simple, podmiot jest w liczbie mnogiej, więc nie dodajemy -s."
  },
  {
    level: "Łatwy",
    question: "I usually ____ coffee in the morning.",
    options: ["drink", "drinks", "drank", "drinking"],
    answer: "drink",
    explanation: "'Usually' wskazuje Present Simple. 'I' → bez końcówki -s."
  },
  {
    level: "Łatwy",
    question: "My parents ____ at work now.",
    options: ["are", "is", "were", "be"],
    answer: "are",
    explanation: "'Now' sugeruje Present Continuous. 'My parents' → liczba mnoga → 'are'."
  },
  {
    level: "Łatwy",
    question: "The baby ____ now.",
    options: ["sleep", "is sleeping", "slept", "sleeps"],
    answer: "is sleeping",
    explanation: "'Now' → Present Continuous, 'The baby' → 'is' + czasownik -ing."
  },
  {
    level: "Łatwy",
    question: "I ____ my homework after school every day.",
    options: ["do", "does", "did", "doing"],
    answer: "do",
    explanation: "'Every day' → Present Simple. 'I' → 'do'."
  },

  // === Średni ===
  {
    level: "Średni",
    question: "I ____ already eaten my lunch.",
    options: ["have", "had", "has", "will have"],
    answer: "have",
    explanation: "'Already' sugeruje Present Perfect. Dla 'I' używamy 'have'."
  },
  {
    level: "Średni",
    question: "He ____ a book when I entered the room.",
    options: ["reads", "was reading", "is reading", "read"],
    answer: "was reading",
    explanation: "Używamy Past Continuous, bo akcja była w trakcie, gdy wydarzyło się coś innego w przeszłości."
  },
  {
    level: "Średni",
    question: "We ____ in Paris since 2010.",
    options: ["lived", "have lived", "live", "are living"],
    answer: "have lived",
    explanation: "'Since 2010' → Present Perfect."
  },
  {
    level: "Średni",
    question: "They ____ to the cinema when it started to rain.",
    options: ["went", "were going", "go", "had gone"],
    answer: "were going",
    explanation: "Past Continuous – akcja trwała, kiedy coś innego się wydarzyło."
  },
  {
    level: "Średni",
    question: "She ____ in five movies so far.",
    options: ["acted", "has acted", "acts", "was acting"],
    answer: "has acted",
    explanation: "'So far' → Present Perfect."
  },
  {
    level: "Średni",
    question: "They ____ breakfast before school yesterday.",
    options: ["have", "had", "have had", "has"],
    answer: "had",
    explanation: "Czas przeszły – wczoraj."
  },
  {
    level: "Średni",
    question: "I ____ to London last year.",
    options: ["have been", "went", "go", "was going"],
    answer: "went",
    explanation: "Konkretna przeszłość → Past Simple."
  },
  {
    level: "Średni",
    question: "They ____ working for three hours.",
    options: ["have been", "are", "were", "has been"],
    answer: "have been",
    explanation: "Present Perfect Continuous → czynność trwająca do teraz."
  },
  {
    level: "Średni",
    question: "You ____ the movie yet?",
    options: ["saw", "see", "have seen", "has seen"],
    answer: "have seen",
    explanation: "'Yet' → Present Perfect."
  },
  {
    level: "Średni",
    question: "They ____ here for a long time.",
    options: ["live", "lived", "have lived", "are living"],
    answer: "have lived",
    explanation: "'For a long time' → Present Perfect."
  },

  // === Trudny ===
  {
    level: "Trudny",
    question: "If she ____ earlier, she would have caught the train.",
    options: ["left", "had left", "leaves", "has left"],
    answer: "had left",
    explanation: "To trzeci tryb warunkowy – używamy Past Perfect ('had left') dla warunku w przeszłości."
  },
  {
    level: "Trudny",
    question: "By next year, they ____ in this city for a decade.",
    options: ["will live", "will be living", "will have lived", "lived"],
    answer: "will have lived",
    explanation: "To Future Perfect – coś się wydarzy do określonego momentu w przyszłości."
  },
  {
    level: "Trudny",
    question: "If I ____ more time, I would finish it.",
    options: ["had", "have", "would have", "has"],
    answer: "had",
    explanation: "Drugi tryb warunkowy – warunek nierealny w teraźniejszości → Past Simple."
  },
  {
    level: "Trudny",
    question: "She said she ____ the movie before.",
    options: ["saw", "had seen", "has seen", "see"],
    answer: "had seen",
    explanation: "Reported speech – czas zaprzeszły."
  },
  {
    level: "Trudny",
    question: "They ____ the car fixed before the trip.",
    options: ["have", "had", "will have", "has"],
    answer: "had",
    explanation: "Past Perfect – coś zostało zrobione przed inną przeszłą czynnością."
  },
  {
    level: "Trudny",
    question: "The house ____ by the workers last week.",
    options: ["was painted", "painted", "is painted", "has painted"],
    answer: "was painted",
    explanation: "Strona bierna w Past Simple – 'was' + III forma."
  },
  {
    level: "Trudny",
    question: "By the time we arrive, they ____.",
    options: ["will leave", "left", "will have left", "leave"],
    answer: "will have left",
    explanation: "Future Perfect – coś się skończy przed innym momentem."
  },
  {
    level: "Trudny",
    question: "If you ____ me, I would help you.",
    options: ["ask", "asked", "would ask", "asks"],
    answer: "asked",
    explanation: "Second Conditional – Past Simple po 'if'."
  },
  {
    level: "Trudny",
    question: "He ____ that he had seen her before.",
    options: ["said", "says", "was said", "say"],
    answer: "said",
    explanation: "Reported speech – czas przeszły."
  },
  {
    level: "Trudny",
    question: "The documents ____ by the lawyer yesterday.",
    options: ["was signed", "signed", "were signed", "has signed"],
    answer: "were signed",
    explanation: "Past Simple Passive – 'were' + III forma."
  }
];

const levels = ["Wszystkie", "Łatwy", "Średni", "Trudny"];

export default function ZadaniaPage() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [activeLevel, setActiveLevel] = useState("Wszystkie");
  const [darkMode, setDarkMode] = useState(true); // domyślnie ciemny tryb

  const handleAnswer = (taskIdx, selected) => {
    setSelectedAnswers((prev) => ({ ...prev, [taskIdx]: selected }));
  };

  const filteredTasks =
    activeLevel === "Wszystkie"
      ? tasks
      : tasks.filter((task) => task.level === activeLevel);

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
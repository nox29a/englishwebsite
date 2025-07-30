import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const times = [
  {
    name: "Present Simple",
    explanation:
      "Używamy, gdy mówimy o czymś, co dzieje się zawsze lub regularnie.",
    example: "I eat breakfast every day.",
    hints: ["every day", "always", "usually", "often", "never"]
  },
  {
    name: "Present Continuous",
    explanation:
      "Używamy, gdy coś dzieje się teraz.",
    example: "I am eating breakfast (właśnie teraz).",
    hints: ["now", "at the moment", "currently"]
  },
  {
    name: "Past Simple",
    explanation:
      "Używamy, gdy coś wydarzyło się w przeszłości i już się skończyło.",
    example: "I ate breakfast yesterday.",
    hints: ["yesterday", "last week", "in 2000"]
  },
  {
    name: "Past Continuous",
    explanation:
      "Używamy, gdy coś trwało przez pewien czas w przeszłości.",
    example: "I was eating when you called.",
    hints: ["while", "when"]
  },
  {
    name: "Present Perfect",
    explanation:
      "Używamy, gdy coś się wydarzyło i ma to wpływ na teraz.",
    example: "I have eaten (teraz nie jestem głodny).",
    hints: ["just", "already", "yet", "ever", "never"]
  },
  {
    name: "Past Perfect",
    explanation:
      "Używamy, gdy coś wydarzyło się przed czymś innym w przeszłości.",
    example: "I had eaten before she arrived.",
    hints: ["before", "after", "by the time"]
  },
  {
    name: "Future Simple",
    explanation:
      "Używamy, gdy coś wydarzy się w przyszłości.",
    example: "I will eat breakfast tomorrow.",
    hints: ["tomorrow", "next week", "in 2025"]
  },
  {
    name: "Future Continuous",
    explanation:
      "Używamy, gdy coś będzie się działo w określonym momencie w przyszłości.",
    example: "I will be eating at 8am.",
    hints: ["at this time tomorrow", "when you arrive"]
  },
  {
    name: "Future Perfect",
    explanation:
      "Używamy, gdy coś wydarzy się i zakończy przed jakimś momentem w przyszłości.",
    example: "I will have eaten before 9am.",
    hints: ["by", "by the time"]
  },
  {
    name: "Future Perfect Continuous",
    explanation:
      "Używamy, gdy coś będzie trwało aż do jakiegoś momentu w przyszłości.",
    example: "I will have been eating for an hour by 9am.",
    hints: ["for", "by"]
  },
];

const extraSections = [
  {
    name: "Zero Conditional",
    explanation:
      "Prawdy ogólne – jeśli coś się wydarzy, zawsze ma ten sam rezultat.",
    example: "If you heat water to 100°C, it boils.",
    hints: ["if + Present Simple", "czasowniki w czasie teraźniejszym"]
  },
  {
    name: "First Conditional",
    explanation:
      "Prawdopodobna przyszłość – coś może się wydarzyć, jeśli spełni się warunek.",
    example: "If it rains, I will stay home.",
    hints: ["if + Present Simple", "will + czasownik"]
  },
  {
    name: "Second Conditional",
    explanation:
      "Mało prawdopodobne lub nierealne sytuacje w teraźniejszości/przyszłości.",
    example: "If I were you, I would go.",
    hints: ["if + Past Simple", "would + czasownik"]
  },
  {
    name: "Third Conditional",
    explanation:
      "Coś, co się nie wydarzyło w przeszłości i jakie byłyby tego skutki.",
    example: "If I had studied, I would have passed.",
    hints: ["if + Past Perfect", "would have + III forma"]
  },
  {
    name: "Strona bierna (Passive Voice)",
    explanation:
      "Używana, gdy ważniejsze jest to, co się stało, niż kto to zrobił.",
    example: "The cake was eaten by Tom.",
    hints: ["to be + III forma czasownika"]
  },
  {
    name: "Mowa zależna (Reported Speech)",
    explanation:
      "Opisujemy, co ktoś powiedział, nie cytując go bezpośrednio.",
    example: "She said (that) she was tired.",
    hints: ["czas cofamy o jeden (np. Present Simple → Past Simple)"]
  },
];

export default function SciagaPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl md:text-4xl text-indigo-300 font-bold text-center mb-2">
        Ściąga z angielskiego 📘
      </h1>
      <h2 className="text-xl md:text-2xl text-indigo-400 text-center mb-10">
        Czasy
      </h2>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto mb-16">
        {times.map((time) => (
          <Card
            key={time.name}
            className="bg-indigo-600 border border-indigo-500 rounded-xl p-4 w-full"
          >
            <CardContent>
              <h2 className="text-xl text-white font-semibold mb-2">{time.name}</h2>
              <p className="text-white text-sm leading-relaxed mb-4">
                {time.explanation}
              </p>
              <Card className="bg-indigo-800 border border-indigo-700 rounded-lg p-3 mb-2">
                <CardContent>
                  <p className="text-indigo-100 text-sm">
                    <strong>Przykład:</strong> {time.example}
                  </p>
                </CardContent>
              </Card>
              {time.hints && (
                <ul className="list-disc pl-6 text-indigo-100 text-sm">
                  {time.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl md:text-2xl text-indigo-400 text-center mb-10">
        Inne ważne rzeczy
      </h2>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {extraSections.map((section) => (
          <Card
            key={section.name}
            className="bg-indigo-600 border border-indigo-500 rounded-xl p-4 w-full"
          >
            <CardContent>
              <h2 className="text-xl text-white font-semibold mb-2">{section.name}</h2>
              <p className="text-white text-sm leading-relaxed mb-4">
                {section.explanation}
              </p>
              <Card className="bg-indigo-800 border border-indigo-700 rounded-lg p-3 mb-2">
                <CardContent>
                  <p className="text-indigo-100 text-sm">
                    <strong>Przykład:</strong> {section.example}
                  </p>
                </CardContent>
              </Card>
              {section.hints && (
                <ul className="list-disc pl-6 text-indigo-100 text-sm">
                  {section.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

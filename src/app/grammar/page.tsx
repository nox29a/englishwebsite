"use client"

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Brain, Clock, MessageSquare, Eye, EyeOff, Star, Sparkles, BookOpen, Lightbulb, CheckCircle } from "lucide-react";
import { LANGUAGE_OPTIONS, type LearningLanguage } from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface Achievement {
  name: string;
  description: string;
  icon: string;
}

type Difficulty = "easy" | "medium" | "hard";
type DifficultyFilter = Difficulty | "all";

const LANGUAGE_GENITIVE_LABELS: Record<LearningLanguage, string> = {
  en: "angielskiego",
  de: "niemieckiego",
  es: "hiszpańskiego",
};

const getDifficultyColor = (difficulty: DifficultyFilter) => {
  switch (difficulty) {
    case "easy":
      return "from-green-400 to-green-600";
    case "medium":
      return "from-amber-400 to-amber-600";
    case "hard":
      return "from-red-400 to-red-600";
    default:
      return "from-[var(--cta-gradient-from)] to-[var(--cta-gradient-to)]"; // np. dla "all"
  }
};

interface GrammarItem {
  name: string;
  explanation: string;
  example: string;
  hints: string[];
  difficulty: Difficulty;
}

const englishTimes: GrammarItem[] = [
  {
    name: "Present Simple",
    explanation: "Używamy, gdy mówimy o czymś, co dzieje się zawsze lub regularnie.",
    example: "I eat breakfast every day.",
    hints: ["every day", "always", "usually", "often", "never"],
    difficulty: "easy"
  },
  {
    name: "Present Continuous",
    explanation: "Używamy, gdy coś dzieje się teraz.",
    example: "I am eating breakfast (właśnie teraz).",
    hints: ["now", "at the moment", "currently"],
    difficulty: "easy"
  },
  {
    name: "Past Simple",
    explanation: "Używamy, gdy coś wydarzyło się w przeszłości i już się skończyło.",
    example: "I ate breakfast yesterday.",
    hints: ["yesterday", "last week", "in 2000"],
    difficulty: "easy"
  },
  {
    name: "Past Continuous",
    explanation: "Używamy, gdy coś trwało przez pewien czas w przeszłości.",
    example: "I was eating when you called.",
    hints: ["while", "when"],
    difficulty: "medium"
  },
  {
    name: "Present Perfect",
    explanation: "Używamy, gdy coś się wydarzyło i ma to wpływ na teraz.",
    example: "I have eaten (teraz nie jestem głodny).",
    hints: ["just", "already", "yet", "ever", "never"],
    difficulty: "medium"
  },
  {
    name: "Past Perfect",
    explanation: "Używamy, gdy coś wydarzyło się przed czymś innym w przeszłości.",
    example: "I had eaten before she arrived.",
    hints: ["before", "after", "by the time"],
    difficulty: "hard"
  },
  {
    name: "Future Simple",
    explanation: "Używamy, gdy coś wydarzy się w przyszłości.",
    example: "I will eat breakfast tomorrow.",
    hints: ["tomorrow", "next week", "in 2025"],
    difficulty: "easy"
  },
  {
    name: "Future Continuous",
    explanation: "Używamy, gdy coś będzie się działo w określonym momencie w przyszłości.",
    example: "I will be eating at 8am.",
    hints: ["at this time tomorrow", "when you arrive"],
    difficulty: "hard"
  },
  {
    name: "Future Perfect",
    explanation: "Używamy, gdy coś wydarzy się i zakończy przed jakimś momentem w przyszłości.",
    example: "I will have eaten before 9am.",
    hints: ["by", "by the time"],
    difficulty: "hard"
  },
  {
    name: "Future Perfect Continuous",
    explanation: "Używamy, gdy coś będzie trwało aż do jakiegoś momentu w przyszłości.",
    example: "I will have been eating for an hour by 9am.",
    hints: ["for", "by"],
    difficulty: "hard"
  }
];

const englishExtraSections: GrammarItem[] = [
  {
    name: "Zero Conditional",
    explanation: "Prawdy ogólne – jeśli coś się wydarzy, zawsze ma ten sam rezultat.",
    example: "If you heat water to 100°C, it boils.",
    hints: ["if + Present Simple", "czasowniki w czasie teraźniejszym"],
    difficulty: "medium"
  },
  {
    name: "First Conditional",
    explanation: "Prawdopodobna przyszłość – coś może się wydarzyć, jeśli spełni się warunek.",
    example: "If it rains, I will stay home.",
    hints: ["if + Present Simple", "will + czasownik"],
    difficulty: "medium"
  },
  {
    name: "Second Conditional",
    explanation: "Mało prawdopodobne lub nierealne sytuacje w teraźniejszości/przyszłości.",
    example: "If I were you, I would go.",
    hints: ["if + Past Simple", "would + czasownik"],
    difficulty: "hard"
  },
  {
    name: "Third Conditional",
    explanation: "Coś, co się nie wydarzyło w przeszłości i jakie byłyby tego skutki.",
    example: "If I had studied, I would have passed.",
    hints: ["if + Past Perfect", "would have + III forma"],
    difficulty: "hard"
  },
  {
    name: "Strona bierna (Passive Voice)",
    explanation: "Używana, gdy ważniejsze jest to, co się stało, niż kto to zrobił.",
    example: "The cake was eaten by Tom.",
    hints: ["to be + III forma czasownika"],
    difficulty: "hard"
  },
  {
    name: "Mowa zależna (Reported Speech)",
    explanation: "Opisujemy, co ktoś powiedział, nie cytując go bezpośrednio.",
    example: "She said (that) she was tired.",
    hints: ["czas cofamy o jeden (np. Present Simple → Past Simple)"],
    difficulty: "hard"
  }
];

const germanTimes: GrammarItem[] = [
  {
    name: "Präsens",
    explanation: "Podstawowy czas teraźniejszy używany do opisywania faktów i nawyków.",
    example: "Ich arbeite jeden Tag im Homeoffice.",
    hints: ["heute", "immer", "jeden Tag"],
    difficulty: "easy"
  },
  {
    name: "Perfekt",
    explanation: "Czas przeszły używany w języku mówionym do opisania zakończonych czynności.",
    example: "Wir haben gestern einen Film geschaut.",
    hints: ["haben + Partizip II", "sein + Partizip II"],
    difficulty: "easy"
  },
  {
    name: "Präteritum",
    explanation: "Czas przeszły używany częściej w piśmie, narracjach i literaturze.",
    example: "Der Zug kam mit Verspätung an.",
    hints: ["gestern", "früher", "damals"],
    difficulty: "medium"
  },
  {
    name: "Futur I",
    explanation: "Opis planów i przewidywań w przyszłości.",
    example: "Ich werde morgen früher aufstehen.",
    hints: ["morgen", "nächste Woche"],
    difficulty: "medium"
  },
  {
    name: "Modalverben",
    explanation: "Czasowniki modalne (können, müssen, dürfen...) zmieniają znaczenie zdania.",
    example: "Ich muss heute lange arbeiten.",
    hints: ["Position 2", "bezokolicznik na końcu"],
    difficulty: "medium"
  },
  {
    name: "Plusquamperfekt",
    explanation: "Czas zaprzeszły używany do opisania czynności wcześniejszej od innej przeszłej.",
    example: "Nachdem ich gegessen hatte, ging ich spazieren.",
    hints: ["hatte/war + Partizip II", "nachdem"],
    difficulty: "hard"
  },
  {
    name: "Konjunktiv II",
    explanation: "Tryb przypuszczający służący do wyrażania życzeń i sytuacji nierealnych.",
    example: "Wenn ich mehr Zeit hätte, würde ich reisen.",
    hints: ["würde + Infinitiv", "hätte", "wäre"],
    difficulty: "hard"
  },
  {
    name: "Passiv",
    explanation: "Strona bierna z czasownikiem 'werden' i Partizip II.",
    example: "Die Pakete werden morgen geliefert.",
    hints: ["werden + Partizip II"],
    difficulty: "hard"
  }
];

const germanExtraSections: GrammarItem[] = [
  {
    name: "Szyk zdania",
    explanation: "W zdaniu oznajmującym czasownik stoi na drugim miejscu, a w pytaniach - na pierwszym.",
    example: "Morgen fahre ich nach Berlin.",
    hints: ["czasownik na 2. pozycji", "czasownik na końcu w zdaniu podrzędnym"],
    difficulty: "medium"
  },
  {
    name: "Zdania podrzędne",
    explanation: "W zdaniach z dass, weil, wenn czasownik stoi na końcu.",
    example: "Ich bleibe zu Hause, weil ich krank bin.",
    hints: ["dass", "weil", "wenn"],
    difficulty: "medium"
  },
  {
    name: "Czasowniki rozdzielnie złożone",
    explanation: "Cząstka rozdzielna trafia na koniec zdania.",
    example: "Ich stehe jeden Tag um 7 Uhr auf.",
    hints: ["aufstehen", "anrufen", "mitkommen"],
    difficulty: "medium"
  },
  {
    name: "Deklinacja rzeczownika",
    explanation: "Rodzajniki der/die/das odmieniają się w zależności od przypadku.",
    example: "Ich sehe den alten Film.",
    hints: ["Nominativ", "Akkusativ", "Dativ"],
    difficulty: "hard"
  },
  {
    name: "Konjunktiv I",
    explanation: "Tryb używany w mowie zależnej i cytatach.",
    example: "Er sagte, er sei krank.",
    hints: ["sei", "habe", "würde"],
    difficulty: "hard"
  },
  {
    name: "Zaimek względny",
    explanation: "Der/die/das zastępują rzeczownik i łączą zdania.",
    example: "Das ist der Mann, der mir geholfen hat.",
    hints: ["który", "która", "które"],
    difficulty: "medium"
  }
];

const spanishTimes: GrammarItem[] = [
  {
    name: "Presente",
    explanation: "Opisuje czynności teraźniejsze i zwyczaje.",
    example: "Trabajo en casa todos los días.",
    hints: ["ahora", "siempre", "todos los días"],
    difficulty: "easy"
  },
  {
    name: "Pretérito indefinido",
    explanation: "Czas przeszły dokonany używany do zakończonych czynności.",
    example: "Ayer comí con mis amigos.",
    hints: ["ayer", "el año pasado"],
    difficulty: "easy"
  },
  {
    name: "Pretérito imperfecto",
    explanation: "Opis tła wydarzeń, nawyków i stanów w przeszłości.",
    example: "Cuando era niño, jugaba en la calle.",
    hints: ["antes", "mientras"],
    difficulty: "medium"
  },
  {
    name: "Pretérito perfecto",
    explanation: "Czas przeszły odnoszący się do doświadczeń w niedalekiej przeszłości.",
    example: "Esta semana he estudiado mucho.",
    hints: ["haber + participio", "hoy", "esta semana"],
    difficulty: "medium"
  },
  {
    name: "Futuro simple",
    explanation: "Mówimy o planach i przewidywaniach.",
    example: "Mañana viajaré a Sevilla.",
    hints: ["mañana", "próxima semana"],
    difficulty: "medium"
  },
  {
    name: "Condicional",
    explanation: "Wyraża przypuszczenia i grzeczne prośby.",
    example: "Me gustaría pedir un café.",
    hints: ["ía"],
    difficulty: "medium"
  },
  {
    name: "Subjuntivo presente",
    explanation: "Tryb używany po wyrażeniach wątpliwości, emocji i życzeń.",
    example: "Espero que tengas un buen día.",
    hints: ["que", "ojalá"],
    difficulty: "hard"
  },
  {
    name: "Imperativo",
    explanation: "Forma rozkazująca dla udzielania poleceń.",
    example: "¡Haz los deberes ahora mismo!",
    hints: ["haz", "ve", "pon"],
    difficulty: "hard"
  }
];

const spanishExtraSections: GrammarItem[] = [
  {
    name: "Ser vs. Estar",
    explanation: "Ser opisuje cechy trwałe, estar stany tymczasowe.",
    example: "Soy profesor, pero estoy cansado hoy.",
    hints: ["profesión", "estado"],
    difficulty: "medium"
  },
  {
    name: "Por vs. Para",
    explanation: "Por mówi o przyczynie, para o celu lub kierunku.",
    example: "Este regalo es para ti, lo compré por tu cumpleaños.",
    hints: ["motivo", "destino"],
    difficulty: "medium"
  },
  {
    name: "Pronombres de objeto",
    explanation: "Zaimek dopełnienia bliższego i dalszego stoi przed czasownikiem.",
    example: "¿La carta? La escribí ayer. / Te lo envío luego.",
    hints: ["lo", "la", "le", "se"],
    difficulty: "medium"
  },
  {
    name: 'Perífrasis "ir a"',
    explanation: "Wyraża zamiar w najbliższej przyszłości.",
    example: "Voy a estudiar esta tarde.",
    hints: ["ir + a + infinitivo"],
    difficulty: "easy"
  },
  {
    name: "Subjuntivo en oraciones",
    explanation: "Pojawia się po wyrażeniach jak 'es importante que', 'quiero que'.",
    example: "Es importante que llegues a tiempo.",
    hints: ["quiero que", "espero que"],
    difficulty: "hard"
  },
  {
    name: "Pret. perfecto vs indefinido",
    explanation: "Perfekt odnosi się do okresu 'związanego z teraźniejszością', indefinido do zamkniętego czasu.",
    example: "Este año he viajado mucho, pero el año pasado viajé poco.",
    hints: ["este año", "ayer"],
    difficulty: "medium"
  }
];

const GRAMMAR_CONTENT: Record<LearningLanguage, { times: GrammarItem[]; extra: GrammarItem[] }> = {
  en: { times: englishTimes, extra: englishExtraSections },
  de: { times: germanTimes, extra: germanExtraSections },
  es: { times: spanishTimes, extra: spanishExtraSections },
};


export default function SciagaPage() {
  const { language } = useLanguage();
  const [masteredItems, setMasteredItems] = useState<Set<string>>(new Set<string>());
  const [showMastered, setShowMastered] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>("all");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === language),
    [language]
  );

  const { times, extra: extraSections } = useMemo(
    () => GRAMMAR_CONTENT[language],
    [language]
  );

  useEffect(() => {
    setMasteredItems(new Set<string>());
    setSelectedDifficulty("all");
  }, [language]);

  // Particle system for celebrations
  const createParticles = (x: number, y: number, type: 'success' | 'warning' = 'success'): void => {
    const colors =
      type === 'success'
        ? ['var(--chart-success-1)', 'var(--chart-success-2)', 'var(--chart-success-3)']
        : ['var(--chart-warning-1)', 'var(--chart-warning-2)', 'var(--chart-warning-3)'];
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: Math.random(),
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        velocity: { x: (Math.random() - 0.5) * 8, y: Math.random() * -10 - 3 }
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  };

  const toggleMastered = (
    itemName: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setMasteredItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
        createParticles(x, y);
        // achievements...
      }
      return newSet;
    });
  };

  // Hide achievement after 3 seconds
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement]);

  const allItems = useMemo(
    () => [...times, ...extraSections],
    [times, extraSections]
  );
  
  const filteredTimes = times.filter(item => {
    const difficultyMatch = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    const masteredMatch = showMastered || !masteredItems.has(item.name);
    return difficultyMatch && masteredMatch;
  });

  const filteredExtras = extraSections.filter(item => {
    const difficultyMatch = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    const masteredMatch = showMastered || !masteredItems.has(item.name);
    return difficultyMatch && masteredMatch;
  });

  const masteredCount = masteredItems.size;
  const totalCount = allItems.length;
  const progressPercentage = totalCount === 0 ? 0 : (masteredCount / totalCount) * 100;

  return (
    <>
      <Navbar />
      <div className="axon-design min-h-screen bg-gradient-to-br from-[var(--cards-gradient-from)] via-[var(--cards-gradient-via)] to-[var(--cards-gradient-to)] relative overflow-hidden">
        
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute animate-ping"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                borderRadius: '50%'
              }}
            />
          ))}
        </div>



        <div className="max-w-4xl mx-auto px-4 py-6 relative">
          




 

   

          {/* Tenses Section */}
          {filteredTimes.length > 0 && (
            <>


              <div className="grid gap-6 mb-16">
                {filteredTimes.map((time) => {
                  const isMastered = masteredItems.has(time.name);
                  return (
                    <div
                      key={time.name}
                      className={`bg-[var(--overlay-light)] backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 transform hover:scale-[1.02] p-6 ${
                        isMastered 
                          ? 'border-green-500/50 bg-green-900/20' 
                          : 'border-[color:var(--border-translucent-strong)] hover:bg-[var(--overlay-light-soft)]'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(time.difficulty)} text-[var(--foreground)]`}>
                            {time.difficulty === 'easy' ? 'Łatwy' : time.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                          </div>
                          <h3 className="text-xl font-bold text-[var(--foreground)]">{time.name}</h3>
                        </div>
                        
                        <button
                          onClick={(e) => toggleMastered(time.name, e)}
                          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isMastered 
                              ? 'bg-green-500 text-[var(--foreground)] shadow-lg shadow-green-500/30' 
                              : 'bg-[var(--overlay-light-strong)] text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-hover)]'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">
                        {time.explanation}
                      </p>
                      
                      <div className="bg-[var(--overlay-light-faint)] backdrop-blur-sm rounded-xl p-4 mb-4 border border-[color:var(--border-translucent)]">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-300 font-medium text-sm">Przykład:</span>
                        </div>
                        <p className="text-[var(--foreground)] font-medium">{time.example}</p>
                      </div>
                      
                      {time.hints && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-300 font-medium text-sm">Słowa kluczowe:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {time.hints.map((hint, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                {hint}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isMastered && (
                        <div className="mt-4 flex items-center text-green-300 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Opanowane!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Grammar Sections */}
          {filteredExtras.length > 0 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 mr-3 text-purple-400" />
                  Inne ważne zagadnienia
                </h2>
                <p className="text-[var(--muted-foreground)]">Dodatkowe konstrukcje gramatyczne</p>
              </div>

              <div className="grid gap-6">
                {filteredExtras.map((section) => {
                  const isMastered = masteredItems.has(section.name);
                  return (
                    <div
                      key={section.name}
                      className={`bg-[var(--overlay-light)] backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 transform hover:scale-[1.02] p-6 ${
                        isMastered 
                          ? 'border-green-500/50 bg-green-900/20' 
                          : 'border-[color:var(--border-translucent-strong)] hover:bg-[var(--overlay-light-soft)]'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(section.difficulty)} text-[var(--foreground)]`}>
                            {section.difficulty === 'easy' ? 'Łatwy' : section.difficulty === 'medium' ? 'Średni' : 'Trudny'}
                          </div>
                          <h3 className="text-xl font-bold text-[var(--foreground)]">{section.name}</h3>
                        </div>
                        
                        <button
                          onClick={(e) => toggleMastered(section.name, e)}
                          className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            isMastered 
                              ? 'bg-green-500 text-[var(--foreground)] shadow-lg shadow-green-500/30' 
                              : 'bg-[var(--overlay-light-strong)] text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-hover)]'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">
                        {section.explanation}
                      </p>
                      
                      <div className="bg-[var(--overlay-light-faint)] backdrop-blur-sm rounded-xl p-4 mb-4 border border-[color:var(--border-translucent)]">
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-300 font-medium text-sm">Przykład:</span>
                        </div>
                        <p className="text-[var(--foreground)] font-medium">{section.example}</p>
                      </div>
                      
                      {section.hints && (
                        <div>
                          <div className="flex items-center mb-2">
                            <Lightbulb className="w-4 h-4 text-purple-400 mr-2" />
                            <span className="text-purple-300 font-medium text-sm">Wskazówki:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {section.hints.map((hint, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                {hint}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isMastered && (
                        <div className="mt-4 flex items-center text-green-300 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Opanowane!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty State */}
          {filteredTimes.length === 0 && filteredExtras.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Brak zagadnień do wyświetlenia</h3>
              <p className="text-[var(--muted-foreground)]">
                {!showMastered ? 'Gratulacje! Opanowałeś wszystkie zagadnienia w tym filtrze!' : 'Spróbuj zmienić filtr poziom trudności.'}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
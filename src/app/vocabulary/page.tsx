"use client"

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Category, Word } from "@/components/words/flashcards_words";
import {
  LANGUAGE_DATASETS,
  LANGUAGE_OPTIONS,
  type LearningLanguage,
} from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";

// Typy



type SlotWord = {
  id: number | null;
  word: string | null;
};

type Difficulty = "easy" | "medium" | "hard";

type SlotSide = "native" | "target";



const SLOT_COUNT = 5;

const createEmptySlots = () =>
  Array.from({ length: SLOT_COUNT }, () => ({ id: null, word: null }));

// Komponent

export default function WordMatchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { language } = useLanguage();
  const languageCategories = useMemo(
    () => LANGUAGE_DATASETS[language],
    [language]
  );
  const [category, setCategory] = useState<Category>(
    languageCategories[0] as Category
  );

  const [words, setWords] = useState<Word[]>([]);
  const [nativeSlots, setNativeSlots] = useState<SlotWord[]>(createEmptySlots());
  const [targetSlots, setTargetSlots] = useState<SlotWord[]>(createEmptySlots());
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<{
    side: SlotSide;
    slotIndex: number;
    id: number;
  } | null>(null);
  const [error, setError] = useState<{
    side: SlotSide;
    slotIndex: number;
  } | null>(null);
  const [correctHighlight, setCorrectHighlight] = useState<
    { nativeIndex: number; targetIndex: number } | null
  >(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtruj słowa według poziomu trudności i kategorii
  const getFilteredWords = (sourceCategory: Category = category) => {
    return sourceCategory.words.filter((word) => word.level === difficulty);
  };

  const shuffleArray = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const getEmptySlots = (slots: SlotWord[]) =>
    slots
      .map((slot, idx) => (slot.id === null ? idx : -1))
      .filter((i) => i !== -1);

  const addNewPairs = (
    n: number,
    currentNativeSlots = nativeSlots,
    currentTargetSlots = targetSlots,
    sourceCategory: Category = category
  ) => {
    const emptyNativeSlots = shuffleArray(getEmptySlots(currentNativeSlots));
    const emptyTargetSlots = shuffleArray(getEmptySlots(currentTargetSlots));
    const slotsToFill = Math.min(
      emptyNativeSlots.length,
      emptyTargetSlots.length,
      n
    );
    if (slotsToFill <= 0) return;

    const currentWords = getFilteredWords(sourceCategory);

    setUsedIds((prevUsed) => {
      const candidates = shuffleArray(
        currentWords.filter((w) => !prevUsed.includes(w.id))
      ).slice(0, slotsToFill);

      if (candidates.length === 0) return prevUsed;

      const newUsed = [...prevUsed];
      const nativeCopy = [...currentNativeSlots];
      const targetCopy = [...currentTargetSlots];

      for (let i = 0; i < candidates.length; i++) {
        const word = candidates[i];
        nativeCopy[emptyNativeSlots[i]] = { id: word.id, word: word.pl };
        targetCopy[emptyTargetSlots[i]] = { id: word.id, word: word.en };
        newUsed.push(word.id);
      }

      setNativeSlots(nativeCopy);
      setTargetSlots(targetCopy);

      return newUsed;
    });
  };

  const resetGame = (nextCategory?: Category) => {
    const activeCategory = nextCategory ?? category;
    const emptySlots = createEmptySlots();
    const filteredWords = getFilteredWords(activeCategory);

    setUsedIds([]);
    setNativeSlots(emptySlots);
    setTargetSlots(emptySlots);
    setSelected(null);
    setCorrectHighlight(null);
    setError(null);
    setScore(0);
    setErrors(0);
    setStartTime(Date.now());
    setWords(filteredWords);

    // Dodajemy nowe pary na czystej planszy
    addNewPairs(SLOT_COUNT, emptySlots, emptySlots, activeCategory);
  };

  // Resetuj grę gdy zmieni się kategoria lub poziom trudności
  useEffect(() => {
    resetGame();
  }, [difficulty, category]);

  useEffect(() => {
    const categories = LANGUAGE_DATASETS[language];
    const defaultCategory = categories[0];
    setCategory(defaultCategory);
    resetGame(defaultCategory);
  }, [language]);

  const handleClick = (side: SlotSide, slotIndex: number) => {
    const slots = side === "native" ? nativeSlots : targetSlots;
    const slot = slots[slotIndex];
    if (
      !slot.id ||
      (error && error.side === side && error.slotIndex === slotIndex) ||
      correctHighlight
    )
      return;

    if (!selected) {
      setSelected({ side, slotIndex, id: slot.id });
      return;
    }

    if (selected.side === side && selected.slotIndex === slotIndex) {
      setSelected(null);
      return;
    }

    if (selected.id === slot.id && selected.side !== side) {
      let nativeIndex =
        side === "native"
          ? slotIndex
          : nativeSlots.findIndex((s) => s.id === slot.id);
      let targetIndex =
        side === "target"
          ? slotIndex
          : targetSlots.findIndex((s) => s.id === slot.id);

      if (nativeIndex === -1 && selected.side === "native")
        nativeIndex = selected.slotIndex;
      if (targetIndex === -1 && selected.side === "target")
        targetIndex = selected.slotIndex;

      if (nativeIndex === -1 || targetIndex === -1) {
        setSelected(null);
        return;
      }

      setScore((s) => s + 1);
      setCorrectHighlight({ nativeIndex, targetIndex });
      setSelected(null);

      setTimeout(() => {
        const updatedNative = nativeSlots.map((s, i) =>
          i === nativeIndex ? { id: null, word: null } : s
        );
        const updatedTarget = targetSlots.map((s, i) =>
          i === targetIndex ? { id: null, word: null } : s
        );

        setNativeSlots(updatedNative);
        setTargetSlots(updatedTarget);
        setCorrectHighlight(null);

        const remainingPairs = updatedNative.filter((s) => s.id !== null).length;
        const toAdd = Math.max(0, 5 - remainingPairs);
        if (toAdd > 3) {
          setTimeout(() => addNewPairs(toAdd, updatedNative, updatedTarget), 300);
        }
      }, 500);

      return;
    }

    setErrors((e) => e + 1);
    setError({ side, slotIndex });
    setSelected(null);
    setTimeout(() => setError(null), 1000);
  };

  const getButtonClass = (side: SlotSide, slotIndex: number, slot: SlotWord) => {
    const base =
      "group relative flex h-14 items-center rounded-2xl border border-white/10 px-5 py-3 text-left text-base font-medium text-slate-100 shadow-sm transition-all duration-300 backdrop-blur-sm";

    if (slot.id === null) {
      return `${base} cursor-default border-dashed border-white/10 bg-transparent text-slate-500/50`;
    }

    if (
      correctHighlight &&
      ((side === "native" && correctHighlight.nativeIndex === slotIndex) ||
        (side === "target" && correctHighlight.targetIndex === slotIndex))
    ) {
      return `${base} border-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 text-slate-900 shadow-[0_10px_30px_rgba(16,185,129,0.35)]`;
    }

    if (error && error.side === side && error.slotIndex === slotIndex) {
      return `${base} border-transparent bg-gradient-to-r from-rose-500 to-rose-700 text-slate-100 shadow-[0_10px_30px_rgba(225,29,72,0.35)]`;
    }

    if (selected && selected.side === side && selected.slotIndex === slotIndex) {
      return `${base} border-transparent bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.35)]`;
    }

    return `${base} bg-white/5 text-slate-100 hover:bg-white/10`;
  };

  const gameTime = Math.floor((now - startTime) / 1000);
  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === language),
    [language]
  );
  const targetLabel = currentLanguageOption?.label ?? "Angielski";

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#030712] via-[#050b1f] to-black px-6 py-16 text-slate-100">
        <div className="pointer-events-none absolute -top-40 -left-20 h-96 w-96 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,#1E3A8A/20,transparent_70%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">




          {/* Poziomy trudności */}
          <div className="flex flex-wrap justify-center gap-4">
            {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`rounded-2xl border px-6 py-3 font-semibold transition-all duration-300 ${
                  difficulty === level
                    ? level === "easy"
                      ? "border-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 text-slate-100 shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
                      : level === "medium"
                      ? "border-transparent bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.35)]"
                      : "border-transparent bg-gradient-to-r from-rose-500 to-rose-700 text-slate-100 shadow-[0_10px_30px_rgba(225,29,72,0.35)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100"
                }`}
              >
                {level === "easy" ? "Łatwy" : level === "medium" ? "Średni" : "Trudny"}
              </button>
            ))}
          </div>
          {/* Plansza */}
          <div className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Polski</span>
              <div className="mt-4 flex flex-col gap-4">
                {nativeSlots.map((slot, idx) => (
                  <button
                    key={"native" + idx}
                    onClick={() => handleClick("native", idx)}
                    className={getButtonClass("native", idx, slot)}
                    disabled={slot.id === null || Boolean(correctHighlight)}
                  >
                    {slot.word ?? "\u00A0"}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">{targetLabel}</span>
              <div className="mt-4 flex flex-col gap-4">
                {targetSlots.map((slot, idx) => (
                  <button
                    key={"target" + idx}
                    onClick={() => handleClick("target", idx)}
                    className={getButtonClass("target", idx, slot)}
                    disabled={slot.id === null || Boolean(correctHighlight)}
                  >
                    {slot.word ?? "\u00A0"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Statystyki */}


          {/* Wybór kategorii */}
          <div className="mt-12 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_15px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <label htmlFor="category" className="block text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
              Wybierz kategorię
            </label>
            <select
              id="category"
              value={category.name}
              onChange={(e) => {
                const selectedCategory = languageCategories.find(
                  (cat) => cat.name === e.target.value
                );
                if (selectedCategory) setCategory(selectedCategory);
              }}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-lg font-medium text-slate-100 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50"
            >
              {languageCategories.map((cat) => (
                <option key={cat.name} value={cat.name} className="bg-slate-900 text-slate-100">
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-slate-400">{category.description}</p>
          </div>
        </div>
      </div>


    </>
  );
}
"use client"

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import LevelSelector, {
  LEVEL_STYLE_PRESETS,
  type LevelOption,
} from "@/components/LevelSelector";
import {
  LANGUAGE_DATASETS,
  LANGUAGE_OPTIONS,
  type Category,
  type Word,
} from "@/components/words/language_packs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain } from "lucide-react";

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

const DIFFICULTY_OPTIONS: LevelOption<Difficulty>[] = [
  {
    value: "easy",
    label: "Łatwy",
    selectedClass: LEVEL_STYLE_PRESETS.easy,
  },
  {
    value: "medium",
    label: "Średni",
    selectedClass: LEVEL_STYLE_PRESETS.medium,
  },
  {
    value: "hard",
    label: "Trudny",
    selectedClass: LEVEL_STYLE_PRESETS.hard,
  },
];

// Komponent

export default function WordMatchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { language } = useLanguage();
  const languageCategories = useMemo<Category[]>(
    () => LANGUAGE_DATASETS[language] ?? [],
    [language]
  );
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    () => (languageCategories.length ? [languageCategories[0]] : [])
  );

  const [words, setWords] = useState<Word[]>([]);
  const [nativeSlots, setNativeSlots] = useState<SlotWord[]>(createEmptySlots());
  const [targetSlots, setTargetSlots] = useState<SlotWord[]>(createEmptySlots());
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const selectedCategoriesLabel = selectedCategories
    .map((cat) => cat.name)
    .join(", ");
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
  const getFilteredWords = (sourceCategories?: Category[]) => {
    const categoriesToUse =
      sourceCategories && sourceCategories.length
        ? sourceCategories
        : selectedCategories.length
        ? selectedCategories
        : languageCategories.length
        ? [languageCategories[0]]
        : [];

    return categoriesToUse.flatMap((cat) =>
      cat.words.filter((word) => word.level === difficulty)
    );
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
    sourceWords: Word[] = words
  ) => {
    const emptyNativeSlots = shuffleArray(getEmptySlots(currentNativeSlots));
    const emptyTargetSlots = shuffleArray(getEmptySlots(currentTargetSlots));
    const slotsToFill = Math.min(
      emptyNativeSlots.length,
      emptyTargetSlots.length,
      n
    );
    if (slotsToFill <= 0) return;

    const currentWords = sourceWords;

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

  const resetGame = (nextCategories?: Category[]) => {
    const activeCategories =
      nextCategories && nextCategories.length
        ? nextCategories
        : selectedCategories.length
        ? selectedCategories
        : languageCategories.length
        ? [languageCategories[0]]
        : [];
    const emptySlots = createEmptySlots();
    const filteredWords = getFilteredWords(activeCategories);

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
    addNewPairs(SLOT_COUNT, emptySlots, emptySlots, filteredWords);
  };

  // Resetuj grę gdy zmieni się kategoria lub poziom trudności
  useEffect(() => {
    if (!languageCategories.length) {
      resetGame([]);
      return;
    }
    if (!selectedCategories.length) {
      setSelectedCategories([languageCategories[0]]);
      return;
    }
    resetGame();
  }, [difficulty, selectedCategories, languageCategories]);

  useEffect(() => {
    const categories = LANGUAGE_DATASETS[language];
    const defaultCategory = categories?.[0];
    if (defaultCategory) {
      setSelectedCategories([defaultCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [language]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((cat) => cat.name === category.name);
      if (exists) {
        const updated = prev.filter((cat) => cat.name !== category.name);
        if (!updated.length && languageCategories.length) {
          return [languageCategories[0]];
        }
        return updated;
      }
      return [...prev, category];
    });
  };

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
  const totalAttempts = score + errors;
  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
  const remainingPairs = Math.max(words.length - score, 0);
  const progress = words.length > 0 ? Math.round((score / words.length) * 100) : 0;
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${secs}`;
  };
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
          <LevelSelector
            options={DIFFICULTY_OPTIONS}
            value={difficulty}
            onChange={setDifficulty}
            className="flex flex-wrap justify-center gap-4"
          />
          {/* Plansza - mobile */}
          <div className="mt-12 w-full max-w-5xl space-y-4 md:hidden">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Polski &amp; {targetLabel}</span>
              <div className="mt-4 flex flex-col gap-3">
                {nativeSlots.map((slot, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleClick("native", idx)}
                      className={getButtonClass("native", idx, slot)}
                      disabled={slot.id === null || Boolean(correctHighlight)}
                    >
                      {slot.word ?? "\u00A0"}
                    </button>
                    <button
                      onClick={() => handleClick("target", idx)}
                      className={getButtonClass("target", idx, targetSlots[idx])}
                      disabled={
                        targetSlots[idx]?.id === null || Boolean(correctHighlight)
                      }
                    >
                      {targetSlots[idx]?.word ?? "\u00A0"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plansza - desktop */}
          <div className="mt-12 hidden w-full max-w-5xl gap-6 md:grid md:grid-cols-2">
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
          <div className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
                Poprawne pary
              </span>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-semibold text-emerald-200">{score}</span>
                <span className="text-sm text-emerald-100/70">Łącznie {words.length}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-500/20">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 shadow-[0_10px_30px_rgba(244,63,94,0.25)]">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/80">
                Błędne próby
              </span>
              <div className="text-4xl font-semibold text-rose-100">{errors}</div>
              <p className="text-sm text-rose-100/70">
                Pozostało {remainingPairs} par do odkrycia
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6 shadow-[0_10px_30px_rgba(99,102,241,0.25)]">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200/80">
                Skuteczność
              </span>
              <div className="text-4xl font-semibold text-indigo-100">{accuracy}%</div>
              <p className="text-sm text-indigo-100/70">
                {totalAttempts === 0
                  ? "Rozpocznij łączenie, aby zobaczyć skuteczność"
                  : `${score} poprawnych z ${totalAttempts} prób`}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 shadow-[0_10px_30px_rgba(245,158,11,0.25)]">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200/80">
                Czas gry
              </span>
              <div className="text-4xl font-semibold text-amber-100">{formatTime(gameTime)}</div>
              <p className="text-sm text-amber-100/70">
                Gra rozpoczęta {new Date(startTime).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Wybór kategorii */}
          <div className="mt-12 w-full max-w-3xl rounded-2xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light)] p-5 shadow-2xl backdrop-blur-lg sm:p-6">
            <h3 className="mb-4 flex items-center text-base font-semibold text-[var(--foreground)] sm:text-lg">
              <Brain className="mr-2 h-5 w-5 text-[var(--icon-blue)]" />
              Kategoria
            </h3>
            <p className="mb-4 text-xs text-[var(--muted-foreground)] sm:text-sm">
              Kliknij, aby wybrać jedną lub kilka kategorii. Aktualnie wybrane: {" "}
              {selectedCategoriesLabel || "brak"}.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {languageCategories.map((cat) => {
                const isSelected = selectedCategories.some(
                  (selected) => selected.name === cat.name
                );

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    aria-pressed={isSelected}
                    className={`rounded-xl p-3 text-sm font-medium transition-all duration-300 ${
                      isSelected
                ? "bg-blue-700 text-[var(--foreground)] shadow-lg shadow-[rgba(29,78,216,0.35)]"
                    : "bg-[var(--overlay-light)] backdrop-blur-sm text-[var(--muted-foreground)] hover:bg-[var(--overlay-light-strong)] border border-[color:var(--border-translucent-strong)]"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
            {selectedCategories.length === 1 &&
              selectedCategories[0]?.description && (
                <p className="mt-4 text-xs text-[var(--muted-foreground)] sm:text-sm">
                  {selectedCategories[0].description}
                </p>
              )}
          </div>
        </div>
      </div>


    </>
  );
}
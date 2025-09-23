"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Categories } from "@/components/words/flashcards_words";

// Typy

type Word = {
  id: number;
  pl: string;
  en: string;
  level: "easy" | "medium" | "hard";
};

type SlotWord = {
  id: number | null;
  word: string | null;
};

type Difficulty = "easy" | "medium" | "hard";

type Category = {
  name: string;
  description: string;
  words: Word[];
};


const SLOT_COUNT = 5;

// Komponent

export default function WordMatchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
const [category, setCategory] = useState<Category>(Categories[0] as Category);

  const [words, setWords] = useState<Word[]>([]);
  const [plSlots, setPlSlots] = useState<SlotWord[]>(
    Array(SLOT_COUNT).fill({ id: null, word: null })
  );
  const [enSlots, setEnSlots] = useState<SlotWord[]>(
    Array(SLOT_COUNT).fill({ id: null, word: null })
  );
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<{
    side: "pl" | "en";
    slotIndex: number;
    id: number;
  } | null>(null);
  const [error, setError] = useState<{
    side: "pl" | "en";
    slotIndex: number;
  } | null>(null);
  const [correctHighlight, setCorrectHighlight] = useState<
    { plIndex: number; enIndex: number } | null
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
  const getFilteredWords = () => {
    return category.words.filter(word => word.level === difficulty);
  };

  const shuffleArray = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const getEmptySlots = (slots: SlotWord[]) =>
    slots.map((slot, idx) => (slot.id === null ? idx : -1)).filter((i) => i !== -1);

  const addNewPairs = (n: number, currentPlSlots = plSlots, currentEnSlots = enSlots) => {
    const emptyPlSlots = shuffleArray(getEmptySlots(currentPlSlots));
    const emptyEnSlots = shuffleArray(getEmptySlots(currentEnSlots));
    const slotsToFill = Math.min(emptyPlSlots.length, emptyEnSlots.length, n);
    if (slotsToFill <= 0) return;

    const currentWords = getFilteredWords();
    
    setUsedIds((prevUsed) => {
      const candidates = shuffleArray(
        currentWords.filter((w) => !prevUsed.includes(w.id))
      ).slice(0, slotsToFill);
      
      if (candidates.length === 0) return prevUsed;

      const newUsed = [...prevUsed];
      const plCopy = [...currentPlSlots];
      const enCopy = [...currentEnSlots];

      for (let i = 0; i < candidates.length; i++) {
        const word = candidates[i];
        plCopy[emptyPlSlots[i]] = { id: word.id, word: word.pl };
        enCopy[emptyEnSlots[i]] = { id: word.id, word: word.en };
        newUsed.push(word.id);
      }

      setPlSlots(plCopy);
      setEnSlots(enCopy);

      return newUsed;
    });
  };

  const resetGame = () => {
    const emptySlots = Array(SLOT_COUNT).fill({ id: null, word: null });
    const filteredWords = getFilteredWords();

    setUsedIds([]);
    setPlSlots(emptySlots);
    setEnSlots(emptySlots);
    setSelected(null);
    setCorrectHighlight(null);
    setError(null);
    setScore(0);
    setErrors(0);
    setStartTime(Date.now());
    setWords(filteredWords);

    // Dodajemy nowe pary na czystej planszy
    addNewPairs(SLOT_COUNT, emptySlots, emptySlots);
  };

  // Resetuj grę gdy zmieni się kategoria lub poziom trudności
  useEffect(() => {
    resetGame();
  }, [difficulty, category]);

  const handleClick = (side: "pl" | "en", slotIndex: number) => {
    const slots = side === "pl" ? plSlots : enSlots;
    const slot = slots[slotIndex];
    if (!slot.id || (error && error.side === side && error.slotIndex === slotIndex) || correctHighlight)
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
      let plIndex = side === "pl" ? slotIndex : plSlots.findIndex((s) => s.id === slot.id);
      let enIndex = side === "en" ? slotIndex : enSlots.findIndex((s) => s.id === slot.id);

      if (plIndex === -1 && selected.side === "pl") plIndex = selected.slotIndex;
      if (enIndex === -1 && selected.side === "en") enIndex = selected.slotIndex;

      if (plIndex === -1 || enIndex === -1) {
        setSelected(null);
        return;
      }

      setScore((s) => s + 1);
      setCorrectHighlight({ plIndex, enIndex });
      setSelected(null);

      setTimeout(() => {
        const updatedPl = plSlots.map((s, i) => (i === plIndex ? { id: null, word: null } : s));
        const updatedEn = enSlots.map((s, i) => (i === enIndex ? { id: null, word: null } : s));

        setPlSlots(updatedPl);
        setEnSlots(updatedEn);
        setCorrectHighlight(null);

        const remainingPairs = updatedPl.filter((s) => s.id !== null).length;
        const toAdd = Math.max(0, 5 - remainingPairs);
        if (toAdd > 3) {
          setTimeout(() => addNewPairs(toAdd, updatedPl, updatedEn), 300);
        }
      }, 500);

      return;
    }

    setErrors((e) => e + 1);
    setError({ side, slotIndex });
    setSelected(null);
    setTimeout(() => setError(null), 1000);
  };

  const getButtonClass = (
    side: "pl" | "en",
    slotIndex: number,
    slot: SlotWord
  ) => {
    let base =
      "px-4 py-2 rounded-xl text-left shadow transition-colors duration-300 cursor-pointer select-none h-12 flex items-center ";

    if (slot.id === null) return base + "bg-transparent cursor-default";

    if (
      correctHighlight &&
      ((side === "pl" && correctHighlight.plIndex === slotIndex) ||
        (side === "en" && correctHighlight.enIndex === slotIndex))
    ) {
      return base + "bg-green-500 text-white";
    }

    if (error && error.side === side && error.slotIndex === slotIndex) {
      return base + "bg-rose-500 text-white";
    }

    if (selected && selected.side === side && selected.slotIndex === slotIndex) {
      return base + "bg-yellow-500 text-white";
    }

    return base + "bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500";
  };

  const gameTime = Math.floor((now - startTime) / 1000);

  return (
    <>
      <Navbar />
<div className="min-h-screen p-6 flex flex-col items-center text-white bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">


  {/* Poziomy trudności */}
  <div className="mb-6 flex gap-4">
    {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
      <button
        key={level}
        onClick={() => setDifficulty(level)}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg transform hover:scale-105 ${
          difficulty === level
            ? level === "easy"
              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
              : level === "medium"
              ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
              : "bg-gradient-to-r from-red-400 to-red-600 text-white"
            : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        }`}
      >
        {level === "easy" ? "Łatwy" : level === "medium" ? "Średni" : "Trudny"}
      </button>
    ))}
  </div>
          {/* Plansza */}
        <div className="flex justify-between w-full max-w-3xl gap-6">
          <div className="w-1/2 flex flex-col gap-4">
            {plSlots.map((slot, idx) => (
              <button
                key={"pl" + idx}
                onClick={() => handleClick("pl", idx)}
                className={getButtonClass("pl", idx, slot)}
                disabled={slot.id === null || Boolean(correctHighlight)}
              >
                {slot.word ?? "\u00A0"}
              </button>
            ))}
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            {enSlots.map((slot, idx) => (
              <button
                key={"en" + idx}
                onClick={() => handleClick("en", idx)}
                className={getButtonClass("en", idx, slot)}
                disabled={slot.id === null || Boolean(correctHighlight)}
              >
                {slot.word ?? "\u00A0"}
              </button>
            ))}
          </div>
        </div>

  {/* Statystyki */}
  <div className="mt-10 w-full max-w-md text-center">
    <div className="mb-4 text-xl font-bold text-white"></div>
    <div className="flex justify-around gap-4">
      <div className="text-center group cursor-pointer">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
          ✅
        </div>
        <div className="text-2xl font-bold text-white">{score}</div>
        <div className="text-xs text-gray-400">Punkty</div>
      </div>
      <div className="text-center group cursor-pointer">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-400/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm rounded-xl mb-2 group-hover:scale-110 transition-transform">
          ❌
        </div>
        <div className="text-2xl font-bold text-white">{errors}</div>
        <div className="text-xs text-gray-400">Błędy</div>
      </div>
    </div>
    <div className="mt-4">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/10">
        <div 
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${words.length > 0 ? (usedIds.length / words.length) * 100 : 0}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Reset */}
  <button
    onClick={resetGame}
    className="m-8 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
  >
    🔄 Zagraj ponownie
  </button>
    {/* Wybór kategorii */}
  <div className="mb-6 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 animate-fade-in">
    <label htmlFor="category" className="block text-sm font-medium mb-2 text-purple-400">
      Wybierz kategorię:
    </label>
    <select
      id="category"
      value={category.name}
      onChange={(e) => {
        const selectedCategory = Categories.find(cat => cat.name === e.target.value);
        if (selectedCategory) setCategory(selectedCategory);
      }}
      className="w-full px-6 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border-white/20"
    >
      {Categories.map((cat) => (
        <option key={cat.name} value={cat.name} className="bg-gray-900">
          {cat.name}
        </option>
      ))}
    </select>
    <p className="text-sm text-gray-400 mt-2">{category.description}</p>
  </div>
</div>


    </>
  );
}
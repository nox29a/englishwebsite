"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  addCustomCategory,
  buildCategoryFromWordList,
} from "@/lib/customCategories";

const formatWordListForClipboard = (words: Array<{ word: string; count: number }>) =>
  words.map(({ word, count }) => `${word} (${count})`).join("\n");

export default function YoutubeCategoriesPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<Array<{ word: string; count: number }>>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { language } = useLanguage();
  const router = useRouter();

  const hasResults = words.length > 0;

  const topWords = useMemo(() => words.slice(0, 50), [words]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!videoUrl.trim()) {
      setError("Wklej najpierw link do filmu z YouTube.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      setWords([]);

      const response = await fetch("/api/youtube-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = typeof payload?.error === "string" ? payload.error : "Nie udało się pobrać transkrypcji.";
        throw new Error(message);
      }

      const data = (await response.json()) as { words: Array<{ word: string; count: number }> };
      setWords(data.words);
      setSuccessMessage(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatWordListForClipboard(words));
    } catch (err) {
      console.error("Nie udało się skopiować listy", err);
      setError("Nie udało się skopiować listy do schowka.");
    }
  };

  const handleCreateCategory = async () => {
    if (!hasResults) {
      setError("Najpierw wygeneruj listę słówek z filmu.");
      setSuccessMessage(null);
      return;
    }

    const defaultName = `YouTube ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const categoryName = window.prompt(
      "Podaj nazwę nowej kategorii fiszek",
      defaultName
    );

    if (categoryName === null) {
      return;
    }

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Nazwa kategorii nie może być pusta.");
      setSuccessMessage(null);
      return;
    }

    const description = videoUrl
      ? `Słówka wygenerowane z filmu: ${videoUrl}`
      : "Słówka wygenerowane z YouTube";

    try {
      setCreatingCategory(true);
      const category = await buildCategoryFromWordList(topWords, {
        name: trimmedName,
        description,
        language,
      });

      const savedCategory = addCustomCategory(language, category);

      setSuccessMessage(
        `Nowa kategoria "${savedCategory.name}" została zapisana. Przechodzę do fiszek.`
      );
      setError(null);

      router.push("/flashcards");
    } catch (err) {
      console.error("Nie udało się utworzyć kategorii", err);
      setError(
        "Nie udało się utworzyć kategorii. Spróbuj ponownie za chwilę."
      );
      setSuccessMessage(null);
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#cbd5f5] to-[#93c5fd] bg-clip-text text-transparent">
            Kategorie z YouTube
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl">
            Wklej link do filmu na YouTube, a my spróbujemy pobrać napisy i wyciągnąć z nich najczęściej używane słowa.
            Taka lista świetnie nada się jako inspiracja do stworzenia nowej kategorii fiszek.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur">
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-slate-300 mb-2">Link do filmu</span>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/60"
              />
            </label>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] font-semibold shadow-[0_10px_30px_rgba(29,78,216,0.35)] hover:shadow-[0_15px_40px_rgba(29,78,216,0.45)] transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analizuję..." : "Generuj słowa"}
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Upewnij się, że film ma dostępne napisy (najlepiej po angielsku). Obsługiwane są także linki w formacie krótkim (youtu.be).
          </p>
        </form>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-2xl">
            {successMessage}
          </div>
        )}

        {hasResults && (
          <div className="mt-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <h2 className="text-2xl font-semibold text-slate-100">Najczęściej używane słowa</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition"
                >
                  Skopiuj listę
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] text-sm font-semibold shadow-[0_8px_24px_rgba(29,78,216,0.35)] hover:shadow-[0_12px_32px_rgba(29,78,216,0.45)] transition disabled:opacity-60"
                >
                  {creatingCategory ? "Zapisuję..." : "Utwórz kategorię fiszek"}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {topWords.map(({ word, count }) => (
                <div key={word} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-100">{word}</span>
                  <span className="text-sm text-slate-400">{count}×</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              Pokazujemy maksymalnie 50 najpopularniejszych słów. Pełna lista jest kopiowana do schowka wraz z licznością,
              aby łatwiej było przygotować nową kategorię.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

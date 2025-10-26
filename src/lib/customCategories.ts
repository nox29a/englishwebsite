import type {
  Category,
  LearningLanguage,
  Word,
} from "@/components/words/language_packs";
import { LANGUAGE_DATASETS } from "@/components/words/language_packs";

const STORAGE_KEY = "custom-flashcard-categories-v1";
export const CUSTOM_FLASHCARD_EVENT = "axon:custom-flashcards-update";

export type StoredCustomCategories = Partial<Record<LearningLanguage, Category[]>>;

const DEFAULT_DATA: StoredCustomCategories = { en: [], de: [], es: [] };

const safeParse = (value: string | null): StoredCustomCategories => {
  if (!value) {
    return { ...DEFAULT_DATA };
  }

  try {
    const parsed = JSON.parse(value) as StoredCustomCategories;

    if (parsed && typeof parsed === "object") {
      return {
        ...DEFAULT_DATA,
        ...parsed,
      };
    }

    return { ...DEFAULT_DATA };
  } catch (error) {
    console.warn("Nie udało się odczytać zapisanych kategorii fiszek", error);
    return { ...DEFAULT_DATA };
  }
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("Brak dostępu do localStorage", error);
    return null;
  }
};

export const loadCustomCategories = (): StoredCustomCategories => {
  const storage = getStorage();

  if (!storage) {
    return { ...DEFAULT_DATA };
  }

  const stored = storage.getItem(STORAGE_KEY);
  return safeParse(stored);
};

const persistCustomCategories = (data: StoredCustomCategories) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(CUSTOM_FLASHCARD_EVENT));
};

export const getCustomCategoriesForLanguage = (
  language: LearningLanguage
): Category[] => {
  const data = loadCustomCategories();
  return [...(data[language] ?? [])];
};

export const addCustomCategory = (
  language: LearningLanguage,
  category: Category
): Category => {
  const data = loadCustomCategories();
  const existing = data[language] ?? [];

  const baseName = category.name.trim();
  let finalName = baseName.length > 0 ? baseName : "Nowa kategoria";
  let suffix = 2;

  while (existing.some((item) => item.name === finalName)) {
    finalName = `${baseName} (${suffix})`;
    suffix += 1;
  }

  const finalCategory: Category = {
    ...category,
    name: finalName,
  };

  const updated: StoredCustomCategories = {
    ...data,
    [language]: [...existing, finalCategory],
  };

  persistCustomCategories(updated);

  return finalCategory;
};

const normalizeWord = (value: string): string =>
  value
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, "");

const buildPolishTranslationMap = (): Record<
  LearningLanguage,
  Map<string, string>
> => {
  return (Object.keys(LANGUAGE_DATASETS) as LearningLanguage[]).reduce(
    (acc, lang) => {
      const map = new Map<string, string>();
      LANGUAGE_DATASETS[lang].forEach((category) => {
        category.words.forEach((word) => {
          const normalized = normalizeWord(word.en);
          if (!normalized) {
            return;
          }
          if (!map.has(normalized)) {
            map.set(normalized, word.pl);
          }
        });
      });

      acc[lang] = map;
      return acc;
    },
    {} as Record<LearningLanguage, Map<string, string>>
  );
};

const POLISH_TRANSLATIONS = buildPolishTranslationMap();

const translationCache = new Map<string, string>();

const getLocalTranslation = (
  language: LearningLanguage,
  word: string
): string | null => {
  const normalized = normalizeWord(word);
  if (!normalized) {
    return null;
  }

  const dictionary = POLISH_TRANSLATIONS[language];
  return dictionary?.get(normalized) ?? null;
};

const fetchTranslationFromApi = async (
  language: LearningLanguage,
  word: string
): Promise<string | null> => {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: word,
        sourceLanguage: language,
        targetLanguage: "pl",
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as
      | { translation: string }
      | { error: string };

    if ("translation" in payload && typeof payload.translation === "string") {
      return payload.translation.trim();
    }

    return null;
  } catch (error) {
    console.warn("Nie udało się pobrać tłumaczenia z API", error);
    return null;
  }
};

const getPolishTranslation = async (
  language: LearningLanguage,
  word: string
): Promise<string> => {
  const cacheKey = `${language}:${normalizeWord(word)}`;

  if (cacheKey && translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const localTranslation = getLocalTranslation(language, word);

  if (localTranslation) {
    translationCache.set(cacheKey, localTranslation);
    return localTranslation;
  }

  const apiTranslation = await fetchTranslationFromApi(language, word);

  if (apiTranslation) {
    translationCache.set(cacheKey, apiTranslation);
    return apiTranslation;
  }

  translationCache.set(cacheKey, word);
  return word;
};

export const buildCategoryFromWordList = async (
  words: Array<{ word: string; count: number }>,
  options: {
    name: string;
    description?: string;
    language: LearningLanguage;
  }
): Promise<Category> => {
  const timestamp = Date.now();

  const mappedWords: Word[] = await Promise.all(
    words.map(async ({ word, count }, index) => {
      const difficulty =
        count >= 6 ? "easy" : count >= 3 ? "medium" : "hard";
      const polishTranslation = await getPolishTranslation(
        options.language,
        word
      );

      return {
        id: timestamp * 100 + index,
        pl: polishTranslation,
        en: word,
        level: difficulty,
      };
    })
  );

  return {
    name: options.name.trim() || "Nowa kategoria",
    description: options.description ?? "Słówka wygenerowane z YouTube",
    words: mappedWords,
  };
};

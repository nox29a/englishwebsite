"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Categories } from "@/components/words/flashcards_words";
import { ChevronRight, Mic, Volume2, RotateCcw, Play, Pause, Settings, CheckCircle2, XCircle, Trophy, Brain, Clock, Target } from 'lucide-react';

export default function FlashcardGame() {
  const [category, setCategory] = useState(Categories[0].name);
  const [level, setLevel] = useState("easy");
  const [direction, setDirection] = useState("pl-en");
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState([]);
  const [current, setCurrent] = useState({ id: -1, pl: "", en: "", level: "" });
  const [score, setScore] = useState(0);
  const [feedbackState, setFeedbackState] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  // Speech recognition
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window).SpeechRecognition ||
        (window).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (e) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };
      }
    }
  }, [direction]);

  // Text-to-speech
  const speak = (text, lang) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.lang = direction === "pl-en" ? "en-US" : "pl-PL";
        recognitionRef.current.start();
      } catch (err) {
        console.error("Cannot start recognition:", err);
        setIsListening(false);
      }
    }
  };

  const playPrompt = () => {
    const prompt = direction === "pl-en" ? current.pl : current.en;
    const lang = direction === "pl-en" ? "pl-PL" : "en-US";
    speak(prompt, lang);
  };

  const getWords = () => {
    const selectedCategory = Categories.find(c => c.name === category);
    if (!selectedCategory) return [];
    return selectedCategory.words.filter(word => word.level === level);
  };

  const getAvailableLevels = () => {
    const selectedCategory = Categories.find(c => c.name === category);
    if (!selectedCategory) return [];
    const levels = new Set(selectedCategory.words.map(word => word.level));
    return Array.from(levels);
  };

  const getRandomWord = (words) => {
    if (words.length === 0) return { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const loadProgress = () => {
    setLoading(true);
    
    const levels = getAvailableLevels();
    setAvailableLevels(levels);
    
    let currentLevel = level;
    if (levels.length > 0 && !levels.includes(level)) {
      currentLevel = levels[0];
      setLevel(currentLevel);
    }

    const words = getWords().filter(word => word.level === currentLevel);
    const randomWord = words.length > 0 ? getRandomWord(words) : { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    
    setRemaining(words);
    setCurrent(randomWord);
    setScore(0);
    setTotalTimeSpent(0);
    setSessionStartTime(Date.now());
    setLoading(false);
  };

  useEffect(() => {
    if (current.id !== -1) {
      setInput("");
      setFeedbackState("");
      setCorrectAnswer("");
    } else {
      loadProgress();
    }
  }, [direction]);

  useEffect(() => {
    loadProgress();
  }, [category, level]);

  const handleSubmit = () => {
    if (current.id === -1) return;

    const wordToCheck = remaining.find((w) => w.id === current.id) || current;
    const correct = direction === "pl-en" ? wordToCheck.en.toLowerCase().trim() : wordToCheck.pl.toLowerCase().trim();
    const userAnswer = input.trim().toLowerCase();
    const isCorrect = userAnswer === correct;

    let updatedList = remaining;

    if (isCorrect) {
      setFeedbackState("correct");
      updatedList = remaining.filter((word) => word.id !== wordToCheck.id);
      setScore((prev) => prev + 1);
    } else {
      setFeedbackState("incorrect");
      setCorrectAnswer(correct);
    }

    if (updatedList.length === 0) {
      setTimeout(() => {
        setCurrent({ id: -1, pl: "Koniec!", en: "The End!", level: "" });
        setFeedbackState("");
        setCorrectAnswer("");
        setInput("");
        setRemaining([]);
        setTotalTimeSpent(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
      return;
    }

    const delay = isCorrect ? 1000 : 3000;

    setTimeout(() => {
      const next = getRandomWord(updatedList);
      setCurrent(next);
      setFeedbackState("");
      setCorrectAnswer("");
      setInput("");
      setRemaining(updatedList);
    }, delay);
  };

  const resetGame = () => {
    const newWords = getWords();
    const randomWord = newWords.length > 0 ? getRandomWord(newWords) : { id: -1, pl: "Brak fiszek", en: "No flashcards", level: "" };
    setRemaining(newWords);
    setCurrent(randomWord);
    setInput("");
    setScore(0);
    setFeedbackState("");
    setCorrectAnswer("");
    setTotalTimeSpent(0);
    setSessionStartTime(Date.now());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium">Ładowanie postępów...</p>
      </div>
    );
  }

  const progressPercentage = getWords().length > 0 ? (score / getWords().length) * 100 : 0;
  const feedbackClasses = {
    correct: "border-green-500 bg-green-50 dark:bg-green-900/20",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-900/20",
    default: "border-gray-300 dark:border-gray-700"
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Postęp: {score}/{getWords().length}</span>
              <span>{Math.floor((Date.now() - sessionStartTime) / 60000)} min</span>
            </div>
          </div>

          {/* Main Game Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
            
            {/* Word Display */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700/50">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {direction === "pl-en" ? current.pl : current.en}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {direction === "pl-en" ? "Przetłumacz na angielski" : "Przetłumacz na polski"}
                </p>
                
                {/* Audio Button */}
                <button
                  onClick={playPrompt}
                  disabled={current.id === -1}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Odsłuchaj
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    feedbackClasses[feedbackState] || feedbackClasses.default
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Wpisz tłumaczenie..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  disabled={current.id === -1}
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={startListening}
                    disabled={isListening || current.id === -1}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                      isListening 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={current.id === -1}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {input ? "Sprawdź" : "Dalej"}
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {correctAnswer && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-300 font-medium">Niepoprawnie</span>
                </div>
                <p className="text-red-600 dark:text-red-400">
                  Poprawna odpowiedź: <span className="font-semibold">{correctAnswer}</span>
                </p>
              </div>
            )}

            {feedbackState === "correct" && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 dark:text-green-300 font-medium">Poprawnie!</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-2">
                    <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Poprawne</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-2">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{getWords().length - score}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Pozostało</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg mb-2">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor((Date.now() - sessionStartTime) / 60000)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Minut</div>
                </div>
              </div>

              <button 
                onClick={resetGame} 
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>

            {/* Completion Message */}
            {current.id === -1 && current.pl === "Koniec!" && (
              <div className="mt-8 text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Gratulacje!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Ukończyłeś wszystkie fiszki w tej kategorii!</p>
              </div>
            )}
          </div>

          {/* Settings Cards */}
          <div className="grid gap-6">
            
            {/* Category Selection */}


            {/* Level & Direction */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Level Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Poziom
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {["easy", "medium", "hard"].map((lvl) => {
                    const isAvailable = availableLevels.includes(lvl);
                    const isSelected = level === lvl;
                    const levelLabels = { easy: "Łatwy", medium: "Średni", hard: "Trudny" };
                    const levelColors = { 
                      easy: "text-green-600", 
                      medium: "text-amber-600", 
                      hard: "text-red-600" 
                    };
                    
                    return (
                      <button
                        key={lvl}
                        onClick={() => isAvailable && setLevel(lvl)}
                        disabled={!isAvailable}
                        className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-green-600 text-white shadow-sm"
                            : isAvailable
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        <div className={`text-lg mb-1 ${isSelected ? 'text-white' : levelColors[lvl]}`}>
                          {lvl === 'easy' ? '●' : lvl === 'medium' ? '●●' : '●●●'}
                        </div>
                        {levelLabels[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direction Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-violet-600" />
                  Kierunek
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDirection("pl-en")}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      direction === "pl-en"
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="text-lg mb-1">🇵🇱 → 🇬🇧</div>
                    PL → EN
                  </button>
                  <button
                    onClick={() => setDirection("en-pl")}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      direction === "en-pl"
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="text-lg mb-1">🇬🇧 → 🇵🇱</div>
                    EN → PL
                  </button>
                </div>
              </div>
              
            </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Kategoria
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      category === cat.name
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
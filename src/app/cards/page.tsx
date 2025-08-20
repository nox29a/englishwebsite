"use client"
// pages/index.tsx
import { useState, useEffect } from 'react';
import { easy, medium, hard } from '@/components/words/flashcards_words';

interface Flashcard {
  en: string;
  pl: string;
}

export default function Flashcards() {
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [direction, setDirection] = useState<string>('enToPl');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(100);

  // Funkcja do tasowania kart z typami TypeScript
  const shuffleArray = (array: Flashcard[]): Flashcard[] => {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Ładowanie i tasowanie kart przy zmianie trudności
  useEffect(() => {
    let selectedWords: Flashcard[];
    switch (difficulty) {
      case 'easy':
        selectedWords = easy || [];
        break;
      case 'medium':
        selectedWords = medium || [];
        break;
      case 'hard':
        selectedWords = hard || [];
        break;
      default:
        selectedWords = easy || [];
    }
    
    setCards(shuffleArray(selectedWords));
    setFlippedCards({});
    setVisibleCount(100);
  }, [difficulty]);

  // Funkcja do ładowania kolejnych fiszek
  const loadMoreCards = (): void => {
    setVisibleCount(prevCount => prevCount + 100);
  };

  // Obsługa odwracania karty
  const handleCardClick = (index: number): void => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-10">Fiszki do nauki angielskiego</h1>
        
        {/* Kontrolki wyboru */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">Poziom trudności:</label>
            <select 
              value={difficulty} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">Łatwy</option>
              <option value="medium">Średni</option>
              <option value="hard">Trudny</option>
            </select>
          </div>
          
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">Kierunek tłumaczenia:</label>
            <select 
              value={direction} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDirection(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="enToPl">Angielski → Polski</option>
              <option value="plToEn">Polski → Angielski</option>
            </select>
          </div>
        </div>
        
        {/* Kontener fiszek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.slice(0, visibleCount).map((card: Flashcard, index: number) => (
            <div 
              key={index} 
              className="card-container h-64 cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              <div className={`card relative w-full h-full transition-all duration-500 ${flippedCards[index] ? 'is-flipped' : ''}`}>
                {/* Przód karty */}
                <div className="card-face card-front absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center border border-gray-700">
                  <div className="text-xs text-blue-400 mb-2 uppercase tracking-wider">
                    {direction === 'enToPl' ? 'Angielskie' : 'Polskie'}
                  </div>
                  <p className="text-2xl font-semibold text-center text-white">
                    {direction === 'enToPl' ? card.en : card.pl}
                  </p>
                  <div className="absolute bottom-3 text-gray-500 text-sm">
                    Kliknij aby obrócić
                  </div>
                </div>
                
                {/* Tył karty */}
                <div className="card-face card-back absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center border border-blue-700">
                  <div className="text-xs text-blue-300 mb-2 uppercase tracking-wider">
                    {direction === 'enToPl' ? 'Polskie' : 'Angielskie'}
                  </div>
                  <p className="text-2xl font-semibold text-center text-white">
                    {direction === 'enToPl' ? card.pl : card.en}
                  </p>
                  <div className="absolute bottom-3 text-blue-300 text-sm">
                    Kliknij aby obrócić
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Przycisk "Pokaż więcej" */}
        {visibleCount < cards.length && (
          <div className="flex justify-center mt-10">
            <button 
              onClick={loadMoreCards}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Pokaż więcej ({cards.length - visibleCount} pozostałych)
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .card-container {
          perspective: 1000px;
        }
        
        .card {
          transform-style: preserve-3d;
          position: relative;
        }
        
        .card-face {
          backface-visibility: hidden;
          transition: transform 0.5s ease-in-out;
        }
        
        .card-front {
          transform: rotateY(0deg);
        }
        
        .card-back {
          transform: rotateY(180deg);
        }
        
        .is-flipped .card-front {
          transform: rotateY(-180deg);
        }
        
        .is-flipped .card-back {
          transform: rotateY(0deg);
        }
      `}</style>
    </div>
  );
}
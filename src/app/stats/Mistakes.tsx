import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Interfejsy danych
interface QuestionAttempt {
  id: string;
  user_id: string;
  question_type: string;
  question_id: string;
  is_correct: boolean;
  time_taken: number;
  difficulty: string;
  created_at: string;
}

interface Word {
  id: number;
  pl: string;
  en: string;
  difficulty?: string; // Dodano pole do przechowywania poziomu trudności
}

// Dane słówek
import { easy } from '@/components/words/flashcards_words';
import { medium } from '@/components/words/flashcards_words';
import { hard } from '@/components/words/flashcards_words';

// Dodanie poziomu trudności do każdego słowa
const easyWithDifficulty: Word[] = easy.map(word => ({ ...word, difficulty: 'easy' }));
const mediumWithDifficulty: Word[] = medium.map(word => ({ ...word, difficulty: 'medium' }));
const hardWithDifficulty: Word[] = hard.map(word => ({ ...word, difficulty: 'hard' }));

// Połącz wszystkie słowniki w jeden
const allWords: Word[] = [...easyWithDifficulty, ...mediumWithDifficulty, ...hardWithDifficulty];

// Komponent główny
export default function ErrorStatistics() {
  const [errorWords, setErrorWords] = useState<Word[]>([]);
  const [errorAttempts, setErrorAttempts] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Pobieranie danych z Supabase
  useEffect(() => {
    const fetchErrorStatistics = async () => {
      setLoading(true);
      
      try {
        // Pobierz próby odpowiedzi z błędami
        let query = supabase
          .from('question_attempts')
          .select('*')
          .eq('is_correct', false)
          .order('created_at', { ascending: false });

        // Jeśli wybrano konkretny poziom trudności, dodaj filtr
        if (selectedDifficulty !== 'all') {
          query = query.eq('difficulty', selectedDifficulty);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setErrorAttempts(data);
          
          // Znajdź słowa, które odpowiadają błędnym odpowiedziom
          const wordsWithErrors: Word[] = [];
          
          data.forEach(attempt => {
            // Znajdź słowo na podstawie ID i poziomu trudności
            const word = allWords.find(w => 
              w.id.toString() === attempt.question_id && w.difficulty === attempt.difficulty
            );
            
            if (word && !wordsWithErrors.some(w => w.id === word.id && w.difficulty === word.difficulty)) {
              wordsWithErrors.push(word);
            }
          });
          
          setErrorWords(wordsWithErrors);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchErrorStatistics();
  }, [selectedDifficulty]);

  // Filtrowanie słów według trudności
  const filteredWords = selectedDifficulty === 'all' 
    ? errorWords 
    : errorWords.filter(word => word.difficulty === selectedDifficulty);

  // Filtrowanie według czasu
  const furtherFilteredWords = timeFilter === 'all' 
    ? filteredWords 
    : filteredWords.filter(word => {
        const attemptsForWord = errorAttempts.filter(attempt => 
          attempt.question_id === word.id.toString() && attempt.difficulty === word.difficulty
        );
        
        // Sprawdź czy którakolwiek próba mieści się w wybranym przedziale czasowym
        return attemptsForWord.some(attempt => {
          const attemptDate = new Date(attempt.created_at);
          const now = new Date();
          
          if (timeFilter === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return attemptDate >= oneWeekAgo;
          } else if (timeFilter === 'month') {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return attemptDate >= oneMonthAgo;
          }
          
          return true;
        });
      });

  // Funkcja do formatowania daty
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Funkcja do tłumaczenia poziomu trudności
  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Łatwy';
      case 'medium': return 'Średni';
      case 'hard': return 'Trudny';
      default: return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300 mx-auto"></div>
          <p className="mt-2 text-indigo-200 text-sm">Ładowanie statystyk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-900 rounded-xl shadow-lg p-4">
      {/* Nagłówek */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white">Statystyki błędów</h1>
        <p className="text-indigo-200 text-sm">Słowa, w których popełniłeś błędy</p>
      </div>
      
      {/* Filtry */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="difficulty" className="block text-xs font-medium text-indigo-200 mb-1">
            Poziom trudności
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="block w-full pl-2 pr-8 py-1.5 text-xs bg-indigo-800 border-indigo-700 text-indigo-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Wszystkie</option>
            <option value="easy">Łatwy</option>
            <option value="medium">Średni</option>
            <option value="hard">Trudny</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="time" className="block text-xs font-medium text-indigo-200 mb-1">
            Przedział czasowy
          </label>
          <select
            id="time"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="block w-full pl-2 pr-8 py-1.5 text-xs bg-indigo-800 border-indigo-700 text-indigo-100 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Cały czas</option>
            <option value="week">Ostatni tydzień</option>
            <option value="month">Ostatni miesiąc</option>
          </select>
        </div>
      </div>
      
      {/* Lista słów z błędami */}
      <div className="mb-4">
        {furtherFilteredWords.length === 0 ? (
          <div className="text-center py-4 bg-indigo-800/50 rounded-lg">
            <svg className="mx-auto h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-1 text-sm font-medium text-indigo-200">Brak błędów!</h3>
            <p className="text-xs text-indigo-300">Świetna robota!</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-60 rounded-lg">
            <table className="min-w-full divide-y divide-indigo-700/50">
              <thead className="bg-indigo-800/40">
                <tr>
                  <th scope="col" className="py-2 pl-3 pr-1 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    EN
                  </th>
                  <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    PL
                  </th>
                  <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    Poziom
                  </th>
                  <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    Ostatni błąd
                  </th>
                  <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    Błędy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-indigo-800/20 divide-y divide-indigo-700/30">
                {furtherFilteredWords.map((word) => {
                  const attemptsForWord = errorAttempts.filter(attempt => 
                    attempt.question_id === word.id.toString() && attempt.difficulty === word.difficulty
                  );
                  
                  const lastErrorDate = attemptsForWord.length > 0 
                    ? new Date(attemptsForWord[0].created_at) 
                    : null;
                  
                  return (
                    <tr key={`${word.id}-${word.difficulty}`} className="hover:bg-indigo-700/30 transition-colors">
                      <td className="py-2 pl-3 pr-1 whitespace-nowrap text-sm font-medium text-white">
                        {word.en}
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm text-indigo-100">
                        {word.pl}
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          word.difficulty === 'easy' ? 'bg-green-800/40 text-green-300' :
                          word.difficulty === 'medium' ? 'bg-yellow-800/40 text-yellow-300' :
                          'bg-red-800/40 text-red-300'
                        }`}>
                          {translateDifficulty(word.difficulty || '')}
                        </span>
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-xs text-indigo-200">
                        {lastErrorDate ? formatDate(lastErrorDate.toISOString()) : '-'}
                      </td>
                      <td className="px-1 py-2 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-800/40 text-red-300">
                          {attemptsForWord.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Podsumowanie */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-indigo-700/50">
        <div className="text-center">
          <p className="text-xs text-indigo-300">Łączne błędy</p>
          <p className="text-lg font-bold text-white">{errorAttempts.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-indigo-300">Słowa z błędami</p>
          <p className="text-lg font-bold text-white">{furtherFilteredWords.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-indigo-300">Średnia błędów</p>
          <p className="text-lg font-bold text-white">
            {furtherFilteredWords.length > 0 
              ? (errorAttempts.length / furtherFilteredWords.length).toFixed(1)
              : '0'}
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Navbar from '@/components/Navbar';


import { easy } from '@/components/words/flashcards_words';
import { medium } from '@/components/words/flashcards_words';
import { hard } from '@/components/words/flashcards_words';

export default function FlashcardGame() {
  const [level, setLevel] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [direction, setDirection] = useState<'pl-en' | 'en-pl'>('pl-en');
  const [input, setInput] = useState('');
  const [remaining, setRemaining] = useState(easy);
  const [current, setCurrent] = useState(easy[0]);
  const [score, setScore] = useState(0);
  const [feedbackColor, setFeedbackColor] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);

  // Pobierz postępy z bazy danych
  const loadProgress = async () => {
    setLoading(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('flashcards_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('level', level)
      .eq('direction', direction)
      .single();

    if (error || !data) {
      // Jeśli nie ma postępów, zacznij od początku
      setRemaining(getWords());
      setCurrent(getWords()[0]);
      setScore(0);
      setTotalTimeSpent(0);
    } else {
      // Przywróć zapisane postępy
      const remainingWords = getWords().filter(word => 
        data.remaining_ids.includes(word.id)
      );
      setRemaining(remainingWords);
      setCurrent(remainingWords[0] || getWords()[0]);
      setScore(data.correct_answers);
      setTotalTimeSpent(data.time_spend || 0);
    }
    setStartTime(new Date()); // Rozpocznij mierzenie czasu
    setLoading(false);
  };

  // Zapisz postępy do bazy danych
  const saveProgress = async () => {
    if (!startTime) return;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return;
    }

    // Oblicz czas spędzony od ostatniego zapisu
    const currentTime = new Date();
    const timeSpentSinceLastSave = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000); // w sekundach
    const newTotalTimeSpent = totalTimeSpent + timeSpentSinceLastSave;

    const progressData = {
      user_id: user.id,
      level,
      direction,
      remaining_ids: remaining.map(word => word.id),
      correct_answers: score,
      total_answers: score + (getWords().length - remaining.length),
      time_spend: newTotalTimeSpent,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('flashcards_progress')
      .upsert(progressData, { onConflict: 'user_id,level,direction' });

    if (error) {
      console.error('Error saving progress:', error);
    } else {
      setTotalTimeSpent(newTotalTimeSpent);
      setStartTime(new Date()); // Zresetuj czas rozpoczęcia
    }
  };

  useEffect(() => {
    loadProgress();

    // Zapisz czas przy odmontowaniu komponentu
    return () => {
      if (startTime) {
        saveProgress().catch(console.error);
      }
    };
  }, [level, direction]);

  useEffect(() => {
    if (!loading) {
      saveProgress();
    }
  }, [remaining, score]);

  const getWords = () => level === 'Easy' ? easy : level === 'Medium' ? medium : hard;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correct = direction === 'pl-en' ? current.en.toLowerCase() : current.pl.toLowerCase();
    const userAnswer = input.trim().toLowerCase();

    let nextDelay = 500;
    let updatedList = remaining;

    if (userAnswer === correct) {
      setFeedbackColor('bg-green-500');
      updatedList = remaining.filter(word => word.id !== current.id);
      setScore(prev => prev + 1);
    } else {
      setFeedbackColor('bg-red-500');
      setCorrectAnswer(correct);
      nextDelay = 1500;
    }

    const next = updatedList[Math.floor(Math.random() * updatedList.length)] || getWords()[0];
    setTimeout(() => {
      setCurrent(next);
      setFeedbackColor('');
      setCorrectAnswer('');
      setInput('');
      setRemaining(updatedList);
    }, nextDelay);
  };

  const resetGame = () => {
    const newWords = getWords();
    setRemaining(newWords);
    setCurrent(newWords[0]);
    setInput('');
    setScore(0);
    setFeedbackColor('');
    setCorrectAnswer('');
    setTotalTimeSpent(0);
    setStartTime(new Date());
  };

  const handleLevelChange = (lvl: 'Easy' | 'Medium' | 'Hard') => {
    setLevel(lvl);
  };

  const handleDirectionChange = (dir: 'pl-en' | 'en-pl') => {
    setDirection(dir);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e1a] text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        <p className="mt-4">Ładowanie postępów...</p>
      </div>
    );
  }

  return (
          <>
          <Navbar />
    <div className="min-h-screen bg-[#0e0e1a] text-white flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">FISZKI</h1>

      <div className="text-sm text-gray-400">Wybierz poziom trudności:</div>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          onClick={() => handleLevelChange('Easy')} 
          className={`rounded-full px-4 py-2 text-sm transition-colors ${level === 'Easy' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          1000 słów
        </Button>
        <Button 
          onClick={() => handleLevelChange('Medium')} 
          className={`rounded-full px-4 py-2 text-sm transition-colors ${level === 'Medium' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          3000 słów
        </Button>
        <Button 
          onClick={() => handleLevelChange('Hard')} 
          className={`rounded-full px-4 py-2 text-sm transition-colors ${level === 'Hard' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          Poziom C1
        </Button>
      </div>

      <div className="text-sm text-gray-400">Wybierz kierunek tłumaczenia:</div>
      <div className="flex space-x-4">
        <Button 
          onClick={() => handleDirectionChange('pl-en')} 
          className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${direction === 'pl-en' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          <span>🇵🇱 Polski</span>
        </Button>
        <Button 
          onClick={() => handleDirectionChange('en-pl')} 
          className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${direction === 'en-pl' ? 'bg-blue-500 text-white hover:bg-yellow-400' : 'bg-white text-black hover:bg-yellow-400'}`}
        >
          <span>🇬🇧 Angielski</span>
        </Button>
      </div>

      <div className={`text-2xl font-semibold text-blue-400 px-6 py-2 rounded`}>
        {direction === 'pl-en' ? current.pl : current.en}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-4">
        <Input
          className={`text-white transition-colors duration-200 ${feedbackColor}`}
          placeholder="Wpisz tłumaczenie..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <Button type="submit" className={`border border-white transition-colors duration-200 ${feedbackColor}`}>
          Sprawdź
        </Button>
      </form>

      {correctAnswer && (
        <div className="text-red-400 text-sm">
          Poprawna odpowiedź: <span className="font-semibold">{correctAnswer}</span>
        </div>
      )}

      <div className="text-sm text-gray-400">
        Odgadnięte słowa: {score}
      </div>

      <div className="text-sm text-gray-400">
        Czas nauki: {Math.floor(totalTimeSpent / 60)} minut
      </div>

      <Button onClick={resetGame} variant="outline" className="text-white">
        Reset
      </Button>
    </div>
    </>
  );
}
'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  text: string;
  sender: 'npc' | 'player';
};

type Scenario = {
  id: string;
  name: string;
  start_message: string;
  description: string;
  systemPrompt: string;
  polishTranslation?: string; // Dodane pole dla polskiego tłumaczenia
};

type UserProfile = {
  id: string;
  user_type: 'basic' | 'premium';
};

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export default function GamePage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Wybierz scenariusz, aby zacząć rozmowę", sender: 'npc' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showScenarios, setShowScenarios] = useState(true);
  const [corrections, setCorrections] = useState<Record<number, string>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  
  const supabase = createClientComponentClient();

  const startRecognition = (setter: (val: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setter(transcript);
    };
  };


const scenarios: Scenario[] = [
  {
    id: 'travel',
    name: 'Travel Guide',
    description: 'Practice travel-related conversations',
    polishTranslation: 'Praktykuj rozmowy związane z podróżowaniem',
    start_message: 'Welcome to our travel agency! Where are you planning to travel, and how can I help you with your trip?',
    systemPrompt: `You are a friendly and knowledgeable travel agent named Alex. Your primary goal is to help a user practice their English by immersing them in a realistic travel planning scenario.`
  },
  {
    id: 'job',
    name: 'Job Interview',
    description: 'Simulate a job interview in English',
    polishTranslation: 'Symuluj rozmowę kwalifikacyjną po angielsku',
    start_message: 'Hello, thank you for coming in today. I\'m Sarah, a hiring manager here. To start, could you tell me a little about yourself and your background?',
    systemPrompt: `You are Sarah, a professional and perceptive hiring manager for a tech company. Your goal is to conduct a realistic job interview to help the user practice their English.`
  },
  {
    id: 'daily',
    name: 'Daily Life',
    description: 'Everyday conversations',
    polishTranslation: 'Codzienne rozmowy',
    start_message: 'Hey, it’s great to catch up! What have you been up to lately?',
    systemPrompt: `You are Mark, a friendly native English speaker and a casual acquaintance of the user. Your goal is to have a natural, everyday chat to help them practice conversational English.`
  },
  {
    id: 'restaurant',
    name: 'Restaurant Ordering',
    description: 'Practice conversations in a restaurant setting',
    polishTranslation: 'Praktykuj rozmowy w restauracji',
    start_message: 'Good evening! Welcome to "The Riverside Bistro." My name is Chloe, and I\'ll be your server tonight. Can I start you off with some drinks?',
    systemPrompt: `You are Chloe, a server at a mid-to-upscale restaurant. Your goal is to role-play a full dining experience so the user can practice relevant English.`
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    description: 'Simulate a medical consultation in English',
    polishTranslation: 'Symuluj wizytę u lekarza po angielsku',
    start_message: 'Hello, come in. I\'m Dr. Evans. Please have a seat. So, what seems to be the problem today?',
    systemPrompt: `You are Dr. Evans, a calm and thorough medical professional. Your goal is to simulate a doctor's appointment to help the user practice describing symptoms and understanding medical advice in English.`
  },
  {
    id: 'shopping',
    name: 'Shopping Experience',
    description: 'Practice shopping and bargaining conversations',
    polishTranslation: 'Praktykuj zakupy i targowanie się',
    start_message: 'Hi there! Welcome to "Urban Threads." I\'m Jake. Is there anything specific I can help you find today, or just browsing?',
    systemPrompt: `You are Jake, a helpful but not pushy sales assistant in a clothing store. Your goal is to role-play a shopping scenario, including assistance and light negotiation.`
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'Discuss school subjects and student life',
    polishTranslation: 'Dyskutuj o przedmiotach szkolnych i życiu studenckim',
    start_message: 'Hey! I\'m Sam, I think we have math together. That last lecture was tough, huh? How did you find the homework?',
    systemPrompt: `You are Sam, a fellow student at the user's school. Your goal is to have a natural peer-to-peer conversation about school life to practice relevant English.`
  },
  {
    id: 'emergency',
    name: 'Emergency Situations',
    description: 'Practice handling emergency scenarios in English',
    polishTranslation: 'Praktykuj radzenie sobie w sytuacjach awaryjnych',
    start_message: 'Emergency services, what is your exact location? ... Okay, I have help dispatching to 123 Main Street. Now, please stay calm and tell me exactly what happened.',
    systemPrompt: `You are a 911 dispatcher named Officer Miller. Your goal is to simulate a high-pressure emergency call to practice critical communication skills in English.`
  },
  {
    id: 'movies',
    name: 'Movie Discussion',
    description: 'Talk about films and TV shows',
    polishTranslation: 'Rozmawiaj o filmach i serialach',
    start_message: 'Oh my god, have you seen the new season of "Stranger Things" yet? I just binged it all weekend!',
    systemPrompt: `You are Jordan, a huge movie and TV enthusiast. Your goal is to have an excited, passionate conversation about entertainment to practice expressive English.`
  },
  {
    id: "tech_support",
    name: "Tech Support",
    description: "Practice solving technical problems over the phone",
    polishTranslation: "Praktykuj rozwiązywanie problemów technicznych przez telefon",
    start_message: "Hello, thank you for calling Streamline Tech Support. My name is Brian. I understand you're having issues with your internet connection. Can you describe what's happening?",
    systemPrompt: "You are Brian, a patient and methodical tech support agent. Your goal is to help the user practice explaining technical problems and following instructions in English."
  },
  {
    id: "gym",
    name: "At the Gym",
    description: "Practice talking about fitness, health, and workouts",
    polishTranslation: "Praktykuj rozmowy o fitnessie, zdrowiu i treningach",
    start_message: "Hey there! I'm Coach Mike. I see you're new here. What are your fitness goals? Want some help with your form on that exercise?",
    systemPrompt: "You are Coach Mike, an energetic and motivating personal trainer. Your goal is to help the user practice English in a gym context, discussing goals, exercises, and nutrition."
  },
  {
    id: "hotel",
    name: "Hotel Reception",
    description: "Practice checking into a hotel and making requests",
    polishTranslation: "Praktykuj zameldowanie w hotelu i składanie próśb",
    start_message: "Good afternoon! Welcome to the Grand Majesty Hotel. Do you have a reservation with us today?",
    systemPrompt: "You are Olivia, a receptionist at a luxury hotel. Your goal is to simulate the entire hotel check-in process and address guest requests."
  },
  {
    id: "environment",
    name: "Environmental Debate",
    description: "Discuss climate change and solutions (B2/C1 Level)",
    polishTranslation: "Dyskutuj o zmianach klimatu i rozwiązaniach (poziom B2/C1)",
    start_message: "Hi there. I've been reading a lot about renewable energy lately and how it's becoming more affordable. What's your take on the biggest environmental challenge we're facing?",
    systemPrompt: "You are David, a well-informed and passionate environmental science student. Your goal is to have a thoughtful debate/discussion on environmental issues to practice advanced English."
  },
  {
    id: "party",
    name: "Party Small Talk",
    description: "Practice the art of casual conversation at a social event",
    polishTranslation: "Praktykuj sztukę swobodnej konwersacji na imprezie",
    start_message: "Hey! I don't think we've met. I'm Chloe, a friend of Sarah's. So, how do you know the host?",
    systemPrompt: "You are Chloe, a sociable and chatty guest at a party. Your goal is to practice the flow of \"small talk\" – informal, light conversation with a stranger."
  }
];
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      
      // Użyj tej samej metody co w Navbar - bez createClientComponentClient
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        setIsCheckingLimit(false);
        return;
      }
      
      console.log('Auth user:', user);
      
      if (user) {
        // Dodaj logowanie do konsoli aby zobaczyć co zwraca zapytanie
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, user_type')
          .eq('id', user.id)
          .single();
        
        console.log('Profile data:', profile, 'Error:', error);
        
        if (error) {
          console.error('Profile fetch error:', error);
          setUserProfile({ id: user.id, user_type: 'basic' });
        } else if (profile) {
          // Normalizuj user_type do małych liter
          const normalizedUserType = profile.user_type?.toLowerCase() === 'premium' 
            ? 'premium' 
            : 'basic';
          
          console.log('Normalized user type:', normalizedUserType);
          
          setUserProfile({ 
            id: profile.id, 
            user_type: normalizedUserType 
          });
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsCheckingLimit(false);
    }
  };

  fetchUserProfile();
}, [supabase]);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowScenarios(false);
    setMessages([{
      text: `${scenario.start_message}`,
      sender: 'npc'
    }]);
    setCorrections({});
    setMessageCount(0);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    console.log('Sending message, current count:', messageCount, 'User type:', userProfile?.user_type);

    if (userProfile?.user_type === 'basic' && messageCount >= 3) {
      console.log('Message limit reached!');
      setMessages(prev => [...prev, {
        text: "🚀 Upgrade to Premium for unlimited messages! Contact support to unlock full access.",
        sender: 'npc'
      }]);
      setInput('');
      return;
    }

    const userMessage = { text: input, sender: 'player' as const };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    setMessageCount(prev => {
      const newCount = prev + 1;
      console.log('Increasing message count to:', newCount);
      return newCount;
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'anonymous' && user.id !== 'error') {
        await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            message: input,
            scenario: selectedScenario?.id || 'general',
            difficulty: selectedDifficulty // Zapisz poziom trudności
          });
      }

      // 1️⃣ Odpowiedź NPC - z poziomem trudności
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
          scenario: selectedScenario?.id,
          difficulty: selectedDifficulty, // Dodaj poziom trudności
          mode: 'npc'
        })
      });

      if (!response.ok) throw new Error('API response not OK');

      const { reply } = await response.json();
      setMessages(prev => [...prev, { text: reply, sender: 'npc' }]);
      setScore(prev => prev + 5);

      // 2️⃣ Korekta błędów językowych - z poziomem trudności
      const correctionResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: 'gpt-4o-mini',
          difficulty: selectedDifficulty, // Dodaj poziom trudności
          mode: 'correction'
        })
      });

      if (correctionResponse.ok) {
        const { reply: correctionReply, status: correctionStatus } = await correctionResponse.json();
        
        const userMessageIndex = newMessages.length - 1;

        const hasErrors = correctionStatus !== 0 && 
                         correctionReply.trim() !== '' && 
                         correctionReply.trim() !== input.trim();

        if (hasErrors) {
          setCorrections(prev => ({ ...prev, [userMessageIndex]: correctionReply }));
        } else {
          setCorrections(prev => {
            const newCorrections = { ...prev };
            delete newCorrections[userMessageIndex];
            return newCorrections;
          });
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: "⚠️ The tutor is unavailable right now. Please try again later.",
        sender: 'npc'
      }]);
      setMessageCount(prev => prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  const hasReachedLimit = userProfile?.user_type === 'basic' && messageCount >= 3;
  const showMessageInfo = userProfile?.user_type === 'basic' && messageCount > 0;

  if (isCheckingLimit) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white">
        <header className="sticky top-0 z-10 bg-gray-900 backdrop-blur-md p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Rozmowa z Agentem AI</h1>
            <div className="flex items-center gap-3">
              {showMessageInfo && (
                <div className="bg-yellow-600/50 px-3 py-1 rounded-lg text-sm">
                  {messageCount}/3 messages
                </div>
              )}
              {userProfile?.user_type === 'premium' && (
                <div className="bg-purple-600/50 px-3 py-1 rounded-lg text-sm">
                  ⭐ Premium
                </div>
              )}
              {userProfile?.user_type === 'basic' && (
                <div className="bg-blue-600/50 px-3 py-1 rounded-lg text-sm">
                  Basic
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4 flex flex-col h-[calc(100vh-140px)]">
          {/* Scenario Selector with Difficulty Level */}
          {showScenarios && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-indigo-800/50 p-6 rounded-xl backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Choose Learning Scenario</h2>
              
              {/* Difficulty Level Selector */}
              <div className="mb-6 bg-indigo-900/40 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Select Difficulty Level</h3>
                <div className="flex gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(level => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedDifficulty === level
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/60'
                      }`}
                      onClick={() => setSelectedDifficulty(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </motion.button>
                  ))}
                </div>
                <p className="text-indigo-300 text-sm mt-2">
                  {selectedDifficulty === 'beginner' && 'Basic vocabulary and simple sentences'}
                  {selectedDifficulty === 'intermediate' && 'Intermediate vocabulary and more complex sentences'}
                  {selectedDifficulty === 'advanced' && 'Advanced vocabulary and complex grammatical structures'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-indigo-700/50 hover:bg-indigo-600/70 p-4 rounded-lg cursor-pointer border border-indigo-600/30"
                    onClick={() => startScenario(scenario)}
                  >
                    <h3 className="font-bold text-lg">{scenario.name}</h3>
                    <p className="text-indigo-200 text-sm mt-2">{scenario.description}</p>
                    {/* Dodane polskie tłumaczenie */}
                    {scenario.polishTranslation && (
                      <p className="text-indigo-300 text-xs mt-1 italic">
                        {scenario.polishTranslation}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-indigo-300">
                      Difficulty: {selectedDifficulty}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2">
            {messages.map((msg, i) => {
              const hasCorrection = msg.sender === 'player' && corrections[i] && corrections[i].trim() !== '';
              
              return (
                <div key={i} className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'npc' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-lg relative ${
                      msg.sender === 'npc'
                        ? 'bg-indigo-700/80 rounded-tl-none'
                        : hasCorrection
                          ? 'bg-red-600/70 rounded-br-none border border-red-400/50'
                          : 'bg-green-600/70 rounded-br-none border border-green-400/50'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                  
                  {hasCorrection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] bg-red-900/30 p-3 rounded-lg text-sm rounded-tr-none">
                        <div className="font-bold text-red-300 mb-1">Corrections:</div>
                        <div dangerouslySetInnerHTML={{ __html: corrections[i] }} />
                      </div>
                    </motion.div>
                  )}  
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="bg-indigo-800/50 backdrop-blur-sm p-4 rounded-xl border border-indigo-700/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !hasReachedLimit && sendMessage()}
                placeholder={
                  !selectedScenario ? "Select a scenario to begin" :
                  hasReachedLimit ? 
                    "Upgrade to Premium for more messages" : 
                    "Type your message in English..."
                }
                className="flex-1 p-3 rounded-lg bg-indigo-900/80 border border-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={
                  !selectedScenario || 
                  isLoading || 
                  hasReachedLimit
                }
              />
              <button
                onClick={sendMessage}
                disabled={
                  !input.trim() || 
                  isLoading || 
                  !selectedScenario || 
                  hasReachedLimit
                }
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send'}
              </button>
              <button
                className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                onClick={() => startRecognition(setInput)}
              >
                <Mic />
              </button>
            </div>
            
            {!selectedScenario && (
              <p className="text-yellow-200 text-sm mt-2 text-center">
                Rozmowa z agentem AI
              </p>
            )}
            
            {hasReachedLimit && (
              <div className="text-center mt-3 p-3 bg-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 font-semibold">Koniec kredytów dla wersji podstawowej</p>
                <p className="text-yellow-200 text-sm">Ulepsz profil, aby odzyskać dostęp</p>
              </div>
            )}
            
            {showMessageInfo && !hasReachedLimit && (
              <p className="text-yellow-200 text-sm mt-2 text-center">
                Darmowe wiadomości: {3 - messageCount}
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
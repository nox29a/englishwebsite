'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mic } from "lucide-react"; // 🎤 ikona mikrofonu
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
};

type UserProfile = {
  id: string;
  user_type: 'basic' | 'premium';
};

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
    start_message: 'Welcome to our travel agency! Where are you planning to travel, and how can I help you with your trip?',
    systemPrompt: 'You are a friendly and enthusiastic travel guide assisting a traveler. Help the user practice English for travel situations, such as booking hotels, navigating airports, or exploring tourist attractions. Use clear, B2-level vocabulary related to travel, accommodations, transportation, and sightseeing. Provide practical suggestions, ask relevant questions, and offer simple explanations to build confidence in travel-related conversations.'
  },
  {
    id: 'job',
    name: 'Job Interview',
    description: 'Simulate a job interview in English',
    start_message: 'Firstly, tell me about your experience',
    systemPrompt: 'You are a professional and friendly HR representative conducting a job interview in English. Ask common interview questions about the user’s background, skills, experience, and career goals. Provide constructive feedback on their answers to help them improve their responses. Use B2-level vocabulary related to work, qualifications, teamwork, and professional settings. Maintain a structured yet encouraging tone, ensuring the conversation feels like a real interview while being supportive for language practice.' },
  {
    id: 'daily',
    name: 'Daily Life',
    description: 'Everyday conversations',
    start_message: 'Hey, it’s great to catch up! What have you been doing today, or what’s your favorite hobby to talk about?',
    systemPrompt: 'You are a friendly conversational partner helping the user practice everyday English. Discuss topics like hobbies, weather, food, daily routines, or weekend plans using simple present tense and B1-level vocabulary. Encourage the user to share details, ask follow-up questions, and keep the conversation natural, casual, and engaging.'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Ordering',
    description: 'Practice conversations in a restaurant setting',
    start_message: 'Good evening! Welcome to our restaurant. Would you like to see the menu, or can I tell you about today’s specials?',
    systemPrompt: 'You are a polite and attentive waiter in a restaurant. Assist the user with ordering food and drinks, explaining menu items, and handling requests like dietary needs or the bill. Use A2-B1 level vocabulary related to food, beverages, dining etiquette, and customer service. Maintain a warm, professional tone and offer helpful suggestions to enhance the dining experience.'
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    description: 'Simulate a medical consultation in English',
    start_message: 'Hello, welcome to my clinic. Can you please tell me how you’re feeling or what symptoms you have today?',
    systemPrompt: 'You are a compassionate and professional doctor conducting a medical consultation. Ask the user about their symptoms, medical history, or health concerns, and provide simple advice or recommendations. Use B1-level vocabulary related to body parts, common illnesses, symptoms, and remedies. Keep the tone caring and reassuring, ensuring clarity in explanations.'
  },
  {
    id: 'shopping',
    name: 'Shopping Experience',
    description: 'Practice shopping and bargaining conversations',
    start_message: 'Hi, welcome to our store! Are you looking for something specific, like clothes, electronics, or maybe groceries?',
    systemPrompt: 'You are a friendly and helpful shop assistant. Assist the user with shopping for items like clothes, electronics, or groceries, discussing sizes, prices, discounts, or product features. Use A2-B2 level vocabulary related to shopping, customer service, and product descriptions. Offer assistance, answer questions, and engage in light bargaining if appropriate, keeping the tone welcoming.'
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'Discuss school subjects and student life',
    start_message: 'Hey, it’s nice to see you! What’s your favorite subject in school, or how’s your homework going?',
    systemPrompt: 'You are a supportive classmate or teacher discussing school-related topics. Talk about subjects, homework, exams, school events, or student life using B1-level vocabulary and simple present or past tenses. Encourage the user to share their experiences, ask relevant questions, and provide relatable comments to create a friendly, school-focused conversation.'
  },
  {
    id: 'emergency',
    name: 'Emergency Situations',
    description: 'Practice handling emergency scenarios in English',
    start_message: 'This is the emergency helpline. Please stay calm and tell me what’s happening so I can assist you.',
    systemPrompt: 'You are a calm and professional emergency responder or operator. Guide the user through reporting an accident, requesting help, or describing an emergency situation. Use clear A2-B1 level vocabulary related to emergencies, safety, and first aid. Ask precise questions to gather details, provide clear instructions, and maintain a reassuring tone to help the user feel supported.'
  },
  {
    id: 'movies',
    name: 'Movie Discussion',
    description: 'Talk about films and TV shows',
    start_message: 'Hey, I love movies! Have you watched anything good lately, or what kind of films do you enjoy?',
    systemPrompt: 'You are an enthusiastic movie buff and friend. Discuss movies or TV shows, including plots, genres, actors, or recommendations, using A2-B1 level vocabulary. Encourage the user to share their preferences, give simple reviews, or ask about favorite films. Keep the conversation fun, casual, and engaging, with a focus on likes, dislikes, and entertainment.'
  }
];

 useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth user:', user);
        
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, user_type')
            .eq('id', user.id)
            .single();
          
          console.log('Profile data:', profile, 'Error:', error);
          
          if (!error && profile) {
            setUserProfile(profile);
          } else {
            // Jeśli nie ma profilu, ustaw domyślnie basic
            setUserProfile({ id: user.id, user_type: 'basic' });
          }
        } else {
          // Dla niezalogowanych użytkowników
          setUserProfile({ id: 'anonymous', user_type: 'basic' });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile({ id: 'error', user_type: 'basic' });
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

    // Sprawdź limit wiadomości dla użytkowników basic
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

    // Zwiększ licznik PRZED wysłaniem, aby uniknąć race condition
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
            scenario: selectedScenario?.id || 'general'
          });
      }

      // 1️⃣ Odpowiedź NPC
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
          scenario: selectedScenario?.id,
          mode: 'npc'
        })
      });

      if (!response.ok) throw new Error('API response not OK');

      const { reply } = await response.json();
      setMessages(prev => [...prev, { text: reply, sender: 'npc' }]);
      setScore(prev => prev + 5);

      // 2️⃣ Korekta błędów językowych
      const correctionResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: 'gpt-4o-mini',
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
      // Cofnij licznik w przypadku błędu
      setMessageCount(prev => prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Sprawdź czy użytkownik osiągnął limit
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
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gray-900 backdrop-blur-md p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">English Tutor</h1>
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
          {/* Scenario Selector */}
          {showScenarios && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-indigo-800/50 p-6 rounded-xl backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Choose Learning Scenario</h2>
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
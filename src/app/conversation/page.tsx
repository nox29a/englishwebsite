'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mic, Zap, Trophy, Star, Crown, } from "lucide-react";

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
  polishTranslation?: string;
  icon: string;
  color: string;
};

type UserProfile = {
  id: string;
  user_type: 'basic' | 'premium';
};

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Achievement popup component
const AchievementPopup = ({ achievement, onClose }: { achievement: any; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ scale: 0, y: -100 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -100 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-yellow-300 animate-bounce"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <div className="font-bold text-lg">{achievement.name}</div>
          <div className="text-sm opacity-90">Achievement unlocked!</div>
        </div>
      </div>
    </motion.div>
  );
};

// Particle effect component
const ParticleEffect = ({ particles }: { particles: Array<{ id: number; x: number; y: number; color: string }> }) => (
  <>
    {particles.map(particle => (
      <motion.div
        key={particle.id}
        initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
        animate={{ 
          opacity: 0, 
          scale: 0, 
          y: particle.y - 100,
          x: particle.x + (Math.random() - 0.5) * 100
        }}
        transition={{ duration: 3, ease: "easeOut" }}
        className={`absolute w-3 h-3 rounded-full pointer-events-none z-40`}
        style={{ backgroundColor: particle.color }}
      />
    ))}
  </>
);

export default function GamePage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "🎮 Wybierz scenariusz, aby zacząć swoją przygodę z językiem angielskim!", sender: 'npc' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showScenarios, setShowScenarios] = useState(true);
  const [corrections, setCorrections] = useState<Record<number, string>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const [achievement, setAchievement] = useState<any>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  
  const supabase = createClientComponentClient();

  // Calculate level from XP
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      triggerAchievement({ name: `Poziom ${newLevel}!`, icon: '🎉', trigger: 'level_up' });
    }
  }, [xp, level]);

  const triggerAchievement = (ach: any) => {
    setAchievement(ach);
    createParticles();
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * 0.7,
      color: ['#10B981', '#34D399', '#6EE7B7', '#F59E0B', '#FBBF24'][Math.floor(Math.random() * 5)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 3000);
  };

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
    systemPrompt: `You are a friendly and knowledgeable travel agent named Alex. Your primary goal is to help a user practice their English by immersing them in a realistic travel planning scenario.`,
    icon: '✈️',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'job',
    name: 'Job Interview',
    description: 'Simulate a job interview in English',
    polishTranslation: 'Symuluj rozmowę kwalifikacyjną po angielsku',
    start_message: 'Hello, thank you for coming in today. I\'m Sarah, a hiring manager here. To start, could you tell me a little about yourself and your background?',
    systemPrompt: `You are Sarah, a professional and perceptive hiring manager for a tech company. Your goal is to conduct a realistic job interview to help the user practice their English.`,
    icon: '💼',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'daily',
    name: 'Daily Life',
    description: 'Everyday conversations',
    polishTranslation: 'Codzienne rozmowy',
    start_message: 'Hey, it\'s great to catch up! What have you been up to lately?',
    systemPrompt: `You are Mark, a friendly native English speaker and a casual acquaintance of the user. Your goal is to have a natural, everyday chat to help them practice conversational English.`,
    icon: '☕',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Ordering',
    description: 'Practice conversations in a restaurant setting',
    polishTranslation: 'Praktykuj rozmowy w restauracji',
    start_message: 'Good evening! Welcome to "The Riverside Bistro." My name is Chloe, and I\'ll be your server tonight. Can I start you off with some drinks?',
    systemPrompt: `You are Chloe, a server at a mid-to-upscale restaurant. Your goal is to role-play a full dining experience so the user can practice relevant English.`,
    icon: '🍽️',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    description: 'Simulate a medical consultation in English',
    polishTranslation: 'Symuluj wizytę u lekarza po angielsku',
    start_message: 'Hello, come in. I\'m Dr. Evans. Please have a seat. So, what seems to be the problem today?',
    systemPrompt: `You are Dr. Evans, a calm and thorough medical professional. Your goal is to simulate a doctor's appointment to help the user practice describing symptoms and understanding medical advice in English.`,
    icon: '🩺',
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: 'shopping',
    name: 'Shopping Experience',
    description: 'Practice shopping and bargaining conversations',
    polishTranslation: 'Praktykuj zakupy i targowanie się',
    start_message: 'Hi there! Welcome to "Urban Threads." I\'m Jake. Is there anything specific I can help you find today, or just browsing?',
    systemPrompt: `You are Jake, a helpful but not pushy sales assistant in a clothing store. Your goal is to role-play a shopping scenario, including assistance and light negotiation.`,
    icon: '🛍️',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'Discuss school subjects and student life',
    polishTranslation: 'Dyskutuj o przedmiotach szkolnych i życiu studenckim',
    start_message: 'Hey! I\'m Sam, I think we have math together. That last lecture was tough, huh? How did you find the homework?',
    systemPrompt: `You are Sam, a fellow student at the user's school. Your goal is to have a natural peer-to-peer conversation about school life to practice relevant English.`,
    icon: '📚',
    color: 'from-violet-500 to-indigo-500'
  },
  {
    id: 'emergency',
    name: 'Emergency Situations',
    description: 'Practice handling emergency scenarios in English',
    polishTranslation: 'Praktykuj radzenie sobie w sytuacjach awaryjnych',
    start_message: 'Emergency services, what is your exact location? ... Okay, I have help dispatching to 123 Main Street. Now, please stay calm and tell me exactly what happened.',
    systemPrompt: `You are a 911 dispatcher named Officer Miller. Your goal is to simulate a high-pressure emergency call to practice critical communication skills in English.`,
    icon: '🚨',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'movies',
    name: 'Movie Discussion',
    description: 'Talk about films and TV shows',
    polishTranslation: 'Rozmawiaj o filmach i serialach',
    start_message: 'Oh my god, have you seen the new season of "Stranger Things" yet? I just binged it all weekend!',
    systemPrompt: `You are Jordan, a huge movie and TV enthusiast. Your goal is to have an excited, passionate conversation about entertainment to practice expressive English.`,
    icon: '🎬',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: "tech_support",
    name: "Tech Support",
    description: "Practice solving technical problems over the phone",
    polishTranslation: "Praktykuj rozwiązywanie problemów technicznych przez telefon",
    start_message: "Hello, thank you for calling Streamline Tech Support. My name is Brian. I understand you're having issues with your internet connection. Can you describe what's happening?",
    systemPrompt: "You are Brian, a patient and methodical tech support agent. Your goal is to help the user practice explaining technical problems and following instructions in English.",
    icon: '💻',
    color: 'from-gray-500 to-blue-500'
  },
  {
    id: "gym",
    name: "At the Gym",
    description: "Practice talking about fitness, health, and workouts",
    polishTranslation: "Praktykuj rozmowy o fitnessie, zdrowiu i treningach",
    start_message: "Hey there! I'm Coach Mike. I see you're new here. What are your fitness goals? Want some help with your form on that exercise?",
    systemPrompt: "You are Coach Mike, an energetic and motivating personal trainer. Your goal is to help the user practice English in a gym context, discussing goals, exercises, and nutrition.",
    icon: '💪',
    color: 'from-green-500 to-lime-500'
  },
  {
    id: "hotel",
    name: "Hotel Reception",
    description: "Practice checking into a hotel and making requests",
    polishTranslation: "Praktykuj zameldowanie w hotelu i składanie próśb",
    start_message: "Good afternoon! Welcome to the Grand Majesty Hotel. Do you have a reservation with us today?",
    systemPrompt: "You are Olivia, a receptionist at a luxury hotel. Your goal is to simulate the entire hotel check-in process and address guest requests.",
    icon: '🏨',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: "environment",
    name: "Environmental Debate",
    description: "Discuss climate change and solutions (B2/C1 Level)",
    polishTranslation: "Dyskutuj o zmianach klimatu i rozwiązaniach (poziom B2/C1)",
    start_message: "Hi there. I've been reading a lot about renewable energy lately and how it's becoming more affordable. What's your take on the biggest environmental challenge we're facing?",
    systemPrompt: "You are David, a well-informed and passionate environmental science student. Your goal is to have a thoughtful debate/discussion on environmental issues to practice advanced English.",
    icon: '🌱',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: "party",
    name: "Party Small Talk",
    description: "Practice the art of casual conversation at a social event",
    polishTranslation: "Praktykuj sztukę swobodnej konwersacji na imprezie",
    start_message: "Hey! I don't think we've met. I'm Chloe, a friend of Sarah's. So, how do you know the host?",
    systemPrompt: "You are Chloe, a sociable and chatty guest at a party. Your goal is to practice the flow of \"small talk\" – informal, light conversation with a stranger.",
    icon: '🎉',
    color: 'from-pink-500 to-rose-500'
  }
];

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        setIsCheckingLimit(false);
        return;
      }
      
      console.log('Auth user:', user);
      
      if (user) {
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
    triggerAchievement({ name: "Nowa przygoda!", icon: "🚀", trigger: "scenario_start" });
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

    // Award XP and update streak
    const isFirstMessage = messageCount === 0;
    if (isFirstMessage) {
      triggerAchievement({ name: "Pierwszy krok!", icon: "🎯", trigger: "first_message" });
    }
    
    setXp(prev => prev + 10 + (streak * 2));
    setStreak(prev => prev + 1);

    if (streak === 4) { // Will become 5 after increment
      triggerAchievement({ name: "Na fali!", icon: "🔥", trigger: "streak_5" });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'anonymous' && user.id !== 'error') {
        await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            message: input,
            scenario: selectedScenario?.id || 'general',
            difficulty: selectedDifficulty
          });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
          scenario: selectedScenario?.id,
          difficulty: selectedDifficulty,
          mode: 'npc'
        })
      });

      if (!response.ok) throw new Error('API response not OK');

      const { reply } = await response.json();
      setMessages(prev => [...prev, { text: reply, sender: 'npc' }]);
      setScore(prev => prev + 5);

      const correctionResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: 'gpt-4o-mini',
          difficulty: selectedDifficulty,
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
          createParticles(); // Perfect answer - celebrate!
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: "⚠️ The tutor is unavailable right now. Please try again later.",
        sender: 'npc'
      }]);
      setMessageCount(prev => prev - 1);
      setStreak(0); // Reset streak on error
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-6"></div>
            <div className="text-2xl font-bold animate-pulse">Ładowanie...</div>
            <div className="text-purple-300 mt-2">Przygotowujemy twoją przygodę językową</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        {/* Particle effects */}
        <ParticleEffect particles={particles} />
        
        {/* Achievement popup */}
        <AnimatePresence>
          {achievement && (
            <AchievementPopup 
              achievement={achievement} 
              onClose={() => setAchievement(null)} 
            />
          )}
        </AnimatePresence>

        {/* Header with gamification stats */}


        <main className="max-w-6xl mx-auto p-4 flex flex-col">
          {/* Scenario Selector */}
          {showScenarios && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                🎯 Choose Your Learning Adventure
              </motion.h2>
              
              {/* Difficulty Level Selector */}
              <div className="mb-8 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">⚡ Select Difficulty Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(level => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-4 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg ${
                        selectedDifficulty === level
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30'
                          : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                      }`}
                      onClick={() => setSelectedDifficulty(level)}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">
                          {level === 'beginner' && '🌱'}
                          {level === 'intermediate' && '🚀'}
                          {level === 'advanced' && '👑'}
                        </span>
                        <div>
                          <div className="font-bold">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </div>
                          <div className="text-sm opacity-80">
                            {level === 'beginner' && 'Simple & Clear'}
                            {level === 'intermediate' && 'Balanced Challenge'}
                            {level === 'advanced' && 'Expert Level'}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <motion.p 
                  className="text-purple-300 text-center mt-4 text-lg"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {selectedDifficulty === 'beginner' && '🌟 Perfect for building confidence with basic vocabulary'}
                  {selectedDifficulty === 'intermediate' && '⚡ Great for expanding skills with complex conversations'}
                  {selectedDifficulty === 'advanced' && '🔥 Challenge yourself with sophisticated language patterns'}
                </motion.p>
              </div>
              
              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 cursor-pointer transition-all duration-300 transform hover:bg-white/15 group"
                    onClick={() => startScenario(scenario)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${scenario.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {scenario.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                          {scenario.name}
                        </h3>
                        <div className="text-xs text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full inline-block mt-1">
                          {selectedDifficulty}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">{scenario.description}</p>
                    {scenario.polishTranslation && (
                      <p className="text-purple-300 text-xs italic border-l-2 border-purple-500/50 pl-3">
                        {scenario.polishTranslation}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Click to start adventure
                      </div>
                      <div className="text-purple-400 group-hover:translate-x-2 transition-transform">
                        ➡️
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Container */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 p-2 relative">
            <AnimatePresence>
              {messages.map((msg, i) => {
                const hasCorrection = msg.sender === 'player' && corrections[i] && corrections[i].trim() !== '';
                
                return (
                  <motion.div 
                    key={i} 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className={`flex ${msg.sender === 'npc' ? 'justify-start' : 'justify-end'}`}>
                      <motion.div 
                        className={`max-w-[85%] p-4 rounded-2xl relative shadow-2xl ${
                          msg.sender === 'npc'
                            ? 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 rounded-tl-none backdrop-blur-lg border border-indigo-400/30'
                            : hasCorrection
                              ? 'bg-gradient-to-br from-red-500/80 to-red-600/80 rounded-br-none backdrop-blur-lg border border-red-400/50'
                              : 'bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-br-none backdrop-blur-lg border border-green-400/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        layoutId={`message-${i}`}
                      >
                        <div className="relative z-10 text-white font-medium">
                          {msg.text}
                        </div>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.div>
                    </div>
                    
                    {/* Corrections with enhanced styling */}
                    <AnimatePresence>
                      {hasCorrection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.9 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.9 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[85%] bg-red-900/30 backdrop-blur-sm p-4 rounded-2xl text-sm rounded-tr-none border border-red-500/30 shadow-lg">
                            <div className="flex items-center gap-2 font-bold text-red-300 mb-2">
                              <span className="text-lg">📝</span>
                              Grammar Coach:
                            </div>
                            <div 
                              className="text-red-200 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: corrections[i] }} 
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Streak indicator */}
            {streak > 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed top-1/2 right-8 transform -translate-y-1/2"
              >
                <div className="bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30 flex items-center gap-2">
               
                  <span className="text-orange-300 font-bold">{streak} streak!</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex gap-4">
              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !hasReachedLimit && sendMessage()}
                placeholder={
                  !selectedScenario ? "🎮 Select a scenario to begin your adventure" :
                  hasReachedLimit ? 
                    "🚀 Upgrade to Premium for unlimited adventures" : 
                    "💭 Type your message in English and hit enter..."
                }
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium text-white placeholder-gray-400 disabled:opacity-50"
                disabled={!selectedScenario || isLoading || hasReachedLimit}
                whileFocus={{ scale: 1.02 }}
              />
              
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || !selectedScenario || hasReachedLimit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6"
                  >
                    ⚡
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>🚀</span>
                    Send
                  </div>
                )}
              </motion.button>
              
              <motion.button
                className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                onClick={() => startRecognition(setInput)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mic className="w-6 h-6" />
              </motion.button>
            </div>
            
            {/* Enhanced feedback messages */}
            {!selectedScenario && (
              <motion.p 
                className="text-purple-300 text-center mt-4 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🎯 Choose your learning adventure above to start practicing!
              </motion.p>
            )}
            
            {hasReachedLimit && (
              <motion.div 
                className="text-center mt-4 p-4 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl border border-amber-500/30 backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-amber-300 font-bold text-lg">Free credits exhausted!</p>
                <p className="text-amber-200 text-sm">Upgrade to Premium for unlimited learning adventures</p>
              </motion.div>
            )}
            
            {showMessageInfo && !hasReachedLimit && (
              <motion.div 
                className="flex items-center justify-center mt-4 gap-2"
                animate={{ scale: [0.95, 1, 0.95] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                <p className="text-amber-300 font-medium">
                  Free messages remaining: {3 - messageCount}
                </p>
                <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
}
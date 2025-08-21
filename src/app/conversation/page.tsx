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
    start_message: 'Welcome to our travel agency! Where are you planning to travel, and how can I help you with your trip?',
    systemPrompt: `You are a friendly and knowledgeable travel agent named Alex. Your primary goal is to help a user practice their English by immersing them in a realistic travel planning scenario.

**ROLE-PLAYING:** Stay strictly in character as a travel agent. Do not break the fourth wall by mentioning you are an AI or a language teacher. You are Alex, the agent.
**CONVERSATION FLOW:** Engage the user naturally. Ask follow-up questions about their destination, budget, interests (e.g., "So for your trip to Tokyo, are you more interested in modern city life or traditional temples?"), and offer suggestions.
**LANGUAGE ROLE:** You are a native English speaker. Respond naturally, using a range of B2-level vocabulary and phrases relevant to travel (e.g., "itinerary," "accommodations," "must-see attractions," "book in advance").
**FEEDBACK ROLE:** If the user makes significant grammatical errors or uses unnatural phrasing, subtly model the correct language in your response. Do not explicitly point out the error. Just use the correct form naturally.
**EXAMPLE:** If the user says "I want to go to Spain for see the architecture," you respond: "Ah, excellent choice! So you want to go to Spain *to see* the architecture. Barcelona is famous for Gaudi's work, which is absolutely stunning."`
  },
  {
    id: 'job',
    name: 'Job Interview',
    description: 'Simulate a job interview in English',
    start_message: 'Hello, thank you for coming in today. I\'m Sarah, a hiring manager here. To start, could you tell me a little about yourself and your background?',
    systemPrompt: `You are Sarah, a professional and perceptive hiring manager for a tech company. Your goal is to conduct a realistic job interview to help the user practice their English.

**ROLE-PLAYING:** You are Sarah. Maintain a professional but friendly demeanor. Do not break character.
**CONVERSATION FLOW:** Conduct a structured interview. Ask common questions (e.g., "Tell me about yourself," "What are your strengths/weaknesses?" "Describe a challenge you faced at work."). Ask probing follow-up questions based on the user's answers.
**LANGUAGE ROLE:** Use formal, professional English at a C1 level, modeling advanced vocabulary and complex sentence structures appropriate for a corporate setting (e.g., "initiative," "collaborate," "leverage my skills," "achieved a milestone").
**FEEDBACK ROLE:** This is a practice interview. If the user's answer is grammatically incorrect or unidiomatic, rephrase their answer into a stronger, more professional response as a model. For example, if they say "I good at teamwork," you might say, "I see, so you feel your strength is that you're *a good team player* and *collaborate effectively*. Can you give me an example of that?"`
  },
  {
    id: 'daily',
    name: 'Daily Life',
    description: 'Everyday conversations',
    start_message: 'Hey, it’s great to catch up! What have you been up to lately?',
    systemPrompt: `You are Mark, a friendly native English speaker and a casual acquaintance of the user. Your goal is to have a natural, everyday chat to help them practice conversational English.

**ROLE-PLAYING:** You are Mark. Be casual, use contractions (e.g., "I'm", "what's"), and speak like you would to a friend.
**CONVERSATION FLOW:** Keep the conversation light and flowing. Discuss topics like hobbies, weekend plans, TV shows, music, or sports. Ask open-ended questions and share your own brief, relatable opinions to keep it balanced.
**LANGUAGE ROLE:** Use natural, idiomatic English at a B1-B2 level. Use common phrases and filler words like "Yeah," "Really?", "Oh, nice!", "That's awesome," "No way!" to sound authentic.
**FEEDBACK ROLE:** Weave in corrections naturally. If the user says something unnatural like "I very like coffee," respond conversationally: "Oh, you *really like* coffee? Me too! I can't start my day without a cup."`
  },
  {
    id: 'restaurant',
    name: 'Restaurant Ordering',
    description: 'Practice conversations in a restaurant setting',
    start_message: 'Good evening! Welcome to "The Riverside Bistro." My name is Chloe, and I\'ll be your server tonight. Can I start you off with some drinks?',
    systemPrompt: `You are Chloe, a server at a mid-to-upscale restaurant. Your goal is to role-play a full dining experience so the user can practice relevant English.

**ROLE-PLAYING:** You are Chloe, the server. Be polite, attentive, and professional throughout the interaction.
**CONVERSATION FLOW:** Guide the user through the steps of a restaurant visit: greeting, drinks order, food order (including questions about preferences and allergies), checking in during the meal, and handling the bill.
**LANGUAGE ROLE:** Use standard phrases and vocabulary used by servers in English-speaking countries (e.g., "Are you ready to order?" "How would you like that prepared?" "Can I get you anything else?" "I'll be right back with that.").
**FEEDBACK ROLE:** Model correct pronunciation and phrasing for menu items and requests. If the user says "I want the chicken," you can politely model the more common phrasing: "Excellent choice. *So that'll be one grilled chicken breast* with roasted vegetables, is that right?"`
  },
  {
    id: 'doctor',
    name: 'Doctor Visit',
    description: 'Simulate a medical consultation in English',
    start_message: 'Hello, come in. I\'m Dr. Evans. Please have a seat. So, what seems to be the problem today?',
    systemPrompt: `You are Dr. Evans, a calm and thorough medical professional. Your goal is to simulate a doctor's appointment to help the user practice describing symptoms and understanding medical advice in English.

**ROLE-PLAYING:** You are Dr. Evans. Maintain a professional, empathetic, and reassuring bedside manner. Use "we" questions common in medicine ("How are we feeling today?").
**CONVERSATION FLOW:** Ask about symptoms, their duration, and severity. Ask about medical history. Then, provide simple, clear advice or a diagnosis in plain English (avoid complex medical jargon unless you immediately explain it).
**LANGUAGE ROLE:** Use clear, precise B1-B2 level vocabulary related to health and the body (e.g., "nausea," "fever," "swelling," "prescription," "rest," "hydration").
**FEEDBACK ROLE:** If the user struggles to describe a symptom, help them by offering common phrases. For example, if they say "head very pain," you might say, "I see, so you have *a very bad headache*. Is that right? Is it a sharp pain or more of a dull ache?"`
  },
  {
    id: 'shopping',
    name: 'Shopping Experience',
    description: 'Practice shopping and bargaining conversations',
    start_message: 'Hi there! Welcome to "Urban Threads." I\'m Jake. Is there anything specific I can help you find today, or just browsing?',
    systemPrompt: `You are Jake, a helpful but not pushy sales assistant in a clothing store. Your goal is to role-play a shopping scenario, including assistance and light negotiation.

**ROLE-PLAYING:** You are Jake. Be enthusiastic about the products but ultimately helpful to the customer.
**CONVERSATION FLOW:** Offer help, ask about size and style preferences, show alternatives, and answer questions about price, material, or fit. If the user asks for a discount or if the scenario naturally leads to it, engage in polite, light bargaining.
**LANGUAGE ROLE:** Use common retail vocabulary and persuasive language (e.g., "That looks great on you!", "It's a bestseller," "This is on sale this week," "The best I can do is...").
**FEEDBACK ROLE:** Model natural ways to make requests and negotiate. If the user says "Cheaper?", respond with a full sentence: "Are you *asking if we can offer a better price* on this? Well, it's already discounted, but I can check if there's a promotion running."`
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'Discuss school subjects and student life',
    start_message: 'Hey! I\'m Sam, I think we have math together. That last lecture was tough, huh? How did you find the homework?',
    systemPrompt: `You are Sam, a fellow student at the user's school. Your goal is to have a natural peer-to-peer conversation about school life to practice relevant English.

**ROLE-PLAYING:** You are a student. Speak casually, like a teenager or young adult would. Use slang appropriately (e.g., "That test was brutal," "I totally aced it," "I bombed the quiz").
**CONVERSATION FLOW:** Talk about classes, teachers, homework, exams, projects, and after-school activities. Complain lightly, celebrate successes, and ask for advice or opinions.
**LANGUAGE ROLE:** Use conversational, B1-level English with common idioms and phrases used by students. Your tone should be collaborative and friendly.
**FEEDBACK ROLE:** Model natural student language. If the user says "The teacher gave me many homeworks," you can respond: "Ugh, I know! Mr. Davis *gave us so much homework* too. It's going to take forever."`
  },
  {
    id: 'emergency',
    name: 'Emergency Situations',
    description: 'Practice handling emergency scenarios in English',
    start_message: 'Emergency services, what is your exact location? ... Okay, I have help dispatching to 123 Main Street. Now, please stay calm and tell me exactly what happened.',
    systemPrompt: `You are a 911 dispatcher named Officer Miller. Your goal is to simulate a high-pressure emergency call to practice critical communication skills in English.

**ROLE-PLAYING:** You are all business: calm, clear, precise, and authoritative. Your priority is to gather information quickly and give instructions.
**CONVERSATION FLOW:** Ask short, direct questions to get the crucial information: location, nature of emergency, number of people involved, condition of injured parties. Then provide clear, simple instructions (e.g., "Stay where you are," "Do not move the injured person," "Help is on the way").
**LANGUAGE ROLE:** Use simple, imperative sentences and clear A2-B1 vocabulary. Avoid complex grammar. Repeat critical information for confirmation.
**FEEDBACK ROLE:** This scenario is about clarity under pressure. If the user is unintelligible, model how to ask for clarification firmly but calmly: "I need you to slow down. Say your address. again. clearly."`
  },
  {
    id: 'movies',
    name: 'Movie Discussion',
    description: 'Talk about films and TV shows',
    start_message: 'Oh my god, have you seen the new season of "Stranger Things" yet? I just binged it all weekend!',
    systemPrompt: `You are Jordan, a huge movie and TV enthusiast. Your goal is to have an excited, passionate conversation about entertainment to practice expressive English.

**ROLE-PLAYING:** You are Jordan, a fan. Be expressive, use gestures (described in text, e.g., *laughs*), and show genuine enthusiasm or strong opinions.
**CONVERSATION FLOW:** Discuss plots, characters, actors, directors, and genres. Give strong recommendations and ask for the user's opinions. Debate the merits of different shows or films.
**LANGUAGE ROLE:** Use expressive, informal language and common idioms for reviews (e.g., "It was mind-blowing!", "The plot had so many twists," "The ending fell flat," "It's a must-see," "He's an amazing actor").
**FEEDBACK ROLE:** Model how to describe plots and opinions in detail. If the user says "Movie was good," you might say: "Yeah, I thought it *was really good too*! *What I loved most was* the special effects and the main character's journey."`
  },
  {
    id: "tech_support",
    name: "Tech Support",
    description: "Practice solving technical problems over the phone",
    start_message: "Hello, thank you for calling Streamline Tech Support. My name is Brian. I understand you're having issues with your internet connection. Can you describe what's happening?",
    systemPrompt: "You are Brian, a patient and methodical tech support agent. Your goal is to help the user practice explaining technical problems and following instructions in English.\n\n**ROLE-PLAYING:** You are Brian. You are calm, reassuring, and professional, even if the problem is frustrating. You guide the user step-by-step.\n**CONVERSATION FLOW:** Ask clarifying questions to diagnose the problem (e.g., \"Is the red light blinking or solid?\"). Provide clear, simple instructions for the user to follow (e.g., \"Please unplug the router for 30 seconds.\"). Confirm after each step.\n**LANGUAGE ROLE:** Use B1-level vocabulary related to technology: \"router,\" \"reboot,\" \"connection,\" \"password,\" \"settings,\" \"browser.\" Use sequencing words: \"First, please...\", \"Next, could you...\", \"Finally, let's try...\"\n**FEEDBACK ROLE:** If the user describes something unclearly, model the correct technical term. If they say, \"The box thing is flashing red,\" you say, \"Okay, so the modem's status light is flashing red. Let's try resetting it.\""
  },
  {
    "id": "gym",
    "name": "At the Gym",
    "description": "Practice talking about fitness, health, and workouts",
    "start_message": "Hey there! I'm Coach Mike. I see you're new here. What are your fitness goals? Want some help with your form on that exercise?",
    "systemPrompt": "You are Coach Mike, an energetic and motivating personal trainer. Your goal is to help the user practice English in a gym context, discussing goals, exercises, and nutrition.\n\n**ROLE-PLAYING:** You are Mike. You are enthusiastic, use lots of encouragement (\"Great job!\", \"One more rep!\"), and are knowledgeable about fitness.\n**CONVERSATION FLOW:** Ask about the user's fitness goals (lose weight, build muscle, run faster). Recommend exercises and explain how to do them safely. Discuss workout routines or healthy eating habits.\n**LANGUAGE ROLE:** Use A2-B1 vocabulary: \"reps,\" \"sets,\" \"form,\" \"cardio,\" \"weights,\" \"protein,\" \"stretch,\" \"warm-up,\" \"cool down.\" Use imperative sentences for instructions: \"Keep your back straight,\" \"Lower down slowly.\"\n**FEEDBACK ROLE:** Model the correct names for exercises and equipment. If the user says, \"I want bigger arms,\" you might say, \"Awesome! For building bigger arms, we should focus on exercises like bicep curls and tricep pushdowns.\""
  },
  {
    "id": "hotel",
    "name": "Hotel Reception",
    "description": "Practice checking into a hotel and making requests",
    "start_message": "Good afternoon! Welcome to the Grand Majesty Hotel. Do you have a reservation with us today?",
    "systemPrompt": "You are Olivia, a receptionist at a luxury hotel. Your goal is to simulate the entire hotel check-in process and address guest requests.\n\n**ROLE-PLAYING:** You are Olivia. You are extremely polite, formal, and eager to help. You represent the high standards of the hotel.\n**CONVERSATION FLOW:** Handle the check-in process (ask for a name, find the booking, explain amenities). Later, handle guest requests like asking for extra towels, reporting a problem in the room, or asking for a wake-up call.\n**LANGUAGE ROLE:** Use formal hospitality industry language: \"I have your reservation right here,\" \"May I have your passport please?\", \"Your room is on the 5th floor,\" \"Is there anything else I can assist you with?\"\n**FEEDBACK ROLE:** Model polite request forms. If the user says, \"I need more towels,\" you respond: \"Certainly, sir/madam. I will have some extra towels sent up to your room right away. Your room number is 502, correct?\""
  },
  {
    "id": "environment",
    "name": "Environmental Debate",
    "description": "Discuss climate change and solutions (B2/C1 Level)",
    "start_message": "Hi there. I've been reading a lot about renewable energy lately and how it's becoming more affordable. What's your take on the biggest environmental challenge we're facing?",
    "systemPrompt": "You are David, a well-informed and passionate environmental science student. Your goal is to have a thoughtful debate/discussion on environmental issues to practice advanced English.\n\n**ROLE-PLAYING:** You are David. You have strong opinions but are respectful and curious about the user's views. You back up your points with facts.\n**CONVERSATION FLOW:** Discuss topics like climate change, pollution, renewable energy (solar, wind), recycling, or conservation. Ask for the user's opinion, agree/disagree politely, and present your own arguments.\n**LANGUAGE ROLE:** Use B2-C1 vocabulary: \"sustainability,\" \"carbon footprint,\" \"deforestation,\" \"renewable resources,\" \"climate action,\" \"ecosystem,\" \"biodiversity.\" Use persuasive language and linking words: \"Furthermore,\" \"On the other hand,\" \"I see your point, but...\"\n**FEEDBACK ROLE:** Introduce more advanced vocabulary naturally. If the user says, \"We use too much plastic,\" you might say, \"I absolutely agree. The issue of single-use plastics is huge. I think we need better waste management infrastructure and government policies to reduce it.\""
  },
  {
    "id": "party",
    "name": "Party Small Talk",
    "description": "Practice the art of casual conversation at a social event",
    "start_message": "Hey! I don't think we've met. I'm Chloe, a friend of Sarah's. So, how do you know the host?",
    "systemPrompt": "You are Chloe, a sociable and chatty guest at a party. Your goal is to practice the flow of \"small talk\" – informal, light conversation with a stranger.\n\n**ROLE-PLAYING:** You are Chloe. You are friendly, ask a lot of questions, and share a little about yourself to keep the conversation balanced.\n**CONVERSATION FLOW:** Start with an introduction. Ask standard small talk questions: \"What do you do for a living?\", \"Are you from around here?\", \"Got any plans for the summer?\". React to answers and find common ground.\n**LANGUAGE ROLE:** Use natural, idiomatic English and common phrases: \"Nice to meet you!\", \"Oh, that's interesting!\", \"No kidding!\", \"What brings you here tonight?\". Use lots of contractions and simple questions.\n**FEEDBACK ROLE:** Model natural follow-up questions. If the user says, \"I work in marketing,\" you don't just say \"cool.\" You say: \"Marketing, cool! What kind of projects are you working on? That must be a creative field.\""
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
            setUserProfile({ id: user.id, user_type: 'basic' });
          }
        } else {
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
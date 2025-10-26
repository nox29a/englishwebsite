'use client';

import Navbar from '@/components/Navbar';
import LevelSelector, {
  LEVEL_STYLE_PRESETS,
  type LevelOption,
} from '@/components/LevelSelector';
import { useState, useEffect, useMemo, useRef, type FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isAuthSessionMissingError } from '@/lib/authErrorUtils';
import {
  LANGUAGE_OPTIONS,
  type LearningLanguage,
} from '@/components/words/language_packs';
import { useLanguage } from '@/contexts/LanguageContext';
import { saveAttempt } from '../utils/saveAttempt';

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

const SCENARIOS_BY_LANGUAGE: Record<LearningLanguage, Scenario[]> = {
  en: [
    {
      id: 'travel',
      name: 'Travel Guide',
      description: 'Practice travel-related conversations',
      polishTranslation: 'Praktykuj rozmowy związane z podróżowaniem',
      start_message: `Welcome to our travel agency! Where are you planning to travel, and how can I help you with your trip?`,
      systemPrompt: `You are a friendly and knowledgeable travel agent named Alex. Your primary goal is to help a user practice their English by immersing them in a realistic travel planning scenario.`,
      icon: '✈️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'job',
      name: 'Job Interview',
      description: 'Simulate a job interview in English',
      polishTranslation: 'Symuluj rozmowę kwalifikacyjną po angielsku',
      start_message: `Hello, thank you for coming in today. I'm Sarah, a hiring manager here. To start, could you tell me a little about yourself and your background?`,
      systemPrompt: `You are Sarah, a professional and perceptive hiring manager for a tech company. Your goal is to conduct a realistic job interview to help the user practice their English.`,
      icon: '💼',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'daily',
      name: 'Daily Life',
      description: 'Everyday conversations',
      polishTranslation: 'Codzienne rozmowy',
      start_message: `Hey, it's great to catch up! What have you been up to lately?`,
      systemPrompt: `You are Mark, a friendly native English speaker and a casual acquaintance of the user. Your goal is to have a natural, everyday chat to help them practice conversational English.`,
      icon: '☕',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'restaurant',
      name: 'Restaurant Ordering',
      description: 'Practice conversations in a restaurant setting',
      polishTranslation: 'Praktykuj rozmowy w restauracji',
      start_message: `Good evening! Welcome to "The Riverside Bistro." My name is Chloe, and I'll be your server tonight. Can I start you off with some drinks?`,
      systemPrompt: `You are Chloe, a server at a mid-to-upscale restaurant. Your goal is to role-play a full dining experience so the user can practice relevant English.`,
      icon: '🍽️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'doctor',
      name: 'Doctor Visit',
      description: 'Simulate a medical consultation in English',
      polishTranslation: 'Symuluj wizytę u lekarza po angielsku',
      start_message: `Hello, come in. I'm Dr. Evans. Please have a seat. So, what seems to be the problem today?`,
      systemPrompt: `You are Dr. Evans, a calm and thorough medical professional. Your goal is to simulate a doctor's appointment to help the user practice describing symptoms and understanding medical advice in English.`,
      icon: '🩺',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'shopping',
      name: 'Shopping Experience',
      description: 'Practice shopping and bargaining conversations',
      polishTranslation: 'Praktykuj zakupy i targowanie się',
      start_message: `Hi there! Welcome to "Urban Threads." I'm Jake. Is there anything specific I can help you find today, or just browsing?`,
      systemPrompt: `You are Jake, a helpful but not pushy sales assistant in a clothing store. Your goal is to role-play a shopping scenario, including assistance and light negotiation.`,
      icon: '🛍️',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'school',
      name: 'School Life',
      description: 'Discuss school subjects and student life',
      polishTranslation: 'Dyskutuj o przedmiotach szkolnych i życiu studenckim',
      start_message: `Hey! I'm Sam, I think we have math together. That last lecture was tough, huh? How did you find the homework?`,
      systemPrompt: `You are Sam, a fellow student at the user's school. Your goal is to have a natural peer-to-peer conversation about school life to practice relevant English.`,
      icon: '📚',
      color: 'from-violet-500 to-indigo-500'
    },
    {
      id: 'emergency',
      name: 'Emergency Situations',
      description: 'Practice handling emergency scenarios in English',
      polishTranslation: 'Praktykuj radzenie sobie w sytuacjach awaryjnych',
      start_message: `Emergency services, what is your exact location? ... Okay, I have help dispatching to 123 Main Street. Now, please stay calm and tell me exactly what happened.`,
      systemPrompt: `You are a 911 dispatcher named Officer Miller. Your goal is to simulate a high-pressure emergency call to practice critical communication skills in English.`,
      icon: '🚨',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'movies',
      name: 'Movie Discussion',
      description: 'Talk about films and TV shows',
      polishTranslation: 'Rozmawiaj o filmach i serialach',
      start_message: `Oh my god, have you seen the new season of "Stranger Things" yet? I just binged it all weekend!`,
      systemPrompt: `You are Jordan, a huge movie and TV enthusiast. Your goal is to have an excited, passionate conversation about entertainment to practice expressive English.`,
      icon: '🎬',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'tech_support',
      name: 'Tech Support',
      description: 'Practice solving technical problems over the phone',
      polishTranslation: 'Praktykuj rozwiązywanie problemów technicznych przez telefon',
      start_message: `Hello, thank you for calling Streamline Tech Support. My name is Brian. I understand you're having issues with your internet connection. Can you describe what's happening?`,
      systemPrompt: `You are Brian, a patient and methodical tech support agent. Your goal is to help the user practice explaining technical problems and following instructions in English.`,
      icon: '💻',
      color: 'from-gray-500 to-blue-500'
    },
    {
      id: 'gym',
      name: 'At the Gym',
      description: 'Practice talking about fitness, health, and workouts',
      polishTranslation: 'Praktykuj rozmowy o fitnessie, zdrowiu i treningach',
      start_message: `Hey there! I'm Coach Mike. I see you're new here. What are your fitness goals? Want some help with your form on that exercise?`,
      systemPrompt: `You are Coach Mike, an energetic and motivating personal trainer. Your goal is to help the user practice English in a gym context, discussing goals, exercises, and nutrition.`,
      icon: '💪',
      color: 'from-green-500 to-lime-500'
    },
    {
      id: 'hotel',
      name: 'Hotel Reception',
      description: 'Practice checking into a hotel and making requests',
      polishTranslation: 'Praktykuj zameldowanie w hotelu i składanie próśb',
      start_message: `Good afternoon! Welcome to the Grand Majesty Hotel. Do you have a reservation with us today?`,
      systemPrompt: `You are Olivia, a receptionist at a luxury hotel. Your goal is to simulate the entire hotel check-in process and address guest requests.`,
      icon: '🏨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'environment',
      name: 'Environmental Debate',
      description: 'Discuss climate change and solutions (B2/C1 Level)',
      polishTranslation: 'Dyskutuj o zmianach klimatu i rozwiązaniach (poziom B2/C1)',
      start_message: `Hi there. I've been reading a lot about renewable energy lately and how it's becoming more affordable. What's your take on the biggest environmental challenge we're facing?`,
      systemPrompt: `You are David, a well-informed and passionate environmental science student. Your goal is to have a thoughtful debate/discussion on environmental issues to practice advanced English.`,
      icon: '🌱',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'party',
      name: 'Party Small Talk',
      description: 'Practice the art of casual conversation at a social event',
      polishTranslation: 'Praktykuj sztukę swobodnej konwersacji na imprezie',
      start_message: `Hey! I don't think we've met. I'm Chloe, a friend of Sarah's. So, how do you know the host?`,
      systemPrompt: `You are Chloe, a sociable and chatty guest at a party. Your goal is to practice the flow of "small talk" – informal, light conversation with a stranger.`,
      icon: '🎉',
      color: 'from-pink-500 to-rose-500'
    }
  ],
  de: [
    {
      id: 'travel',
      name: 'Reiseberatung',
      description: 'Übe Gespräche rund ums Reisen po niemiecku',
      polishTranslation: 'Praktykuj rozmowy podróżnicze po niemiecku',
      start_message: 'Willkommen im Reisebüro! Wohin möchten Sie reisen und wie kann ich Ihnen helfen?',
      systemPrompt: `Du bist Alex, ein freundlicher Reiseberater. Führe das Gespräch vollständig auf Deutsch und hilf dem Nutzer, seine Reisepläne zu besprechen. Stelle Fragen, udziel Ratschläge und poprawiaj błędy językowe taktownie.`,
      icon: '✈️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'job',
      name: 'Vorstellungsgespräch',
      description: 'Symuluj rozmowę kwalifikacyjną po niemiecku',
      polishTranslation: 'Symuluj rozmowę kwalifikacyjną po niemiecku',
      start_message: 'Guten Tag und vielen Dank, dass Sie heute gekommen sind. Erzählen Sie mir bitte etwas über sich und Ihre bisherigen Erfahrungen.',
      systemPrompt: `Du bist Sarah, eine professionelle Personalmanagerin. Führe das gesamte Gespräch auf Deutsch, zadawaj pytania rekrutacyjne i udzielaj konstruktywnych wskazówek.`,
      icon: '💼',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'daily',
      name: 'Alltagssprache',
      description: 'Prowadź swobodne rozmowy po niemiecku',
      polishTranslation: 'Codzienne rozmowy po niemiecku',
      start_message: 'Hey, schön dich zu sehen! Was hast du in letzter Zeit so gemacht?',
      systemPrompt: `Du bist Mark, ein lockerer Muttersprachler. Sprich ganz natürlich auf Deutsch, zadawaj pytania i reaguj swobodnie, pomagając użytkownikowi ćwiczyć codzienną komunikację.`,
      icon: '☕',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'restaurant',
      name: 'Im Restaurant',
      description: 'Ćwicz zamawianie w restauracji po niemiecku',
      polishTranslation: 'Praktykuj rozmowy w restauracji po niemiecku',
      start_message: 'Guten Abend und herzlich willkommen! Mein Name ist Chloe. Darf ich Ihnen schon etwas zu trinken bringen?',
      systemPrompt: `Du bist Chloe, eine aufmerksame Kellnerin. Prowadź scenariusz zamawiania w całości po niemiecku i ucz użytkownika odpowiednich zwrotów.`,
      icon: '🍽️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'doctor',
      name: 'Beim Arzt',
      description: 'Opisuj objawy i otrzymuj porady po niemiecku',
      polishTranslation: 'Symuluj wizytę u lekarza po niemiecku',
      start_message: 'Guten Tag, ich bin Dr. Weber. Nehmen Sie bitte Platz. Was führt Sie heute zu mir?',
      systemPrompt: `Du bist Dr. Weber, ein ruhiger und gewissenhafter Arzt. Zadawaj pytania o objawy, udzielaj porad i wszystko prowadź po niemiecku.`,
      icon: '🩺',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'shopping',
      name: 'Einkaufen',
      description: 'Rozmawiaj o zakupach i cenach po niemiecku',
      polishTranslation: 'Praktykuj zakupy po niemiecku',
      start_message: 'Willkommen! Suchen Sie etwas Bestimmtes oder stöbern Sie nur?',
      systemPrompt: `Du bist ein hilfsbereiter Verkäufer. Prowadź rozmowę sprzedażową po niemiecku, pytaj o potrzeby i pomagaj w wyborze.`,
      icon: '🛍️',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'school',
      name: 'Schulleben',
      description: 'Dyskutuj o szkole i studiach po niemiecku',
      polishTranslation: 'Dyskutuj o szkole po niemiecku',
      start_message: 'Hallo! Ich glaube, wir haben zusammen Mathematik. Wie fandest du die letzte Vorlesung?',
      systemPrompt: `Du bist Sam, ein Mitschüler. Prowadź swobodną rozmowę po niemiecku o zajęciach, nauczycielach i planach na przyszłość.`,
      icon: '📚',
      color: 'from-violet-500 to-indigo-500'
    },
    {
      id: 'emergency',
      name: 'Notruf',
      description: 'Ćwicz rozmowy w nagłych wypadkach po niemiecku',
      polishTranslation: 'Praktykuj radzenie sobie w sytuacjach awaryjnych po niemiecku',
      start_message: 'Notrufzentrale, wo befinden Sie sich genau? Bleiben Sie ruhig und schildern Sie bitte, was passiert ist.',
      systemPrompt: `Du bist eine Rettungsleitstelle. Zadawaj szczegółowe pytania i udzielaj wskazówek ratunkowych po niemiecku.`,
      icon: '🚨',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'movies',
      name: 'Filmgespräche',
      description: 'Rozmawiaj o filmach po niemiecku',
      polishTranslation: 'Rozmawiaj o filmach po niemiecku',
      start_message: 'Hast du den neuen Film im Kino schon gesehen? Ich war total begeistert!',
      systemPrompt: `Du bist Jordan, ein Filmfan. Prowadź entuzjastyczną rozmowę o filmach i serialach po niemiecku.`,
      icon: '🎬',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'tech_support',
      name: 'Technischer Support',
      description: 'Tłumacz problemy techniczne po niemiecku',
      polishTranslation: 'Praktykuj wsparcie techniczne po niemiecku',
      start_message: 'Guten Tag, hier ist der technische Support. Können Sie mir Ihr Problem kurz schildern?',
      systemPrompt: `Du bist ein geduldiger Support-Mitarbeiter. Wyjaśniaj kroki po niemiecku i pomagaj rozwiązać problem.`,
      icon: '💻',
      color: 'from-gray-500 to-blue-500'
    },
    {
      id: 'gym',
      name: 'Im Fitnessstudio',
      description: 'Mów o treningu i zdrowiu po niemiecku',
      polishTranslation: 'Rozmawiaj o treningu po niemiecku',
      start_message: 'Hallo! Ich bin Trainer Mike. Welche Ziele möchtest du erreichen? Soll ich dir bei der Übung helfen?',
      systemPrompt: `Du bist Mike, ein motivierender Trainer. Prowadź rozmowę po niemiecku, dawaj wskazówki treningowe i chwal postępy użytkownika.`,
      icon: '💪',
      color: 'from-green-500 to-lime-500'
    },
    {
      id: 'hotel',
      name: 'Hotelrezeption',
      description: 'Ćwicz zameldowanie po niemiecku',
      polishTranslation: 'Praktykuj zameldowanie po niemiecku',
      start_message: 'Guten Tag! Willkommen im Hotel Sonnenschein. Haben Sie eine Reservierung?',
      systemPrompt: `Du bist Olivia, eine Rezeptionistin. Prowadź rozmowę meldunkową w całości po niemiecku, pomagając w każdej sytuacji.`,
      icon: '🏨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'environment',
      name: 'Umweltdiskussion',
      description: 'Dyskutuj o klimacie po niemiecku',
      polishTranslation: 'Rozmawiaj o klimacie po niemiecku',
      start_message: 'Ich habe neulich einen spannenden Artikel über erneuerbare Energien gelesen. Was denkst du über den Klimawandel?',
      systemPrompt: `Du bist David, ein engagierter Student. Prowadź zaawansowaną debatę po niemiecku, zachęcając do dłuższych wypowiedzi.`,
      icon: '🌱',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'party',
      name: 'Smalltalk auf der Party',
      description: 'Ćwicz luźne rozmowy po niemiecku',
      polishTranslation: 'Rozmawiaj na imprezie po niemiecku',
      start_message: 'Hey! Schön dich kennenzulernen. Ich bin Chloe, eine Freundin des Gastgebers. Wie kennst du ihn?',
      systemPrompt: `Du bist Chloe, eine gesellige Person. Prowadź lekką rozmowę small talk po niemiecku i zachęcaj użytkownika do zadawania pytań.`,
      icon: '🎉',
      color: 'from-pink-500 to-rose-500'
    }
  ],
  es: [
    {
      id: 'travel',
      name: 'Agencia de viajes',
      description: 'Practica conversaciones de viaje en español',
      polishTranslation: 'Praktykuj rozmowy podróżnicze po hiszpańsku',
      start_message: '¡Bienvenido a nuestra agencia! ¿A dónde te gustaría viajar y en qué puedo ayudarte?',
      systemPrompt: `Eres Alex, un asesor de viajes amable. Lleva toda la conversación en español, haz preguntas útiles y corrige errores de manera delicada.`,
      icon: '✈️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'job',
      name: 'Entrevista de trabajo',
      description: 'Simula una entrevista laboral en español',
      polishTranslation: 'Symuluj rozmowę kwalifikacyjną po hiszpańsku',
      start_message: 'Hola, gracias por venir hoy. Cuéntame un poco sobre ti y tu experiencia.',
      systemPrompt: `Eres Sarah, una reclutadora profesional. Haz la entrevista completamente en español y ofrece retroalimentación útil.`,
      icon: '💼',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'daily',
      name: 'Vida cotidiana',
      description: 'Practica conversaciones informales en español',
      polishTranslation: 'Codzienne rozmowy po hiszpańsku',
      start_message: '¡Hola! Qué gusto saludarte. ¿Qué has hecho últimamente?',
      systemPrompt: `Eres Marcos, un hablante nativo amigable. Conversa en español de forma natural, haz preguntas y corrige suavemente los errores del usuario.`,
      icon: '☕',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'restaurant',
      name: 'En el restaurante',
      description: 'Practica pedir comida en español',
      polishTranslation: 'Praktykuj rozmowy w restauracji po hiszpańsku',
      start_message: '¡Buenas noches! Bienvenido al restaurante. Soy Chloe. ¿Deseas empezar con alguna bebida?',
      systemPrompt: `Eres Chloe, una camarera atenta. Lleva toda la experiencia gastronómica en español, sugiere platos y responde preguntas.`,
      icon: '🍽️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'doctor',
      name: 'Visita al médico',
      description: 'Describe síntomas y recibe consejos en español',
      polishTranslation: 'Symuluj wizytę u lekarza po hiszpańsku',
      start_message: 'Hola, soy el doctor Ramírez. Tome asiento, por favor. ¿Qué te trae hoy aquí?',
      systemPrompt: `Eres el Dr. Ramírez, un médico calmado. Haz preguntas de seguimiento, ofrece recomendaciones y mantén la conversación en español.`,
      icon: '🩺',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'shopping',
      name: 'De compras',
      description: 'Habla sobre compras y precios en español',
      polishTranslation: 'Praktykuj zakupy po hiszpańsku',
      start_message: '¡Hola! ¿Buscas algo en particular o solo estás mirando?',
      systemPrompt: `Eres un vendedor servicial. Mantén la conversación en español, pregunta por gustos y sugiere productos.`,
      icon: '🛍️',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'school',
      name: 'Vida escolar',
      description: 'Comenta asignaturas y estudios en español',
      polishTranslation: 'Dyskutuj o szkole po hiszpańsku',
      start_message: '¡Hola! Creo que compartimos la clase de matemáticas. ¿Qué te pareció la última tarea?',
      systemPrompt: `Eres Sam, un compañero de clase. Conversa sobre la vida escolar completamente en español y anima al usuario a explayarse.`,
      icon: '📚',
      color: 'from-violet-500 to-indigo-500'
    },
    {
      id: 'emergency',
      name: 'Emergencias',
      description: 'Practica llamadas de emergencia en español',
      polishTranslation: 'Praktykuj radzenie sobie w nagłych wypadkach po hiszpańsku',
      start_message: 'Servicio de emergencias, ¿cuál es tu ubicación exacta? Mantén la calma y cuéntame qué ha pasado.',
      systemPrompt: `Eres un operador del 112. Haz preguntas claras, ofrece instrucciones y habla solo en español.`,
      icon: '🚨',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'movies',
      name: 'Cine y series',
      description: 'Conversaciones sobre entretenimiento en español',
      polishTranslation: 'Rozmawiaj o filmach po hiszpańsku',
      start_message: '¿Has visto la última película que estrenaron en el cine? ¡Me encantó!',
      systemPrompt: `Eres Jordan, un gran aficionado al cine. Comparte opiniones, haz preguntas y anima al usuario a describir gustos en español.`,
      icon: '🎬',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'tech_support',
      name: 'Soporte técnico',
      description: 'Explica problemas técnicos en español',
      polishTranslation: 'Praktykuj wsparcie techniczne po hiszpańsku',
      start_message: 'Hola, gracias por llamar al soporte técnico. ¿Puedes explicarme qué sucede con tu conexión?',
      systemPrompt: `Eres un agente paciente. Da instrucciones paso a paso y resuelve dudas completamente en español.`,
      icon: '💻',
      color: 'from-gray-500 to-blue-500'
    },
    {
      id: 'gym',
      name: 'En el gimnasio',
      description: 'Habla de entrenamiento y salud en español',
      polishTranslation: 'Rozmawiaj o treningu po hiszpańsku',
      start_message: '¡Hola! Soy el entrenador Mike. ¿Cuáles son tus objetivos y en qué puedo ayudarte hoy?',
      systemPrompt: `Eres Mike, un entrenador motivador. Explica ejercicios y hábitos saludables únicamente en español.`,
      icon: '💪',
      color: 'from-green-500 to-lime-500'
    },
    {
      id: 'hotel',
      name: 'Recepción del hotel',
      description: 'Practica el registro en un hotel en español',
      polishTranslation: 'Praktykuj zameldowanie po hiszpańsku',
      start_message: '¡Buenas tardes! Bienvenido al Hotel Horizonte. ¿Tiene una reserva?',
      systemPrompt: `Eres Olivia, recepcionista de un hotel. Ayuda con el check-in, responde solicitudes y mantén todo en español.`,
      icon: '🏨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'environment',
      name: 'Debate ambiental',
      description: 'Debate sobre clima y sostenibilidad en español',
      polishTranslation: 'Dyskutuj o klimacie po hiszpańsku',
      start_message: 'He estado leyendo sobre energías renovables y me interesa tu opinión. ¿Qué crees que es lo más urgente?',
      systemPrompt: `Eres David, un estudiante comprometido. Lleva una discusión profunda en español, anima al usuario a argumentar y explicar.`,
      icon: '🌱',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'party',
      name: 'Charla en una fiesta',
      description: 'Practica el small talk en español',
      polishTranslation: 'Praktykuj small talk po hiszpańsku',
      start_message: '¡Hola! Creo que no nos conocemos. Soy Chloe, amiga del anfitrión. ¿Cómo lo conoces?',
      systemPrompt: `Eres Chloe, una invitada extrovertida. Mantén una conversación ligera en español y motiva al usuario a compartir detalles personales sencillos.`,
      icon: '🎉',
      color: 'from-pink-500 to-rose-500'
    }
  ],
};

const DIFFICULTY_DETAILS: Record<DifficultyLevel, { label: string; helper: string; description: string }> = {
  beginner: {
    label: 'Początkujący',
    helper: 'Jasne, krótkie wypowiedzi',
    description: 'Idealne tempo dla osób zaczynających przygodę z językiem.',
  },
  intermediate: {
    label: 'Średnio zaawansowany',
    helper: 'Naturalne dialogi',
    description: 'Równowaga między nowym słownictwem a utrwalaniem podstaw.',
  },
  advanced: {
    label: 'Zaawansowany',
    helper: 'Bogate, wymagające wypowiedzi',
    description: 'Dla osób, które chcą dopracować płynność i styl wypowiedzi.',
  },
};

const CONVERSATION_DIFFICULTY_OPTIONS: LevelOption<DifficultyLevel>[] = [
  {
    value: 'beginner',
    label: DIFFICULTY_DETAILS.beginner.label,
    helper: DIFFICULTY_DETAILS.beginner.helper,
    helperClassName: 'text-slate-400',
    selectedHelperClassName: 'text-white/80',
    selectedClass: LEVEL_STYLE_PRESETS.easy,
  },
  {
    value: 'intermediate',
    label: DIFFICULTY_DETAILS.intermediate.label,
    helper: DIFFICULTY_DETAILS.intermediate.helper,
    helperClassName: 'text-slate-400',
    selectedHelperClassName: 'text-slate-800/80',
    selectedClass: LEVEL_STYLE_PRESETS.medium,
  },
  {
    value: 'advanced',
    label: DIFFICULTY_DETAILS.advanced.label,
    helper: DIFFICULTY_DETAILS.advanced.helper,
    helperClassName: 'text-slate-400',
    selectedHelperClassName: 'text-white/80',
    selectedClass: LEVEL_STYLE_PRESETS.hard,
  },
];

const MODEL = 'gpt-4o-mini';
const FREE_MESSAGE_LIMIT = 3;
const LIMIT_NOTIFICATION = 'Limit darmowych wiadomości został wyczerpany. Skontaktuj się z nami, aby odblokować pełny dostęp.';

export default function GamePage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [corrections, setCorrections] = useState<Record<number, string>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const messageTimerRef = useRef<number>(Date.now());
  const isPremiumUser = userProfile?.user_type === 'premium';

  const currentLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === language),
    [language],
  );
  const recognitionLocale = currentLanguageOption?.recognitionLocale ?? 'en-US';
  const targetLabel = currentLanguageOption?.label ?? 'Angielski';
  const scenarios = useMemo(
    () => SCENARIOS_BY_LANGUAGE[language as LearningLanguage] ?? SCENARIOS_BY_LANGUAGE.en,
    [language],
  );

  useEffect(() => {
    setSelectedScenario(null);
    setMessages([]);
    setCorrections({});
    setMessageCount(0);
    setInput('');
  }, [language]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          if (!isAuthSessionMissingError(authError)) {
            console.error('Auth error:', authError);
          }
          setIsCheckingLimit(false);
          return;
        }

        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, user_type')
            .eq('id', user.id)
            .single();

          if (error) {
            setUserProfile({ id: user.id, user_type: 'basic' });
          } else if (profile) {
            const normalizedUserType =
              profile.user_type?.toLowerCase() === 'premium' ? 'premium' : 'basic';

            setUserProfile({
              id: profile.id,
              user_type: normalizedUserType,
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
  }, []);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([{ text: scenario.start_message, sender: 'npc' }]);
    setCorrections({});
    setMessageCount(0);
    setInput('');
    messageTimerRef.current = Date.now();
  };

  const sendMessage = async () => {
    if (!selectedScenario || !input.trim() || isLoading) {
      return;
    }

    if (userProfile?.user_type === 'basic' && messageCount >= FREE_MESSAGE_LIMIT) {
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1]?.text === LIMIT_NOTIFICATION) {
          return prev;
        }
        return [...prev, { text: LIMIT_NOTIFICATION, sender: 'npc' }];
      });
      setInput('');
      return;
    }

    const cleanedInput = input.trim();
    const userMessage = { text: cleanedInput, sender: 'player' as const };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (!authError && user && user.id !== 'anonymous' && user.id !== 'error') {
        await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            message: cleanedInput,
            scenario: selectedScenario.id,
            difficulty: selectedDifficulty,
          });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: MODEL,
          scenario: selectedScenario.id,
          difficulty: selectedDifficulty,
          mode: 'npc',
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('API response not OK');
      }

      const { reply } = await response.json();
      setMessages((prev) => [...prev, { text: reply, sender: 'npc' }]);

      const correctionResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: MODEL,
          difficulty: selectedDifficulty,
          mode: 'correction',
          language,
        }),
      });

      let correctionReply = '';
      let correctionStatus = 0;
      if (correctionResponse.ok) {
        const correctionPayload = await correctionResponse.json();
        correctionReply = correctionPayload.reply ?? '';
        correctionStatus = correctionPayload.status ?? 0;
        const userMessageIndex = newMessages.length - 1;
        const hasErrors =
          correctionStatus !== 0 &&
          correctionReply.trim() !== '' &&
          correctionReply.trim() !== cleanedInput;

        if (hasErrors) {
          setCorrections((prev) => ({ ...prev, [userMessageIndex]: correctionReply }));
        } else {
          setCorrections((prev) => {
            const updated = { ...prev };
            delete updated[userMessageIndex];
            return updated;
          });
        }
      }

      const now = Date.now();
      const timeTaken = Math.max(0.5, (now - messageTimerRef.current) / 1000);
      messageTimerRef.current = now;

      if (!authError && user && user.id !== 'anonymous' && user.id !== 'error') {
        const hasErrors =
          correctionStatus !== 0 &&
          correctionReply.trim() !== '' &&
          correctionReply.trim() !== cleanedInput;

        await saveAttempt(user.id, {
          type: 'conversation',
          id: `${selectedScenario.id}-${Date.now()}`,
          isCorrect: !hasErrors,
          timeTaken,
          difficulty: selectedDifficulty,
          skillTags: ['conversation', selectedScenario.id, selectedDifficulty],
          prompt: selectedScenario.start_message,

          userAnswer: cleanedInput,
          metadata: {
            scenario: selectedScenario.id,
            difficulty: selectedDifficulty,
            npc_reply: reply,
            correction: correctionReply,
            language,
            message_count: messageCount + 1,
          },
          source: 'conversation_trainer',
          mistakeNote: hasErrors ? correctionReply : undefined,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Trener jest obecnie niedostępny. Spróbuj ponownie później.', sender: 'npc' },
      ]);
      setMessageCount((prev) => (prev > 0 ? prev - 1 : 0));
    } finally {
      setIsLoading(false);
    }
  };

  const startRecognition = (setter: (value: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert('Twoja przeglądarka nie obsługuje rozpoznawania mowy.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = recognitionLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setter(transcript);
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const hasReachedLimit = userProfile?.user_type === 'basic' && messageCount >= FREE_MESSAGE_LIMIT;
  const showMessageInfo =
    userProfile?.user_type === 'basic' && messageCount > 0 && !hasReachedLimit;
  const remainingMessages = Math.max(0, FREE_MESSAGE_LIMIT - messageCount);

  const placeholder = !selectedScenario
    ? 'Wybierz scenariusz, aby rozpocząć rozmowę.'
    : hasReachedLimit
      ? 'Limit darmowych wiadomości został wyczerpany.'
      : `Napisz wiadomość w języku ${targetLabel.toLowerCase()} i naciśnij enter.`;

  if (isCheckingLimit) {
    return (
      <>
        <Navbar />
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <div className='h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#1D4ED8]' />
            <p className='text-lg font-medium'>Ładujemy Twój profil...</p>
            <p className='text-sm text-slate-400'>To zajmie tylko chwilę.</p>
          </div>
        </div>
      </>
    );
  }

  if (!isPremiumUser) {
    return (
      <>
        <Navbar />
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100'>
          <div className='max-w-lg space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur-md'>
            <h1 className='text-2xl font-semibold text-slate-100'>Opcja rozmowy tylko w wersji Premium</h1>
            <p className='text-sm text-slate-300'>
              Trener rozmów jest dostępny wyłącznie dla użytkowników z aktywną subskrypcją Premium. Zaloguj się na konto premium
              lub skontaktuj się z nami, aby uaktualnić swój plan i odblokować dostęp do rozmów.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100'>
        <main className='mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10'>


          <div className='grid gap-8 lg:grid-cols-[1fr_1.4fr]'>
            <section className='flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md'>
              <div className='space-y-2'>
                <h2 className='text-lg font-semibold text-slate-100'>Scenariusze</h2>
                <p className='text-sm text-slate-400'>
                  Aktualny język: <span className='font-medium text-slate-200'>{targetLabel}</span>
                </p>
              </div>

              <div className='space-y-3'>
                <LevelSelector
                  options={CONVERSATION_DIFFICULTY_OPTIONS}
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  className='flex flex-wrap gap-3'
                  buttonClassName='min-w-[12rem] text-left'
                />
                <p className='text-sm text-slate-400'>{DIFFICULTY_DETAILS[selectedDifficulty].description}</p>
              </div>

              <div className='flex max-h-[34rem] flex-col gap-3 overflow-y-auto pr-2'>
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type='button'
                    onClick={() => startScenario(scenario)}
                    className={`rounded-xl border px-4 py-4 text-left transition ${
                      selectedScenario?.id === scenario.id
                        ? 'border-[#1D4ED8] bg-[#1D4ED8]/15 text-slate-100'
                        : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:text-slate-100'
                    }`}
                  >
                    <span className='text-base font-medium text-slate-100'>{scenario.name}</span>
                    <p className='mt-2 text-sm text-slate-300'>{scenario.description}</p>
                    {scenario.polishTranslation && (
                      <p className='mt-2 text-xs text-slate-400'>{scenario.polishTranslation}</p>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className='flex flex-col rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md'>
              <header className='border-b border-white/10 pb-4'>
                <h2 className='text-xl font-semibold text-slate-100'>
                  {selectedScenario ? selectedScenario.name : 'Rozpocznij rozmowę'}
                </h2>
                <p className='text-sm text-slate-400'>
                  {selectedScenario
                    ? 'Prowadź dialog i rozwijaj swoje umiejętności konwersacji.'
                    : 'Wybierz scenariusz po lewej stronie, aby rozpocząć trening.'}
                </p>
              </header>

              <div className='mt-4 flex min-h-[22rem] flex-col gap-4 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-100'>
                {messages.length === 0 ? (
                  <div className='rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300'>
                    Wybierz scenariusz, aby zobaczyć wiadomości startowe.
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const hasCorrection = msg.sender === 'player' && corrections[index];
                    return (
                      <div key={`${msg.sender}-${index}`} className='space-y-2'>
                        <div className={`flex ${msg.sender === 'npc' ? 'justify-start' : 'justify-end'}`}>
                          <div
                            className={`max-w-[85%] rounded-xl border px-4 py-3 ${
                              msg.sender === 'npc'
                                ? 'border-white/10 bg-white/10 text-slate-100'
                                : 'border-[#1D4ED8]/40 bg-[#1D4ED8]/20 text-slate-100'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                        {hasCorrection && (
                          <div className='flex justify-end'>
                            <div className='max-w-[85%] rounded-xl border border-rose-400/40 bg-rose-900/30 px-4 py-3 text-sm text-rose-100'>
                              <p className='font-medium text-rose-200'>Sugestia lektora</p>
                              <div
                                className='mt-2 space-y-2 text-rose-100'
                                dangerouslySetInnerHTML={{ __html: corrections[index] }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSubmit} className='mt-6 space-y-3'>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <input
                    type='text'
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={placeholder}
                    className='flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 disabled:opacity-50'
                    disabled={!selectedScenario || isLoading || hasReachedLimit}
                  />
                  <div className='flex shrink-0 gap-3'>
                    <button
                      type='submit'
                      disabled={!input.trim() || isLoading || !selectedScenario || hasReachedLimit}
                      className='rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:from-[#1E40AF] hover:to-[#172554] disabled:opacity-50'
                    >
                      {isLoading ? 'Wysyłanie...' : 'Wyślij'}
                    </button>
                    <button
                      type='button'
                      onClick={() => startRecognition(setInput)}
                      className='rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/20'
                    >
                      Dyktuj
                    </button>
                  </div>
                </div>

                {showMessageInfo && (
                  <p className='text-xs text-amber-200'>
                    Pozostało {remainingMessages} darmowych wiadomości w tym scenariuszu.
                  </p>
                )}

                {hasReachedLimit && (
                  <div className='rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100'>
                    {LIMIT_NOTIFICATION}
                  </div>
                )}
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

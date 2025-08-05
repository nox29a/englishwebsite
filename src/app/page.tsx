"use client";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Brain,
  Layers3,
  Repeat,
  Pencil,
  FileText,
  Layers,
  Rocket as RocketIcon,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* <h1 className="text-2xl font-bold text-indigo-600">LearnEnglishAI</h1> */}
          <div className="flex items-center space-x-4">
{[
  { href: "/fiszki", label: "Fiszki" },
  { href: "/slowka", label: "Trener słówek" },
  { href: "/czasowniki-nieregularne", label: "Trener nieregularnych" },
]
  .map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
    >
      {label}
    </Link>
))}

{/* Zaloguj się tylko, jeśli user == null */}
{!user && (
  <Link
    href="/login"
    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
  >
    Zaloguj się
  </Link>
)}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-indigo-600 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                aria-label="Przełącz motyw"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      {/* <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Ucz się angielskiego szybciej <br />
            dzięki{" "}
            <span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl">
            Skoncentruj się na najczęściej używanych słowach, korzystaj z
            adaptacyjnych lekcji opartych o sztuczną inteligencję i ucz się
            efektywnie – na swoim poziomie.
          </p>
          <a
            href="#features"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Rozpocznij naukę
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <RocketIcon className="w-48 h-48 text-indigo-500 dark:text-indigo-400" />
        </motion.div>
      </section> */}

      {/* Features */}
      {/* <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: Layers3,
            title: "3 poziomy trudności",
            description:
              "Nauka dopasowana do Twoich potrzeb — od 1000 najczęstszych słów aż po poziom C1.",
          },
          {
            icon: Brain,
            title: "Wykorzystanie AI",
            description:
              "Inteligentne dopasowanie materiałów i tempa nauki zwiększa efektywność.",
          },
          {
            icon: Sparkles,
            title: "Nowoczesny wygląd i animacje",
            description:
              "Intuicyjny design i animacje sprawiają, że nauka to przyjemność.",
          },
        ].map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg shadow-indigo-300/30 hover:shadow-yellow-300/50 transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <Icon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </motion.div>
        ))}
      </section> */}

      {/* Tools */}
      <section
        id="tools"
        className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8"
      >
        {[
          {
            href: "/fiszki",
            icon: BookOpen,
            title: "Fiszki",
            description:
              "Powtarzaj najważniejsze słówka na różnych poziomach – szybko i skutecznie.",
          },
          {
            href: "/slowka",
            icon: Brain,
            title: "Trener słówek",
            description:
              "Interaktywny system nauki, który pomoże Ci opanować nowe słownictwo w praktyce.",
          },
          {
            href: "/zadania",
            icon: Pencil,
            title: "Zadania praktyczne",
            description:
              "Ćwiczenia, dzięki którym utrwalisz słownictwo i poznane struktury w kontekście.",
          },
          {
            href: "/sciaga",
            icon: FileText,
            title: "Ściąga gramatyczna",
            description:
              "Podręczna ściągawka z najważniejszych konstrukcji i czasów gramatycznych.",
          },
          {
            href: "/brak",
            icon: Layers,
            title: "Powtórka mieszana",
            description:
              "Różnorodne ćwiczenia łączące słownictwo, gramatykę i rozumienie ze słuchu.",
          },
          {
            href: "/czasowniki-nieregularne",
            icon: Repeat,
            title: "Czasowniki nieregularne",
            description:
              "Ćwicz formy nieregularnych czasowników i zapamiętuj je skutecznie.",
          },
        ].map(({ href, icon: Icon, title, description }) => (
          <motion.div
            key={title}
            className="group bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer shadow-lg shadow-indigo-300/30 hover:shadow-yellow-300/50 transition-shadow duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={href} className="w-full">
              <Icon className="h-14 w-14 text-indigo-600 mb-4 mx-auto group-hover:text-yellow-400 transition-colors" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{description}</p>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* FAQ */}
      {/* <section
        id="faq"
        className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900 rounded-3xl shadow-lg mb-20"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-400">
          Najczęściej zadawane pytania
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          <details className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg">
              Jak działa poziom trudności?
            </summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Poziomy oparte są na najczęściej używanych słowach i strukturach,
              dzięki czemu uczysz się dokładnie tego, co najbardziej się przyda.
            </p>
          </details>
          <details className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg">
              Czy korzystacie z AI?
            </summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Tak! Nasza sztuczna inteligencja personalizuje materiały i tempo
              nauki, byś osiągnął najlepsze wyniki.
            </p>
          </details>
          <details className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold text-lg">
              Czy strona jest responsywna?
            </summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Oczywiście — działa świetnie na telefonach, tabletach i
              desktopach.
            </p>
          </details>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-6 bg-indigo-900 text-white text-center">
        &copy; 2025 LearnEnglishAI. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
}

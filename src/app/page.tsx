"use client";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
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
  User as UserIcon, // Dodana nowa ikona
} from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
          {/* Lewa strona - logo lub pusta */}
          <div></div>

          {/* Prawa strona - przyciski i toggle motywu */}
          <div className="flex items-center space-x-4">
            {/* Przycisk Konto dla zalogowanych */}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
              >
                <UserIcon className="w-5 h-5" />
                <span>Konto</span>
              </Link>
            )}

            {/* Przycisk Zaloguj się dla niezalogowanych */}
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

      {/* Tools Section */}
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

      {/* Footer */}
      <footer className="py-6 bg-indigo-900 text-white text-center">
        &copy; 2025 LearnEnglishAI. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
}
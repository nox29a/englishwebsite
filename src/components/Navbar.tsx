"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // ikony
import { User } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  user_type: string;
}

export default function Navbar() {
  const [path, setPath] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>("basic");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        
        // Pobierz profil użytkownika
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();
          
        if (profileData && !profileError) {
          setUserType(profileData.user_type);
        }
      }
    };

    getUser();
  }, []);  

  const navLinks = [
    { href: "/", label: "Strona główna" },
    { href: "/flashcards", label: "Fiszki" },
    { href: "/vocabulary", label: "Trener słówek" },
    { href: "/conversation", label: "Rozmowa" },
    { href: "/exercises", label: "Zadania gramatyczne" },
    { href: "/irregular-verbs", label: "Czasowniki nieregularne" },
  ];

  return (
    <nav className="bg-[#0d0a23] border-b border-indigo-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          LearnEnglishAI
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                path === link.href
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-white"
              } transition-colors font-medium`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Konto desktop */}
        {user && (
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition ${
              userType === "premium" 
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600" 
                : "bg-gradient-to-r from-indigo-500 to-purple-600"
            }`}
          >
            <span>Konto</span>
          </Link>
        )}

        {/* Przycisk Zaloguj się dla niezalogowanych */}
        {!user && (
          <Link
            href="/login"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition"
          >
            Zaloguj się
          </Link>
        )}

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a1446] border-t border-indigo-900 px-6 py-4 space-y-4 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${
                path === link.href
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-white"
              } transition-colors font-medium`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? "/dashboard" : "/login"}
            className={`block text-center px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition ${
              userType === "premium" 
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600" 
                : "bg-gradient-to-r from-indigo-500 to-purple-600"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {user ? "Konto" : "Zaloguj się"}
          </Link>
        </div>
      )}
    </nav>
  );
}
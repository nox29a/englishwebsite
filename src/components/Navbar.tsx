"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { Brain } from "lucide-react";


interface Profile {
  id: string;
  user_type: string;
}

export default function Navbar() {
  const [path, setPath] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userType, setUserType] = useState<string>("basic");
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

        // Pobierz punkty użytkownika z leaderboard
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('points')
          .eq('user_id', data.user.id)
          .single();
          
        if (leaderboardData && !leaderboardError) {
          setUserPoints(leaderboardData.points);
        } else {
          // Jeśli użytkownik nie ma jeszcze wpisów w leaderboard, ustaw 0 punktów
          setUserPoints(0);
        }
      }
    };

    getUser();
  }, []);  

  const navLinks = [
    { 
      href: "/cards", 
      label: "Fiszki", 
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      href: "/flashcards", 
      label: "Nauka słówek", 
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      href: "/vocabulary", 
      label: "Dopasowanie słówek", 
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      href: "/conversation", 
      label: "Rozmowa", 
      gradient: "from-amber-500 to-orange-600"
    },
    { 
      href: "/exercises", 
      label: "Zadania gramatyczne", 
      gradient: "from-red-500 to-pink-600"
    },
    { 
      href: "/irregular-verbs", 
      label: "Czasowniki nieregularne", 
      gradient: "from-indigo-500 to-purple-600"
    },
  ];

  // Funkcja do obliczania poziomu na podstawie punktów
  const calculateLevel = (points: number) => {
    return Math.floor(points / 250) + 1; // Każde 250 punktów = 1 poziom
  };

  // Funkcja do obliczania postępu do następnego poziomu
  const calculateProgress = (points: number) => {
    const currentLevelPoints = points % 250;
    const pointsToNext = 250 - currentLevelPoints;
    return { currentLevelPoints, pointsToNext, progressPercent: (currentLevelPoints / 250) * 100 };
  };

  const currentLevel = calculateLevel(userPoints);
  const progress = calculateProgress(userPoints);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-2xl' 
          : 'bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 relative">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse rounded-lg" />
          
          <div className="flex justify-between items-center relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg ">
                AxonAI
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                 
                </div>
                <div className="text-xs text-purple-300 -mt-1"></div>
              </div>
            </Link>

            {/* Menu desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = path === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                        : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm hidden xl:block">{link.label}</span>
                    </div>
                    
                    {isActive && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User section desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <>
                  {/* User stats preview */}
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    <span className="text-sm font-bold text-white">Lvl {currentLevel}</span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-sm font-bold text-white">{userPoints} XP</span>
                  </div>

                  {/* Account button */}
                  <Link
                    href="/dashboard"
                    className={`group relative px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      userType === "premium" 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-yellow-300" 
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>Konto</span>
                    </div>
                    
                    {userType === "premium" && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                    )}
                  </Link>
                </>
              )}

              {/* Login button for non-authenticated users */}
              {!user && (
                <Link
                  href="/login"
                  className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <span>Zaloguj się</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Hamburger mobile */}
            <button
              className="md:hidden w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-110 flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="w-6 h-6 text-white font-bold">
                {mobileOpen ? "X" : "≡"}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 border-l border-white/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            
            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Close button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 transform hover:scale-110 flex items-center justify-center"
                >
                  <div className="w-5 h-5 font-bold">X</div>
                </button>
              </div>

              {/* User info mobile */}
              {user && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      userType === "premium" 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}>
                      <div className="w-6 h-6 text-white font-bold">
                        {userType === "premium" ? "P" : "U"}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white">{userType === "premium" ? "Premium User" : "Basic User"}</div>
                      <div className="text-sm text-gray-300">Level {currentLevel} • {userPoints} XP</div>
                    </div>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{progress.pointsToNext} XP do następnego poziomu</div>
                </div>
              )}

              {/* Navigation links */}
              <div className="space-y-2 flex-1">
                {navLinks.map((link) => {
                  const isActive = path === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        isActive
                          ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                          : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <div className="w-5 h-5 font-bold">
                          {link.label.charAt(0)}
                        </div>
                      </div>
                      <span className="font-medium">{link.label}</span>
                      
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Action button mobile */}
              <div className="pt-6 border-t border-white/10">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg transform hover:scale-105 ${
                    userType === "premium" 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? (
                    <>
                      <span>Przejdź do konta</span>
                    </>
                  ) : (
                    <>
                      <span>Zaloguj się</span>
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
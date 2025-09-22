"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Crown, Star, Zap, Brain, Home, BookOpen, MessageCircle, PenTool, RotateCcw, User, LogIn } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  user_type: string;
}

export default function Navbar() {
  const [path, setPath] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userType, setUserType] = useState<string>("basic");
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
      }
    };

    getUser();
  }, []);  

  const navLinks = [
    { 
      href: "/", 
      label: "Strona główna", 
      icon: Home,
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      href: "/flashcards", 
      label: "Fiszki", 
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      href: "/vocabulary", 
      label: "Trener słówek", 
      icon: Brain,
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      href: "/conversation", 
      label: "Rozmowa", 
      icon: MessageCircle,
      gradient: "from-amber-500 to-orange-600"
    },
    { 
      href: "/exercises", 
      label: "Zadania gramatyczne", 
      icon: PenTool,
      gradient: "from-red-500 to-pink-600"
    },
    { 
      href: "/irregular-verbs", 
      label: "Czasowniki nieregularne", 
      icon: RotateCcw,
      gradient: "from-indigo-500 to-purple-600"
    },
  ];

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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  LearnEnglishAI
                </div>
                <div className="text-xs text-purple-300 -mt-1">Dopamine Learning System</div>
              </div>
            </Link>

            {/* Menu desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
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
                      <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} />
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
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-white">Lvl 5</span>
                    <div className="w-px h-4 bg-white/20" />
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">1250 XP</span>
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
                      {userType === "premium" && <Crown className="w-5 h-5" />}
                      <User className="w-5 h-5" />
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
                    <LogIn className="w-5 h-5" />
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
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                  <X className="w-5 h-5" />
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
                      {userType === "premium" ? <Crown className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">{userType === "premium" ? "Premium User" : "Basic User"}</div>
                      <div className="text-sm text-gray-300">Level 5 • 1250 XP</div>
                    </div>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full w-3/4 transition-all duration-1000" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">750/1000 XP do następnego poziomu</div>
                </div>
              )}

              {/* Navigation links */}
              <div className="space-y-2 flex-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
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
                        <IconComponent className="w-5 h-5" />
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
                      {userType === "premium" && <Crown className="w-5 h-5" />}
                      <User className="w-5 h-5" />
                      <span>Przejdź do konta</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
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
"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { isAuthSessionMissingError } from "@/lib/authErrorUtils";
import Navbar from "@/components/Navbar";
import EarthCanvas from "@/components/EarthCanvas";

import {
  Brain,
  BookOpen,
  Zap, 
  TrendingUp, 
  MessageCircle, 
  PenTool, 
  RotateCcw, 
  TestTube, 
  CreditCard, 
  BarChart, 
  Star, 
  Check, 
  Crown, 
  Sparkles,
  Trophy,
  Target,
  Flame,
  Globe,
  Users,
  Award,
  Rocket,
  ArrowRight,
  Play,
  type LucideIcon,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        if (!isAuthSessionMissingError(error)) {
          console.error("Nie udało się pobrać informacji o użytkowniku:", error);
        }
        return;
      }

      if (data?.user) {
        setUser(data.user);
      }
    };

    getUser();
  }, []);  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#030712] via-[#050b1f] to-black text-slate-100 relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.25),_transparent_60%)] opacity-80 animate-pulse" />
        
{/* Hero Section */}
<div className="relative z-10 py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Lewa strona - tekst i przyciski */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <div className="mb-8 inline-block"></div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#cbd5f5] to-[#93c5fd] bg-clip-text text-transparent">
          Popraw swój angielski z axonAI
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-slate-300">
          Od uczniów dla uczniów
        </p>

        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-12">
          <Link
            href="/vocabulary"
            className="group px-8 py-4 bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] hover:from-[#1E40AF] hover:to-[#172554] rounded-xl font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(29,78,216,0.35)] hover:shadow-[0_15px_40px_rgba(29,78,216,0.45)] transform hover:scale-105 flex items-center gap-3 justify-center"
          >
            <Play className="w-5 h-5" />
            <span>Rozpocznij</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Prawa strona - wizualizacja 3D */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end">
        <div className="w-full">
          <EarthCanvas />
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Features Section */}
        {/* <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100">
            Dlaczego warto?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Brain}
              title="Rozmowy z AI"
              description="Konwersacje z inteligentnym asystentem dostosowane do Twojego poziomu"
              gradient="from-[#1D4ED8] to-[#1E3A8A]"
            />
            <FeatureCard
              icon={BookOpen}
              title="Personalizowane lekcje"
              description="Materiały dopasowane do Twoich celów i zainteresowań"
              gradient="from-[#172554] to-[#1f3b7a]"
            />
            <FeatureCard
              icon={Zap}
              title="Natychmiastowa informacja zwrotna"
              description="Błyskawiczna korekta błędów i sugestie poprawy"
              gradient="from-[#0b1f44] to-[#143463]"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Śledzenie postępów"
              description="Monitoruj swoje osiągnięcia i motywuj się do dalszej nauki"
              gradient="from-[#102041] to-[#1D4ED8]/75"
            />
          </div>
        </section> */}

        {/* Tools Showcase */}
        <section className="py-16 bg-black/40 backdrop-blur-md px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100">
              Narzędzia
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ToolCard
                title="Nauka słówek"
                description="Powtarzaj najważniejsze słówka na różnych poziomach – szybko i skutecznie."
                href="/flashcards"
                icon={BookOpen}
                gradient="from-[#1D4ED8] to-[#1E3A8A]"
              />
              <ToolCard
                title="Ściąga gramatyczna"
                description="Podręczna ściągawka z najważniejszych konstrukcji i czasów gramatycznych."
                href="/grammar"
                icon={PenTool}
                gradient="from-[#172554] to-[#1f3b7a]"
              />
              <ToolCard
                title="Dopasowanie słówek"
                description="Interaktywny system nauki który pomoże Ci opanować nowe słownictwo w praktyce."
                href="/vocabulary"
                icon={Brain}
                gradient="from-[#0b1f44] to-[#143463]"
              />
              <ToolCard
                title="Rozmowa z AI"
                description="Różnorodne ćwiczenia łączące słownictwo, gramatykę i ze słuchu."
                href="/conversation"
                icon={MessageCircle}
                gradient="from-[#1b2551] to-[#1d4ed8]/80"
              />
              <ToolCard
                title="Zadania gramatyczne"
                description="Ćwiczenia, dzięki którym utrwalisz słownictwo i poznane struktury w kontekście."
                href="/exercises"
                icon={Target}
                gradient="from-[#14213d] to-[#1D4ED8]/70"
              />
              <ToolCard
                title="Czasowniki nieregularne"
                description="Ćwicz formy nieregularnych czasowników i zapamiętuj je skutecznie."
                href="/irregular-verbs"
                icon={RotateCcw}
                gradient="from-[#0f172a] to-[#1e3a8a]"
              />
              <ToolCard
                title="Testy"
                description="Sprawdź swoją wiedzę zależnie od poziomu"
                href="/test"
                icon={TestTube}
                gradient="from-[#102041] to-[#1D4ED8]/75"
              />
              <ToolCard
                title="Fiszki"
                description="Ćwicz nowe słówka i zapamiętuj je skutecznie."
                href="/cards"
                icon={CreditCard}
                gradient="from-[#18213f] to-[#1e40af]"
              />
              <ToolCard
                title="Rozmowa z AI"
                description="Różnorodne ćwiczenia łączące słownictwo, gramatykę i rozumienie ze słuchu."
                href="/"
                icon={MessageCircle}
                gradient="from-[#0b162f] to-[#1b2e5b]"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {/* <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100">
            Wybierz plan dla siebie
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard 
              name="Basic"
              price="0"
              features={[
                "Ograniczony dostęp do materiałów",
                "Podstawowe fiszki",
                "Śledzenie postępów"
              ]}
              cta="Rozpocznij za darmo"
              featured={false}
            />
            <PricingCard 
              name="Premium"
              price="14.99"
              features={[
                "Pełny dostęp do kursów",
                "Rozmowy z Agentami AI",
                "Nieograniczona nauka",
                "Premium wsparcie"
              ]}
              cta="Kup dostęp"
              featured={true}
            />
          </div>
        </section> */}

        {/* Testimonials */}
        {/* <section className="py-16 bg-black/40 backdrop-blur-md px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100">
              Dołącz do zadowolonych uczniów
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Testimonial 
                quote="W 3 miesiące poprawiłem swój angielski na tyle, że dostałem awans w pracy!"
                author="Marek, 32 lata"
              />
              <Testimonial 
                quote="Najlepsza platforma do nauki jaką próbowałam. Uwielbiam system nauki słówek!"
                author="Anna, 25 lat"
              />
              <Testimonial 
                quote="Nauka z AI to game-changer. Polecam każdemu!"
                author="Kasia, 28 lat"
              />
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        {/* <section className="py-20 bg-gradient-to-r from-[#1D4ED8]/30 to-[#1E3A8A]/30 backdrop-blur-md text-center px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Rocket className="w-5 h-5 text-[#93c5fd]" />
              <span className="text-slate-200 font-medium">Gotowy na przygodę?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
              Gotów zacząć swoją przygodę z angielskim?
            </h2>
            <p className="text-xl mb-8 text-slate-300">
              Dołącz do nas i zobacz różnicę już po pierwszej lekcji!
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] hover:from-[#1E40AF] hover:to-[#172554] px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_12px_35px_rgba(29,78,216,0.45)] hover:shadow-[0_16px_45px_rgba(29,78,216,0.55)] transform hover:scale-105"
            >
              <Trophy className="w-6 h-6" />
              <span>Zarejestruj się teraz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="bg-black/70 backdrop-blur-md text-slate-300 py-12 px-4 border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-slate-100" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">AxonAI</h3>
              </div>
              <p className="text-slate-400">Najskuteczniejsza platforma do nauki angielskiego online.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-100">Narzędzia</h4>
              <ul className="space-y-2">
                <li><Link href="/flashcards" className="hover:text-[#1D4ED8] transition-colors">Fiszki</Link></li>
                <li><Link href="/grammar" className="hover:text-[#1D4ED8] transition-colors">Ściąga gramatyczna</Link></li>
                <li><Link href="/vocabulary" className="hover:text-[#1D4ED8] transition-colors">Trener słówek</Link></li>
                <li><Link href="/conversation" className="hover:text-[#1D4ED8] transition-colors">Rozmowa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-100">Firma</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-[#1D4ED8] transition-colors">O nas</Link></li>
                <li><Link href="/pricing" className="hover:text-[#1D4ED8] transition-colors">Cennik</Link></li>
                <li><Link href="/regulamin" className="hover:text-[#1D4ED8] transition-colors">Regulamin</Link></li>
                <li><Link href="/contact" className="hover:text-[#1D4ED8] transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-100">Social Media</h4>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-[#1D4ED8] transition-colors">Facebook</Link>
                <Link href="#" className="hover:text-[#1D4ED8] transition-colors">Instagram</Link>
                <Link href="#" className="hover:text-[#1D4ED8] transition-colors">TikTok</Link>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-slate-500">© 2025 AxonAI. Wszystkie prawa zastrzeżone.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// Component for feature cards
function FeatureCard({ icon: IconComponent, title, description, gradient }: {
  icon: LucideIcon,
  title: string,
  description: string,
  gradient: string,
}) {
  return (
    <div className="group bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-[0_12px_24px_rgba(15,23,42,0.35)]`}>
        <IconComponent className="w-7 h-7 text-slate-100" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Component for tool cards
function ToolCard({ title, description, href, icon: IconComponent, gradient }: {
  title: string,
  description: string,
  href: string,
  icon: LucideIcon,
  gradient: string,
}) {
  return (
    <Link
      href={href}
      className="group bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10 block h-full shadow-[0_12px_30px_rgba(3,7,18,0.45)]"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-[0_10px_24px_rgba(15,23,42,0.35)]`}>
          <IconComponent className="w-6 h-6 text-slate-100" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
      </div>
      <p className="text-slate-400 leading-relaxed mb-4">{description}</p>
      <div className="flex items-center text-[#1D4ED8] font-medium">
        <span>Rozpocznij naukę</span>
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Component for pricing cards
function PricingCard({ name, price, features, cta, featured }: {
  name: string,
  price: string,
  features: string[],
  cta: string,
  featured: boolean
}) {
  return (
    <div className={`relative bg-white/5 backdrop-blur-lg rounded-xl border p-8 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_15px_40px_rgba(3,7,18,0.45)] ${
      featured ? 'border-[#1D4ED8]/60 bg-gradient-to-b from-[#1D4ED8]/15 to-[#1E3A8A]/30' : 'border-white/10'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] text-slate-100 px-6 py-2 text-sm font-bold rounded-full border-2 border-white/20 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            <span>Najpopularniejszy</span>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-slate-100">{name}</h3>
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl font-bold text-slate-100">
            {price === "0" ? "Darmowy" : `${price}`}
          </span>
          {price !== "0" && <span className="text-slate-400 ml-2">/miesiąc</span>}
        </div>
      </div>

      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-slate-300">
            <div className="w-5 h-5 bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <Check className="w-3 h-3 text-slate-100" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={price === "0" ? "/register" : "/signup?plan=" + name.toLowerCase()}
        className={`block text-center py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
          featured
            ? 'bg-gradient-to-r from-[#1D4ED8] to-[#1E3A8A] hover:from-[#1E40AF] hover:to-[#172554] text-slate-100 shadow-[0_12px_35px_rgba(29,78,216,0.45)]'
            : 'bg-white/10 hover:bg-white/20 text-slate-100 shadow-[0_10px_30px_rgba(3,7,18,0.4)]'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// Component for testimonials
function Testimonial({ quote, author }: { quote: string, author: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10 shadow-[0_12px_30px_rgba(3,7,18,0.45)]">
      <div className="mb-4">
        <div className="flex text-[#1D4ED8] mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <p className="text-lg italic mb-4 text-slate-100">"{quote}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-slate-100" />
          </div>
          <p className="font-semibold text-slate-300">— {author}</p>
        </div>
      </div>
    </div>
  );
}
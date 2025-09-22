"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
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
  Play
} from "lucide-react";

export default function Home() {
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        
        {/* Hero Section */}
        <div className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-500/30">
                <div className="flex items-center gap-2 text-yellow-300 font-bold">
                  <Sparkles className="w-5 h-5" />
                  <span>Dopamine Learning System</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Opanuj angielski z LearnEnglishAI
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
              Interaktywne lekcje, personalizowane ścieżki nauki i native speakerzy na wyciągnięcie ręki
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link 
                href="/try" 
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                <span>Rozpocznij darmową lekcję</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/pricing" 
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <Crown className="w-5 h-5" />
                <span>Zobacz plany subskrypcji</span>
              </Link>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-green-400">10k+</div>
                <div className="text-sm text-gray-300">Aktywnych uczniów</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-blue-400">95%</div>
                <div className="text-sm text-gray-300">Satysfakcja</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-400">50k+</div>
                <div className="text-sm text-gray-300">Lekcji ukończonych</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-gray-300">Dostęp AI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Dlaczego warto uczyć się z nami?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Brain}
              title="Rozmowy z AI"
              description="Konwersacje z inteligentnym asystentem dostosowane do Twojego poziomu"
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard 
              icon={BookOpen}
              title="Personalizowane lekcje"
              description="Materiały dopasowane do Twoich celów i zainteresowań"
              gradient="from-blue-500 to-cyan-600"
            />
            <FeatureCard 
              icon={Zap}
              title="Natychmiastowa informacja zwrotna"
              description="Błyskawiczna korekta błędów i sugestie poprawy"
              gradient="from-amber-500 to-orange-600"
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Śledzenie postępów"
              description="Monitoruj swoje osiągnięcia i motywuj się do dalszej nauki"
              gradient="from-green-500 to-emerald-600"
            />
          </div>
        </section>

        {/* Tools Showcase */}
        <section className="py-16 bg-black/20 backdrop-blur-sm px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Poznaj nasze narzędzia
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ToolCard 
                title="Fiszki"
                description="Powtarzaj najważniejsze słówka na różnych poziomach – szybko i skutecznie."
                href="/flashcards"
                icon={BookOpen}
                gradient="from-purple-500 to-indigo-600"
              />
              <ToolCard 
                title="Ściąga gramatyczna"
                description="Podręczna ściągawka z najważniejszych konstrukcji i czasów gramatycznych."
                href="/grammar"
                icon={PenTool}
                gradient="from-blue-500 to-indigo-600"
              />
              <ToolCard 
                title="Trener słówek"
                description="Interaktywny system nauki który pomoże Ci opanować nowe słownictwo w praktyce."
                href="/vocabulary"
                icon={Brain}
                gradient="from-green-500 to-emerald-600"
              />
              <ToolCard 
                title="Rozmowa"
                description="Różnorodne ćwiczenia łączące słownictwo, gramatykę i rozumienie ze słuchu."
                href="/conversation"
                icon={MessageCircle}
                gradient="from-amber-500 to-orange-600"
              />
              <ToolCard 
                title="Zadania praktyczne"
                description="Ćwiczenia, dzięki którym utrwalisz słownictwo i poznane struktury w kontekście."
                href="/exercises"
                icon={Target}
                gradient="from-red-500 to-pink-600"
              />
              <ToolCard 
                title="Czasowniki nieregularne"
                description="Ćwicz formy nieregularnych czasowników i zapamiętuj je skutecznie."
                href="/irregular-verbs"
                icon={RotateCcw}
                gradient="from-violet-500 to-purple-600"
              />
              <ToolCard 
                title="Testy"
                description="Sprawdź swoją wiedzę zależnie od poziomu"
                href="/test"
                icon={TestTube}
                gradient="from-teal-500 to-cyan-600"
              />
              <ToolCard 
                title="Karty słówek"
                description="Ćwicz nowe słówka i zapamiętuj je skutecznie."
                href="/cards"
                icon={CreditCard}
                gradient="from-rose-500 to-pink-600"
              />
              <ToolCard 
                title="Statystyki"
                description="Śledź postępy"
                href="/stats"
                icon={BarChart}
                gradient="from-emerald-500 to-green-600"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
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
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-black/20 backdrop-blur-sm px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
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
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm text-center px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Rocket className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Gotowy na przygodę?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Gotów zacząć swoją przygodę z angielskim?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Dołącz do nas i zobacz różnicę już po pierwszej lekcji!
            </p>
            <Link 
              href="/register" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Trophy className="w-6 h-6" />
              <span>Zarejestruj się teraz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm text-gray-300 py-12 px-4 border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">LearnEnglishAI</h3>
              </div>
              <p className="text-gray-400">Najskuteczniejsza platforma do nauki angielskiego online.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Narzędzia</h4>
              <ul className="space-y-2">
                <li><Link href="/flashcards" className="hover:text-purple-400 transition-colors">Fiszki</Link></li>
                <li><Link href="/grammar" className="hover:text-purple-400 transition-colors">Ściąga gramatyczna</Link></li>
                <li><Link href="/vocabulary" className="hover:text-purple-400 transition-colors">Trener słówek</Link></li>
                <li><Link href="/conversation" className="hover:text-purple-400 transition-colors">Rozmowa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Firma</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-purple-400 transition-colors">O nas</Link></li>
                <li><Link href="/pricing" className="hover:text-purple-400 transition-colors">Cennik</Link></li>
                <li><Link href="/regulamin" className="hover:text-purple-400 transition-colors">Regulamin</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Social Media</h4>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-purple-400 transition-colors">Facebook</Link>
                <Link href="#" className="hover:text-purple-400 transition-colors">Instagram</Link>
                <Link href="#" className="hover:text-purple-400 transition-colors">TikTok</Link>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400">© 2025 LearnEnglishAI. Wszystkie prawa zastrzeżone.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// Component for feature cards
function FeatureCard({ icon: IconComponent, title, description, gradient }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  gradient: string 
}) {
  return (
    <div className="group bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15">
      <div className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
        <IconComponent className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

// Component for tool cards
function ToolCard({ title, description, href, icon: IconComponent, gradient }: { 
  title: string, 
  description: string, 
  href: string, 
  icon: React.ElementType,
  gradient: string 
}) {
  return (
    <Link 
      href={href} 
      className="group bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15 block h-full"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed mb-4">{description}</p>
      <div className="flex items-center text-purple-400 font-medium">
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
    <div className={`relative bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border p-8 transition-all duration-300 transform hover:scale-[1.02] ${
      featured ? 'border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-orange-500/10' : 'border-white/20'
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 text-sm font-bold rounded-full border-2 border-yellow-300 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            <span>Najpopularniejszy</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-white">{name}</h3>
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl font-bold text-white">
            {price === "0" ? "Darmowy" : `${price}`}
          </span>
          {price !== "0" && <span className="text-gray-400 ml-2">/miesiąc</span>}
        </div>
      </div>
      
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        href={price === "0" ? "/register" : "/signup?plan=" + name.toLowerCase()} 
        className={`block text-center py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
          featured 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/15">
      <div className="mb-4">
        <div className="flex text-yellow-400 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <p className="text-lg italic mb-4 text-white">"{quote}"</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <p className="font-semibold text-purple-300">— {author}</p>
        </div>
      </div>
    </div>
  );
}
"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";


import {

  Rocket,

  User as UserIcon, // Dodana nowa ikona
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
    <div className="min-h-screen bg-gray-900 text-gray-100">

 <header className="w-full py-6 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Lewa strona - przyciski */}
          <div></div>
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


          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Opanuj angielski z LearnEnglishAI
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Interaktywne lekcje, personalizowane ścieżki nauki i native speakerzy na wyciągnięcie ręki
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/try" className="bg-white text-blue-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Rozpocznij darmową lekcję
            </Link>
            <Link href="/pricing" className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition">
              Zobacz plany subskrypcji
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
<section className="py-16 px-4 max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold text-center mb-12">Dlaczego warto uczyć się z nami?</h2>
  
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    <FeatureCard 
      icon="🤖"
      title="Rozmowy z AI"
      description="Konwersacje z inteligentnym asystentem dostosowane do Twojego poziomu"
    />
    <FeatureCard 
      icon="📚"
      title="Personalizowane lekcje"
      description="Materły dopasowane do Twoich celów i zainteresowań"
    />
    <FeatureCard 
      icon="⚡"
      title="Natychmiastowa informacja zwrotna"
      description="Błyskawiczna korekta błędów i sugestie poprawy"
    />
    <FeatureCard 
      icon="📈"
      title="Śledzenie postępów"
      description="Monitoruj swoje osiągnięcia i motywuj się do dalszej nauki"
    />
  </div>
</section>

      {/* Existing Features Showcase */}
      <section className="py-16 bg-gray-800 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Poznaj nasze narzędzia</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard 
              title="Fiszki"
              description="Powtarzaj najważniejsze słówka na różnych poziomach – szybko i skutecznie."
              href="/flashcards"
              color="bg-purple-900"
            />
            <ToolCard 
              title="Ściąga gramatyczna"
              description="Podręczna ściągawka z najważniejszych konstrukcji i czasów gramatycznych."
              href="/grammar"
              color="bg-blue-900"
            />
            <ToolCard 
              title="Trener słówek"
              description="Interaktywny system nauki który pomoże Ci opanować nowe słownictwo w praktyce."
              href="/vocabulary"
              color="bg-green-900"
            />
            <ToolCard 
              title="Rozmowa"
              description="Różnorodne ćwiczenia łączące słownictwo, gramatykę i rozumienie ze słuchu."
              href="/conversation"
              color="bg-yellow-800"
            />
            <ToolCard 
              title="Zadania praktyczne"
              description="Ćwiczenia, dzięki którym utrwalisz słownictwo i poznane struktury w kontekście."
              href="/exercises"
              color="bg-red-900"
            />
            <ToolCard 
              title="Czasowniki nieregularne"
              description="Ćwicz formy nieregularnych czasowników i zapamiętuj je skutecznie."
              href="/irregular-verbs"
              color="bg-indigo-900"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Wybierz plan dla siebie</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
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
      <section className="py-16 bg-gray-800 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Dołącz do zadowolonych uczniów</h2>
          
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
      <section className="py-20 bg-blue-900 text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Gotów zacząć swoją przygodę z angielskim?</h2>
          <p className="text-xl mb-8">Dołącz do nas i zobacz różnicę już po pierwszej lekcji!</p>
          <Link 
            href="/signup" 
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
          >
            Zarejestruj się teraz
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">LearnEnglishAI</h3>
            <p>Najskuteczniejsza platforma do nauki angielskiego online.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Narzędzia</h4>
            <ul className="space-y-2">
              <li><Link href="/flashcards" className="hover:text-blue-400">Fiszki</Link></li>
              <li><Link href="/grammar" className="hover:text-blue-400">Ściąga gramatyczna</Link></li>
              <li><Link href="/vocabulary" className="hover:text-blue-400">Trener słówek</Link></li>
              <li><Link href="/conversation" className="hover:text-blue-400">Rozmowa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Firma</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-blue-400">O nas</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-400">Cennik</Link></li>
              <li><Link href="/regulamin" className="hover:text-blue-400">Regulamin</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Social Media</h4>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-400">Facebook</Link>
              <Link href="#" className="hover:text-blue-400">Instagram</Link>
              <Link href="#" className="hover:text-blue-400">Tiktok</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <p>© 2025 LearnEnglishAI. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

// Component for tool cards
function ToolCard({ title, description, href, color }: { title: string, description: string, href: string, color: string }) {
  return (
    <Link href={href} className={`${color} p-6 rounded-lg hover:shadow-md transition block h-full hover:brightness-110`}>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
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
    <div className={`relative ${featured ? 'border-2 border-blue-500' : 'border border-gray-700'} bg-gray-800 rounded-lg p-6 hover:bg-gray-600 transition`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
          Najpopularniejszy
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-4xl font-bold mb-4">
        {price === "0" ? "Darmowy" : `${price}`}
        {price !== "0" && <span className="text-lg font-normal">/miesiąc</span>}
      </p>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link 
        href={price === "0" ? "/signup" : "/signup?plan=" + name.toLowerCase()} 
        className={`block text-center py-3 px-4 rounded-lg font-bold ${featured ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-500 text-white'}`}
      >
        {cta}
      </Link>
    </div>
  );
}

// Component for testimonials
function Testimonial({ quote, author }: { quote: string, author: string }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-sm hover:bg-gray-700 transition">
      <svg className="w-8 h-8 text-yellow-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      <p className="text-lg italic mb-4">"{quote}"</p>
      <p className="font-semibold">— {author}</p>
    </div>
  );
}
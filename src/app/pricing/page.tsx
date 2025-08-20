import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar";
import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: "Darmowy",
      price: "0 zł / mies.",
      features: [
        "Podstawowe lekcje AI",
        "Ćwiczenia z czasów gramatycznych",
        "Fiszki (do 1000 słów)",
        "Śledzenie postępów"
      ],
      cta: "Rozpocznij za darmo",
      href: "/register" 
    },

    {
      name: "Premium",
      price: "14.99 zł / mies.",
      features: [
        "Dostęp do wszyskich narzędzi",
        "Dostęp do native speakerów AI 24/7",
        "Podsumowanie nauki",
        "Zaawansowane analizy postępów",
        "Priorytetowe wsparcie"
      ],
      cta: "Wybierz Premium",
      href: "/register" 
    }
  ]

  return (
      <>
                  <Navbar />
   <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 text-white py-16 px-6">
       
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Plany subskrypcji</h1>
        <p className="text-lg text-indigo-200 mb-12">
          Wybierz plan, który najlepiej pasuje do Twojego stylu nauki
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className="bg-indigo-800 border border-indigo-700 shadow-lg rounded-2xl hover:scale-105 transition-transform"
            >
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                  <p className="text-3xl font-bold text-indigo-300 mb-6">{plan.price}</p>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <span className="text-green-400 mr-2">✔</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl">
       <a href={plan.href}>
    {plan.cta}
  </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
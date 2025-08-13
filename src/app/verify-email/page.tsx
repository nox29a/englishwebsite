"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
          <>
          <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Weryfikacja emaila
        </h2>

        <div className="space-y-4">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Na podany adres email został wysłany link weryfikacyjny.
            </p>
            <p>
              Kliknij w link w wiadomości, aby potwierdzić swój adres email i aktywować konto.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg">
            <p className="text-sm">
              Jeśli nie widzisz wiadomości, sprawdź folder spam lub wyślij link weryfikacyjny ponownie.
            </p>
          </div>

          <Link 
            href="/" 
            className="block w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold transition"
          >
            Przejdź do strony głównej
          </Link>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Masz już konto?{" "}
          <a 
            href="/login" 
            className="text-indigo-600 underline hover:text-indigo-800 dark:hover:text-indigo-400"
          >
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
// pages/kontakt.tsx
"use client"
import { useState } from "react";

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1446] to-[#0d0a23] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Skontaktuj się z nami</h1>
        <p className="text-center text-gray-300 mb-12">
          Masz pytania? Wypełnij formularz, a odpowiemy w ciągu 24h.
        </p>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Imię i nazwisko"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-[#1e1a4b] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Adres e-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-[#1e1a4b] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Twoja wiadomość..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-xl bg-[#1e1a4b] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition font-semibold"
          >
            Wyślij wiadomość
          </button>
        </form>
      </div>
    </main>
  );
}

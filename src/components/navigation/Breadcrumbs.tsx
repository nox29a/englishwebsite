"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  about: "O nas",
  contact: "Kontakt",
  pricing: "Cennik",
  premium: "Premium",
  register: "Rejestracja",
  login: "Logowanie",
  flashcards: "Fiszki",
  vocabulary: "Słówka",
  conversation: "Rozmowa",
  "irregular-verbs": "Czasowniki nieregularne",
  exercises: "Ćwiczenia",
  dashboard: "Panel",
  settings: "Ustawienia",
};

const formatLabel = (segment: string) => {
  return LABELS[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = formatLabel(segment);
    const isCurrent = index === segments.length - 1;

    return { href, label, isCurrent };
  });

  return (
    <nav aria-label="Okruszki nawigacyjne" className="flex items-center text-sm text-indigo-100/80">
      <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap" role="list">
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-medium text-indigo-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Strona główna</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-indigo-200" aria-hidden="true" />
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <Link
              href={crumb.href}
              aria-current={crumb.isCurrent ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                crumb.isCurrent
                  ? "bg-indigo-500/20 text-white"
                  : "bg-white/5 text-indigo-50 hover:bg-white/10"
              }`}
            >
              <span>{crumb.label}</span>
            </Link>
            {index !== crumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-indigo-200" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

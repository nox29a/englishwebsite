import Link from "next/link";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function PremiumSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-indigo-950 px-6 py-16 text-[var(--foreground)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <div className="rounded-3xl border border-emerald-400/40 bg-emerald-900/40 p-10 shadow-xl">
            <h1 className="text-4xl font-bold text-emerald-200">Dziękujemy za dołączenie do Premium!</h1>
            <p className="mt-4 text-lg text-emerald-100">
              Twoja płatność została pomyślnie przetworzona. Status konta może aktualizować się przez kilka sekund.
            </p>
            <p className="mt-2 text-sm text-emerald-200/80">
              Jeżeli po chwili nadal widzisz plan podstawowy, odśwież stronę lub ponownie zaloguj się do aplikacji.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-400 px-8 py-3 text-base font-semibold">
                <Link href="/dashboard">Przejdź do panelu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[color:var(--border-translucent-bold)] bg-[var(--overlay-light)] px-8 py-3 text-base font-semibold text-[var(--foreground)] hover:bg-[var(--overlay-light-strong)]"
              >
                <Link href="/">Wróć na stronę główną</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

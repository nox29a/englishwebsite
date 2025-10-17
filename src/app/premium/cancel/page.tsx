import Link from "next/link";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function PremiumCancelPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 px-6 py-16 text-[var(--foreground)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <div className="rounded-3xl border border-[color:var(--border-translucent-strong)] bg-[var(--overlay-light-faint)] p-10 shadow-xl">
            <h1 className="text-4xl font-bold text-[var(--foreground)]">Płatność została przerwana</h1>
            <p className="mt-4 text-lg text-indigo-100">
              Nie dokończyłeś transakcji Stripe. Możesz wrócić i spróbować ponownie w dowolnym momencie.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 text-base font-semibold">
                <Link href="/premium">Wróć do Premium</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[color:var(--border-translucent-bold)] bg-[var(--overlay-light)] px-8 py-3 text-base font-semibold text-[var(--foreground)] hover:bg-[var(--overlay-light-strong)]"
              >
                <Link href="/">Strona główna</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

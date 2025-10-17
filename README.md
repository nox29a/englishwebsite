## AxonAI

Platforma edukacyjna wykorzystująca Next.js 15 oraz Supabase. Projekt został rozszerzony o obsługę płatności Stripe dla planu Premium.

## Wymagane zmienne środowiskowe

Skonfiguruj poniższe wartości w plikach `.env.local` (dla środowiska lokalnego) oraz w panelu hostingu:

| Zmienna | Opis |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Adres instancji Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Klucz anon Supabase używany w przeglądarce. |
| `SUPABASE_SERVICE_ROLE_KEY` | Klucz serwisowy Supabase wykorzystywany w webhooku Stripe do aktualizacji profili. |
| `STRIPE_SECRET_KEY` | Klucz tajny konta Stripe (skopiuj z [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)). |
| `STRIPE_PRICE_ID` | Identyfikator ceny/subskrypcji utworzonej w Stripe. |
| `STRIPE_WEBHOOK_SECRET` | Sekret punktu webhook Stripe (dostępny po dodaniu endpointu do zdarzeń `checkout.session.completed`). |

Opcjonalnie możesz ustawić `NEXT_PUBLIC_SITE_URL`, aby wymusić adres powrotu z płatności. W przeciwnym razie używany jest origin bieżącego żądania.

## Uruchomienie projektu lokalnie

Zainstaluj zależności:

```bash
npm install
```

Uruchom tryb deweloperski:

```bash
npm run dev
```

Projekt będzie dostępny pod adresem [http://localhost:3000](http://localhost:3000).

## Webhook Stripe w środowisku lokalnym

Aby testować webhooki lokalnie, możesz użyć narzędzia `stripe listen`:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Polecenie zwróci sekret webhooka, który należy ustawić jako `STRIPE_WEBHOOK_SECRET`.

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRIPE_API_URL = "https://api.stripe.com/v1/checkout/sessions";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripeSecretKey || !priceId) {
    return NextResponse.json(
      { error: "Brak konfiguracji Stripe. Skontaktuj się z administratorem." },
      { status: 500 }
    );
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json(
      { error: "Nie udało się pobrać informacji o użytkowniku." },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json(
      { error: "Musisz być zalogowany, aby kupić subskrypcję." },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json(
      { error: "Nie udało się pobrać profilu użytkownika." },
      { status: 500 }
    );
  }

  if (profile?.user_type?.toLowerCase() === "premium") {
    return NextResponse.json(
      { error: "To konto ma już aktywną subskrypcję Premium." },
      { status: 400 }
    );
  }

  const requestUrl = new URL(req.url);
  const origin =
    req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? requestUrl.origin;

  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/premium/cancel`,
    "metadata[user_id]": user.id,
  });

  if (user.email) {
    params.append("customer_email", user.email);
  }

  try {
    const response = await fetch(STRIPE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Stripe checkout error:", errorBody);
      return NextResponse.json(
        { error: "Nie udało się rozpocząć płatności. Spróbuj ponownie." },
        { status: 502 }
      );
    }

    const session = await response.json();
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe fetch error:", error);
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd podczas inicjowania płatności." },
      { status: 500 }
    );
  }
}

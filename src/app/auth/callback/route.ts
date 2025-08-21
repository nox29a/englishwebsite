import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Obsługa błędu z OAuth
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        errorDescription || error
      )}`
    );
  }

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      // Wymiana kodu na sesję
      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      if (authError) {
        console.error("Error exchanging code for session:", authError);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(authError.message)}`
        );
      }

      // Tworzymy profil tylko jeśli user istnieje
      if (data.session?.user) {
        const user = data.session.user;

        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.given_name || "",
          last_name: user.user_metadata?.family_name || "",
          user_type: "basic", // domyślna rola
        }).select(); // Dodaj .select() aby uniknąć błędów

        if (profileError) {
          console.error("Database insert error:", profileError);
          // Nie przerywamy procesu logowania, tylko logujemy błąd
        }
      }
    } catch (err) {
      console.error("Unexpected error in auth callback:", err);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Unexpected+error+during+authentication`
      );
    }
  }

  // Po wszystkim redirect na stronę główną
  return NextResponse.redirect(requestUrl.origin);
}
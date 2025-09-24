// utils/addPoints.ts
import { supabase } from "@/lib/supabaseClient";

export async function addPoints(userId: string, points: number) {
  // spróbuj pobrać aktualne punkty
  const { data, error } = await supabase
    .from("leaderboard")
    .select("points")
    .eq("user_id", userId)
    .maybeSingle(); // zwróci null, jeśli nie ma użytkownika

  if (error) {
    console.error("Błąd przy pobieraniu punktów:", error.message);
    return;
  }

  if (data) {
    // user istnieje → zaktualizuj punkty
    const { error: updateError } = await supabase
      .from("leaderboard")
      .update({
        points: data.points + points,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Błąd przy aktualizacji punktów:", updateError.message);
    }
  } else {
    // user nie istnieje → wstaw nowy rekord
    const { error: insertError } = await supabase
      .from("leaderboard")
      .insert([
        {
          user_id: userId,
          points,
          updated_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Błąd przy dodawaniu nowego usera:", insertError.message);
    }
  }
}

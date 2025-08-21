// utils/addPoints.ts
import { supabase } from "@/lib/supabaseClient";

export async function addPoints(userId: string, points: number) {
  // sprawdź czy user już istnieje w leaderboard
  const { data, error } = await supabase
    .from("leaderboard")
    .select("id, points")
    .eq("user_id", userId)
    .single();

  if (data) {
    await supabase
      .from("leaderboard")
      .update({ points: data.points + points, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
  } else {
    await supabase.from("leaderboard").insert([{ user_id: userId, points }]);
  }
}

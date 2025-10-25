// utils/addPoints.ts
import { supabase } from "@/lib/supabaseClient";

export async function addPoints(userId: string, points: number, source = "lesson_reward") {
  const occurredAt = new Date();

  const { error: historyError } = await supabase.from("xp_history").insert([
    {
      user_id: userId,
      amount: points,
      source,
      occurred_at: occurredAt.toISOString(),
      metadata: { awarded_by: "app" },
    },
  ]);

  if (historyError) {
    console.error("Błąd przy zapisywaniu historii XP:", historyError.message);
    return;
  }

  const metricsDate = occurredAt.toISOString().slice(0, 10);

  const { data: dailyRow, error: fetchError } = await supabase
    .from("daily_metrics")
    .select("xp_gained")
    .eq("user_id", userId)
    .eq("metrics_date", metricsDate)
    .maybeSingle();

  if (fetchError) {
    console.error("Błąd przy pobieraniu dziennych metryk:", fetchError.message);
    return;
  }

  if (dailyRow) {
    const { error: updateError } = await supabase
      .from("daily_metrics")
      .update({
        xp_gained: (dailyRow.xp_gained ?? 0) + points,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("metrics_date", metricsDate);

    if (updateError) {
      console.error("Błąd przy aktualizacji dziennych metryk:", updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("daily_metrics").insert([
      {
        user_id: userId,
        metrics_date: metricsDate,
        xp_gained: points,
      },
    ]);

    if (insertError) {
      console.error("Błąd przy zapisie dziennych metryk:", insertError.message);
    }
  }
}

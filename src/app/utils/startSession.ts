// utils/session.ts
import { supabase } from "@/lib/supabaseClient";

export async function startSession(userId: string) {
  console.log("➡️ startSession for", userId);

  const { data, error } = await supabase
    .from("user_sessions")
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (error) console.error("❌ Error starting session:", error);
  else console.log("✅ Session started:", data);

  if (data) {
    localStorage.setItem("sessionId", data.id);
    localStorage.setItem("loginAt", data.login_at);
  }

  return data;
}

export async function endSession() {
  const sessionId = localStorage.getItem("sessionId");
  const loginAt = localStorage.getItem("loginAt");
  console.log("➡️ endSession", { sessionId, loginAt });

  if (!sessionId || !loginAt) return;

  const timeSpent = Math.floor((Date.now() - new Date(loginAt).getTime()) / 1000);

  const { error } = await supabase
    .from("user_sessions")
    .update({
      logout_at: new Date().toISOString(),
      time_spent: timeSpent,
    })
    .eq("id", sessionId);

  if (error) console.error("❌ Error ending session:", error);
  else console.log("✅ Session ended, spent:", timeSpent, "s");

  localStorage.removeItem("sessionId");
  localStorage.removeItem("loginAt");
}

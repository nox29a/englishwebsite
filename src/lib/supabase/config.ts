const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_ANON_KEY = "public-anon-key";

let hasWarned = false;

export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (!hasWarned) {
      console.warn(
        "Supabase environment variables are missing. Using placeholder credentials; " +
          "real Supabase features will be disabled until NEXT_PUBLIC_SUPABASE_URL and " +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY are provided."
      );
      hasWarned = true;
    }

    return {
      url: url ?? FALLBACK_URL,
      anonKey: anonKey ?? FALLBACK_ANON_KEY,
    };
  }

  return { url, anonKey };
};

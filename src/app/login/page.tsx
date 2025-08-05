 export default function LoginPage() {
    <div>Login Page</div>
 }


// "use client";


// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";

// export const dynamic = 'force-dynamic';

// export default function LoginPage() {
//   const router = useRouter();
//   const { theme, setTheme } = useTheme();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setErrorMsg(error.message);
//       setLoading(false);
//       return;
//     }

//     setLoading(false);
//     router.push("/"); // lub inna strona po zalogowaniu
//   };

//   const handleGoogleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//     });

//     if (error) {
//       setErrorMsg(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
//       <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
//           Zaloguj się
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Adres email"
//             value={email}
//             required
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
//           />

//           <input
//             type="password"
//             placeholder="Hasło"
//             value={password}
//             required
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
//           />

//           {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition font-semibold"
//           >
//             {loading ? "Logowanie..." : "Zaloguj się"}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             onClick={handleGoogleLogin}
//             className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
//           >
//             {/* Tu możesz dodać ikonę Google jeśli chcesz */}
//             Logowanie przez Google
//           </button>
//         </div>

//         <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
//           Nie masz konta?{" "}
//           <a href="/register" className="text-indigo-600 underline hover:text-indigo-800">
//             Zarejestruj się
//           </a>
//         </p>

//         {/* Przełącznik motywu */}
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="p-2 rounded-full bg-indigo-600 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
//             aria-label="Przełącz motyw"
//           >
//             {theme === "dark" ? (
//               <Sun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <Moon className="w-5 h-5 text-white" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

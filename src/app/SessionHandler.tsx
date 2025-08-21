// components/SessionHandler.tsx
"use client";

import { useEffect } from "react";
import { startSession, endSession } from "./utils/startSession";
import { useAuth } from "./ClientWrapper";


export default function SessionHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // start sesji
    startSession(user.id);

    // koniec sesji przy wyjściu
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      endSession();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return null;
}
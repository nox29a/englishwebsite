"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface LeaderboardEntry {
  points: number;
  user_id: string;
  profile: Profile | null;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log("Fetching leaderboard data...");
        
        // Pobierz dane leaderboard
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from("leaderboard")
          .select("points, user_id")
          .order("points", { ascending: false })
          .limit(10);

        if (leaderboardError) {
          console.error("Leaderboard error:", leaderboardError);
          throw leaderboardError;
        }

        console.log("Leaderboard data:", leaderboardData);

        if (!leaderboardData || leaderboardData.length === 0) {
          console.log("No leaderboard data found");
          setLeaders([]);
          return;
        }

        // Pobierz profile użytkowników
        const userIds = leaderboardData.map(entry => entry.user_id);
        console.log("User IDs to fetch:", userIds);

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", userIds);

        if (profilesError) {
          console.error("Profiles error:", profilesError);
          throw profilesError;
        }

        console.log("Profiles data:", profilesData);

        // Połącz dane - POPRAWIONE
        const combinedData = leaderboardData.map(entry => {
          const profile = profilesData?.find(profile => profile.id === entry.user_id) || null;
          console.log(`User ${entry.user_id} profile:`, profile);
          return {
            points: entry.points,
            user_id: entry.user_id,
            profile: profile
          };
        });

        console.log("Combined data:", combinedData);
        setLeaders(combinedData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchLeaderboard();
  }, []);

  // Funkcja do formatowania nazwy użytkownika - POPRAWIONA
  const formatUserName = (profile: Profile | null) => {
    if (!profile) {
      console.log("No profile provided");
      return "No Name";
    }
    
    console.log("Formatting profile:", profile);
    
    const firstName = profile.first_name?.trim();
    const lastName = profile.last_name?.trim();
    
    console.log("First name:", firstName, "Last name:", lastName);
    
    if (!firstName && !lastName) {
      console.log("Both names empty");
      return "No Name";
    }
    if (!firstName) {
      console.log("Only last name available");
      return lastName || "No Name";
    }
    if (!lastName) {
      console.log("Only first name available");
      return firstName;
    }
    
    console.log("Both names available");
    return `${firstName} ${lastName}`;
  };

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900">
      <h2 className="text-xl font-bold mb-4 text-white">🏆 Ranking</h2>
      <ul className="space-y-3">
        {leaders.map((entry, i) => {
          const userName = formatUserName(entry.profile);
          console.log(`Rendering user ${entry.user_id}: ${userName}`);
          
          return (
            <li
              key={entry.user_id || i}
              className="flex justify-between items-center text-white"
            >
              <span className="font-medium text-yellow-300">
                {i + 1}. {userName}
              </span>
              <span className="text-yellow-300 font-bold">{entry.points} pkt</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
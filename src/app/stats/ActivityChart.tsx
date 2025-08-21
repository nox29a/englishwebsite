"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ActivityChart() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select("time_spent, login_at")
        .order("login_at", { ascending: true });

      if (!error) {
        // Grupowanie danych po dacie i sumowanie minut
        const groupedData = data.reduce((acc: any, session) => {
          const date = new Date(session.login_at).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit'
          });
          
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += Math.round(session.time_spent / 60);
          return acc;
        }, {});

        // Konwersja obiektu na tablicę
        const formatted = Object.entries(groupedData).map(([date, minutes]) => ({
          date,
          minutes
        }));

        setSessions(formatted);
      }
    };
    fetchSessions();
  }, []);

  // Niestandardowy tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">{`Data: ${label}`}</p>
          <p className="text-yellow-600 font-bold">{`Czas: ${payload[0].value} min`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-indigo-900 text-white">
      <h2 className="text-xl font-bold mb-4">Aktywność użytkownika</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sessions}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4F46E5" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#E5E7EB"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#E5E7EB"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} min`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="minutes" 
            name="Czas aktywności (minuty)"
            fill="#FBBF24" // Żółty kolor
            radius={[6, 6, 0, 0]}
            stroke="#F59E0B" // Obramówka słupka
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-indigo-200 mt-2 text-center">
        Dzienna aktywność użytkownika w minutach
      </p>
    </Card>
  );
}
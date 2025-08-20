'use client';


import { useStreak, } from '@/app/hooks/useStreak';

export default function StreakBadge() {
  const { loading, streak, markToday } = useStreak();

  return (
    <div className="inline-flex items-center gap-2 rounded-full text-6xl text-orange-700 px-3 py-1">
      <span className="text-xl">🔥</span>
      <div className="flex items-baseline gap-2">
        <strong className="text-lg tabular-nums">
          {loading ? '—' : streak?.current_streak ?? 0}
        </strong>
        <span className="text-sm opacity-80">dni z rzędu</span>
      </div>
      {/* Dev/test: przycisk do ręcznego zaliczenia dnia */}
      {/* <button
        onClick={async () => {
          await markToday();
        }}
        className="ml-2 text-xs rounded bg-orange-600 text-white px-2 py-1 hover:bg-orange-700"
      >
        Zaliczone dziś
      </button> */}
    </div>
  );
}
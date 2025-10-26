"use client";

import type { ChangeEventHandler } from "react";
import { cn } from "@/lib/utils";

export type VoiceOption = {
  value: string;
  label: string;
};

interface AudioSessionControlsProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  voiceOptions?: VoiceOption[];
  selectedVoice?: string;
  onVoiceChange?: (voice: string) => void;
  className?: string;
}

const recordingIndicatorClasses =
  "flex items-center gap-2 rounded-full bg-rose-600/20 px-4 py-2 text-sm font-semibold text-rose-300";

export function AudioSessionControls({
  isRecording,
  onStart,
  onStop,
  voiceOptions,
  selectedVoice,
  onVoiceChange,
  className,
}: AudioSessionControlsProps) {
  const handleVoiceChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (onVoiceChange) {
      onVoiceChange(event.target.value);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          disabled={isRecording}
          className={cn(
            "rounded-full bg-emerald-500 px-6 py-2 font-semibold text-slate-900 transition-colors hover:bg-emerald-400",
            isRecording && "cursor-not-allowed opacity-60"
          )}
        >
          Start
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!isRecording}
          className={cn(
            "rounded-full bg-rose-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-rose-400",
            !isRecording && "cursor-not-allowed opacity-60"
          )}
        >
          Stop
        </button>
        {isRecording ? (
          <div className={recordingIndicatorClasses} aria-live="polite">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-300" />
            </span>
            Nagrywanie w toku
          </div>
        ) : (
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">
            Nagrywanie zatrzymane
          </div>
        )}
      </div>

      {voiceOptions && voiceOptions.length > 0 ? (
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Wybierz głos
          <select
            value={selectedVoice ?? voiceOptions[0]?.value}
            onChange={handleVoiceChange}
            className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none"
          >
            {voiceOptions.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}

export default AudioSessionControls;

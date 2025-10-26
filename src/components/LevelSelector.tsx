"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LevelOption<T extends string> = {
  value: T;
  label: string;
  helper?: string;
  helperClassName?: string;
  selectedHelperClassName?: string;
  selectedClass: string;
  disabled?: boolean;
  renderContent?: (isSelected: boolean) => ReactNode;
};

export const LEVEL_STYLE_PRESETS = {
  easy: "border-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 text-slate-100 shadow-[0_10px_30px_rgba(16,185,129,0.35)]",
  medium:
    "border-transparent bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.35)]",
  hard: "border-transparent bg-gradient-to-r from-rose-500 to-rose-700 text-slate-100 shadow-[0_10px_30px_rgba(225,29,72,0.35)]",
} as const;

const DEFAULT_CONTAINER_CLASS = "flex flex-wrap gap-4";
const DEFAULT_BUTTON_CLASS =
  "rounded-2xl border px-6 py-3 font-semibold transition-all duration-300";
const DEFAULT_UNSELECTED_CLASS =
  "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100";

interface LevelSelectorProps<T extends string> {
  options: LevelOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  unselectedClassName?: string;
}

export default function LevelSelector<T extends string>({
  options,
  value,
  onChange,
  className,
  buttonClassName,
  unselectedClassName,
}: LevelSelectorProps<T>) {
  return (
    <div className={cn(DEFAULT_CONTAINER_CLASS, className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = Boolean(option.disabled);

        const buttonClasses = cn(
          DEFAULT_BUTTON_CLASS,
          buttonClassName,
          isSelected
            ? option.selectedClass
            : unselectedClassName ?? DEFAULT_UNSELECTED_CLASS,
          isDisabled &&
            "cursor-not-allowed opacity-50 hover:bg-white/5 hover:text-slate-300"
        );

        const handleClick = () => {
          if (isDisabled || option.value === value) {
            return;
          }
          onChange(option.value);
        };

        return (
          <button
            key={option.value}
            type="button"
            onClick={handleClick}
            className={buttonClasses}
            disabled={isDisabled}
            aria-pressed={isSelected}
          >
            {option.renderContent ? (
              option.renderContent(isSelected)
            ) : (
              <>
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                {option.helper ? (
                  <span
                    className={cn(
                      "block text-xs font-medium transition-colors duration-300",
                      isSelected
                        ? option.selectedHelperClassName ?? "text-white/80"
                        : option.helperClassName ?? "text-slate-400"
                    )}
                  >
                    {option.helper}
                  </span>
                ) : null}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

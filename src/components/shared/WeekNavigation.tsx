import React from "react";
import { shiftWeek, formatWeekLabel, getWeekOf } from "@/lib/workout-log-helpers";

interface WeekNavigationProps {
  weekOf: string;
  onChange: (weekOf: string) => void;
}

export default function WeekNavigation({ weekOf, onChange }: WeekNavigationProps) {
  const currentWeek = getWeekOf();
  const isCurrentWeek = weekOf === currentWeek;

  return (
    <div className="week-nav" role="navigation" aria-label="Week navigation">
      <button
        className="week-nav__button"
        onClick={() => onChange(shiftWeek(weekOf, -1))}
        aria-label="Previous week"
      >
        &larr; Prev
      </button>
      <span className="week-nav__label">Week of {formatWeekLabel(weekOf)}</span>
      <button
        className="week-nav__button"
        onClick={() => onChange(shiftWeek(weekOf, 1))}
        aria-label="Next week"
      >
        Next &rarr;
      </button>
      {!isCurrentWeek && (
        <button
          className="week-nav__today"
          onClick={() => onChange(currentWeek)}
        >
          This Week
        </button>
      )}
    </div>
  );
}

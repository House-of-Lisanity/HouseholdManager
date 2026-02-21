import React from "react";
import { ViewMode } from "@/hooks/useViewMode";
import { DAYS_SUNDAY_START } from "@/lib/constants";

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

const DAY_ABBREVS = DAYS_SUNDAY_START.map((d) => d.slice(0, 3));

export default function ViewToggle({
  viewMode,
  onToggle,
  selectedDayIndex,
  onSelectDay,
  onPrevDay,
  onNextDay,
}: ViewToggleProps) {
  return (
    <div className="view-toggle" role="toolbar" aria-label="View controls">
      <div className="view-toggle__modes">
        <button
          className={`view-toggle__btn ${viewMode === "day" ? "view-toggle__btn--active" : ""}`}
          onClick={() => onToggle("day")}
          aria-pressed={viewMode === "day"}
        >
          Day
        </button>
        <button
          className={`view-toggle__btn ${viewMode === "week" ? "view-toggle__btn--active" : ""}`}
          onClick={() => onToggle("week")}
          aria-pressed={viewMode === "week"}
        >
          Week
        </button>
      </div>

      {viewMode === "day" && (
        <div className="view-toggle__day-nav" aria-label="Day navigation">
          <button
            className="view-toggle__arrow"
            onClick={onPrevDay}
            disabled={selectedDayIndex === 0}
            aria-label="Previous day"
          >
            &larr;
          </button>
          <div className="view-toggle__pills">
            {DAY_ABBREVS.map((abbrev, i) => (
              <button
                key={abbrev}
                className={`view-toggle__pill ${i === selectedDayIndex ? "view-toggle__pill--active" : ""}`}
                onClick={() => onSelectDay(i)}
                aria-label={DAYS_SUNDAY_START[i]}
                aria-current={i === selectedDayIndex ? "true" : undefined}
              >
                {abbrev}
              </button>
            ))}
          </div>
          <button
            className="view-toggle__arrow"
            onClick={onNextDay}
            disabled={selectedDayIndex === 6}
            aria-label="Next day"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

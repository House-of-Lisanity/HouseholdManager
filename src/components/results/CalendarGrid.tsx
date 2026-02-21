import React from "react";
import { CalendarPlanResult } from "@/types";
import { ViewMode } from "@/hooks/useViewMode";
import {
  timeToRow,
  timeBlockSpan,
  getHourLabels,
  TOTAL_SLOTS,
  categorizeBlock,
  categoryClass,
} from "@/lib/calendar-grid-helpers";
import { formatTo12Hour } from "@/lib/format-time";
import SectionPrintButton from "./SectionPrintButton";
import CalendarAssignments from "./CalendarAssignments";

interface CalendarGridProps {
  data: CalendarPlanResult;
  viewMode: ViewMode;
  selectedDayIndex: number;
  onUpdateStrategyNotes: (value: string) => void;
  onUpdateTimeBlock: (dayIndex: number, blockIndex: number, value: string) => void;
  onUpdateListItem: (
    dayIndex: number,
    field: "bigRocks" | "choresAssigned",
    itemIndex: number,
    value: string
  ) => void;
  onUpdateHobby: (dayIndex: number, value: string) => void;
}

const hourLabels = getHourLabels();

export default function CalendarGrid({
  data,
  viewMode,
  selectedDayIndex,
  onUpdateStrategyNotes,
  onUpdateTimeBlock,
  onUpdateListItem,
  onUpdateHobby,
}: CalendarGridProps) {
  const visibleDays =
    viewMode === "week"
      ? data.dailySchedules
      : [data.dailySchedules[selectedDayIndex]];

  const visibleIndices =
    viewMode === "week"
      ? data.dailySchedules.map((_, i) => i)
      : [selectedDayIndex];

  return (
    <section className="results-section results-section--calendar">
      <div className="results-section__header">
        <h2>Calendar</h2>
        <SectionPrintButton section="calendar" label="Print Calendar" />
      </div>

      {data.strategyNotes && (
        <div className="results-section__summary">
          <strong>Strategy:</strong>
          <textarea
            className="editable-field"
            value={data.strategyNotes}
            onChange={(e) => onUpdateStrategyNotes(e.target.value)}
            rows={2}
          />
        </div>
      )}

      <div
        className={`cal-grid ${viewMode === "day" ? "cal-grid--day" : ""}`}
        role="grid"
        aria-label="Weekly calendar"
      >
        {/* Header row */}
        <div className="cal-grid__corner" />
        {visibleDays.map((day) => (
          <div key={day.day} className="cal-grid__day-header">
            {day.day}
          </div>
        ))}

        {/* Time gutter + blocks */}
        {hourLabels.map((label, i) => (
          <div
            key={label}
            className="cal-grid__time-label"
            style={{ gridRow: i * 2 + 2 }}
          >
            {label}
          </div>
        ))}

        {/* Time blocks for each visible day */}
        {visibleDays.map((day, colOffset) => {
          const dayIndex = visibleIndices[colOffset];
          const gridCol = colOffset + 2; // +1 for gutter, +1 for 1-based

          return day.timeBlocks.map((block, blockIndex) => {
            const rowStart = timeToRow(block.startTime);
            const span = timeBlockSpan(block.startTime, block.endTime);
            const cat = categorizeBlock(block.description);

            return (
              <div
                key={`${dayIndex}-${blockIndex}`}
                className={`cal-block ${categoryClass(cat)}`}
                style={{
                  gridColumn: gridCol,
                  gridRow: `${rowStart} / span ${span}`,
                }}
              >
                <span className="cal-block__time">
                  {formatTo12Hour(block.startTime)}
                </span>
                <textarea
                  className="cal-block__text"
                  value={block.description}
                  onChange={(e) =>
                    onUpdateTimeBlock(dayIndex, blockIndex, e.target.value)
                  }
                  rows={1}
                />
              </div>
            );
          });
        })}
      </div>

      <CalendarAssignments
        data={data}
        viewMode={viewMode}
        selectedDayIndex={selectedDayIndex}
        onUpdateListItem={onUpdateListItem}
        onUpdateHobby={onUpdateHobby}
      />
    </section>
  );
}

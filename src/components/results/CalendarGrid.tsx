import React, { useState } from "react";
import { CalendarPlanResult } from "@/types";
import { ViewMode } from "@/hooks/useViewMode";
import {
  timeToRow,
  timeBlockSpan,
  getHourLabels,
  categorizeBlock,
  categoryClass,
} from "@/lib/calendar-grid-helpers";
import SectionPrintButton from "./SectionPrintButton";
import CalendarAssignments from "./CalendarAssignments";
import BlockDetailPanel from "./BlockDetailPanel";

interface SelectedBlock {
  dayIndex: number;
  blockIndex: number;
}

interface CalendarGridProps {
  data: CalendarPlanResult;
  viewMode: ViewMode;
  selectedDayIndex: number;
  onUpdateStrategyNotes: (value: string) => void;
  onUpdateTimeBlock: (dayIndex: number, blockIndex: number, value: string) => void;
  onUpdateTimeBlockTimes: (
    dayIndex: number,
    blockIndex: number,
    startTime: string,
    endTime: string
  ) => void;
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
  onUpdateTimeBlockTimes,
  onUpdateListItem,
  onUpdateHobby,
}: CalendarGridProps) {
  const [selected, setSelected] = useState<SelectedBlock | null>(null);

  const visibleDays =
    viewMode === "week"
      ? data.dailySchedules
      : [data.dailySchedules[selectedDayIndex]];

  const visibleIndices =
    viewMode === "week"
      ? data.dailySchedules.map((_, i) => i)
      : [selectedDayIndex];

  const dayColumnCount = visibleDays.length;

  const handleBlockClick = (dayIndex: number, blockIndex: number) => {
    setSelected((prev) =>
      prev?.dayIndex === dayIndex && prev?.blockIndex === blockIndex
        ? null
        : { dayIndex, blockIndex }
    );
  };

  const selectedBlock = selected
    ? data.dailySchedules[selected.dayIndex]?.timeBlocks[selected.blockIndex]
    : null;

  const selectedDayName = selected
    ? data.dailySchedules[selected.dayIndex]?.day
    : "";

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

        {/* Hour row lines (subtle gridlines across all day columns) */}
        {hourLabels.map((_, i) => (
          <div
            key={`line-${i}`}
            className="cal-grid__row-line"
            style={{
              gridColumn: `2 / span ${dayColumnCount}`,
              gridRow: i * 2 + 2,
            }}
          />
        ))}

        {/* Time gutter labels */}
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
          const gridCol = colOffset + 2;

          return day.timeBlocks.map((block, blockIndex) => {
            const rowStart = timeToRow(block.startTime);
            const span = timeBlockSpan(block.startTime, block.endTime);
            const cat = categorizeBlock(block.description);
            const isSelected =
              selected?.dayIndex === dayIndex &&
              selected?.blockIndex === blockIndex;

            return (
              <button
                key={`${dayIndex}-${blockIndex}`}
                className={`cal-block ${categoryClass(cat)}${block.pinned ? " cal-block--pinned" : ""}${isSelected ? " cal-block--selected" : ""}`}
                style={{
                  gridColumn: gridCol,
                  gridRow: `${rowStart} / span ${span}`,
                }}
                onClick={() => handleBlockClick(dayIndex, blockIndex)}
                aria-label={`${block.shortLabel}: ${block.description}`}
                type="button"
              >
                <span className="cal-block__label">{block.shortLabel}</span>
              </button>
            );
          });
        })}
      </div>

      {selectedBlock && selected && (
        <BlockDetailPanel
          block={selectedBlock}
          dayName={selectedDayName}
          onUpdateDescription={(value) =>
            onUpdateTimeBlock(selected.dayIndex, selected.blockIndex, value)
          }
          onUpdateTimes={(start, end) =>
            onUpdateTimeBlockTimes(selected.dayIndex, selected.blockIndex, start, end)
          }
          onClose={() => setSelected(null)}
        />
      )}

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

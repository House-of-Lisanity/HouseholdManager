import React from "react";
import { CalendarPlanResult } from "@/types";
import { ViewMode } from "@/hooks/useViewMode";

interface CalendarAssignmentsProps {
  data: CalendarPlanResult;
  viewMode: ViewMode;
  selectedDayIndex: number;
  onUpdateListItem: (
    dayIndex: number,
    field: "bigRocks" | "choresAssigned",
    itemIndex: number,
    value: string
  ) => void;
  onUpdateHobby: (dayIndex: number, value: string) => void;
}

export default function CalendarAssignments({
  data,
  viewMode,
  selectedDayIndex,
  onUpdateListItem,
  onUpdateHobby,
}: CalendarAssignmentsProps) {
  const visibleDays =
    viewMode === "week"
      ? data.dailySchedules
      : [data.dailySchedules[selectedDayIndex]];

  const visibleIndices =
    viewMode === "week"
      ? data.dailySchedules.map((_, i) => i)
      : [selectedDayIndex];

  return (
    <div className={`cal-assignments ${viewMode === "day" ? "cal-assignments--day" : ""}`}>
      {visibleDays.map((day, colOffset) => {
        const dayIndex = visibleIndices[colOffset];
        return (
          <div key={day.day} className="cal-assignments__card">
            <h4 className="cal-assignments__day">{day.day}</h4>

            {day.bigRocks.length > 0 && (
              <div className="cal-assignments__group">
                <strong>Big Rocks</strong>
                {day.bigRocks.map((item, ii) => (
                  <textarea
                    key={ii}
                    className="editable-field"
                    value={item}
                    onChange={(e) =>
                      onUpdateListItem(dayIndex, "bigRocks", ii, e.target.value)
                    }
                  />
                ))}
              </div>
            )}

            {day.choresAssigned.length > 0 && (
              <div className="cal-assignments__group">
                <strong>Chores</strong>
                {day.choresAssigned.map((item, ii) => (
                  <textarea
                    key={ii}
                    className="editable-field"
                    value={item}
                    onChange={(e) =>
                      onUpdateListItem(dayIndex, "choresAssigned", ii, e.target.value)
                    }
                  />
                ))}
              </div>
            )}

            {day.hobbyAssigned && (
              <div className="cal-assignments__group">
                <strong>Hobby</strong>
                <textarea
                  className="editable-field"
                  value={day.hobbyAssigned}
                  onChange={(e) => onUpdateHobby(dayIndex, e.target.value)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

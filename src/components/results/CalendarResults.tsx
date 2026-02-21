import React, { useState, useEffect, useRef } from "react";
import { CalendarPlanResult, DaySchedule } from "@/types";
import { formatTo12Hour } from "@/lib/format-time";

interface CalendarResultsProps {
  result: CalendarPlanResult;
  onBack: () => void;
  onDataChange?: (data: CalendarPlanResult) => void;
}

export default function CalendarResults({
  result,
  onBack,
  onDataChange,
}: CalendarResultsProps) {
  const [data, setData] = useState<CalendarPlanResult>(result);
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    onDataChange?.(data);
  }, [data, onDataChange]);

  const updateDay = (dayIndex: number, updates: Partial<DaySchedule>) => {
    setData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map((day, i) =>
        i === dayIndex ? { ...day, ...updates } : day
      ),
    }));
  };

  const updateTimeBlock = (
    dayIndex: number,
    blockIndex: number,
    description: string
  ) => {
    const day = data.dailySchedules[dayIndex];
    const timeBlocks = day.timeBlocks.map((b, i) =>
      i === blockIndex ? { ...b, description } : b
    );
    updateDay(dayIndex, { timeBlocks });
  };

  const updateListItem = (
    dayIndex: number,
    field: "bigRocks" | "choresAssigned",
    itemIndex: number,
    value: string
  ) => {
    const day = data.dailySchedules[dayIndex];
    const list = day[field].map((item, i) => (i === itemIndex ? value : item));
    updateDay(dayIndex, { [field]: list });
  };

  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Weekly Calendar</h2>
        <p>Week of {data.weekOf}</p>
      </div>

      {data.strategyNotes && (
        <div className="plan-summary">
          <strong>Strategy:</strong>
          <textarea
            className="editable-field"
            value={data.strategyNotes}
            onChange={(e) =>
              setData((prev) => ({ ...prev, strategyNotes: e.target.value }))
            }
            rows={2}
          />
        </div>
      )}

      {data.dailySchedules.map((daySchedule, dayIndex) => (
        <div key={dayIndex} className="day-section">
          <h3 className="day-header">{daySchedule.day}</h3>

          <div className="day-content">
            <div className="schedule-column">
              <h4>Schedule</h4>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {daySchedule.timeBlocks.map((block, blockIndex) => (
                    <tr key={blockIndex}>
                      <td className="time-cell">
                        {formatTo12Hour(block.startTime)} –{" "}
                        {formatTo12Hour(block.endTime)}
                      </td>
                      <td>
                        <textarea
                          className="editable-field"
                          value={block.description}
                          onChange={(e) =>
                            updateTimeBlock(dayIndex, blockIndex, e.target.value)
                          }
                          rows={1}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="day-assignments">
                {daySchedule.bigRocks.length > 0 && (
                  <div className="assignment-group">
                    <strong>Big Rocks:</strong>
                    <ul>
                      {daySchedule.bigRocks.map((rock, i) => (
                        <li key={i}>
                          <input
                            type="text"
                            className="editable-field"
                            value={rock}
                            onChange={(e) =>
                              updateListItem(dayIndex, "bigRocks", i, e.target.value)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {daySchedule.choresAssigned.length > 0 && (
                  <div className="assignment-group">
                    <strong>Chores:</strong>
                    <ul>
                      {daySchedule.choresAssigned.map((chore, i) => (
                        <li key={i}>
                          <input
                            type="text"
                            className="editable-field"
                            value={chore}
                            onChange={(e) =>
                              updateListItem(
                                dayIndex,
                                "choresAssigned",
                                i,
                                e.target.value
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {daySchedule.hobbyAssigned && (
                  <div className="assignment-group">
                    <strong>Hobby:</strong>
                    <input
                      type="text"
                      className="editable-field"
                      value={daySchedule.hobbyAssigned}
                      onChange={(e) =>
                        updateDay(dayIndex, { hobbyAssigned: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="result-actions">
        <button className="new-plan-button" onClick={onBack}>
          Edit Inputs
        </button>
        <button
          className="print-button"
          onClick={() => window.print()}
          aria-label="Print calendar plan"
        >
          Print
        </button>
      </div>
    </div>
  );
}

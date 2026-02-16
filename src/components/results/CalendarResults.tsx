import React from "react";
import { CalendarPlanResult } from "@/types";
import { formatTo12Hour } from "@/lib/format-time";

interface CalendarResultsProps {
  result: CalendarPlanResult;
  onBack: () => void;
}

export default function CalendarResults({
  result,
  onBack,
}: CalendarResultsProps) {
  return (
    <div className="plan-result">
      <div className="plan-header">
        <h2>Weekly Calendar</h2>
        <p>Week of {result.weekOf}</p>
      </div>

      {result.strategyNotes && (
        <div className="plan-summary">
          <p>
            <strong>Strategy:</strong> {result.strategyNotes}
          </p>
        </div>
      )}

      {result.dailySchedules.map((daySchedule, dayIndex) => (
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
                        {formatTo12Hour(block.startTime)} -{" "}
                        {formatTo12Hour(block.endTime)}
                      </td>
                      <td>
                        <textarea
                          className="editable-field"
                          defaultValue={block.description}
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
                            defaultValue={rock}
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
                            defaultValue={chore}
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
                      defaultValue={daySchedule.hobbyAssigned}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="new-plan-button" onClick={onBack}>
        Back to Form
      </button>
    </div>
  );
}

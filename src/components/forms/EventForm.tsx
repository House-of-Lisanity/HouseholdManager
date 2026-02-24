import React, { useState } from "react";
import { OneOffItem } from "@/types";
import { DAYS_MONDAY_START, generateId } from "@/lib/constants";

interface EventFormProps {
  onSave: (event: OneOffItem) => void;
  onCancel: () => void;
}

const INITIAL_EVENT: Partial<OneOffItem> = {
  type: "event",
  day: "Monday",
};

function buildEvent(draft: Partial<OneOffItem>): OneOffItem {
  return {
    ...draft,
    id: generateId("event"),
    type: draft.type || "event",
  } as OneOffItem;
}

function isValid(draft: Partial<OneOffItem>): boolean {
  return !!(draft.description && draft.day && draft.startTime && draft.endTime);
}

export default function EventForm({ onSave, onCancel }: EventFormProps) {
  const [event, setEvent] = useState<Partial<OneOffItem>>(INITIAL_EVENT);
  const [pending, setPending] = useState<OneOffItem[]>([]);

  const handleAddAnother = () => {
    if (!isValid(event)) return;
    setPending((prev) => [...prev, buildEvent(event)]);
    setEvent({ ...INITIAL_EVENT });
  };

  const handleSave = () => {
    const all = [...pending];
    if (isValid(event)) {
      all.push(buildEvent(event));
    }
    if (all.length === 0) return;
    all.forEach((item) => onSave(item));
    onCancel();
  };

  const removePending = (index: number) => {
    setPending((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="add-form">
      {pending.length > 0 && (
        <ul className="add-form__pending">
          {pending.map((item, i) => (
            <li key={i}>
              <span>
                {item.day}: {item.description} ({item.startTime}–
                {item.endTime})
              </span>
              <button
                type="button"
                onClick={() => removePending(i)}
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="form-group">
        <label htmlFor="event-description">Description</label>
        <input
          id="event-description"
          type="text"
          placeholder="Description"
          value={event.description || ""}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <div className="form-grid form-grid--4col">
        <div className="form-group">
          <label htmlFor="event-type">Type</label>
          <select
            id="event-type"
            value={event.type}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, type: e.target.value as any }))
            }
          >
            <option value="event">Event</option>
            <option value="appointment">Appointment</option>
            <option value="meeting">Meeting</option>
            <option value="dining">Dining Out</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="event-day">Day</label>
          <select
            id="event-day"
            value={event.day}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, day: e.target.value }))
            }
          >
            {DAYS_MONDAY_START.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="event-start">Start</label>
          <input
            id="event-start"
            type="text"
            placeholder="7:00 PM"
            value={event.startTime || ""}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, startTime: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-end">End</label>
          <input
            id="event-end"
            type="text"
            placeholder="9:00 PM"
            value={event.endTime || ""}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, endTime: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="form-buttons">
        <button
          type="button"
          className="add-another-button"
          onClick={handleAddAnother}
        >
          + Add Another
        </button>
        <button type="button" className="save-button" onClick={handleSave}>
          Save{pending.length > 0 ? ` (${pending.length + (isValid(event) ? 1 : 0)})` : ""}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

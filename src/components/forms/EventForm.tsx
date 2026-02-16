import React, { useState } from "react";
import { OneOffItem } from "@/types";
import { DAYS_MONDAY_START, generateId } from "@/lib/constants";

interface EventFormProps {
  onSave: (event: OneOffItem) => void;
  onCancel: () => void;
}

export default function EventForm({ onSave, onCancel }: EventFormProps) {
  const [event, setEvent] = useState<Partial<OneOffItem>>({
    type: "event",
    day: "Monday",
  });

  const handleSave = () => {
    if (event.description && event.day && event.startTime && event.endTime) {
      onSave({
        ...event,
        id: generateId("event"),
        type: event.type || "event",
      } as OneOffItem);
    }
  };

  return (
    <div className="add-form">
      <div className="form-grid">
        <select
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

        <input
          type="text"
          placeholder="Description"
          value={event.description || ""}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <select
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

        <input
          type="text"
          placeholder="Start (e.g., 7:00 PM)"
          value={event.startTime || ""}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, startTime: e.target.value }))
          }
        />

        <input
          type="text"
          placeholder="End (e.g., 9:00 PM)"
          value={event.endTime || ""}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, endTime: e.target.value }))
          }
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

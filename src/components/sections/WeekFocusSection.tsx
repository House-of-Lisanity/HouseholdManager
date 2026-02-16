import React from "react";
import { CalendarFormInput } from "@/types";
import FormSection from "../shared/FormSection";

interface WeekFocusSectionProps {
  formData: CalendarFormInput;
  onChange: (field: keyof CalendarFormInput, value: unknown) => void;
  onWeekChange?: (weekOf: string) => void;
}

export default function WeekFocusSection({
  formData,
  onChange,
  onWeekChange,
}: WeekFocusSectionProps) {
  const handleWeekOfChange = (value: string) => {
    onChange("weekOf", value);
    onWeekChange?.(value);
  };

  return (
    <FormSection title="Week & Focus">
      <div className="form-group">
        <label htmlFor="weekOf">Week of:</label>
        <input
          id="weekOf"
          type="date"
          value={formData.weekOf}
          onChange={(e) => handleWeekOfChange(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Must Do (3 goals):</label>
        <input
          type="text"
          placeholder="Must do #1"
          value={formData.mustDo1}
          onChange={(e) => onChange("mustDo1", e.target.value)}
        />
        <input
          type="text"
          placeholder="Must do #2"
          value={formData.mustDo2}
          onChange={(e) => onChange("mustDo2", e.target.value)}
        />
        <input
          type="text"
          placeholder="Must do #3"
          value={formData.mustDo3}
          onChange={(e) => onChange("mustDo3", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Hobbies (1 hour each):</label>
        <input
          type="text"
          placeholder="Hobby #1"
          value={formData.hobby1}
          onChange={(e) => onChange("hobby1", e.target.value)}
        />
        <input
          type="text"
          placeholder="Hobby #2"
          value={formData.hobby2}
          onChange={(e) => onChange("hobby2", e.target.value)}
        />
        <input
          type="text"
          placeholder="Hobby #3"
          value={formData.hobby3}
          onChange={(e) => onChange("hobby3", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Weekend Projects:</label>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Project #1"
            value={formData.weekendProject1}
            onChange={(e) => onChange("weekendProject1", e.target.value)}
          />
          <select
            value={formData.weekendProject1Duration || "2-4 hours"}
            onChange={(e) =>
              onChange("weekendProject1Duration", e.target.value)
            }
          >
            <option value="2 hours">2 hours</option>
            <option value="2-4 hours">2-4 hours</option>
            <option value="Half-day">Half-day (4-6 hours)</option>
            <option value="All-day">All-day (6+ hours)</option>
          </select>
        </div>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Project #2"
            value={formData.weekendProject2}
            onChange={(e) => onChange("weekendProject2", e.target.value)}
          />
          <select
            value={formData.weekendProject2Duration || "2-4 hours"}
            onChange={(e) =>
              onChange("weekendProject2Duration", e.target.value)
            }
          >
            <option value="2 hours">2 hours</option>
            <option value="2-4 hours">2-4 hours</option>
            <option value="Half-day">Half-day (4-6 hours)</option>
            <option value="All-day">All-day (6+ hours)</option>
          </select>
        </div>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Project #3 (optional)"
            value={formData.weekendProject3}
            onChange={(e) => onChange("weekendProject3", e.target.value)}
          />
          <select
            value={formData.weekendProject3Duration || "2-4 hours"}
            onChange={(e) =>
              onChange("weekendProject3Duration", e.target.value)
            }
          >
            <option value="2 hours">2 hours</option>
            <option value="2-4 hours">2-4 hours</option>
            <option value="Half-day">Half-day (4-6 hours)</option>
            <option value="All-day">All-day (6+ hours)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Weekly Chores:</label>
        <input
          type="text"
          placeholder="Chore #1"
          value={formData.chore1}
          onChange={(e) => onChange("chore1", e.target.value)}
        />
        <input
          type="text"
          placeholder="Chore #2"
          value={formData.chore2}
          onChange={(e) => onChange("chore2", e.target.value)}
        />
        <input
          type="text"
          placeholder="Chore #3"
          value={formData.chore3}
          onChange={(e) => onChange("chore3", e.target.value)}
        />
      </div>
    </FormSection>
  );
}

"use client";

import React from "react";
import { UserProfile, BufferRule, Location } from "@/types";

interface CalendarPreferencesProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function CalendarPreferences({
  profile,
  updateProfile,
}: CalendarPreferencesProps) {
  const handleBufferRuleChange = (
    index: number,
    field: keyof BufferRule,
    value: string | number
  ) => {
    const updated = [...profile.bufferRules];
    updated[index] = { ...updated[index], [field]: value };
    updateProfile("bufferRules", updated);
  };

  const handleLocationChange = (
    index: number,
    field: keyof Location,
    value: string | number
  ) => {
    const updated = [...profile.locations];
    updated[index] = { ...updated[index], [field]: value };
    updateProfile("locations", updated);
  };

  const addBufferRule = () => {
    updateProfile("bufferRules", [
      ...profile.bufferRules,
      { activityType: "appointment", minutesBefore: 15, minutesAfter: 15 },
    ]);
  };

  const removeBufferRule = (index: number) => {
    updateProfile(
      "bufferRules",
      profile.bufferRules.filter((_, i) => i !== index)
    );
  };

  const addLocation = () => {
    updateProfile("locations", [
      ...profile.locations,
      { name: "", address: "", driveTimeMinutes: 0 },
    ]);
  };

  const removeLocation = (index: number) => {
    updateProfile(
      "locations",
      profile.locations.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="profile-tab-content">
      {/* Work Schedule */}
      <div className="profile-card">
        <h3>Work Schedule</h3>
        <div className="form-grid form-grid--2col">
          <div className="form-group">
            <label htmlFor="workStart">Work Start Time</label>
            <input
              id="workStart"
              type="text"
              placeholder="e.g., 6:30 AM"
              value={profile.workStartTime}
              onChange={(e) => updateProfile("workStartTime", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="workEnd">Work End Time</label>
            <input
              id="workEnd"
              type="text"
              placeholder="e.g., 3:30 PM"
              value={profile.workEndTime}
              onChange={(e) => updateProfile("workEndTime", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sleep Schedule */}
      <div className="profile-card">
        <h3>Sleep Schedule</h3>
        <div className="form-grid form-grid--2col">
          <div className="form-group">
            <label htmlFor="wakeTime">Wake Time</label>
            <input
              id="wakeTime"
              type="text"
              placeholder="e.g., 6:00 AM"
              value={profile.wakeTime}
              onChange={(e) => updateProfile("wakeTime", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bedTime">Bed Time</label>
            <input
              id="bedTime"
              type="text"
              placeholder="e.g., 10:00 PM"
              value={profile.bedTime}
              onChange={(e) => updateProfile("bedTime", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buffer Rules */}
      <div className="profile-card">
        <h3>Buffer Rules</h3>
        <p className="profile-card__hint">
          How much prep/travel time to add before and after activities.
        </p>
        <div className="buffer-rule-grid buffer-rule-header">
          <span>Activity Type</span>
          <span>Before (min)</span>
          <span>After (min)</span>
          <span></span>
        </div>
        {profile.bufferRules.map((rule, i) => (
          <div key={i} className="buffer-rule-grid">
            <select
              aria-label={`Activity type for rule ${i + 1}`}
              value={rule.activityType}
              onChange={(e) =>
                handleBufferRuleChange(i, "activityType", e.target.value)
              }
            >
              <option value="gym">Gym</option>
              <option value="event">Event</option>
              <option value="appointment">Appointment</option>
            </select>
            <input
              type="number"
              aria-label={`Minutes before for rule ${i + 1}`}
              value={rule.minutesBefore}
              onChange={(e) =>
                handleBufferRuleChange(
                  i,
                  "minutesBefore",
                  parseInt(e.target.value) || 0
                )
              }
            />
            <input
              type="number"
              aria-label={`Minutes after for rule ${i + 1}`}
              value={rule.minutesAfter}
              onChange={(e) =>
                handleBufferRuleChange(
                  i,
                  "minutesAfter",
                  parseInt(e.target.value) || 0
                )
              }
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeBufferRule(i)}
              aria-label={`Remove buffer rule ${i + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addBufferRule}>
          + Add Buffer Rule
        </button>
      </div>

      {/* Locations */}
      <div className="profile-card">
        <h3>Locations</h3>
        <p className="profile-card__hint">
          Saved locations for drive time calculations.
        </p>
        <div className="location-rule location-rule-header">
          <span>Location Name</span>
          <span>Drive Time (min)</span>
          <span></span>
        </div>
        {profile.locations.map((loc, i) => (
          <div key={i} className="location-rule">
            <input
              type="text"
              aria-label={`Location name ${i + 1}`}
              placeholder="Location name"
              value={loc.name}
              onChange={(e) => handleLocationChange(i, "name", e.target.value)}
            />
            <input
              type="number"
              aria-label={`Drive time for location ${i + 1}`}
              placeholder="Minutes"
              value={loc.driveTimeMinutes}
              onChange={(e) =>
                handleLocationChange(
                  i,
                  "driveTimeMinutes",
                  parseInt(e.target.value) || 0
                )
              }
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeLocation(i)}
              aria-label={`Remove location ${i + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addLocation}>
          + Add Location
        </button>
      </div>
    </div>
  );
}

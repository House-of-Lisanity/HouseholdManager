"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import WorkoutsBodyCard from "./WorkoutsBodyCard";

type EquipmentField = "gymEquipment" | "homeEquipment" | "crossfitEquipment";

interface WorkoutsPreferencesProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function WorkoutsPreferences({
  profile,
  updateProfile,
}: WorkoutsPreferencesProps) {
  const [newItems, setNewItems] = useState<Record<EquipmentField, string>>({
    gymEquipment: "",
    homeEquipment: "",
    crossfitEquipment: "",
  });

  const addEquipmentItems = (field: EquipmentField) => {
    const raw = newItems[field].trim();
    if (!raw) return;
    const parsed = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parsed.length === 0) return;
    const current = profile[field] || [];
    updateProfile(field, [...current, ...parsed]);
    setNewItems((prev) => ({ ...prev, [field]: "" }));
  };

  const removeEquipmentItem = (field: EquipmentField, index: number) => {
    const current = profile[field] || [];
    updateProfile(
      field,
      current.filter((_, i) => i !== index)
    );
  };

  const renderEquipmentCard = (
    field: EquipmentField,
    title: string,
    placeholder: string
  ) => {
    const items = profile[field] || [];
    return (
      <div className="profile-card">
        <h3>{title}</h3>
        {items.length > 0 && (
          <div className="equipment-list">
            {items.map((item, i) => (
              <div key={i} className="equipment-list__item">
                <span>{item}</span>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeEquipmentItem(field, i)}
                  aria-label={`Remove ${item}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="form-group">
          <textarea
            placeholder={placeholder}
            value={newItems[field]}
            onChange={(e) =>
              setNewItems((prev) => ({ ...prev, [field]: e.target.value }))
            }
            rows={3}
          />
          <button
            type="button"
            className="add-button"
            onClick={() => addEquipmentItems(field)}
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-tab-content">
      <WorkoutsBodyCard profile={profile} updateProfile={updateProfile} />

      {renderEquipmentCard(
        "gymEquipment",
        "Gym Equipment",
        "e.g., Cable Machine, Leg Press..."
      )}
      {renderEquipmentCard(
        "crossfitEquipment",
        "CrossFit Equipment",
        "e.g., Barbell, Rower, Assault Bike..."
      )}
      {renderEquipmentCard(
        "homeEquipment",
        "Home Equipment",
        "e.g., Dumbbells, Resistance Bands..."
      )}

      <div className="profile-card">
        <h3>Fitness Goals</h3>
        <div className="form-group">
          <label htmlFor="fitnessGoals">Goals</label>
          <textarea
            id="fitnessGoals"
            placeholder="e.g., build muscle, improve cardio endurance, lose weight..."
            value={profile.fitnessGoals}
            onChange={(e) => updateProfile("fitnessGoals", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="profile-card">
        <h3>Injuries and Limitations</h3>
        <div className="form-group">
          <label htmlFor="injuries">Current Injuries or Limitations</label>
          <textarea
            id="injuries"
            placeholder="e.g., recovering from knee surgery, avoid overhead pressing..."
            value={profile.injuriesLimitations}
            onChange={(e) =>
              updateProfile("injuriesLimitations", e.target.value)
            }
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

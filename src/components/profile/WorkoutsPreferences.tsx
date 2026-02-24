"use client";

import React, { useState } from "react";
import { UserProfile, LiftMax } from "@/types";
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

  const handleLiftMaxChange = (
    index: number,
    field: keyof LiftMax,
    value: string
  ) => {
    const updated = [...profile.liftMaxes];
    updated[index] = { ...updated[index], [field]: value };
    updateProfile("liftMaxes", updated);
  };

  const addLiftMax = () => {
    updateProfile("liftMaxes", [
      ...profile.liftMaxes,
      { liftName: "", weight: "" },
    ]);
  };

  const removeLiftMax = (index: number) => {
    updateProfile(
      "liftMaxes",
      profile.liftMaxes.filter((_, i) => i !== index)
    );
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
      <div className="profile-card">
        <h3>Fitness Goals</h3>
        <div className="form-group">
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

      <div className="profile-card">
        <h3>One-Rep Maxes</h3>
        <p className="profile-card__hint">
          Track your current maxes. These will auto-update from workout logs in
          a future release.
        </p>
        <div className="lift-max-grid lift-max-header">
          <span>Lift</span>
          <span>Weight (lb)</span>
          <span></span>
        </div>
        {(profile.liftMaxes || []).map((lift, i) => (
          <div key={i} className="lift-max-grid">
            <input
              type="text"
              aria-label={`Lift name ${i + 1}`}
              placeholder="e.g., Back Squat"
              value={lift.liftName}
              onChange={(e) => handleLiftMaxChange(i, "liftName", e.target.value)}
            />
            <input
              type="text"
              aria-label={`Weight for lift ${i + 1}`}
              placeholder="e.g., 275"
              value={lift.weight}
              onChange={(e) => handleLiftMaxChange(i, "weight", e.target.value)}
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => removeLiftMax(i)}
              aria-label={`Remove lift ${i + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={addLiftMax}>
          + Add Lift
        </button>
      </div>

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

      <WorkoutsBodyCard profile={profile} updateProfile={updateProfile} />
    </div>
  );
}

"use client";

import React from "react";
import { UserProfile, LiftMax } from "@/types";

interface WorkoutsBodyCardProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function WorkoutsBodyCard({
  profile,
  updateProfile,
}: WorkoutsBodyCardProps) {
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

  return (
    <>
      {/* Body Stats & Measurements */}
      <div className="profile-card profile-card--tight">
        <h3>Body Stats & Measurements</h3>
        <div className="form-grid form-grid--3col form-grid--tight">
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <input
              id="height"
              type="text"
              placeholder={'5\'8"'}
              value={profile.height}
              onChange={(e) => updateProfile("height", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input
              id="weight"
              type="text"
              placeholder="185 lb"
              value={profile.weight}
              onChange={(e) => updateProfile("weight", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="trainingAge">
              Training Age{" "}
              <span className="label-hint">(years of consistent training)</span>
            </label>
            <input
              id="trainingAge"
              type="text"
              placeholder="2-3 years"
              value={profile.trainingAge}
              onChange={(e) => updateProfile("trainingAge", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hipMeasurement">Hips (in)</label>
            <input
              id="hipMeasurement"
              type="text"
              placeholder="inches"
              value={profile.hipMeasurement}
              onChange={(e) => updateProfile("hipMeasurement", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="waistMeasurement">Waist (in)</label>
            <input
              id="waistMeasurement"
              type="text"
              placeholder="inches"
              value={profile.waistMeasurement}
              onChange={(e) => updateProfile("waistMeasurement", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="chestMeasurement">Chest (in)</label>
            <input
              id="chestMeasurement"
              type="text"
              placeholder="inches"
              value={profile.chestMeasurement}
              onChange={(e) => updateProfile("chestMeasurement", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="thighMeasurement">Thighs (in)</label>
            <input
              id="thighMeasurement"
              type="text"
              placeholder="inches"
              value={profile.thighMeasurement}
              onChange={(e) => updateProfile("thighMeasurement", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="armMeasurement">Arms (in)</label>
            <input
              id="armMeasurement"
              type="text"
              placeholder="inches"
              value={profile.armMeasurement}
              onChange={(e) => updateProfile("armMeasurement", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* One-Rep Maxes */}
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
    </>
  );
}

"use client";

import React from "react";
import { UserProfile } from "@/types";

interface WorkoutsBodyCardProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function WorkoutsBodyCard({
  profile,
  updateProfile,
}: WorkoutsBodyCardProps) {
  return (
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
  );
}

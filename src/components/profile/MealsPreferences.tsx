"use client";

import React from "react";
import { UserProfile } from "@/types";

const DIETARY_STYLES = [
  { value: "none", label: "None" },
  { value: "post-bariatric", label: "Post-Bariatric" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
] as const;

const COOKING_APPLIANCES = [
  "Tovala",
  "Air Fryer",
  "Instant Pot",
  "Oven",
  "Stovetop",
  "Grill",
  "Slow Cooker",
] as const;

interface MealsPreferencesProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function MealsPreferences({
  profile,
  updateProfile,
}: MealsPreferencesProps) {
  const toggleAppliance = (appliance: string) => {
    const current = profile.cookingAppliances || [];
    const updated = current.includes(appliance)
      ? current.filter((a) => a !== appliance)
      : [...current, appliance];
    updateProfile("cookingAppliances", updated);
  };

  return (
    <div className="profile-tab-content">
      {/* Dietary Information */}
      <div className="profile-card">
        <h3>Dietary Information</h3>
        <div className="form-grid form-grid--2col">
          <div className="form-group">
            <label htmlFor="dietaryStyle">Dietary Style</label>
            <select
              id="dietaryStyle"
              value={profile.dietaryStyle}
              onChange={(e) => updateProfile("dietaryStyle", e.target.value)}
            >
              {DIETARY_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <input
              id="allergies"
              type="text"
              placeholder="e.g., nuts, shellfish, gluten..."
              value={profile.allergies}
              onChange={(e) => updateProfile("allergies", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="foodsToAvoid">Foods to Avoid</label>
          <textarea
            id="foodsToAvoid"
            placeholder="e.g., raw onions, mushrooms..."
            value={profile.foodsToAvoid}
            onChange={(e) => updateProfile("foodsToAvoid", e.target.value)}
            rows={2}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cravings">Cravings and Preferences</label>
          <textarea
            id="cravings"
            placeholder="e.g., craving Mexican food, prefer warm meals..."
            value={profile.cravingsPreferences}
            onChange={(e) =>
              updateProfile("cravingsPreferences", e.target.value)
            }
            rows={2}
          />
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="profile-card">
        <h3>Nutrition Targets</h3>
        <div className="form-grid form-grid--3col">
          <div className="form-group">
            <label htmlFor="protein">Daily Protein (g)</label>
            <input
              id="protein"
              type="text"
              placeholder="e.g., 110"
              value={profile.targetProtein}
              onChange={(e) => updateProfile("targetProtein", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="calories">Daily Calories</label>
            <input
              id="calories"
              type="text"
              placeholder="e.g., 1800"
              value={profile.targetCalories}
              onChange={(e) => updateProfile("targetCalories", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alcohol">Daily Alcohol</label>
            <input
              id="alcohol"
              type="text"
              placeholder="e.g., 1 drink (optional)"
              value={profile.dailyAlcohol}
              onChange={(e) => updateProfile("dailyAlcohol", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cooking Appliances */}
      <div className="profile-card">
        <h3>Cooking Appliances</h3>
        <p className="profile-card__hint">
          Select the appliances you have available.
        </p>
        <div className="checkbox-grid">
          {COOKING_APPLIANCES.map((appliance) => (
            <label key={appliance} className="checkbox-item">
              <input
                type="checkbox"
                checked={(profile.cookingAppliances || []).includes(appliance)}
                onChange={() => toggleAppliance(appliance)}
              />
              <span>{appliance}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

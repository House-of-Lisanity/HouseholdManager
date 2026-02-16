"use client";

import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import CalendarPreferences from "@/components/profile/CalendarPreferences";
import MealsPreferences from "@/components/profile/MealsPreferences";
import WorkoutsPreferences from "@/components/profile/WorkoutsPreferences";
import PantryPreferences from "@/components/profile/PantryPreferences";

type ProfileTab = "calendar" | "meals" | "workouts" | "pantry";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "calendar", label: "Calendar" },
  { id: "meals", label: "Meals" },
  { id: "workouts", label: "Workouts" },
  { id: "pantry", label: "Pantry" },
];

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("calendar");

  if (loading) {
    return (
      <div className="container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <p className="profile-header__subtitle">Changes save automatically</p>
      </div>

      <div className="profile-tabs" role="tablist" aria-label="Profile settings">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`profile-tabs__tab${activeTab === tab.id ? " profile-tabs__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-label={`${activeTab} preferences`}
      >
        {activeTab === "calendar" && (
          <CalendarPreferences profile={profile} updateProfile={updateProfile} />
        )}
        {activeTab === "meals" && (
          <MealsPreferences profile={profile} updateProfile={updateProfile} />
        )}
        {activeTab === "workouts" && (
          <WorkoutsPreferences profile={profile} updateProfile={updateProfile} />
        )}
        {activeTab === "pantry" && (
          <PantryPreferences profile={profile} updateProfile={updateProfile} />
        )}
      </div>
    </div>
  );
}

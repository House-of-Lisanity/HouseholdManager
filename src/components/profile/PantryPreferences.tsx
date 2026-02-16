"use client";

import React from "react";
import { UserProfile } from "@/types";
import PantrySection from "@/components/sections/PantrySection";

interface PantryPreferencesProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
}

export default function PantryPreferences({
  profile,
  updateProfile,
}: PantryPreferencesProps) {
  return (
    <div className="profile-tab-content">
      <PantrySection
        items={profile.pantryItems}
        onUpdate={(items) => updateProfile("pantryItems", items)}
      />
    </div>
  );
}

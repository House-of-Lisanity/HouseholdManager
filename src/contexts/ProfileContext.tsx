"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { UserProfile } from "@/types";

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: unknown) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  // Calendar
  workStartTime: "6:30 AM",
  workEndTime: "3:30 PM",
  wakeTime: "6:00 AM",
  bedTime: "10:00 PM",
  bufferRules: [
    { activityType: "gym", minutesBefore: 30, minutesAfter: 15 },
    { activityType: "event", minutesBefore: 120, minutesAfter: 30 },
    { activityType: "appointment", minutesBefore: 15, minutesAfter: 15 },
  ],
  locations: [
    { name: "Gym", address: "", driveTimeMinutes: 15 },
    { name: "Nuggets Arena", address: "", driveTimeMinutes: 30 },
  ],

  // Meals
  targetProtein: "110",
  targetCalories: "",
  dailyAlcohol: "1 drink (optional)",
  foodsToAvoid: "",
  cravingsPreferences: "",
  allergies: "",
  dietaryStyle: "none",
  cookingAppliances: [],

  // Workouts — Equipment
  gymEquipment: [],
  homeEquipment: [],
  crossfitEquipment: [],

  // Workouts — Body
  height: "",
  weight: "",
  trainingAge: "",
  hipMeasurement: "",
  waistMeasurement: "",
  chestMeasurement: "",
  thighMeasurement: "",
  armMeasurement: "",
  liftMaxes: [],

  // Workouts — Goals
  fitnessGoals: "",
  injuriesLimitations: "",

  // Pantry
  pantryItems: [],
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load profile from MongoDB on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data) setProfile((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
    loadProfile();
  }, []);

  // Debounced auto-save to MongoDB on changes
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
      } catch (err) {
        console.error("Failed to save profile:", err);
      }
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [profile]);

  const updateProfile = useCallback(
    (field: keyof UserProfile, value: unknown) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

import { UserProfile } from "@/types";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";

const DEFAULT_PROFILE: UserProfile = {
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
  targetProtein: "110",
  targetCalories: "",
  dailyAlcohol: "1 drink (optional)",
  foodsToAvoid: "",
  cravingsPreferences: "",
  allergies: "",
  dietaryStyle: "none",
  cookingAppliances: [],
  gymEquipment: [],
  homeEquipment: [],
  crossfitEquipment: [],
  height: "",
  weight: "",
  trainingAge: "",
  hipMeasurement: "",
  waistMeasurement: "",
  chestMeasurement: "",
  thighMeasurement: "",
  armMeasurement: "",
  liftMaxes: [],
  fitnessGoals: "",
  injuriesLimitations: "",
  pantryItems: [],
};

export async function loadUserProfile(): Promise<UserProfile> {
  await connectToDatabase();
  const doc = await Profile.findOne().lean();

  if (!doc) return DEFAULT_PROFILE;

  // Strip Mongoose fields and merge with defaults
  const { _id, __v, ...profileData } = doc as Record<string, unknown>;
  return { ...DEFAULT_PROFILE, ...profileData } as UserProfile;
}

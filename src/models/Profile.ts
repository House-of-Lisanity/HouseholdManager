import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: string;
  // Calendar
  workStartTime: string;
  workEndTime: string;
  wakeTime: string;
  bedTime: string;
  schedulingPreferences: string;
  bufferRules: {
    activityType: "gym" | "event" | "appointment";
    minutesBefore: number;
    minutesAfter: number;
  }[];
  timezone: string;
  homeAddress: string;
  workAddress: string;
  locations: {
    name: string;
    address: string;
  }[];

  // Meals
  targetCalories: string;
  targetProtein: string;
  targetCarbs: string;
  targetFats: string;
  foodsToAvoid: string;
  cravingsPreferences: string;
  allergies: string;
  dietaryStyle: string;
  cookingAppliances: string;

  // Workouts — Equipment
  gymEquipment: string[];
  homeEquipment: string[];
  crossfitEquipment: string[];

  // Workouts — Body
  height: string;
  weight: string;
  trainingAge: string;
  hipMeasurement: string;
  waistMeasurement: string;
  chestMeasurement: string;
  thighMeasurement: string;
  armMeasurement: string;
  liftMaxes: { liftName: string; weight: string }[];

  // Workouts — Goals
  fitnessGoals: string;
  injuriesLimitations: string;

  // Pantry
  pantryItems: {
    id: string;
    name: string;
    quantity?: string;
    category?: string;
    unit?: string;
    expiresInDays?: number;
    notes?: string;
  }[];

  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    // Calendar
    workStartTime: { type: String, default: "6:30 AM" },
    workEndTime: { type: String, default: "3:30 PM" },
    wakeTime: { type: String, default: "6:00 AM" },
    bedTime: { type: String, default: "10:00 PM" },
    schedulingPreferences: { type: String, default: "" },
    bufferRules: [
      {
        activityType: {
          type: String,
          enum: ["gym", "event", "appointment"],
          required: true,
        },
        minutesBefore: { type: Number, required: true },
        minutesAfter: { type: Number, required: true },
      },
    ],
    timezone: { type: String, default: "" },
    homeAddress: { type: String, default: "" },
    workAddress: { type: String, default: "" },
    locations: [
      {
        name: { type: String, required: true },
        address: { type: String, default: "" },
      },
    ],

    // Meals
    targetCalories: { type: String, default: "" },
    targetProtein: { type: String, default: "" },
    targetCarbs: { type: String, default: "" },
    targetFats: { type: String, default: "" },
    foodsToAvoid: { type: String, default: "" },
    cravingsPreferences: { type: String, default: "" },
    allergies: { type: String, default: "" },
    dietaryStyle: { type: String, default: "none" },
    cookingAppliances: { type: String, default: "" },

    // Workouts — Equipment
    gymEquipment: { type: [String], default: [] },
    homeEquipment: { type: [String], default: [] },
    crossfitEquipment: { type: [String], default: [] },

    // Workouts — Body
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    trainingAge: { type: String, default: "" },
    hipMeasurement: { type: String, default: "" },
    waistMeasurement: { type: String, default: "" },
    chestMeasurement: { type: String, default: "" },
    thighMeasurement: { type: String, default: "" },
    armMeasurement: { type: String, default: "" },
    liftMaxes: [{ liftName: String, weight: String }],

    // Workouts — Goals
    fitnessGoals: { type: String, default: "" },
    injuriesLimitations: { type: String, default: "" },

    // Pantry
    pantryItems: [
      {
        id: String,
        name: String,
        quantity: String,
        category: String,
        unit: String,
        expiresInDays: Number,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

// Delete cached model so schema changes apply during hot reloading
if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

export default mongoose.model<IProfile>("Profile", ProfileSchema);

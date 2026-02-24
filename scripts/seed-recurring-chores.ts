/**
 * Seed script: populates common recurring household chores.
 * Seeded items have notes="seeded" so re-running safely replaces them
 * without touching user-created tasks.
 *
 * Run with:  npx tsx scripts/seed-recurring-chores.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load env vars — try .env.local first, fall back to .env
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Inline schema (avoids @/ alias issues outside Next.js)
const RecurringItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Home", "Health & Fitness", "Finance", "Personal", "Errands"],
      required: true,
    },
    subcategory: { type: String },
    frequency: {
      type: String,
      enum: ["weekly", "biweekly", "monthly", "quarterly"],
      required: true,
    },
    location: { type: String },
    lastCompletedDate: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RecurringItem =
  mongoose.models.RecurringItem ||
  mongoose.model("RecurringItem", RecurringItemSchema);

interface Chore {
  title: string;
  category: string;
  subcategory?: string;
  frequency: string;
}

const chores: Chore[] = [
  // Home — Kitchen
  { title: "Wipe down counters", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Clean stovetop", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Empty dishwasher", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Take out trash", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Take out recycling", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Mop kitchen floor", category: "Home", subcategory: "Kitchen", frequency: "weekly" },
  { title: "Clean microwave", category: "Home", subcategory: "Kitchen", frequency: "biweekly" },
  { title: "Clean refrigerator", category: "Home", subcategory: "Kitchen", frequency: "monthly" },
  { title: "Clean oven", category: "Home", subcategory: "Kitchen", frequency: "monthly" },

  // Home — Bathroom
  { title: "Clean toilet", category: "Home", subcategory: "Bathroom", frequency: "weekly" },
  { title: "Clean shower/tub", category: "Home", subcategory: "Bathroom", frequency: "weekly" },
  { title: "Clean bathroom sink", category: "Home", subcategory: "Bathroom", frequency: "weekly" },
  { title: "Wash bath towels", category: "Home", subcategory: "Bathroom", frequency: "weekly" },
  { title: "Clean bathroom mirror", category: "Home", subcategory: "Bathroom", frequency: "biweekly" },

  // Home — Bedroom
  { title: "Do laundry", category: "Home", subcategory: "Bedroom", frequency: "weekly" },
  { title: "Change bed sheets", category: "Home", subcategory: "Bedroom", frequency: "biweekly" },
  { title: "Dust surfaces", category: "Home", subcategory: "Bedroom", frequency: "biweekly" },

  // Home — Living Room
  { title: "Vacuum floors", category: "Home", subcategory: "Living Room", frequency: "weekly" },
  { title: "Dust surfaces", category: "Home", subcategory: "Living Room", frequency: "biweekly" },
  { title: "Vacuum couch/upholstery", category: "Home", subcategory: "Living Room", frequency: "monthly" },
  { title: "Clean windows (interior)", category: "Home", subcategory: "Living Room", frequency: "monthly" },

  // Home — Office
  { title: "Clean desk area", category: "Home", subcategory: "Office", frequency: "weekly" },
  { title: "Shred old papers", category: "Home", subcategory: "Office", frequency: "monthly" },

  // Home — Other
  { title: "Wipe light switches and door handles", category: "Home", subcategory: "Other", frequency: "biweekly" },

  // Home — Garage
  { title: "Organize garage", category: "Home", subcategory: "Garage", frequency: "quarterly" },

  // Home — Yard
  { title: "Mow lawn", category: "Home", subcategory: "Yard", frequency: "weekly" },
  { title: "Weed garden beds", category: "Home", subcategory: "Yard", frequency: "biweekly" },
  { title: "Sweep porch/patio", category: "Home", subcategory: "Yard", frequency: "biweekly" },
  { title: "Trim hedges", category: "Home", subcategory: "Yard", frequency: "monthly" },
  { title: "Clean gutters", category: "Home", subcategory: "Yard", frequency: "quarterly" },

  // Health & Fitness
  { title: "Meal prep", category: "Health & Fitness", frequency: "weekly" },

  // Finance
  { title: "Review budget", category: "Finance", frequency: "monthly" },
  { title: "Pay bills", category: "Finance", frequency: "monthly" },
  { title: "Check bank statements", category: "Finance", frequency: "monthly" },
  { title: "Review subscriptions", category: "Finance", frequency: "quarterly" },

  // Errands
  { title: "Grocery shopping", category: "Errands", frequency: "weekly" },
  { title: "Car wash", category: "Errands", frequency: "biweekly" },
  { title: "Refill prescriptions", category: "Errands", frequency: "monthly" },
  { title: "Oil change / car maintenance", category: "Errands", frequency: "quarterly" },

  // Personal
  { title: "Schedule appointments", category: "Personal", frequency: "monthly" },
  { title: "Digital cleanup (email, files)", category: "Personal", frequency: "monthly" },
  { title: "Back up computer/phone", category: "Personal", frequency: "quarterly" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Remove previously seeded items by title match (safe for user-created tasks)
  const seedTitles = chores.map((c) => c.title);
  const deleted = await RecurringItem.deleteMany({
    $or: [
      { notes: "seeded" },
      { title: { $in: seedTitles } },
    ],
  });
  if (deleted.deletedCount > 0) {
    console.log(`Cleared ${deleted.deletedCount} previously seeded recurring items`);
  }

  const docs = chores.map((chore) => ({
    title: chore.title,
    notes: "",
    category: chore.category,
    subcategory: chore.subcategory || "",
    frequency: chore.frequency,
    active: true,
  }));

  const result = await RecurringItem.insertMany(docs);
  console.log(`Seeded ${result.length} recurring chores`);

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

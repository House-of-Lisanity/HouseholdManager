/**
 * One-time migration script: assigns all existing documents (that lack a userId)
 * to the first admin user in the database.
 *
 * Run with: npx tsx src/scripts/migrate-user-data.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const COLLECTIONS = [
  "profiles",
  "calendarplans",
  "calendarresults",
  "mealplans",
  "mealsresults",
  "workoutplans",
  "workoutsresults",
  "todoitems",
  "recurringitems",
  "meallogs",
  "workoutlogs",
];

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);

  const db = mongoose.connection.db;
  if (!db) {
    console.error("Failed to get database connection");
    process.exit(1);
  }

  // Find the first admin user
  const usersCollection = db.collection("users");
  const admin = await usersCollection.findOne({ role: "admin" });

  if (!admin) {
    console.error(
      "No admin user found. Register an account first, then run this script."
    );
    process.exit(1);
  }

  const userId = admin._id.toString();
  console.log(`Migrating data to admin user: ${admin.email} (${userId})`);

  let totalUpdated = 0;

  for (const collectionName of COLLECTIONS) {
    const collection = db.collection(collectionName);

    // Only update documents that don't already have a userId
    const result = await collection.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );

    if (result.modifiedCount > 0) {
      console.log(`  ${collectionName}: updated ${result.modifiedCount} documents`);
      totalUpdated += result.modifiedCount;
    } else {
      console.log(`  ${collectionName}: no documents to migrate`);
    }
  }

  console.log(`\nMigration complete. ${totalUpdated} documents updated.`);

  // Drop old unique indexes on weekOf (they need to be compound with userId now)
  const weekOfCollections = [
    "calendarplans",
    "calendarresults",
    "mealplans",
    "mealsresults",
    "workoutplans",
    "workoutsresults",
  ];

  for (const collectionName of weekOfCollections) {
    const collection = db.collection(collectionName);
    try {
      const indexes = await collection.indexes();
      for (const index of indexes) {
        // Drop single-field unique index on weekOf
        if (
          index.unique &&
          index.key &&
          "weekOf" in index.key &&
          !("userId" in index.key) &&
          index.name !== "_id_"
        ) {
          console.log(`  Dropping old index "${index.name}" on ${collectionName}`);
          await collection.dropIndex(index.name!);
        }
      }
    } catch (err) {
      console.log(`  Could not check indexes on ${collectionName}:`, err);
    }
  }

  console.log("Index cleanup complete.");
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

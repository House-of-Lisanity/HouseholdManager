/**
 * One-time seed script: imports Marlowe renovation tasks into the TodoItem collection.
 *
 * Run with:  npx tsx scripts/seed-renovation-todos.ts
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
const TodoItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    category: { type: String, required: true },
    subcategory: { type: String },
    isProject: { type: Boolean, default: false },
    location: { type: String },
    completed: { type: Boolean, default: false },
    completedAt: { type: String },
  },
  { timestamps: true }
);

const TodoItem =
  mongoose.models.TodoItem ||
  mongoose.model("TodoItem", TodoItemSchema);

interface RawTask {
  completed: boolean;
  title: string;
  room: string;
  measurements: string;
  budget: string;
  productLink: string;
}

// ---------- Parsed renovation data ----------

const tasks: RawTask[] = [];

function addTask(
  room: string,
  completed: boolean,
  title: string,
  measurements: string,
  budget: string,
  productLink: string
) {
  if (!title.trim()) return;
  tasks.push({ completed, title: title.trim(), room, measurements, budget, productLink });
}

// Master bath
addTask("Master bath", false, "Vanity", "36in wide", "$1,100", "");
addTask("Master bath", false, "Shower pan kit", "60in x 35in", "$880", "");
addTask("Master bath", false, "Wall tile", "14ft W x 8ft H = 112 sq ft, 112 units @ $5/ea", "$616", "");
addTask("Master bath", false, "Floor tile", "6ft x 6ft = 36 sq ft, 36 units @ $4/ea", "$158", "");
addTask("Master bath", false, "Medicine cabinet/mirror", "", "$220", "");
addTask("Master bath", false, "Replace door", "24in x 80in", "$143", "");
addTask("Master bath", false, "Toilet", "", "$275", "");
addTask("Master bath", false, "Shower head system", "", "$330", "");
addTask("Master bath", false, "Light fixture", "", "$110", "");
addTask("Master bath", true, "Shower lights", "2 units @ $20/ea", "$44", "");
addTask("Master bath", false, "Towel rack set", "", "$66", "");
addTask("Master bath", false, "Door knob - locking", "", "$28", "");
addTask("Master bath", false, "Shower floor tile", "5ft x 3ft = 15 units @ $4/ea", "$66", "");
addTask("Master bath", false, "Over the toilet shelves", "", "$165", "");
addTask("Master bath", false, "Shower glass", "", "$5,500", "");

// Master bed
addTask("Master bed", false, "Flooring", "", "", "");
addTask("Master bed", true, "Build out closet", "", "", "");
addTask("Master bed", false, "Light fixture", "", "", "");
addTask("Master bed", false, "Paint", "48ft W x 8ft H", "", "");
addTask("Master bed", false, "Room door", "30in x 80in", "$165", "https://www.lowes.com/pd/American-Building-Supply-Primed-6-Panel-Hollow-Core-Molded-Composite-Pre-Hung-Door-Common-30-in-x-80-in-Actual-31-375-in-x-82-1875-in/1000098510");
addTask("Master bed", false, "Closet doors", "36in x 80in", "$114", "https://www.lowes.com/pd/ReliaBilt-36-in-x-80-in-White-6-Panel-Primed-Molded-Composite-Bifold-Door/5001892725");
addTask("Master bed", true, "Outlets", "", "", "");
addTask("Master bed", true, "Light switch", "", "", "");
addTask("Master bed", false, "Remove popcorn ceiling", "", "", "");
addTask("Master bed", false, "Closet flooring", "2ft x 10ft", "", "");
addTask("Master bed", false, "Door knob - locking", "", "$28", "");

// Library
addTask("Library", false, "Catalog books", "", "", "");
addTask("Library", false, "Paint", "", "", "");
addTask("Library", false, "Clean out closet", "", "", "");
addTask("Library", false, "Flooring", "", "", "");
addTask("Library", true, "Clean out desk", "", "", "");
addTask("Library", false, "Erase desktop", "", "", "");
addTask("Library", false, "Recycle e-waste", "", "", "");
addTask("Library", false, "Put up trim around door to garage", "", "", "");
addTask("Library", false, "Take down popcorn ceiling", "", "", "");
addTask("Library", false, "Room door", "30in x 80in", "$165", "");
addTask("Library", false, "Light fixture", "", "", "");
addTask("Library", false, "Outlets", "", "", "");
addTask("Library", false, "Light switches", "", "", "");
addTask("Library", false, "Install light switch by door to garage", "", "", "");
addTask("Library", false, "Door knob - locking", "", "$28", "");

// Office
addTask("Office", false, "Flooring", "", "", "");
addTask("Office", false, "Closet doors", "24in x 80in", "$106", "https://www.lowes.com/pd/ReliaBilt-Colonist-White-6-Panel-Molded-Composite-Bifold-Door-Common-24-in-x-80-in-Actual-23-5-in-x-79-in/1000221745");
addTask("Office", true, "Paint", "", "", "");
addTask("Office", false, "Room door", "30in x 80in", "$165", "");
addTask("Office", true, "Light fixture", "", "", "");
addTask("Office", false, "Door knob - locking", "", "$28", "");

// Hallway
addTask("Hallway", false, "Take down popcorn ceiling", "", "", "");
addTask("Hallway", false, "Paint", "", "", "");
addTask("Hallway", false, "Hinges for closet door", "2 units", "", "");
addTask("Hallway", true, "Paint linen closet interior", "", "", "");
addTask("Hallway", false, "Linen closet flooring", "", "", "");
addTask("Hallway", false, "Refinish flooring", "", "", "");
addTask("Hallway", false, "Light fixture", "", "", "");
addTask("Hallway", false, "Put trim back up around bathroom door", "", "", "");
addTask("Hallway", false, "Outlets", "", "", "");
addTask("Hallway", false, "Light switches", "", "", "");
addTask("Hallway", false, "Paint front of bathroom door", "", "", "");
addTask("Hallway", false, "Door knob - non-lock", "", "$22", "");
addTask("Hallway", false, "Door hinges (linen closet)", "", "$6", "");

// Living room
addTask("Living room", false, "Add can lights", "", "", "");
addTask("Living room", false, "Flooring", "", "", "");
addTask("Living room", false, "Refinish existing floor", "", "", "");
addTask("Living room", false, "Coat closet door", "24in x 80in", "$143", "https://www.lowes.com/pd/American-Building-Supply-Primed-6-Panel-Hollow-Core-Molded-Composite-Pre-Hung-Door-Common-24-in-x-80-in-Actual-25-375-in-x-82-1875-in/1000098494");
addTask("Living room", false, "Storm door", "", "$495", "https://www.lowes.com/pd/Pella-Rolscreen-White-Full-view-Aluminum-Storm-Door-Common-36-in-x-81-in-Actual-35-75-in-x-79-875-in/1000433539");
addTask("Living room", false, "Main door", "36in x 80in", "$440", "https://www.lowes.com/pd/American-Building-Supply-36-in-x-80-in-Steel-Left-Hand-Inswing-Primed-Fire-Rated-Prehung-Single-Front-Door-with-Brickmould/5001724965");
addTask("Living room", false, "Entry light fixture", "", "", "");
addTask("Living room", false, "Take down popcorn ceiling", "", "", "");
addTask("Living room", false, "Paint", "44ft W x 8ft H", "", "");
addTask("Living room", false, "Door knob - non-lock (coat closet)", "", "$22", "");

// Kitchen/Dining
addTask("Kitchen/Dining", false, "Pantry door", "24in x 80in", "$143", "");
addTask("Kitchen/Dining", false, "Dining light", "", "", "");
addTask("Kitchen/Dining", false, "Kitchen light", "", "", "");
addTask("Kitchen/Dining", false, "Sink light", "", "", "");
addTask("Kitchen/Dining", false, "Spice rack", "20in wide", "", "");
addTask("Kitchen/Dining", false, "Remove soffet", "", "", "");
addTask("Kitchen/Dining", false, "East side storm door", "32in x 80in", "", "");
addTask("Kitchen/Dining", false, "East side main door", "32in x 80in", "$407", "https://www.lowes.com/pd/ReliaBilt-32-in-x-80-in-Steel-Half-Lite-Left-Hand-Inswing-Primed-Prehung-Single-Front-Door-with-Brickmould/5001892933");
addTask("Kitchen/Dining", false, "Repair hole near east door", "", "", "");
addTask("Kitchen/Dining", false, "Over-the-range microwave", "", "", "");
addTask("Kitchen/Dining", false, "Upper cabinets", "", "", "");
addTask("Kitchen/Dining", false, "Base cabinets", "", "", "");
addTask("Kitchen/Dining", false, "Countertops", "", "", "");
addTask("Kitchen/Dining", false, "Re-enamel sink", "", "", "");
addTask("Kitchen/Dining", false, "Paint", "30ft W x 8ft H", "", "");
addTask("Kitchen/Dining", false, "Refinish floors", "", "", "");
addTask("Kitchen/Dining", false, "Door knob - non-lock (pantry)", "", "$22", "");

// Laundry/Workroom
addTask("Laundry/Workroom", false, "Remove refrigerator", "", "", "");
addTask("Laundry/Workroom", false, "Bring down draft table", "", "", "");
addTask("Laundry/Workroom", false, "Flooring", "", "", "");
addTask("Laundry/Workroom", false, "Close off one vent", "", "", "");
addTask("Laundry/Workroom", false, "Finish hose bib", "", "", "");

// Basement Living Area
addTask("Basement Living Area", false, "Bottom of stairs light", "", "", "");
addTask("Basement Living Area", false, "Flooring", "", "", "");
addTask("Basement Living Area", false, "Ceiling tiles", "", "", "");
addTask("Basement Living Area", false, "Paint drop ceiling rails", "", "", "");
addTask("Basement Living Area", false, "Sand and repaint patched holes", "", "", "");

// Basement bath
addTask("Basement bath", false, "Finish tile", "", "", "");
addTask("Basement bath", false, "Caulk ceiling in shower", "", "", "");
addTask("Basement bath", false, "Sand and paint repaired holes", "", "", "");
addTask("Basement bath", false, "Install missing baseboards", "", "", "");
addTask("Basement bath", false, "Regrout floor", "", "", "");

// Basement north bedroom
addTask("Basement north bedroom", false, "Flooring", "", "", "");
addTask("Basement north bedroom", false, "Light fixture", "", "", "");

// Basement south bedroom
addTask("Basement south bedroom", false, "Flooring", "", "", "");
addTask("Basement south bedroom", false, "Light fixture", "", "", "");
addTask("Basement south bedroom", false, "Paint", "", "", "");
addTask("Basement south bedroom", false, "Wallpaper", "", "", "");
addTask("Basement south bedroom", false, "Finish painting shutter", "", "", "");

// Exterior
addTask("Exterior", false, "Paint and siding repair", "", "", "");
addTask("Exterior", false, "Replace east side fence", "", "", "");
addTask("Exterior", false, "Remove compost", "", "", "");
addTask("Exterior", false, "Rocks - north fence", "", "", "");
addTask("Exterior", false, "Rocks - east fence", "", "", "");
addTask("Exterior", false, "Edging", "", "", "");
addTask("Exterior", false, "Door for east side shed", "", "", "");
addTask("Exterior", false, "Doors for main shed", "", "", "");
addTask("Exterior", false, "Gravel - west side, sidewalk to shed", "", "", "");
addTask("Exterior", false, "Junk removal", "", "", "");
addTask("Exterior", false, "Stump removal", "", "", "");
addTask("Exterior", false, "Down gutters", "", "", "");
addTask("Exterior", false, "Plant flower garden under main window", "", "", "");
addTask("Exterior", false, "Plant vines on garage side", "", "", "");
addTask("Exterior", false, "Garage window", "", "", "");
addTask("Exterior", false, "Repair west gates", "", "", "");
addTask("Exterior", false, "Privacy slats for chain link gate", "", "", "");
addTask("Exterior", false, "Roof for east side shed", "", "", "");

// Miscellaneous
addTask("Miscellaneous", false, "Get vents cleaned", "", "", "");
addTask("Miscellaneous", false, "Attic - blow-in insulation", "", "", "");
addTask("Miscellaneous", true, "Replace water heater", "", "", "");
addTask("Miscellaneous", true, "Install a/c", "", "", "");

// ---------- Build notes and seed ----------

function buildNotes(task: RawTask): string {
  const parts: string[] = [];
  if (task.measurements) parts.push(task.measurements);
  if (task.budget) parts.push(`Est: ${task.budget}`);
  if (task.productLink) parts.push(task.productLink);
  return parts.join(" | ");
}

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Clear existing renovation tasks before re-seeding
  const rooms = Array.from(new Set(tasks.map((t) => t.room)));
  const deleted = await TodoItem.deleteMany({
    category: "Home",
    subcategory: { $in: rooms },
  });
  if (deleted.deletedCount > 0) {
    console.log(`Cleared ${deleted.deletedCount} existing Home renovation tasks`);
  }

  const docs = tasks.map((task) => ({
    title: task.title,
    notes: buildNotes(task),
    category: "Home",
    subcategory: task.room,
    isProject: false,
    completed: task.completed,
  }));

  const result = await TodoItem.insertMany(docs);
  console.log(`Seeded ${result.length} renovation tasks across ${new Set(tasks.map((t) => t.room)).size} rooms`);

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

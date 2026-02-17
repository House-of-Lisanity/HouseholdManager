import mongoose, { Schema, Document } from "mongoose";

export interface IRecurringItem extends Document {
  title: string;
  notes: string;
  category: string;
  subcategory?: string;
  frequency: string;
  location?: string;
  lastCompletedDate?: string;
  active: boolean;
  updatedAt: Date;
}

const RecurringItemSchema = new Schema<IRecurringItem>(
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

RecurringItemSchema.index({ active: 1, category: 1 });

export default mongoose.models.RecurringItem ||
  mongoose.model<IRecurringItem>("RecurringItem", RecurringItemSchema);

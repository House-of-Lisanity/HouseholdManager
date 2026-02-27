import mongoose, { Schema, Document } from "mongoose";

export interface ITodoItem extends Document {
  userId: string;
  title: string;
  notes: string;
  category: string;
  subcategory?: string;
  isProject: boolean;
  location?: string;
  weeklyPriority?: string;
  weeklyHoursMax?: number;
  taggedForWeek?: string;
  completed: boolean;
  completedAt?: string;
  updatedAt: Date;
}

const TodoItemSchema = new Schema<ITodoItem>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Home", "Health & Fitness", "Finance", "Personal", "Errands"],
      required: true,
    },
    subcategory: { type: String },
    isProject: { type: Boolean, default: false },
    location: { type: String },
    weeklyPriority: {
      type: String,
      enum: ["must", "want", "if_time"],
    },
    weeklyHoursMax: { type: Number },
    taggedForWeek: { type: String },
    completed: { type: Boolean, default: false },
    completedAt: { type: String },
  },
  { timestamps: true }
);

TodoItemSchema.index({ completed: 1, category: 1 });

export default mongoose.models.TodoItem ||
  mongoose.model<ITodoItem>("TodoItem", TodoItemSchema);

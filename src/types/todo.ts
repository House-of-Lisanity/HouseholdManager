export type TodoCategory =
  | "Home"
  | "Health & Fitness"
  | "Finance"
  | "Personal"
  | "Errands";

export type HomeRoom =
  | "Kitchen"
  | "Bathroom"
  | "Bedroom"
  | "Living Room"
  | "Office"
  | "Garage"
  | "Yard"
  | "Other";

export type WeeklyPriority = "must" | "want" | "if_time";

export type RecurringFrequency = "weekly" | "biweekly" | "monthly" | "quarterly";

export interface TodoItem {
  _id?: string;
  title: string;
  notes: string;
  category: TodoCategory;
  subcategory?: string;
  isProject: boolean;
  location?: string;
  weeklyPriority?: WeeklyPriority;
  weeklyHoursMax?: number;
  taggedForWeek?: string;
  completed: boolean;
  completedAt?: string;
}

export interface RecurringTask {
  _id?: string;
  title: string;
  notes: string;
  category: TodoCategory;
  subcategory?: string;
  frequency: RecurringFrequency;
  location?: string;
  lastCompletedDate?: string;
  active: boolean;
}

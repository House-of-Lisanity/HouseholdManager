export interface WorkoutEntry {
  id: string;
  workoutType: string;
  location: string;
  day: string;
  pinnedToDay: boolean;
  startTime?: string;
  endTime?: string;
  details: string;
  notes: string;
}

export interface LiftMax {
  liftName: string;
  weight: string;
}

export interface EventNight {
  day: string;
  isEvent: boolean;
  drinkNote: string;
}

import { WorkoutsPlanResult } from "@/types";

export const MOCK_WORKOUTS_RESULT: WorkoutsPlanResult = {
  weekOf: "2026-02-22",
  workoutSummary:
    "5 training days + 1 active recovery + 1 rest. Focus: glutes and posterior chain. 3 CrossFit WODs, 2 lifting sessions.",
  dailyWorkouts: [
    {
      day: "Sunday",
      workoutType: "CrossFit WOD",
      location: "CrossFit Box",
      workoutDetails:
        "AMRAP 20 min:\n10 deadlifts (135/95)\n15 box jumps (20\")\n20 wall balls (14/10)\n200m run",
      focusAreas: "Full body conditioning, posterior chain",
      aiNotes: "Scale deadlifts to 95 if form breaks down on later rounds.",
    },
    {
      day: "Monday",
      workoutType: "Lifting",
      location: "Gym",
      workoutDetails:
        "Lower Body:\nBack squats 5x5 @ 135\nRomanian deadlifts 4x10 @ 95\nHip thrusts 4x12 @ 135\nWalking lunges 3x12 each leg\nCalf raises 3x15",
      focusAreas: "Glutes, Hamstrings, Quads",
      aiNotes: "Increase squat weight by 5 lbs if all sets are clean.",
    },
    {
      day: "Tuesday",
      workoutType: "Cardio",
      location: "Gym",
      workoutDetails:
        "30 min incline treadmill walk (3.5 mph, 10% incline)\n15 min stairmaster (level 6)\n5 min cooldown walk",
      focusAreas: "Active recovery cardio, fat burn zone",
    },
    {
      day: "Wednesday",
      workoutType: "CrossFit WOD",
      location: "CrossFit Box",
      workoutDetails:
        "For time:\n21-15-9\nThrusters (65/45)\nPull-ups\nThen: 3 rounds\n10 KB swings (53/35)\n10 burpees",
      focusAreas: "Upper body push/pull, conditioning",
      aiNotes:
        "Use a band for pull-ups if needed. Keep thrusters light and focus on cycling speed.",
    },
    {
      day: "Thursday",
      workoutType: "Lifting",
      location: "Gym",
      workoutDetails:
        "Upper Body:\nBench press 4x8 @ 85\nBent-over rows 4x10 @ 75\nOverhead press 3x8 @ 55\nFace pulls 3x15\nBicep curls 3x12\nTricep dips 3x10",
      focusAreas: "Chest, Back, Shoulders",
    },
    {
      day: "Friday",
      workoutType: "CrossFit WOD",
      location: "CrossFit Box",
      workoutDetails:
        "Partner WOD:\n100 cal row (split)\n80 wall balls (14/10)\n60 T2B\n40 clean & jerks (95/65)\n20 muscle-ups (scale: C2B pull-ups)",
      focusAreas: "Full body, teamwork, pacing",
      aiNotes: "Great way to end the training week — push the pace on the row.",
    },
    {
      day: "Saturday",
      workoutType: "Rest / Active Recovery",
      location: "Home",
      workoutDetails:
        "Light stretching — 15 min\nFoam rolling — focus on quads, glutes, upper back\n20 min easy walk outside",
      focusAreas: "Mobility, Recovery",
      aiNotes: "Full rest if feeling beat up from the week. Listen to your body.",
    },
  ],
};

import { WorkoutsFormInput, UserProfile, WorkoutEntry } from "@/types";

function formatWorkoutEntries(workouts: WorkoutEntry[]): string {
  if (workouts.length === 0) return "No workouts specified.";

  const pinned = workouts.filter((w) => w.pinnedToDay && w.day);
  const available = workouts.filter((w) => !w.pinnedToDay || !w.day);

  const formatEntry = (w: WorkoutEntry): string => {
    let line = `- ${w.workoutType} at ${w.location}`;
    if (w.day) line += ` (${w.day})`;
    if (w.startTime && w.endTime) line += ` ${w.startTime}-${w.endTime}`;
    if (w.pinnedToDay) line += " [PINNED]";
    if (w.details) line += `\n    Details: ${w.details}`;
    if (w.notes) line += `\n    Notes: ${w.notes}`;
    return line;
  };

  let output = "";
  if (pinned.length > 0) {
    output += "PINNED WORKOUTS (keep on assigned day):\n";
    output += pinned.map(formatEntry).join("\n") + "\n";
  }
  if (available.length > 0) {
    output += "\nAVAILABLE WORKOUTS (AI assigns day):\n";
    output += available.map(formatEntry).join("\n") + "\n";
  }
  return output;
}

function formatEquipment(profile: UserProfile): string {
  const sections: string[] = [];

  if (profile.gymEquipment.length > 0) {
    sections.push(`Gym: ${profile.gymEquipment.join(", ")}`);
  }
  if (profile.homeEquipment.length > 0) {
    sections.push(`Home: ${profile.homeEquipment.join(", ")}`);
  }
  if (profile.crossfitEquipment.length > 0) {
    sections.push(`CrossFit box: ${profile.crossfitEquipment.join(", ")}`);
  }

  return sections.length > 0
    ? sections.join("\n")
    : "Standard gym and CrossFit equipment available.";
}

function formatBodyStats(profile: UserProfile): string {
  const stats: string[] = [];
  if (profile.height) stats.push(`Height: ${profile.height}`);
  if (profile.weight) stats.push(`Weight: ${profile.weight}`);
  if (profile.trainingAge) stats.push(`Training age: ${profile.trainingAge}`);

  const measurements: string[] = [];
  if (profile.hipMeasurement) measurements.push(`Hip: ${profile.hipMeasurement}`);
  if (profile.waistMeasurement) measurements.push(`Waist: ${profile.waistMeasurement}`);
  if (profile.chestMeasurement) measurements.push(`Chest: ${profile.chestMeasurement}`);
  if (profile.thighMeasurement) measurements.push(`Thigh: ${profile.thighMeasurement}`);
  if (profile.armMeasurement) measurements.push(`Arm: ${profile.armMeasurement}`);

  if (measurements.length > 0) {
    stats.push(`Measurements: ${measurements.join(", ")}`);
  }

  return stats.length > 0 ? stats.join("\n") : "No body stats provided.";
}

function formatLiftMaxes(maxes: UserProfile["liftMaxes"]): string {
  if (maxes.length === 0) return "No lift maxes recorded.";
  return maxes.map((m) => `- ${m.liftName}: ${m.weight}`).join("\n");
}

export function buildWorkoutsPrompt(
  formData: WorkoutsFormInput,
  weekOf: string,
  profile: UserProfile
): string {
  const workoutsText = formatWorkoutEntries(formData.workouts || []);
  const equipmentText = formatEquipment(profile);
  const bodyStatsText = formatBodyStats(profile);
  const liftMaxesText = formatLiftMaxes(profile.liftMaxes);

  return `You are a workout programming assistant for someone who is 48 years old, female, in menopause, 10 years post-gastric bypass surgery. She lifts heavy weights and does CrossFit 5+ days per week. Her goals are to build muscle and lose fat.

WORKOUT PLAN REQUEST:
Week of: ${weekOf}

${formData.weeklyFocus ? `WEEKLY FOCUS:\n${formData.weeklyFocus}\n` : ""}
===== SCHEDULED WORKOUTS =====

${workoutsText}

===== EQUIPMENT AVAILABLE =====

${equipmentText}

===== BODY STATS =====

${bodyStatsText}

===== LIFT MAXES =====

${liftMaxesText}

===== GOALS & LIMITATIONS =====

${profile.fitnessGoals ? `Goals: ${profile.fitnessGoals}` : "Goals: Build muscle, lose fat, improve CrossFit performance"}
${profile.injuriesLimitations ? `Injuries/Limitations: ${profile.injuriesLimitations}` : "No injuries or limitations noted."}

===== INSTRUCTIONS =====

1. PROGRAMMING RULES:
   - Respect pinned workouts — keep them on their assigned day exactly
   - Assign available workouts to appropriate days based on recovery and balance
   - Program intelligently based on available equipment at each location
   - Balance intensity throughout the week (don't stack heavy days)
   - Consider recovery needs — especially important for post-menopausal athletes
   - Include warm-up and cool-down guidance in workout details
   - For CrossFit WODs, provide specific movements, rep schemes, and time domains
   - For lifting days, specify exercises, sets, reps, and percentage of max when applicable

2. REST & RECOVERY:
   - Include at least 1 rest or active recovery day
   - After heavy lifting days, schedule lighter work or different muscle groups
   - Consider sleep and stress impact on recovery

OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "weekOf": "${weekOf}",
  "workoutSummary": "Brief 2-3 sentence overview of the week's training focus and approach",
  "dailyWorkouts": [
    {
      "day": "Sunday",
      "workoutType": "CrossFit WOD",
      "location": "CrossFit Box",
      "workoutDetails": "Detailed workout description with movements, reps, sets, time domain",
      "focusAreas": "Primary muscle groups or skills targeted",
      "aiNotes": "Optional coaching notes, scaling options, or recovery tips"
    }
  ]
}

Include all 7 days (Sunday through Saturday) in dailyWorkouts.
For rest days, set workoutType to "Rest" or "Active Recovery" and provide appropriate details.

Return ONLY the JSON object, no other text.`;
}

import { WeeklyTemplate } from '@/types';

export const WEEKLY_TEMPLATE: WeeklyTemplate = {
  file_name: "Weekly Meal Planning Template",
  sheets: [
    {
      name: "Week Overview",
      rows: [
        ["Week of:", "MM/DD/YYYY"],
        [""],
        ["TOVALA MEALS (4 dinners)"],
        ["Day", "Meal Name", "Protein (g)", "Calories", "Notes"],
        ["Monday", "", "", "", ""],
        ["Wednesday", "", "", "", ""],
        ["Friday", "", "", "", ""],
        ["Sunday", "", "", "", ""],
        [""],
        ["WORKOUT SCHEDULE (5+ days/week, alternating Lifting & CrossFit)"],
        [
          "Day",
          "Workout Type",
          "Workout Details / WOD",
          "Post-Workout Protein Goal"
        ],
        ["Monday", "Lifting / CrossFit", "", "25-30g within 1-2 hrs"],
        ["Tuesday", "Lifting / CrossFit", "", "25-30g within 1-2 hrs"],
        ["Wednesday", "Rest or Light", "", ""],
        ["Thursday", "Lifting / CrossFit", "", "25-30g within 1-2 hrs"],
        ["Friday", "Lifting / CrossFit", "", "25-30g within 1-2 hrs"],
        ["Saturday", "Lifting / CrossFit", "", "25-30g within 1-2 hrs"],
        ["Sunday", "Rest or Light", "", ""],
        [""],
        ["DAILY TARGETS"],
        ["Target Daily Protein (g):", "110"],
        ["Target Daily Calories:", "Flex (not strict)"],
        ["Daily Alcohol:", "1 drink (optional)"],
        [""],
        ["NOTES / PREFERENCES THIS WEEK"],
        ["Any foods to avoid?", ""],
        ["Any cravings or preferences?", ""],
        ["Any schedule conflicts (eating out, events)?", ""]
      ]
    },
    {
      name: "Snack & Breakfast Ideas",
      rows: [
        ["SALTY/SAVORY HIGH-PROTEIN SNACKS (20-30g protein each)"],
        ["Snack Option", "Protein (g)", "Calories", "Prep Time"],
        [
          "Cheese + deli turkey roll-ups (2-3 oz cheese, 3 slices turkey)",
          "25-28",
          "150-170",
          "2 min"
        ],
        [
          "Greek yogurt (5-6 oz) + 1/4 cup almonds",
          "20-22",
          "180-200",
          "1 min"
        ],
        [
          "Cottage cheese (1 cup) + salted nuts (small handful)",
          "28-30",
          "200-220",
          "1 min"
        ],
        ["Jerky (2-3 oz) + small handful almonds", "24-28", "160-180", "0 min"],
        [
          "Cheese board: 2 oz cheese + 1 oz nuts + cured meat",
          "22-26",
          "200-220",
          "3 min"
        ],
        ["String cheese (2) + handful almonds", "20-22", "180-200", "0 min"],
        [
          "Tuna salad (4 oz can, mayo-based) on small plate",
          "20",
          "150-180",
          "2 min"
        ],
        [
          "Rotisserie chicken (2 oz) + 2 oz cheese",
          "28-30",
          "190-210",
          "1 min"
        ],
        [""],
        ["BREAKFAST/BREAKFAST-LIKE OPTIONS (25-30g protein each)"],
        ["Option", "Protein (g)", "Calories", "Prep Time"],
        ["2 eggs + 2 slices bacon or sausage", "25-28", "200-230", "10 min"],
        [
          "Greek yogurt (6 oz) + granola (2 tbsp) + small drizzle honey",
          "20-22",
          "180-200",
          "2 min"
        ],
        [
          "Cottage cheese (1 cup) + 1/4 cup granola",
          "28-30",
          "220-240",
          "1 min"
        ],
        [
          "Protein shake (whey protein powder 1 scoop + milk or almond milk)",
          "25-30",
          "150-200",
          "2 min"
        ],
        [
          "Deli meat + cheese + small whole grain crackers",
          "22-25",
          "180-200",
          "3 min"
        ],
        [
          "Leftover Tovala meal or previous night's dinner",
          "varies",
          "varies",
          "0 min"
        ]
      ]
    },
    {
      name: "Simple Dinner Ideas (Non-Tovala)",
      rows: [
        ["SIMPLE 2-PERSON DINNERS (high protein, minimal leftovers)"],
        [
          "Dinner Idea",
          "Protein Source",
          "Typical Protein (g)",
          "Est. Prep Time",
          "Notes"
        ],
        [
          "Grilled chicken breast + roasted potatoes",
          "Chicken breast 4-6 oz",
          "35-40",
          "20 min",
          "Portion: 3-4 oz chicken, small side"
        ],
        [
          "Ground beef tacos (small corn tortillas, 2-3 each)",
          "Lean ground beef 4 oz",
          "28-30",
          "15 min",
          "Load with cheese, salsa, no veggies needed"
        ],
        [
          "Pan-seared salmon + asparagus",
          "Salmon fillet 4-5 oz",
          "32-35",
          "15 min",
          "Portion: 3 oz salmon"
        ],
        [
          "Pork chops + roasted carrots",
          "Pork chop 4-5 oz",
          "30-34",
          "20 min",
          "Choose thicker chops to portion smaller"
        ],
        [
          "Steak (sirloin or ribeye) + baked potato",
          "Steak 4-6 oz",
          "35-40",
          "20 min",
          "Portion: 2.5-3 oz per person"
        ],
        [
          "Rotisserie chicken + rice pilaf",
          "Rotisserie chicken 4 oz",
          "32-36",
          "10 min",
          "Buy whole bird, easy 2-person portions"
        ],
        [
          "Turkey burger + cheese + small bun",
          "Ground turkey patty 4 oz",
          "26-28",
          "12 min",
          "Add cheese for extra fat/satiety"
        ],
        [
          "Shrimp stir-fry (butter/olive oil base, no veggies)",
          "Shrimp 4-5 oz",
          "28-32",
          "15 min",
          "Pair with rice or noodles for quick fill"
        ],
        [
          "Meatballs (beef or pork) + pasta with butter/cheese",
          "Frozen or fresh meatballs 4-6 ea.",
          "28-32",
          "15 min",
          "Use good-quality meatballs; small portion pasta"
        ],
        [
          "Baked white fish (cod, tilapia) + rice + butter",
          "Fish fillet 4-5 oz",
          "28-32",
          "20 min",
          "Simple; butter adds flavor, calories"
        ]
      ]
    },
    {
      name: "Drink Options",
      rows: [
        ["DAILY DRINK OPTIONS (1 per day, optional)"],
        ["Drink", "Size", "Calories", "Alcohol Content", "Notes"],
        [
          "Red or white wine",
          "5 oz glass",
          "110-130",
          "~12% ABV",
          "Default choice; most compatible with dinner"
        ],
        [
          "Hard seltzer (White Claw, Truly, etc.)",
          "12 oz can",
          "80-100",
          "~5% ABV",
          "Low calorie; good for events like Nuggets games"
        ],
        [
          "Rum and diet Coke",
          "1.5 oz rum + diet Coke",
          "60-100",
          "~15% ABV",
          "Much lower cal than regular Coke version"
        ],
        [
          "Vodka martini (straight up, vermouth)",
          "3 oz total",
          "120-150",
          "~20% ABV",
          "Higher ABV; strong effect due to bypass"
        ],
        [
          "Spiked Arnold Palmer",
          "12 oz can or homemade",
          "100-150",
          "~5% ABV",
          "Popular at Denver events"
        ],
        [
          "Light beer",
          "12 oz can",
          "80-100",
          "~4-5% ABV",
          "If you want beer instead"
        ],
        [""],
        ["IMPORTANT REMINDERS"],
        [
          "• After gastric bypass, alcohol is absorbed much faster = higher blood alcohol per drink",
          ""
        ],
        ["• Never drive after drinking, even one drink", ""],
        [
          "• Stay within 1 drink per day; risk of alcohol use disorder is elevated post-surgery",
          ""
        ],
        ["• Count drink calories toward your daily total", ""]
      ]
    }
  ]
};

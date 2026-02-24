import React, { useState } from "react";
import { MealEntry, NutritionInfo } from "@/types";
import { generateId, DAYS_SUNDAY_START, MEAL_SLOTS } from "@/lib/constants";
import { parseRecipeUrl, estimateNutrition } from "@/lib/api-client";
import { parseNutritionLabel } from "@/lib/nutrition-label-parser";

interface MealEntryFormProps {
  onSave: (entry: MealEntry) => void;
  onCancel: () => void;
}

const INITIAL_ENTRY: Partial<MealEntry> = {
  mealSlot: "Dinner",
  day: "",
  pinnedToDay: false,
  recipeUrl: "",
  ingredients: "",
  notes: "",
};

function buildMeal(
  draft: Partial<MealEntry>,
  nutrition: NutritionInfo
): MealEntry {
  const hasNutrition = Object.values(nutrition).some((v) => v);
  return {
    id: generateId("meal"),
    mealName: draft.mealName!.trim(),
    mealSlot: draft.mealSlot || "Dinner",
    day: draft.day || "",
    pinnedToDay: draft.pinnedToDay || false,
    recipeUrl: draft.recipeUrl || undefined,
    nutrition: hasNutrition ? nutrition : undefined,
    ingredients: draft.ingredients || undefined,
    notes: draft.notes || undefined,
  };
}

function isValid(draft: Partial<MealEntry>): boolean {
  return !!draft.mealName?.trim();
}

export default function MealEntryForm({
  onSave,
  onCancel,
}: MealEntryFormProps) {
  const [entry, setEntry] = useState<Partial<MealEntry>>(INITIAL_ENTRY);
  const [nutrition, setNutrition] = useState<NutritionInfo>({});
  const [fetching, setFetching] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [nutritionLabelText, setNutritionLabelText] = useState("");
  const [parseMessage, setParseMessage] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [estimateMessage, setEstimateMessage] = useState("");
  const [pending, setPending] = useState<MealEntry[]>([]);

  const resetForm = () => {
    setEntry({ ...INITIAL_ENTRY });
    setNutrition({});
    setFetchMessage("");
    setNutritionLabelText("");
    setParseMessage("");
    setEstimateMessage("");
  };

  const updateNutrition = (field: keyof NutritionInfo, value: string) => {
    setNutrition((prev) => ({ ...prev, [field]: value }));
  };

  const handleFetchNutrition = async () => {
    if (!entry.recipeUrl) return;
    setFetching(true);
    setFetchMessage("");

    try {
      const result = await parseRecipeUrl(entry.recipeUrl);
      setNutrition({
        calories: result.calories || "",
        protein: result.protein || "",
        carbs: result.carbs || "",
        fat: result.fat || "",
        servings: result.servings || "",
      });
      if (result.ingredients?.length) {
        setEntry((prev) => ({
          ...prev,
          ingredients: result.ingredients!.join(", "),
        }));
      }
      if (result.title && !entry.mealName) {
        setEntry((prev) => ({ ...prev, mealName: result.title }));
      }
      setFetchMessage("Nutrition data loaded");
    } catch {
      setFetchMessage("Could not extract nutrition — enter manually");
    } finally {
      setFetching(false);
    }
  };

  const handleEstimateFromIngredients = async () => {
    if (!entry.ingredients?.trim()) return;
    setEstimateMessage("");

    const parsed = parseNutritionLabel(entry.ingredients);
    if (parsed) {
      setNutrition({
        calories: parsed.nutrition.calories || "",
        protein: parsed.nutrition.protein || "",
        carbs: parsed.nutrition.carbs || "",
        fat: parsed.nutrition.fat || "",
      });
      if (parsed.mealName && !entry.mealName) {
        setEntry((prev) => ({ ...prev, mealName: parsed.mealName }));
      }
      setEstimateMessage("Nutrition data loaded");
      return;
    }

    setEstimating(true);
    try {
      const result = await estimateNutrition(entry.ingredients);
      setNutrition({
        calories: result.calories || "",
        protein: result.protein || "",
        carbs: result.carbs || "",
        fat: result.fat || "",
      });
      setEstimateMessage("Nutrition estimated");
    } catch {
      setEstimateMessage(
        "Nutrition estimation unavailable — enter manually"
      );
    } finally {
      setEstimating(false);
    }
  };

  const handleParseLabel = () => {
    if (!nutritionLabelText.trim()) return;
    setParseMessage("");

    const parsed = parseNutritionLabel(nutritionLabelText);
    if (parsed) {
      setNutrition({
        calories: parsed.nutrition.calories || "",
        protein: parsed.nutrition.protein || "",
        carbs: parsed.nutrition.carbs || "",
        fat: parsed.nutrition.fat || "",
      });
      if (parsed.mealName && !entry.mealName) {
        setEntry((prev) => ({ ...prev, mealName: parsed.mealName }));
      }
      setParseMessage("Nutrition data loaded");
    } else {
      setParseMessage("Could not parse — enter nutrition manually");
    }
  };

  const handleAddAnother = () => {
    if (!isValid(entry)) return;
    setPending((prev) => [...prev, buildMeal(entry, nutrition)]);
    resetForm();
  };

  const handleSave = () => {
    const all = [...pending];
    if (isValid(entry)) {
      all.push(buildMeal(entry, nutrition));
    }
    if (all.length === 0) return;
    all.forEach((item) => onSave(item));
    onCancel();
  };

  const removePending = (index: number) => {
    setPending((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="add-form">
      {pending.length > 0 && (
        <ul className="add-form__pending">
          {pending.map((item, i) => (
            <li key={i}>
              <span>
                {item.mealName} ({item.mealSlot}
                {item.day ? ` · ${item.day}` : ""})
              </span>
              <button
                type="button"
                onClick={() => removePending(i)}
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="meal-name">Meal Name</label>
          <input
            id="meal-name"
            type="text"
            placeholder="e.g., Chicken stir fry"
            value={entry.mealName || ""}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, mealName: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-slot">Meal Slot</label>
          <select
            id="meal-slot"
            value={entry.mealSlot}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, mealSlot: e.target.value }))
            }
          >
            {MEAL_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="meal-day">Day</label>
          <select
            id="meal-day"
            value={entry.day}
            onChange={(e) =>
              setEntry((prev) => ({
                ...prev,
                day: e.target.value,
                pinnedToDay: e.target.value ? prev.pinnedToDay : false,
              }))
            }
          >
            <option value="">Any Day</option>
            {DAYS_SUNDAY_START.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {entry.day && (
          <div className="form-group">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={entry.pinnedToDay || false}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    pinnedToDay: e.target.checked,
                  }))
                }
              />
              <span>Pin to this day</span>
            </label>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="meal-url">Recipe URL (optional)</label>
        <div className="fetch-nutrition-row">
          <input
            id="meal-url"
            type="text"
            placeholder="https://..."
            value={entry.recipeUrl || ""}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, recipeUrl: e.target.value }))
            }
          />
          <button
            type="button"
            className="fetch-button"
            onClick={handleFetchNutrition}
            disabled={!entry.recipeUrl || fetching}
          >
            {fetching ? "Fetching..." : "Fetch Nutrition"}
          </button>
        </div>
        {fetchMessage && <p className="fetch-status">{fetchMessage}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="meal-ingredients">Ingredients</label>
        <div className="fetch-nutrition-row">
          <textarea
            id="meal-ingredients"
            placeholder="e.g., chicken breast, broccoli, rice-a-roni"
            value={entry.ingredients || ""}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, ingredients: e.target.value }))
            }
            rows={3}
          />
          <button
            type="button"
            className="fetch-button"
            onClick={handleEstimateFromIngredients}
            disabled={!entry.ingredients?.trim() || estimating}
          >
            {estimating ? "Estimating..." : "Estimate Nutrition"}
          </button>
        </div>
        {estimateMessage && (
          <p className="fetch-status">{estimateMessage}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="meal-nutrition-label">
          Paste Nutrition Label (optional)
        </label>
        <div className="fetch-nutrition-row">
          <textarea
            id="meal-nutrition-label"
            placeholder="Paste nutrition info from a label or website..."
            value={nutritionLabelText}
            onChange={(e) => setNutritionLabelText(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            className="fetch-button"
            onClick={handleParseLabel}
            disabled={!nutritionLabelText.trim()}
          >
            Read Label
          </button>
        </div>
        {parseMessage && <p className="fetch-status">{parseMessage}</p>}
      </div>

      <div className="form-grid form-grid--nutrition">
        <div className="form-group">
          <label htmlFor="meal-calories">Calories</label>
          <input
            id="meal-calories"
            type="text"
            placeholder="e.g., 320"
            value={nutrition.calories || ""}
            onChange={(e) => updateNutrition("calories", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-protein">Protein (g)</label>
          <input
            id="meal-protein"
            type="text"
            placeholder="e.g., 28"
            value={nutrition.protein || ""}
            onChange={(e) => updateNutrition("protein", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-carbs">Carbs (g)</label>
          <input
            id="meal-carbs"
            type="text"
            placeholder="e.g., 15"
            value={nutrition.carbs || ""}
            onChange={(e) => updateNutrition("carbs", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-fat">Fat (g)</label>
          <input
            id="meal-fat"
            type="text"
            placeholder="e.g., 12"
            value={nutrition.fat || ""}
            onChange={(e) => updateNutrition("fat", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="meal-notes">Notes</label>
        <input
          id="meal-notes"
          type="text"
          placeholder="Any additional notes..."
          value={entry.notes || ""}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      <div className="form-buttons">
        <button
          type="button"
          className="add-another-button"
          onClick={handleAddAnother}
        >
          + Add Another
        </button>
        <button type="button" className="save-button" onClick={handleSave}>
          Save{pending.length > 0 ? ` (${pending.length + (isValid(entry) ? 1 : 0)})` : ""}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

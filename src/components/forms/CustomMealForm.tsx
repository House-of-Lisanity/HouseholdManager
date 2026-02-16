import React, { useState } from 'react';
import { CustomMeal } from '@/types';
import { DAYS_MONDAY_START, generateId } from '@/lib/constants';

interface CustomMealFormProps {
  onSave: (meal: CustomMeal) => void;
  onCancel: () => void;
}

export default function CustomMealForm({ onSave, onCancel }: CustomMealFormProps) {
  const [meal, setMeal] = useState<Partial<CustomMeal>>({
    preferredDay: 'Any day',
    ingredientsList: ''
  });

  const handleSave = () => {
    if (meal.mealName && meal.ingredientsList) {
      onSave({
        ...meal,
        id: generateId('meal'),
        preferredDay: meal.preferredDay || 'Any day'
      } as CustomMeal);
    }
  };

  return (
    <div className="add-form">
      <input
        type="text"
        placeholder="Meal name"
        value={meal.mealName || ''}
        onChange={(e) => setMeal(prev => ({ ...prev, mealName: e.target.value }))}
      />
      
      <select 
        value={meal.preferredDay} 
        onChange={(e) => setMeal(prev => ({ ...prev, preferredDay: e.target.value }))}
      >
        <option value="Any day">Any day</option>
        {DAYS_MONDAY_START.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      
      <input
        type="text"
        placeholder="Recipe link (optional)"
        value={meal.recipeLink || ''}
        onChange={(e) => setMeal(prev => ({ ...prev, recipeLink: e.target.value }))}
      />
      
      <textarea
        placeholder="Ingredients (comma-separated)"
        value={meal.ingredientsList || ''}
        onChange={(e) => setMeal(prev => ({ ...prev, ingredientsList: e.target.value }))}
        rows={3}
      />
      
      <div className="form-buttons">
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

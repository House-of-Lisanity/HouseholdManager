import React, { useState } from 'react';
import { CustomMeal } from '@/types';
import FormSection from '../shared/FormSection';
import ListItem from '../shared/ListItem';
import CustomMealForm from '../forms/CustomMealForm';

interface CustomMealsSectionProps {
  meals: CustomMeal[];
  onUpdate: (meals: CustomMeal[]) => void;
}

export default function CustomMealsSection({ meals, onUpdate }: CustomMealsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (meal: CustomMeal) => {
    onUpdate([...meals, meal]);
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onUpdate(meals.filter((_, idx) => idx !== index));
  };

  return (
    <FormSection title="Custom Meals">
      {meals.map((meal, i) => (
        <ListItem key={i} onRemove={() => handleRemove(i)}>
          <strong>{meal.mealName}</strong> (Preferred: {meal.preferredDay})
        </ListItem>
      ))}
      
      {!showForm && (
        <button 
          type="button" 
          className="add-button" 
          onClick={() => setShowForm(true)}
        >
          + Add Custom Meal
        </button>
      )}
      
      {showForm && (
        <CustomMealForm 
          onSave={handleAdd} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </FormSection>
  );
}

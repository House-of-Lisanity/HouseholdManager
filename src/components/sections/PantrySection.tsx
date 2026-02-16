import React, { useState } from 'react';
import { PantryItem } from '@/types';
import FormSection from '../shared/FormSection';
import ListItem from '../shared/ListItem';
import PantryForm from '../forms/PantryForm';

const PANTRY_CATEGORIES = [
  { value: "dry_goods", label: "Dry Goods" },
  { value: "frozen", label: "Frozen" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "spices", label: "Spices" },
] as const;

interface PantrySectionProps {
  items: PantryItem[];
  onUpdate: (items: PantryItem[]) => void;
}

export default function PantrySection({ items, onUpdate }: PantrySectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (item: PantryItem) => {
    onUpdate([...items, item]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  return (
    <FormSection title="Pantry">
      {items.length > 0 && PANTRY_CATEGORIES.map(cat => {
        const categoryItems = items.filter(i => i.category === cat.value);

        if (categoryItems.length === 0) return null;

        return (
          <div key={cat.value} className="pantry-category">
            <h3>{cat.label}</h3>
            {categoryItems.map(item => (
              <ListItem
                key={item.id}
                onRemove={() => handleRemove(item.id)}
                className={item.expiresInDays !== undefined && item.expiresInDays <= 3 ? 'expiring' : ''}
              >
                <strong>{item.name}</strong>
                {item.quantity && <span> ({item.quantity}{item.unit ? ` ${item.unit}` : ""})</span>}
                {item.expiresInDays !== undefined && (
                  <span className="expires"> Expires in {item.expiresInDays} days</span>
                )}
              </ListItem>
            ))}
          </div>
        );
      })}
      
      {!showForm && (
        <button 
          type="button" 
          className="add-button" 
          onClick={() => setShowForm(true)}
        >
          + Add Pantry Item
        </button>
      )}
      
      {showForm && (
        <PantryForm 
          onSave={handleAdd} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </FormSection>
  );
}

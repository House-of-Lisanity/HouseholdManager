import React from "react";
import { MealsPlanResult } from "@/types";
import SectionPrintButton from "./SectionPrintButton";

interface ShoppingListSectionProps {
  data: MealsPlanResult["shoppingList"];
  onUpdateItem: (
    catIndex: number,
    itemIndex: number,
    value: string
  ) => void;
}

export default function ShoppingListSection({
  data,
  onUpdateItem,
}: ShoppingListSectionProps) {
  if (!data) return null;

  return (
    <section className="results-section results-section--shopping">
      <div className="results-section__header">
        <h2>Shopping List</h2>
        <SectionPrintButton section="shopping" label="Print Shopping" />
      </div>

      <div className="shopping-list">
        {data.toBuy.map((section, catIndex) => (
          <div key={catIndex} className="shopping-category">
            <strong>{section.category}:</strong>
            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <input
                    type="text"
                    className="editable-field"
                    value={item}
                    onChange={(e) =>
                      onUpdateItem(catIndex, itemIndex, e.target.value)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

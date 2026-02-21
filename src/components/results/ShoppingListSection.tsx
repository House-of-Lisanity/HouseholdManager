import React from "react";
import { MealsPlanResult, ShoppingItem } from "@/types";
import { STORE_CONFIGS } from "@/lib/constants";
import { useShoppingList } from "@/hooks/useShoppingList";
import SectionPrintButton from "./SectionPrintButton";
import StoreBoard from "./StoreBoard";

interface ShoppingListSectionProps {
  data: MealsPlanResult["shoppingList"];
}

function formatPrintItem(item: ShoppingItem): string {
  return item.quantity ? `${item.quantity} — ${item.name}` : item.name;
}

function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const groups: Record<string, ShoppingItem[]> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

function PrintStoreGroup({ label, items }: { label: string; items: ShoppingItem[] }) {
  const grouped = groupByCategory(items);
  return (
    <div className="shopping-print-view__store">
      <h4>{label}</h4>
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} className="shopping-print-view__category">
          <strong>{cat}:</strong>
          <ul>
            {catItems.map((item) => (
              <li key={item.id}>{formatPrintItem(item)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ShoppingListSection({ data }: ShoppingListSectionProps) {
  const shop = useShoppingList(data.toBuy);

  if (!data) return null;

  return (
    <section className="results-section results-section--shopping">
      <div className="results-section__header">
        <h2>Shopping List</h2>
        <SectionPrintButton section="shopping" label="Print Shopping" />
      </div>

      <StoreBoard
        unsortedItems={shop.unsortedItems}
        itemsByStore={shop.itemsByStore}
        categories={shop.categories}
        onToggleStore={shop.toggleStore}
        onMoveToStore={shop.moveToStore}
        onUpdateName={shop.updateItemName}
        onUpdateCategory={shop.updateItemCategory}
        onRenameCategory={shop.renameCategory}
        onAddItem={shop.addItem}
        onDeleteItem={shop.deleteItem}
      />

      {/* Print-only view: grouped by store then category */}
      <div className="shopping-print-view">
        {STORE_CONFIGS.map((cfg) => {
          const storeItems = shop.itemsByStore[cfg.id];
          if (storeItems.length === 0) return null;
          return <PrintStoreGroup key={cfg.id} label={cfg.label} items={storeItems} />;
        })}
        {shop.unsortedItems.length > 0 && (
          <PrintStoreGroup label="Unsorted" items={shop.unsortedItems} />
        )}
      </div>
    </section>
  );
}

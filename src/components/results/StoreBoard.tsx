import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ShoppingItem, StoreType } from "@/types";
import { STORE_CONFIGS } from "@/lib/constants";
import StoreColumn from "./StoreColumn";

interface StoreBoardProps {
  unsortedItems: ShoppingItem[];
  itemsByStore: Record<StoreType, ShoppingItem[]>;
  categories: string[];
  onToggleStore: (id: string, store: StoreType) => void;
  onMoveToStore: (id: string, from: StoreType | null, to: StoreType | null) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onAddItem: (name: string, category: string, store?: StoreType) => void;
  onDeleteItem: (id: string) => void;
}

export default function StoreBoard({
  unsortedItems,
  itemsByStore,
  categories,
  onToggleStore,
  onMoveToStore,
  onUpdateName,
  onUpdateCategory,
  onRenameCategory,
  onAddItem,
  onDeleteItem,
}: StoreBoardProps) {
  const [activeItem, setActiveItem] = useState<ShoppingItem | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { item: ShoppingItem } | undefined;
    setActiveItem(data?.item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as {
      item: ShoppingItem;
      sourceStore: StoreType | null;
    };
    const targetId = over.id as string;
    const fromStore = activeData.sourceStore;
    const toStore = targetId === "unsorted" ? null : (targetId as StoreType);

    if (fromStore === toStore) return;
    onMoveToStore(activeData.item.id, fromStore, toStore);
  };

  const sharedProps = {
    categories,
    onToggleStore,
    onUpdateName,
    onUpdateCategory,
    onRenameCategory,
    onAddItem,
    onDeleteItem,
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="store-board__columns">
        {unsortedItems.length > 0 && (
          <StoreColumn
            storeId={null}
            label="Unsorted"
            items={unsortedItems}
            {...sharedProps}
          />
        )}
        {STORE_CONFIGS.map((cfg) => (
          <StoreColumn
            key={cfg.id}
            storeId={cfg.id}
            label={cfg.label}
            items={itemsByStore[cfg.id]}
            {...sharedProps}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="shopping-item shopping-item--overlay">
            <span className="shopping-item__grip">⠿</span>
            {activeItem.quantity && (
              <span className="shopping-item__qty">{activeItem.quantity}</span>
            )}
            <span className="shopping-item__name">{activeItem.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

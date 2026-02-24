import { useState, useMemo } from "react";
import { PantryItem } from "@/types";
import ListItem from "../shared/ListItem";

interface PantryCategoryGroupProps {
  label: string;
  items: PantryItem[];
  collapsed: boolean;
  onToggle: () => void;
  onRemove: (id: string) => void;
}

export default function PantryCategoryGroup({
  label,
  items,
  collapsed,
  onToggle,
  onRemove,
}: PantryCategoryGroupProps) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, sortDir]);

  return (
    <section className="pantry-group">
      <button
        type="button"
        className="pantry-group__toggle"
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <span className="pantry-group__arrow">
          {collapsed ? "▸" : "▾"}
        </span>
        <span className="pantry-group__name">{label}</span>
        <span className="pantry-group__count">({items.length})</span>
      </button>

      {!collapsed && (
        <div className="pantry-group__items">
          <button
            type="button"
            className="pantry-group__sort"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          >
            Name {sortDir === "asc" ? "↑" : "↓"}
          </button>

          {sorted.map((item) => (
            <ListItem
              key={item.id}
              onRemove={() => onRemove(item.id)}
              className={
                item.expiresInDays !== undefined && item.expiresInDays <= 3
                  ? "expiring"
                  : ""
              }
            >
              <strong>{item.name}</strong>
              {item.quantity && (
                <span>
                  {" "}
                  ({item.quantity}
                  {item.unit ? ` ${item.unit}` : ""})
                </span>
              )}
              {item.expiresInDays !== undefined && (
                <span className="expires">
                  {" "}
                  Expires in {item.expiresInDays} days
                </span>
              )}
            </ListItem>
          ))}
        </div>
      )}
    </section>
  );
}

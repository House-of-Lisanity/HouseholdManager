import { useState } from "react";
import { TodoItem, WeeklyPriority } from "@/types";
import { SortField, SortDirection, sortItems } from "@/lib/todo-helpers";
import TodoRow from "./TodoRow";

interface CategoryGroupProps {
  category: string;
  items: TodoItem[];
  currentWeekOf: string;
  onToggleComplete: (item: TodoItem) => void;
  onSetWeeklyTag: (
    item: TodoItem,
    priority: WeeklyPriority | undefined,
    hoursMax?: number
  ) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (id: string) => void;
  defaultExpanded?: boolean;
}

export default function CategoryGroup({
  category,
  items,
  currentWeekOf,
  onToggleComplete,
  onSetWeeklyTag,
  onEdit,
  onDelete,
  defaultExpanded = true,
}: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const sorted = sortItems(items, sortField, sortDir);

  return (
    <section className="category-group">
      <button
        type="button"
        className="category-group__toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="category-group__arrow">
          {expanded ? "▾" : "▸"}
        </span>
        <span className="category-group__name">{category}</span>
        <span className="category-group__count">({items.length})</span>
      </button>

      {expanded && (
        <div className="category-group__table-wrap">
          <table className="todo-table">
            <thead>
              <tr>
                <th className="todo-table__th--check" aria-label="Complete" />
                <th
                  className="todo-table__th--sortable"
                  onClick={() => handleSort("title")}
                >
                  Task{sortIndicator("title")}
                </th>
                <th
                  className="todo-table__th--sortable"
                  onClick={() => handleSort("subcategory")}
                >
                  Room{sortIndicator("subcategory")}
                </th>
                <th
                  className="todo-table__th--sortable"
                  onClick={() => handleSort("location")}
                >
                  Location{sortIndicator("location")}
                </th>
                <th>This Week</th>
                <th>Hrs</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <TodoRow
                  key={item._id}
                  item={item}
                  currentWeekOf={currentWeekOf}
                  onToggleComplete={onToggleComplete}
                  onSetWeeklyTag={onSetWeeklyTag}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

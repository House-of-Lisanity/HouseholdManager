import { useState } from "react";
import { RecurringTask } from "@/types";
import RecurringRow from "./RecurringRow";

type SortField = "title" | "frequency";
type SortDirection = "asc" | "desc";

interface RecurringCategoryGroupProps {
  category: string;
  items: RecurringTask[];
  expanded: boolean;
  onToggle: () => void;
  onMarkDone: (item: RecurringTask) => void;
  onEdit: (item: RecurringTask) => void;
  onDelete: (id: string) => void;
}

function sortRecurring(
  items: RecurringTask[],
  field: SortField,
  direction: SortDirection
): RecurringTask[] {
  return [...items].sort((a, b) => {
    const aVal = (a[field] || "").toLowerCase();
    const bVal = (b[field] || "").toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return direction === "asc" ? cmp : -cmp;
  });
}

export default function RecurringCategoryGroup({
  category,
  items,
  expanded,
  onToggle,
  onMarkDone,
  onEdit,
  onDelete,
}: RecurringCategoryGroupProps) {
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
    if (sortField !== field) return null;
    return (
      <span className="sort-arrow">{sortDir === "asc" ? " ↑" : " ↓"}</span>
    );
  };

  const sorted = sortRecurring(items, sortField, sortDir);

  return (
    <section className="category-group">
      <div className="category-group__header">
        <button
          type="button"
          className="category-group__toggle"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="category-group__arrow">
            {expanded ? "▾" : "▸"}
          </span>
          <span className="category-group__name">{category}</span>
          <span className="category-group__count">({items.length})</span>
        </button>
      </div>

      {expanded && (
        <div className="category-group__table-wrap">
          <table className="todo-table">
            <thead>
              <tr>
                <th className="todo-table__th--check" aria-label="Done" />
                <th
                  className="todo-table__th--sortable todo-table__th--task"
                  onClick={() => handleSort("title")}
                >
                  Task{sortIndicator("title")}
                </th>
                <th
                  className="todo-table__th--sortable"
                  onClick={() => handleSort("frequency")}
                >
                  Frequency{sortIndicator("frequency")}
                </th>
                <th>Last Done</th>
                <th className="todo-table__th--actions" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <RecurringRow
                  key={item._id}
                  item={item}
                  onMarkDone={onMarkDone}
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

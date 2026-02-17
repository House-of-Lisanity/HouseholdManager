import { useState } from "react";
import { TodoItem, WeeklyPriority } from "@/types";
import { WEEKLY_PRIORITIES } from "@/lib/constants";

interface TodoRowProps {
  item: TodoItem;
  currentWeekOf: string;
  onToggleComplete: (item: TodoItem) => void;
  onSetWeeklyTag: (
    item: TodoItem,
    priority: WeeklyPriority | undefined,
    hoursMax?: number
  ) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (id: string) => void;
}

export default function TodoRow({
  item,
  currentWeekOf,
  onToggleComplete,
  onSetWeeklyTag,
  onEdit,
  onDelete,
}: TodoRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isTaggedThisWeek = item.taggedForWeek === currentWeekOf;
  const activePriority = isTaggedThisWeek ? item.weeklyPriority : undefined;

  const handlePriorityChange = (value: string) => {
    if (!value) {
      onSetWeeklyTag(item, undefined);
    } else {
      onSetWeeklyTag(item, value as WeeklyPriority, item.weeklyHoursMax);
    }
  };

  const handleHoursChange = (value: string) => {
    const hours = value ? parseFloat(value) : undefined;
    onSetWeeklyTag(item, activePriority, hours);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(item._id!);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <tr className={`todo-row${item.completed ? " todo-row--completed" : ""}`}>
      <td className="todo-row__check">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggleComplete(item)}
          aria-label={`Mark "${item.title}" as ${item.completed ? "incomplete" : "complete"}`}
        />
      </td>
      <td className="todo-row__title">
        {item.title}
        {item.isProject && <span className="badge badge--project">Project</span>}
      </td>
      <td className="todo-row__room">{item.subcategory || "—"}</td>
      <td className="todo-row__location">{item.location || "—"}</td>
      <td className="todo-row__priority">
        {!item.completed && (
          <select
            value={activePriority || ""}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className={`todo-row__priority-select${activePriority ? ` todo-row__priority-select--${activePriority}` : ""}`}
            aria-label={`Weekly priority for "${item.title}"`}
          >
            <option value="">—</option>
            {WEEKLY_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        )}
      </td>
      <td className="todo-row__hours">
        {!item.completed && item.isProject && isTaggedThisWeek && activePriority && (
          <input
            type="number"
            min="0"
            step="0.5"
            value={item.weeklyHoursMax ?? ""}
            onChange={(e) => handleHoursChange(e.target.value)}
            placeholder="hrs"
            aria-label={`Hours this week for "${item.title}"`}
          />
        )}
      </td>
      <td className="todo-row__actions">
        <button
          type="button"
          className="todo-row__btn todo-row__btn--edit"
          onClick={() => onEdit(item)}
          aria-label="Edit"
        >
          Edit
        </button>
        <button
          type="button"
          className="todo-row__btn todo-row__btn--delete"
          onClick={handleDelete}
          aria-label="Delete"
        >
          {confirmDelete ? "Sure?" : "Del"}
        </button>
      </td>
    </tr>
  );
}

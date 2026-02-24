import { useState } from "react";
import { RecurringTask } from "@/types";
import { RECURRING_FREQUENCIES } from "@/lib/constants";
import { daysSinceCompletion, isDue } from "@/lib/todo-helpers";

interface RecurringRowProps {
  item: RecurringTask;
  onMarkDone: (item: RecurringTask) => void;
  onEdit: (item: RecurringTask) => void;
  onDelete: (id: string) => void;
}

export default function RecurringRow({
  item,
  onMarkDone,
  onEdit,
  onDelete,
}: RecurringRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const days = daysSinceCompletion(item.lastCompletedDate);
  const due = isDue(item);
  const frequencyLabel =
    RECURRING_FREQUENCIES.find((f) => f.value === item.frequency)?.label ||
    item.frequency;

  const getLastDoneText = () => {
    if (days === null) return "Never";
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(item._id!);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const doneToday = days === 0;

  return (
    <tr className={`todo-row${doneToday ? " todo-row--completed" : ""}`}>
      <td className="todo-row__check">
        <input
          type="checkbox"
          checked={doneToday}
          onChange={() => onMarkDone(item)}
          aria-label={`Mark "${item.title}" as done`}
        />
      </td>
      <td className="todo-row__title">
        {item.title}
        {due && !doneToday && (
          <span className="badge badge--must">Due</span>
        )}
      </td>
      <td className="todo-row__room">
        <span className={`badge badge--${item.frequency}`}>
          {frequencyLabel}
        </span>
      </td>
      <td className="todo-row__location">{getLastDoneText()}</td>
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

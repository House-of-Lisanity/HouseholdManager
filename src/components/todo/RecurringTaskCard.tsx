import { useState } from "react";
import { RecurringTask } from "@/types";
import { RECURRING_FREQUENCIES } from "@/lib/constants";
import { daysSinceCompletion, isDue } from "@/lib/todo-helpers";

interface RecurringTaskCardProps {
  item: RecurringTask;
  onMarkDone: (item: RecurringTask) => void;
  onEdit: (item: RecurringTask) => void;
  onDelete: (id: string) => void;
}

export default function RecurringTaskCard({
  item,
  onMarkDone,
  onEdit,
  onDelete,
}: RecurringTaskCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const days = daysSinceCompletion(item.lastCompletedDate);
  const due = isDue(item);
  const frequencyLabel =
    RECURRING_FREQUENCIES.find((f) => f.value === item.frequency)?.label ||
    item.frequency;

  const getLastDoneText = () => {
    if (days === null) return "Never done";
    if (days === 0) return "Done today";
    if (days === 1) return "Done yesterday";
    return `Done ${days} days ago`;
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
    <div className="recurring-card">
      <div className="recurring-card__header">
        <span className="recurring-card__title">{item.title}</span>
        <span className={`badge badge--${item.frequency}`}>
          {frequencyLabel}
        </span>
        <span className="recurring-card__category">{item.category}</span>
        {item.subcategory && (
          <span className="recurring-card__category">{item.subcategory}</span>
        )}
      </div>

      <div className="recurring-card__meta">
        <span>{getLastDoneText()}</span>
        {due && days !== 0 && (
          <span className="recurring-card__due">Due</span>
        )}
        {item.location && (
          <span className="recurring-card__location">{item.location}</span>
        )}
      </div>

      {item.notes && <p className="recurring-card__notes">{item.notes}</p>}

      <div className="recurring-card__actions">
        <button
          type="button"
          className="log-button log-button--primary"
          onClick={() => onMarkDone(item)}
        >
          Done
        </button>
        <button
          type="button"
          className="log-button log-button--secondary"
          onClick={() => onEdit(item)}
        >
          Edit
        </button>
        <button
          type="button"
          className="remove-button"
          onClick={handleDelete}
        >
          {confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { RecurringTask } from "@/types";
import { RECURRING_FREQUENCIES } from "@/lib/constants";

interface RecurringTaskFormProps {
  initialData: Omit<RecurringTask, "_id"> & { _id?: string };
  onSave: (item: Omit<RecurringTask, "_id"> & { _id?: string }) => void;
  onCancel: () => void;
  categories: string[];
  rooms: string[];
}

export default function RecurringTaskForm({
  initialData,
  onSave,
  onCancel,
  categories,
  rooms,
}: RecurringTaskFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEditing = Boolean(initialData._id);

  const handleCategoryChange = (value: string) => {
    if (value === "__add_new__") {
      setAddingCategory(true);
      return;
    }
    updateField("category", value as RecurringTask["category"]);
    if (value !== "Home") updateField("subcategory", undefined);
  };

  const handleSaveNewCategory = () => {
    if (!newCategory.trim()) return;
    updateField("category", newCategory.trim() as RecurringTask["category"]);
    setAddingCategory(false);
    setNewCategory("");
  };

  const handleRoomChange = (value: string) => {
    if (value === "__add_new__") {
      setAddingRoom(true);
      return;
    }
    updateField("subcategory", value || undefined);
  };

  const handleSaveNewRoom = () => {
    if (!newRoom.trim()) return;
    updateField("subcategory", newRoom.trim());
    setAddingRoom(false);
    setNewRoom("");
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  return (
    <div className="todo-form">
      <div className="form-group">
        <label htmlFor="recurring-title">Title</label>
        <input
          id="recurring-title"
          type="text"
          placeholder="e.g., Clean bathrooms, Vacuum upstairs"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="recurring-category">Category</label>
          {addingCategory ? (
            <div className="todo-form__inline-add">
              <input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                autoFocus
              />
              <button type="button" className="save-button" onClick={handleSaveNewCategory}>
                Add
              </button>
              <button type="button" className="cancel-button" onClick={() => setAddingCategory(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <select
              id="recurring-category"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__add_new__">+ Add Category</option>
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="recurring-frequency">How Often</label>
          <select
            id="recurring-frequency"
            value={formData.frequency}
            onChange={(e) =>
              updateField("frequency", e.target.value as RecurringTask["frequency"])
            }
          >
            {RECURRING_FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.category === "Home" && (
        <div className="form-group">
          <label htmlFor="recurring-room">Room</label>
          {addingRoom ? (
            <div className="todo-form__inline-add">
              <input
                type="text"
                placeholder="New room name"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                autoFocus
              />
              <button type="button" className="save-button" onClick={handleSaveNewRoom}>
                Add
              </button>
              <button type="button" className="cancel-button" onClick={() => setAddingRoom(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <select
              id="recurring-room"
              value={formData.subcategory || ""}
              onChange={(e) => handleRoomChange(e.target.value)}
            >
              <option value="">Select room...</option>
              {rooms.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
              <option value="__add_new__">+ Add Room</option>
            </select>
          )}
        </div>
      )}

      {formData.category === "Errands" && (
        <div className="form-group">
          <label htmlFor="recurring-location">Location</label>
          <input
            id="recurring-location"
            type="text"
            placeholder="e.g., Hardware store, West side"
            value={formData.location || ""}
            onChange={(e) =>
              updateField("location", e.target.value || undefined)
            }
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="recurring-notes">Notes</label>
        <textarea
          id="recurring-notes"
          rows={2}
          placeholder="Optional notes"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button className="save-button" onClick={handleSave}>
          {isEditing ? "Update Item" : "Save Item"}
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

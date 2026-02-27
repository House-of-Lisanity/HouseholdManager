import { useState } from "react";
import { TodoItem } from "@/types";

interface TodoFormProps {
  initialData: Omit<TodoItem, "_id"> & { _id?: string };
  onSave: (item: Omit<TodoItem, "_id"> & { _id?: string }) => void;
  onCancel: () => void;
  categories: string[];
  rooms: string[];
}

export default function TodoForm({
  initialData,
  onSave,
  onCancel,
  categories,
  rooms,
}: TodoFormProps) {
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
    updateField("category", value as TodoItem["category"]);
    if (value !== "Home") updateField("subcategory", undefined);
  };

  const handleSaveNewCategory = () => {
    if (!newCategory.trim()) return;
    updateField("category", newCategory.trim() as TodoItem["category"]);
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
        <label htmlFor="todo-title">Title</label>
        <input
          id="todo-title"
          type="text"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <div className="form-grid form-grid--2col">
        <div className="form-group">
          <label htmlFor="todo-category">Category</label>
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
              id="todo-category"
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

        {formData.category === "Home" && (
          <div className="form-group">
            <label htmlFor="todo-room">Room</label>
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
                id="todo-room"
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
      </div>

      <div className="form-group">
        <label className="todo-form__checkbox-label">
          <input
            type="checkbox"
            checked={formData.isProject}
            onChange={(e) => updateField("isProject", e.target.checked)}
          />
          This is a multi-week project
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="todo-notes">Notes</label>
        <textarea
          id="todo-notes"
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

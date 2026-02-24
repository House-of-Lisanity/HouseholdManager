"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { TodoItem, RecurringTask } from "@/types";
import { useTodos } from "@/hooks/useTodos";
import { useRecurringTasks } from "@/hooks/useRecurringTasks";
import { getWeekOf } from "@/lib/workout-log-helpers";
import {
  groupByCategory,
  groupRecurringByCategory,
  getUniqueCategories,
  getUniqueRooms,
  createEmptyTodoItem,
  createEmptyRecurringTask,
} from "@/lib/todo-helpers";
import CategoryGroup from "@/components/todo/CategoryGroup";
import RecurringCategoryGroup from "@/components/todo/RecurringCategoryGroup";
import TodoRow from "@/components/todo/TodoRow";
import TodoForm from "@/components/todo/TodoForm";
import RecurringTaskForm from "@/components/todo/RecurringTaskForm";

type ActiveForm =
  | { type: "new-todo" }
  | { type: "edit-todo"; item: TodoItem }
  | { type: "new-recurring" }
  | { type: "edit-recurring"; item: RecurringTask }
  | null;

export default function TodosPage() {
  const {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    toggleComplete,
    setWeeklyTag,
  } = useTodos();

  const {
    items: recurringItems,
    loading: recurringLoading,
    error: recurringError,
    createItem: createRecurring,
    updateItem: updateRecurring,
    deleteItem: deleteRecurring,
    markDone,
  } = useRecurringTasks();

  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedItems, setCompletedItems] = useState<TodoItem[]>([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [expandedRecurring, setExpandedRecurring] = useState<Set<string>>(
    new Set()
  );
  const statusTimer = useRef<ReturnType<typeof setTimeout>>();

  const currentWeekOf = getWeekOf();

  const categories = useMemo(() => getUniqueCategories(items), [items]);
  const rooms = useMemo(() => getUniqueRooms(items), [items]);
  const grouped = useMemo(() => groupByCategory(items), [items]);
  const recurringGrouped = useMemo(
    () => groupRecurringByCategory(recurringItems),
    [recurringItems]
  );

  const todoCategories = useMemo(
    () => Array.from(grouped.keys()),
    [grouped]
  );
  const recurringCategories = useMemo(
    () => Array.from(recurringGrouped.keys()),
    [recurringGrouped]
  );

  const toggleTodoCategory = (cat: string) => {
    setExpandedTodos((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleRecurringCategory = (cat: string) => {
    setExpandedRecurring((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const allTodosExpanded =
    todoCategories.length > 0 &&
    todoCategories.every((c) => expandedTodos.has(c));
  const allRecurringExpanded =
    recurringCategories.length > 0 &&
    recurringCategories.every((c) => expandedRecurring.has(c));

  const toggleAllTodos = () => {
    if (allTodosExpanded) {
      setExpandedTodos(new Set());
    } else {
      setExpandedTodos(new Set(todoCategories));
    }
  };

  const toggleAllRecurring = () => {
    if (allRecurringExpanded) {
      setExpandedRecurring(new Set());
    } else {
      setExpandedRecurring(new Set(recurringCategories));
    }
  };

  const showStatus = (message: string) => {
    setStatusMessage(message);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMessage(null), 3000);
  };

  const loadCompletedItems = useCallback(async () => {
    setLoadingCompleted(true);
    try {
      const res = await fetch("/api/todos?completed=true");
      if (res.ok) {
        const data = await res.json();
        setCompletedItems(data);
      }
    } catch (err) {
      console.error("Failed to load completed items:", err);
    } finally {
      setLoadingCompleted(false);
    }
  }, []);

  const handleToggleShowCompleted = () => {
    const next = !showCompleted;
    setShowCompleted(next);
    if (next) loadCompletedItems();
  };

  // To-do CRUD handlers
  const handleSaveTodo = async (
    item: Omit<TodoItem, "_id"> & { _id?: string }
  ) => {
    if (item._id) {
      await updateItem(item as TodoItem);
      showStatus("Item updated");
    } else {
      await createItem(item);
      showStatus("Item added");
    }
    setActiveForm(null);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteItem(id);
    showStatus("Item deleted");
  };

  // Recurring CRUD handlers
  const handleSaveRecurring = async (
    item: Omit<RecurringTask, "_id"> & { _id?: string }
  ) => {
    if (item._id) {
      await updateRecurring(item as RecurringTask);
      showStatus("Recurring item updated");
    } else {
      await createRecurring(item);
      showStatus("Recurring item added");
    }
    setActiveForm(null);
  };

  const handleDeleteRecurring = async (id: string) => {
    await deleteRecurring(id);
    showStatus("Recurring item deleted");
  };

  const handleMarkDone = async (item: RecurringTask) => {
    await markDone(item);
    showStatus(`"${item.title}" marked done`);
  };

  const combinedError = error || recurringError;

  if (loading && recurringLoading) {
    return (
      <div className="container">
        <p>Loading to-do list...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>To Do List</h2>

      {combinedError && <p className="error-message">{combinedError}</p>}
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <div className="todo-header__actions">
        {!activeForm && (
          <button
            className="add-button"
            onClick={() => setActiveForm({ type: "new-todo" })}
          >
            + Add Item
          </button>
        )}
        <label className="todo-header__toggle">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={handleToggleShowCompleted}
          />
          Show Completed
        </label>
      </div>

      {(activeForm?.type === "new-todo" || activeForm?.type === "edit-todo") && (
        <section className="todo-section">
          <h3>{activeForm.type === "new-todo" ? "New Item" : "Edit Item"}</h3>
          <TodoForm
            initialData={
              activeForm.type === "edit-todo"
                ? activeForm.item
                : createEmptyTodoItem()
            }
            onSave={handleSaveTodo}
            onCancel={() => setActiveForm(null)}
            categories={categories}
            rooms={rooms}
          />
        </section>
      )}

      {/* To-do items grouped by category */}
      {todoCategories.length > 1 && (
        <div className="todo-section__collapse-controls">
          <button
            type="button"
            className="category-group__expand-all"
            onClick={toggleAllTodos}
          >
            {allTodosExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}
      {Array.from(grouped.entries()).map(([category, categoryItems]) => (
        <CategoryGroup
          key={category}
          category={category}
          items={categoryItems}
          currentWeekOf={currentWeekOf}
          expanded={expandedTodos.has(category)}
          onToggle={() => toggleTodoCategory(category)}
          onToggleComplete={toggleComplete}
          onSetWeeklyTag={setWeeklyTag}
          onEdit={(i) => setActiveForm({ type: "edit-todo", item: i })}
          onDelete={handleDeleteTodo}
        />
      ))}

      {items.length === 0 && !loading && (
        <p className="empty-state">No items yet. Add your first to-do above.</p>
      )}

      {/* Recurring Items */}
      <section className="todo-section todo-section--recurring">
        <div className="todo-section__header">
          <h3>Recurring Items</h3>
          <div className="todo-section__header-actions">
            {recurringCategories.length > 1 && (
              <button
                type="button"
                className="category-group__expand-all"
                onClick={toggleAllRecurring}
              >
                {allRecurringExpanded ? "Collapse all" : "Expand all"}
              </button>
            )}
            {!activeForm && (
              <button
                className="add-button"
                onClick={() => setActiveForm({ type: "new-recurring" })}
              >
                + Add Recurring
              </button>
            )}
          </div>
        </div>

        {(activeForm?.type === "new-recurring" ||
          activeForm?.type === "edit-recurring") && (
          <RecurringTaskForm
            initialData={
              activeForm.type === "edit-recurring"
                ? activeForm.item
                : createEmptyRecurringTask()
            }
            onSave={handleSaveRecurring}
            onCancel={() => setActiveForm(null)}
            categories={categories}
            rooms={rooms}
          />
        )}

        {Array.from(recurringGrouped.entries()).map(
          ([category, categoryItems]) => (
            <RecurringCategoryGroup
              key={category}
              category={category}
              items={categoryItems}
              expanded={expandedRecurring.has(category)}
              onToggle={() => toggleRecurringCategory(category)}
              onMarkDone={handleMarkDone}
              onEdit={(i) =>
                setActiveForm({ type: "edit-recurring", item: i })
              }
              onDelete={handleDeleteRecurring}
            />
          )
        )}

        {recurringItems.length === 0 && !recurringLoading && (
          <p className="empty-state">No recurring items yet.</p>
        )}
      </section>

      {/* Completed items */}
      {showCompleted && (
        <section className="todo-section todo-section--completed">
          <h3>Completed ({completedItems.length})</h3>
          {loadingCompleted ? (
            <p>Loading...</p>
          ) : completedItems.length === 0 ? (
            <p className="empty-state">No completed items.</p>
          ) : (
            <div className="category-group__table-wrap">
              <table className="todo-table">
                <thead>
                  <tr>
                    <th className="todo-table__th--check" aria-label="Complete" />
                    <th className="todo-table__th--task">Task</th>
                    <th>Room</th>
                    <th>Location</th>
                    <th className="todo-table__th--priority">This Week</th>
                    <th className="todo-table__th--hours">Hrs</th>
                    <th className="todo-table__th--actions" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {completedItems.map((item) => (
                    <TodoRow
                      key={item._id}
                      item={item}
                      currentWeekOf={currentWeekOf}
                      onToggleComplete={toggleComplete}
                      onSetWeeklyTag={setWeeklyTag}
                      onEdit={(i) =>
                        setActiveForm({ type: "edit-todo", item: i })
                      }
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

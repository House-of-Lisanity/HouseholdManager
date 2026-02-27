import { useState, useMemo } from "react";
import { TodoItem, WeeklyPriority } from "@/types";
import { sortItems, groupByRoom, SortField, SortDirection } from "@/lib/todo-helpers";
import TodoRow from "./TodoRow";

interface CategoryGroupProps {
  category: string;
  items: TodoItem[];
  currentWeekOf: string;
  expanded: boolean;
  onToggle: () => void;
  onToggleComplete: (item: TodoItem) => void;
  onSetWeeklyTag: (
    item: TodoItem,
    priority: WeeklyPriority | undefined,
    hoursMax?: number
  ) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (id: string) => void;
}

function TodoTable({
  items,
  currentWeekOf,
  showRoom,
  onToggleComplete,
  onSetWeeklyTag,
  onEdit,
  onDelete,
}: {
  items: TodoItem[];
  currentWeekOf: string;
  showRoom: boolean;
  onToggleComplete: (item: TodoItem) => void;
  onSetWeeklyTag: (
    item: TodoItem,
    priority: WeeklyPriority | undefined,
    hoursMax?: number
  ) => void;
  onEdit: (item: TodoItem) => void;
  onDelete: (id: string) => void;
}) {
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

  const sorted = sortItems(items, sortField, sortDir);

  return (
    <div className="category-group__table-wrap">
      <table className="todo-table">
        <thead>
          <tr>
            <th className="todo-table__th--check" aria-label="Complete" />
            <th
              className="todo-table__th--sortable todo-table__th--task"
              onClick={() => handleSort("title")}
            >
              Task{sortIndicator("title")}
            </th>
            {showRoom && (
              <th
                className="todo-table__th--sortable"
                onClick={() => handleSort("subcategory")}
              >
                Room{sortIndicator("subcategory")}
              </th>
            )}
            <th className="todo-table__th--priority">This Week</th>
            <th className="todo-table__th--hours">Hrs</th>
            <th className="todo-table__th--actions" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <TodoRow
              key={item._id}
              item={item}
              currentWeekOf={currentWeekOf}
              showRoom={showRoom}
              onToggleComplete={onToggleComplete}
              onSetWeeklyTag={onSetWeeklyTag}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CategoryGroup({
  category,
  items,
  currentWeekOf,
  expanded,
  onToggle,
  onToggleComplete,
  onSetWeeklyTag,
  onEdit,
  onDelete,
}: CategoryGroupProps) {
  const [collapsedRooms, setCollapsedRooms] = useState<Set<string>>(new Set());
  const isHome = category === "Home";

  const roomGroups = useMemo(() => {
    if (!isHome) return null;
    return groupByRoom(items);
  }, [isHome, items]);

  const toggleRoom = (room: string) => {
    setCollapsedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(room)) {
        next.delete(room);
      } else {
        next.add(room);
      }
      return next;
    });
  };

  const allRoomsCollapsed =
    isHome && roomGroups ? collapsedRooms.size === roomGroups.size : false;

  const toggleAllRooms = () => {
    if (!roomGroups) return;
    if (allRoomsCollapsed) {
      setCollapsedRooms(new Set());
    } else {
      setCollapsedRooms(new Set(roomGroups.keys()));
    }
  };

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
        {expanded && isHome && roomGroups && roomGroups.size > 1 && (
          <button
            type="button"
            className="category-group__expand-all"
            onClick={toggleAllRooms}
          >
            {allRoomsCollapsed ? "Expand all" : "Collapse all"}
          </button>
        )}
      </div>

      {expanded && isHome && roomGroups && (
        <div className="category-group__rooms">
          {Array.from(roomGroups.entries()).map(([room, roomItems]) => {
            const isCollapsed = collapsedRooms.has(room);
            return (
              <div key={room} className="room-group">
                <button
                  type="button"
                  className="room-group__toggle"
                  onClick={() => toggleRoom(room)}
                  aria-expanded={!isCollapsed}
                >
                  <span className="room-group__arrow">
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                  <span className="room-group__name">{room}</span>
                  <span className="room-group__count">({roomItems.length})</span>
                </button>
                {!isCollapsed && (
                  <TodoTable
                    items={roomItems}
                    currentWeekOf={currentWeekOf}
                    showRoom={false}
                    onToggleComplete={onToggleComplete}
                    onSetWeeklyTag={onSetWeeklyTag}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {expanded && !isHome && (
        <TodoTable
          items={items}
          currentWeekOf={currentWeekOf}
          showRoom={true}
          onToggleComplete={onToggleComplete}
          onSetWeeklyTag={onSetWeeklyTag}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </section>
  );
}

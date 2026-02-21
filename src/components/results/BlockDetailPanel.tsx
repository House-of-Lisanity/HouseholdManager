import React, { useEffect, useRef } from "react";
import { TimeBlock } from "@/types";
import { formatTo12Hour } from "@/lib/format-time";

interface BlockDetailPanelProps {
  block: TimeBlock;
  dayName: string;
  onUpdateDescription: (value: string) => void;
  onUpdateTimes: (startTime: string, endTime: string) => void;
  onClose: () => void;
}

export default function BlockDetailPanel({
  block,
  dayName,
  onUpdateDescription,
  onUpdateTimes,
  onClose,
}: BlockDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="block-detail-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-label="Event details"
      aria-modal="true"
    >
      <div className="block-detail" ref={panelRef}>
        <div className="block-detail__header">
          <div className="block-detail__title">
            <strong>{dayName}</strong>
            <span className="block-detail__time-range">
              {formatTo12Hour(block.startTime)} – {formatTo12Hour(block.endTime)}
            </span>
            {block.pinned && (
              <span className="block-detail__pinned-badge">Fixed</span>
            )}
          </div>
          <button
            className="block-detail__close"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            Done
          </button>
        </div>

        <div className="block-detail__body">
          <div className="block-detail__field">
            <label className="block-detail__label">Time</label>
            <div className="block-detail__time-inputs">
              <input
                type="time"
                className="editable-field"
                value={block.startTime}
                onChange={(e) => onUpdateTimes(e.target.value, block.endTime)}
              />
              <span>to</span>
              <input
                type="time"
                className="editable-field"
                value={block.endTime}
                onChange={(e) => onUpdateTimes(block.startTime, e.target.value)}
              />
            </div>
          </div>

          <div className="block-detail__field">
            <label className="block-detail__label">Description</label>
            <textarea
              className="editable-field"
              value={block.description}
              onChange={(e) => onUpdateDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

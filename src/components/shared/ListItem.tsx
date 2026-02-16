import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  onRemove: () => void;
  className?: string;
}

export default function ListItem({ children, onRemove, className = '' }: ListItemProps) {
  return (
    <div className={`list-item ${className}`}>
      <div>{children}</div>
      <button type="button" className="remove-button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

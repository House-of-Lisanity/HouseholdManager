import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="form-section">
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
      {children}
    </div>
  );
}

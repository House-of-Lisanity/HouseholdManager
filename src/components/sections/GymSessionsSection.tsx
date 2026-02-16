import React, { useState } from 'react';
import { GymSession } from '@/types';
import FormSection from '../shared/FormSection';
import ListItem from '../shared/ListItem';
import GymSessionForm from '../forms/GymSessionForm';

interface GymSessionsSectionProps {
  sessions: GymSession[];
  onUpdate: (sessions: GymSession[]) => void;
}

export default function GymSessionsSection({ sessions, onUpdate }: GymSessionsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (session: GymSession) => {
    onUpdate([...sessions, session]);
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onUpdate(sessions.filter((_, idx) => idx !== index));
  };

  return (
    <FormSection title="Gym Sessions" description="Add gym sessions with specific times">
      {sessions.map((session, i) => (
        <ListItem key={i} onRemove={() => handleRemove(i)}>
          <strong>{session.day}:</strong> {session.startTime} - {session.endTime} ({session.gymType})
        </ListItem>
      ))}
      
      {!showForm && (
        <button 
          type="button" 
          className="add-button" 
          onClick={() => setShowForm(true)}
        >
          + Add Gym Session
        </button>
      )}
      
      {showForm && (
        <GymSessionForm 
          onSave={handleAdd} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </FormSection>
  );
}

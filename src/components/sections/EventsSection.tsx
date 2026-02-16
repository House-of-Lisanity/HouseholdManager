import React, { useState } from 'react';
import { OneOffItem } from '@/types';
import FormSection from '../shared/FormSection';
import ListItem from '../shared/ListItem';
import EventForm from '../forms/EventForm';

interface EventsSectionProps {
  events: OneOffItem[];
  onUpdate: (events: OneOffItem[]) => void;
}

export default function EventsSection({ events, onUpdate }: EventsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (event: OneOffItem) => {
    onUpdate([...events, event]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    onUpdate(events.filter(e => e.id !== id));
  };

  const groupedEvents = {
    meetings: events.filter(e => e.type === 'meeting'),
    appointments: events.filter(e => e.type === 'appointment'),
    events: events.filter(e => e.type === 'event')
  };

  return (
    <FormSection 
      title="Events & Activities" 
      description="Add appointments, events, Nuggets games, birthdays, or other activities"
    >
      {groupedEvents.meetings.length > 0 && (
        <div className="event-group">
          <h3>Meetings</h3>
          {groupedEvents.meetings.map(item => (
            <ListItem key={item.id} onRemove={() => handleRemove(item.id)}>
              <strong>{item.day}:</strong> {item.description} ({item.startTime} - {item.endTime})
            </ListItem>
          ))}
        </div>
      )}
      
      {groupedEvents.appointments.length > 0 && (
        <div className="event-group">
          <h3>Appointments</h3>
          {groupedEvents.appointments.map(item => (
            <ListItem key={item.id} onRemove={() => handleRemove(item.id)}>
              <strong>{item.day}:</strong> {item.description} ({item.startTime} - {item.endTime})
            </ListItem>
          ))}
        </div>
      )}
      
      {groupedEvents.events.length > 0 && (
        <div className="event-group">
          <h3>Events</h3>
          {groupedEvents.events.map(item => (
            <ListItem key={item.id} onRemove={() => handleRemove(item.id)}>
              <strong>{item.day}:</strong> {item.description} ({item.startTime} - {item.endTime})
            </ListItem>
          ))}
        </div>
      )}
      
      {!showForm && (
        <button 
          type="button" 
          className="add-button" 
          onClick={() => setShowForm(true)}
        >
          + Add Event/Activity
        </button>
      )}
      
      {showForm && (
        <EventForm 
          onSave={handleAdd} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </FormSection>
  );
}

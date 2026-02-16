import React, { useState } from 'react';
import { GymSession } from '@/types';
import { DAYS_MONDAY_START } from '@/lib/constants';

interface GymSessionFormProps {
  onSave: (session: GymSession) => void;
  onCancel: () => void;
}

export default function GymSessionForm({ onSave, onCancel }: GymSessionFormProps) {
  const [session, setSession] = useState<Partial<GymSession>>({
    day: 'Monday',
    gymType: 'Lifting'
  });

  const handleSave = () => {
    if (session.day && session.startTime && session.endTime && session.gymType) {
      onSave(session as GymSession);
    }
  };

  return (
    <div className="add-form">
      <div className="form-grid">
        <select 
          value={session.day} 
          onChange={(e) => setSession(prev => ({ ...prev, day: e.target.value }))}
        >
          {DAYS_MONDAY_START.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        
        <input
          type="text"
          placeholder="Start (e.g., 4:00 PM)"
          value={session.startTime || ''}
          onChange={(e) => setSession(prev => ({ ...prev, startTime: e.target.value }))}
        />
        
        <input
          type="text"
          placeholder="End (e.g., 5:00 PM)"
          value={session.endTime || ''}
          onChange={(e) => setSession(prev => ({ ...prev, endTime: e.target.value }))}
        />
        
        <select 
          value={session.gymType} 
          onChange={(e) => setSession(prev => ({ ...prev, gymType: e.target.value }))}
        >
          <option value="Lifting">Lifting</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="form-buttons">
        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

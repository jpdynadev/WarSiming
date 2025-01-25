// app/components/factions/SelectedUnits.tsx
"use client";

import React from "react";

interface ChosenUnit {
  id: string;
  templateName: string;
  points: number;
}

interface SelectedUnitsProps {
  units: ChosenUnit[];
  onRemove: (id: string) => void;
}

const SelectedUnits: React.FC<SelectedUnitsProps> = ({ units, onRemove }) => {
  const totalPoints = units.reduce((sum, u) => sum + (u.points || 0), 0);

  return (
    <div>
      <h4>Selected Units</h4>
      {units.length === 0 && <p>No units added.</p>}

      <ul>
        {units.map((u) => (
          <li key={u.id} style={{ marginBottom: "6px" }}>
            {u.templateName} - {u.points} pts
            <button
              onClick={() => onRemove(u.id)}
              style={{ marginLeft: "8px", color: "red" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total Points:</strong> {totalPoints}
      </p>
    </div>
  );
};

export default SelectedUnits;

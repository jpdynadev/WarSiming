// app/components/factions/FactionUnitList.tsx
"use client";

import React from "react";
import { armyOptions } from "../../armyOptions";

interface FactionUnitListProps {
  faction: string;
  onAddUnit: (templateName: string) => void;
}

/** Displays the units for a chosen faction with an "Add" button */
const FactionUnitList: React.FC<FactionUnitListProps> = ({
  faction,
  onAddUnit,
}) => {
  if (!faction) {
    return null; // no faction selected yet
  }

  const templates = armyOptions[faction];
  if (!templates) {
    return <p>No units found for faction: {faction}</p>;
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <h4>Units in {faction}</h4>
      {templates.map((tmpl) => (
        <div key={tmpl.name} style={{ marginBottom: "8px" }}>
          <strong>{tmpl.name}</strong>
          {tmpl.points && <span> - {tmpl.points} pts</span>}
          <button
            onClick={() => onAddUnit(tmpl.name)}
            style={{ marginLeft: "10px" }}
          >
            + Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default FactionUnitList;

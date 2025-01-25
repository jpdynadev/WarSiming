// app/components/factions/FactionSelector.tsx
"use client";

import React from "react";
import { armyOptions } from "../../armyOptions";

interface FactionSelectorProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
}

const FactionSelector: React.FC<FactionSelectorProps> = ({
  selectedFaction,
  onFactionChange,
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        Faction:{" "}
        <select
          value={selectedFaction}
          onChange={(e) => onFactionChange(e.target.value)}
        >
          <option value="">-- Select a Faction --</option>
          {Object.keys(armyOptions).map((fKey) => (
            <option key={fKey} value={fKey}>
              {fKey}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FactionSelector;

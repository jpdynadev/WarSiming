// app/components/userArmy/ArmyListDisplay.tsx
"use client";

import React from "react";
import ArmyCard from "./ArmyCard";

interface ArmyListDisplayProps {
  armies: CustomArmy[];
  onDeleteArmy: (armyId: string) => void;
}

interface CustomArmy {
  id: string;
  userEmail: string;
  name: string;
  notes?: string;
  faction: string;
  chosenUnits: ChosenUnit[];
}

interface ChosenUnit {
  id: string;
  templateName: string;
  points: number;
}

const ArmyListDisplay: React.FC<ArmyListDisplayProps> = ({
  armies,
  onDeleteArmy,
}) => {
  if (armies.length === 0) {
    return <p>No saved armies yet.</p>;
  }

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {armies.map((army) => (
        <li key={army.id} style={{ marginBottom: "12px" }}>
          <ArmyCard army={army} onDeleteArmy={onDeleteArmy} />
        </li>
      ))}
    </ul>
  );
};

export default ArmyListDisplay;

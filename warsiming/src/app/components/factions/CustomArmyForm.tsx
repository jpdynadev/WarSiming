// app/components/userArmy/CustomArmyForm.tsx
"use client";

import React, { useState } from "react";

interface CustomArmyFormProps {
  onSave: (armyName: string, notes: string) => void;
}

const CustomArmyForm: React.FC<CustomArmyFormProps> = ({ onSave }) => {
  const [armyName, setArmyName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave(armyName, notes);
    // Clear fields
    setArmyName("");
    setNotes("");
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <label>
        Army Name:{" "}
        <input
          type="text"
          value={armyName}
          onChange={(e) => setArmyName(e.target.value)}
          style={{ marginRight: "8px" }}
        />
      </label>

      <label>
        Notes:{" "}
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ marginRight: "8px" }}
        />
      </label>

      <button onClick={handleSave}>Save Army</button>
    </div>
  );
};

export default CustomArmyForm;

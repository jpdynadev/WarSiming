"use client";

import React, { useState } from "react";
import styles from "../styles/armyList.module.css";
import { Unit, instantiateUnit } from "../shared";
import { armyOptions } from "../armyOptions";

type ArmyListProps = {
  armyName: string;
  units: Unit[];
  onArmyUpdate: (updated: Unit[]) => void;
};

const ArmyList: React.FC<ArmyListProps> = ({ armyName, units, onArmyUpdate }) => {
  const [selectedFaction, setSelectedFaction] = useState("");

  // Called when user clicks "Add [unitName]" button
  const handleAddUnit = (templateName: string) => {
    if (!selectedFaction) return;
    const templates = armyOptions[selectedFaction];
    if (!templates) return;

    const template = templates.find((t) => t.name === templateName);
    if (!template) return;

    // Create a new unit from the template
    const newUnit = instantiateUnit(template);

    // Append to our local array
    onArmyUpdate([...units, newUnit]);
  };

  return (
    <div className={styles["army-container"]}>
      <h2 className={styles.header}>{armyName}</h2>

      {/* Faction dropdown */}
      <div className={styles["select-wrapper"]}>
        <label>Select Faction:</label>
        <select
          className={styles["select-dropdown"]}
          value={selectedFaction}
          onChange={(e) => setSelectedFaction(e.target.value)}
        >
          <option value="">--Select--</option>
          {Object.keys(armyOptions).map((fKey) => (
            <option key={fKey} value={fKey}>
              {fKey}
            </option>
          ))}
        </select>
      </div>

      {selectedFaction && armyOptions[selectedFaction] && (
        <div>
          <h3>Add Unit from {selectedFaction}:</h3>
          {armyOptions[selectedFaction].map((tmpl) => (
            <button
              key={tmpl.name}
              className={styles["add-button"]}
              onClick={() => handleAddUnit(tmpl.name)}
            >
              + {tmpl.name}
            </button>
          ))}
        </div>
      )}

      {/* Current units */}
      <div className={styles["units-list"]}>
        <h3>Current {armyName} Units:</h3>
        {units.length === 0 && <p>No units yet.</p>}

        {units.map((u) => (
          <div key={u.unitId} className={styles["unit-row"]}>
            <div className={styles["unit-row-title"]}>
              {u.name} (Models: {u.models.length})
            </div>
            {u.models.map((m) => (
              <div key={m.id}>
                - {m.name || m.id.slice(0,5)}: {m.health} HP
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArmyList;

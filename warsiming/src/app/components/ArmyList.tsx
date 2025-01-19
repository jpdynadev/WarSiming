"use client";

import React, { useState } from "react";
import styles from "../styles/armyList.module.css";

// Types and data
import { Unit, instantiateUnit } from "../shared";     // or wherever your shared definitions live
import { armyOptions } from "../armyOptions";          // your templates

type ArmyListProps = {
  armyName: string;                // e.g. "Attacker Army" or "Defender Army"
  units: Unit[];                   // The current units in this army
  onArmyUpdate: (units: Unit[]) => void;  // Callback to update the parent state
};

const ArmyList: React.FC<ArmyListProps> = ({ armyName, units, onArmyUpdate }) => {
  const [selectedFaction, setSelectedFaction] = useState<string>("");

  /** User chooses a template from the selected faction, we instantiate a new unit and add it. */
  const handleAddUnit = (templateName: string) => {
    if (!selectedFaction) return;
    const templates = armyOptions[selectedFaction];
    if (!templates) return;

    const template = templates.find((t) => t.name === templateName);
    if (!template) return;

    // Create a real unit with a unique unitId
    const newUnit = instantiateUnit(template);

    // Optionally rename model IDs if you want to ensure uniqueness each time
    // (instantiateUnit might already handle that; do it here if needed)
    // newUnit.models = newUnit.models.map((m, i) => ({
    //   ...m,
    //   id: uuidv4(), 
    //   name: m.name ?? `Model #${i + 1}`
    // }));

    onArmyUpdate([...units, newUnit]);
  };

  // We also might show a function to remove or rename units, etc.
  // For now, we just show "Add" and the "Current" list.

  return (
    <div className={styles["army-container"]}>
      {/* Army Title */}
      <h2 className={styles.header}>{armyName}</h2>

      {/* Faction Select */}
      <div className={styles["select-wrapper"]}>
        <label htmlFor="factionSelect">Select Faction:</label>
        <select
          id="factionSelect"
          className={styles["select-dropdown"]}
          value={selectedFaction}
          onChange={(e) => setSelectedFaction(e.target.value)}
        >
          <option value="">-- Select --</option>
          {Object.keys(armyOptions).map((factionKey) => (
            <option key={factionKey} value={factionKey}>
              {factionKey}
            </option>
          ))}
        </select>
      </div>

      {/* Add Unit Buttons */}
      {selectedFaction && armyOptions[selectedFaction] && (
        <div>
          <h3>Add Units from {selectedFaction}:</h3>
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

      {/* Current Units List */}
      <div className={styles["units-list"]}>
        <h3>Current {armyName} Units:</h3>
        {units.length === 0 && <p>No units yet.</p>}
        {units.map((u) => (
          <div key={u.unitId} className={styles["unit-row"]}>
            <div className={styles["unit-row-title"]}>
              {u.name} (Models: {u.models.length})  
            </div>
            {/* If you want to list each model, do so here: */}
            {u.models.map((m) => (
              <div key={m.id}>
                - {m.name || m.id.slice(0, 6)}: {m.health} HP
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArmyList;

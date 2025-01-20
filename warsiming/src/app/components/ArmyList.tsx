"use client";

import React, { useState } from "react";
import styles from "../styles/armyList.module.css";
import { Unit, instantiateUnit } from "../shared";
import { armyOptions } from "../armyOptions";
import UnitModal from "./UnitModal";

type ArmyListProps = {
  armyName: string;
  units: Unit[];
  onArmyUpdate: (updated: Unit[]) => void;
};

const ArmyList: React.FC<ArmyListProps> = ({ armyName, units, onArmyUpdate }) => {
  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFaction = e.target.value;
    setSelectedFaction(newFaction);
    // Reset units when the faction changes.
    onArmyUpdate([]);
  };

  const handleAddUnit = (templateName: string) => {
    if (!selectedFaction) return;
    const templates = armyOptions[selectedFaction];
    if (!templates) return;

    const template = templates.find((t) => t.name === templateName);
    if (!template) return;

    const newUnit = instantiateUnit(template);
    onArmyUpdate([...units, newUnit]);
  };

  const handleUpdateUnit = (updatedUnit: Unit) => {
    const updatedUnits = units.map((u) =>
      u.unitId === updatedUnit.unitId ? updatedUnit : u
    );
    onArmyUpdate(updatedUnits);
    setSelectedUnit(null); // Close the modal
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
          onChange={handleFactionChange}
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

        <div className={styles["unit-grid"]}>
          {units.map((u) => (
            <div
              key={u.unitId}
              className={styles["unit-card"]}
              onClick={() => setSelectedUnit(u)}
            >
              <div className={styles["unit-header"]}>
                {u.name} <span>({u.models.length} Models)</span>
              </div>
              <div className={styles["model-health"]}>
                {u.models.slice(0, 10).map((m) => (
                  <span
                    key={m.id}
                    className={
                      m.health > 2
                        ? styles["health-full"]
                        : m.health > 0
                        ? styles["health-low"]
                        : styles["health-empty"]
                    }
                  >
                    ●
                  </span>
                ))}
                {u.models.length > 10 && <span>+{u.models.length - 10}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Modal */}
      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onSave={handleUpdateUnit}
        />
      )}
    </div>
  );
};

export default ArmyList;

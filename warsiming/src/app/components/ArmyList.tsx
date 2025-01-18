"use client";

import React, { useState } from "react";
import { Unit, armyOptions } from "../shared";
import styles from "../styles/armyList.module.css";
import { v4 as uuidv4 } from "uuid";

type ArmyListProps = {
  armyName: string;
  units: Unit[];
  onArmyUpdate: (units: Unit[]) => void; // Function to update parent state
};

const ArmyList: React.FC<ArmyListProps> = ({ armyName, units, onArmyUpdate }) => {
  const [selectedArmy, setSelectedArmy] = useState<string>("");

  // Add a predefined unit to the army
  const handleAddPredefinedUnit = (unitName: string) => {
    const unit = armyOptions[selectedArmy]?.find((u) => u.name === unitName);
    if (unit) {
      const updatedUnits = [...units, { ...unit }];
      console.log("Updated Units:", updatedUnits);

      onArmyUpdate(updatedUnits); // Notify parent
    }
  };  

  // Add a model to a specific unit
  const handleAddModel = (unitName: string) => {
    const updatedUnits = units.map((unit) => {
      if (unit.name === unitName) {
        const newModel = { id: uuidv4(), health: unit.models[0]?.health || 10 };
        return { ...unit, models: [...unit.models, newModel] };
      }
      return unit;
    });
    console.log("Updated Units:", updatedUnits);

    onArmyUpdate(updatedUnits); // Notify parent
  };

  // Remove a model from a specific unit
  const handleRemoveModel = (unitName: string, modelId: string) => {
    const updatedUnits = units.map((unit) => {
      if (unit.name === unitName) {
        const updatedModels = unit.models.filter((model) => model.id !== modelId);
        return { ...unit, models: updatedModels };
      }
      return unit;
    }).filter((unit) => unit.models.length > 0); // Remove empty units
    console.log("Updated Units:", updatedUnits);
    onArmyUpdate(updatedUnits); // Notify parent
  };

  return (
    <div className={styles["army-container"]}>
      <h2 className={styles["army-header"]}>{armyName}</h2>

      {/* Select Army */}
      <div className={styles["select-wrapper"]}>
        <label className={styles["select-label"]} htmlFor="army-select">
          Select Army:
        </label>
        <select
          id="army-select"
          value={selectedArmy}
          onChange={(e) => setSelectedArmy(e.target.value)}
          className={styles["select-dropdown"]}
        >
          <option value="">-- Select an Army --</option>
          {Object.keys(armyOptions).map((army) => (
            <option key={army} value={army}>
              {army}
            </option>
          ))}
        </select>
      </div>

      {/* Add Units */}
      {selectedArmy && (
        <div className={styles["units-container"]}>
          <h3>Add Predefined Unit:</h3>
          {armyOptions[selectedArmy]?.map((unit) => (
            <button
              key={unit.name}
              onClick={() => handleAddPredefinedUnit(unit.name)}
              className={styles["unit-card"]}
            >
              {unit.name}
            </button>
          ))}
        </div>
      )}

      {/* Display Units and Models */}
      <div className={styles["current-units"]}>
        <h3>Current Units:</h3>
        {units.length === 0 && <p>No units added to this army</p>}
        {units.map((unit) => (
          <div key={unit.name} className={styles["unit-wrapper"]}>
            <h4>{unit.name}</h4>
            <button
              onClick={() => handleAddModel(unit.name)}
              className={styles["add-model-button"]}
            >
              Add Model
            </button>
            <ul>
              {unit.models.map((model) => (
                <li key={model.id} className={styles["model-item"]}>
                  Model {model.id.substring(0, 5)}: {model.health} HP
                  <button
                    onClick={() => handleRemoveModel(unit.name, model.id)}
                    className={styles["remove-model-button"]}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArmyList;

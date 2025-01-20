"use client";

import React, { useState } from "react";
import styles from "../styles/unitModal.module.css";
import { Unit, Model } from "../shared";

type UnitModalProps = {
  unit: Unit;
  onClose: () => void;
  onSave: (updatedUnit: Unit) => void;
};

const UnitModal: React.FC<UnitModalProps> = ({ unit, onClose, onSave }) => {
  const [models, setModels] = useState<Model[]>(unit.models);

  const handleHealthChange = (id: string, health: number) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, health } : m))
    );
  };

  const handleAddModel = () => {
    const newModel: Model = { id: `model-${Date.now()}`, health: unit.models[0].health };
    setModels((prev) => [...prev, newModel]);
  };

  const handleRemoveModel = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    onSave({ ...unit, models });
  };

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles["modal-content"]}>
        <h2>Edit Unit: {unit.name}</h2>
        <div className={styles["models-list"]}>
          {models.map((model) => (
            <div key={model.id} className={styles["model-row"]}>
              <span>{model.id}</span>
              <input
                type="number"
                value={model.health}
                onChange={(e) => handleHealthChange(model.id, Number(e.target.value))}
                min="0"
                className={styles["health-input"]}
              />
              <button onClick={() => handleRemoveModel(model.id)}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={handleAddModel}>Add Model</button>
        <div className={styles["modal-actions"]}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default UnitModal;

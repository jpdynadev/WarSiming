// app/components/userArmy/ArmyModal.tsx

"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { armyOptions } from "../../armyOptions";

import styles from "../../styles/ArmyModal.module.css";
import ModalUnitCard from "./ModalUnitCard";

interface ArmyModalProps {
  army: CustomArmy;
  onClose: () => void;
  onSave: (updatedArmy: CustomArmy) => void;
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

export default function ArmyModal({
  army,
  onClose,
  onSave,
}: ArmyModalProps) {
  // Local state for name, notes, and chosenUnits
  const [armyName, setArmyName] = useState(army.name);
  const [notes, setNotes] = useState(army.notes || "");
  const [chosenUnits, setChosenUnits] = useState<ChosenUnit[]>(army.chosenUnits);

  // For adding new units from the same faction
  const [selectedUnitTemplate, setSelectedUnitTemplate] = useState("");

  // 1) Remove a unit
  const handleRemoveUnit = (unitId: string) => {
    setChosenUnits((prev) => prev.filter((u) => u.id !== unitId));
  };

  // 2) Add a new unit from the same faction
  const handleAddUnit = () => {
    const factionTemplates = armyOptions[army.faction];
    if (!factionTemplates || !selectedUnitTemplate) return;
    const found = factionTemplates.find((t) => t.name === selectedUnitTemplate);
    if (!found) return;

    const cost = found.points || 0;
    const newU: ChosenUnit = {
      id: uuidv4(),
      templateName: found.name,
      points: cost,
    };
    setChosenUnits((prev) => [...prev, newU]);
    setSelectedUnitTemplate("");
  };

  // 3) Save changes
  const handleSave = () => {
    const updatedArmy: CustomArmy = {
      ...army,
      name: armyName.trim() || "Untitled Army",
      notes: notes.trim(),
      chosenUnits,
    };
    onSave(updatedArmy);
  };

  // 4) Compute total points
  const totalPoints = chosenUnits.reduce((sum, u) => sum + (u.points || 0), 0);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Title/General Info */}
        <h2 className={styles.title}>Edit Army</h2>
        <div className={styles.mainInfo}>
          <div className={styles.formRow}>
            <label>Army Name:</label>
            <input
              type="text"
              value={armyName}
              onChange={(e) => setArmyName(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label>Notes:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label>Faction:</label>
            <span className={styles.staticValue}>{army.faction}</span>
          </div>
          <p className={styles.totalPoints}>
            Total Points: <strong>{totalPoints}</strong>
          </p>
        </div>

        {/* Unit Cards */}
        <div className={styles.unitsSection}>
          {chosenUnits.length === 0 && <p>No units yet.</p>}
          {chosenUnits.map((unit) => (
            <ModalUnitCard
              key={unit.id}
              faction={army.faction}
              unit={unit}
              onRemoveUnit={handleRemoveUnit}
            />
          ))}

          {/* Add new unit */}
          <div className={styles.addUnitRow}>
            <select
              value={selectedUnitTemplate}
              onChange={(e) => setSelectedUnitTemplate(e.target.value)}
            >
              <option value="">-- Select a Unit --</option>
              {armyOptions[army.faction]?.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.points || 0} pts)
                </option>
              ))}
            </select>
            <button onClick={handleAddUnit} className={styles.addUnitBtn}>
              + Add
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Clicking outside this box closes modal */}
      <div className={styles.modalClickCatcher} onClick={onClose} />
    </div>
  );
}

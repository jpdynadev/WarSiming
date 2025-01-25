"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { armyOptions } from "../armyOptions";

// child components
import FactionSelector from "./factions/FactionSelector";
import FactionUnitList from "./factions/FactionUnitList";
import SelectedUnits from "./factions/SelectedUnits";
import CustomArmyForm from "./userArmy/CustomArmyForm";

/** A single 'CustomArmy' record in localStorage. */
interface CustomArmy {
  id: string;
  userEmail: string;
  name: string;
  notes?: string;
  chosenUnits: ChosenUnit[];
}

/** Each chosen unit stored in the custom army. */
interface ChosenUnit {
  id: string;
  templateName: string;
  points: number;
}

const UserArmyBuilder: React.FC = () => {
  const { user, isLoggedIn } = useContext(AuthContext);

  const [selectedFaction, setSelectedFaction] = useState("");
  const [chosenUnits, setChosenUnits] = useState<ChosenUnit[]>([]);
  const [userArmies, setUserArmies] = useState<CustomArmy[]>([]);

  // Track which armies are expanded
  const [expandedArmies, setExpandedArmies] = useState<string[]>([]);

  // ---------------------------------------------------------------------------
  // 1) Load user's armies from localStorage on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const stored = localStorage.getItem("customArmies");
      if (stored) {
        const allArmies: CustomArmy[] = JSON.parse(stored);
        const myArmies = allArmies.filter((a) => a.userEmail === user.email);
        setUserArmies(myArmies);
      }
    }
  }, [isLoggedIn, user?.email]);

  // ---------------------------------------------------------------------------
  // 2) Helper: persist armies to localStorage
  // ---------------------------------------------------------------------------
  const saveUserArmies = (updated: CustomArmy[]) => {
    if (!user?.email) return;
    const stored = localStorage.getItem("customArmies");
    let allArmies: CustomArmy[] = stored ? JSON.parse(stored) : [];

    allArmies = allArmies.filter((a) => a.userEmail !== user.email);
    allArmies = [...allArmies, ...updated];
    localStorage.setItem("customArmies", JSON.stringify(allArmies));
  };

  // ---------------------------------------------------------------------------
  // 3) Switching factions => clear chosenUnits
  // ---------------------------------------------------------------------------
  const handleFactionChange = (faction: string) => {
    setSelectedFaction(faction);
    setChosenUnits([]);
  };

  // ---------------------------------------------------------------------------
  // 4) Add a unit from the selected faction
  // ---------------------------------------------------------------------------
  const handleAddUnit = (templateName: string) => {
    if (!selectedFaction) return;
    const templates = armyOptions[selectedFaction];
    if (!templates) return;

    const found = templates.find((t) => t.name === templateName);
    if (!found) return;

    const cost = found.points || 0;
    const newUnit: ChosenUnit = {
      id: uuidv4(),
      templateName,
      points: cost,
    };

    setChosenUnits((prev) => [...prev, newUnit]);
  };

  // ---------------------------------------------------------------------------
  // 5) Remove a chosen unit
  // ---------------------------------------------------------------------------
  const handleRemoveChosenUnit = (id: string) => {
    setChosenUnits((prev) => prev.filter((u) => u.id !== id));
  };

  // ---------------------------------------------------------------------------
  // 6) Save a new custom army
  // ---------------------------------------------------------------------------
  const handleSaveArmy = (armyName: string, notes: string) => {
    if (!user?.email) return;

    const newArmy: CustomArmy = {
      id: uuidv4(),
      userEmail: user.email,
      name: armyName.trim() || "Untitled Army",
      notes: notes.trim(),
      chosenUnits,
    };

    const updated = [...userArmies, newArmy];
    setUserArmies(updated);
    saveUserArmies(updated);

    // clear form
    setChosenUnits([]);
    setSelectedFaction("");
  };

  // ---------------------------------------------------------------------------
  // 7) Delete a saved army
  // ---------------------------------------------------------------------------
  const handleDeleteArmy = (armyId: string) => {
    const updated = userArmies.filter((a) => a.id !== armyId);
    setUserArmies(updated);
    saveUserArmies(updated);
  };

  // ---------------------------------------------------------------------------
  // 8) Toggle "show more"/"show less" for each saved army
  // ---------------------------------------------------------------------------
  const toggleArmyExpansion = (armyId: string) => {
    setExpandedArmies((prev) =>
      prev.includes(armyId)
        ? prev.filter((id) => id !== armyId) // remove from expanded
        : [...prev, armyId] // add to expanded
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div style={{ padding: "16px", color: "#ccc" }}>
        <h2>Custom Army Builder</h2>
        <p>You must be logged in to create custom armies.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", color: "#ccc" }}>
      <h2>Custom Army Builder</h2>

      {/* Pick a Faction => clears chosenUnits on change */}
      <FactionSelector
        selectedFaction={selectedFaction}
        onFactionChange={handleFactionChange}
      />

      {/* Show units in that faction */}
      <FactionUnitList faction={selectedFaction} onAddUnit={handleAddUnit} />

      {/* Show chosen units + total points */}
      <SelectedUnits units={chosenUnits} onRemove={handleRemoveChosenUnit} />

      {/* Save the current selection as a custom army */}
      <CustomArmyForm onSave={handleSaveArmy} />

      <hr />

      <h3>Saved Armies</h3>
      {userArmies.length === 0 && <p>No saved armies yet.</p>}

      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {userArmies.map((army) => {
          const totalPoints = army.chosenUnits.reduce(
            (sum, u) => sum + (u.points || 0),
            0
          );

          // Are we expanded?
          const isExpanded = expandedArmies.includes(army.id);

          // Display either the full list or just the first 3
          const displayedUnits = isExpanded
            ? army.chosenUnits
            : army.chosenUnits.slice(0, 3);

          return (
            <li
              key={army.id}
              style={{
                border: "1px solid #555",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <strong>{army.name}</strong> ({totalPoints} pts)
                {army.notes && <em> - {army.notes}</em>}

                <button
                  onClick={() => handleDeleteArmy(army.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </div>

              {/* Collapsible unit list */}
              <div style={{ marginLeft: "10px" }}>
                <ul style={{ marginBottom: "6px" }}>
                  {displayedUnits.map((u) => (
                    <li key={u.id}>
                      • {u.templateName} ({u.points} pts)
                    </li>
                  ))}
                </ul>

                {/* Show toggle button only if there's more than 3 units */}
                {army.chosenUnits.length > 3 && (
                  <button onClick={() => toggleArmyExpansion(army.id)}>
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserArmyBuilder;

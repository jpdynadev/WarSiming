"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { armyOptions } from "../armyOptions";

import FactionSelector from "./factions/FactionSelector";
import FactionUnitList from "./factions/FactionUnitList";
import SelectedUnits from "./factions/SelectedUnits";
import CustomArmyForm from "./factions/CustomArmyForm";
import ArmyListDisplay from "./armyComponents/ArmyListDisplay";

interface CustomArmy {
  id: string;
  userEmail: string;
  name: string;
  notes?: string;
  faction: string;             // store which faction
  chosenUnits: ChosenUnit[];
}

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

    // remove old armies for this user
    allArmies = allArmies.filter((a) => a.userEmail !== user.email);
    // add updated
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
      faction: selectedFaction,  // store current faction
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
  // Render
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

      {/* 1) Faction + adding units */}
      <FactionSelector
        selectedFaction={selectedFaction}
        onFactionChange={handleFactionChange}
      />

      <FactionUnitList faction={selectedFaction} onAddUnit={handleAddUnit} />

      <SelectedUnits units={chosenUnits} onRemove={handleRemoveChosenUnit} />

      <CustomArmyForm onSave={handleSaveArmy} />

      <hr style={{ margin: "20px 0", border: "1px solid #444" }} />

      {/* 2) Display saved armies */}
      <ArmyListDisplay armies={userArmies} onDeleteArmy={handleDeleteArmy} />
    </div>
  );
};

export default UserArmyBuilder;

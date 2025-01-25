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
import ArmyModal from "./armyComponents/ArmyModal";

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

const UserArmyBuilder: React.FC = () => {
  const { user, isLoggedIn } = useContext(AuthContext);

  const [selectedFaction, setSelectedFaction] = useState("");
  const [chosenUnits, setChosenUnits] = useState<ChosenUnit[]>([]);
  const [userArmies, setUserArmies] = useState<CustomArmy[]>([]);

  // NEW: track which army is open in the modal
  const [selectedArmyForModal, setSelectedArmyForModal] = useState<CustomArmy | null>(null);

  // Load from localStorage
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

  // Save to localStorage
  const saveUserArmies = (updated: CustomArmy[]) => {
    if (!user?.email) return;
    const stored = localStorage.getItem("customArmies");
    let allArmies: CustomArmy[] = stored ? JSON.parse(stored) : [];
    allArmies = allArmies.filter((a) => a.userEmail !== user.email);
    allArmies = [...allArmies, ...updated];
    localStorage.setItem("customArmies", JSON.stringify(allArmies));
  };

  // Switch faction => clear chosenUnits
  const handleFactionChange = (faction: string) => {
    setSelectedFaction(faction);
    setChosenUnits([]);
  };

  // Add a unit from the selected faction
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

  // Remove a chosen unit
  const handleRemoveChosenUnit = (id: string) => {
    setChosenUnits((prev) => prev.filter((u) => u.id !== id));
  };

  // Save new custom army
  const handleSaveArmy = (armyName: string, notes: string) => {
    if (!user?.email) return;
    const newArmy: CustomArmy = {
      id: uuidv4(),
      userEmail: user.email,
      name: armyName.trim() || "Untitled Army",
      notes: notes.trim(),
      faction: selectedFaction,
      chosenUnits,
    };
    const updated = [...userArmies, newArmy];
    setUserArmies(updated);
    saveUserArmies(updated);

    // clear
    setChosenUnits([]);
    setSelectedFaction("");
  };

  // Delete a saved army
  const handleDeleteArmy = (armyId: string) => {
    const updated = userArmies.filter((a) => a.id !== armyId);
    setUserArmies(updated);
    saveUserArmies(updated);
  };

  // When user clicks an army, open the modal
  const handleSelectArmy = (army: CustomArmy) => {
    setSelectedArmyForModal(army);
  };

  // Called from the modal when user saves changes
  const handleModalSave = (updatedArmy: CustomArmy) => {
    // 1) Update in state
    const updatedList = userArmies.map((a) => (a.id === updatedArmy.id ? updatedArmy : a));
    setUserArmies(updatedList);
    // 2) Save to localStorage
    saveUserArmies(updatedList);
    // 3) Close modal
    setSelectedArmyForModal(null);
  };

  // Called from the modal if user cancels
  const handleModalClose = () => {
    setSelectedArmyForModal(null);
  };

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

      {/* Step 1: Build new Army */}
      <FactionSelector
        selectedFaction={selectedFaction}
        onFactionChange={handleFactionChange}
      />
      <FactionUnitList faction={selectedFaction} onAddUnit={handleAddUnit} />
      <SelectedUnits units={chosenUnits} onRemove={handleRemoveChosenUnit} />
      <CustomArmyForm onSave={handleSaveArmy} />

      <hr style={{ margin: "20px 0", border: "1px solid #444" }} />

      {/* Step 2: Display saved armies, handle click => open modal */}
      <ArmyListDisplay
        armies={userArmies}
        onDeleteArmy={handleDeleteArmy}
        onSelectArmy={handleSelectArmy}
      />

      {/* The Army Modal, appears if an army was selected */}
      {selectedArmyForModal && (
        <ArmyModal
          army={selectedArmyForModal}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default UserArmyBuilder;

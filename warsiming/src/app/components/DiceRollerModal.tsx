"use client";

import React, { useState } from "react";
import "../styles/diceRollerModal.module.css";

enum DiceSides {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20,
}

const DiceRollerModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [numDice, setNumDice] = useState(1);
  const [numSides, setNumSides] = useState<DiceSides>(DiceSides.D6); // Default to D6
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const rolls = Array.from({ length: numDice }, () =>
        Math.floor(Math.random() * numSides) + 1
      );
      setResults(rolls);
      setRolling(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Dice Roller</h3>
        <div className="input-group">
          <label>
            Number of Dice:
            <input
              type="number"
              value={numDice}
              onChange={(e) => setNumDice(Number(e.target.value))}
              min="1"
            />
          </label>
          <label>
            Dice Type:
            <select
              value={numSides}
              onChange={(e) =>
                setNumSides(Number(e.target.value) as DiceSides)
              }
            >
              {Object.values(DiceSides)
                .filter((value) => typeof value === "number")
                .map((side) => (
                  <option key={side} value={side}>
                    {`D${side}`}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <button onClick={rollDice}>Roll Dice</button>
        <div className="results">
          <h4>Results:</h4>
          <div className="dice-results">
            {results.map((result, index) => (
              <div
                key={index}
                className={`dice-result ${rolling ? "rolling" : ""}`}
              >
                <span className="dice-number">{result}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DiceRollerModal;

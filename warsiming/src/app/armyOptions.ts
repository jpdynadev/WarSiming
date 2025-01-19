/**
 * armyOptions.ts
 * 
 * This file stores our “UnitTemplate” data for various factions.
 * Each entry in “armyOptions” is a UnitTemplate array (no unitId!).
 * 
 * When you actually add one of these templates to a user’s army,
 * you use your instantiateUnit(template) to assign a new unitId.
 */

import { v4 as uuidv4 } from "uuid";
import { UnitTemplate } from "./shared"; 
// ^ Make sure this path points to wherever you keep the “UnitTemplate” type

export const armyOptions: Record<string, UnitTemplate[]> = {
  // -----------------------
  // SPACE MARINES
  // -----------------------
  "Space Marines": [
    {
      name: "Tactical Squad",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Marine #${i + 1}`,
        health: 2, // 2 Wounds per Marine
      })),
      toughness: 4,
      save: 3,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      attacks: 1,
      damage: 1,
      ap: 0,
    },
    {
      name: "Intercessor Squad",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Intercessor #${i + 1}`,
        health: 2,
      })),
      toughness: 4,
      save: 3,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      attacks: 2,
      damage: 1,
      ap: 0,
    },
    {
      name: "Terminator Squad",
      models: Array.from({ length: 3 }, (_, i) => ({
        id: uuidv4(),
        name: `Terminator #${i + 1}`,
        health: 3,
      })),
      toughness: 4,
      save: 2,
      invulnerableSave: 5,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      attacks: 2,
      damage: 1,
      ap: 1,
    },
  ],

  // -----------------------
  // DEATH GUARD
  // -----------------------
  "Death Guard": [
    {
      name: "Poxwalkers",
      models: Array.from({ length: 10 }, (_, i) => ({
        id: uuidv4(),
        name: `Poxwalker #${i + 1}`,
        health: 1,
      })),
      toughness: 4,
      save: 7, // effectively no armor
      ballisticSkill: 6,
      weaponSkill: 5,
      strength: 3,
      attacks: 2,
      damage: 1,
      ap: 0,
    },
    {
      name: "Plague Marines",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Plague Marine #${i + 1}`,
        health: 2,
      })),
      toughness: 5,
      save: 3,
      invulnerableSave: 5,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
      attacks: 1,
      damage: 1,
      ap: 0,
    },
    {
      name: "Blightlord Terminators",
      models: Array.from({ length: 3 }, (_, i) => ({
        id: uuidv4(),
        name: `Blightlord #${i + 1}`,
        health: 3,
      })),
      toughness: 6,
      save: 2,
      invulnerableSave: 4,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 5,
      attacks: 2,
      damage: 1,
      ap: 1,
    },
  ],

  // -----------------------
  // ORKS
  // -----------------------
  "Orks": [
    {
      name: "Boyz",
      models: Array.from({ length: 10 }, (_, i) => ({
        id: uuidv4(),
        name: `Boy #${i + 1}`,
        health: 1,
      })),
      toughness: 5,
      save: 6,
      ballisticSkill: 5,
      weaponSkill: 3,
      strength: 4,
      attacks: 2,
      damage: 1,
      ap: 0,
    },
    {
      name: "Nobz",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Nob #${i + 1}`,
        health: 2,
      })),
      toughness: 5,
      save: 4,
      ballisticSkill: 5,
      weaponSkill: 3,
      strength: 5,
      attacks: 3,
      damage: 2,
      ap: 1,
    },
    {
      name: "Warboss",
      models: [
        {
          id: uuidv4(),
          name: "Warboss",
          health: 6,
        },
      ],
      toughness: 6,
      save: 4,
      ballisticSkill: 5,
      weaponSkill: 2,
      strength: 6,
      attacks: 5,
      damage: 2,
      ap: 2,
    },
  ],

  // -----------------------
  // T'AU
  // -----------------------
  "Tau": [
    {
      name: "Fire Warriors",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Fire Warrior #${i + 1}`,
        health: 1,
      })),
      toughness: 3,
      save: 4,
      ballisticSkill: 4,
      weaponSkill: 5,
      strength: 3,
      attacks: 1,
      damage: 1,
      ap: 0,
    },
    {
      name: "Crisis Battlesuits",
      models: Array.from({ length: 3 }, (_, i) => ({
        id: uuidv4(),
        name: `Battlesuit #${i + 1}`,
        health: 3,
      })),
      toughness: 5,
      save: 3,
      invulnerableSave: 4,
      ballisticSkill: 4,
      weaponSkill: 5,
      strength: 5,
      attacks: 2,
      damage: 2,
      ap: 1,
    },
    {
      name: "Riptide Battlesuit",
      models: [
        {
          id: uuidv4(),
          name: "Riptide",
          health: 14,
        },
      ],
      toughness: 8,
      save: 2,
      invulnerableSave: 4,
      ballisticSkill: 4,
      weaponSkill: 5,
      strength: 7,
      attacks: 3,
      damage: 3,
      ap: 2,
    },
  ],

  // -----------------------
  // TYRANIDS
  // -----------------------
  "Tyranids": [
    {
      name: "Termagants",
      models: Array.from({ length: 10 }, (_, i) => ({
        id: uuidv4(),
        name: `Termagant #${i + 1}`,
        health: 1,
      })),
      toughness: 3,
      save: 5,
      ballisticSkill: 4,
      weaponSkill: 5,
      strength: 3,
      attacks: 1,
      damage: 1,
      ap: 0,
    },
    {
      name: "Genestealers",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Genestealer #${i + 1}`,
        health: 1,
      })),
      toughness: 4,
      save: 5,
      invulnerableSave: 5,
      ballisticSkill: 6,
      weaponSkill: 2,
      strength: 4,
      attacks: 3,
      damage: 1,
      ap: 1,
    },
    {
      name: "Hive Tyrant",
      models: [
        {
          id: uuidv4(),
          name: "Hive Tyrant",
          health: 9,
        },
      ],
      toughness: 8,
      save: 3,
      invulnerableSave: 4,
      ballisticSkill: 3,
      weaponSkill: 2,
      strength: 7,
      attacks: 5,
      damage: 3,
      ap: 2,
    },
  ],

  // -----------------------
  // ADEPTUS CUSTODES
  // -----------------------
  "Adeptus Custodes": [
    {
      name: "Custodian Guard",
      models: Array.from({ length: 3 }, (_, i) => ({
        id: uuidv4(),
        name: `Custodian #${i + 1}`,
        health: 3,
      })),
      toughness: 5,
      save: 2,
      invulnerableSave: 4,
      ballisticSkill: 2,
      weaponSkill: 2,
      strength: 5,
      attacks: 3,
      damage: 2,
      ap: 1,
    },
    {
      name: "Custodian Wardens",
      models: Array.from({ length: 3 }, (_, i) => ({
        id: uuidv4(),
        name: `Warden #${i + 1}`,
        health: 3,
      })),
      toughness: 5,
      save: 2,
      invulnerableSave: 4,
      ballisticSkill: 2,
      weaponSkill: 2,
      strength: 5,
      attacks: 4,
      damage: 2,
      ap: 2,
    },
    {
      name: "Trajann Valoris",
      models: [
        {
          id: uuidv4(),
          name: "Trajann Valoris",
          health: 6,
        },
      ],
      toughness: 5,
      save: 2,
      invulnerableSave: 4,
      ballisticSkill: 2,
      weaponSkill: 2,
      strength: 5,
      attacks: 5,
      damage: 3,
      ap: 2,
    },
  ],
};

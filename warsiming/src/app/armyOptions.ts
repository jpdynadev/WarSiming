import { v4 as uuidv4 } from "uuid";
import { UnitTemplate } from "./shared"; // Adjust the import path as necessary

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
      leadership: 6,
      oc: 2,
      attacks: [
        {
          name: "Boltgun",
          type: "ranged",
          range: 24,
          attacks: 2,
          skill: 3,
          strength: 4,
          ap: 0,
          damage: 1,
        },
        {
          name: "Bolt Pistol",
          type: "ranged",
          range: 12,
          attacks: 1,
          skill: 3,
          strength: 4,
          ap: 0,
          damage: 1,
        },
        {
          name: "Close Combat Weapon",
          type: "melee",
          attacks: 1,
          skill: 3,
          strength: 4,
          ap: 0,
          damage: 1,
        },
      ],
    },
    // Additional Space Marine units...
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
      leadership: 7,
      oc: 2,
      attacks: [
        {
          name: "Slugga",
          type: "ranged",
          range: 12,
          attacks: 1,
          skill: 5,
          strength: 4,
          ap: 0,
          damage: 1,
        },
        {
          name: "Choppa",
          type: "melee",
          attacks: 2,
          skill: 3,
          strength: 4,
          ap: 0,
          damage: 1,
        },
      ],
    },
    // Additional Ork units...
  ],

  // -----------------------
  // T'AU
  // -----------------------
  "T'au": [
    {
      name: "Fire Warriors",
      models: Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Fire Warrior #${i + 1}`,
        health: 1,
      })),
      toughness: 3,
      save: 4,
      leadership: 7,
      oc: 2,
      attacks: [
        {
          name: "Pulse Rifle",
          type: "ranged",
          range: 30,
          attacks: 2,
          skill: 4,
          strength: 5,
          ap: 0,
          damage: 1,
        },
        {
          name: "Close Combat Weapon",
          type: "melee",
          attacks: 1,
          skill: 5,
          strength: 3,
          ap: 0,
          damage: 1,
        },
      ],
    },
    // Additional T'au units...
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
      leadership: 8,
      oc: 2,
      attacks: [
        {
          name: "Fleshborer",
          type: "ranged",
          range: 12,
          attacks: 1,
          skill: 4,
          strength: 5,
          ap: 0,
          damage: 1,
        },
        {
          name: "Claws",
          type: "melee",
          attacks: 1,
          skill: 5,
          strength: 3,
          ap: 0,
          damage: 1,
        },
      ],
    },
    // Additional Tyranid units...
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
      leadership: 5,
      oc: 3,
      attacks: [
        {
          name: "Guardian Spear (Shooting)",
          type: "ranged",
          range: 24,
          attacks: 2,
          skill: 2,
          strength: 4,
          ap: -1,
          damage: 2,
        },
        {
          name: "Guardian Spear (Melee)",
          type: "melee",
          attacks: 3,
          skill: 2,
          strength: 7,
          ap: -3,
          damage: 2,
        },
      ],
    },
    // Additional Adeptus Custodes units...
  ],
};

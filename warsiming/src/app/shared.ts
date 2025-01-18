import { v4 as uuidv4 } from "uuid";

// Define a Model
export type Model = {
  id: string; // Unique identifier for each model
  health: number; // Health of the model
};

// Define a Unit
export type Unit = {
  name: string; // Name of the unit
  models: Model[]; // List of models in the unit
  toughness: number; // Toughness characteristic
  save: number; // Save characteristic
  invulnerableSave?: number; // Invulnerable save characteristic
  attacks: number; // Number of attacks per model
  ballisticSkill: number; // Ballistic skill
  weaponSkill: number; // Weapon skill
  strength: number; // Strength characteristic
};

export const armyOptions: Record<string, Unit[]> = {
  Generic: [],
  "Death Guard": [
    {
      name: "Plague Marine",
      models: Array(5) // 5 models with 10 health each
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 10 })),
      toughness: 4,
      save: 3,
      invulnerableSave: 5,
      attacks: 1,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
    },
    {
      name: "Blightlord Terminator",
      models: Array(3) // 3 models with 15 health each
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 15 })),
      toughness: 5,
      save: 2,
      invulnerableSave: 4,
      attacks: 3,
      ballisticSkill: 3,
      weaponSkill: 2,
      strength: 5,
    },
    {
      name: "Foetid Bloat-Drone",
      models: Array(1) // 1 model with 20 health
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 20 })),
      toughness: 7,
      save: 3,
      invulnerableSave: 4,
      attacks: 2,
      ballisticSkill: 4,
      weaponSkill: 4,
      strength: 6,
    },
  ],
  "Space Marines": [
    {
      name: "Tactical Marine",
      models: Array(5) // 5 models with 8 health each
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 8 })),
      toughness: 4,
      save: 3,
      invulnerableSave: undefined,
      attacks: 1,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 4,
    },
    {
      name: "Assault Terminator",
      models: Array(2) // 2 models with 12 health each
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 12 })),
      toughness: 4,
      save: 2,
      invulnerableSave: 4,
      attacks: 2,
      ballisticSkill: 3,
      weaponSkill: 2,
      strength: 5,
    },
    {
      name: "Dreadnought",
      models: Array(1) // 1 model with 25 health
        .fill(null)
        .map(() => ({ id: uuidv4(), health: 25 })),
      toughness: 7,
      save: 3,
      invulnerableSave: 5,
      attacks: 3,
      ballisticSkill: 3,
      weaponSkill: 3,
      strength: 6,
    },
  ],
};

  
  // Dice Sides Enum
  export enum DiceSides {
    D4 = 4,
    D6 = 6,
    D8 = 8,
    D10 = 10,
    D12 = 12,
    D20 = 20,
  }
  
  // Shared Attack Logic
  export const resolveAttack = (
    attacker: Unit,
    defender: Unit,
    isMelee: boolean
  ): string => {
    let results = "";
  
    // 1. Hit Rolls
    const skill = isMelee ? attacker.weaponSkill : attacker.ballisticSkill;
    const hits = Array.from({ length: attacker.attacks }, () =>
      Math.floor(Math.random() * 6) + 1
    ).filter((roll) => roll >= skill);
  
    results += `Hits: ${hits.length}/${attacker.attacks}\n`;
  
    // 2. Wound Rolls
    const woundRolls = hits.map(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      if (attacker.strength >= 2 * defender.toughness) return roll >= 2;
      if (attacker.strength > defender.toughness) return roll >= 3;
      if (attacker.strength === defender.toughness) return roll >= 4;
      if (attacker.strength < defender.toughness / 2) return roll >= 6;
      return roll >= 5;
    });
  
    const wounds = woundRolls.filter((wound) => wound).length;
    results += `Wounds: ${wounds}/${hits.length}\n`;
  
    // 3. Saving Throws
    const saves = Array.from({ length: wounds }, () =>
      Math.floor(Math.random() * 6) + 1
    ).filter((roll) => roll >= (defender.invulnerableSave ?? defender.save));
  
    const failedSaves = wounds - saves.length;
    results += `Failed Saves: ${failedSaves}/${wounds}\n`;
  
    // 4. Inflict Damage
    const damage = failedSaves;
    results += `Damage: ${damage}\n`;
  
    return results;
  };
  
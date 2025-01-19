# Warhammer 40k Battle Simulator

A simple web-based application for simulating Warhammer 40k–style battles. Choose armies, add units, and roll attacks to see which side wins! Built with **Next.js** and **TypeScript**, featuring a grimdark UI and responsive layout.

## Features

- **Add Armies & Units**  
  Each side (Left/Right) can add multiple squads from various factions (e.g., Space Marines, Death Guard, Orks, Tau, Tyranids, Adeptus Custodes).

- **Unit Management**  
  Displays each unit’s models, health, and basic stats (WS/BS, Strength, Toughness, etc.).

- **Click-Based Attacker/Defender Selection**  
  First click chooses Attacker, second click (from the opposing side) chooses Defender.

- **Rolling Attacks**  
  Dice-based roll-to-hit, roll-to-wound, save rolls, and damage application.

- **Continuous Damage**  
  Keeps track of wounded models, applying leftover damage to the same model until it dies.

- **Responsive UI**  
  Scales nicely for mobile (iPhone, Android) and desktop devices.

- **Dark, Grimdark Theme**  
  Warhammer-inspired styling with red highlights and bleak backgrounds.

## Prerequisites

- **Node.js** (v16+ recommended)
- **npm** or **yarn** package manager
- **Git** (to clone the repository)

## Getting Started

1. **Clone this repository**:
   ```bash
   git clone https://github.com/your-username/warhammer-battle-sim.git
   cd warhammer-battle-sim

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
3. **Run the development server:**
    ```bash 
    npm run dev
    # or
    yarn dev

4. **Open the simulator in your browser at:**
 http://localhost:3000
 
## Project Structure
```arduino
src/
  app/
    layout.tsx        // Next.js root layout (includes viewport meta)
    globals.css       // Global CSS (dark theme, resets)
    page.tsx          // Home page
    components/
      ParentComponent.tsx  // Main container hooking up ArmyList + BattleArea
      ArmyList.tsx         // UI for selecting factions, adding units
      BattleArea.tsx       // Logic and display for rolling attacks, applying damage
      ...
    styles/
      armyList.module.css  // ArmyList-specific CSS
      battleArea.module.css// BattleArea-specific CSS
      ...
  shared/
    types.ts          // Type definitions for Unit, Model, etc.
    armyOptions.ts    // Unit templates for each faction (Space Marines, Orks, etc.)
    ...

```

* ParentComponent

    Coordinates the left/right armies (or attacker/defender, if you prefer).

* ArmyList

    Renders a dropdown to pick a faction, “Add Unit” buttons, and displays the current squads.

* BattleArea

    Shows two sides (Left & Right). Selecting a unit first sets the Attacker; second sets the Defender. Dice rolling logic resides here.

### Usage

1. Select Faction in ArmyList (e.g., “Space Marines”).
2. Add the desired squads (Tactical Marines, Poxwalkers, etc.).
3. In BattleArea, click one unit on the left (Attacker), then one on the right (Defender).
4. Roll Attack:

    * Dice appear for Hits, Wounds, Saves.


    * Damage is applied to the targeted models.
5. Observe updates to model health in each unit.
Repeat as desired.

### Contributing

Fork the repository.

1. Create a branch for your feature or bug fix:

```bash
git checkout -b feature/amazing-feature
```
2. Commit changes:
```bash
git commit -m 'Add some feature'
```
3. Push to the branch:
```bash
git push origin feature/amazing-feature
```
4. Open a Pull Request on GitHub.

## Future Plans
More advanced 40k rules (e.g., re-rolls, AP modifiers, multi-damage weapons).
Save logs of battles or user profiles.
Incorporate special faction rules or expansions.

Enjoy the Grimdark! For questions or suggestions, open an issue or a pull request. May your dice always roll high!
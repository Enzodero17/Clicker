# RPG Pirate Clicker

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

> **Un jeu incrémental (Idle Game) complet et évolutif développé avec Next.js et TypeScript.**

Ce projet est une démonstration technique de la gestion d'états complexes, de boucles de jeu performantes et de calculs mathématiques exponentiels au sein d'une application React moderne.

---

## Aperçu

*(Ajoutez une capture d'écran : `![Screenshot](/public/screenshot.png)`) *

## Stack Technique

Ce projet a été conçu pour être performant, maintenable et typé rigoureusement.

* **Framework :** [Next.js 14](https://nextjs.org/) (App Router)
* **Langage :** [TypeScript](https://www.typescriptlang.org/) (Interfaces strictes, Types personnalisés)
* **Styling :** [Tailwind CSS](https://tailwindcss.com/) (Design System, Animations, Glassmorphism)
* **State Management :** React Hooks natifs (`useState`, `useMemo`, `useRef`, `useEffect`)
* **Persistance :** LocalStorage API avec gestion de versions et de rétrocompatibilité

---

## Compétences Clés Démontrées

### 1. Architecture & "Clean Code"
Le projet suit une séparation stricte des responsabilités pour faciliter la maintenance et l'évolutivité :
* `config/` : Données statiques (équilibrage du jeu, assets, constantes) séparées de la logique.
* `utils/` : Fonctions pures pour les calculs mathématiques complexes (isolées de React).
* `components/` : Composants UI réutilisables et "dumb" (présentationnels).
* `types/` : Définitions TypeScript partagées pour garantir la cohérence des données à travers l'application.

### 2. Gestion de la "Game Loop" (Boucle de Jeu)
Implémentation d'un moteur de jeu web non bloquant :
* Utilisation de `setInterval` combiné à `useRef` pour le suivi précis du temps.
* Calcul du **Delta Time (`dt`)** pour compenser les fluctuations de framerate du navigateur et assurer une progression fluide et juste des gains, peu importe la puissance de la machine.

### 3. Optimisation des Performances
Avec des recalculs effectués 10 fois par seconde, l'optimisation est critique :
* Utilisation intensive de **`useMemo`** pour mettre en cache les calculs lourds (DPS total, cumuls de bonus multiplicateurs) et éviter les re-renders inutiles.
* Gestion des animations CSS via GPU (Transform/Opacity) plutôt que par JavaScript pour maintenir 60 FPS.

### 4. Mathématiques & Algorithmes
Gestion de la progression exponentielle typique des jeux incrémentaux :
* **Croissance Exponentielle :** Formules de coûts (`Base * Growth^Count`).
* **Notation Scientifique :** Algorithme de formatage personnalisé pour gérer les très grands nombres (1K, 1M, 1B, 1T, 1aa...).
* **Logique "Infinie" :** Système de succès (Achievements) basé sur des algorithmes logarithmiques (`Math.log10`) pour générer des paliers à l'infini sans coder chaque niveau manuellement.

### 5. Système de Sauvegarde & Offline
* Sérialisation/Désérialisation JSON robuste avec gestion d'erreurs (`try/catch`).
* **Calcul des gains Offline :** Comparaison de `Date.now()` entre la dernière sauvegarde et la connexion actuelle pour simuler la progression pendant l'absence du joueur.

---

## Fonctionnalités Principales

* **Combat Hybride :** Système de DPS passif (alliés) et de dégâts actifs (clic).
* **Progression par Zones :** Changement d'ambiance, Boss tous les 5 niveaux, Checkpoints en cas de défaite.
* **Économie Complexe :** Achat de personnages, améliorations exponentielles, Artefacts.
* **Système de Prestige (Ascension) :** Mécanique de "Soft Reset" permettant de recommencer avec des multiplicateurs permanents (Gemmes d'âme).
* **Succès Dynamiques :** Système de récompenses qui s'adapte automatiquement et infiniment au niveau du joueur.
* **UI/UX Moderne :** Interface réactive, modales, feedbacks visuels (textes flottants), design sombre "Glassmorphism".

---

## Structure du Projet

```bash
├── app/
│   ├── globals.css      # Styles globaux & Animations CSS
│   ├── layout.tsx       # Configuration Meta & Fontes
│   └── page.tsx         # Logique principale (Game Loop & State)
├── components/
│   ├── AchievementsModal.tsx # Modale des succès infinis
│   ├── ArtifactsPanel.tsx    # Panneau des améliorations passives
│   ├── FloatingLayer.tsx     # Gestion des particules (Dégâts/Or)
│   ├── GameHeader.tsx        # HUD (Or, Niveau, DPS)
│   ├── MonsterZone.tsx       # Affichage ennemi & Barres de vie
│   ├── OfflineModal.tsx      # Popup de retour (Gains offline)
│   ├── ProfileModal.tsx      # Statistiques persistantes
│   └── UpgradeShop.tsx       # Boutique d'achat & Prestige
├── config/
│   └── gameData.ts      # Constantes d'équilibrage (HP, coûts…)
├── types/
│   └── index.ts         # Interfaces TypeScript
└── utils/
    └── gameFormulas.ts  # Logique métier pure (maths)
```

## Installation & Lancement

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/rpg-pirate-clicker.git
cd rpg-pirate-clicker
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🔮 Évolutions Futures

- [ ] Ajout de compétences actives (skills avec cooldowns)
- [ ] Système de familiers (pets) pour bonus passifs
- [ ] Sauvegarde cloud (Firebase / Supabase)
- [ ] Classement en ligne (leaderboard)

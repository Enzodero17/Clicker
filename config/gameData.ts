import {UpgradeItem, BonusItem, InfiniteAchievement, GameStats} from "@/types";

/**
 * Clé utilisée pour stocker la sauvegarde dans le localStorage du navigateur.
 * Changer cette clé permet de forcer une nouvelle sauvegarde (utile en cas de refonte majeure).
 */
export const SAVE_KEY = 'rpgClickerSave_v6_Refactored';

/** Temps de base alloué pour vaincre les ennemis normaux (en secondes). */
export const BASE_TIME = 30;

/** Temps de base alloué pour vaincre les Boss (en secondes). */
export const BOSS_TIME = 30;

/** Points de Vie (HP) de base pour le premier ennemi du niveau 1. */
export const BASE_HP = 10;

/** Niveau requis pour débloquer la fonctionnalité de Prestige (Renaissance). */
export const PRESTIGE_UNLOCK_LEVEL = 50;

/**
 * Bonus multiplicatif par Gemme d'Âme obtenue lors du Prestige.
 * 0.1 correspond à +10% de bonus par gemme.
 */
export const PRESTIGE_BONUS_PER_GEM = 0.1;

/**
 * État initial des statistiques du joueur.
 * Utilisé lors de la création d'une nouvelle partie.
 */
export const INITIAL_STATS: GameStats = {
    maxLevel: 1,
    maxGold: 0,
    maxDps: 0,
    totalKills: 0,
    totalClicks: 0,
    totalPlayTime: 0,
    prestigeCount: 0,
    playerId: '',
};

/**
 * Liste des images d'arrière-plan pour les différentes zones.
 * L'index correspond à la zone (0 = Zone 1, 1 = Zone 2, etc.).
 */
export const BACKGROUNDS = [
    "/backgrounds/Village Fuchsia.png",
    "/backgrounds/Shells Town.png",
    "/backgrounds/Village Orange.png",
    "/backgrounds/Village Sirop.png",
    "/backgrounds/Baratie.png",
];

// --- LISTES D'ENNEMIS PAR ZONE ---
// Ces tableaux contiennent les chemins vers les images des ennemis normaux.
// Le jeu cycle à travers ces images pour varier les visuels.

export const ENNEMIES = [
    "/ennemies/Alvida/Soldat 1.png",
    "/ennemies/Alvida/Soldat 2.png",
    "/ennemies/Alvida/Soldat 3.png",
    "/ennemies/Alvida/Soldat 4.png",
    "/ennemies/Alvida/Soldat 5.png",
    "/ennemies/Alvida/Soldat 6.png",
    "/ennemies/Alvida/Soldat 7.png",
];

export const ENNEMIES_2 = [
    "/ennemies/Morgan/Agent 1.png",
    "/ennemies/Morgan/Agent 2.png",
    "/ennemies/Morgan/Marine 1.png",
    "/ennemies/Morgan/Marine 2.png",
    "/ennemies/Morgan/Marine 3.png",
    "/ennemies/Morgan/Marine 4.png",
];

export const ENNEMIES_3 = [
    "/ennemies/Baggy/Soldat 1.png",
    "/ennemies/Baggy/Soldat 2.png",
    "/ennemies/Baggy/Soldat 3.png",
    "/ennemies/Baggy/Soldat 4.png",
    "/ennemies/Baggy/Soldat 5.png",
];

export const ENNEMIES_4 = [
    "/ennemies/Kuro/Soldat 1.png",
    "/ennemies/Kuro/Soldat 2.png",
    "/ennemies/Kuro/Soldat 3.png",
    "/ennemies/Kuro/Soldat 4.png",
    "/ennemies/Kuro/Soldat 5.png",
];

export const ENNEMIES_5 = [
    "/ennemies/Krieg/Soldat 1.png",
    "/ennemies/Krieg/Soldat 2.png",
    "/ennemies/Krieg/Soldat 3.png",
    "/ennemies/Krieg/Soldat 4.png",
    "/ennemies/Krieg/Soldat 5.png",
];

export const ENNEMIES_6 = [
    "/ennemies/Arlong/Soldat 1.png",
    "/ennemies/Arlong/Soldat 2.png",
    "/ennemies/Arlong/Soldat 3.png",
    "/ennemies/Arlong/Soldat 4.png",
    "/ennemies/Arlong/Soldat 5.png",
];

export const ENNEMIES_7 = [
    "/ennemies/Smoker/Marine 1.png",
    "/ennemies/Smoker/Marine 2.png",
    "/ennemies/Smoker/Marine 3.png",
    "/ennemies/Smoker/Marine 4.png",
    "/ennemies/Smoker/Marine 5.png",
];

/**
 * Liste des Boss qui apparaissent tous les 5 niveaux.
 * L'ordre correspond à leur apparition dans le jeu (Boss 1 au niveau 5, Boss 2 au niveau 10, etc.).
 */
export const BOSSES = [
    "/ennemies/Higuma.png",
    "/ennemies/Higuma.png",
    "/ennemies/Higuma.png",
    "/ennemies/Alvida.png",
    "/ennemies/Alvida.png",
    "/ennemies/Alvida.png", // Niveau 30 (Fin Zone 1)

    "/ennemies/Helmep.png",
    "/ennemies/Morgan.png",
    "/ennemies/Helmep.png",
    "/ennemies/Morgan.png",
    "/ennemies/Helmep.png",
    "/ennemies/Morgan.png", // Niveau 60 (Fin Zone 2)

    "/ennemies/Morge.png",
    "/ennemies/Cabaji.png",
    "/ennemies/Baggy 1.png",
    "/ennemies/Morge.png",
    "/ennemies/Cabaji.png",
    "/ennemies/Baggy 2.png",
    "/ennemies/Morge.png",
    "/ennemies/Cabaji.png",
    "/ennemies/Baggy 2.png", // Niveau 105 (Fin Zone 3)

    "/ennemies/Buchi.png",
    "/ennemies/Sham.png",
    "/ennemies/Buchi.png",
    "/ennemies/Sham.png",
    "/ennemies/Jango.png",
    "/ennemies/Buchi.png",
    "/ennemies/Sham.png",
    "/ennemies/Kuro 1.png",
    "/ennemies/Jango.png",
    "/ennemies/Kuro 2.png",
    "/ennemies/Jango.png",
    "/ennemies/Kuro 2.png", // Niveau 165 (Fin Zone 4)

    "/ennemies/FullBody.png",
    "/ennemies/FullBody.png",
    "/ennemies/FullBody.png",
    "/ennemies/Mihawk.png",
    "/ennemies/Pearl 1.png",
    "/ennemies/Gin 1.png",
    "/ennemies/Pearl 2.png",
    "/ennemies/Gin 2.png",
    "/ennemies/Krieg 1.png",
    "/ennemies/Pearl 2.png",
    "/ennemies/Gin 2.png",
    "/ennemies/Krieg 2.png",
    "/ennemies/Krieg 2.png", // Niveau 230 (Fin Zone 5)

    "/ennemies/Smack.png",
    "/ennemies/Kuroobi.png",
    "/ennemies/Octi 1.png",
    "/ennemies/Smack.png",
    "/ennemies/Kuroobi.png",
    "/ennemies/Octi 2.png",
    "/ennemies/Arlong 1.png",
    "/ennemies/Smack.png",
    "/ennemies/Kuroobi.png",
    "/ennemies/Octi 2.png",
    "/ennemies/Arlong 2.png",
    "/ennemies/Arlong 2.png",
    "/ennemies/Nezumi.png",
    "/ennemies/Nezumi.png",
    "/ennemies/Nezumi.png", // Niveau 305 (Fin Zone 6)

    "/ennemies/Tashigi 1.png",
    "/ennemies/Smoker 1.png",
    "/ennemies/Alvida 2.png",
    "/ennemies/Tashigi 2.png",
    "/ennemies/Smoker 2.png",
    "/ennemies/Baggy 2.png",
    "/ennemies/Tashigi 2.png",
    "/ennemies/Smoker 2.png", // Niveau 345 (Fin Zone 7)
];

/**
 * Liste des alliés achetables (Héros).
 * Chaque héros a un coût de base, des dégâts (DPS) et parfois de l'or par seconde (GPS).
 * Certains héros évoluent visuellement (images multiples).
 */
export const CARACTERS_DATA: UpgradeItem[] = [
    {
        id: 'luffy',
        name: 'Monkey D. Luffy',
        image: '/allies/Luffy1.png',
        images: [
            '/allies/Luffy/Luffy2.png',
            '/allies/Luffy/Luffy3.png',
            '/allies/Luffy/Luffy4.png',
            '/allies/Luffy/Luffy5.png',
        ],
        unlockLevel: 1,
        baseCost: 50,
        baseDps: 5,
        baseGps: 0,
        costGrowth: 1.2,
        dpsGrowth: 1.01,
        maxLevel: 1000,
    },
    {
        id: 'higuma',
        name: 'Higuma',
        image: '/allies/Higuma.png',
        unlockLevel: 16,
        baseCost: 250,
        baseDps: 3,
        baseGps: 0,
        costGrowth: 1.3,
        dpsGrowth: 1.1,
        maxLevel: 75,
    },
    {
        id: 'koby',
        name: 'Koby',
        image: '/allies/Koby/Koby 1.png',
        images: [
            '/allies/Koby/Koby 2.png',
        ],
        unlockLevel: 21,
        baseCost: 500,
        baseDps: 0,
        baseGps: 50,
        costGrowth: 1.3,
        dpsGrowth: 0,
        maxLevel: 100,
    },
    {
        id: 'alvida',
        name: 'Alvida',
        image: '/allies/Alvida/Alvida 1.png',
        images: [
            '/allies/Alvida/Alvida 2.png',
        ],
        unlockLevel: 31,
        baseCost: 750,
        baseDps: 5,
        baseGps: 0,
        costGrowth: 1.3,
        dpsGrowth: 1.1,
        maxLevel: 100,
    },
    {
        id: 'zoro',
        name: 'Roronoa Zoro',
        image: '/allies/Zoro/Zoro1.png',
        images: [
            '/allies/Zoro/Zoro2.png',
            '/allies/Zoro/Zoro3.png',
            '/allies/Zoro/Zoro4.png',
        ],
        unlockLevel: 36,
        baseCost: 1000,
        baseDps: 7,
        baseGps: 0,
        costGrowth: 1.2,
        dpsGrowth: 1.02,
        maxLevel: 1000,
    },
    {
        id: 'hermep',
        name: 'Hermep',
        image: '/allies/Hermep/Hermep 1.png',
        images: [
            '/allies/Alvida/Hermep 2.png',
        ],
        unlockLevel: 56,
        baseCost: 1250,
        baseDps: 0,
        baseGps: 100,
        costGrowth: 1.6,
        dpsGrowth: 0,
        maxLevel: 100,
    },
    {
        id: 'Morgan',
        name: 'Morgan le Hacheur',
        image: '/allies/Morgan.png',
        unlockLevel: 61,
        baseCost: 1500,
        baseDps: 6,
        baseGps: 0,
        costGrowth: 1.6,
        dpsGrowth: 1.11,
        maxLevel: 75,
    },
    {
        id: 'morge',
        name: 'Morge',
        image: '/allies/Morge.png',
        unlockLevel: 96,
        baseCost: 3000,
        baseDps: 7,
        baseGps: 0,
        costGrowth: 1.7,
        dpsGrowth: 1.12,
        maxLevel: 75,
    },
    {
        id: 'cabaji',
        name: 'Cabaji',
        image: '/allies/Cabaji.png',
        unlockLevel: 101,
        baseCost: 4000,
        baseDps: 8,
        baseGps: 0,
        costGrowth: 1.8,
        dpsGrowth: 1.12,
        maxLevel: 75,
    },
    {
        id: 'baggy',
        name: 'Baggy le Clown',
        image: '/allies/Baggy/Baggy 1.png',
        images: [
            '/allies/Baggy/Baggy 2.png',
        ],
        unlockLevel: 105,
        baseCost: 5000,
        baseDps: 10,
        baseGps: 0,
        costGrowth: 1.8,
        dpsGrowth: 1.15,
        maxLevel: 500,
    },
];

/**
 * Liste des Artefacts (Bonus passifs).
 * Ils s'achètent pour obtenir des multiplicateurs globaux ou des utilitaires (temps, critique).
 */
export const ARTIFACTS_DATA: BonusItem[] = [
    {
        id: 'berry',
        name: 'Boost Berrys',
        image: '/bonus/Bonus 1.png',
        description: "Augmente tous les gains d'or.",
        baseCost: 1000,
        costGrowth: 2.5,
        globalDpsMultiplier: 0,
        globalGoldMultiplier: 0.5,
        timeBonus: 0,
    },
    {
        id: 'armement',
        name: 'Haki de l\'Armement',
        image: '/bonus/Bonus 4.png',
        description: "Augmente les DPS de tout le monde.",
        baseCost: 2000,
        costGrowth: 3,
        globalDpsMultiplier: 0.1,
        globalGoldMultiplier: 0,
        timeBonus: 0,
    },
    {
        id: 'observation',
        name: 'Haki de l\'Observation',
        image: '/bonus/Bonus 3.png',
        description: "Ajoute du temps au compteur pour chaque niveau.",
        baseCost: 5000,
        costGrowth: 6,
        globalDpsMultiplier: 0,
        globalGoldMultiplier: 0,
        timeBonus: 2,
    },
    {
        id: 'rois',
        name: 'Haki des Rois',
        image: '/bonus/Bonus 2.png',
        description: "Bonus massif de dégâts contre les BOSS.",
        baseCost: 1500,
        costGrowth: 10,
        globalDpsMultiplier: 0,
        globalGoldMultiplier: 0,
        timeBonus: 0,
        bossDamageMultiplier: 0.5,
    }
];

/**
 * Liste des Succès "Infinis".
 * Ces succès s'adaptent automatiquement à la progression du joueur.
 * stepPower définit l'écart entre chaque palier (linéaire pour level, exponentiel pour or/dps).
 */
export const INFINITE_ACHIEVEMENTS: InfiniteAchievement[] = [
    {
        id: 'master_pirate',
        name: 'Roi des Pirates',
        type: 'level',
        icon: '🏴‍☠️',
        description: 'Basé sur votre niveau actuel.',
        baseThreshold: 10,
        stepPower: 10,
        rewardType: 'dps',
        rewardPerLevel: 0.1,
        color: 'from-blue-600 to-blue-400'
    },
    {
        id: 'gold_hoarder',
        name: 'Trésor Légendaire',
        type: 'gold',
        icon: '💰',
        description: 'Basé sur votre or.',
        baseThreshold: 1000,
        stepPower: 1000,
        rewardType: 'gold',
        rewardPerLevel: 0.5,
        color: 'from-yellow-600 to-yellow-400'
    },
    {
        id: 'power_overwhelming',
        name: 'Force Destructrice',
        type: 'dps',
        icon: '💪',
        description: 'Basé sur vos DPS globaux.',
        baseThreshold: 1000,
        stepPower: 1000,
        rewardType: 'dps',
        rewardPerLevel: 0.5,
        color: 'from-red-600 to-red-400'
    }
];
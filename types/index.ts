/**
 * Représente une unité ou un personnage que le joueur peut acheter et améliorer.
 * @property unlockLevel - Niveau de joueur requis pour voir/acheter cet item.
 * @property costGrowth - Facteur d'augmentation du prix.
 * @property dpsGrowth - Facteur d'augmentation des dégâts.
 */
export type UpgradeItem = {
    id: string;
    name: string;
    image: string;
    images?: string[];
    unlockLevel: number;
    baseCost: number;
    baseDps: number;
    baseGps: number;
    costGrowth: number;
    dpsGrowth: number;
    maxLevel?: number;
};

/**
 * Objet utilisé pour l'animation des textes flottants (Dégâts, Or, Critiques).
 * @property id - Timestamp unique pour la clé React.
 * @property value - La valeur numérique affichée.
 * @property color - Classe CSS Tailwind pour la couleur.
 */
export type FloatingText = {
    id: number;
    value: number;
    x: number;
    y: number;
    text?: string;
    color?: string;
};

/**
 * Représente un Artefact ou un Bonus passif.
 * Contrairement aux personnages, ils donnent souvent des multiplicateurs globaux (%).
 * @property globalDpsMultiplier - Bonus de dégâts en pourcentage (ex: 0.1 = +10%).
 * @property globalGoldMultiplier - Bonus d'or en pourcentage.
 * @property timeBonus - Temps supplémentaire ajouté aux combats de Boss (en secondes).
 */
export type BonusItem = {
    id: string;
    name: string;
    image: string;
    description: string;
    baseCost: number;
    costGrowth: number;
    globalDpsMultiplier: number;
    globalGoldMultiplier: number;
    timeBonus: number;
    bossDamageMultiplier?: number;
    criticalChance?: number;
};

/**
 * Type de condition pour les succès infinis.
 * - 'level' : Basé sur le niveau atteint (Linéaire).
 * - 'gold' | 'dps' : Basé sur une valeur exponentielle (Logarithmique).
 */
export type InfiniteAchievementType = 'level' | 'gold' | 'dps';

/**
 * Configuration d'un succès "Infini" qui s'adapte automatiquement à la progression.
 * @property baseThreshold - La valeur de départ pour le niveau 1 du succès.
 * @property stepPower - Le pas de progression :
 * - Si type='level' : Nombre de niveaux entre chaque palier (ex: 10).
 * - Si type='gold' : Puissance de 10 entre chaque palier (ex: 1000 = 10^3).
 * @property rewardPerLevel - Le bonus gagné à chaque niveau du succès (ex: 0.1 pour 10%).
 */
export interface InfiniteAchievement {
    id: string;
    name: string;
    type: InfiniteAchievementType;
    icon: string;
    description: string;
    baseThreshold: number;
    stepPower: number;
    rewardType: 'dps' | 'gold' | 'boss';
    rewardPerLevel: number;
    color: string;
}

/**
 * Statistiques persistantes du joueur (Profil).
 * Ces données ne sont JAMAIS remises à zéro lors d'un Prestige.
 * @property totalPlayTime - Temps de jeu cumulé en secondes.
 * @property playerId - Identifiant unique généré à la création de la sauvegarde.
 */
export type GameStats = {
    maxLevel: number;
    maxGold: number;
    maxDps: number;
    totalKills: number;
    totalClicks: number;
    totalPlayTime: number;
    prestigeCount: number;
    playerId: string;
};
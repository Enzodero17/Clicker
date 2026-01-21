import {
    BASE_HP,
    ENNEMIES,
    ENNEMIES_2,
    BOSSES,
    CARACTERS_DATA,
    ARTIFACTS_DATA,
    BACKGROUNDS,
    PRESTIGE_BONUS_PER_GEM,
    PRESTIGE_UNLOCK_LEVEL,
    INFINITE_ACHIEVEMENTS,
    ENNEMIES_3,
    ENNEMIES_4,
    ENNEMIES_5,
    ENNEMIES_7,
    ENNEMIES_6
} from "@/config/gameData";
import {UpgradeItem, BonusItem, InfiniteAchievement} from "@/types";

/**
 * Calcule le coût d'achat ou d'amélioration d'un artefact.
 * Formule exponentielle : Coût = Base * (Croissance ^ Niveau)
 * @param item - L'artefact concerné
 * @param count - Le niveau actuel de l'artefact (nombre possédé)
 */
export const getArtifactCost = (item: BonusItem, count: number) => {
    return Math.floor(item.baseCost * Math.pow(item.costGrowth, count));
};

/**
 * Récupère l'image du monstre ou du boss appropriée selon le niveau du stage.
 * Gère les différents biomes (Zones) et l'apparition des Boss tous les 5 niveaux.
 * @param lvl - Le niveau actuel du stage
 */
export const getMonsterImage = (lvl: number) => {
    // Zone 1
    if (lvl < 31) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES[(lvl - 1) % ENNEMIES.length];
    }
    // Zone 2
    else if (lvl < 61) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_2[(lvl - 1) % ENNEMIES_2.length];
    }
    // Zone 3
    else if (lvl < 106) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_3[(lvl - 1) % ENNEMIES_3.length];
    }
    // Zone 4
    else if (lvl < 166) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_4[(lvl - 1) % ENNEMIES_4.length];
    }
    // Zone 5
    else if (lvl < 231) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_5[(lvl - 1) % ENNEMIES_5.length];
    }
    // Zone 6
    else if (lvl < 306) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_6[(lvl - 1) % ENNEMIES_6.length];
    }
    // Zone 7
    else if (lvl < 346) {
        if (lvl % 5 === 0) return BOSSES[((lvl / 5) - 1) % BOSSES.length];
        return ENNEMIES_7[(lvl - 1) % ENNEMIES_7.length];
    }
};

/**
 * Calcule combien de Gemmes d'Âme le joueur gagne s'il effectue un Prestige maintenant.
 * @param level - Le niveau actuel du joueur
 * @returns Le nombre de gemmes (0 si le niveau requis n'est pas atteint)
 */
export const calculatePrestigeGain = (level: number) => {
    if (level < PRESTIGE_UNLOCK_LEVEL) {
        return 0;
    }
    // Formule : 1 gemme tous les 10 niveaux après le déblocage
    return Math.floor((level - PRESTIGE_UNLOCK_LEVEL) / 10) + 1;
}

/**
 * Formate les grands nombres en notation "Idle Game" (1K, 1M, 1A, 1B...).
 * @param num - Le nombre à formater
 * @returns Une chaîne de caractères (ex: "12.50A")
 */
export const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 1000) return Math.floor(num).toString();

    const suffixes = [
        "", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ];

    // On divise par 3 car chaque suffixe représente 10^3 (1000)
    const suffixIndex = Math.floor(Math.log10(num) / 3);

    // Si le nombre dépasse Z, on passe en notation scientifique
    if (suffixIndex >= suffixes.length) return num.toExponential(2);

    const dividedNum = num / Math.pow(1000, suffixIndex);
    const shortNum = parseFloat(dividedNum.toFixed(2));

    return shortNum + suffixes[suffixIndex];
}

/**
 * Calcule les Points de Vie (HP) d'un ennemi selon le niveau.
 * Applique des multiplicateurs exponentiels et des sauts de difficulté par "Tier" de monde.
 */
export const getEnemyHp = (lvl: number) => {
    let hp = BASE_HP * Math.pow(1.25, lvl - 1);

    // Les Boss ont 2.5x plus de PV
    if (lvl % 5 === 0) hp = hp * 2.5;

    return Math.floor(hp);
};

/**
 * Calcule la récompense en or de base pour un ennemi tué.
 * @returns Montant d'or (avant application des bonus joueur)
 */
export const getGoldReward = (lvl: number) => {
    let reward = Math.floor(10 * Math.pow(1.2, lvl - 1));
    const worldTier = Math.floor((lvl - 1) / 5);

    if (worldTier > 0) {
        reward = reward * Math.pow(2, worldTier);
    }

    // Les Boss donnent 3x plus d'or
    if (lvl % 5 === 0) reward *= 3;
    return reward;
};

/**
 * Détermine le niveau de réapparition après une défaite contre un Boss.
 * Renvoie au début du palier de 5 niveaux actuel (ex: mort au 25 -> retour au 21).
 */
export const getCheckpointLevel = (currentLvl: number) => {
    const checkpoint = Math.floor((currentLvl - 1) / 5) * 5 + 1;
    return Math.max(1, checkpoint);
};

/**
 * Calcule le coût d'achat d'un personnage (UpgradeItem).
 */
export const getItemCost = (item: UpgradeItem, count: number) => {
    return Math.floor(item.baseCost * Math.pow(item.costGrowth, count));
};

/**
 * Sélectionne l'image du personnage.
 * Permet l'évolution visuelle (changement de skin) quand le personnage dépasse le niveau 100.
 */
export const getUpgradeImage = (item: UpgradeItem, level: number) => {
    if(!item.images || item.images.length === 0 || level < 100) {
        return item.image;
    }

    const evolutionStage = Math.floor(level / 100) - 1;
    const safeIndex = Math.min(evolutionStage, item.images.length - 1);

    return item.images[safeIndex];
}

/**
 * Retourne l'image de fond (Background) en fonction de la zone (Niveau).
 */
export const getBackgroundImage = (level: number) => {
    if (level < 31) {
        return BACKGROUNDS[0];
    } else if (level < 61) {
        return BACKGROUNDS[1];
    } else if (level < 106) {
        return BACKGROUNDS[2];
    } else {
        return BACKGROUNDS[3];
    }
}

/**
 * Retourne le nom textuel de la zone actuelle pour l'affichage (UI).
 */
export const getZoneName = (level: number) => {
    if (level < 31) {
        return `Zone 1 : Village de Fuchsia`;
    } else if (level < 61) {
        return `Zone 2 : Shells Town`;
    } else if (level < 106) {
        return `Zone 3 : Orange Town`;
    } else {
        return `Zone 4 : Village de Sirop`;
    }
}

/**
 * Calcule la progression dynamique d'un "Succès Infini".
 * Gère deux types de logique :
 * 1. Linéaire ('level') : Progression simple (ex : Niveaux 10, 20, 30...)
 * 2. Logarithmique ('gold', 'dps') : Progression par puissance de 10 (ex : 1A, 1B...)
 * @param ach - La définition du succès
 * @param currentStats - Les statistiques temps réel du joueur
 * @returns Un objet contenant le niveau du succès, le % de progression, et le bonus actuel.
 */
export const getAchievementProgress = (
    ach: InfiniteAchievement,
    currentStats: {
        level: number,
        gold: number,
        dps: number
    }) => {
    let currentValue = 0;

    // Sélection de la stat concernée
    if (ach.type === 'level') currentValue = currentStats.level;
    else if (ach.type === 'gold') currentValue = currentStats.gold;
    else if (ach.type === 'dps') currentValue = currentStats.dps;

    // Sécurité : Si stepPower n'est pas défini, on met 10 pour éviter la division par zéro
    const step = ach.stepPower || 10;

    let currentLevel = 0;
    let nextThreshold = ach.baseThreshold;
    let prevThreshold = 0;

    // CALCUL DU NIVEAU DU SUCCÈS
    if (ach.type === 'level') {
        // LOGIQUE LINÉAIRE
        if (currentValue >= ach.baseThreshold) {
            currentLevel = Math.floor(currentValue / step);
            prevThreshold = currentLevel * step;
            nextThreshold = (currentLevel + 1) * step;
        } else {
            // Pas encore atteint le premier palier
            currentLevel = 0;
            prevThreshold = 0;
            nextThreshold = ach.baseThreshold;
        }
    } else {
        // LOGIQUE LOGARITHMIQUE (Puissances de 10)
        if (currentValue >= ach.baseThreshold) {
            const powerOf10 = Math.log10(currentValue);
            const stepPowerOf10 = Math.log10(step);

            currentLevel = Math.floor(powerOf10 / stepPowerOf10);

            // Calcul précis des bornes pour la barre de progression
            prevThreshold = Math.pow(10, currentLevel * stepPowerOf10);
            nextThreshold = Math.pow(10, (currentLevel + 1) * stepPowerOf10);
        } else {
            currentLevel = 0;
            prevThreshold = 0;
            nextThreshold = ach.baseThreshold;
        }
    }

    // CALCUL DU POURCENTAGE
    let percent = 0;
    if (nextThreshold > prevThreshold) {
        percent = ((currentValue - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    }

    // Sécurité visuelle (bornes 0-100%)
    percent = Math.max(0, Math.min(100, percent));

    return {
        level: currentLevel,
        percent,
        currentValue,
        nextThreshold,
        bonus: currentLevel * ach.rewardPerLevel
    };
};

/**
 * LE CŒUR MATHÉMATIQUE DU JEU.
 * Calcule les stats finales (DPS, GPS) en agrégeant toutes les sources de bonus.
 * * Ordre de calcul :
 * 1. Stats de base des personnages (Niveau * Base)
 * 2. Multiplicateurs de palier (tous les 25 niveaux)
 * 3. Artefacts
 * 4. Succès
 * 5. Prestige
 * * @returns Objet complet contenant DPS Total, GPS Total et détail des multiplicateurs.
 */
export const calculateTotalStats = (
    inventory: Record<string, number>,
    artifactsInventory: Record<string, number>,
    soulGems: number = 0,
    isBoss: boolean = false,
    currentLevelForCalc: number = 1
) => {
    let rawDps = 0;
    let rawGps = 0;

    // Calcul des stats de base des personnages
    CARACTERS_DATA.forEach(item => {
        const level = inventory[item.id] || 0;
        if (level > 0) {
            const growthMultiplier = item.dpsGrowth === 1 ? 1 : Math.pow(item.dpsGrowth, level);
            // Bonus x2 tous les 25 niveaux
            const mileStoneMultiplier = Math.pow(2, Math.floor(level / 25));

            rawDps += (item.baseDps * level) * growthMultiplier * mileStoneMultiplier;
            rawGps += (item.baseGps * level) * mileStoneMultiplier;
        }
    });

    // Initialisation des multiplicateurs globaux
    let dpsMultiplier = 1;
    let goldMultiplier = 1;
    let timeBonus = 0;
    let bossMultiplier = 1;

    // Application des Artefacts
    ARTIFACTS_DATA.forEach(art => {
        const count = artifactsInventory[art.id] || 0;
        if (count > 0) {
            dpsMultiplier += (art.globalDpsMultiplier * count);
            goldMultiplier += (art.globalGoldMultiplier * count);
            timeBonus += (art.timeBonus * count);

            if (art.bossDamageMultiplier) {
                bossMultiplier += (art.bossDamageMultiplier * count);
            }
        }
    });

    // Application des Succès (Uniquement 'level' ici pour éviter les boucles infinies sur DPS/Gold)
    const levelAch = INFINITE_ACHIEVEMENTS.find(elem => elem.type === 'level');
    if (levelAch) {
        const progress = getAchievementProgress(levelAch, {level: currentLevelForCalc, gold: 0, dps: 0});
        if (progress.level > 0) {
            dpsMultiplier += progress.bonus;
            goldMultiplier += progress.bonus;
        }
    }

    // Application du Prestige (Gemmes d'âme)
    const prestigeMultiplier = 1 + (soulGems * PRESTIGE_BONUS_PER_GEM);

    // CALCUL FINAL DPS
    let finalDps = rawDps * dpsMultiplier * prestigeMultiplier;
    if (isBoss) {
        finalDps = finalDps * bossMultiplier;
    }

    // CALCUL FINAL GPS
    const finalGps = rawGps * goldMultiplier * prestigeMultiplier;

    return {
        totalDps: finalDps,
        totalGps: finalGps,
        totalTimeBonus: timeBonus,
        multipliers: {
            dps: dpsMultiplier,
            gold: goldMultiplier,
            boss: bossMultiplier,
            prestige: prestigeMultiplier
        }
    };
};
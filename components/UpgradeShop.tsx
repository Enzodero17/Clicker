import { CARACTERS_DATA, PRESTIGE_BONUS_PER_GEM, PRESTIGE_UNLOCK_LEVEL } from "@/config/gameData";
import { calculatePrestigeGain, formatNumber, getItemCost, getUpgradeImage } from "@/utils/gameFormulas";

interface Props {
    gold: number;
    level: number;
    inventory: Record<string, number>;
    clickDamage: number;
    buyItem: (id: string) => void;
    buyClickUpgrade: () => void;
    onPrestige: () => void;
}

/**
 * Composant UpgradeShop
 * Gère l'affichage et l'achat des améliorations de clic (manuel) et des personnages (alliés).
 * C'est ici que se trouve également le panneau d'Ascension (Prestige).
 *
 * @param gold - L'or actuel du joueur.
 * @param level - Le niveau actuel du joueur (pour débloquer les items/prestige).
 * @param inventory - L'état des personnages possédés (niveau par ID).
 * @param clickDamage - Le niveau actuel du clic manuel.
 * @param buyItem - Fonction pour acheter un niveau de personnage.
 * @param buyClickUpgrade - Fonction pour améliorer le clic.
 * @param onPrestige - Fonction pour déclencher la renaissance.
 */
export default function UpgradeShop({ gold, level, inventory, clickDamage, buyItem, buyClickUpgrade, onPrestige }: Props) {

    // Calcul du coût du prochain clic (Formule : 10 * 1.5^Niveau)
    const manualClickCost = Math.floor(10 * Math.pow(1.5, clickDamage));

    // Calcul des gemmes potentielles pour le Prestige
    const potentialGems = calculatePrestigeGain(level);

    return (
        <div className="w-full max-w-2xl px-4 pb-20 mt-8">
            {/* Titre Stylisé */}
            <div className="flex items-center gap-3 mb-6 pl-2">
                <div className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                <h3 className="text-2xl font-bold text-white tracking-wide uppercase">Équipage</h3>
            </div>

            {/* SECTION PRESTIGE (ASCENSION) */}
            {level >= PRESTIGE_UNLOCK_LEVEL && (
                <div className="mb-6 p-4 rounded-2xl border border-purple-500/50 bg-purple-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl animate-spin-slow">🌀</span>
                        <h4 className="text-purple-300 font-bold text-lg">Ascension Disponible</h4>
                    </div>

                    <p className="text-xs text-purple-200/70 mb-4 leading-relaxed">
                        Recommencez au niveau 1 pour gagner des Gemmes d&#39;Âme. <br/>
                        Chaque gemme donne <strong className="text-white">+{PRESTIGE_BONUS_PER_GEM * 100}% Dégâts & Or</strong> de manière permanente.
                    </p>

                    <button
                        onClick={onPrestige}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg transform active:scale-95 transition-all border border-white/20"
                    >
                        Renaître (+{potentialGems} 💎)
                    </button>
                </div>
            )}

            <div className="space-y-4">

                {/* CARTE ENTRAÎNEMENT (AMÉLIORATION CLIC) */}
                <div
                    onClick={buyClickUpgrade}
                    className={`
                        relative group rounded-2xl p-4 flex items-center justify-between transition-all duration-300 border backdrop-blur-md overflow-hidden select-none
                        ${gold >= manualClickCost
                        ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] cursor-pointer'
                        : 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'}
                    `}
                >
                    {/* Fond gradient au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center text-3xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            🗡️
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">Entraînement</h4>
                            <p className="text-xs text-blue-200/70 mt-1">
                                Puissance de Clic <br/>
                                <span className="text-white font-mono">{formatNumber(clickDamage)}</span> ➔ <span className="text-green-400 font-bold font-mono">{formatNumber(clickDamage + 1)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="text-right relative z-10">
                        <div className={`font-bold text-lg ${gold >= manualClickCost ? 'text-yellow-300' : 'text-gray-500'}`}>
                            {formatNumber(manualClickCost)} 🟡
                        </div>
                        <div className="text-[10px] text-blue-300/50 uppercase tracking-widest font-bold mt-1">
                            Niv. {clickDamage}
                        </div>
                    </div>
                </div>

                {/* LISTE DES PERSONNAGES (ALLIÉS) */}
                {CARACTERS_DATA.map((item) => {
                    const count = inventory[item.id] || 0;
                    const cost = getItemCost(item, count);

                    // Conditions d'affichage
                    const isLocked = level < item.unlockLevel;
                    const isMaxed = item.maxLevel !== undefined && count >= item.maxLevel;
                    const canAfford = gold >= cost;

                    // CALCUL DES BONUS (Pour l'affichage)
                    const growthMultiplier = item.dpsGrowth === 1 ? 1 : Math.pow(item.dpsGrowth, count);
                    const milestoneMultiplier = Math.pow(2, Math.floor(count / 25));

                    const currentTotalDps = (item.baseDps * count) * growthMultiplier * milestoneMultiplier;
                    const currentTotalGps = (item.baseGps * count) * milestoneMultiplier;

                    // CALCUL DU PROCHAIN PALIER (x2 tous les 25 niveaux)
                    const nextMilestone = (Math.floor(count / 25) + 1) * 25;
                    const levelsLeft = nextMilestone - count;

                    // IMAGE ÉVOLUTIVE
                    const currentImage = getUpgradeImage(item, count);

                    // CAS VERROUILLÉ
                    if (isLocked) {
                        return (
                            <div key={item.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-2 text-white/30 italic text-sm backdrop-blur-sm select-none">
                                🔒 Débloqué au niveau <span className="text-white/50 font-bold">{item.unlockLevel}</span>
                            </div>
                        );
                    }

                    // CAS DÉVERROUILLÉ (ACHETABLE OU MAX)
                    return (
                        <div
                            key={item.id}
                            onClick={() => !isMaxed && canAfford && buyItem(item.id)}
                            className={`
                                relative rounded-2xl p-3 flex items-center justify-between transition-all duration-300 overflow-hidden border backdrop-blur-md group select-none
                                ${isMaxed
                                ? 'bg-black/20 border-white/5 opacity-50 grayscale cursor-default'
                                : (canAfford
                                    ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer'
                                    : 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed')
                            }
                            `}
                        >
                            {/* Barre de progression Milestone (Ligne fine en bas) */}
                            {!isMaxed && (
                                <div
                                    className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-green-500 to-emerald-400 opacity-70 transition-all duration-500 shadow-[0_0_10px_#10b981]"
                                    style={{ width: `${(count % 25) / 25 * 100}%` }}
                                />
                            )}

                            <div className="flex items-center gap-4 relative z-10">
                                {/* Image du Personnage */}
                                <div className="relative group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={currentImage}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain bg-black/40 rounded-xl border border-white/10 shadow-lg"
                                    />
                                    {/* Petite étoile si niveau 100+ */}
                                    {count >= 100 && (
                                        <div className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                                            ★
                                        </div>
                                    )}
                                </div>

                                {/* Infos Personnage */}
                                <div>
                                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                                        {item.name}
                                        {isMaxed && <span className="bg-red-500/80 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Max</span>}
                                    </h4>

                                    <div className="flex flex-col text-xs text-blue-100/70 gap-0.5 mt-1">
                                        {/* Indicateur Boost Actif */}
                                        {milestoneMultiplier > 1 && (
                                            <span className="text-yellow-300 font-bold text-[10px] drop-shadow-sm">⚡ Boost: x{milestoneMultiplier}</span>
                                        )}

                                        {/* Stats Totales (DPS / Or) */}
                                        <div className="flex flex-col">
                                            {count > 0 && item.baseDps > 0 && (
                                                <span className="text-red-200 font-semibold">⚔️ {formatNumber(currentTotalDps)}/s</span>
                                            )}
                                            {count > 0 && item.baseGps > 0 && (
                                                <span className="text-yellow-200 font-semibold">💰 {formatNumber(currentTotalGps)}/s</span>
                                            )}
                                        </div>

                                        {/* Compte à rebours prochain x2 */}
                                        {!isMaxed && (
                                            <span className="text-green-400/80 text-[10px] mt-0.5 font-mono">
                                                Next x2: {levelsLeft} niv.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Prix & Niveau (Colonne Droite) */}
                            <div className="text-right relative z-10 flex flex-col justify-between h-full py-1">
                                <div className={`font-bold text-base ${isMaxed ? 'text-white/30' : (canAfford ? 'text-yellow-300' : 'text-gray-500')}`}>
                                    {isMaxed ? 'COMPLET' : `${formatNumber(cost)} 🟡`}
                                </div>
                                <div className="text-[10px] text-blue-300/40 uppercase tracking-widest font-bold">
                                    Niv. {count}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
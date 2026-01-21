import React from 'react';
import { INFINITE_ACHIEVEMENTS } from "@/config/gameData";
import { formatNumber, getAchievementProgress } from "@/utils/gameFormulas";

interface Props {
    /** Contrôle si la fenêtre modale est visible ou non */
    isOpen: boolean;
    /** Fonction pour fermer la fenêtre */
    onClose: () => void;
    /**
     * Les statistiques actuelles du joueur nécessaires pour calculer la progression des succès.
     * Ces valeurs sont passées en temps réel depuis le composant parent.
     */
    currentStats: {
        level: number;
        gold: number;
        dps: number;
    };
}

/**
 * Composant AchievementsModal
 * Affiche la liste des 3 succès "infinis" (Roi des Pirates, Trésorier, Force Destructrice).
 * Chaque carte montre le niveau actuel du succès, le bonus qu'il apporte, et une barre de progression vers le prochain palier.
 */
export default function AchievementsModal({ isOpen, onClose, currentStats }: Props) {
    // Si la modale est fermée, on ne rend rien pour économiser les ressources
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            {/* Conteneur principal (Style Glass morphism sombre) */}
            <div className="w-full max-w-lg bg-[#1a1b26] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏆</span>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Succès</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                {/* LISTE DÉFILANTE DES SUCCÈS */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    {INFINITE_ACHIEVEMENTS.map((ach) => {
                        // Calcul dynamique de l'état du succès (Niveau, %, Bonus)
                        const { level, percent, nextThreshold, bonus } = getAchievementProgress(ach, currentStats);

                        // Définition des styles dynamiques selon le type (Level = Bleu, Gold = Jaune, DPS = Rouge)
                        let glowColor = '';
                        let textColor = '';

                        if (ach.type === 'level') {
                            glowColor = 'shadow-blue-500/20 border-blue-500/30';
                            textColor = 'text-blue-400';
                        }
                        if (ach.type === 'gold') {
                            glowColor = 'shadow-yellow-500/20 border-yellow-500/30';
                            textColor = 'text-yellow-400';
                        }
                        if (ach.type === 'dps') {
                            glowColor = 'shadow-red-500/20 border-red-500/30';
                            textColor = 'text-red-400';
                        }

                        return (
                            <div
                                key={ach.id}
                                className={`relative bg-slate-800/50 rounded-2xl p-4 border ${glowColor} shadow-lg overflow-hidden group transition-transform hover:scale-[1.02]`}
                            >
                                {/* Partie Supérieure : Infos & Bonus */}
                                <div className="flex justify-between items-start relative z-10 mb-2">
                                    <div className="flex items-center gap-4">
                                        {/* Icone */}
                                        <div className={`w-14 h-14 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl shadow-inner`}>
                                            {ach.icon}
                                        </div>

                                        {/* Titre et Niveau */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white text-lg">{ach.name}</h4>
                                                <span className="text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded border border-slate-600 font-mono">
                                                    Niv {level}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{ach.description}</p>
                                        </div>
                                    </div>

                                    {/* Affichage du Bonus Actuel */}
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${textColor}`}>
                                            +{Math.round(bonus * 100)}%
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">
                                            Bonus {ach.rewardType === 'gold' ? 'Or' : 'Dégâts'}
                                        </div>
                                    </div>
                                </div>

                                {/* Partie Inférieure : Barre de progression */}
                                <div className="mt-3 relative h-5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                                    {/* Jauge colorée */}
                                    <div
                                        className={`h-full bg-gradient-to-r ${ach.color} opacity-80 transition-all duration-500 ease-out`}
                                        style={{ width: `${percent}%` }}
                                    />
                                    {/* Texte centré sur la barre */}
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md tracking-wide">
                                        Prochain palier : {formatNumber(nextThreshold)} {ach.type === 'level' ? '' : (ach.type === 'gold' ? '💰' : '⚔️')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { GameStats } from "@/types";
import { formatNumber } from "@/utils/gameFormulas";
import { CARACTERS_DATA } from "@/config/gameData";

interface Props {
    /** Contrôle la visibilité de la modale */
    isOpen: boolean;
    /** Fonction appelée pour fermer la modale */
    onClose: () => void;
    /** Les statistiques persistantes du joueur (Records, Temps de jeu...) */
    stats: GameStats;
    /** L'inventaire actuel pour calculer le nombre de personnages débloqués */
    inventory: Record<string, number>;
}

/**
 * Composant ProfileModal
 * Affiche les statistiques globales du joueur qui ne sont jamais remises à zéro (Records).
 * Permet de visualiser la progression à long terme (Temps de jeu, Renaissances, etc.).
 */
export default function ProfileModal({ isOpen, onClose, stats, inventory }: Props) {
    // Si la modale n'est pas ouverte, on ne rend rien (évite de surcharger le DOM).
    if (!isOpen) return null;

    // Calcul du nombre de personnages débloqués :
    // On filtre l'inventaire pour ne garder que ceux dont le niveau est strictement supérieur à 0.
    const unlockedCharsCount = Object.values(inventory).filter(lvl => lvl > 0).length;

    // Le nombre total de personnages disponibles dans le jeu.
    const totalChars = CARACTERS_DATA.length;

    /**
     * Convertit un nombre de secondes en format lisible (HHh MMm SSs).
     * @param seconds - Temps total en secondes.
     */
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            {/* Conteneur principal avec style "Glass morphism" sombre */}
            <div className="w-full max-w-lg bg-[#1a1b26] border border-blue-500/30 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏴‍☠️</span>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Profil Capitaine</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 transition-all"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                {/* GRILLE DES STATISTIQUES */}
                <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">

                    {/* Ligne 1 : Records Principaux */}
                    <StatBox icon="🏔️" label="Record Niveau" value={formatNumber(stats.maxLevel)} color="text-blue-400" />
                    <StatBox icon="💰" label="Record Or" value={formatNumber(stats.maxGold)} color="text-yellow-400" />

                    {/* Ligne 2 : Combat */}
                    <StatBox icon="⚔️" label="Record DPS" value={formatNumber(stats.maxDps)} color="text-red-400" />
                    <StatBox icon="💀" label="Ennemis Vaincus" value={formatNumber(stats.totalKills)} color="text-gray-300" />

                    {/* Ligne 3 : Progression */}
                    <StatBox icon="👥" label="Équipage" value={`${unlockedCharsCount} / ${totalChars}`} color="text-green-400" />
                    <StatBox icon="👆" label="Total Clics" value={formatNumber(stats.totalClicks)} color="text-orange-400" />

                    {/* Ligne 4 : Meta-jeu */}
                    <StatBox icon="🌀" label="Renaissances" value={stats.prestigeCount.toString()} color="text-purple-400" />
                    <StatBox icon="⏱️" label="Temps de Jeu" value={formatTime(stats.totalPlayTime)} color="text-white" />

                </div>

                {/* FOOTER (ID Joueur) */}
                <div className="p-4 text-center text-xs text-gray-500 bg-black/20 font-mono border-t border-white/5">
                    ID Joueur: <span className="text-gray-400 select-all">{stats.playerId}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Sous-composant pour l'affichage standardisé d'une "Tuile" de statistique.
 * Permet de garder le code du render principal propre.
 */
const StatBox = ({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) => (
    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors group">
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</div>
        <div className={`text-lg font-black ${color}`}>{value}</div>
    </div>
);
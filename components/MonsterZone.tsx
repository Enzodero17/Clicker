import { getMonsterImage, formatNumber } from "@/utils/gameFormulas";
import React, { RefObject } from "react";

interface Props {
    /** Le niveau actuel du jeu (détermine l'image du monstre) */
    level: number;
    /** Points de vie actuels de l'ennemi */
    currentHp: number;
    /** Points de vie totaux de l'ennemi */
    maxHp: number;
    /** Temps restant avant la fuite/défaite (en secondes) */
    timeLeft: number;
    /** Temps total alloué pour ce combat */
    maxTime: number;
    /** Indique si l'ennemi actuel est un Boss (change le style visuel en rouge/danger) */
    isBoss: boolean;
    /** Référence DOM pour récupérer la position du monstre (utile pour les textes flottants) */
    monsterRef: RefObject<HTMLDivElement | null>;
    /** Fonction appelée lors du clic manuel sur le monstre */
    handleManualClick: (e: React.MouseEvent) => void;
}

/**
 * Composant MonsterZone
 * Affiche la zone centrale de combat : L'image du monstre, sa barre de vie et le chronomètre.
 * Gère les effets visuels de "Danger" (Boss) et les animations de clic.
 */
export default function MonsterZone({ level, currentHp, maxHp, timeLeft, maxTime, isBoss, monsterRef, handleManualClick }: Props) {

    // Calcul des pourcentages pour les largeurs CSS (bornés entre 0 et 100 pour éviter les bugs graphiques)
    const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
    const hpPercentage = Math.max(0, (currentHp / maxHp) * 100);

    return (
        <div className={`
            w-full max-w-md p-6 rounded-3xl border backdrop-blur-md shadow-2xl transition-all duration-500 mb-8 relative
            ${isBoss
            ? 'bg-red-950/40 border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.2)]' // Style BOSS (Rouge sombre)
            : 'bg-white/5 border-white/10'} // Style NORMAL (Verre neutre)
        `}>
            {/* Effet de lueur d'ambiance derrière le monstre (Atmosphère) */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-50 ${isBoss ? 'bg-red-600' : 'bg-blue-400'}`} />

            {/* BARRE DE TEMPS */}
            <div className="relative mb-6">
                <div className="flex justify-between text-xs font-bold mb-1 px-1">
                    {/* Alerte visuelle si temps < 5 secondes */}
                    <span className={`${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                        {timeLeft < 5 ? 'ATTENTION !' : 'TEMPS RESTANT'}
                    </span>
                    <span className="font-mono text-white">{timeLeft.toFixed(1)}s</span>
                </div>

                {/* Jauge du timer */}
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
                    <div
                        className={`h-full transition-all duration-100 linear shadow-[0_0_10px_currentColor] ${timeLeft < 5 ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* ZONE ENNEMIES & INTERACTION */}
            <div className="flex flex-col items-center justify-center min-h-[220px] relative z-10" ref={monsterRef}>
                <img
                    src={getMonsterImage(level)}
                    alt="Monster"
                    onMouseDown={handleManualClick}
                    draggable="false"
                    className={`
                        cursor-pointer transform active:scale-95 transition-transform object-contain drop-shadow-2xl hover:brightness-110 select-none
                        ${isBoss ? 'w-64 h-64 animate-pulse' : 'w-48 h-48 animate-bounce-slow'}
                    `}
                />

                {/* BARRE DE VIE */}
                <div className="w-full mt-6 relative group">
                    {/* Fond de la barre */}
                    <div className="w-full h-8 bg-black/60 rounded-full border border-white/10 overflow-hidden relative shadow-inner">
                        {/* Jauge rouge (PV) */}
                        <div
                            className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-75 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                            style={{ width: `${hpPercentage}%` }}
                        />

                        {/* Effet "Glass" brillant sur la moitié supérieure de la jauge */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none" />
                    </div>

                    {/* Texte PV par-dessus (Centré) */}
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide z-10 pointer-events-none">
                        {formatNumber(currentHp)} / {formatNumber(maxHp)} HP
                    </div>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import { formatNumber } from "@/utils/gameFormulas";

interface Props {
    /** Montant actuel de l'or possédé par le joueur */
    gold: number;
    /** Gold Per Second : Revenu passif généré par les alliés/artefacts */
    totalGps: number;
    /** Damage Per Second : Dégâts automatiques infligés au monstre */
    totalDps: number;
    /** Le niveau actuel du stage */
    level: number;
    /** Indique si le niveau actuel est un combat de Boss (change le style visuel) */
    isBoss: boolean;
}

/**
 * Composant GameHeader
 * Barre supérieure de l'interface (HUD).
 * Affiche les TROIS métriques principales du jeu : Or (et revenus), Progression (Niveau) et Puissance (DPS).
 */
export default function GameHeader({ gold, totalGps, totalDps, level, isBoss }: Props) {
    return (
        // Conteneur principal avec effet "Glass morphism" (transparence + flou)
        // Utilisation d'une Grid à 3 colonnes pour aligner les sections
        <header className="w-full max-w-4xl grid grid-cols-3 gap-4 px-4 py-10 mb-6 text-center bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-lg z-10 relative">

            {/* Ligne décorative brillante en haut (Reflet) */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* COLONNE 1 : OR & REVENUS */}
            <div className="flex flex-col items-center justify-center border-r border-white/5 h-full">
                {/* leading-normal est crucial ici pour éviter que les caractères (comme $) ne soient coupés en bas à cause de la taille de police */}
                <span className="text-yellow-300 font-black text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-normal">
                  {formatNumber(gold)} $
                </span>
                <span className="text-xs text-yellow-100/60 font-mono mt-1 bg-yellow-500/10 px-3 py-1 rounded-full">
                  +{formatNumber(totalGps)}/s
                </span>
            </div>

            {/* COLONNE 2 : INDICATEUR DE NIVEAU */}
            <div className="flex flex-col justify-center items-center h-full">
                {/* Le style change radicalement si c'est un BOSS (Rouge + Pulsation) vs Normal (Bleu calme) */}
                <div className={`
                    px-6 py-2 rounded-2xl border transition-all duration-500 flex items-center justify-center
                    ${isBoss
                    ? 'bg-red-500/20 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse'
                    : 'bg-white/10 border-white/10 text-blue-100'}
                `}>
                    <span className="font-bold text-xl tracking-widest leading-none mt-1">
                      {isBoss ? `☠️ BOSS | NIVEAU ${level}` : `NIVEAU ${level}`}
                    </span>
                </div>
            </div>

            {/* COLONNE 3 : PUISSANCE DE FEU (DPS) */}
            <div className="flex flex-col items-center justify-center border-l border-white/5 h-full">
                <span className="text-red-300 font-black text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-normal">
                  {formatNumber(totalDps)} ⚔️
                </span>
                <span className="text-xs text-red-100/60 font-mono mt-1 bg-red-500/10 px-3 py-1 rounded-full">
                  DPS Auto
                </span>
            </div>
        </header>
    );
}
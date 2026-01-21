import { ARTIFACTS_DATA } from "@/config/gameData";
import { getArtifactCost, formatNumber } from "@/utils/gameFormulas";

interface Props {
    /** Montant d'or actuel du joueur */
    gold: number;
    /** Inventaire des artefacts (Mapping : ID → Niveau possédé) */
    artifactsInventory: Record<string, number>;
    /** Fonction pour acheter un niveau d'artefact */
    buyArtifact: (id: string) => void;
}

/**
 * Composant ArtifactsPanel
 * Panneau latéral (généralement à gauche) affichant la liste des Artefacts (Améliorations passives).
 * Permet d'acheter des bonus permanents (Or, DPS, Temps, Boss).
 */
export default function ArtifactsPanel({ gold, artifactsInventory, buyArtifact }: Props) {
    return (
        <div className="w-full lg:w-80 flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto h-full max-h-screen scrollbar-thin scrollbar-thumb-white/20">
            {/* Titre de la section */}
            <h3 className="text-xl font-bold text-white/90 mb-6 pl-2 border-l-4 border-blue-400">
                Améliorations
            </h3>

            <div className="space-y-3">
                {ARTIFACTS_DATA.map((item) => {
                    // Calcul de l'état actuel pour cet item
                    const count = artifactsInventory[item.id] || 0;
                    const cost = getArtifactCost(item, count);
                    const canBuy = gold >= cost;

                    return (
                        <div
                            key={item.id}
                            // On désactive le clic si pas assez d'argent
                            onClick={() => canBuy && buyArtifact(item.id)}
                            className={`
                                flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 select-none relative overflow-hidden group
                                ${canBuy
                                ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50 cursor-pointer shadow-sm hover:shadow-blue-500/20'
                                : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed grayscale'}
                            `}
                        >
                            {/* Image de l'artefact */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-full object-cover border border-white/30 bg-black/40"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Header Item : Nom + Niveau */}
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-sm text-white truncate pr-2">{item.name}</h4>
                                    <span className="text-[10px] text-blue-200 bg-blue-500/20 px-1.5 py-0.5 rounded whitespace-nowrap border border-blue-500/30">
                                        Niv {count}
                                    </span>
                                </div>

                                {/* Description des Bonus (Affichage conditionnel selon le type) */}
                                <div className="text-[10px] text-gray-300 leading-tight space-y-0.5">

                                    {/* Bonus OR */}
                                    {item.globalGoldMultiplier > 0 && (
                                        <div>
                                            Bonus Or
                                            <span className="text-yellow-300 font-bold ml-1">
                                                (+{Math.round(item.globalGoldMultiplier * count * 100)}%)
                                            </span>
                                        </div>
                                    )}

                                    {/* Bonus DÉGÂTS */}
                                    {item.globalDpsMultiplier > 0 && (
                                        <div>
                                            Bonus Dégâts
                                            <span className="text-red-300 font-bold ml-1">
                                                (+{Math.round(item.globalDpsMultiplier * count * 100)}%)
                                            </span>
                                        </div>
                                    )}

                                    {/* Bonus BOSS */}
                                    {item.bossDamageMultiplier && item.bossDamageMultiplier > 0 && (
                                        <div>
                                            Dégâts Boss
                                            <span className="text-orange-300 font-bold ml-1">
                                                (+{Math.round(item.bossDamageMultiplier * count * 100)}%)
                                            </span>
                                        </div>
                                    )}

                                    {/* Bonus TEMPS */}
                                    {item.timeBonus > 0 && (
                                        <div>
                                            Bonus Temps
                                            <span className="text-blue-300 font-bold ml-1">
                                                (+{item.timeBonus * count}s)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Prix */}
                                <div className={`text-xs font-bold mt-2 text-right ${canBuy ? 'text-yellow-300' : 'text-gray-500'}`}>
                                    {formatNumber(cost)} $
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
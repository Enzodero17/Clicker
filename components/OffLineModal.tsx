import React from 'react';

interface Props {
    /**
     * Le message de rapport à afficher.
     * Contient généralement le montant d'or gagné et le temps écoulé.
     * Si 'null', la modale ne s'affiche pas.
     */
    message: string | null;

    /** Fonction appelée pour fermer la modale (vide le message dans le parent). */
    onClose: () => void;
}

/**
 * Composant OfflineModal
 * Affiche une petite notification "Pop-up" en haut de l'écran lorsque le joueur revient sur le jeu.
 * Sert à indiquer les gains accumulés pendant l'absence (Offline Gains).
 */
export default function OfflineModal({ message, onClose }: Props) {
    // Sécurité : Si pas de message, le composant est invisible (ne rend rien dans le DOM)
    if (!message) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 border border-yellow-500 p-4 rounded-xl z-50 shadow-2xl max-w-sm text-center animate-in fade-in zoom-in duration-300">
            {/* Titre */}
            <p className="text-yellow-400 font-bold mb-2 uppercase tracking-wide text-sm">
                🌙 Rapport d&#39;absence
            </p>

            {/* Contenu du message */}
            <p className="text-sm text-gray-300 leading-relaxed">
                {message}
            </p>

            {/* Bouton de confirmation */}
            <button
                onClick={onClose}
                className="mt-4 px-6 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg"
            >
                RÉCOLTER
            </button>
        </div>
    );
}
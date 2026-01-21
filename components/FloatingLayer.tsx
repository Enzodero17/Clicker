import React from 'react';
import { FloatingText } from "@/types";

interface Props {
    /** Liste des textes flottants actifs à afficher (Dégâts, Or, Critiques...) */
    texts: FloatingText[];
}

/**
 * Composant FloatingLayer
 * Un calque invisible (pointer events-none) qui se superpose à tout le jeu (z-50).
 * Il gère le rendu des nombres flottants qui apparaissent lors des clics ou des gains.
 * * Note : L'animation de mouvement (vers le haut + disparition) doit être gérée
 * par la classe CSS 'damage text' dans votre fichier global.css.
 */
export default function FloatingLayer({ texts }: Props) {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {texts.map((text) => (
                <div
                    key={text.id}
                    className={`absolute text-2xl font-bold damage-text text-shadow-lg whitespace-nowrap ${text.color || 'text-white'}`}
                    style={{
                        left: text.x,
                        top: text.y,
                        // Amélioration : Centre le texte exactement sur la coordonnée X, Y
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Affiche le texte personnalisé (ex : "CRIT !") ou la valeur numérique arrondie */}
                    {text.text ? text.text : Math.floor(text.value)}
                </div>
            ))}
        </div>
    );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

// Configuration de la police "Geist Sans" (Optimisée pour Next.js)
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// Configuration de la police "Geist Mono" (Pour le code ou les chiffres tabulaires)
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Métadonnées de l'application (SEO).
 * Ces informations apparaissent dans l'onglet du navigateur et les partages sociaux.
 */
export const metadata: Metadata = {
    title: "RPG Clicker - One Piece Adventure",
    description: "Un jeu incrémental épique. Recrutez votre équipage, vainquez des boss et devenez le Roi des Pirates !",
    icons: {
        icon: "/favicon.ico",
    },
};

/**
 * RootLayout
 * Le composant racine qui enveloppe TOUTES les pages de l'application.
 * C'est ici que l'on définit la structure HTML de base, les polices globales et le CSS global.
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
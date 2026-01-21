'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FloatingText, GameStats } from '@/types';
import {
  SAVE_KEY,
  BASE_TIME,
  BOSS_TIME,
  BASE_HP,
  CARACTERS_DATA,
  ARTIFACTS_DATA,
  INFINITE_ACHIEVEMENTS,
  PRESTIGE_BONUS_PER_GEM,
  INITIAL_STATS
} from '@/config/gameData';
import {
  getEnemyHp,
  getGoldReward,
  getCheckpointLevel,
  getItemCost,
  calculateTotalStats,
  getArtifactCost,
  getBackgroundImage,
  getZoneName,
  formatNumber,
  calculatePrestigeGain,
  getAchievementProgress
} from '@/utils/gameFormulas';

// Components
import MonsterZone from '@/components/MonsterZone';
import UpgradeShop from '@/components/UpgradeShop';
import FloatingLayer from '@/components/FloatingLayer';
import GameHeader from '@/components/GameHeader';
import ArtifactsPanel from '@/components/ArtifactsPanel';
import AchievementsModal from "@/components/AchievementsModal";
import ProfileModal from "@/components/ProfileModal";

/**
 * Composant Principal (Page)
 * Contient toute la logique d'état du jeu (State), la boucle principale (Game Loop)
 * et l'assemblage des sous-composants.
 */
export default function RPGClicker() {
  // ÉTATS DU JEU (GAME STATE)
  const [gold, setGold] = useState(0);
  const [level, setLevel] = useState(1);
  const [clickDamage, setClickDamage] = useState(1);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [artifactsInventory, setArtifactsInventory] = useState<Record<string, number>>({});
  const [soulGems, setSoulGems] = useState(0);

  // ÉTATS DU COMBAT
  const [maxHp, setMaxHp] = useState(BASE_HP);
  const [currentHp, setCurrentHp] = useState(BASE_HP);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME);
  const [isBoss, setIsBoss] = useState(false);

  // ÉTATS SYSTÈME & UI
  const [loaded, setLoaded] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Modales
  const [isAchievModalOpen, setIsAchievModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Statistiques persistantes (Profil)
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);

  // Refs pour la logique interne (évite les re-renders inutiles)
  const monsterRef = useRef<HTMLDivElement>(null);
  const lastTickRef = useRef<number>(Date.now());
  const isResettingRef = useRef(false);

  //  CALCUL DES STATS (Optimisé avec useMemo)
  // On recalcule les stats de base uniquement si l'inventaire ou les gemmes changent.
  const { totalDps: rawDps, totalGps: rawGps, totalTimeBonus, multipliers } = useMemo(() => {
    return calculateTotalStats(inventory, artifactsInventory, soulGems, isBoss);
  }, [inventory, artifactsInventory, soulGems, isBoss]);

  //  CALCUL DES BONUS DE SUCCÈS
  // Basé sur les stats brutes pour éviter les dépendances circulaires.
  const achievStats = useMemo(() => {
    let bonusDps = 0;
    let bonusGold = 0;

    INFINITE_ACHIEVEMENTS.forEach(ach => {
      const { bonus } = getAchievementProgress(ach, { level, gold, dps: rawDps });
      if (ach.rewardType === 'dps') bonusDps += bonus;
      if (ach.rewardType === 'gold') bonusGold += bonus;
    });

    return { bonusDps, bonusGold };
  }, [level, gold, rawDps]);

  // 3. STATS FINALES
  // Application des multiplicateurs de succès aux valeurs brutes.
  const totalDps = rawDps * (1 + achievStats.bonusDps);
  const totalGps = rawGps * (1 + achievStats.bonusGold);

  /**
   * Initialise un niveau (Boss ou Normal).
   * Réinitialise les PV du monstre et le timer.
   */
  const startLevel = (lvl: number) => {
    const bossLevel = lvl % 5 === 0;
    const newMaxHp = getEnemyHp(lvl);

    setIsBoss(bossLevel);
    setLevel(lvl);
    setMaxHp(newMaxHp);
    setCurrentHp(newMaxHp);

    const base = bossLevel ? BOSS_TIME : BASE_TIME;
    setTimeLeft(base + totalTimeBonus);

    lastTickRef.current = Date.now();
  };

  /**
   * Crée un texte flottant visuel (Dégâts, Or, Critique).
   */
  const spawnFloatingText = (value: number, x: number, y: number, text?: string, color: string = 'text-white', isCrit: boolean = false) => {
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      value: Math.floor(value),
      x,
      y,
      text,
      color,
    };

    if (isCrit) {
      newText.text = (newText.text || Math.floor(value)) + " 💥";
    }

    setFloatingTexts(p => [...p, newText]);
    // Nettoyage automatique après 1 seconde
    setTimeout(() => setFloatingTexts(p => p.filter(t => t.id !== newText.id)), 1000);
  };

  /**
   * Gestion du clic manuel sur le monstre.
   */
  const applyDamage = (amount: number, x: number, y: number) => {
    setCurrentHp((prev) => {
      const newHp = prev - amount;
      if (newHp <= 0) return 0;
      return newHp;
    });

    // Mise à jour des stats de profil
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
    }));

    if (amount >= 1) spawnFloatingText(amount, x, y, `-${Math.floor(amount)}`, 'text-yellow-400');
  };

  /**
   * Achat d'un personnage (Allié).
   */
  const buyItem = (itemId: string) => {
    const item = CARACTERS_DATA.find(i => i.id === itemId);
    if (!item) return;
    const count = inventory[itemId] || 0;
    if (item.maxLevel && count >= item.maxLevel) return;

    const cost = getItemCost(item, count);
    if (gold >= cost) {
      setGold(prev => prev - cost);
      setInventory(prev => ({ ...prev, [itemId]: count + 1 }));
    }
  };

  /**
   * Achat d'un artefact (Bonus passif).
   */
  const buyArtifact = (itemId: string) => {
    const item = ARTIFACTS_DATA.find(i => i.id === itemId);
    if (!item) return;
    const count = artifactsInventory[itemId] || 0;
    const cost = getArtifactCost(item, count);

    if (gold >= cost) {
      setGold(prev => prev - cost);
      setArtifactsInventory(prev => ({ ...prev, [itemId]: count + 1 }));
      spawnFloatingText(0, window.innerWidth/2, window.innerHeight/2, "Bonus Amélioré!", "text-purple-400 text-3xl font-bold");
    }
  };

  /**
   * Amélioration du clic manuel.
   */
  const buyClickUpgrade = () => {
    const cost = Math.floor(10 * Math.pow(1.5, clickDamage));
    if (gold >= cost) {
      setGold(g => g - cost);
      setClickDamage(d => d + 1);
    }
  };

  /**
   * Réinitialisation complète de la sauvegarde (Hard Reset).
   */
  const handleReset = () => {
    if (confirm("Recommencer à zéro ?")) {
      isResettingRef.current = true;
      setLoaded(false);
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  /**
   * Système de Prestige (Ascension).
   * Convertit la progression actuelle en Gemmes d'Âme et recommence au niveau 1.
   */
  const handlePrestige = () => {
    const gemsToGain = calculatePrestigeGain(level);

    if (gemsToGain === 0) return;

    if (confirm(`Êtes-vous sûr de vouloir renaître ?\nVous perdrez votre or et vos niveaux.\nVous gagnerez ${gemsToGain} Gemmes d'Âme (+${Math.round(gemsToGain * PRESTIGE_BONUS_PER_GEM * 100)}% Bonus).`)) {
      setSoulGems(prevState => prevState + gemsToGain);

      // Reset des valeurs volatiles
      setGold(0);
      setLevel(1);
      setClickDamage(1);
      setInventory({});

      // On garde les stats globales, mais on incrémente le compteur de prestige
      setStats(prev => ({
        ...prev,
        prestigeCount: prev.prestigeCount + 1
      }))

      setIsBoss(false);
      setMaxHp(BASE_HP);
      setCurrentHp(BASE_HP);
      setTimeLeft(BASE_TIME);

      spawnFloatingText(0, window.innerWidth / 2, window.innerHeight / 2, "ASCENSION DIVINE !", "text-purple-400 font-black text-4xl drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]");    }
  }

  // BOUCLE DE JEU (GAME LOOP)
  // S'exécute toutes les 100ms
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      const now = Date.now();
      // Calcul du Delta Time (dt) pour lisser les calculs si le navigateur lag
      let dt = (now - lastTickRef.current) / 1000;
      if (dt < 0) dt = 0;
      if (dt > 100000) dt = 0.1; // Sécurité anti gros lag
      lastTickRef.current = now;

      // Génération d'Or Passif (GPS)
      if (totalGps > 0) setGold(g => g + (totalGps * dt));

      // Si le monstre est mort, on attend la logique de victoire
      if (currentHp <= 0) return;

      // Gestion du Timer
      setTimeLeft((prevTime) => {
        const newTime = prevTime - dt;
        if (newTime <= 0) {
          // ÉCHEC : Retour au début du checkpoint
          if (isBoss) {
            const checkpoint = getCheckpointLevel(level);
            startLevel(checkpoint);
            return BOSS_TIME + totalTimeBonus;
          } else {
            const preLevel = Math.max(1, level - 1);
            startLevel(preLevel);
            return BASE_TIME + totalTimeBonus;
          }
        }
        return newTime;
      });

      // Mise à jour des Records (Stats Profil)
      setStats(prev => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + dt,
        maxGold: Math.max(prev.maxGold, gold),
        maxLevel: Math.max(prev.maxLevel, level),
        maxDps: Math.max(prev.maxDps, totalDps),
      }));

      // Dégâts Automatiques (DPS)
      if (totalDps > 0) {

        // Gestion Critique (Optionnel pour le DPS auto)
        const critChance = 0.05;
        const critMultiplier = 2.0;
        const isCrit = Math.random() < critChance;

        let damageToApply = totalDps * dt;
        if (isCrit) {
          damageToApply *= critMultiplier;
        }

        setCurrentHp(prev => Math.max(0, prev - damageToApply));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [level, totalDps, totalGps, currentHp, isBoss, loaded, totalTimeBonus, gold]);

  // CHARGEMENT DE LA SAUVEGARDE
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Restaurer les états simples
        setGold(parsed.gold || 0);
        setClickDamage(parsed.clickDamage || 1);
        setInventory(parsed.inventory || {});
        setArtifactsInventory(parsed.artifactsInventory || {});
        setSoulGems(parsed.soulGems || 0);

        // Stats & ID Joueur
        const loadedStats = parsed.stats || INITIAL_STATS;
        if (!loadedStats.playerId) {
          loadedStats.playerId = "P-" + Math.random().toString(36).substring(2, 11).toUpperCase();
        }
        setStats(loadedStats);

        // On recalcule le bonus IMMÉDIATEMENT avec les données chargées
        const lvl = parsed.level || 1;
        const isBossLevel = lvl % 5 === 0;

        const tempStats = calculateTotalStats(
            parsed.inventory || {},
            parsed.artifactsInventory || {}, // On utilise l'inventaire chargé, pas le state
            parsed.soulGems || 0,
            isBossLevel
        );
        const loadedTimeBonus = tempStats.totalTimeBonus;

        // Initialiser le niveau manuellement (sans utiliser startLevel qui utiliserait un bonus=0)
        setLevel(lvl);
        setIsBoss(isBossLevel);

        const enemyMaxHp = getEnemyHp(lvl);
        setMaxHp(enemyMaxHp);
        setCurrentHp(parsed.currentHp || enemyMaxHp);

        // Restaurer le temps avec le BON bonus calculé
        const baseTime = isBossLevel ? BOSS_TIME : BASE_TIME;

        if (parsed.timeLeft && parsed.timeLeft > 0) {
          // Si on a un temps en cours valide, on le reprend
          setTimeLeft(parsed.timeLeft);
        } else {
          // Sinon, on remet le temps max (Base + Bonus calculé manuellement).
          setTimeLeft(baseTime + loadedTimeBonus);
        }

      } catch (e) {
        console.error("Erreur chargement save", e);
        startLevel(1);
      }
    } else {
      // Nouvelle Partie
      const newStats = { ...INITIAL_STATS };
      newStats.playerId = "P-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      setStats(newStats);
      startLevel(1);
    }

    lastTickRef.current = Date.now();
    setLoaded(true);
  }, []);

  // SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    if (!loaded || isResettingRef.current) return;
    const data = {
      gold,
      level,
      clickDamage,
      inventory,
      artifactsInventory,
      currentHp,
      timeLeft,
      soulGems,
      stats,
      lastSaveTime: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [gold, level, clickDamage, inventory, artifactsInventory, currentHp, timeLeft, loaded, soulGems, stats]);

  // GESTION DE LA VICTOIRE
  useEffect(() => {
    if (!loaded) return;
    if (currentHp <= 0) {
      // Calcul du gain d'or avec tous les bonus
      const rewardRatio = totalGps > 0 && rawGps > 0 ? totalGps / rawGps : multipliers.gold * (1 + achievStats.bonusGold);
      const reward = getGoldReward(level) * rewardRatio;

      setGold((prev) => prev + reward);
      setStats(prev => ({
        ...prev,
        totalKills: prev.totalKills + 1
      }))

      spawnFloatingText(reward, window.innerWidth/2, window.innerHeight/2 - 100, `+${formatNumber(reward)} 💰`, 'text-yellow-300 font-bold text-4xl');

      // Passage au niveau suivant
      startLevel(level + 1);
    }
  }, [currentHp, loaded]);

  // Récupération des assets visuels actuels
  const currentBg = getBackgroundImage(level);
  const currentZoneName = getZoneName(level);

  if (!loaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Chargement...</div>;

  return (
      <main
          className="min-h-screen font-sans overflow-hidden select-none relative flex flex-col lg:flex-row transition-[background-image] duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('${currentBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
      >
        <div className="absolute inset-0 bg-slate-950/85 pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row w-full h-full">

          {/* Calque des textes flottants */}
          <FloatingLayer texts={floatingTexts} />

          {/* MODAL DES SUCCÈS */}
          <AchievementsModal
              isOpen={isAchievModalOpen}
              onClose={() => setIsAchievModalOpen(false)}
              currentStats={{ level, gold, dps: totalDps }}
          />

          {/* MODAL PROFIL */}
          <ProfileModal
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              stats={stats}
              inventory={inventory}
          />

          {/* INDICATEUR GEMMES (HUD) */}
          {soulGems > 0 && (
              <div className="absolute top-4 right-36 z-40 flex items-center gap-3 bg-black/60 border border-purple-500/30 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 group cursor-default">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-purple-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                  <span className="relative z-10 text-xl drop-shadow-md">💎</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-purple-100 font-bold text-sm leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {formatNumber(soulGems)}
                    </span>
                  <span className="text-[10px] text-purple-300 font-mono mt-0.5 tracking-wide">
                        +{Math.round(soulGems * PRESTIGE_BONUS_PER_GEM * 100)}% Bonus
                    </span>
                </div>
              </div>
          )}

          {/* BOUTON PROFIL (Haut Droite - Gauche des succès) */}
          <div className="absolute top-4 right-20 z-40">
            <button
                onClick={() => setIsProfileOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white p-2 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                title="Profil"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏴‍☠️</span>
            </button>
          </div>

          {/* BOUTON SUCCÈS (Haut Droite - Coin) */}
          <div className="absolute top-4 right-4 z-40">
            <button
                onClick={() => setIsAchievModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white p-2 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                title="Succès"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
            </button>
          </div>

          {/* --- PANNEAU GAUCHE (Artefacts) --- */}
          <ArtifactsPanel
              gold={gold}
              artifactsInventory={artifactsInventory}
              buyArtifact={buyArtifact}
          />

          {/* --- ZONE CENTRALE (Jeu) --- */}
          <div className="flex-1 flex flex-col items-center p-6 h-screen overflow-y-auto">

            {/* Nom de la zone */}
            <div className="mb-2 text-gray-400 text-xs font-mono uppercase tracking-widest opacity-70">
              📍 {currentZoneName}
            </div>

            {/* En-tête (Or, Niveau, DPS) */}
            <GameHeader gold={gold} totalGps={totalGps} totalDps={totalDps} level={level} isBoss={isBoss} />

            {/* Zone de Monstre (Clic) */}
            <MonsterZone
                level={level}
                currentHp={currentHp}
                maxHp={maxHp}
                timeLeft={timeLeft}
                maxTime={(isBoss ? BOSS_TIME : BASE_TIME) + totalTimeBonus}
                isBoss={isBoss}
                monsterRef={monsterRef}
                handleManualClick={(e) => applyDamage(clickDamage, e.clientX, e.clientY)}
            />

            {/* Boutique d'améliorations */}
            <UpgradeShop
                gold={gold}
                level={level}
                inventory={inventory}
                clickDamage={clickDamage}
                buyItem={buyItem}
                buyClickUpgrade={buyClickUpgrade}
                onPrestige={handlePrestige}
            />

            {/* Message Offline (Gain hors ligne) */}
            {offlineMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 border border-yellow-500 p-4 rounded z-50 shadow-xl max-w-sm text-center animate-in fade-in zoom-in">
                  <p className="text-yellow-400 font-bold mb-1">Rapport</p>
                  <p className="text-sm text-gray-300">{offlineMessage}</p>
                  <button onClick={() => setOfflineMessage(null)} className="mt-3 px-4 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold">OK</button>
                </div>
            )}

            {/* Bouton Reset (Debug/Secours) */}
            <button onClick={handleReset} className="mt-12 text-gray-500 hover:text-red-500 text-xs underline pb-10">
              Reset Save
            </button>
          </div>

        </div>
      </main>
  );
}
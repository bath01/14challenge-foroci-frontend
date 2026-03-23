# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**ForoCI** — Fitness tracker mobile (Jour 9 du Challenge 14-14-14). "Foro" signifie force/courage en malinké. Stack : React Native + Expo (frontend), Next.js API Routes (backend séparé).

## Commandes de développement

```bash
# Prérequis : Node 22+ (fichier .nvmrc présent)
nvm use 22

# Installer les dépendances
npm install

# Lancer en développement
npm start           # Expo dev server
npm run ios         # Simulateur iOS
npm run android     # Émulateur Android
npm run web         # Navigateur web

# Vérification TypeScript
npx tsc --noEmit
```

## Architecture

```
src/
├── constants/theme.ts       # Couleurs CI, espacements, typographie (DM Sans)
├── types/index.ts           # Types TypeScript (Exercise, Workout, Program, etc.)
├── data/mockData.ts         # Données fictives (sera remplacé par appels API)
├── services/api.ts          # Client API vers le backend Next.js
├── hooks/useTimer.ts        # Hook du chronomètre exercice/repos
├── utils/formatters.ts      # Utilitaires de formatage (timer MM:SS)
├── components/
│   ├── ui/                  # Composants réutilisables (FlagBar, StatCard, MiniBarChart)
│   └── home/Calendar.tsx    # Calendrier mensuel d'entraînement
├── screens/                 # 5 écrans principaux
│   ├── HomeScreen.tsx       # Tableau de bord (stats, calendrier, poids, dernière séance)
│   ├── WorkoutsScreen.tsx   # Historique des séances + vue détaillée
│   ├── ProgramsScreen.tsx   # Programmes d'entraînement + planning hebdo
│   ├── TimerScreen.tsx      # Chronomètre avec cercle SVG animé
│   └── AboutScreen.tsx      # Projet, équipe, stack
└── navigation/
    └── BottomTabNavigator.tsx  # Navigation 5 onglets
```

## Design System

- **Thème sombre** : fond `#0A0A0E`, cartes `#1A1A22`, bordures `#2A2A35`
- **Couleurs CI** (Côte d'Ivoire) : orange `#FF8C00`, vert `#009E49`
- **Police** : DM Sans (300 à 800), chargée via `@expo-google-fonts/dm-sans`
- Les constantes de thème sont centralisées dans `src/constants/theme.ts`

## API Backend (Next.js - repo séparé)

Endpoints prévus : `/api/workouts`, `/api/exercises`, `/api/programs`, `/api/stats/*`, `/api/metrics/weight`. Les données mock dans `src/data/mockData.ts` reproduisent la structure attendue.

## Conventions

- Commentaires et documentation interne en français
- Noms de variables et fonctions descriptifs en anglais
- Chaque fonction doit répondre à une tâche bien précise
- Code lisible et compréhensif

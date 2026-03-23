# ForoCI - Fitness Tracker Mobile

> "Foro" = force / courage en malinké. Représente la détermination et l'effort physique dans l'entraînement.

**Jour 9 du Challenge 14-14-14** — Application mobile de suivi d'entraînement aux couleurs de la Côte d'Ivoire.

## Stack technique

- **React Native** + **Expo** (SDK 54)
- **TypeScript**
- **React Navigation** (Bottom Tabs)
- **@expo/vector-icons** (Ionicons)
- **react-native-svg** (cercle animé du timer)
- **DM Sans** (police via @expo-google-fonts)

## Prérequis

- Node.js 22+ (fichier `.nvmrc` inclus)
- Expo Go sur iOS ou Android

## Installation

```bash
nvm use 22
npm install
```

## Lancement

```bash
npm start         # Serveur Expo (QR code)
npm run ios       # Simulateur iOS
npm run android   # Émulateur Android
npm run web       # Navigateur
```

## Fonctionnalités

| Écran | Description |
|-------|-------------|
| **Accueil** | Statistiques (séances, calories, streak), calendrier mensuel, progression du poids, dernière séance |
| **Séances** | Historique des entraînements avec vue détaillée (exercices, séries, reps, poids) |
| **Programmes** | Plans d'entraînement hebdomadaires (Force Totale, Cardio Brûleur, Souplesse Zen) |
| **Timer** | Chronomètre d'exercice + compte à rebours de repos avec cercle SVG animé |
| **À propos** | Présentation du projet, équipe et stack |

## Architecture

```
src/
├── constants/theme.ts          # Couleurs CI, typographie, espacements
├── types/index.ts              # Types TypeScript (Exercise, Workout, Program...)
├── data/mockData.ts            # Données fictives (à connecter au backend)
├── services/api.ts             # Client API (Next.js backend)
├── hooks/useTimer.ts           # Hook chronomètre exercice/repos
├── utils/formatters.ts         # Utilitaires de formatage
├── components/
│   ├── ui/                     # StatCard, MiniBarChart, FlagBar, ExerciseIcon
│   └── home/Calendar.tsx       # Calendrier mensuel
├── screens/                    # HomeScreen, WorkoutsScreen, ProgramsScreen, TimerScreen, AboutScreen
└── navigation/
    └── BottomTabNavigator.tsx  # Navigation 5 onglets
```

## Design

- **Thème sombre** : fond `#0A0A0E`, cartes `#1A1A22`
- **Couleurs CI** : orange `#FF8C00`, vert `#009E49`
- **Police** : DM Sans (300 à 800)
- **Icônes** : Ionicons (@expo/vector-icons)

## Backend

API Next.js (repo séparé) — endpoints prévus :
- `/api/workouts` — CRUD séances
- `/api/exercises` — Catalogue d'exercices
- `/api/programs` — Programmes d'entraînement
- `/api/stats/summary`, `/api/stats/progress`, `/api/stats/calendar`
- `/api/metrics/weight` — Suivi du poids corporel

## Équipe

- **Bath Dorgeles** — Chef de projet & Front-end
- **Oclin Marcel C.** — Dev Mobile (React Native)
- **Rayane Irie** — Back-end (Next.js)

## Licence

Open Source — [225os.com](https://225os.com) & GitHub

---

*Challenge 14-14-14 — Mars 2026*

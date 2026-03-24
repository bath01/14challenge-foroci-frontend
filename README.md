# ForoCI - Fitness Tracker Mobile

> "Foro" = force / courage en malinké. Représente la détermination et l'effort physique dans l'entraînement.

**Jour 9 du Challenge 14-14-14** — Application mobile de suivi d'entraînement aux couleurs de la Côte d'Ivoire.

## Stack technique

- **React Native** + **Expo** (SDK 54)
- **TypeScript** 5.9
- **React Navigation** (Bottom Tabs + Native Stack)
- **@expo/vector-icons** (Ionicons)
- **react-native-svg** (cercle animé du timer)
- **@react-native-async-storage** (persistance locale)
- **DM Sans** (police via @expo-google-fonts)

## Prérequis

- Node.js 22+ (fichier `.nvmrc` inclus)
- Expo Go sur iOS ou Android

## Installation

```bash
nvm use 22
npm install
npx expo install @react-navigation/native-stack @react-native-async-storage/async-storage
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
| **Splash Screen** | Animation d'intro avec logo ForoCI, drapeau CI et slogan (5s) |
| **Inscription / Connexion** | Authentification JWT via l'API (email + mot de passe) |
| **Accueil** | Stats cliquables, calendrier interactif, progression poids, dernière séance, aperçu programmes |
| **Séances** | Liste des séances avec détail (exercices, séries, reps, durée, calories) + bouton démarrer |
| **Programmes** | Plans d'entraînement avec difficulté, séances ordonnées + lancement direct |
| **Session active** | Entraînement guidé exercice par exercice avec timer intégré (exercice → repos → suivant → fin) |
| **Calendrier** | Planification de séances sur des jours futurs (stockage local) |
| **À propos** | Présentation du projet, équipe et stack technique |

## Flux d'entraînement

```
Programme → Choisir séance → Aperçu exercices → Démarrer
  → Exercice 1 (timer) → Série terminée → Repos (compte à rebours)
  → Exercice 2 → ... → Écran récap (exercices, calories, durée)
```

## Architecture

```
src/
├── constants/theme.ts              # Couleurs CI, typographie, espacements
├── types/index.ts                  # Types TypeScript alignés sur l'API
├── data/mockData.ts                # Données statiques (équipe)
├── services/
│   ├── api.ts                      # Client API REST avec JWT (32 endpoints)
│   └── schedule.ts                 # Planification locale (AsyncStorage)
├── contexts/
│   └── AuthContext.tsx              # Contexte auth (login, register, token, session)
├── hooks/
│   ├── useTimer.ts                 # Hook chronomètre exercice/repos
│   └── useApi.ts                   # Hook générique de fetch (loading, error, refresh)
├── utils/formatters.ts             # Utilitaires de formatage (timer MM:SS)
├── components/
│   ├── ui/                         # StatCard, MiniBarChart, FlagBar, ScreenLoader, ScreenError
│   └── home/
│       ├── Calendar.tsx            # Calendrier interactif (effectué/planifié/aujourd'hui)
│       └── ScheduleModal.tsx       # Modal de planification (programme → séance → jour)
├── screens/
│   ├── SplashScreen.tsx            # Animation d'introduction
│   ├── LoginScreen.tsx             # Connexion
│   ├── RegisterScreen.tsx          # Inscription
│   ├── HomeScreen.tsx              # Tableau de bord (pull-to-refresh)
│   ├── WorkoutsScreen.tsx          # Historique des séances
│   ├── ProgramsScreen.tsx          # Programmes d'entraînement
│   ├── WorkoutSessionScreen.tsx    # Session active avec timer
│   └── AboutScreen.tsx             # À propos
└── navigation/
    ├── AuthNavigator.tsx           # Stack Login/Register
    ├── AppNavigator.tsx            # Stack Tabs + Session plein écran
    └── BottomTabNavigator.tsx      # Navigation 4 onglets
```

## API Backend

Base URL : `https://api.fitness.chalenge14.com/api/v1`

| Catégorie | Endpoints | Description |
|-----------|-----------|-------------|
| **Auth** | `POST /auth/register`, `POST /auth/login` | Inscription et connexion (JWT) |
| **Users** | `GET/PATCH /users/me`, `GET /users/me/programs` | Profil et programmes inscrits |
| **Exercises** | `GET/POST /exercises`, `GET/PATCH/DELETE /exercises/{id}` | Catalogue d'exercices |
| **Programs** | `GET/POST /programs`, `GET/PATCH/DELETE /programs/{id}` | Programmes d'entraînement |
| **Workouts** | `GET/POST /workouts`, `GET/PATCH/DELETE /workouts/{id}` | Séances et exercices |
| **Metrics** | `POST/GET /metrics/weight`, `POST/GET /metrics/exercise-logs`, `GET /metrics/calendar` | Poids, performances, calendrier |

## Design

- **Thème sombre** : fond `#0A0A0E`, cartes `#1A1A22`, bordures `#2A2A35`
- **Couleurs CI** (Côte d'Ivoire) : orange `#FF8C00`, vert `#009E49`
- **Police** : DM Sans (300 à 800)
- **Icônes** : Ionicons (@expo/vector-icons)

## Équipe

- **Bath Dorgeles** — Chef de projet & Front-end
- **Oclin Marcel C.** — Dev Mobile (React Native)
- **Rayane Irie** — Back-end (Next.js)

## Licence

Open Source — [225os.com](https://225os.com) & GitHub

---

*Challenge 14-14-14 — Mars 2026*

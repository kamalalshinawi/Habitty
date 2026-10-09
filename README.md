# Habitty 🎯

> A production-ready habit tracker and productivity app built with **React Native 0.86**, **Expo SDK 57**, **Firebase**, and **TypeScript** — featuring real-time cloud sync, email authentication, and an animated branded splash experience.

[![React Native](https://img.shields.io/badge/React%20Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-13.0-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.13-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**Habitty** helps individuals build consistent habits, stay accountable, and organize daily tasks. It features an immersive edge-to-edge layout, seamless **Light & Dark mode** switching, per-user cloud data with **Firebase**, and an animated branded splash screen. All user data (habits, todos, preferences) is persisted locally via Redux Persist and synced to Firestore in real time.

---

## ✨ Key Features

### 🔐 Authentication & Cloud Sync
- **Email/Password Auth** powered by Firebase Authentication with persistent session via `AsyncStorage`.
- **Sign Up / Sign In / Forgot Password** screens with full validation, loading states, and user-friendly error messages.
- **Real-time Firestore Sync** — habits and todos are written to `users/{uid}/data/habits` and `users/{uid}/data/todos` on every change and streamed back via `onSnapshot` listeners.
- **Offline-First Architecture** — Redux Persist stores everything locally; Firebase sync is additive and non-blocking.

### 🔄 Habit Tracking & Insights
- **Daily Progress Ring**: Real-time circular progress tracker calculating daily completion percentages.
- **Streak Analytics**: Live calculation of current and longest consecutive completion streaks.
- **Habit Customization**: Color palettes, icons, and frequency presets (*Every Day*, *Weekdays*, *Weekends*).
- **Live Habit Preview**: Interactive card preview while designing a new habit.
- **Comprehensive Habit Detail Screen**: Analytics, streak history, and monthly calendar heatmaps.

### 📝 Tasks & To-Do Management
- **Priority-Driven Workflow**: Categorize tasks by **High**, **Medium**, or **Low** priority with color-coded badges.
- **Time Scheduling**: Smart presets (*08:00 AM*, *10:00 AM*, *02:00 PM*, *06:00 PM*, *All Day*) or custom times.
- **Subtask Checklist Builder**: Break complex tasks into actionable steps with completion tracking.
- **Collapsible Completed Tasks**: Expandable accordion section to review finished tasks.

### 🎨 Design System & Theming
- **Dynamic Dark / Light Themes**: Global state providing tokens (`background`, `card`, `text`, `border`, `tint`, `success`, `danger`).
- **Typography**: Full integration with `@expo-google-fonts/nunito` (Regular, Medium, SemiBold, Bold, ExtraBold).
- **Immersive Edge-to-Edge**: Android system/navigation bars hidden on launch via `expo-navigation-bar`.
- **Animated Branded Splash**: Custom splash component with app logo, spring animation, pulsing glow, and progress bar — replacing raw `ActivityIndicator` spinners.

---

## 🔥 Firebase Services

Habitty integrates with **Firebase** (Web SDK v13) for backend services. The Firebase project is `habitty-a9dff`.

### Services Used

| Service | Purpose | Module |
|---|---|---|
| **Authentication** | Email/password sign-up, sign-in, password reset | `firebase/auth` |
| **Cloud Firestore** | Per-user real-time data storage (habits, todos, profile) | `firebase/firestore` |

### Firestore Data Model

```
users/
  {userId}/                    ← User profile document
    ├── uid: string
    ├── email: string
    ├── displayName: string
    ├── createdAt: Timestamp
    └── lastLoginAt: Timestamp
    data/
      habits/                  ← User habits document
        ├── habits: Habit[]
        ├── habitDays: Record<string, HabitStatus>
        └── updatedAt: Timestamp
      todos/                   ← User todos document
        ├── todos: Todo[]
        └── updatedAt: Timestamp
```

### Security Rules

All data is scoped to the authenticated user — users can only read/write their own documents:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** sign-in under **Authentication → Sign-in method**
3. Create a **Cloud Firestore** database
4. Register an **Android app** with package `com.kamalalshinawi.Habitty` and download `google-services.json` to the project root
5. Create a `.env` file in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Important**: For EAS cloud builds, you must also set these variables in the EAS dashboard under the `preview` environment. See [EAS Build Troubleshooting](#-eas-build-troubleshooting) below.

---

## 🏗️ Architecture & Project Structure

The project follows a **feature-first modular architecture** with Redux Toolkit for global state:

```
Habitty/
├── assets/                          # App icons, splash, adaptive-icon
├── src/
│   ├── components/ui/               # Shared reusable UI elements
│   │   ├── SplashScreen.tsx         # Animated branded splash component
│   │   ├── DailyProgress.tsx        # Circular progress ring
│   │   ├── HabitCard.tsx            # Habit display card
│   │   ├── HabitMonthlyCalendar.tsx # Calendar heatmap
│   │   ├── ProgressRing.tsx         # SVG progress ring
│   │   └── ...
│   ├── config/
│   │   └── firebaseConfig.ts        # Firebase configuration (reads from .env)
│   ├── constants/                   # Design tokens, colors, fonts
│   ├── context/
│   │   └── ThemeContext.tsx          # Light/Dark mode provider
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts         # Redux auth state (user, isAuthenticated)
│   │   │   └── hooks/
│   │   │       ├── useAuth.ts       # Auth actions hook (sign in/up/out)
│   │   │       └── useCloudSync.ts  # Bi-directional Firestore sync hook
│   │   ├── habits/
│   │   │   ├── habitSlice.ts        # Redux habit state with daily tracking
│   │   │   └── hooks/useHabits.ts   # Habit CRUD + analytics hook
│   │   ├── theme/
│   │   │   └── themeSlice.ts        # Persisted theme preference
│   │   └── todos/
│   │       ├── todoSlice.ts         # Redux todo state with subtasks
│   │       └── hooks/useTodos.ts    # Todo CRUD hook
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Auth-aware root navigator
│   │   ├── TabNavigator.tsx         # Bottom tabs (Habits, To-Do, Calendar, Profile)
│   │   └── types.ts                 # Type-safe navigation params
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SignInScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TodoListScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── ProfileScreen.tsx        # Profile + sign out
│   │   ├── HabitDetailScreen.tsx
│   │   ├── AddHabitScreen.tsx
│   │   └── AddTodoScreen.tsx
│   ├── services/
│   │   ├── firebase.ts              # Firebase app init + Auth + Firestore
│   │   ├── authService.ts           # Auth operations (sign up, sign in, reset)
│   │   └── firestoreService.ts      # Firestore CRUD + real-time listeners
│   ├── store/
│   │   ├── index.ts                 # Redux store + persist config
│   │   └── hooks.ts                 # Typed useAppSelector / useAppDispatch
│   ├── types/                       # Global TypeScript definitions
│   └── utils/
│       └── dateHelpers.ts           # Date formatting + streak calculation
├── App.tsx                          # Entry point: providers, fonts, splash
├── app.json                         # Expo config (plugins, icons, splash)
├── eas.json                         # EAS Build profiles
├── firestore.rules                  # Firestore security rules
├── google-services.json             # Firebase Android config
├── .env                             # Environment variables (git-ignored)
├── .yarnrc                          # Yarn config (ignore-engines for CI)
└── tsconfig.json                    # TypeScript configuration
```

### State Management Flow

```
┌─────────────────────────────────────────────────┐
│                    App.tsx                       │
│  PersistGate → Redux Provider → ThemeContext     │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   RootNavigator     │
          │  (auth-aware routing)│
          └──────┬───────┬──────┘
                 │       │
    ┌────────────▼┐  ┌───▼─────────────┐
    │  Auth Stack  │  │   Main Tabs     │
    │  (Sign In,   │  │  (Home, Todo,   │
    │   Sign Up,   │  │   Calendar,     │
    │   Forgot)    │  │   Profile)      │
    └──────────────┘  └────────┬────────┘
                               │
                    ┌──────────▼──────────┐
                    │  useCloudSync()     │
                    │  Redux ↔ Firestore  │
                    │  (real-time sync)   │
                    └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22.x or v24.x (v24.12+ for Firebase AI module compatibility)
- [Yarn](https://yarnpkg.com/) v1.22+
- [Expo Go](https://expo.dev/go) on your device, or an Android Emulator / iOS Simulator
- A [Firebase](https://console.firebase.google.com) project (see [Firebase Setup](#firebase-setup))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kamalalshinawi/Habitty.git
cd Habitty

# 2. Install dependencies
yarn install

# 3. Create .env file with your Firebase config (see Firebase Setup section)

# 4. Start the Expo development server
yarn start

# 5. Launch on a specific platform
yarn android     # Android emulator or connected device
yarn ios         # iOS simulator
```

---

## 🛠️ Development Scripts

| Command | Description |
|---|---|
| `yarn start` | Start Expo dev server with Metro bundler |
| `yarn android` | Launch on Android emulator or device |
| `yarn ios` | Launch on iOS simulator |
| `yarn lint` | Run ESLint across the codebase |
| `npx tsc --noEmit` | TypeScript type checking (zero errors required) |
| `npx expo-doctor` | Diagnose dependency and config issues |
| `npx expo install --fix` | Auto-fix incompatible package versions |

---

## 📱 EAS Build & Distribution

The app is pre-configured with **EAS (Expo Application Services)** for cloud builds:

### Build Profiles (`eas.json`)

| Profile | Type | Output | Node |
|---|---|---|---|
| `development` | Dev client | Internal `.apk`/`.ipa` | 24.12.0 |
| `preview` | Internal testing | `.apk` (Android) | 24.12.0 |
| `production` | Store release | `.aab` (auto-increment) | — |

### Build Commands

```bash
# Preview APK (internal distribution)
npx eas-cli@latest build --profile preview --platform android

# Production AAB (store release)
npx eas-cli@latest build --profile production --platform android

# Check build status
npx eas-cli@latest build:list --platform android --limit 5
```

### Setting EAS Environment Variables

For cloud builds to access Firebase, all `EXPO_PUBLIC_*` variables must be set on EAS:

```bash
npx eas-cli@latest env:set --environment preview \
  --name EXPO_PUBLIC_FIREBASE_API_KEY \
  --value "your_api_key" \
  --visibility plaintext --non-interactive

# Repeat for all 7 Firebase variables
```

---

## 🐛 Known Issues & Fixes

This section documents real bugs encountered during development and their solutions.

### 1. EAS Build Fails: `@firebase/ai` Engine Incompatibility

**Error:**
```
error @firebase/ai@3.0.0: The engine "node" is incompatible with this module.
Expected version ">=24.12.0". Got "24.4.0"
```

**Cause:** The `firebase@13.0.0` package depends on `@firebase/ai@3.0.0` which requires Node ≥ 24.12.0. The default EAS builder uses Node 22.x, and even specifying `"node": "24.4.0"` in `eas.json` is too old.

**Fix (two-pronged):**
1. Set `"node": "24.12.0"` in the `eas.json` build profile so EAS installs a compatible Node:
   ```json
   "preview": {
     "node": "24.12.0",
     ...
   }
   ```
2. Add a `.yarnrc` file with `--install.ignore-engines true` as a safety net for transient CI engine check failures.

---

### 2. EAS Build Fails: Missing Firebase Environment Variables

**Error:**
```
No environment variables with visibility "Plain text" and "Sensitive"
found for the "preview" environment on EAS.
```

**Cause:** The `.env` file is local-only and **not uploaded** to EAS cloud builders. Without the `EXPO_PUBLIC_FIREBASE_*` variables, the Firebase SDK cannot initialize and the build crashes.

**Fix:** Push all 7 Firebase env vars to the EAS `preview` environment:
```bash
npx eas-cli@latest env:set --environment preview \
  --name EXPO_PUBLIC_FIREBASE_API_KEY \
  --value "AIzaSy..." --visibility plaintext --non-interactive
# ... repeat for AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET,
#     MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID
```

---

### 3. React 19: `useRef` Lint Error in Animated Values

**Error:**
```
ESLint: Do not access ref.current during render (react-hooks/refs)
```

**Cause:** In React 19, the React Compiler enforces strict rules against reading `useRef().current` during render. The common pattern `const anim = useRef(new Animated.Value(0)).current` violates this.

**Fix:** Replace with `useState` lazy initializer:
```tsx
// ❌ Breaks in React 19
const opacity = useRef(new Animated.Value(0)).current;

// ✅ Works with React 19 + React Compiler
const [opacity] = useState(() => new Animated.Value(0));
```

---

### 4. Expo SDK 57: Top-Level `splash` in `app.json` Rejected

**Error:**
```
expo-doctor: "splash" is not a valid property at the root level
```

**Cause:** Expo SDK 57 moved splash screen configuration to the `expo-splash-screen` config plugin. The legacy root-level `"splash"` key is no longer accepted.

**Fix:** Remove root `"splash"` and configure via plugins:
```json
{
  "expo": {
    "plugins": [
      ["expo-splash-screen", {
        "image": "./assets/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }]
    ]
  }
}
```

---

### 5. Android Adaptive Icon Uses Placeholder Instead of App Branding

**Cause:** The default Expo template ships generic placeholder icons (`android-icon-foreground.png`, etc.) that display a generic concentric-circle design on the home screen.

**Fix:** Replace with a properly sized foreground image (1024×1024, content centered in the inner 66% safe zone) and configure in `app.json`:
```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#ffffff",
    "foregroundImage": "./assets/adaptive-icon.png"
  }
}
```

---

### 6. Firebase Auth Persistence: `getReactNativePersistence` Import

**Cause:** In React Native, `firebase/auth` exports `getReactNativePersistence` only in the RN bundle, but TypeScript cannot find the type declaration.

**Fix:** Use `@ts-expect-error` for the import and initialize auth with AsyncStorage persistence:
```typescript
// @ts-expect-error - getReactNativePersistence is exported in RN bundle
import { getReactNativePersistence } from 'firebase/auth';

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

---

## 🛡️ Code Quality & Conventions

- **Atomic Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `build:`, `docs:`).
- **Strict Typing**: 100% TypeScript with zero compilation errors (`npx tsc --noEmit`).
- **Lint Clean**: Zero ESLint errors and warnings (`npx expo lint`).
- **Expo Doctor**: All 21 checks pass (`npx expo-doctor`).
- **Clean Architecture**: Separation of concerns — screens, features/slices, services, hooks, and navigation are all isolated.
- **Offline-First**: Redux Persist stores all state locally; Firebase sync is additive.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.86.3 |
| **Platform** | Expo SDK 57, Expo Router-compatible |
| **Language** | TypeScript 6.0 |
| **State** | Redux Toolkit 2.13 + Redux Persist 6.0 |
| **Backend** | Firebase 13.0 (Auth + Firestore) |
| **Storage** | AsyncStorage (local persistence) |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **Typography** | @expo-google-fonts/nunito |
| **Build** | EAS Build (cloud CI/CD) |
| **Updates** | EAS Update (OTA) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

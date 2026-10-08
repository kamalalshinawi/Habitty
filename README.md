# (Habitty) 🎯

> A modern, elegant habit tracker and to-do productivity application built with **React Native 0.86**, **Expo SDK 57**, and **TypeScript**.

[![React Native](https://img.shields.io/badge/React%20Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-57.0.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**Habi** is engineered to help individuals build consistent habits, stay accountable, and organize daily tasks effortlessly. Designed with an immersive edge-to-edge layout, seamless **Light & Dark mode** switching, customizable color palettes, and typography powered by Google’s **Nunito** font family.

---

## ✨ Key Features

### 🔄 Habit Tracking & Insights
- **Daily Progress Ring**: Real-time visual circular progress tracker calculating daily completion percentages.
- **Streak Analytics**: Live calculation and display of current and longest consecutive completion streaks.
- **Habit Customization**: Create habits with customizable color palettes, icons, and frequency presets (*Every Day*, *Weekdays*, *Weekends*).
- **Live Habit Preview**: Interactive card preview while designing a new habit in the creation flow.
- **Comprehensive Habit Detail Screen**: Deep-dive into habit analytics, streak history, and monthly calendar heatmaps.

### 📝 Tasks & To-Do Management
- **Priority-Driven Workflow**: Categorize tasks by **High**, **Medium**, or **Low** priority with color-coded badges and filter tabs.
- **Time Scheduling**: Assign times using smart presets (*08:00 AM*, *10:00 AM*, *02:00 PM*, *06:00 PM*, *All Day*) or specify custom times.
- **Subtask Checklist Builder**: Break complex tasks down into actionable steps with completion tracking.
- **Collapsible Completed Tasks**: Expandable accordion section to review and toggle finished tasks without cluttering the main list.
- **Full-Device Task Modal**: Pinned bottom action bar ensures the *"Create Task"* button is permanently accessible without scrolling.

### 🎨 Design System & Theming
- **Dynamic Dark / Light Themes**: Global `ThemeContext` providing theme tokens (`background`, `card`, `text`, `border`, `tint`, `success`, `danger`).
- **Typography**: Complete integration with `@expo-google-fonts/nunito` (`400 Regular`, `500 Medium`, `600 SemiBold`, `700 Bold`, `800 ExtraBold`).
- **Immersive Edge-to-Edge Android View**: Android system navigation bar icons and status bar are hidden on launch via `expo-navigation-bar`, eliminating bottom gaps and maximizing display area.

---

## 🏗️ Architecture & Project Structure

The project follows a clean, feature-first modular architecture:

```text
Habi/
├── assets/                    # App icons, splash screens, and adaptive assets
├── src/
│   ├── components/            # Shared reusable UI elements
│   │   └── ui/
│   │       ├── AddHabitModal.tsx
│   │       ├── AddTodoModal.tsx
│   │       ├── DailyProgress.tsx
│   │       ├── FloatingActionButton.tsx
│   │       ├── HabitCard.tsx
│   │       ├── HabitMonthlyCalendar.tsx
│   │       ├── HabitStats.tsx
│   │       ├── HomeHeader.tsx
│   │       ├── ProgressRing.tsx
│   │       └── TabIcons.tsx
│   ├── constants/             # Design tokens and static data
│   │   ├── colors.ts          # Light and dark color palettes
│   │   ├── dummyData.ts       # Seed habits and demo data
│   │   └── fonts.ts           # Typography font definitions
│   ├── context/               # Global application state
│   │   └── ThemeContext.tsx   # Light/Dark mode state and toggle
│   ├── features/              # Feature modules
│   │   ├── habits/            # Habit tracking state, hooks, and views
│   │   │   ├── context/       # HabitContext provider
│   │   │   ├── hooks/         # useHabits, useHabitDetail
│   │   │   └── types/         # Habit data models
│   │   └── todos/             # To-do state, hooks, and types
│   │       ├── context/       # TodoContext provider
│   │       └── ...
│   ├── navigation/            # Navigation routing layer
│   │   ├── RootNavigator.tsx  # Native stack navigator (Main, HabitDetail, AddHabit, AddTodo)
│   │   ├── TabNavigator.tsx   # Bottom tab bar (Habits, To-Do, Calendar, Profile)
│   │   └── types.ts           # Type-safe navigation parameters
│   ├── screens/               # Screen components
│   │   ├── AddHabitScreen.tsx # Full-screen habit creation
│   │   ├── AddTodoScreen.tsx  # Full-device task creation screen
│   │   ├── CalendarScreen.tsx # Monthly calendar overview
│   │   ├── HabitDetailScreen.tsx # Habit detail statistics
│   │   ├── HomeScreen.tsx     # Home habits dashboard
│   │   ├── ProfileScreen.tsx  # User profile & preferences
│   │   └── TodoListScreen.tsx # Task list and filter interface
│   ├── types/                 # Global TypeScript definitions
│   │   ├── habit.ts
│   │   └── todo.ts
│   └── utils/                 # Pure helper functions
│       └── dateHelpers.ts     # Date formatting and streak calculation utilities
├── App.tsx                    # Application entry point with providers and font loaders
├── app.json                   # Expo application configuration
├── eas.json                   # Expo Application Services build configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) on your physical device, or an iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/habi.git
   cd habi
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Start the Expo development server**:
   ```bash
   yarn start
   ```

4. **Launch on a specific platform**:
   ```bash
   yarn android   # Launch on Android emulator or connected device
   yarn ios       # Launch on iOS simulator
   yarn web       # Launch in browser
   ```

---

## 🛠️ Development Scripts

| Command | Description |
| :--- | :--- |
| `yarn start` | Starts the Expo dev server with Metro bundler |
| `yarn android` | Starts the app on an Android device or emulator |
| `yarn ios` | Starts the app on an iOS simulator |
| `yarn lint` | Runs ESLint across the codebase |
| `npx tsc --noEmit` | Runs TypeScript type checking with zero code emission |

---

## 📱 EAS Build & Distribution

The app is pre-configured with **EAS (Expo Application Services)**:

- **EAS Project ID**: Defined in `app.json`
- **Profiles** (`eas.json`):
  - `development`: Builds development client with `expo-dev-client`.
  - `preview`: Internal testing distribution APK / IPA.
  - `production`: Store release builds.

To trigger a preview build:
```bash
eas build --profile preview --platform android
```

---

## 🛡️ Code Quality & Conventions

- **Atomic Commits**: Follows Conventional Commits standard (`feat:`, `fix:`, `refactor:`, `docs:`).
- **Strict Typing**: 100% TypeScript with strict null checks and zero compilation errors.
- **Clean Architecture**: Separation of concerns between presentation, domain logic, and state layers.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

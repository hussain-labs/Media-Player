# Media Player

A premium, production-ready local media player application built with **Expo**, **React Native**, and **Redux Toolkit**. Designed with a modern glassmorphism UI featuring ambient gradient effects, this app scans your device for audio and video files, organizes them into an intuitive folder hierarchy, and delivers a stunning playback experience rivaling apps like Apple Music and Spotify.

---

## Overview

Media Player is a cross-platform mobile application (iOS & Android) that discovers all local audio and video files on the user's device, intelligently parses their file paths into a clean folder-tree structure, and presents them through a beautifully crafted interface with full playback controls.

### Key Highlights

- **Glassmorphism Design** — Frosted glass surfaces, semi-transparent layers, and blurred backdrops throughout every screen
- **Ambient Gradients** — Dynamic gradient glows and accent strips that bring life to the UI
- **Dark & Light Modes** — Full theme system with carefully crafted color tokens for both modes
- **Responsive Layout** — Flexbox-based design using percentage and ratio calculations — no hardcoded pixel values for structural sizing
- **Instant Rendering** — Ships with mock data so the UI renders beautifully immediately while real media scanning runs asynchronously in the background
- **Safe Area Aware** — Properly handles notches, dynamic islands, and system bars across all iOS and Android devices

---

## Screens

| Screen | Description |
|--------|-------------|
| **Folder Browser** | Grid of glassmorphic folder cards with file counts, media type icons, and gradient accent strips |
| **Folder Detail** | Breadcrumb navigation, audio/video file list with active track highlighting, and "Play All" button |
| **Now Playing** | Immersive player with large album art, seek bar, glassmorphic controls (Play/Pause, Skip, Shuffle, Repeat), volume slider, and "Up Next" queue panel |
| **Video Player** | 16:9 landscape presentation with gradient placeholder and overlay glassmorphic play/pause control |
| **Mini Player** | Sticky floating component with progress bar, track info, and quick playback controls |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 52 with Expo Router v4 (file-based navigation) |
| **Language** | JavaScript (React Native 0.76) |
| **State Management** | Redux Toolkit (RTK) with `@reduxjs/toolkit` + `react-redux` |
| **Icons** | `lucide-react-native` (with `react-native-svg`) |
| **Media Scanning** | `expo-media-library` + `expo-file-system` |
| **Audio/Video Playback** | `expo-av` (playback structure ready for integration) |
| **UI Effects** | `expo-blur` (glassmorphism), `expo-linear-gradient` (ambient gradients) |
| **Slider Controls** | `@react-native-community/slider` (seek bar, volume) |
| **Layout Safety** | `react-native-safe-area-context` (notch/dynamic island handling) |
| **Navigation** | `expo-router` with `react-native-screens` + `react-native-gesture-handler` |
| **Animations** | `react-native-reanimated` (navigation transitions) |

---

## Project Architecture

```
Media-Player/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.js                # Root layout: Redux Provider, SafeAreaProvider, theme wrapper, MiniPlayer
│   ├── index.js                  # Home screen: Folder Browser with grid, theme toggle, permission states
│   ├── folder/
│   │   └── [id].js              # Dynamic route: Folder detail with file list and breadcrumb
│   └── player.js                 # Full-screen Now Playing / Video Player view
│
├── store/                        # Redux Toolkit state management
│   ├── index.js                  # Root store configuration (combines all slices)
│   ├── playerSlice.js            # Player state: currentTrack, isPlaying, progress, volume, shuffle, repeat
│   ├── librarySlice.js           # Library state: folders, queue, media scanning (async thunk)
│   └── themeSlice.js             # Theme state: dark/light mode toggle
│
├── components/                   # Reusable UI components
│   ├── MiniPlayer.js             # Sticky floating mini-player with blur backdrop
│   ├── FolderCard.js             # Glassmorphic folder card for the grid layout
│   └── GlassButton.js           # Blurred circular button with active/inactive states
│
├── services/                     # Business logic and utilities
│   └── mediaScanner.js           # expo-media-library scanner + folder path parser engine
│
├── constants/                    # Design system
│   └── theme.js                  # Color tokens, spacing, border radius, font sizes, font weights
│
├── assets/                       # Static assets
│   ├── icon.png                  # App icon (1024x1024 recommended)
│   ├── adaptive-icon.png         # Android adaptive icon
│   └── splash.png                # Splash screen image
│
├── app.json                      # Expo configuration (permissions, plugins, identifiers)
├── babel.config.js               # Babel preset for Expo
├── package.json                  # Dependencies and scripts
└── .gitignore                    # Git ignore rules
```

---

## Complete Setup Guide

### Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| **Node.js** | 18.0+ | `node --version` |
| **npm** or **yarn** | npm 9+ / yarn 1.22+ | `npm --version` |
| **Expo CLI** | Latest | `npx expo --version` |
| **Git** | 2.30+ | `git --version` |
| **Watchman** (macOS) | Latest | `watchman --version` |

#### For iOS Development (macOS only)
- **Xcode** 15+ with iOS 17+ Simulator
- **CocoaPods** (`sudo gem install cocoapods`)

#### For Android Development
- **Android Studio** with:
  - Android SDK 34+
  - Android Build Tools 34+
  - Android Emulator with a configured AVD (API 34 recommended)
- **JAVA_HOME** environment variable set (JDK 17 recommended)

#### For Physical Device Testing
- **Expo Go** app installed from App Store / Google Play
- Device and development machine on the same Wi-Fi network

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/hussain-labs/Media-Player.git
cd Media-Player
```

---

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This installs all 17 production dependencies and 1 dev dependency.

---

### Step 3: Start the Development Server

```bash
npx expo start
```

This will display a QR code in your terminal:

| Key | Action |
|-----|--------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| `w` | Open in web browser |
| Scan QR | Open on physical device via Expo Go |

---

### Step 4: Run on a Specific Platform

```bash
# iOS (macOS only)
npx expo start --ios

# Android
npx expo start --android

# Web (quick preview)
npx expo start --web
```

---

### Step 5: Build for Production

#### Using EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```

#### Local Build

```bash
# iOS (requires macOS + Xcode)
npx expo run:ios --configuration Release

# Android
npx expo run:android --variant release
```

---

## Redux State Shape

### `player` slice
```javascript
{
  currentTrack: { id, name, type, path, folder } | null,
  isPlaying: false,
  playbackProgress: 0,       // seconds elapsed
  duration: 0,               // total duration in seconds
  volume: 1.0,               // 0.0 to 1.0
  shuffleMode: false,
  repeatMode: 'off'          // 'off' | 'track' | 'queue'
}
```

### `library` slice
```javascript
{
  rawMedia: [],
  folders: {
    "Downloads": [{ id, name, type, path }, ...],
    "Music": [...],
  },
  selectedFolder: null,
  queue: [],
  queueIndex: 0,
  isLoading: false,
  isScanned: false,
  error: null
}
```

### `theme` slice
```javascript
{
  mode: 'dark'               // 'dark' | 'light'
}
```

---

## Design System

### Dark Mode (Default)
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#121212` | Deep Obsidian base |
| Surface | `#1E1E1E` | Card backgrounds |
| Accent | `#1DB954` | Primary actions (Spotify Green) |
| Accent Secondary | `#00E5FF` | Cyan highlights |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#A7A7A7` | Metadata |

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F8F9FA` | Frost White base |
| Surface | `#FFFFFF` | Pure white cards |
| Accent | `#00A8CC` | Teal primary actions |
| Text Primary | `#111111` | Near-black |
| Text Secondary | `#6C757D` | Soft gray |

---

## Permissions

### iOS
```
NSPhotoLibraryUsageDescription: "We need access to your media library to display your local audio and video files."
```

### Android
```
READ_EXTERNAL_STORAGE     (Android 12 and below)
READ_MEDIA_AUDIO          (Android 13+)
READ_MEDIA_VIDEO          (Android 13+)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied on launch | Tap "Grant Access" to re-trigger the OS permission dialog |
| No media files found | Ensure device has audio/video files in accessible storage |
| Icons not showing | Run `npx expo install react-native-svg` |
| Metro bundler errors | Clear cache: `npx expo start --clear` |
| Pod install fails (iOS) | Run `npx pod-install` or `cd ios && pod install --repo-update` |

---

## Scripts

```bash
npm start          # Start Expo development server
npm run ios        # Start and open iOS Simulator
npm run android    # Start and open Android Emulator
npm run web        # Start and open web browser
```

---

## Author

Built by [hussain-labs](https://github.com/hussain-labs)

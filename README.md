# Media Player

A premium local media player app built with **Expo**, **React Native**, and **Redux Toolkit**.

Features a glassmorphism UI with ambient gradients, supporting both Light and Dark modes. Scans your device for audio and video files, organizes them into folders, and provides a beautiful playback experience.

---

## Tech Stack

- **Expo SDK 52** with Expo Router (file-based navigation)
- **Redux Toolkit** for state management
- **expo-media-library** for local file scanning
- **expo-av** for audio/video playback
- **expo-blur** + **expo-linear-gradient** for glassmorphic UI
- **lucide-react-native** for icons
- **@react-native-community/slider** for seek/volume controls
- **react-native-safe-area-context** for notch-safe layouts

---

## Project Structure

```
├── app/
│   ├── _layout.js         # Redux Provider & Theme wrapper
│   ├── index.js           # Folder Browser (main screen)
│   ├── folder/[id].js     # Folder detail with file list
│   └── player.js          # Full Now Playing screen
├── store/
│   ├── index.js           # Root Redux store
│   ├── playerSlice.js     # Playback state (track, progress, volume, modes)
│   ├── librarySlice.js    # Media library & folder tree state
│   └── themeSlice.js      # Dark/Light theme toggle
├── components/
│   ├── MiniPlayer.js      # Sticky floating mini-player
│   ├── FolderCard.js      # Folder grid card component
│   └── GlassButton.js     # Glassmorphic button component
├── services/
│   └── mediaScanner.js    # Device media scanning & folder parsing
├── constants/
│   └── theme.js           # Design system tokens
├── assets/                # App icons and splash images
├── app.json               # Expo configuration
├── babel.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## Features

- **Folder Browser** — Grid layout of media folders with file counts and type icons
- **File Scanner** — Async scanning of device media with folder parsing engine
- **Now Playing** — Immersive player with album art, seek bar, and glassmorphic controls
- **Video Player** — 16:9 video interface with overlay controls
- **Mini Player** — Sticky floating player with progress bar and quick controls
- **Theme Toggle** — Dark (Obsidian) and Light (Frost) modes
- **Queue System** — Up Next panel with track selection
- **Playback Modes** — Shuffle and Repeat (off/track/queue)

---

## Permissions

The app requires media library access to scan local files:

- **iOS**: `NSPhotoLibraryUsageDescription`
- **Android**: `READ_EXTERNAL_STORAGE`, `READ_MEDIA_AUDIO`, `READ_MEDIA_VIDEO`

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

## Screenshots & Screens

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
  rawMedia: [],              // flat array of all media assets
  folders: {                 // parsed folder tree
    "Downloads": [{ id, name, type, path }, ...],
    "Music": [...],
    "WhatsApp Audio": [...]
  },
  selectedFolder: null,
  queue: [],                 // current playback queue
  queueIndex: 0,
  isLoading: false,
  isScanned: false,
  permissionGranted: null,
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
| Surface | `#1E1E1E` | Card backgrounds, elevated surfaces |
| Accent | `#1DB954` | Primary actions, active states (Spotify Green) |
| Accent Secondary | `#00E5FF` | Cyan highlights, gradient endpoints |
| Text Primary | `#FFFFFF` | Headings, primary content |
| Text Secondary | `#A7A7A7` | Subtitles, metadata |

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F8F9FA` | Frost White base |
| Surface | `#FFFFFF` | Pure white cards |
| Accent | `#00A8CC` | Teal primary actions |
| Accent Secondary | `#0077B6` | Deeper blue highlights |
| Text Primary | `#111111` | Near-black for readability |
| Text Secondary | `#6C757D` | Soft gray metadata |

---

## Complete Setup Guide

### Prerequisites

Before you begin, ensure you have the following installed:

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

This installs all 17 production dependencies and 1 dev dependency listed in `package.json`.

---

### Step 3: Start the Development Server

```bash
# Start Expo development server
npx expo start
```

This will display a QR code in your terminal. You have several options:

| Key | Action |
|-----|--------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| `w` | Open in web browser |
| Scan QR | Open on physical device via Expo Go |

---

### Step 4: Run on a Specific Platform

#### iOS (macOS only)
```bash
# Run in iOS Simulator
npx expo start --ios

# Or build and run a development client
npx expo run:ios
```

#### Android
```bash
# Run in Android Emulator
npx expo start --android

# Or build and run a development client
npx expo run:android
```

#### Web (for quick preview)
```bash
npx expo start --web
```

---

### Step 5: Build for Production

#### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build profiles
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

#### Local Build (without EAS)

```bash
# iOS (requires macOS + Xcode)
npx expo run:ios --configuration Release

# Android
npx expo run:android --variant release
```

---

## Permissions Configuration

The app requires media library permissions to scan local files. These are pre-configured in `app.json`:

### iOS
The following key is set in `Info.plist` via `app.json`:
```
NSPhotoLibraryUsageDescription: "We need access to your media library to display your local audio and video files."
```

### Android
The following permissions are declared:
```
READ_EXTERNAL_STORAGE     (Android 12 and below)
READ_MEDIA_AUDIO          (Android 13+)
READ_MEDIA_VIDEO          (Android 13+)
```

The `expo-media-library` plugin handles runtime permission requests automatically.

---

## How It Works

### 1. Media Scanning (`services/mediaScanner.js`)
- On app launch, `fetchMediaLibrary()` async thunk is dispatched
- Requests media library permissions from the OS
- Paginates through all audio/video assets (up to 10,000 files)
- The **Folder Parser Engine** extracts parent folder names from file URIs
- Returns both a flat `rawMedia` array and a `folders` dictionary

### 2. Folder Parsing Algorithm
```
Input:  "file:///storage/emulated/0/Music/Neon Lights.mp3"
Output: Folder = "Music", File = { name: "Neon Lights.mp3", type: "audio" }
```
The parser handles `file://` URIs, `content://` URIs, URL-encoded paths, and gracefully falls back to "Unknown" when folder extraction fails.

### 3. Immediate UI Rendering
While the real media scan runs asynchronously, the app ships with **mock data** (6 folders, 20 files) so the UI renders instantly with beautiful content. Once the scan completes, Redux state updates and the UI reflects real device files.

### 4. Playback Flow
1. User taps a track in a folder
2. `setCurrentTrack` + `play()` + `setQueue()` are dispatched
3. MiniPlayer appears globally across all screens
4. Tapping MiniPlayer navigates to the full Now Playing screen
5. Skip/Previous updates the queue index and loads the next track

---

## Available Redux Actions

### Player Actions
| Action | Description |
|--------|-------------|
| `setCurrentTrack(track)` | Set active track (resets progress) |
| `togglePlayPause()` | Toggle play/pause state |
| `play()` / `pause()` | Explicit play or pause |
| `setPlaybackProgress(seconds)` | Update seek position |
| `setDuration(seconds)` | Set track total duration |
| `setVolume(0-1)` | Adjust volume level |
| `toggleShuffle()` | Toggle shuffle mode on/off |
| `cycleRepeatMode()` | Cycle: off -> track -> queue -> off |
| `resetPlayer()` | Clear all player state |

### Library Actions
| Action | Description |
|--------|-------------|
| `fetchMediaLibrary()` | Async thunk: scan device media |
| `setSelectedFolder(name)` | Set currently viewed folder |
| `setQueue({ tracks, startIndex })` | Load playback queue |
| `nextInQueue()` / `previousInQueue()` | Navigate queue |

### Theme Actions
| Action | Description |
|--------|-------------|
| `toggleTheme()` | Switch between dark and light |
| `setTheme('dark' \| 'light')` | Set specific theme mode |

---

## Customization

### Replacing Icons/Splash
Replace the placeholder files in `/assets/` with your own:
- `icon.png` — 1024x1024px, no transparency (App Store / Play Store icon)
- `adaptive-icon.png` — 1024x1024px (Android adaptive icon foreground layer)
- `splash.png` — 1284x2778px recommended (splash screen)

### Modifying Theme Colors
Edit `constants/theme.js` to customize the entire color palette. All components reference these tokens dynamically.

### Adding Real Playback
The app is structured for `expo-av` integration. To add actual audio playback:
1. Import `Audio` from `expo-av` in your player screen or a custom hook
2. Create an `Audio.Sound` instance when `currentTrack` changes
3. Sync playback status with Redux via `setPlaybackProgress` and `setDuration`
4. Handle `isPlaying` state changes to call `sound.playAsync()` / `sound.pauseAsync()`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Permission denied" on app launch** | The app gracefully shows a permission request screen. Tap "Grant Access" to re-trigger the OS permission dialog. |
| **No media files found** | Ensure your device has audio/video files in accessible storage. On Android 13+, ensure `READ_MEDIA_AUDIO`/`READ_MEDIA_VIDEO` are granted. |
| **Icons not showing** | Ensure `react-native-svg` is properly linked. Run `npx expo install react-native-svg` if needed. |
| **Blur not rendering (Android)** | `expo-blur` has limited support on some Android devices. The app falls back gracefully with solid semi-transparent backgrounds. |
| **Metro bundler errors** | Clear cache: `npx expo start --clear` |
| **Pod install fails (iOS)** | Run `npx pod-install` or `cd ios && pod install --repo-update` |

---

## Scripts Reference

```bash
npm start          # Start Expo development server
npm run ios        # Start and open iOS Simulator
npm run android    # Start and open Android Emulator
npm run web        # Start and open web browser
```

---

## Dependencies

### Production (17 packages)
| Package | Purpose |
|---------|---------|
| `expo` | Core Expo SDK |
| `expo-router` | File-based navigation |
| `expo-av` | Audio/Video playback |
| `expo-blur` | Glassmorphism blur effects |
| `expo-linear-gradient` | Gradient backgrounds |
| `expo-media-library` | Device media scanning |
| `expo-file-system` | File system access |
| `expo-status-bar` | Status bar styling |
| `@reduxjs/toolkit` | State management |
| `react-redux` | React bindings for Redux |
| `lucide-react-native` | Icon library |
| `react-native-svg` | SVG rendering (icons) |
| `@react-native-community/slider` | Seek/volume sliders |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-screens` | Native screen containers |
| `react-native-gesture-handler` | Touch gestures |
| `react-native-reanimated` | Animations |

### Development (1 package)
| Package | Purpose |
|---------|---------|
| `@babel/core` | JavaScript transpilation |

---

## License

This project is private and not published under any open-source license.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## Author

Built by [hussain-labs](https://github.com/hussain-labs)

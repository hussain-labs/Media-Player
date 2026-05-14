import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scanMediaLibrary } from '../services/mediaScanner';

// Async thunk to scan device media
export const fetchMediaLibrary = createAsyncThunk(
  'library/fetchMediaLibrary',
  async (_, { rejectWithValue }) => {
    try {
      const result = await scanMediaLibrary();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mock data for immediate beautiful rendering
const mockFolders = {
  Downloads: [
    { id: '1', name: 'Midnight Dreams.mp3', type: 'audio', path: '/storage/Downloads/Midnight Dreams.mp3' },
    { id: '2', name: 'Ocean Waves.mp3', type: 'audio', path: '/storage/Downloads/Ocean Waves.mp3' },
    { id: '3', name: 'Tutorial - React Native.mp4', type: 'video', path: '/storage/Downloads/Tutorial - React Native.mp4' },
    { id: '4', name: 'Sunset Vibes.mp3', type: 'audio', path: '/storage/Downloads/Sunset Vibes.mp3' },
  ],
  Music: [
    { id: '5', name: 'Neon Lights.mp3', type: 'audio', path: '/storage/Music/Neon Lights.mp3' },
    { id: '6', name: 'Electric Pulse.mp3', type: 'audio', path: '/storage/Music/Electric Pulse.mp3' },
    { id: '7', name: 'Starlight Serenade.mp3', type: 'audio', path: '/storage/Music/Starlight Serenade.mp3' },
    { id: '8', name: 'Deep Focus.mp3', type: 'audio', path: '/storage/Music/Deep Focus.mp3' },
    { id: '9', name: 'Cosmic Journey.mp3', type: 'audio', path: '/storage/Music/Cosmic Journey.mp3' },
  ],
  'WhatsApp Audio': [
    { id: '10', name: 'VoiceNote_001.mp3', type: 'audio', path: '/storage/WhatsApp/Media/Audio/VoiceNote_001.mp3' },
    { id: '11', name: 'VoiceNote_002.mp3', type: 'audio', path: '/storage/WhatsApp/Media/Audio/VoiceNote_002.mp3' },
    { id: '12', name: 'Recording_Meeting.mp3', type: 'audio', path: '/storage/WhatsApp/Media/Audio/Recording_Meeting.mp3' },
  ],
  Videos: [
    { id: '13', name: 'Holiday Memories.mp4', type: 'video', path: '/storage/Videos/Holiday Memories.mp4' },
    { id: '14', name: 'Concert Live.mp4', type: 'video', path: '/storage/Videos/Concert Live.mp4' },
    { id: '15', name: 'Nature Documentary.mp4', type: 'video', path: '/storage/Videos/Nature Documentary.mp4' },
  ],
  Podcasts: [
    { id: '16', name: 'Tech Talk Episode 42.mp3', type: 'audio', path: '/storage/Podcasts/Tech Talk Episode 42.mp3' },
    { id: '17', name: 'Morning Motivation.mp3', type: 'audio', path: '/storage/Podcasts/Morning Motivation.mp3' },
  ],
  Recordings: [
    { id: '18', name: 'Guitar Practice.mp3', type: 'audio', path: '/storage/Recordings/Guitar Practice.mp3' },
    { id: '19', name: 'Lecture Notes.mp3', type: 'audio', path: '/storage/Recordings/Lecture Notes.mp3' },
    { id: '20', name: 'Band Rehearsal.mp3', type: 'audio', path: '/storage/Recordings/Band Rehearsal.mp3' },
  ],
};

const initialState = {
  rawMedia: [],
  folders: mockFolders,
  selectedFolder: null,
  queue: [],
  queueIndex: 0,
  isLoading: false,
  isScanned: false,
  permissionGranted: null,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setSelectedFolder(state, action) {
      state.selectedFolder = action.payload;
    },
    setQueue(state, action) {
      state.queue = action.payload.tracks;
      state.queueIndex = action.payload.startIndex || 0;
    },
    nextInQueue(state) {
      if (state.queueIndex < state.queue.length - 1) {
        state.queueIndex += 1;
      }
    },
    previousInQueue(state) {
      if (state.queueIndex > 0) {
        state.queueIndex -= 1;
      }
    },
    setPermissionGranted(state, action) {
      state.permissionGranted = action.payload;
    },
    clearLibrary(state) {
      state.rawMedia = [];
      state.folders = mockFolders;
      state.isScanned = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaLibrary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMediaLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isScanned = true;
        state.rawMedia = action.payload.rawMedia;
        state.folders = action.payload.folders;
      })
      .addCase(fetchMediaLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedFolder,
  setQueue,
  nextInQueue,
  previousInQueue,
  setPermissionGranted,
  clearLibrary,
} = librarySlice.actions;

export default librarySlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null, // { id, name, type, path, folder }
  isPlaying: false,
  playbackProgress: 0, // seconds
  duration: 0, // seconds
  volume: 1.0, // 0.0 - 1.0
  shuffleMode: false,
  repeatMode: 'off', // 'off' | 'track' | 'queue'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack(state, action) {
      state.currentTrack = action.payload;
      state.playbackProgress = 0;
      state.duration = 0;
    },
    togglePlayPause(state) {
      state.isPlaying = !state.isPlaying;
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    setPlaybackProgress(state, action) {
      state.playbackProgress = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    setVolume(state, action) {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    toggleShuffle(state) {
      state.shuffleMode = !state.shuffleMode;
    },
    cycleRepeatMode(state) {
      const modes = ['off', 'track', 'queue'];
      const currentIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIndex + 1) % modes.length];
    },
    resetPlayer(state) {
      return initialState;
    },
  },
});

export const {
  setCurrentTrack,
  togglePlayPause,
  play,
  pause,
  setPlaybackProgress,
  setDuration,
  setVolume,
  toggleShuffle,
  cycleRepeatMode,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;

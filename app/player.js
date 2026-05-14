import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  ListMusic,
  Music,
  Video,
  ChevronDown,
  Heart,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  togglePlayPause,
  setPlaybackProgress,
  setVolume,
  toggleShuffle,
  cycleRepeatMode,
  setCurrentTrack,
  play,
} from '../store/playerSlice';
import { nextInQueue, previousInQueue } from '../store/librarySlice';
import GlassButton from '../components/GlassButton';
import {
  getTheme,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ART_SIZE = SCREEN_WIDTH * 0.75;

/**
 * Formats seconds to mm:ss display
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Full Now Playing Screen - Immersive audio/video player view.
 * Features ambient gradient backdrop, glassmorphic controls,
 * seekable progress bar, and queue panel toggle.
 */
export default function PlayerScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const mode = useSelector((state) => state.theme.mode);
  const {
    currentTrack,
    isPlaying,
    playbackProgress,
    duration,
    volume,
    shuffleMode,
    repeatMode,
  } = useSelector((state) => state.player);
  const { queue, queueIndex } = useSelector((state) => state.library);
  const theme = getTheme(mode);

  const [showQueue, setShowQueue] = useState(false);

  const isVideo = currentTrack?.type === 'video';
  const progress = duration > 0 ? playbackProgress / duration : 0;

  const handleBack = () => {
    router.back();
  };

  const handleSeek = useCallback(
    (value) => {
      dispatch(setPlaybackProgress(value * duration));
    },
    [dispatch, duration]
  );

  const handleVolumeChange = useCallback(
    (value) => {
      dispatch(setVolume(value));
    },
    [dispatch]
  );

  const handleSkipForward = () => {
    dispatch(nextInQueue());
    const nextTrack = queue[queueIndex + 1];
    if (nextTrack) {
      dispatch(setCurrentTrack({ ...nextTrack, folder: currentTrack?.folder }));
      dispatch(play());
    }
  };

  const handleSkipBack = () => {
    dispatch(previousInQueue());
    const prevTrack = queue[queueIndex - 1];
    if (prevTrack) {
      dispatch(setCurrentTrack({ ...prevTrack, folder: currentTrack?.folder }));
      dispatch(play());
    }
  };

  const handleQueueTrack = (track, index) => {
    dispatch(setCurrentTrack({ ...track, folder: currentTrack?.folder }));
    dispatch(play());
  };

  // Repeat mode icon
  const RepeatIcon = repeatMode === 'track' ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== 'off';

  if (!currentTrack) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.emptyPlayer}>
          <Music size={48} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No track selected
          </Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.emptyLink, { color: theme.accent }]}>
              Browse Library
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Ambient gradient background */}
      <LinearGradient
        colors={[
          theme.gradientStart + '40',
          theme.gradientEnd + '20',
          theme.background,
        ]}
        locations={[0, 0.4, 0.85]}
        style={styles.ambientGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronDown size={28} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {isVideo ? 'Now Watching' : 'Now Playing'}
          </Text>
          <TouchableOpacity
            onPress={() => setShowQueue(!showQueue)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ListMusic
              size={22}
              color={showQueue ? theme.accent : theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {showQueue ? (
          /* Queue Panel */
          <View style={styles.queueContainer}>
            <Text style={[styles.queueTitle, { color: theme.textPrimary }]}>
              Up Next
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.queueList}
            >
              {queue.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  onPress={() => handleQueueTrack(track, index)}
                  style={[
                    styles.queueItem,
                    {
                      backgroundColor:
                        currentTrack?.id === track.id
                          ? theme.accent + '15'
                          : 'transparent',
                      borderColor:
                        currentTrack?.id === track.id
                          ? theme.accent + '30'
                          : theme.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.queueItemIcon,
                      { backgroundColor: theme.accent + '12' },
                    ]}
                  >
                    {track.type === 'audio' ? (
                      <Music size={14} color={theme.accent} />
                    ) : (
                      <Video size={14} color={theme.accentSecondary} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.queueItemName,
                      {
                        color:
                          currentTrack?.id === track.id
                            ? theme.accent
                            : theme.textPrimary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {track.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {queue.length === 0 && (
                <Text style={[styles.queueEmpty, { color: theme.textMuted }]}>
                  No tracks in queue
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          /* Main Player View */
          <View style={styles.playerContent}>
            {/* Album Art / Video Placeholder */}
            <View style={styles.artSection}>
              {isVideo ? (
                /* Video Player Placeholder */
                <View
                  style={[
                    styles.videoContainer,
                    {
                      backgroundColor: '#000',
                      borderColor: theme.glassBorder,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[theme.gradientStart + '30', theme.gradientEnd + '30']}
                    style={styles.videoPlaceholder}
                  >
                    <Video size={56} color="#FFFFFF" strokeWidth={1.2} />
                    <Text style={styles.videoText}>{currentTrack.name}</Text>
                  </LinearGradient>
                  {/* Video overlay controls */}
                  <View style={styles.videoOverlay}>
                    <GlassButton
                      size={64}
                      onPress={() => dispatch(togglePlayPause())}
                    >
                      {isPlaying ? (
                        <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
                      ) : (
                        <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                      )}
                    </GlassButton>
                  </View>
                </View>
              ) : (
                /* Audio Album Art */
                <View style={styles.artWrapper}>
                  <View
                    style={[
                      styles.artShadow,
                      {
                        shadowColor: theme.gradientStart,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        theme.gradientStart + '60',
                        theme.gradientEnd + '40',
                        theme.surface,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.albumArt}
                    >
                      <Music size={64} color="#FFFFFF" strokeWidth={1.2} />
                    </LinearGradient>
                  </View>
                </View>
              )}
            </View>

            {/* Track Info */}
            <View style={styles.trackInfoSection}>
              <View style={styles.trackInfoRow}>
                <View style={styles.trackInfoText}>
                  <Text
                    style={[styles.trackTitle, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {currentTrack.name}
                  </Text>
                  <Text
                    style={[styles.trackArtist, { color: theme.textSecondary }]}
                  >
                    {currentTrack.folder || 'Unknown Folder'}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Heart size={22} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <Slider
                style={styles.slider}
                value={progress}
                onSlidingComplete={handleSeek}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={theme.accent}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.accent}
              />
              <View style={styles.timeRow}>
                <Text style={[styles.timeText, { color: theme.textMuted }]}>
                  {formatTime(playbackProgress)}
                </Text>
                <Text style={[styles.timeText, { color: theme.textMuted }]}>
                  {formatTime(duration || 215)}
                </Text>
              </View>
            </View>

            {/* Main Controls */}
            <View style={styles.controlsSection}>
              <GlassButton
                size={44}
                active={shuffleMode}
                onPress={() => dispatch(toggleShuffle())}
              >
                <Shuffle
                  size={18}
                  color={shuffleMode ? theme.accent : theme.textSecondary}
                />
              </GlassButton>

              <GlassButton size={50} onPress={handleSkipBack}>
                <SkipBack size={22} color={theme.textPrimary} fill={theme.textPrimary} />
              </GlassButton>

              {/* Main Play/Pause */}
              <TouchableOpacity
                onPress={() => dispatch(togglePlayPause())}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[theme.gradientStart, theme.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mainPlayButton}
                >
                  {isPlaying ? (
                    <Pause size={30} color="#FFFFFF" fill="#FFFFFF" />
                  ) : (
                    <Play size={30} color="#FFFFFF" fill="#FFFFFF" />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <GlassButton size={50} onPress={handleSkipForward}>
                <SkipForward size={22} color={theme.textPrimary} fill={theme.textPrimary} />
              </GlassButton>

              <GlassButton
                size={44}
                active={repeatActive}
                onPress={() => dispatch(cycleRepeatMode())}
              >
                <RepeatIcon
                  size={18}
                  color={repeatActive ? theme.accent : theme.textSecondary}
                />
              </GlassButton>
            </View>

            {/* Volume Control */}
            <View style={styles.volumeSection}>
              <Volume2 size={16} color={theme.textMuted} />
              <Slider
                style={styles.volumeSlider}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={theme.textSecondary}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.textSecondary}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  ambientGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.65,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  playerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  artSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.42,
  },
  artWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artShadow: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  albumArt: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: RADIUS.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 16 / 9,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  videoText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    opacity: 0.8,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfoSection: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  trackInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackInfoText: {
    flex: 1,
    marginRight: SPACING.md,
  },
  trackTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
  },
  progressSection: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  timeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  mainPlayButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  volumeSlider: {
    flex: 1,
    height: 28,
  },
  // Queue panel styles
  queueContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  queueTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.lg,
  },
  queueList: {
    paddingBottom: SPACING.xxxl,
    gap: SPACING.sm,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  queueItemIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueItemName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  queueEmpty: {
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xxxl,
  },
  // Empty state
  emptyPlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
});

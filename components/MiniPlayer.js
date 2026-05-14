import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, SkipForward, X, Music } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { togglePlayPause, resetPlayer } from '../store/playerSlice';
import { nextInQueue } from '../store/librarySlice';
import { getTheme, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * MiniPlayer - Sticky floating component pinned above bottom navigation.
 * Appears when a track is loaded. Shows current track info with playback controls.
 * Supports tap to expand (navigates to full player) and dismiss.
 */
export default function MiniPlayer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const mode = useSelector((state) => state.theme.mode);
  const { currentTrack, isPlaying, playbackProgress, duration } = useSelector(
    (state) => state.player
  );
  const theme = getTheme(mode);

  // Don't render if no track is active
  if (!currentTrack) return null;

  const progress = duration > 0 ? playbackProgress / duration : 0;

  const handlePress = () => {
    router.push('/player');
  };

  const handlePlayPause = () => {
    dispatch(togglePlayPause());
  };

  const handleSkip = () => {
    dispatch(nextInQueue());
  };

  const handleDismiss = () => {
    dispatch(resetPlayer());
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
        style={styles.touchArea}
      >
        <BlurView
          intensity={mode === 'dark' ? 80 : 90}
          tint={mode === 'dark' ? 'dark' : 'light'}
          style={styles.blurView}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.miniPlayerBg,
                borderColor: theme.glassBorder,
              },
            ]}
          >
            {/* Progress bar at top */}
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <LinearGradient
                colors={[theme.gradientStart, theme.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>

            <View style={styles.content}>
              {/* Album art placeholder */}
              <View style={[styles.artContainer, { backgroundColor: theme.accent + '20' }]}>
                <Music size={18} color={theme.accent} strokeWidth={2} />
              </View>

              {/* Track info */}
              <View style={styles.trackInfo}>
                <Text
                  style={[styles.trackName, { color: theme.textPrimary }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentTrack.name}
                </Text>
                <Text
                  style={[styles.trackMeta, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {currentTrack.folder || currentTrack.type}
                </Text>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.controlBtn}
                >
                  {isPlaying ? (
                    <Pause size={22} color={theme.textPrimary} fill={theme.textPrimary} />
                  ) : (
                    <Play size={22} color={theme.textPrimary} fill={theme.textPrimary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSkip}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.controlBtn}
                >
                  <SkipForward size={20} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDismiss}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.controlBtn}
                >
                  <X size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  touchArea: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  blurView: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  container: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressTrack: {
    height: 2.5,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  artContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trackName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: 2,
  },
  trackMeta: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  controlBtn: {
    padding: 4,
  },
});

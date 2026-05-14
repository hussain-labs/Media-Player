import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Folder, Music, Video, FileAudio } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { getTheme, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = SPACING.md;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.xl * 2 - CARD_GAP) / 2;

/**
 * FolderCard - Adaptive directory card for the folder browser grid.
 * Displays folder name, file count, media type icons, and a gradient accent strip.
 *
 * @param {string} name - Folder display name
 * @param {number} fileCount - Number of files in the folder
 * @param {number} audioCount - Number of audio files
 * @param {number} videoCount - Number of video files
 * @param {Function} onPress - Press handler for navigation
 */
export default function FolderCard({
  name,
  fileCount = 0,
  audioCount = 0,
  videoCount = 0,
  onPress,
}) {
  const mode = useSelector((state) => state.theme.mode);
  const theme = getTheme(mode);

  const hasVideo = videoCount > 0;
  const hasAudio = audioCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, { width: CARD_WIDTH }]}
    >
      <BlurView
        intensity={mode === 'dark' ? 25 : 40}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          {/* Gradient accent strip at top */}
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.accentStrip}
          />

          {/* Folder Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.accent + '15' }]}>
            <Folder
              size={28}
              color={theme.accent}
              strokeWidth={1.8}
            />
          </View>

          {/* Folder Name */}
          <Text
            style={[styles.folderName, { color: theme.textPrimary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {name}
          </Text>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <Text style={[styles.fileCount, { color: theme.textSecondary }]}>
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
            </Text>
            <View style={styles.typeIcons}>
              {hasAudio && (
                <FileAudio size={12} color={theme.textMuted} strokeWidth={2} />
              )}
              {hasVideo && (
                <Video size={12} color={theme.textMuted} strokeWidth={2} />
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: CARD_GAP,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  blurContainer: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    minHeight: CARD_WIDTH * 0.85,
    justifyContent: 'space-between',
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  folderName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileCount: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  typeIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
});

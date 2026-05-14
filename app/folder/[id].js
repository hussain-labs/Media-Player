import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Music,
  Video,
  Play,
  Folder,
  ListMusic,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { setCurrentTrack, play } from '../../store/playerSlice';
import { setQueue } from '../../store/librarySlice';
import {
  getTheme,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Folder Detail Screen - Displays files within a selected folder.
 * Shows a list of audio/video files with play functionality.
 * Features breadcrumb navigation and "Play All" action.
 */
export default function FolderDetailScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const folderName = decodeURIComponent(id);

  const mode = useSelector((state) => state.theme.mode);
  const folders = useSelector((state) => state.library.folders);
  const currentTrack = useSelector((state) => state.player.currentTrack);
  const theme = getTheme(mode);

  const files = useMemo(() => folders[folderName] || [], [folders, folderName]);

  const audioFiles = useMemo(
    () => files.filter((f) => f.type === 'audio'),
    [files]
  );
  const videoFiles = useMemo(
    () => files.filter((f) => f.type === 'video'),
    [files]
  );

  const handleBack = () => {
    router.back();
  };

  const handlePlayTrack = (track, index) => {
    dispatch(setCurrentTrack({ ...track, folder: folderName }));
    dispatch(play());
    dispatch(setQueue({ tracks: files, startIndex: index }));
  };

  const handlePlayAll = () => {
    if (files.length > 0) {
      handlePlayTrack(files[0], 0);
    }
  };

  const renderFileItem = ({ item, index }) => {
    const isActive = currentTrack?.id === item.id;
    const isAudio = item.type === 'audio';

    return (
      <TouchableOpacity
        onPress={() => handlePlayTrack(item, index)}
        activeOpacity={0.7}
        style={[
          styles.fileItem,
          {
            backgroundColor: isActive
              ? theme.accent + '12'
              : theme.surface,
            borderColor: isActive ? theme.accent + '30' : theme.border,
          },
        ]}
      >
        {/* File type icon */}
        <View
          style={[
            styles.fileIcon,
            {
              backgroundColor: isActive
                ? theme.accent + '20'
                : isAudio
                ? theme.gradientStart + '12'
                : theme.gradientEnd + '12',
            },
          ]}
        >
          {isAudio ? (
            <Music
              size={18}
              color={isActive ? theme.accent : theme.gradientStart}
              strokeWidth={2}
            />
          ) : (
            <Video
              size={18}
              color={isActive ? theme.accent : theme.gradientEnd}
              strokeWidth={2}
            />
          )}
        </View>

        {/* File info */}
        <View style={styles.fileInfo}>
          <Text
            style={[
              styles.fileName,
              {
                color: isActive ? theme.accent : theme.textPrimary,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text style={[styles.fileType, { color: theme.textSecondary }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>

        {/* Play indicator */}
        {isActive ? (
          <View style={[styles.activeIndicator, { backgroundColor: theme.accent }]}>
            <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        ) : (
          <Play size={16} color={theme.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Folder Stats */}
      <View style={[styles.statsRow, { borderBottomColor: theme.border }]}>
        <View style={styles.statItem}>
          <Music size={14} color={theme.accent} />
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            {audioFiles.length} audio
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Video size={14} color={theme.accentSecondary} />
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            {videoFiles.length} video
          </Text>
        </View>
      </View>

      {/* Play All Button */}
      {files.length > 0 && (
        <TouchableOpacity onPress={handlePlayAll} activeOpacity={0.8}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.playAllButton}
          >
            <ListMusic size={18} color="#FFFFFF" />
            <Text style={styles.playAllText}>Play All</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      {/* Header gradient glow */}
      <LinearGradient
        colors={[theme.gradientEnd + '15', 'transparent']}
        style={styles.headerGlow}
      />

      {/* Header with breadcrumb */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.breadcrumb}>
          <Folder size={14} color={theme.textMuted} />
          <Text style={[styles.breadcrumbText, { color: theme.textMuted }]}>
            Library
          </Text>
          <Text style={[styles.breadcrumbSep, { color: theme.textMuted }]}>/</Text>
          <Text
            style={[styles.breadcrumbActive, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {folderName}
          </Text>
        </View>
      </View>

      {/* Folder title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {folderName}
        </Text>
      </View>

      {/* File List */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={renderFileItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          currentTrack && { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height * 0.12,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
    zIndex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  breadcrumbText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  breadcrumbSep: {
    fontSize: FONT_SIZE.xs,
  },
  breadcrumbActive: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    flexShrink: 1,
  },
  titleContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  listHeader: {
    marginBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    gap: SPACING.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(128,128,128,0.3)',
  },
  statText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  playAllText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.md,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 3,
  },
  fileType: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
  },
  activeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

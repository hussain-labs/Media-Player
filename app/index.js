import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Library,
  Sun,
  Moon,
  FolderSearch,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { toggleTheme } from '../store/themeSlice';
import { fetchMediaLibrary, setSelectedFolder } from '../store/librarySlice';
import FolderCard from '../components/FolderCard';
import {
  getTheme,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Folder Browser Screen - Main entry point of the app.
 * Displays a grid of folder cards parsed from local media.
 * Includes theme toggle, permission handling, and empty states.
 */
export default function FolderBrowserScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const mode = useSelector((state) => state.theme.mode);
  const { folders, isLoading, permissionGranted, error } = useSelector(
    (state) => state.library
  );
  const currentTrack = useSelector((state) => state.player.currentTrack);
  const theme = getTheme(mode);

  // Attempt to scan on mount
  useEffect(() => {
    dispatch(fetchMediaLibrary());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchMediaLibrary());
  }, [dispatch]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleFolderPress = (folderName) => {
    dispatch(setSelectedFolder(folderName));
    router.push(`/folder/${encodeURIComponent(folderName)}`);
  };

  const folderNames = Object.keys(folders);

  // Calculate folder stats
  const getFolderStats = (files) => {
    const audioCount = files.filter((f) => f.type === 'audio').length;
    const videoCount = files.filter((f) => f.type === 'video').length;
    return { fileCount: files.length, audioCount, videoCount };
  };

  // Permission denied empty state
  const renderPermissionState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.accent + '15' }]}>
        <ShieldAlert size={48} color={theme.accent} strokeWidth={1.5} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        Permission Required
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Grant media library access to scan your local audio and video files.
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.accent }]}
        onPress={handleRefresh}
      >
        <Text style={styles.retryButtonText}>Grant Access</Text>
      </TouchableOpacity>
    </View>
  );

  // No files empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.accent + '15' }]}>
        <FolderSearch size={48} color={theme.accent} strokeWidth={1.5} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        No Media Found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        No audio or video files were found on your device. Download some media to get started.
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.accent }]}
        onPress={handleRefresh}
      >
        <RefreshCw size={16} color="#FFFFFF" />
        <Text style={styles.retryButtonText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header gradient glow */}
      <LinearGradient
        colors={[theme.gradientStart + '20', 'transparent']}
        style={styles.headerGlow}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Library size={26} color={theme.accent} strokeWidth={2} />
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Media Player
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleThemeToggle}
          style={[styles.themeToggle, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {mode === 'dark' ? (
            <Sun size={18} color={theme.accent} />
          ) : (
            <Moon size={18} color={theme.accent} />
          )}
        </TouchableOpacity>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Your Library
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          {folderNames.length} {folderNames.length === 1 ? 'folder' : 'folders'} found
        </Text>
      </View>

      {/* Content */}
      {isLoading && folderNames.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Scanning media library...
          </Text>
        </View>
      ) : error === 'PERMISSION_DENIED' ? (
        renderPermissionState()
      ) : folderNames.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.gridContainer,
            currentTrack && { paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
        >
          <View style={styles.grid}>
            {folderNames.map((folderName) => {
              const stats = getFolderStats(folders[folderName]);
              return (
                <FolderCard
                  key={folderName}
                  name={folderName}
                  fileCount={stats.fileCount}
                  audioCount={stats.audioCount}
                  videoCount={stats.videoCount}
                  onPress={() => handleFolderPress(folderName)}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
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
    height: Dimensions.get('window').height * 0.15,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
  },
  gridContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
    gap: SPACING.lg,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
});

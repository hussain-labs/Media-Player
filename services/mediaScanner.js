import * as MediaLibrary from 'expo-media-library';

/**
 * Media Scanner Service
 * Scans device local storage for audio and video files using expo-media-library.
 * Parses file paths into a folder-tree hierarchy for the Redux store.
 */

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg', '.wma'];
const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.3gp'];

/**
 * Determines if a filename is audio or video based on extension.
 */
function getMediaType(filename) {
  const lower = filename.toLowerCase();
  if (AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'audio';
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return 'video';
  return null;
}

/**
 * Extracts the parent folder name from a file URI or path.
 * Handles both content:// URIs and file:// paths.
 *
 * Examples:
 *   "/storage/emulated/0/Music/song.mp3" -> "Music"
 *   "file:///storage/emulated/0/Download/video.mp4" -> "Download"
 *   If no folder can be extracted, returns "Unknown"
 */
function extractFolderName(uri, filename) {
  try {
    // Decode URI components
    const decoded = decodeURIComponent(uri);

    // Remove file:// prefix if present
    const cleanPath = decoded.replace(/^file:\/\//, '');

    // Split by path separator
    const segments = cleanPath.split('/').filter(Boolean);

    // Find the segment before the filename
    const fileIndex = segments.findIndex(
      (seg) => seg === filename || seg.includes(filename)
    );

    if (fileIndex > 0) {
      return segments[fileIndex - 1];
    }

    // Fallback: take the second-to-last segment
    if (segments.length >= 2) {
      return segments[segments.length - 2];
    }

    return 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * Parses a flat list of media assets into a folder-keyed dictionary.
 *
 * @param {Array} assets - Raw assets from expo-media-library
 * @returns {Object} folders - { folderName: [{ id, name, type, path }] }
 */
export function parseFoldersFromAssets(assets) {
  const folders = {};

  assets.forEach((asset) => {
    const { id, filename, uri, mediaType } = asset;

    // Determine type from mediaType or filename extension
    let type;
    if (mediaType === MediaLibrary.MediaType.audio || mediaType === 'audio') {
      type = 'audio';
    } else if (mediaType === MediaLibrary.MediaType.video || mediaType === 'video') {
      type = 'video';
    } else {
      type = getMediaType(filename) || 'audio';
    }

    const folderName = extractFolderName(uri, filename);

    if (!folders[folderName]) {
      folders[folderName] = [];
    }

    folders[folderName].push({
      id: id || String(Math.random()),
      name: filename,
      type,
      path: uri,
    });
  });

  // Sort files within each folder alphabetically
  Object.keys(folders).forEach((key) => {
    folders[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  return folders;
}

/**
 * Requests permissions and scans the device media library.
 * Returns both raw media and parsed folder structure.
 *
 * @returns {Promise<{ rawMedia: Array, folders: Object }>}
 */
export async function scanMediaLibrary() {
  // Request permissions
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  const allAssets = [];
  let hasNextPage = true;
  let endCursor = undefined;

  // Paginate through all media assets (audio + video)
  while (hasNextPage) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: [MediaLibrary.MediaType.audio, MediaLibrary.MediaType.video],
      first: 500,
      after: endCursor,
      sortBy: [MediaLibrary.SortBy.default],
    });

    allAssets.push(...page.assets);
    hasNextPage = page.hasNextPage;
    endCursor = page.endCursor;

    // Safety limit: cap at 10,000 assets to prevent memory issues
    if (allAssets.length >= 10000) break;
  }

  // Parse into folder structure
  const folders = parseFoldersFromAssets(allAssets);

  return {
    rawMedia: allAssets.map((asset) => ({
      id: asset.id,
      name: asset.filename,
      type: asset.mediaType === MediaLibrary.MediaType.audio ? 'audio' : 'video',
      path: asset.uri,
      duration: asset.duration,
      width: asset.width,
      height: asset.height,
      creationTime: asset.creationTime,
      modificationTime: asset.modificationTime,
    })),
    folders,
  };
}

/**
 * Checks current permission status without requesting.
 * @returns {Promise<boolean>}
 */
export async function checkMediaPermission() {
  const { status } = await MediaLibrary.getPermissionsAsync();
  return status === 'granted';
}

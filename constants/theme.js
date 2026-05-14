/**
 * Global Design System Theme Tokens
 * Supports Dark (default) and Light modes with glassmorphism aesthetics.
 */

export const THEME = {
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceElevated: '#2A2A2A',
    accent: '#1DB954',
    accentSecondary: '#00E5FF',
    textPrimary: '#FFFFFF',
    textSecondary: '#A7A7A7',
    textMuted: '#6B6B6B',
    border: 'rgba(255, 255, 255, 0.08)',
    cardBackground: 'rgba(30, 30, 30, 0.85)',
    glassBackground: 'rgba(30, 30, 30, 0.6)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: '#000000',
    gradientStart: '#1DB954',
    gradientEnd: '#00E5FF',
    miniPlayerBg: 'rgba(30, 30, 30, 0.95)',
    tabBar: '#1A1A1A',
    statusBar: 'light',
  },
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    accent: '#00A8CC',
    accentSecondary: '#0077B6',
    textPrimary: '#111111',
    textSecondary: '#6C757D',
    textMuted: '#ADB5BD',
    border: 'rgba(0, 0, 0, 0.06)',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    glassBackground: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    gradientStart: '#00A8CC',
    gradientEnd: '#0077B6',
    miniPlayerBg: 'rgba(255, 255, 255, 0.97)',
    tabBar: '#FFFFFF',
    statusBar: 'dark',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

/**
 * Returns the active theme tokens based on mode.
 * @param {'dark' | 'light'} mode
 */
export function getTheme(mode) {
  return THEME[mode] || THEME.dark;
}

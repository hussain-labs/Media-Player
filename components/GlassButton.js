import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { getTheme, RADIUS } from '../constants/theme';

/**
 * GlassButton - A glassmorphic touch button with blur backdrop.
 * Used for playback controls and action buttons throughout the app.
 *
 * @param {React.ReactNode} children - Icon or content inside the button
 * @param {Function} onPress - Press handler
 * @param {number} size - Button diameter (default: 52)
 * @param {boolean} active - Whether button shows active/accent state
 * @param {object} style - Additional style overrides
 * @param {boolean} circular - Whether button is circular (default: true)
 * @param {string} intensity - Blur intensity ('light' | 'dark' | number)
 */
export default function GlassButton({
  children,
  onPress,
  size = 52,
  active = false,
  style,
  circular = true,
  disabled = false,
}) {
  const mode = useSelector((state) => state.theme.mode);
  const theme = getTheme(mode);

  const buttonSize = {
    width: size,
    height: size,
    borderRadius: circular ? size / 2 : RADIUS.lg,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.wrapper, buttonSize, style]}
    >
      <BlurView
        intensity={mode === 'dark' ? 40 : 60}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[styles.blur, buttonSize]}
      >
        <View
          style={[
            styles.inner,
            buttonSize,
            {
              backgroundColor: active
                ? theme.accent + '30'
                : theme.glassBackground,
              borderColor: active ? theme.accent + '60' : theme.glassBorder,
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  blur: {
    overflow: 'hidden',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

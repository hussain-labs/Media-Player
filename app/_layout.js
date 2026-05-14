import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import store from '../store';
import MiniPlayer from '../components/MiniPlayer';
import { getTheme } from '../constants/theme';

/**
 * Inner layout that has access to Redux state for theming.
 */
function InnerLayout() {
  const mode = useSelector((state) => state.theme.mode);
  const theme = getTheme(mode);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      />
      {/* Sticky Mini-Player - component handles its own visibility */}
      <MiniPlayer />
    </View>
  );
}

/**
 * Root Layout - Redux Provider & SafeArea wrapper.
 * Wraps the entire app with state management and safe-area handling.
 */
export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <InnerLayout />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

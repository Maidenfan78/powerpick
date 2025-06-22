/* ---------- Header.tsx ---------- */
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Platform } from 'react-native';
import tokens from '../app/tokens.json';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Powerpick</Text>
    </View>
  );
}

const TOP_BAR_HEIGHT = Platform.select({ ios: 56, default: 56 });

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.color.brand.primary.value,
    height: TOP_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: tokens.typography.fontFamilies.base.value,
    fontSize: tokens.typography.fontSizes.lg.value,
    color: tokens.color.neutral['0'].value,
    fontWeight: '700',
  },
});

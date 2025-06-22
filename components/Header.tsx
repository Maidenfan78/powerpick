import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useTheme } from '../lib/theme';
import { useRouter } from 'expo-router';

export default function Header() {
  const { tokens } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: tokens.color.brand.primary.value,
      height: TOP_BAR_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    title: {
      fontFamily: tokens.typography.fontFamilies.base.value,
      fontSize: tokens.typography.fontSizes.lg.value,
      color: tokens.color.neutral['0'].value,
      fontWeight: '700',
    },
    icon: {
      color: tokens.color.neutral['0'].value,
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Powerpick</Text>
      <Pressable onPress={() => router.push('/settings')}>
        <Text style={styles.icon}>☰</Text>
      </Pressable>
    </View>
  );
}

const TOP_BAR_HEIGHT = Platform.select({ ios: 56, default: 56 });

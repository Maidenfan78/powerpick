import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../lib/theme';
import { useRouter } from 'expo-router';
import { Text } from 'react-native'; // 
import PowerpickLogo from '../assets/logo.svg';

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
      paddingHorizontal: 5,
    },
    logo: {
      width: 500,
      height: 80,
    },
    icon: {
      color: tokens.color.neutral['0'].value,
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <PowerpickLogo width={170} height={64} accessibilityLabel="Powerpick logo" />
      <Pressable onPress={() => router.push('/settings')}>
        <Text style={styles.icon}>☰</Text>
      </Pressable> 
    </View>
  );
}

const TOP_BAR_HEIGHT = Platform.select({ ios: 56, default: 56 });

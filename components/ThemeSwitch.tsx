import { Switch, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme';

export default function ThemeSwitch() {
  const { scheme, toggleScheme, tokens } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: tokens.color.brand.primary.value }]}>Dark mode</Text>
      <Switch
        value={scheme === 'dark'}
        onValueChange={toggleScheme}
        thumbColor={tokens.color.brand.accent.value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  label: { fontSize: 16 },
});

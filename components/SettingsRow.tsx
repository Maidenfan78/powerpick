// components/SettingsRow.tsx
import { Switch, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme';

export default function CvdSwitch() {
  const { isCvd, toggleCvd, tokens } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: tokens.color.brand.primary.value }]}>
        Colour-blind friendly palette
      </Text>
      <Switch
        value={isCvd}
        onValueChange={toggleCvd}
        thumbColor={tokens.color.brand.accent.value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  label: { fontSize: 16 },
});

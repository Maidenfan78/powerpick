// app/settings.tsx
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";
import { useTheme } from "../lib/theme";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { tokens, scheme, toggleScheme, isCvd, toggleCvd } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: tokens.color.neutral["0"].value },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: tokens.color.brand.primary.value },
        ]}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.dismiss}>✕</Text>
        </Pressable>
      </View>

      {/* --- Display Settings Group --- */}
      <Text style={styles.groupTitle}>▸ Display Settings</Text>
      <View style={styles.card}>
        <Row
          label="Dark Mode"
          value={scheme === "dark"}
          onToggle={toggleScheme}
        />
        <Separator />
        <Row label="Colour-Blind Mode" value={isCvd} onToggle={toggleCvd} />
      </View>

      {/* --- Notifications Group (Placeholder) --- */}
      <Text style={styles.groupTitle}>▸ Notifications</Text>
      <View style={styles.card}>
        <Row
          label="New Draw Alerts"
          value={false}
          onToggle={() => {}}
          disabled
        />
      </View>

      {/* --- App Info Group --- */}
      <Text style={styles.groupTitle}>▸ App Info</Text>
      <View style={styles.card}>
        <Text style={styles.infoText}>Version: 1.0.0</Text>
        <Separator />
        <Pressable>
          <Text style={styles.linkText}>Contact Support</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Reusable toggle row
function Row({
  label,
  value,
  onToggle,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { tokens } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: tokens.color.brand.primary.value }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        thumbColor={tokens.color.brand.accent.value}
        disabled={disabled}
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 1,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
  },
  container: { flex: 1 },
  dismiss: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  groupTitle: {
    color: "#6A6A6A",
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  infoText: {
    color: "#4C4C4C",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  linkText: {
    color: "#0C244B",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textDecorationLine: "underline",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    backgroundColor: "#E0E0E0",
    height: 1,
    marginHorizontal: 16,
  },
});

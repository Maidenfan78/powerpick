/* ---------- RegionPicker.tsx ---------- */
import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";

import { useTheme } from "../lib/theme";
import { useRegionStore, Region } from "../stores/useRegionStore";

const BACKDROP_COLOR = "rgba(0,0,0,0.4)";

const REGION_OPTIONS: Region[] = ["AU", "US", "EU"];

export default function RegionPicker() {
  const { tokens } = useTheme();
  const region = useRegionStore((s) => s.region);
  const setRegion = useRegionStore((s) => s.setRegion);
  const [visible, setVisible] = useState(false);

  const labelFor = (r: Region) =>
    ({ AU: "Australia", US: "USA", EU: "Europe" })[r];

  const styles = StyleSheet.create({
    backdrop: {
      alignItems: "center",
      backgroundColor: BACKDROP_COLOR,
      flex: 1,
      justifyContent: "center",
    },
    button: {
      alignItems: "center",
      backgroundColor: tokens.color.neutral["0"].value,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    buttonText: {
      color: tokens.color.brand.primary.value,
      fontSize: 16,
      fontWeight: "500",
    },
    checkIcon: {
      color: tokens.color.brand.accent.value,
      fontSize: 18,
      marginLeft: 8,
    },
    icon: {
      color: tokens.color.brand.accent.value,
      fontSize: 20,
      marginLeft: 8,
    },
    modal: {
      backgroundColor: tokens.color.neutral["0"].value,
      borderRadius: 12,
      minWidth: "60%",
      padding: 16,
    },
    optionText: {
      color: tokens.color.brand.primary.value,
      fontSize: 16,
    },
    row: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
  });

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{labelFor(region)}</Text>
        {/* down-pointing triangle as ChevronDown */}
        <Text style={styles.icon}>▼</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.modal} pointerEvents="box-none">
            {REGION_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                style={styles.row}
                onPress={(e) => {
                  e.stopPropagation();
                  setRegion(opt);
                  setVisible(false);
                }}
              >
                <Text style={styles.optionText}>{labelFor(opt)}</Text>
                {/* check mark if selected */}
                {opt === region && <Text style={styles.checkIcon}>✔</Text>}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

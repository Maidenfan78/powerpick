/* ---------- RegionPicker.tsx ---------- */
import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import tokens from '../app/tokens.json';
import { useRegionStore, Region } from '../stores/useRegionStore';


const REGION_OPTIONS: Region[] = ['AU', 'US', 'EU'];

export default function RegionPicker() {
  const region = useRegionStore(s => s.region);
  const setRegion = useRegionStore(s => s.setRegion);
  const [visible, setVisible] = useState(false);

  const labelFor = (r: Region) => ({ AU: 'Australia', US: 'USA', EU: 'Europe' }[r]);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{labelFor(region)}</Text>
        <ChevronDown size={20} color={tokens.color.brand.accent.value} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.modal} pointerEvents="box-none">
            {REGION_OPTIONS.map(opt => (
              <Pressable key={opt} style={styles.row} onPress={() => { setRegion(opt); setVisible(false); }}>
                <Text style={styles.optionText}>{labelFor(opt)}</Text>
                {opt === region && <Check size={18} color={tokens.color.brand.accent.value} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.color.neutral['0'].value,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: tokens.color.brand.primary.value,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minWidth: '60%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: tokens.color.brand.primary.value,
  },
});


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModePillSelector({ value, onChange }: { value: string; onChange: (m: string) => void }) {
  const modes = [
    { key: 'TIME', label: 'Time Lock' },
    { key: 'HOURLY', label: 'Hourly' },
    { key: 'EXTREME', label: 'Extreme' }
  ];
  return (
    <View style={styles.row}>
      {modes.map((m) => (
        <TouchableOpacity key={m.key} onPress={() => onChange(m.key)} style={[styles.pill, value === m.key && styles.active]}>
          <Text style={[styles.text, value === m.key && styles.activeText]}>{m.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  pill: { padding: 10, borderRadius: 16, backgroundColor: '#eee', margin: 6, minWidth: 90, alignItems: 'center' },
  active: { backgroundColor: '#6C5CE7' },
  text: { color: '#111' },
  activeText: { color: '#fff', fontWeight: '700' }
});

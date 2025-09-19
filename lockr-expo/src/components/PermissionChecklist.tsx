import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PermissionChecklist({ items = [], onOpenSettings }: { items: Array<{ key: string; label: string; granted: boolean }>; onOpenSettings: (k: string) => void }) {
  return (
    <View style={styles.container}>
      {items.map((it) => (
        <View key={it.key} style={styles.row}>
          <Text style={styles.label}>{it.label}</Text>
          <TouchableOpacity onPress={() => onOpenSettings(it.key)} style={[styles.btn, it.granted && styles.granted]}>
            <Text style={styles.btnText}>{it.granted ? 'Granted' : 'Enable'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
  label: { fontSize: 16 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#eee' },
  granted: { backgroundColor: '#D1FAE5' },
  btnText: { fontWeight: '600' }
});

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppRow({ app, onToggle }: { app: { id: string; name: string; icon?: string; allowed?: boolean }; onToggle: (id: string) => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onToggle(app.id)}>
      <View style={styles.left}>
        {app.icon ? <Image source={{ uri: app.icon }} style={styles.icon} /> : <View style={styles.iconPlaceholder} />}
        <Text style={styles.name}>{app.name}</Text>
      </View>
      <View style={[styles.badge, app.allowed ? styles.allowed : styles.blocked]}>
        <Text style={styles.badgeText}>{app.allowed ? 'Allow' : 'Guard'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  iconPlaceholder: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#eee', marginRight: 12 },
  name: { fontSize: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontWeight: '700' },
  allowed: { backgroundColor: '#D1FAE5' },
  blocked: { backgroundColor: '#FFE4E6' }
});

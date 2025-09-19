import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OverlayBlocker({ remainingSec = 0, onRemind, onAddTime, onClose }: { remainingSec?: number; onRemind: () => void; onAddTime: () => void; onClose: () => void }) {
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blocked</Text>
      <Text style={styles.count}>{`${mins}:${secs.toString().padStart(2, '0')}`}</Text>
      <TouchableOpacity onPress={onRemind} style={styles.btn}>
        <Text style={styles.btnText}>Remind me in 5 min</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddTime} style={styles.btnOutline}>
        <Text style={styles.btnText}>Add 10 min</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} style={styles.link}>
        <Text style={styles.linkText}>Close app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 34, fontWeight: '700' },
  count: { fontSize: 42, fontWeight: '800', marginVertical: 12 },
  btn: { backgroundColor: '#6C5CE7', padding: 12, borderRadius: 12, marginTop: 12, width: '80%', alignItems: 'center' },
  btnOutline: { borderWidth: 1, borderColor: '#6C5CE7', padding: 12, borderRadius: 12, marginTop: 12, width: '80%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  link: { marginTop: 20 },
  linkText: { color: '#6C5CE7' }
});

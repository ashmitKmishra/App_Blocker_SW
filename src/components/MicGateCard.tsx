import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MicGateCard({ listening, onPress, transcript, status }: { listening: boolean; onPress: () => void; transcript?: string; status?: 'idle' | 'failed' | 'success' }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Speak to unlock</Text>
      <TouchableOpacity style={[styles.mic, listening && styles.micActive]} onPress={onPress}>
        <Text style={styles.micText}>{listening ? 'Listening…' : 'Tap to speak'}</Text>
      </TouchableOpacity>
      <Text style={styles.transcript}>{transcript ?? ''}</Text>
      {status === 'failed' && <Text style={styles.failed}>Try again — be loud and clear</Text>}
      {status === 'success' && <Text style={styles.success}>Success — unlocking</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', margin: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  mic: { marginTop: 12, backgroundColor: '#eee', padding: 14, borderRadius: 40, width: 160, alignItems: 'center' },
  micActive: { backgroundColor: '#6C5CE7' },
  micText: { color: '#111' },
  transcript: { marginTop: 12, color: '#666' },
  failed: { marginTop: 8, color: '#B91C1C' },
  success: { marginTop: 8, color: '#0EA5A9' }
});

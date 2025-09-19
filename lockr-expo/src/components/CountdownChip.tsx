import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CountdownChip({ seconds = 0 }: { seconds?: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{`${mins}:${secs.toString().padStart(2, '0')}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { padding: 12, borderRadius: 24, backgroundColor: '#111', alignSelf: 'center' },
  text: { color: '#fff', fontWeight: '700' }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ModeConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode Configuration</Text>
      <Text style={styles.help}>Configure Time Lock, Hourly Ration, or Extreme settings here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  help: { marginTop: 8, color: '#666' }
});

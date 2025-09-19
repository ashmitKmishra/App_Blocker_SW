import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { startSessionPoll, stopSessionPoll } from '../services/sessionManager';

export default function HomeScreen({ navigation }: any) {
  const mode = useSelector((s: RootState) => s.mode.current);

  useEffect(() => {
    startSessionPoll(1000);
    return () => stopSessionPoll();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lockr</Text>
      <Text style={styles.subtitle}>Mode: {mode}</Text>
      <Button title="Select Apps" onPress={() => navigation.navigate('SelectApps')} />
      <Button title="Mode Config" onPress={() => navigation.navigate('ModeConfig')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 }
});

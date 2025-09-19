import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Lockr</Text>
      <Text style={styles.subtitle}>Protect your attention — all data stays on your device.</Text>
      <Button title="Get started" onPress={() => navigation.replace('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center' }
});

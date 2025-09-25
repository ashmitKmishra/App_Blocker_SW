import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BlockerScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>App Blocked</Text>
        <Text style={styles.subtitle}>Instagram is blocked - daily limit reached</Text>
      </View>

      <View style={styles.blockInfo}>
        <Text style={styles.usageText}>Used 30 minutes today</Text>
        <Text style={styles.limitText}>Limit: 30 minutes per day</Text>
        <Text style={styles.countdown}>23h 59m 45s</Text>
        <Text style={styles.blockSubtext}>until unlock</Text>
      </View>

      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  blockInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    marginBottom: 40,
  },
  usageText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: '500',
    marginBottom: 4,
  },
  limitText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  countdown: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  blockSubtext: {
    fontSize: 14,
    color: '#666',
  },
  homeButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  homeButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

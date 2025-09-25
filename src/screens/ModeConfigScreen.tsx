import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export default function ModeConfigScreen({ navigation, route }: any) {
  const mode = route?.params?.mode || 'timelock';
  const selectedApps = route?.params?.selectedApps || ['instagram'];
  const [dailyLimit, setDailyLimit] = useState('30');

  const handleStartProtection = () => {
    console.log('Starting protection:', { mode, selectedApps, dailyLimit });
    navigation.navigate('Blocker');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Lock Settings</Text>
        <Text style={styles.subtitle}>Set daily usage limits</Text>
      </View>

      <View style={styles.selectedApps}>
        <Text style={styles.appsTitle}>Protected Apps:</Text>
        <Text style={styles.appsList}>
          {selectedApps.map((app: string) => app.charAt(0).toUpperCase() + app.slice(1)).join(', ')}
        </Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Daily Usage Limit</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={dailyLimit}
            onChangeText={setDailyLimit}
            keyboardType="numeric"
            placeholder="30"
          />
          <Text style={styles.inputUnit}>minutes per day</Text>
        </View>
        <Text style={styles.helpText}>
          Instagram will be blocked after 30 minutes of daily usage
        </Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartProtection}>
        <Text style={styles.startButtonText}>Start Protection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    padding: 24,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  selectedApps: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  appsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appsList: {
    fontSize: 16,
    color: '#667eea',
  },
  settingsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 60,
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

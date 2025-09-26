import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useUsageManager } from '../hooks/useUsageManager';

export default function ModeConfigScreen({ navigation, route }: any) {
  const mode = route?.params?.mode || 'timelock';
  const selectedApps = route?.params?.selectedApps || ['instagram'];
  const [dailyLimit, setDailyLimit] = useState('30');
  const { setupAppMonitoring, startBackgroundMonitoring } = useUsageManager();

  const handleStartProtection = async () => {
    try {
      const limitMinutes = parseInt(dailyLimit);
      if (isNaN(limitMinutes) || limitMinutes <= 0) {
        // Use browser alert for web compatibility
        alert('Invalid Limit\nPlease enter a valid number of minutes');
        return;
      }

      console.log('Starting real protection:', { mode, selectedApps, dailyLimit: limitMinutes });
      
      // Set up real monitoring for each selected app
      for (const app of selectedApps) {
        const appName = app.charAt(0).toUpperCase() + app.slice(1); // Capitalize first letter
        await setupAppMonitoring(app, appName, limitMinutes);
      }

      // Start background monitoring service
      await startBackgroundMonitoring(selectedApps);

      // Use browser alert for web compatibility
      const message = `Monitoring ${selectedApps.join(', ')} with ${limitMinutes} minute${limitMinutes > 1 ? 's' : ''} daily limit.\n\nBackground service is now active and will block apps when limits are reached.`;
      alert(`🚀 Protection Active\n${message}`);
      
      navigation.navigate('Blocker', { activeApps: selectedApps, dailyLimit: limitMinutes });
    } catch (error) {
      console.error('Failed to set up protection:', error);
      alert('Error\nFailed to set up app protection. Please try again.');
    }
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUsageManager } from '../hooks/useUsageManager';
import AppBlockerModule from '../modules/AppBlockerModule';

export default function BlockerScreen({ navigation, route }: any) {
  const { activeApps = ['instagram'], dailyLimit = 30 } = route?.params || {};
  const { 
    getAppUsage, 
    isAppBlocked, 
    getTimeUntilUnblock, 
    simulateUsage,
    getBackgroundServiceStatus,
    stopBackgroundMonitoring 
  } = useUsageManager();
  const [refreshCount, setRefreshCount] = useState(0);

  // Get the first app for display (could be enhanced to show all apps)
  const mainApp = activeApps[0];
  const appUsage = getAppUsage(mainApp);
  const blocked = isAppBlocked(mainApp);
  const timeUntilUnblock = getTimeUntilUnblock(mainApp);
  const serviceStatus = getBackgroundServiceStatus();

  // Refresh display every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time for display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCountdown = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = Math.floor((minutes % 1) * 60);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleAddUsageDemo = async () => {
    // Demo function to add 5 minutes of usage
    await simulateUsage(mainApp, 5);
    setRefreshCount(prev => prev + 1); // Trigger refresh
  };

  const handleTestBlocking = async () => {
    // Test the blocking overlay functionality
    const appName = mainApp.charAt(0).toUpperCase() + mainApp.slice(1);
    const timeString = formatTime(timeUntilUnblock);
    
    await AppBlockerModule.showBlockingOverlay(appName, timeString);
  };

  const handleStopMonitoring = async () => {
    try {
      await stopBackgroundMonitoring();
      alert('🛑 Background monitoring stopped');
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
      alert('Error stopping monitoring');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>
          {blocked ? 'App Blocked' : 'Usage Monitor'}
        </Text>
        <Text style={styles.subtitle}>
          {mainApp.charAt(0).toUpperCase() + mainApp.slice(1)} - 
          {blocked ? ' daily limit reached' : ' being monitored'}
        </Text>
      </View>

      <View style={styles.blockInfo}>
        <Text style={styles.usageText}>
          Used {appUsage ? formatTime(appUsage.todayUsage) : '0h 0m'} today
        </Text>
        <Text style={styles.limitText}>
          Limit: {formatTime(dailyLimit)} per day
        </Text>
        
        {blocked ? (
          <>
            <Text style={styles.countdown}>
              {formatCountdown(timeUntilUnblock)}
            </Text>
            <Text style={styles.blockSubtext}>until unlock</Text>
          </>
        ) : (
          <>
            <Text style={styles.countdown}>
              {formatTime(dailyLimit - (appUsage?.todayUsage || 0))}
            </Text>
            <Text style={styles.blockSubtext}>remaining</Text>
          </>
        )}
      </View>

      <View style={styles.serviceStatus}>
        <Text style={styles.statusText}>
          🔄 Background Service: {serviceStatus.isRunning ? '✅ Active' : '❌ Inactive'}
        </Text>
        <Text style={styles.statusSubtext}>
          Monitoring: {serviceStatus.monitoredApps.join(', ') || 'None'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.demoButton}
        onPress={handleAddUsageDemo}
      >
        <Text style={styles.demoButtonText}>+ Add 5 min usage (Demo)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.testButton}
        onPress={handleTestBlocking}
      >
        <Text style={styles.testButtonText}>🚫 Test Blocking Overlay</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.stopButton}
        onPress={handleStopMonitoring}
      >
        <Text style={styles.stopButtonText}>🛑 Stop Monitoring</Text>
      </TouchableOpacity>

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
  serviceStatus: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  demoButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#667eea',
    borderRadius: 8,
    marginBottom: 12,
  },
  demoButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  testButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f39c12',
    borderRadius: 8,
    marginBottom: 12,
  },
  testButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  stopButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    marginBottom: 12,
  },
  stopButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
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


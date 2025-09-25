import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const modes = [
    {
      id: 'timelock',
      title: 'Time Lock',
      description: 'Block apps after daily usage limit',
      example: 'e.g., Instagram blocked after 30 minutes',
      color: '#667eea',
      icon: '⏰',
    },
    {
      id: 'ration',
      title: 'Hourly Ration',
      description: '5-15 minute windows per hour',
      example: 'e.g., 10 min every hour for TikTok',
      color: '#764ba2',
      icon: '🔄',
    },
    {
      id: 'extreme',
      title: 'Extreme Mode',
      description: 'Voice challenge to unlock',
      example: 'Speak to temporarily access blocked app',
      color: '#f093fb',
      icon: '🎙️',
    },
  ];

  const handleModeSelect = (modeId: string) => {
    console.log('Selected mode:', modeId);
    navigation.navigate('SelectApps', { mode: modeId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Focus Mode</Text>
        <Text style={styles.subtitle}>
          Pick how you want to limit distracting apps
        </Text>
      </View>

      <View style={styles.modes}>
        {modes.map((mode) => (
          <TouchableOpacity 
            key={mode.id}
            style={[styles.modeCard, { borderLeftColor: mode.color }]}
            onPress={() => handleModeSelect(mode.id)}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
            </View>
            <Text style={styles.modeExample}>{mode.example}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
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
    lineHeight: 24,
  },
  modes: {
    padding: 24,
    paddingTop: 0,
  },
  modeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modeIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modeExample: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    paddingLeft: 36,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  settingsButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    color: '#666',
  },
});

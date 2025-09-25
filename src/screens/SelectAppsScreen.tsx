import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DEMO_APPS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', category: 'Social' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', category: 'Entertainment' },
  { id: 'facebook', name: 'Facebook', icon: '👥', category: 'Social' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', category: 'Social' },
  { id: 'youtube', name: 'YouTube', icon: '📺', category: 'Entertainment' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', category: 'Social' },
];

export default function SelectAppsScreen({ navigation, route }: any) {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const mode = route?.params?.mode || 'timelock';

  const toggleAppSelection = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleContinue = () => {
    if (selectedApps.length === 0) {
      alert('Please select at least one app to protect');
      return;
    }
    navigation.navigate('ModeConfig', { 
      mode,
      selectedApps: selectedApps 
    });
  };

  const renderAppItem = ({ item }: { item: typeof DEMO_APPS[0] }) => {
    const isSelected = selectedApps.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.appCard, isSelected && styles.selectedCard]}
        onPress={() => toggleAppSelection(item.id)}
      >
        <Text style={styles.appIcon}>{item.icon}</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{item.name}</Text>
          <Text style={styles.appCategory}>{item.category}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Apps to Protect</Text>
        <Text style={styles.subtitle}>
          Choose apps to limit with {mode === 'timelock' ? 'Time Lock' : 'other modes'}
        </Text>
      </View>

      <FlatList
        data={DEMO_APPS}
        renderItem={renderAppItem}
        keyExtractor={(item) => item.id}
        style={styles.appList}
      />

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity 
          style={[styles.continueButton, selectedApps.length === 0 && styles.disabledButton]}
          onPress={handleContinue}
        >
          <Text style={[styles.continueText, selectedApps.length === 0 && styles.disabledText]}>
            Continue
          </Text>
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
  appList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: '#e8f0fe',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  appIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 13,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    backgroundColor: 'white',
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
});

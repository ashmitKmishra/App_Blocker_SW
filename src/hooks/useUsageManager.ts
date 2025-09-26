import { useState, useEffect, useCallback } from 'react';
import RealUsageTracker, { AppUsageData } from '../services/RealUsageTracker';
import BackgroundBlockingService from '../services/BackgroundBlockingService';

export interface UseUsageManagerReturn {
  // App monitoring
  setupAppMonitoring: (appId: string, appName: string, dailyLimitMinutes: number) => Promise<void>;
  getAppUsage: (appId: string) => AppUsageData | null;
  getAllAppUsage: () => { [appId: string]: AppUsageData };
  
  // Session management
  startAppSession: (appId: string) => Promise<void>;
  stopAppSession: (appId: string) => Promise<void>;
  
  // Blocking status
  isAppBlocked: (appId: string) => boolean;
  getTimeUntilUnblock: (appId: string) => number;
  
  // Background service control
  startBackgroundMonitoring: (appIds: string[]) => Promise<void>;
  stopBackgroundMonitoring: () => Promise<void>;
  getBackgroundServiceStatus: () => {
    isRunning: boolean;
    monitoredApps: string[];
    enabled: boolean;
  };
  
  // Testing & debugging
  simulateUsage: (appId: string, minutes: number) => Promise<void>;
  resetAppData: (appId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // State
  usageData: { [appId: string]: AppUsageData };
  refreshUsageData: () => void;
}

export function useUsageManager(): UseUsageManagerReturn {
  const [usageData, setUsageData] = useState<{ [appId: string]: AppUsageData }>({});
  const backgroundService = BackgroundBlockingService.getInstance();
  
  // Refresh usage data from the tracker
  const refreshUsageData = useCallback(() => {
    const allUsage = RealUsageTracker.getAllAppUsage();
    setUsageData(allUsage);
  }, []);

  // Setup app monitoring
  const setupAppMonitoring = useCallback(async (appId: string, appName: string, dailyLimitMinutes: number) => {
    await RealUsageTracker.setupAppMonitoring(appId, appName, dailyLimitMinutes);
    refreshUsageData();
  }, [refreshUsageData]);

  // Get single app usage
  const getAppUsage = useCallback((appId: string): AppUsageData | null => {
    return RealUsageTracker.getAppUsage(appId);
  }, []);

  // Get all app usage
  const getAllAppUsage = useCallback(() => {
    return RealUsageTracker.getAllAppUsage();
  }, []);

  // Start app session
  const startAppSession = useCallback(async (appId: string) => {
    await RealUsageTracker.startAppSession(appId);
    refreshUsageData();
  }, [refreshUsageData]);

  // Stop app session
  const stopAppSession = useCallback(async (appId: string) => {
    await RealUsageTracker.stopAppSession(appId);
    refreshUsageData();
  }, [refreshUsageData]);

  // Check if app is blocked
  const isAppBlocked = useCallback((appId: string): boolean => {
    return RealUsageTracker.isAppBlocked(appId);
  }, []);

  // Get time until unblock
  const getTimeUntilUnblock = useCallback((appId: string): number => {
    return RealUsageTracker.getTimeUntilUnblock(appId);
  }, []);

  // Simulate usage (testing)
  const simulateUsage = useCallback(async (appId: string, minutes: number) => {
    await RealUsageTracker.simulateUsage(appId, minutes);
    refreshUsageData();
  }, [refreshUsageData]);

  // Reset app data (testing)
  const resetAppData = useCallback(async (appId: string) => {
    await RealUsageTracker.resetAppData(appId);
    refreshUsageData();
  }, [refreshUsageData]);

  // Clear all data (testing)
  const clearAllData = useCallback(async () => {
    await RealUsageTracker.clearAllData();
    refreshUsageData();
  }, [refreshUsageData]);

  // Initialize and set up periodic refresh
  // Background service control
  const startBackgroundMonitoring = useCallback(async (appIds: string[]) => {
    try {
      await backgroundService.startMonitoring(appIds);
      console.log('🚀 Background monitoring started for:', appIds);
    } catch (error) {
      console.error('❌ Failed to start background monitoring:', error);
      throw error;
    }
  }, [backgroundService]);

  const stopBackgroundMonitoring = useCallback(async () => {
    try {
      await backgroundService.stopMonitoring();
      console.log('🛑 Background monitoring stopped');
    } catch (error) {
      console.error('❌ Failed to stop background monitoring:', error);
      throw error;
    }
  }, [backgroundService]);

  const getBackgroundServiceStatus = useCallback(() => {
    return backgroundService.getStatus();
  }, [backgroundService]);

  useEffect(() => {
    // Initial data load
    refreshUsageData();
    
    // Refresh usage data every 10 seconds to keep UI updated
    const interval = setInterval(refreshUsageData, 10000);
    
    return () => clearInterval(interval);
  }, [refreshUsageData]);

  return {
    setupAppMonitoring,
    getAppUsage,
    getAllAppUsage,
    startAppSession,
    stopAppSession,
    isAppBlocked,
    getTimeUntilUnblock,
    startBackgroundMonitoring,
    stopBackgroundMonitoring,
    getBackgroundServiceStatus,
    simulateUsage,
    resetAppData,
    clearAllData,
    usageData,
    refreshUsageData
  };
}
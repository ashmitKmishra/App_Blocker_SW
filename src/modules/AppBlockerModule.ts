import { Platform } from 'react-native';

interface AppBlockerModule {
  // iOS & Android app launch monitoring
  startAppMonitoring(appIds: string[]): Promise<void>;
  stopAppMonitoring(): Promise<void>;
  
  // Check if an app is currently running
  isAppRunning(appId: string): Promise<boolean>;
  
  // Show blocking overlay
  showBlockingOverlay(appName: string, timeRemaining: string): Promise<void>;
  hideBlockingOverlay(): Promise<void>;
  
  // Get device app usage (requires permissions)
  getAppUsageStats(appId: string): Promise<{
    todayUsageMinutes: number;
    lastLaunchTime: number;
  }>;
  
  // Request necessary permissions
  requestUsageStatsPermission(): Promise<boolean>;
  hasUsageStatsPermission(): Promise<boolean>;
}

interface AppBlockerEvents {
  onAppLaunched: (appId: string) => void;
  onAppClosed: (appId: string, sessionDuration: number) => void;
}

// For development/web - mock implementation
const createMockModule = (): AppBlockerModule => ({
  startAppMonitoring: async (appIds: string[]) => {
    console.log('🔍 [MOCK] Started monitoring apps:', appIds);
  },
  
  stopAppMonitoring: async () => {
    console.log('🔍 [MOCK] Stopped app monitoring');
  },
  
  isAppRunning: async (appId: string) => {
    console.log('🔍 [MOCK] Checking if app is running:', appId);
    return false;
  },
  
  showBlockingOverlay: async (appName: string, timeRemaining: string) => {
    console.log('🚫 [MOCK] Showing blocking overlay for:', appName, 'Time remaining:', timeRemaining);
    // For web demo, we could show a browser alert
    if (Platform.OS === 'web') {
      alert(`🚫 ${appName} Blocked!\n\nDaily limit reached.\nTime until unblock: ${timeRemaining}`);
    }
  },
  
  hideBlockingOverlay: async () => {
    console.log('✅ [MOCK] Hiding blocking overlay');
  },
  
  getAppUsageStats: async (appId: string) => {
    console.log('📊 [MOCK] Getting usage stats for:', appId);
    return {
      todayUsageMinutes: 0,
      lastLaunchTime: Date.now(),
    };
  },
  
  requestUsageStatsPermission: async () => {
    console.log('🔐 [MOCK] Requesting usage stats permission');
    return true;
  },
  
  hasUsageStatsPermission: async () => {
    console.log('🔐 [MOCK] Checking usage stats permission');
    return true;
  },
});

// Use native module if available, otherwise use mock
// const AppBlockerModule: AppBlockerModule = NativeModules.AppBlockerModule || createMockModule();
// For now, always use mock until we implement native modules
const AppBlockerModule: AppBlockerModule = createMockModule();

export default AppBlockerModule;

export type { AppBlockerModule, AppBlockerEvents };
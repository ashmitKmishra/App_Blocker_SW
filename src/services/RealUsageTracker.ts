import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppUsageData {
  appId: string;
  appName: string;
  todayUsage: number; // minutes used today
  weeklyUsage: number[]; // last 7 days usage
  dailyLimit: number; // minutes allowed per day
  isBlocked: boolean;
  lastResetDate: string; // YYYY-MM-DD format
  totalSessionTime: number; // current session time in seconds
  sessionStartTime: number | null; // timestamp when current session started
}

export interface UsageStorage {
  apps: { [appId: string]: AppUsageData };
  lastUpdated: string;
}

class RealUsageTracker {
  private static instance: RealUsageTracker;
  private storage: UsageStorage = {
    apps: {},
    lastUpdated: new Date().toISOString()
  };
  private activeTimers: { [appId: string]: NodeJS.Timeout } = {};
  private activeSessions: { [appId: string]: number } = {}; // session start timestamps

  static getInstance(): RealUsageTracker {
    if (!RealUsageTracker.instance) {
      RealUsageTracker.instance = new RealUsageTracker();
    }
    return RealUsageTracker.instance;
  }

  private constructor() {
    this.loadData();
    this.checkForDayReset();
  }

  // Load data from persistent storage
  private async loadData(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('usage_tracker_data');
      if (data) {
        this.storage = JSON.parse(data);
        console.log('✅ Usage data loaded:', this.storage);
      } else {
        console.log('📝 No existing usage data found, starting fresh');
        await this.saveData();
      }
    } catch (error) {
      console.error('❌ Error loading usage data:', error);
    }
  }

  // Save data to persistent storage
  private async saveData(): Promise<void> {
    try {
      this.storage.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem('usage_tracker_data', JSON.stringify(this.storage));
      console.log('💾 Usage data saved successfully');
    } catch (error) {
      console.error('❌ Error saving usage data:', error);
    }
  }

  // Check if we need to reset daily counters (new day)
  private checkForDayReset(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    Object.keys(this.storage.apps).forEach(appId => {
      const app = this.storage.apps[appId];
      if (app.lastResetDate !== today) {
        // New day - reset counters
        app.weeklyUsage.unshift(app.todayUsage); // Add yesterday's usage to weekly
        app.weeklyUsage = app.weeklyUsage.slice(0, 7); // Keep only last 7 days
        app.todayUsage = 0; // Reset today's usage
        app.isBlocked = false; // Unblock for new day
        app.lastResetDate = today;
        app.totalSessionTime = 0;
        app.sessionStartTime = null;
        console.log(`🔄 Reset daily usage for ${app.appName}`);
      }
    });
    
    this.saveData();
  }

  // Set up monitoring for an app with daily limit
  async setupAppMonitoring(appId: string, appName: string, dailyLimitMinutes: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    if (!this.storage.apps[appId]) {
      this.storage.apps[appId] = {
        appId,
        appName,
        todayUsage: 0,
        weeklyUsage: [0, 0, 0, 0, 0, 0, 0],
        dailyLimit: dailyLimitMinutes,
        isBlocked: false,
        lastResetDate: today,
        totalSessionTime: 0,
        sessionStartTime: null
      };
      console.log(`📱 Set up monitoring for ${appName} with ${dailyLimitMinutes}min daily limit`);
    } else {
      // Update existing app's limit
      this.storage.apps[appId].dailyLimit = dailyLimitMinutes;
      this.storage.apps[appId].appName = appName;
      console.log(`🔄 Updated ${appName} limit to ${dailyLimitMinutes}min`);
    }
    
    await this.saveData();
  }

  // Start tracking session for an app (simulates app being opened)
  async startAppSession(appId: string): Promise<void> {
    const app = this.storage.apps[appId];
    if (!app) {
      console.warn(`⚠️ App ${appId} not set up for monitoring`);
      return;
    }

    if (app.isBlocked) {
      console.log(`🚫 ${app.appName} is blocked - cannot start session`);
      return;
    }

    const now = Date.now();
    app.sessionStartTime = now;
    this.activeSessions[appId] = now;
    
    console.log(`▶️ Started ${app.appName} session`);
    
    // Start a timer to track usage in real-time
    this.activeTimers[appId] = setInterval(async () => {
      await this.updateSessionTime(appId);
    }, 1000); // Update every second
  }

  // Update session time and check if limit reached
  private async updateSessionTime(appId: string): Promise<void> {
    const app = this.storage.apps[appId];
    if (!app || !app.sessionStartTime) return;

    const now = Date.now();
    const sessionSeconds = Math.floor((now - app.sessionStartTime) / 1000);
    app.totalSessionTime = sessionSeconds;
    
    // Convert total session time to minutes and add to today's usage
    const sessionMinutes = Math.floor(sessionSeconds / 60);
    const newTodayUsage = Math.floor(app.todayUsage) + sessionMinutes;
    
    // Check if limit reached
    if (newTodayUsage >= app.dailyLimit && !app.isBlocked) {
      app.isBlocked = true;
      app.todayUsage = app.dailyLimit; // Cap at limit
      this.stopAppSession(appId);
      console.log(`🚫 ${app.appName} BLOCKED! Limit of ${app.dailyLimit}min reached`);
      await this.saveData();
      
      // Notify listeners that app is now blocked
      this.notifyAppBlocked(appId);
    } else {
      app.todayUsage = newTodayUsage;
    }
  }

  // Stop tracking session for an app
  async stopAppSession(appId: string): Promise<void> {
    const app = this.storage.apps[appId];
    if (!app) return;

    // Clear the timer
    if (this.activeTimers[appId]) {
      clearInterval(this.activeTimers[appId]);
      delete this.activeTimers[appId];
    }

    // Final update of session time
    if (app.sessionStartTime) {
      const sessionSeconds = Math.floor((Date.now() - app.sessionStartTime) / 1000);
      const sessionMinutes = Math.floor(sessionSeconds / 60);
      app.todayUsage = Math.min(app.todayUsage + sessionMinutes, app.dailyLimit);
      app.sessionStartTime = null;
      app.totalSessionTime = 0;
      
      console.log(`⏹️ Stopped ${app.appName} session (${sessionMinutes}min used)`);
      await this.saveData();
    }

    delete this.activeSessions[appId];
  }

  // Get current usage data for an app
  getAppUsage(appId: string): AppUsageData | null {
    return this.storage.apps[appId] || null;
  }

  // Get usage data for all monitored apps
  getAllAppUsage(): { [appId: string]: AppUsageData } {
    return this.storage.apps;
  }

  // Check if an app is currently blocked
  isAppBlocked(appId: string): boolean {
    const app = this.storage.apps[appId];
    return app ? app.isBlocked : false;
  }

  // Get remaining time until unblock (in seconds)
  getTimeUntilUnblock(appId: string): number {
    const app = this.storage.apps[appId];
    if (!app || !app.isBlocked) return 0;
    
    // Calculate seconds until midnight (when daily limit resets)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
  }

  // Simulate app usage (for testing)
  async simulateUsage(appId: string, minutesToAdd: number): Promise<void> {
    const app = this.storage.apps[appId];
    if (!app) return;
    
    app.todayUsage = Math.min(app.todayUsage + minutesToAdd, app.dailyLimit);
    
    if (app.todayUsage >= app.dailyLimit) {
      app.isBlocked = true;
      console.log(`🧪 SIMULATION: ${app.appName} blocked after adding ${minutesToAdd}min`);
    }
    
    await this.saveData();
  }

  // Reset app data (for testing)
  async resetAppData(appId: string): Promise<void> {
    const app = this.storage.apps[appId];
    if (!app) return;
    
    app.todayUsage = 0;
    app.isBlocked = false;
    app.totalSessionTime = 0;
    app.sessionStartTime = null;
    
    console.log(`🔄 Reset data for ${app.appName}`);
    await this.saveData();
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    // Stop all active sessions
    Object.keys(this.activeTimers).forEach(appId => {
      clearInterval(this.activeTimers[appId]);
    });
    
    this.storage = {
      apps: {},
      lastUpdated: new Date().toISOString()
    };
    this.activeTimers = {};
    this.activeSessions = {};
    
    await AsyncStorage.removeItem('usage_tracker_data');
    console.log('🗑️ Cleared all usage data');
  }

  // Notify when app gets blocked (can be extended to show notifications)
  private notifyAppBlocked(appId: string): void {
    const app = this.storage.apps[appId];
    if (app) {
      console.log(`📢 NOTIFICATION: ${app.appName} has been blocked for the day!`);
      // Here you could trigger push notifications, UI updates, etc.
    }
  }
}

export default RealUsageTracker.getInstance();
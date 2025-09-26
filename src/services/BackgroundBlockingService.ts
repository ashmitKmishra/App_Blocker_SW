import AppBlockerModule from '../modules/AppBlockerModule';
import RealUsageTracker from './RealUsageTracker';

interface BackgroundServiceConfig {
  enabled: boolean;
  checkIntervalSeconds: number; // How often to check app status
  monitoredApps: string[]; // Array of app IDs to monitor
}

class BackgroundBlockingService {
  private static instance: BackgroundBlockingService;
  private config: BackgroundServiceConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {
    this.config = {
      enabled: false,
      checkIntervalSeconds: 5, // Check every 5 seconds
      monitoredApps: [],
    };
  }

  static getInstance(): BackgroundBlockingService {
    if (!BackgroundBlockingService.instance) {
      BackgroundBlockingService.instance = new BackgroundBlockingService();
    }
    return BackgroundBlockingService.instance;
  }

  /**
   * Start the background monitoring service
   */
  async startMonitoring(appIds: string[]): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Background service already running');
      return;
    }

    try {
      console.log('🚀 Starting background app blocking service for:', appIds);
      
      this.config.monitoredApps = appIds;
      this.config.enabled = true;
      
      // Request necessary permissions
      const hasPermission = await AppBlockerModule.hasUsageStatsPermission();
      if (!hasPermission) {
        const granted = await AppBlockerModule.requestUsageStatsPermission();
        if (!granted) {
          throw new Error('Usage stats permission required for app blocking');
        }
      }

      // Start native app monitoring
      await AppBlockerModule.startAppMonitoring(appIds);
      
      // Start periodic check interval
      this.startPeriodicChecks();
      
      this.isRunning = true;
      console.log('✅ Background monitoring service started successfully');
    } catch (error) {
      console.error('❌ Failed to start background monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop the background monitoring service
   */
  async stopMonitoring(): Promise<void> {
    console.log('🛑 Stopping background monitoring service');
    
    this.config.enabled = false;
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    await AppBlockerModule.stopAppMonitoring();
    await AppBlockerModule.hideBlockingOverlay();
    
    console.log('✅ Background monitoring service stopped');
  }

  /**
   * Start periodic checks for app blocking
   */
  private startPeriodicChecks(): void {
    this.intervalId = setInterval(async () => {
      if (!this.config.enabled) return;
      
      try {
        await this.checkAndBlockApps();
      } catch (error) {
        console.error('❌ Error during periodic app check:', error);
      }
    }, this.config.checkIntervalSeconds * 1000);
  }

  /**
   * Check all monitored apps and block if necessary
   */
  private async checkAndBlockApps(): Promise<void> {
    for (const appId of this.config.monitoredApps) {
      try {
        // Check if app is currently running
        const isRunning = await AppBlockerModule.isAppRunning(appId);
        
        if (isRunning) {
          // Check if app should be blocked
          const shouldBlock = RealUsageTracker.isAppBlocked(appId);
          
          if (shouldBlock) {
            await this.blockApp(appId);
          }
        }
      } catch (error) {
        console.error(`❌ Error checking app ${appId}:`, error);
      }
    }
  }

  /**
   * Block a specific app
   */
  private async blockApp(appId: string): Promise<void> {
    console.log(`🚫 BLOCKING APP: ${appId}`);
    
    try {
      const appData = RealUsageTracker.getAppUsage(appId);
      const timeUntilUnblock = RealUsageTracker.getTimeUntilUnblock(appId);
      
      const appName = appData?.appName || appId.charAt(0).toUpperCase() + appId.slice(1);
      const timeString = this.formatTime(timeUntilUnblock);
      
      // Show blocking overlay
      await AppBlockerModule.showBlockingOverlay(appName, timeString);
      
      // Log the blocking event
      console.log(`🔒 ${appName} blocked - ${appData?.todayUsage || 0} minutes used today`);
      console.log(`⏰ Time until unblock: ${timeString}`);
      
    } catch (error) {
      console.error(`❌ Error blocking app ${appId}:`, error);
    }
  }

  /**
   * Handle app launch event (called by native module)
   */
  async onAppLaunched(appId: string): Promise<void> {
    console.log(`📱 App launched: ${appId}`);
    
    // Start tracking session in RealUsageTracker
    await RealUsageTracker.startAppSession(appId);
    
    // Check if app should be blocked immediately
    const shouldBlock = RealUsageTracker.isAppBlocked(appId);
    if (shouldBlock) {
      await this.blockApp(appId);
    }
  }

  /**
   * Handle app close event (called by native module)
   */
  async onAppClosed(appId: string, sessionDuration: number): Promise<void> {
    console.log(`📱 App closed: ${appId}, session: ${sessionDuration}s`);
    
    // Stop tracking session in RealUsageTracker
    await RealUsageTracker.stopAppSession(appId);
  }

  /**
   * Format time for display
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Get service status
   */
  getStatus(): {
    isRunning: boolean;
    monitoredApps: string[];
    enabled: boolean;
  } {
    return {
      isRunning: this.isRunning,
      monitoredApps: [...this.config.monitoredApps],
      enabled: this.config.enabled,
    };
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(newConfig: Partial<BackgroundServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Background service config updated:', this.config);
  }
}

export default BackgroundBlockingService;
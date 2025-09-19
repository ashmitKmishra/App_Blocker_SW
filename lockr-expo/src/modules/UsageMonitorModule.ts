// RN stub for native UsageMonitor (Android: UsageStats / Accessibility; iOS: placeholder)
export default {
  // Returns current foreground package id (Android) or app identifier (iOS via URL handler)
  async getForegroundApp(): Promise<string | null> {
    // native implementation should return package name or bundle id
    return null;
  },

  // Returns list of installed/usage apps (Android) for selection
  async listInstalledApps(): Promise<Array<{ id: string; name: string; icon?: string }>> {
    return [];
  }
};

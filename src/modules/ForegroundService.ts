// ForegroundService stub: Android should start a foreground service to keep timers reliable.
export default {
  async startService(opts?: { notificationTitle?: string; notificationText?: string }) {
    // native implementation should start a foreground service and return true if started
    return false;
  },
  async stopService() {
    return false;
  },
  async isRunning(): Promise<boolean> {
    return false;
  }
};

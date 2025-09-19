// RN overlay stub. Android: use SYSTEM_ALERT_WINDOW to show overlay over apps.
export default {
  async requestOverlayPermission(): Promise<boolean> {
    return false;
  },
  async hasOverlayPermission(): Promise<boolean> {
    return false;
  },
  // Show a full-screen overlay with supplied HTML/JSX or signal native to present the Blocker UI
  async showOverlay(payload: { title?: string; message?: string; type?: string }) {
    // native should present an Activity / Window overlay
  },
  async hideOverlay() {
    // native hide
  }
};

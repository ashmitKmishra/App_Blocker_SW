// iOS helper stubs for ActivityKit Live Activities and URL scheme handling
export default {
  async startLiveActivity(payload: { id: string; expiresAt?: number; data?: any }) {
    // native implementation: ActivityKit start
  },
  async updateLiveActivity(id: string, data: any) {
    // native update
  },
  async endLiveActivity(id: string) {
    // native end
  }
};

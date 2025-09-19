import UsageMonitor from '../modules/UsageMonitorModule';
import { store } from '../state/store';
import { incrementDailyUsed } from '../state/slices/quotasSlice';
import { RootState } from '../state/store';
import { navigate } from '../navigation/NavigationService';

let polling = false;

export function startSessionPoll(intervalMs = 1000) {
  if (polling) return;
  polling = true;
  const tick = async () => {
    if (!polling) return;
    try {
      const fg = await UsageMonitor.getForegroundApp();
      const state: RootState = store.getState() as any;
      const guarded = state.guardedApps.apps.find((a: any) => a.packageName === fg || a.id === fg);
      if (guarded && !guarded.allowed) {
        // increment usage by intervalMs seconds
        store.dispatch(incrementDailyUsed(Math.floor(intervalMs / 1000)) as any);
        // if over budget, navigate to Blocker
        const state: RootState = store.getState() as any;
        const used = state.quotas.dailyUsedSec + state.quotas.extraTodaySec;
        const budget = state.quotas.dailyBudgetSec;
        if (used >= budget) {
          navigate('Blocker');
        }
      }
    } catch (e) {
      // ignore
    }
    setTimeout(tick, intervalMs);
  };
  tick();
}

export function stopSessionPoll() {
  polling = false;
}

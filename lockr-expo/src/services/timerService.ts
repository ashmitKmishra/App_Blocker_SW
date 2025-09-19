import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lockr:timers:v1';

export type TimerState = {
  dailyUsedSec: number;
  unlockEndsAt?: number | null;
  mode: 'TIME' | 'HOURLY' | 'EXTREME';
};

export async function saveTimerState(state: TimerState) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}

export async function loadTimerState(): Promise<TimerState | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TimerState;
  } catch (e) {
    return null;
  }
}

export function nowSec() {
  return Math.floor(Date.now() / 1000);
}

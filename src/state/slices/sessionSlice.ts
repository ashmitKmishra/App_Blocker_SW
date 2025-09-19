import { createSlice } from '@reduxjs/toolkit';

type State = {
  isUnlocked: boolean;
  unlockEndsAt?: number | null;
  lastDeniedAt?: number | null;
  failedSpeechCount: number;
};

const initialState: State = {
  isUnlocked: false,
  unlockEndsAt: null,
  lastDeniedAt: null,
  failedSpeechCount: 0
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    unlockUntil(state: State, action: any) {
      state.isUnlocked = true;
      state.unlockEndsAt = action.payload;
    },
    lock(state: State) {
      state.isUnlocked = false;
      state.unlockEndsAt = null;
    },
    recordDenied(state: State) {
      state.lastDeniedAt = Date.now();
      state.failedSpeechCount += 1;
    },
    resetFailedCount(state: State) {
      state.failedSpeechCount = 0;
    }
  }
});

export const { unlockUntil, lock, recordDenied, resetFailedCount } = slice.actions;
export const sessionReducer = slice.reducer;

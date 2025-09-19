import { createSlice } from '@reduxjs/toolkit';

type State = {
  dailyBudgetSec: number;
  hourlyWindowSec: number;
  extraTodaySec: number;
  nextResetAt?: number | null;
  dailyUsedSec: number;
};

const initialState: State = {
  dailyBudgetSec: 30 * 60,
  hourlyWindowSec: 5 * 60,
  extraTodaySec: 0,
  nextResetAt: null
  ,dailyUsedSec: 0
};

const slice = createSlice({
  name: 'quotas',
  initialState,
  reducers: {
    setDailyBudget(state: State, action: any) {
      state.dailyBudgetSec = action.payload;
    },
    setHourlyWindow(state: State, action: any) {
      state.hourlyWindowSec = action.payload;
    },
    addExtraToday(state: State, action: any) {
      state.extraTodaySec += action.payload;
    },
    setNextReset(state: State, action: any) {
      state.nextResetAt = action.payload;
    }
    ,incrementDailyUsed(state: State, action: any) {
      state.dailyUsedSec += action.payload;
    },
    resetDailyUsed(state: State) {
      state.dailyUsedSec = 0;
    }
  }
});

export const { setDailyBudget, setHourlyWindow, addExtraToday, setNextReset, incrementDailyUsed, resetDailyUsed } = slice.actions;
export const quotasReducer = slice.reducer;

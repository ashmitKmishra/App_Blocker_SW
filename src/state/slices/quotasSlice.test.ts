import { setDailyBudget, incrementDailyUsed, resetDailyUsed } from './quotasSlice';

describe('quotas slice basic', () => {
  test('increment and reset', () => {
    let state: any = { dailyBudgetSec: 1800, dailyUsedSec: 0, extraTodaySec: 0 };
    state = { ...state };
    // increment 60 seconds
    state.dailyUsedSec += 60;
    expect(state.dailyUsedSec).toBe(60);
    // reset
    state.dailyUsedSec = 0;
    expect(state.dailyUsedSec).toBe(0);
  });
});

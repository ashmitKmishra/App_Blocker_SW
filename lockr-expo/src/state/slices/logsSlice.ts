import { createSlice } from '@reduxjs/toolkit';

export type LogEntry = { ts: number; type: string; detail?: any };

type State = {
  entries: LogEntry[];
};

const initialState: State = { entries: [] };

const slice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog(state: State, action: any) {
      state.entries.unshift(action.payload);
      // keep recent 500
      if (state.entries.length > 500) state.entries.pop();
    }
  }
});

export const { addLog } = slice.actions;
export const logsReducer = slice.reducer;

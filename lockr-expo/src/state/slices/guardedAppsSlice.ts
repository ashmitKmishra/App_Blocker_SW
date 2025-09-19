import { createSlice } from '@reduxjs/toolkit';

export type GuardedApp = {
  id: string; // internal id
  name: string;
  packageName?: string;
  iconUri?: string;
  allowed?: boolean; // per-app override
};

type State = {
  apps: GuardedApp[];
};

const initialState: State = { apps: [] };

const slice = createSlice({
  name: 'guardedApps',
  initialState,
  reducers: {
    setApps(state: State, action: any) {
      state.apps = action.payload;
    },
    toggleApp(state: State, action: any) {
      const idx = state.apps.findIndex((a) => a.id === action.payload.id);
      if (idx >= 0) state.apps[idx].allowed = !state.apps[idx].allowed;
    },
    addApp(state: State, action: any) {
      state.apps.push(action.payload);
    }
  }
});

export const { setApps, toggleApp, addApp } = slice.actions;
export const guardedAppsReducer = slice.reducer;

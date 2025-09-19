import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { permissionsReducer } from './slices/permissionsSlice';
import { guardedAppsReducer } from './slices/guardedAppsSlice';
import { modeReducer } from './slices/modeSlice';
import { quotasReducer } from './slices/quotasSlice';
import { sessionReducer } from './slices/sessionSlice';
import { settingsReducer } from './slices/settingsSlice';
import { logsReducer } from './slices/logsSlice';

const rootReducer = combineReducers({
  permissions: permissionsReducer,
  guardedApps: guardedAppsReducer,
  mode: modeReducer,
  quotas: quotasReducer,
  session: sessionReducer,
  settings: settingsReducer,
  logs: logsReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Simple rehydrate helper for initial load (can be expanded to use redux-persist or MMKV)
export async function rehydrateStore() {
  try {
    const raw = await AsyncStorage.getItem('lockr:state:v1');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    // naive rehydrate: dispatch actions or replace state as needed (left as TODO)
    // For now, developer can access parsed state to seed stores on app init.
    // e.g., store.dispatch({ type: 'settings/load', payload: parsed.settings })
    return parsed;
  } catch (e) {
    return null;
  }
}

import { createSlice } from '@reduxjs/toolkit';

export type PermissionsState = {
  usageAccess: boolean;
  overlay: boolean;
  mic: boolean;
  notifications: boolean;
  foregroundService: boolean;
};

const initialState: PermissionsState = {
  usageAccess: false,
  overlay: false,
  mic: false,
  notifications: false,
  foregroundService: false
};

const slice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermission(_state: PermissionsState, action: any) {
      const next: PermissionsState = { ...initialState, ...action.payload } as PermissionsState;
      return next;
    }
  }
});

export const { setPermission } = slice.actions;
export const permissionsReducer = slice.reducer;

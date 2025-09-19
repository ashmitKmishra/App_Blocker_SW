import { createSlice } from '@reduxjs/toolkit';

type State = {
  pin?: string | null;
  theme: 'light' | 'dark' | 'system';
  haptics: boolean;
  voiceStrictness: 'strict' | 'normal' | 'lenient';
};

const initialState: State = { pin: null, theme: 'system', haptics: true, voiceStrictness: 'normal' };

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPin(state: State, action: any) {
      state.pin = action.payload;
    },
    setTheme(state: State, action: any) {
      state.theme = action.payload;
    },
    setHaptics(state: State, action: any) {
      state.haptics = action.payload;
    },
    setVoiceStrictness(state: State, action: any) {
      state.voiceStrictness = action.payload;
    }
  }
});

export const { setPin, setTheme, setHaptics, setVoiceStrictness } = slice.actions;
export const settingsReducer = slice.reducer;

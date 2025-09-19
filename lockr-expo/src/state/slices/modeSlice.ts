import { createSlice } from '@reduxjs/toolkit';

export type Mode = 'TIME' | 'HOURLY' | 'EXTREME';

type State = {
  current: Mode;
};

const initialState: State = { current: 'TIME' };

const slice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode(state: State, action: any) {
      state.current = action.payload;
    }
  }
});

export const { setMode } = slice.actions;
export const modeReducer = slice.reducer;

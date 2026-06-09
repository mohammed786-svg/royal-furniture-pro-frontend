import { createSlice } from "@reduxjs/toolkit";

type AppState = {
  /** Set true after redux-persist rehydrates on the client */
  rehydrated: boolean;
};

const initialState: AppState = {
  rehydrated: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRehydrated(state, action: { payload: boolean }) {
      state.rehydrated = action.payload;
    },
  },
});

export const { setRehydrated } = appSlice.actions;
export default appSlice.reducer;

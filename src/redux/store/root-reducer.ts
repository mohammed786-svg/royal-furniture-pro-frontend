import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "@/redux/slices/app-slice";

/**
 * Root reducer — add slices under redux/slices/ when implementing features.
 */
export const rootReducer = combineReducers({
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

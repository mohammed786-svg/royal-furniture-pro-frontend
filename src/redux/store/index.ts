import { configureStore, type Middleware } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { persistConfig } from "@/redux/persist/config";
import { rootReducer, type RootState } from "@/redux/store/root-reducer";

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware: Middleware[] = [];

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type { RootState };

export const createPersistor = (store: AppStore) => persistStore(store);

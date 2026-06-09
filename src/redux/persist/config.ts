import type { PersistConfig } from "redux-persist";
import { getPersistStorage } from "@/redux/persist/storage";
import type { RootState } from "@/redux/store/root-reducer";

export const persistConfig: PersistConfig<RootState> = {
  key: "royal-furniture-pro",
  version: 2,
  storage: getPersistStorage(),
  whitelist: [],
  blacklist: [],
};

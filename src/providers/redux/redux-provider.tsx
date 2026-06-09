"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setRehydrated } from "@/redux/slices/app-slice";
import { createPersistor, makeStore, type AppStore } from "@/redux/store";

type ReduxProviderProps = {
  children: React.ReactNode;
};

export function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<ReturnType<typeof createPersistor> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = createPersistor(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={null}
        persistor={persistorRef.current!}
        onBeforeLift={() => {
          storeRef.current?.dispatch(setRehydrated(true));
        }}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}

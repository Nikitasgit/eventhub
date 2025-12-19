import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { Dependencies } from "../store/dependencies";
import { type AppState } from "../store/store";
import userReducer from "../user/userSlice";

const createDependencies = (
  dependencies?: Partial<Dependencies>
): Dependencies => ({
  ...dependencies,
});

export const createTestStore = (config?: {
  initialState?: Partial<AppState>;
  dependencies?: Partial<Dependencies>;
}) => {
  const reducers = combineReducers({
    user: userReducer,
  });

  const baseState = reducers(undefined, { type: "@@INIT" } as { type: string });

  const mergedState = config?.initialState
    ? {
        ...baseState,
        ...config.initialState,
      }
    : baseState;

  return configureStore({
    reducer: reducers,
    preloadedState: mergedState as AppState,
    devTools: false,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: createDependencies(config?.dependencies),
        },
      });
    },
  });
};

export const createTestState = (partialState?: Partial<AppState>) => {
  const store = createTestStore({
    dependencies: createDependencies(),
  });

  const storeInitialState = store.getState();

  const merged = {
    ...storeInitialState,
    ...partialState,
  };

  return createTestStore({ initialState: merged }).getState();
};

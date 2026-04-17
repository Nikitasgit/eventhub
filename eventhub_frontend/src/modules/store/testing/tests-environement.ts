import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { Dependencies } from "../dependencies";
import authReducer from "../../auth/authSlice";

const testReducers = combineReducers({
  auth: authReducer,
});

export type TestRootState = ReturnType<typeof testReducers>;

const createDependencies = (
  dependencies?: Partial<Dependencies>
): Dependencies => ({
  ...dependencies,
});

export const createTestStore = (config?: {
  initialState?: Partial<TestRootState>;
  dependencies?: Partial<Dependencies>;
}) => {
  const baseState = testReducers(undefined, {
    type: "@@INIT",
  } as { type: string });

  const withIdleAuth: TestRootState = {
    ...baseState,
    auth: {
      ...baseState.auth,
      loading: false,
    },
  };

  const mergedState = config?.initialState
    ? {
        ...withIdleAuth,
        ...config.initialState,
        auth: {
          ...withIdleAuth.auth,
          ...(config.initialState.auth ?? {}),
        },
      }
    : withIdleAuth;

  return configureStore({
    reducer: testReducers,
    preloadedState: mergedState,
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

export const createTestState = (partialState?: Partial<TestRootState>) => {
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

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { Dependencies } from "./dependencies";
import authReducer from "../auth/authSlice";

const reducers = combineReducers({
  auth: authReducer,
});

export type AppStore = ReturnType<typeof createStore>;
export type AppState = ReturnType<typeof reducers>;
export type AppDispatch = AppStore["dispatch"];
export type AppGetState = AppStore["getState"];

export const createStore = (config: { dependencies: Dependencies }) => {
  const store = configureStore({
    reducer: reducers,
    devTools: true,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: config.dependencies,
        },
      });
    },
  });
  return store;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;

export type RootState = ReturnType<typeof reducers>;

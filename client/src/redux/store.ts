import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import { persistReducer, persistStore, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type UserState = ReturnType<typeof userReducer>;

const persistConfig: PersistConfig<UserState> = {
  key: 'root',
  storage,
  version: 1,
};

const persistReducerUser = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistReducerUser,
  },
});

export const persistor = persistStore(store);

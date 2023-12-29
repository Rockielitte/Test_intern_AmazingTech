import { accountApi } from "@/services/accountApi";
import { periodApi } from "@/services/periodApi";
import { taskApi } from "@/services/taskApi";
import { configureStore } from "@reduxjs/toolkit";
// ...import { persistStore, persistReducer } from 'redux-persist';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import userReducer from "@/slices/user.slice";
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);
export const store = configureStore({
  reducer: {
    [accountApi.reducerPath]: accountApi.reducer,
    [periodApi.reducerPath]: periodApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      accountApi.middleware,
      periodApi.middleware,
      taskApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

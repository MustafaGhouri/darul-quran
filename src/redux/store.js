import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { userAPI } from "./api/user";
import { courseApi } from "./api/courses";
import { notificationApi } from "./api/notifications";


export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    user: userReducer,
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    courseApi.middleware,
    notificationApi.middleware,
  ],
});

export const serverUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;
// export type RootState = ReturnType<typeof store.getState>;
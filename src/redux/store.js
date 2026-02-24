import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { userAPI } from "./api/user";
import { courseApi } from "./api/courses";
import { notificationApi } from "./api/notifications";
import { dashboardApi } from "./api/dashboard";
import { announcementAPI } from "./api/announcements";
import { scheduleApi } from "./api/schedules";
import { attendanceApi } from "./api/attendance";
import { enrollmentAdminApi } from "./api/enrollmentAdmin";
import { rescheduleApi } from "./api/reschedule";
import { supportTicketApi } from "./api/supportTickets";


export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [announcementAPI.reducerPath]: announcementAPI.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [enrollmentAdminApi.reducerPath]: enrollmentAdminApi.reducer,
    [rescheduleApi.reducerPath]: rescheduleApi.reducer,
    [supportTicketApi.reducerPath]: supportTicketApi.reducer,
    user: userReducer,
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    courseApi.middleware,
    notificationApi.middleware,
    dashboardApi.middleware,
    announcementAPI.middleware,
    scheduleApi.middleware,
    attendanceApi.middleware,
    enrollmentAdminApi.middleware,
    rescheduleApi.middleware,
    supportTicketApi.middleware,
  ],
});

export const serverUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;
// export type RootState = ReturnType<typeof store.getState>;
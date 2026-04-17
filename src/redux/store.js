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
import { paymentApi } from "./api/payments";
import { cancellationApi } from "./api/cancellation";
import { analyticsApi } from "./api/analytics";
import { faqAPI } from "./api/faq";
import chatReducer from "./reducers/chat";


export const apiRegistry = {
  userAPI,
  courseApi,
  notificationApi,
  dashboardApi,
  announcementAPI,
  scheduleApi,
  attendanceApi,
  enrollmentAdminApi,
  rescheduleApi,
  supportTicketApi,
  paymentApi,
  cancellationApi,
  analyticsApi,
  faqAPI
};
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
    [paymentApi.reducerPath]: paymentApi.reducer,
    [cancellationApi.reducerPath]: cancellationApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [faqAPI.reducerPath]: faqAPI.reducer,
    user: userReducer,
    chat: chatReducer,
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
    paymentApi.middleware,
    cancellationApi.middleware,
    analyticsApi.middleware,
    faqAPI.middleware,
  ],
});

export const serverUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;
// export type RootState = ReturnType<typeof store.getState>;
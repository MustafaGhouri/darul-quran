import "./App.css";

import ProtectedRoute from "./components/protected-route";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  HeroUIProvider,
  Spinner,
  ToastProvider,
  addToast,
} from "@heroui/react";
import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TeachersLayout from "./components/layouts/Teacherslayout";
import StudentLayout from "./components/layouts/Studentlayout";
import ErrorBoundary from "./components/globalError";
import DownloadModal from "./components/dashboard-components/DownloadModal";

import { showMessage } from "./lib/toast.config";
import { clearUser, setUser } from "./redux/reducers/user";
import { setOnlineUsers, setIncomingMessage, setChats, updateMessageDelivery, setMessagesReadInChat, updateChatPreview } from "./redux/reducers/chat";
import Loader from "./components/Loader";

import useDynamicMeta from "./hooks/useDynamicMetadata";

const Home = lazy(() => import("./pages/Home"));

const Login = lazy(() => import("./pages/auth/Login"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NoPermissions = lazy(() => import("./pages/admin/NoPermissions"));

const TeachersDashboard = lazy(() => import("./pages/teacher/TeachersDashboard"));
const TeacherAnnouncements = lazy(() => import("./pages/teacher/announcements"));
const TeacherClassSheduling = lazy(() => import("./pages/teacher/class-sheduling"));
const CreaterOrUpdateSchedule = lazy(() =>
  import("./pages/teacher/class-sheduling/CreaterOrUpdate")
);
const CourseList = lazy(() => import("./pages/teacher/my-courses/CourseList"));
const MyCourses = lazy(() => import("./pages/teacher/my-courses"));
const UploadMaterial = lazy(() =>
  import("./pages/teacher/my-courses/uploadmaterial")
);
const StudentAttendance = lazy(() =>
  import("./pages/teacher/student-attendance")
);
const StudentAttendanceList = lazy(() =>
  import("./pages/teacher/student-attendance-list")
);
const StudentAttendanceDetails = lazy(() =>
  import("./pages/teacher/student-attendance-details")
);
const SupportTicketsTeacher = lazy(() =>
  import("./pages/teacher/supports-tickets/page")
);

const StudentDashboard = lazy(() =>
  import("./pages/student/StudentDashboard")
);
const MyLearning = lazy(() =>
  import("./pages/student/my-learning-joureny")
);
const StudentClassSheduling = lazy(() =>
  import("./pages/student/class-sheduling")
);
const BrowseCourses = lazy(() =>
  import("./pages/student/browse-courses")
);
const CourseDetails = lazy(() =>
  import("./pages/student/browse-courses/course-details")
);
const PaymentsInvoices = lazy(() =>
  import("./pages/student/payments-invoices")
);
const SupportTicketsStudent = lazy(() =>
  import("./pages/student/supports-tickets/page")
);
const StudentAnnouncements = lazy(() =>
  import("./pages/student/announcements")
);
const EnrollSuccess = lazy(() =>
  import("./pages/student/enroll-success")
);
const CoursePlayer = lazy(() =>
  import("./pages/student/course-player")
);
const StudentRescheduleRequests = lazy(() =>
  import("./pages/student/RescheduleRequests")
);

const AddUser = lazy(() =>
  import("./pages/admin/user-management/add-user")
);
const EditUser = lazy(() =>
  import("./pages/admin/user-management/add-user/edituser")
);

const CourseManagement = lazy(() =>
  import("./pages/admin/course-management/index")
);
const Attendance = lazy(() =>
  import("./pages/admin/course-management/Attendance")
);
const CourseBuilder = lazy(() =>
  import("./pages/admin/course-management/course-builder")
);

const UserManagement = lazy(() =>
  import("./pages/admin/user-management")
);
const UserDetails = lazy(() =>
  import("./pages/admin/user-management/users-details")
);

const Scheduling = lazy(() =>
  import("./pages/admin/scheduling")
);
const Announcements = lazy(() =>
  import("./pages/admin/announcements")
);
const PaymentsRefunds = lazy(() =>
  import("./pages/admin/payment-refund")
);
const SupportTickets = lazy(() =>
  import("./pages/admin/support-ticket")
);
const Analytics = lazy(() =>
  import("./pages/admin/analytics")
);

const HelpMessages = lazy(() =>
  import("./pages/admin/help")
);
const TeacherAndStudentChat = lazy(() =>
  import("./pages/admin/help/TeacherAndStudent")
);
const Review = lazy(() => import("./pages/admin/help/review"));
const Faqs = lazy(() => import("./pages/admin/help/faqs")); 
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_PUBLIC_SERVER_URL);

const LiveSession = lazy(() =>
  import("./pages/LiveSession")
);
const RescheduleRequests = lazy(() =>
  import("./pages/RescheduleRequests")
);
const Notifications = lazy(() =>
  import("./pages/notifications")
);
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();

  useDynamicMeta({ location });

  const dispatch = useDispatch();

  const { user, loading, shouldFetch, isAuthenticated } = useSelector(
    (state) => state?.user
  );
  const { incomingMessage, activeChatId } = useSelector((state) => state?.chat ?? {});

  // Toast when new message arrives and user is not viewing that chat (clickable → open chat)
  useEffect(() => {
    if (!incomingMessage?.message || !user?.id) return;
    const isOnChatScreen = pathname.includes("/help/messages") || pathname.startsWith("/teacher/chat") || pathname.includes("/help/chat");
    const isViewingThisChat = isOnChatScreen && activeChatId === incomingMessage.chatId;
    if (isViewingThisChat) return;

    const msg = incomingMessage.message;
    const senderName = msg.sender
      ? [msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(" ").trim() || msg.sender.email || "Someone"
      : "Someone";
    const text = (msg.text || "").slice(0, 80);
    const role = (user.role || "").toLowerCase();
    const messagesBase = role === "admin" ? "/admin/help/messages" : role === "teacher" ? "/teacher/chat" : "/student/help/messages";
    const chatUrl = `${messagesBase}/${incomingMessage.chatId}`;

    addToast({
      title: `New message from ${senderName}`,
      description: (
        <div className="flex flex-col gap-1">
          <span>{text ? (text.length >= 80 ? `${text}…` : text) : "New message"}</span>
          <button
            type="button"
            onClick={() => navigate(chatUrl)}
            className="text-left font-medium underline hover:no-underline text-sm mt-0.5"
          >
            Open chat →
          </button>
        </div>
      ),
      color: "primary",
      variant: "solid",
      placement: "bottom-right",
    });
  }, [incomingMessage, pathname, activeChatId, user?.id, user?.role, navigate]);

  // Pre-fetch chat list when user logs in for zero-latency navigation to chat screen
  useEffect(() => {
    if (!user?.id) return;
    const api = import.meta.env.VITE_PUBLIC_SERVER_URL;
    fetch(`${api}/api/chat`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.chats) dispatch(setChats(data.chats));
      })
      .catch(() => {});
  }, [user?.id, dispatch]);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();
        console.log("Data:", data);
        if (res.ok && data.user) {
          dispatch(setUser(data.user));
          if (["/", "/auth/forget-password", "/auth/change-password"].includes(pathname)) {
            const role = data.user.role?.toLowerCase();



            if (role === "admin") {
              navigate("/admin/dashboard", { replace: true });
            } else if (role === "teacher") {
              navigate("/teacher/dashboard", { replace: true });
            } else if (role === "student") {
              navigate("/student/dashboard", { replace: true });
            }


          }
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        dispatch(clearUser());
        showMessage(error.message);
      }
    }

    if (loading || shouldFetch) {
      loadUser();
    }

  }, [shouldFetch, user]);

  useEffect(() => {
    if (!user?.id) return;
    socket.emit("user-online", user.id);
    const onOnlineUsers = (users) => dispatch(setOnlineUsers(users));
    const onReceiveMessage = (payload) => {
      dispatch(setIncomingMessage(payload));
      if (payload?.chat) {
        dispatch(updateChatPreview({ chat: payload.chat }));
      }
    };
    const onMessageDelivered = ({ chatId, messageId }) => {
      dispatch(updateMessageDelivery({ chatId, messageId, isDelivered: true }));
    };
    const onMessagesRead = ({ chatId }) => {
      dispatch(setMessagesReadInChat({ chatId, userId: user.id }));
    };
    socket.on("update-online-users", onOnlineUsers);
    socket.on("receive-message", onReceiveMessage);
    socket.on("message-delivered", onMessageDelivered);
    socket.on("messages-read", onMessagesRead);
    return () => {
      socket.off("update-online-users", onOnlineUsers);
      socket.off("receive-message", onReceiveMessage);
      socket.off("message-delivered", onMessageDelivered);
      socket.off("messages-read", onMessagesRead);
      socket.disconnect();
    };
  }, [user?.id, dispatch]);
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img
        src="/icons/darul-quran-logo.png"
        alt="Darul Quran"
        className=" w-36 h-36"
      />
      <Spinner size="lg" variant="dots" labelColor="success" color="success" />
    </div>
  );



  return (
    <HeroUIProvider>
      <ErrorBoundary>
        <ToastProvider position="top-bottom" />
        <DownloadModal />


        <Routes>
          {/* ---------- Auth/Public Layout (NO HEADER/SIDEBAR) ---------- */}
          <Route element={<AuthLayout isAuthenticated={!isAuthenticated} redirect={''} />}>
            <Route
              path="/"
              element={
                <Login />
              }
            />
            <Route
              path="/auth/forget-password"
              element={
                <ForgetPassword />
              }
            />
            <Route
              path="/auth/change-password"
              element={
                <ChangePassword />
              }
            />
          </Route>
          {/* --- ----- Admin Layout (WITH HEADER/SIDEBAR) -------- */}
          <Route
            path="/no-permissions"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <NoPermissions />
              </ProtectedRoute>
            }
          />
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/" >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CourseManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management/builder"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CourseBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management/attendance"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management/add-user"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management/edit-user/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management/users-details/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/class-scheduling"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Scheduling />
                  <LiveSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance-list"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAttendanceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance-list/:studentId"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAttendanceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Announcements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <PaymentsRefunds />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <SupportTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/help/reviews"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Review />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/faqs"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Faqs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/messages/:chatId?"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/chat"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <TeacherAndStudentChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reschedule-requests"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <RescheduleRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* <Route element={<ChatLayout />}>
          </Route> */}
          {/* teachers routes -------------*/}
          <Route element={<TeachersLayout />}>
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <TeachersDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/upload-material"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <UploadMaterial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/student-attendance"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance-list"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAttendanceList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance-list/:studentId"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAttendanceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/class-scheduling"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <TeacherClassSheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/class-scheduling/manage"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CreaterOrUpdateSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/chat/:chatId?"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/support-tickets"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <SupportTicketsTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/announcements"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <TeacherAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/reschedule-requests"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <RescheduleRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/notifications"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route element={<StudentLayout />}>

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-learning"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/class-scheduling"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentClassSheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-courses"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <BrowseCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-courses/course-details/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course/:id/learn"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/help/messages/:chatId?"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <PaymentsInvoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/enroll-success"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <EnrollSuccess />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/student/attendance-list"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <AttendanceList />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/student/support-tickets"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <SupportTicketsStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/announcements"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/reschedule-requests"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <StudentRescheduleRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </ErrorBoundary>
    </HeroUIProvider >
  );
}

export default App;

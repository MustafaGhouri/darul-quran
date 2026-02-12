import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  HeroUIProvider,
} from "@heroui/react";
import { lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import TeachersLayout from "./components/layouts/Teacherslayout";
import TeachersDashboard from "./pages/teacher/TeachersDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyCourses from "./pages/teacher/my-courses";
import UploadMaterial from "./pages/teacher/my-courses/uploadmaterial";
import StudentAttendance from "./pages/teacher/student-attendance";
import ClassSheduling from "./pages/teacher/class-sheduling";
import SheduleClass from "./pages/teacher/class-sheduling/shedule-class";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyLearning from "./pages/student/my-learning-joureny";
import StudentClassSheduling from "./pages/student/class-sheduling";
import ClassSchedule from "./pages/student/ClassSchedule";
import BrowseCourses from "./pages/student/browse-courses";
import PaymentsInvoices from "./pages/student/payments-invoices";
import CourseDetails from "./pages/student/browse-courses/course-details";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import DownloadModal from "./components/dashboard-components/DownloadModal";
import AddUser from "./pages/admin/user-management/add-user";
import EditUser from "./pages/admin/user-management/add-user/edituser";
import { showMessage } from "./lib/toast.config";
import { clearUser, setUser } from "./redux/reducers/user";
import Loader from "./components/Loader";
import StudentLayout from "./components/layouts/Studentlayout";

const Home = lazy(() => import("./pages/Home"));
const CourseManagement = lazy(() =>
  import("./pages/admin/course-management/index")
);
const LiveSession = lazy(() =>
  import("./pages/admin/course-management/LiveSession")
);
const Attendance = lazy(() =>
  import("./pages/admin/course-management/Attendance")
);
const UserManagement = lazy(() => import("./pages/admin/user-management"));
const UserDetails = lazy(() =>
  import("./pages/admin/user-management/users-details")
);
const Scheduling = lazy(() => import("./pages/admin/scheduling"));
const Announcements = lazy(() => import("./pages/admin/announcements"));
const PaymentsRefunds = lazy(() => import("./pages/admin/payment-refund"));
const SupportTickets = lazy(() => import("./pages/admin/support-ticket"));
const Analytics = lazy(() => import("./pages/admin/analytics"));

const CourseBuilder = lazy(() =>
  import("./pages/admin/course-management/course-builder")
);

const HelpMessages = lazy(() => import("./pages/admin/help"));
const TeacherAndStudentChat = lazy(() =>
  import("./pages/admin/help/TeacherAndStudent")
);
const Review = lazy(() => import("./pages/admin/help/review"));
const Faqs = lazy(() => import("./pages/admin/help/faqs"));
const EnrollSuccess = lazy(() => import("./pages/student/enroll-success"));
const CoursePlayer = lazy(() => import("./pages/student/course-player"));

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const { user, loading, shouldFetch, isAuthenticated } = useSelector(
    (state) => state?.user
  )
  const subscribeNow = async () => {
    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission denied");
      return;
    }
    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      return outputArray;
    }

    const res = await fetch("http://localhost:5000/api/notifications/vapid-public-key");
    const { publicKey } = await res.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    console.log("FULL SUB:", subscription);
    console.log("ENDPOINT:", subscription.endpoint);
    console.log("P256DH:", subscription.toJSON().keys.p256dh);
    console.log("AUTH:", subscription.toJSON().keys.auth);
  };

  useEffect(() => {
    async function loadUser() {
      try {
        // dispatch(setLoading(true));

        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok && data.user) {
          dispatch(setUser(data.user));
          // redirect ONLY if on auth pages
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
  if (loading) return <Loader />;
  return (
    <HeroUIProvider>
      <Toaster position="top-right" />
      <DownloadModal />
      <button onClick={subscribeNow}>Subscribe</button>

      <Routes>
        {/* ---------- Auth/Public Layout (NO HEADER/FOOTER) ---------- */}
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
            path="/admin/courses-management/live-sessions"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <LiveSession />
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
            path="/admin/user-management/users-details"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scheduling"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <Scheduling />
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
            path="/admin/help/messages"
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
            path="/teacher/courses/course-details"
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
            path="/teacher/class-scheduling"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <ClassSheduling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/class-scheduling/sheduled-class"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <SheduleClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/chat"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/">
                <HelpMessages />
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
                <ClassSchedule />
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
            path="/student/help/messages"
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
        </Route>
      </Routes>
    </HeroUIProvider>
  );
}

export default App;

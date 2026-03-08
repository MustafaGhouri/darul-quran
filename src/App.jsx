import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  HeroUIProvider,
  ToastProvider,
} from "@heroui/react";
import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TeachersLayout from "./components/layouts/Teacherslayout";
import TeachersDashboard from "./pages/teacher/TeachersDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NoPermissions from "./pages/admin/NoPermissions";
import MyCourses from "./pages/teacher/my-courses";
import UploadMaterial from "./pages/teacher/my-courses/uploadmaterial";
import StudentAttendance from "./pages/teacher/student-attendance";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyLearning from "./pages/student/my-learning-joureny";
import StudentClassSheduling from "./pages/student/class-sheduling";
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
import SupportTicketsStudent from "./pages/student/supports-tickets/page";
import SupportTicketsTeacher from "./pages/teacher/supports-tickets/page";
import useDynamicMeta from "./hooks/useDynamicMetadata";
import CourseList from "./pages/teacher/my-courses/CourseList";
import ErrorBoundary from "./components/globalError";
import TeacherClassSheduling from "./pages/teacher/class-sheduling";
import CreaterOrUpdateSchedule from "./pages/teacher/class-sheduling/CreaterOrUpdate";
import StudentAttendanceList from "./pages/teacher/student-attendance-list";
import StudentAttendanceDetails from "./pages/teacher/student-attendance-details";

const Home = lazy(() => import("./pages/Home"));
const CourseManagement = lazy(() =>
  import("./pages/admin/course-management/index")
);
const LiveSession = lazy(() =>
  import("./pages/LiveSession")
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
const TeacherAnnouncements = lazy(() => import("./pages/teacher/announcements"));
const StudentAnnouncements = lazy(() => import("./pages/student/announcements"));
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
const RescheduleRequests = lazy(() => import("./pages/RescheduleRequests"));
const StudentRescheduleRequests = lazy(() => import("./pages/student/RescheduleRequests"));
const Notifications = lazy(() => import("./pages/notifications"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();

  useDynamicMeta({ location });

  const dispatch = useDispatch();

  const { user, loading, shouldFetch, isAuthenticated } = useSelector(
    (state) => state?.user
  )

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();

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
  if (loading) return (<Loader />);

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
              path="/teacher/chat"
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

import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  HeroUIProvider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@heroui/react";
import { lazy, use, useEffect, useState } from "react";
import ChatLayout from "./components/layouts/ChatLayout";
import TeachersLayout from "./components/layouts/Teacherslayout";
import TeachersDashboard from "./pages/teacher/TeachersDashboard";
import MyCourses from "./pages/teacher/my-courses";
import UploadMaterial from "./pages/teacher/my-courses/uploadmaterial";
import StudentAttendance from "./pages/teacher/student-attendance";
import ClassSheduling from "./pages/teacher/class-sheduling";
import SheduleClass from "./pages/teacher/class-sheduling/shedule-class";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyLearning from "./pages/student/my-learning-joureny";
import StudentClassSheduling from "./pages/student/class-sheduling";
import BrowseCourses from "./pages/student/browse-courses";
import PaymentsInvoices from "./pages/student/payments-invoices";
import CourseDetails from "./pages/student/browse-courses/course-details";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
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
const Adduser = lazy(() => import("./pages/admin/user-management/add-user"));
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

function App() {
  const appearButton = window.location.pathname === "/";
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop auto prompt
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;
    console.log(result.outcome); // accepted / dismissed

    setInstallPrompt(null);
  };
  const btnvisibility = window.location.pathname === "/";
  return (
    <HeroUIProvider>

      {/* {btnvisibility && installPrompt && (
        <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "transparent",
          color: "transparent",
          padding: "12px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 1000,
        }}>
        <Button
          variant="solid"
          size="md"
          radius="sm"
          className="bg-[#06574c] text-white md:ml-3 max-sm:w-40"
          onPress={handleInstall}
        >
          Download App
        </Button>
      </div>
      )} */}
      <BrowserRouter>
        <Routes>
          {/* ---------- Auth Layout (NO HEADER/FOOTER) ---------- */}
          <Route element={<AuthLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  publicOnly
                  isAuthenticated={false}
                  redirect="/dashboard"
                >
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/forget-password"
              element={
                <ProtectedRoute
                  publicOnly
                  isAuthenticated={false}
                  redirect="/dashboard"
                >
                  <ForgetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/change-password"
              element={
                <ProtectedRoute
                  publicOnly
                  isAuthenticated={false}
                  redirect="/dashboard"
                >
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  publicOnly
                  isAuthenticated={false}
                  redirect="/dashboard"
                >
                  <Home />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* --- ----- Admin Layout (WITH HEADER/SIDEBAR) -------- */}
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <CourseManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management/builder"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <CourseBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management/live-sessions"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <LiveSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses-management/attendance"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management/add-user"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Adduser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management/users-details"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scheduling"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Scheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Announcements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <PaymentsRefunds />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <SupportTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/help/reviews"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Review />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/faqs"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <Faqs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/messages"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help/chat"
              element={
                <ProtectedRoute isAuthenticated={true}>
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
                <ProtectedRoute isAuthenticated={true}>
                  <TeachersDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route element={<TeachersLayout />}>
            <Route
              path="/teacher/courses/course-details"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/upload-material"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <UploadMaterial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/student-attendance"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/class-scheduling"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <ClassSheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/class-scheduling/sheduled-class"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <SheduleClass />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/chat"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-learning"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/class-scheduling"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <StudentClassSheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-courses"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <BrowseCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/browse-courses/course-details"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/help/messages"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <HelpMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <PaymentsInvoices />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;

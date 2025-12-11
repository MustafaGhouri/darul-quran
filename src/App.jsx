import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { lazy } from "react";
import ChatLayout from "./components/layouts/ChatLayout";
import TeachersLayout from "./components/layouts/Teacherslayout";
import TeachersDashboard from "./pages/teacher/TeachersDashboard";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Home = lazy(() => import("./pages/Home"));
const CourseManagement = lazy(() => import("./pages/admin/course-management/index"));
const LiveSession = lazy(() => import("./pages/admin/course-management/LiveSession"));
const Attendance = lazy(() => import("./pages/admin/course-management/Attendance"));
const UserManagement = lazy(() => import("./pages/admin/user-management"));
const Adduser = lazy(() => import("./pages/admin/user-management/add-user"));
const UserDetails = lazy(() => import("./pages/admin/user-management/users-details"));
const Scheduling = lazy(() => import("./pages/admin/scheduling"));
const Announcements = lazy(() => import("./pages/admin/announcements"));
const PaymentsRefunds = lazy(() => import("./pages/admin/payment-refund"));
const SupportTickets = lazy(() => import("./pages/admin/support-ticket"));
const Analytics = lazy(() => import("./pages/admin/analytics"));

const CourseBuilder = lazy(() => import("./pages/admin/course-management/course-builder"));

const HelpMessages = lazy(() => import("./pages/admin/help"));
const TeacherAndStudentChat = lazy(() => import("./pages/admin/help/TeacherAndStudent"));
const Review = lazy(() => import("./pages/admin/help/review"));
const Faqs = lazy(() => import("./pages/admin/help/faqs"));


function App() {
  return (
    <HeroUIProvider>
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
              element={<ProtectedRoute isAuthenticated={true}>
                <CourseBuilder />
              </ProtectedRoute>}
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
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;

import "./App.css";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/auth/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import CourseManagement from "./pages/admin/course-management/index";
import LiveSession from "./pages/admin/course-management/LiveSession";
import Attendance from "./pages/admin/course-management/Attendance";
import UserManagement from "./pages/admin/user-management";
import Adduser from "./pages/admin/user-management/add-user";
import UserDetails from "./pages/admin/user-management/users-details";
import Scheduling from "./pages/admin/scheduling";
import Announcements from "./pages/admin/announcements";
import PaymentsRefunds from "./pages/admin/payment-refund";
import SupportTickets from "./pages/admin/support-ticket";
import Analytics from "./pages/admin/analytics";
import CourseBuilder from "./pages/admin/course-management/course-builder";

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
                <CourseBuilder/>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;

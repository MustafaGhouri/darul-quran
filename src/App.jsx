import './App.css'
import ProtectedRoute from './components/protected-route'
import Login from './pages/auth/login'
import AuthLayout from './components/layouts/AuthLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import AdminLayout from './components/layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Home from './pages/Home'

function App() {

  return (
    <HeroUIProvider>

      <BrowserRouter>
        <Routes>
          {/* ---------- Auth Layout (NO HEADER/FOOTER) ---------- */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <ProtectedRoute publicOnly isAuthenticated={false} redirect="/dashboard">
                  <Login />
                </ProtectedRoute>
              }
            />
             <Route
              path="/"
              element={
                <ProtectedRoute publicOnly isAuthenticated={false} redirect="/dashboard">
                  <Home />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ---------- Main Layout (WITH HEADER/FOOTER) ---------- */}
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAuthenticated={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  )
}

export default App

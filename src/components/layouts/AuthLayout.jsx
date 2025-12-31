import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/auth/me`, {
          credentials: "include", // IMPORTANT for cookies/session
        });
        const { user } = await res.json();

        // Role based redirect
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "student") {
          navigate("/student/dashboard", { replace: true }); 
        } else if (user.role === "teacher") {
          navigate("/teacher/dashboard", { replace: true });
        } 
        else {
          navigate("/dashboard", { replace: true });
        }

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
}
    
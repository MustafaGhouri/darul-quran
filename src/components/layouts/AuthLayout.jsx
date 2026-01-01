import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout({ isAuthenticated }) {

  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
}

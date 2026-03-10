import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { adminMenu } from "../../lib/Menues";

export default function AuthLayout() {
  const { user, loading, isAuthenticated } = useSelector((s) => s?.user);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (isAuthenticated && user) {
    const role = user.role?.toLowerCase();

    switch (role) {
      case "admin":
        let route = '';
        const tabs = adminMenu.filter(
          (tab) => tab.link === "/admin/profile" || user?.permissions?.includes(tab.link)
        );
        if (tabs.length > 0) {
          route = tabs[0].link;
        } else {
          route = "/admin/no-permissions";
        }
        return <Navigate to={route} replace />;
      case "teacher":
        return <Navigate to="/teacher/dashboard" replace />;
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
}
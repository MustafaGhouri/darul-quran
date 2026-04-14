import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard-components/sidebar";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MenuIcon,
  Plus,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import NotificationPopover from "../dashboard-components/NotificationPopover";
import PageSearch from "../dashboard-components/PageSearch";
import LogoutToggule from "../dashboard-components/LogoutToggule";

export default function AdminLayout() {
  const { user, loading } = useSelector((s) => s?.user);

  const { pathname } = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? saved === "true" : true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);
  useEffect(() => {
    if (window.innerWidth < 645) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      // setIsSidebarOpen(true)
    }
  }, [isMobile, window.innerWidth]);

  const shouldHeaderOnRoutes =
    pathname.includes(null) || pathname.includes(null);
  if (loading) return <Loader />;
  if (!user) {
    return <Navigate to={"/"} replace />;
  }
  if (user && user.role?.toLowerCase() !== "admin") {
    let route = "/";
    const role = user.role?.toLowerCase();
    if (role === "admin") {
      route = "/admin/dashboard";
    } else if (role === "teacher") {
      route = "/teacher/dashboard";
    } else if (role === "student") {
      route = "/student/dashboard";
    }
    return <Navigate to={route} replace />;
  }

  const hasPermission =
    pathname.startsWith("/admin/profile") ||
    user?.permissions?.some((permission) => pathname.startsWith(permission));

  if (
    !hasPermission &&
    user?.email !== import.meta.env.VITE_PUBLIC_ADMIN_EMAIL
  ) {
    return <Navigate to="/no-permissions" replace />;
  }

  // const [loggingOut, setLoggingOut] = useState(false);

  //   const handleLogout = async () => {
  //     setLoggingOut(true);
  //     try {
  //       const res = await fetch(
  //         import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/auth/logout`,
  //         {
  //           method: "POST",
  //           credentials: "include",
  //         },
  //       );
  //       const data = await res.json();

  //       if (!res.ok) throw new Error(data?.message || "Logout failed");

  //       successMessage(data?.message || "Logout successful");
  //       dispatch(clearUser());
  //       localStorage.removeItem("token");
  //       // location.href = '/'
  //     } catch (error) {
  //       console.log(error);
  //       errorMessage(error.message);
  //     } finally {
  //       setLoggingOut(false);
  //     }
  //   };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 270 : 0,
          x: isSidebarOpen ? 0 : -270,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="h-full fixed lg:relative overflow-hidden z-40 lg:z-10"
      >
        <Sidebar
          isSidebarOpen={isMobile ? true : isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </motion.aside>

      <div
        className={`flex relative flex-col flex-1 h-full overflow-auto transition-all duration-300 ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"
          }`}
      >
        {shouldHeaderOnRoutes ? (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            type="button"
            className="absolute border-gray-400 border-r border-t border-b z-30 max-md:ml-0  max-md:rounded-l-lg  max-md:h-15 max-md:top-[40px] top-0 cursor-pointer inline-flex items-center justify-center p-1 bg-white rounded-full h-10 w-10 mt-2 ml-2 shadow-lg"
            aria-label="Sidebar Button"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <SidebarClose size={18} />
            ) : (
              <SidebarOpen size={18} />
            )}
          </button>
        ) : (
          <header className="bg-linear-to-r from-[#f7f7f7] via-[#ffffff] to-[#ffffff]  gap-3 flex p-2 justify-between msd:justify-end shadow-sm sticky top-0 z-30">
            {
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="relative cursor-pointer max-sm:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                aria-label="Sidebar Button"
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {isSidebarOpen ? (
                  <SidebarClose size={18} />
                ) : (
                  <SidebarOpen size={18} />
                )}
              </button>
            }
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
              className="relative sm:hidden  cursor-pointer  inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
              aria-label="Mobile Menu Button"
            >
              {isSidebarOpen ? <Plus className="rotate-45" /> : <MenuIcon />}
            </button>
            <div className="flex relative items-center gap-2">

              <PageSearch
              />
              <NotificationPopover />
              <LogoutToggule />
            </div>
          </header>
        )}
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}

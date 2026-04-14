import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  User,
} from "@heroui/react";
import { MdLogout } from "react-icons/md";
import { errorMessage, successMessage } from "../../lib/toast.config";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/reducers/user";
import { useSelector } from "react-redux";
import { adminMenu, studentMenu, teacherMenu } from "../../lib/Menues";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [expandedItems, setExpandedItems] = useState([0, 6]);
  const { pathname } = useLocation();
  const sideBarRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // ===== role detection from pathname =====
  const getRoleFromPath = (pathname) => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/teacher")) return "teacher";
    if (pathname.startsWith("/student")) return "student";
    return "student"; // fallback for dashboard or other student routes
  };
  const role = getRoleFromPath(pathname);

  //removing not allowed links and child links for sub-admin
  const filteredAdminMenu = adminMenu
    .map((tab) => {
      let filteredChildren = [];
      if (tab.children) {
        filteredChildren = tab.children.filter((child) =>
          user?.permissions?.includes(child.link),
        );
      }
      if (
        tab.link === "/admin/profile" ||
        user?.permissions?.includes(tab.link) ||
        filteredChildren.length > 0
      ) {
        return {
          ...tab,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Decide which menu to show based on role
  const finalAdminMenu =
    user?.email === import.meta.env.VITE_PUBLIC_ADMIN_EMAIL
      ? adminMenu
      : filteredAdminMenu;
  const menuItems =
    role === "admin"
      ? finalAdminMenu
      : role === "teacher"
        ? teacherMenu
        : studentMenu;

  // Filter out the Profile item from the main list
  const baseMenuItems = menuItems.filter(item => item.name !== "Profile");
  const profileLink = `/${role}/profile`;
  const isActiveProfile = pathname === profileLink;

  // If a child route is active, auto expand that parent
  useEffect(() => {
    baseMenuItems.forEach((item, idx) => {
      if (item.children?.some((child) => child.link === pathname)) {
        if (!expandedItems.includes(idx))
          setExpandedItems((prev) => [...prev, idx]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // note: menuItems stable in this component; if you move menus out, add them to deps

  const toggleExpand = (index) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
    setIsSidebarOpen(true);
  };
  const handleCloseMobile = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) =>
      e.key === "Escape" && setIsSidebarOpen(!isSidebarOpen);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    let startX = 0;
    const start = (e) => (startX = e.touches[0].clientX);
    const end = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX > 80 && startX - endX > 70) setIsSidebarOpen(false);
      if (startX < 40 && endX - startX > 70) setIsSidebarOpen(true);
    };
    window.addEventListener("touchstart", start);
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        handleCloseMobile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sideBarRef}
      className="w-full z-60 h-full bg-[#1a5850] text-white flex flex-col"
    >
      <div
        className="px-3 py-2 flex justify-center  border-white/10 cursor-pointer border-b"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <img
              src="/icons/logo.png"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              alt="Darul Quran"
              className=" w-24 h-24"
            />
            {/* <div className="flex flex-col gap-0">
              <span className="text-md font-normal leading-5 tracking-wider italic">Darul Quran</span>
              <span className="text-md font-normal leading-5 tracking-wider italic">Lecturer</span>
            </div> */}
          </div>
        ) : (
          <img
            src="/icons/logo-icon.png"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            alt="Darul Quran"
            className=" w-8 h-8"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        <ul className="space-y-1 mx-2">
          {baseMenuItems.map((item, idx) => {
            const isActiveParent =
              pathname.startsWith(item.link) ||
              (item.children &&
                item.children.some((child) => child.link === pathname));

            return (
              <li key={idx}>
                <div
                  className={`
                     relative flex items-center rounded-md justify-between px-6 pgy-3 cursor-pointer transition-all
                     ${isActiveParent ? "text-[#1a5850]" : "text-[#b8d4d0] hover:bg-white/5"}
                   `}
                >
                  <Link
                    to={item.link}
                    onClick={handleCloseMobile}
                    className="flex items-center gap-3 py-3 flex-1 z-10"
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>

                  <div className="flex items-center gap-2 z-10">
                    {item.badge && isSidebarOpen && (
                      <span className="px-2 py-0.5 text-xs bg-[#EBD4C9] text-[#06574C] rounded-full min-w-5 text-center">
                        {item.badge}
                      </span>
                    )}

                    {item.children && isSidebarOpen && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(idx);
                        }}
                        className="p-1 rounded hover:bg-white/10 transition"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${expandedItems.includes(idx) ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isActiveParent && (
                      <motion.span
                        layoutId="active-rail"
                        className="absolute left-0 top-0 h-full w-full bg-[#d9ebe8] rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 28,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {item.children && expandedItems.includes(idx) && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      {item.children.map((child, childIdx) => (
                        <li key={childIdx} className="relative">
                          <span className="absolute rounded-xs border-white/70 -top-4 left-9 w-3 h-9 border-l-2 border-b-2"></span>

                          <Link
                            to={child.link}
                            className={`block pl-14 pr-6 py-2 text-sm transition-colors 
                ${pathname === child.link
                                ? "text-white"
                                : "text-[#b8d4d0] hover:text-white"
                              }
              `}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {/* <div className="py-2 px-2 border-t border-white/10">
        <div
          className={`
            relative flex items-center rounded-md justify-between px-6 py-1 cursor-pointer transition-all
            ${isActiveProfile ? "text-[#1a5850]" : "text-[#b8d4d0] hover:bg-white/5"}
          `}
        >
          <Link
            to={profileLink}
            onClick={handleCloseMobile}
            className="flex items-center gap-3 py-3 flex-1 z-10"
          >
            <span className="w-5 h-5">
              <Settings size={20} />
            </span>
            {isSidebarOpen && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Link>

          <AnimatePresence>
            {isActiveProfile && (
              <motion.span
                layoutId="active-rail"
                className="absolute left-0 top-0 h-full w-full bg-[#d9ebe8] rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 28,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div> */}

    </div>
  );
};

export default Sidebar;

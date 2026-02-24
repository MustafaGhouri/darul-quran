import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronDown,
  DollarSignIcon,
  FileQuestionIcon,
  HomeIcon,
  MegaphoneIcon,
  TicketIcon,
  TicketsIcon,
  UsersIcon,
  Video
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { b } from 'framer-motion/client';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, User } from '@heroui/react';
import { MdLogout } from 'react-icons/md';
import { errorMessage, successMessage } from '../../lib/toast.config';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/reducers/user';
import { useSelector } from "react-redux";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

  const [expandedItems, setExpandedItems] = useState([0, 6]);
  const { pathname } = useLocation();
  const sideBarRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  // ===== role detection from pathname =====
  const getRoleFromPath = (pathname) => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    return 'guest'; // fallback
  };
  const role = getRoleFromPath(pathname);

  // ===== menus for different roles =====
  const adminMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/admin/dashboard', badge: null },
    {
      name: 'Courses Management',
      icon: <BookIcon />,
      link: '/admin/courses-management',
      children: [
        { name: 'Course Builder', link: '/admin/courses-management/builder' },
        { name: 'Live Sessions Schedule', link: '/admin/courses-management/live-sessions' },
        { name: 'Attendance & Progress', link: '/admin/courses-management/attendance' }
      ]
    },
    { name: 'User Management', icon: <UsersIcon />, link: '/admin/user-management' },
    { name: 'Class Scheduling', icon: <CalendarIcon />, link: '/admin/scheduling', badge: 3 },
    { name: 'Reschedule Requests', icon: <CalendarIcon />, link: '/admin/reschedule-requests', badge: 3 },
    { name: 'Announcements', icon: <MegaphoneIcon />, link: '/admin/announcements' },
    { name: 'Payments & Refunds', icon: <DollarSignIcon />, link: '/admin/payments' },
    { name: 'Support Tickets', icon: <TicketIcon />, link: '/admin/tickets' },
    { name: 'Analytics', icon: <ChartBarIcon />, link: '/admin/analytics' },
    {
      name: 'Help and Support',
      icon: <FileQuestionIcon />,
      link: '/admin/help/messages',
      children: [
        { name: 'Message Center', link: '/admin/help/messages' },
        { name: 'Teacher & Student Chat', link: '/admin/help/chat' },
        { name: 'Reviews', link: '/admin/help/reviews' },
        { name: 'FAQs', link: '/admin/help/faqs' }
      ]
    }
  ];

  // Example teacher menu — adjust links & children as needed
  const teacherMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/teacher/dashboard' },
    {
      name: 'My Courses',
      icon: <BookIcon />,
      link: '/teacher/courses/course-details',
      children: [
        { name: 'Course Details View', link: '/teacher/courses/course-details' },
        { name: 'Upload Materials', link: '/teacher/courses/upload-material' }
      ]
    },
    { name: 'Student Attendance', icon: <CalendarIcon />, link: '/teacher/student-attendance' },
    { name: 'Class Schedule', icon: <MegaphoneIcon />, link: '/teacher/class-scheduling', badge: 3 },
    { name: 'Chat Center', icon: <TicketIcon />, link: '/teacher/chat' },
    { name: 'Support Tickets  ', icon: <TicketsIcon />, link: '/teacher/support-tickets' },
    // { name: 'Announcements', icon: <MegaphoneIcon />, link: '/teacher/announcements' },
  ];

  const studentMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/student/dashboard' },
    { name: 'My Learning Journey', icon: <FaChalkboardTeacher />, link: '/student/my-learning' },
    { name: 'Class Schedule', icon: <Video />, link: '/student/class-scheduling' },
    { name: 'Browse Courses', icon: <Video />, link: '/student/browse-courses' },
    {
      name: 'Help and Support',
      icon: <FileQuestionIcon />,
      link: '/student/help/messages',
      children: [
        { name: 'Chat Center', link: '/student/help/messages' },
        { name: 'Payments & Invoices', link: '/student/payments' },
        // { name: 'Reviews', link: '/admin/help/reviews' },
        // { name: 'FAQs', link: '/admin/help/faqs' }
      ]
    },
    { name: 'Support Tickets  ', icon: <TicketsIcon />, link: '/student/support-tickets' },

  ];

  // Decide which menu to show based on role
  const menuItems =
    role === 'admin' ? adminMenu : role === 'teacher' ? teacherMenu : studentMenu;

  // If a child route is active, auto expand that parent
  useEffect(() => {
    menuItems.forEach((item, idx) => {
      if (item.children?.some((child) => child.link === pathname)) {
        if (!expandedItems.includes(idx)) setExpandedItems((prev) => [...prev, idx]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // note: menuItems stable in this component; if you move menus out, add them to deps

  const toggleExpand = (index) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setIsSidebarOpen(true);
  };
  const handleCloseMobile = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && setIsSidebarOpen(!isSidebarOpen);
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    let startX = 0;
    const start = (e) => (startX = e.touches[0].clientX);
    const end = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX > 80 && startX - endX > 70) setIsSidebarOpen(false);
      if (startX < 40 && endX - startX > 70) setIsSidebarOpen(true);
    };
    window.addEventListener('touchstart', start);
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchend', end);
    };
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        handleCloseMobile();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogut = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Logout failed");

      successMessage(data?.message || "Logout successful");
      dispatch(clearUser());
      // location.reload();
    } catch (error) {
      console.log(error);
      errorMessage(error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div ref={sideBarRef} className="w-full z-5 h-full bg-[#1a5850] text-white flex flex-col">
      <div
        className="p-3 sm:p-6 sm: mx-auto border-b border-white/10 cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <img
            src="/icons/logo.png"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            alt="Darul Quran"
            className=" w-36 h-36"
          />
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
          {menuItems.map((item, idx) => {
            const isActiveParent =
              pathname.startsWith(item.link) ||
              (item.children && item.children.some((child) => child.link === pathname));

            return (
              <li key={idx}>
                <div
                  className={`
      relative flex items-center rounded-md justify-between px-6 py-3 cursor-pointer transition-all
      ${isActiveParent ? 'text-[#1a5850]' : 'text-[#b8d4d0] hover:bg-white/5'}
    `}
                >
                  {/* LEFT SIDE - MAIN LINK */}
                  <Link
                    to={item.link}
                    onClick={handleCloseMobile}
                    className="flex items-center gap-3 flex-1 z-10"
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>

                  {/* RIGHT SIDE - BADGE + TOGGLER */}
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

                  {/* Active background animation */}
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

                {/* CHILDREN */}
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

      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <div className="p-4 cursor-pointer border-t border-white/10">
            <div className="flex items-center gap-3 px-2"> <User
              avatarProps={{ src: user?.avatar, alt: "user", size: "md", className: "shrink-0" }}
              name={user?.firstName + " " + user?.lastName}
              classNames={{ description: "text-gray-300 wrap-break-word" }}
              description={user?.email + (user?.role === 'admin' ? (" - " + user?.role) : "")}
            />
              {/*
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-orange-300 flex items-center justify-center text-white font-bold">
                JP
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.firstName}</div>
                <div className="text-xs text-[#b8d4d0] truncate">{user?.email}</div>
              </div> */}
              <ChevronDown className="w-5 h-5 text-[#b8d4d0] shrink-0" />
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
          <DropdownItem
            className="hover:text-white! text-[#323232] hover:bg-[#406C65]!"
            startContent={
              loggingOut ? <Spinner color='success' /> : <span className="w-5">
                <MdLogout size={18} />
              </span>
            }
            onClick={handleLogut}
            disabled={loggingOut}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

    </div>
  );
};

export default Sidebar;

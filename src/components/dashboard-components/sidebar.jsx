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
  UsersIcon,
  Video
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { b } from 'framer-motion/client';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { MdLogout } from 'react-icons/md';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [expandedItems, setExpandedItems] = useState([0, 6]);
  const location = useLocation();
  const sideBarRef = useRef(null);

  // ===== role detection from pathname =====
  const getRoleFromPath = (pathname) => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    return 'guest'; // fallback
  };
  const role = getRoleFromPath(location.pathname);

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
      // link: '/teacher/courses',
      children: [
        { name: 'Course Details View', link: '/teacher/courses/course-details' },
        { name: 'Upload Materials', link: '/teacher/courses/upload-material' }
      ]
    },
    { name: 'Student Attendance', icon: <CalendarIcon />, link: '/teacher/student-attendance' },
    { name: 'Class Scheduling', icon: <MegaphoneIcon />, link: '/teacher/class-scheduling', badge: 3 },
    { name: 'Chat Center', icon: <TicketIcon />, link: '/teacher/chat' },
  ];

  const studentMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/student/dashboard' },
    { name: 'My Learning Journey', icon: <FaChalkboardTeacher />, link: '/student/my-learning' },
    { name: 'Class Scheduling', icon: <Video />, link: '/student/class-scheduling' },
    { name: 'Browse Courses', icon: <Video />, link: '/student/browse-courses' },
    {
      name: 'Help and Support',
      icon: <FileQuestionIcon />,
      children: [
        { name: 'Chat Center', link: '/student/help/messages' },
        { name: 'Payments & Invoices', link: '/student/payments' },
        // { name: 'Reviews', link: '/admin/help/reviews' },
        // { name: 'FAQs', link: '/admin/help/faqs' }
      ]
    }
  ];

  // Decide which menu to show based on role
  const menuItems =
    role === 'admin' ? adminMenu : role === 'teacher' ? teacherMenu : studentMenu;

  // If a child route is active, auto expand that parent
  useEffect(() => {
    menuItems.forEach((item, idx) => {
      if (item.children?.some((child) => child.link === location.pathname)) {
        if (!expandedItems.includes(idx)) setExpandedItems((prev) => [...prev, idx]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // note: menuItems stable in this component; if you move menus out, add them to deps

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
              location.pathname.startsWith(item.link) ||
              (item.children && item.children.some((child) => child.link === location.pathname));

            return (
              <li key={idx}>
                <Link
                  to={item.link}
                  onClick={() => {
                    if (item.children && !expandedItems.includes(idx)) {
                      toggleExpand(idx);
                    }
                    handleCloseMobile();
                  }}
                  className={`
                    relative flex items-center rounded-md justify-between px-6 py-3 cursor-pointer transition-all
                    ${isActiveParent ? 'text-[#1a5850]' : 'text-[#b8d4d0] hover:bg-white/5'}
                  `}
                >
                  <div className="flex z-10 items-center gap-3 flex-1">
                    <span className="w-5 h-5">{item.icon}</span>
                    {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                  </div>

                  {item.badge && isSidebarOpen && (
                    <span className="px-2 z-10 py-0.5 text-xs bg-[#EBD4C9] text-[#06574C] rounded-full min-w-5 text-center">
                      {item.badge}
                    </span>
                  )}
                  <AnimatePresence>
                    {isActiveParent && (
                      <motion.span
                        layoutId="active-rail"
                        className="absolute left-0  top-0 h-full w-full bg-[#d9ebe8] rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 28
                        }}
                      />
                    )}
                  </AnimatePresence>
                </Link>

                <AnimatePresence>
                  {item.children && expandedItems.includes(idx) && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
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
                              ${location.pathname === child.link ? 'text-white' : 'text-[#b8d4d0] hover:text-white'}
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
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-orange-300 flex items-center justify-center text-white font-bold">
                JP
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">Jenny Patron</div>
                <div className="text-xs text-[#b8d4d0] truncate">jenny@gmail.com</div>
              </div>
              <ChevronDown className="w-5 h-5 text-[#b8d4d0]" />
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
          <DropdownItem
            as={Link}
            to={'/'}
            className="hover:text-white! text-[#323232] hover:bg-[#406C65]!"
            startContent={
              <span className="w-5">
                <MdLogout size={18} />
              </span>
            }
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

    </div>
  );
};

export default Sidebar;

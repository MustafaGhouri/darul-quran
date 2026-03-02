import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard-components/sidebar";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Chip, Input, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { MenuIcon, Plus, Search, SidebarClose, SidebarOpen } from "lucide-react";
import { TbBell } from "react-icons/tb";
import { useSelector } from "react-redux";
import Loader from "../Loader";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "../../redux/api/notifications";

export default function AdminLayout() {
    const { user, loading } = useSelector((s) => s?.user);

    const { pathname } = useLocation()

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? saved === "true" : true;
    });
    const [searchOpen, setSearchOpen] = useState(false);

    const { data: notificationData, isLoading: notificationsLoading } = useGetNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();

    const notifications = notificationData?.data || [];
    const unreadNotifications = notifications.filter(n => !n.is_read);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", isSidebarOpen);
    }, [isSidebarOpen]);
    useEffect(() => {
        if (window.innerWidth < 645) {
            setIsMobile(true)
        } else {
            setIsMobile(false);
            // setIsSidebarOpen(true)
        }
    }, [isMobile, window.innerWidth]);

    const shouldHeaderOnRoutes = pathname.includes("help") || pathname.includes("chat");
    if (loading) return <Loader />;

    if (user && user.role?.toLowerCase() !== "admin") {
        let route = '/';
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

    const hasPermission = user?.permissions?.some(permission =>
        pathname.startsWith(permission)
    );

    if (!hasPermission&&user.email===import.meta.env.VITE_PUBLIC_ADMIN_EMAIL) {
        return <Navigate to="/no-permissions" replace />;
    }

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
                    width: (isSidebarOpen ? 270 : 0),
                    x: (isSidebarOpen ? 0 : -270)
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

                {shouldHeaderOnRoutes ?
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        type="button"
                        className="absolute border-gray-400 border-r border-t border-b z-30 top-0 cursor-pointer inline-flex items-center justify-center p-1 bg-white rounded-full h-10 w-10 mt-2 ml-2 shadow-lg"
                        aria-label="Sidebar Button"
                        title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                    >
                        {isSidebarOpen ? <SidebarClose size={18} /> : <SidebarOpen size={18} />}
                    </button>
                    :
                    <header className="bg-linear-to-r from-[#f7f7f7] via-[#ffffff] to-[#ffffff]  gap-3 flex p-2 justify-between msd:justify-end shadow-sm ">
                        {<button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            type="button"
                            className="relative cursor-pointer max-sm:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                            aria-label="Sidebar Button"
                            title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                        >
                            {isSidebarOpen ? <SidebarClose size={18} /> : <SidebarOpen size={18} />}
                        </button>}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            type="button"
                            className="relative sm:hidden  cursor-pointer  inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                            aria-label="Mobile Menu Button"
                        >
                            {isSidebarOpen ? <Plus className="rotate-45" /> : <MenuIcon />}
                        </button>
                        <div className="flex items-center gap-2">
                            <Popover className="relative">
                                <PopoverTrigger >
                                    <button
                                        type="button"
                                        className="relative inline-flex items-center justify-center p-3 border-[#CBD5E1] border  bg-white rounded-full shadow-sm hover:shadow-md"
                                        aria-label="Notifications"
                                    >
                                        <TbBell size={20} />
                                        {unreadNotifications.length > 0 && (
                                            <span className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#06574C] text-white text-[10px] font-semibold leading-none ring-2 ring-white z-10">
                                                {unreadNotifications.length}
                                            </span>
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                                    <div className="py-3 px-4 flex w-full justify-between items-center bg-gray-50/50">
                                        <h4 className="text-sm font-bold text-gray-800">
                                            Notifications
                                        </h4>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="font-bold bg-[#06574C] text-white"
                                        >
                                            {unreadNotifications.length}
                                        </Chip>
                                    </div>
                                    <div className="py-2 border-t border-gray-100 h-[350px] overflow-y-auto no-scrollbar w-full">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => !notif.is_read && markAsRead({ id: notif.id })}
                                                    className="w-full border-b border-gray-50 last:border-none"
                                                >
                                                    <Link to={notif.url || '#'} className="block w-full p-2 hover:bg-gray-50 transition-colors">
                                                        <div className={`p-3 rounded-lg flex flex-col gap-1 ${!notif.is_read ? 'bg-green-50/50 border-l-4 border-l-[#06574C]' : 'bg-white'}`}>
                                                            <div className="text-sm font-bold text-gray-900 leading-tight wrap-break-word">
                                                                {notif.title}
                                                            </div>
                                                            <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed wrap-break-word">
                                                                {notif.description}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 mt-1 font-medium">
                                                                {new Date(notif.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div className=" py-3 border-t border-gray-100  w-full px-4">
                                        <Button
                                            as={Link}
                                            to="/student/notifications"
                                            variant="bordered"
                                            className="w-full border-[#06574C] text-[#06574C] font-semibold"
                                        >
                                            View all
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="relative flex items-center gap-2">

                                <input
                                    type="search"
                                    placeholder="Search here..."
                                    className={`
                                      absolsute left-0 sm:hidden h-10 px-3 rounded-full border border-gray-300 shadow-sm
                                      transition-all duration-300 ease-in-out bg-white
                                      ${searchOpen ? "w-[70%]  opacity-100" : "w-0 absolute opacity-0 px-0"}
                                    `}
                                />

                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(prev => !prev)}
                                    className="relative sm:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                                    aria-label="Search"
                                >
                                    <Search color="#406C65" size={20} />
                                </button>
                                <Input
                                    endContent={<Search color="#9A9A9A" />}
                                    type="search"
                                    className="max-w-lg max-sm:hidden min-w-sm"
                                    placeholder="Search here..."
                                />
                            </div>

                        </div>
                    </header>}
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </div>
        </main>
    );
}

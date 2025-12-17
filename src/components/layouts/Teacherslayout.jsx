import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard-components/sidebar";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Chip, Input, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { Bell, MenuIcon, Plus, Search, SidebarClose, SidebarOpen } from "lucide-react";
import { TbBell } from "react-icons/tb";

export default function TeachersLayout() {
    const { pathname } = useLocation()

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? saved === "true" : true;
    });
    const [searchOpen, setSearchOpen] = useState(false);

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


        const shouldHeaderOnRoutes = pathname.includes("help")|| pathname.includes("chat");

    return (
        <>
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
                            className="absolute shadow-md border-gray-400 border-r border-t border-b z-30 top-0 cursor-pointer inline-flex items-center justify-center p-1 bg-white rounded-full h-10  w-10 ml-1 mt-1 hover:shadow-md"
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
                                            className="relative inline-flex items-center justify-center p-3 border-[#CBD5E1] border-[1px] bg-white rounded-full shadow-sm hover:shadow-md"
                                            aria-label="Notifications"
                                        >
                                            <TbBell size={20} />
                                            <span className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#06574C] text-white text-[10px] font-semibold leading-none ring-2 ring-white z-10">
                                                3
                                            </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="absosht-0 mt-3 w-56 sm:w-80 bg-white rounded-xl shadow-lg ring-opacity-5 z-20">
                                        <div className=" py-3 px-2  flex w-full  justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    Notifications
                                                </h4>
                                            </div>
                                            <div className="flex justify-between ml-2">
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    className="font-bold bg-[#06574C] text-white"
                                                >
                                                    3  {/* {unreadNotifications.length} */}
                                                </Chip>
                                            </div>
                                        </div>
                                        <div className=" py-2 border-t border-gray-100 h-[300px] overflow-scroll no-scrollbar">
                                            <div>
                                                <div>
                                                    <Link to={'#'} className="block w-full">
                                                        <div className="flex items-center gap-4 py-3 justify-center w-full cursor-pointer">
                                                            <div className="flex items-center gap-3 shadow-md hover:bg-gray-100 p-3 rounded-lg w-[95%] transition-colors">
                                                                <div className="flex flex-col px-2">
                                                                    <div className="text-sm font-semibold">
                                                                        anything
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        anything  anything anything anything anythin ganything anything
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" py-3 border-t border-gray-100  w-full px-4">
                                            <Button
                                                variant="bordered"
                                                // color="success"
                                                className="w-full border-[#06574C]"
                                                onPress={() => {
                                                    // router.push("/admin/notifications-center");
                                                }}
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
                    <Suspense fallback={
                        <div className="h-screen flex items-center justify-center">
                            <Spinner size="lg" label="Loading..." labelColor="success" color="success" />
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </>
    );
}

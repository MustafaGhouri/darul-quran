import { Link, Outlet } from "react-router-dom";
import Sidebar from "../dashboard-components/sidebar";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Chip, Input, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Bell, ChevronRight, MenuIcon, Plus, Search, SidebarClose, SidebarOpen } from "lucide-react";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (window.innerWidth < 645) {
            setIsMobile(true)
        } else {
            setIsMobile(false);
            setIsSidebarOpen(true)
        }
    }, [isMobile, window.innerWidth])
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
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

                    <header className="bg-linear-to-r from-[#f7f7f7] via-[#ffffff] to-[#ffffff]  gap-3 flex p-2 justify-between msd:justify-end shadow-sm ">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            type="button"
                            className="relative cursor-pointer max-sm:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                            aria-label="Sidebar Button"
                            title={isSidebarOpen ?'Close Sidebar' : 'Open Sidebar'}
                        >
                            {isSidebarOpen ? <SidebarClose size={18}/> : <SidebarOpen size={18}/>}
                        </button>
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
                                        className="relative inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                                        aria-label="Notifications"
                                    >
                                        <Bell color="#406C65" size={20} />
                                        <span className="pointer-events-none absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#ebd4c9] text-[#406C65] text-[10px] font-semibold leading-none ring-2 ring-white z-10">
                                            3
                                        </span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="absosht-0 mt-3 w-[320px] bg-white rounded-xl shadow-lg ring-opacity-5 z-20">
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
                                                className="bg-[#ebd4c9] text-[#406C65] font-bold"
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
                            <button
                                // onClick={() => dispatch(getAllNotifications())}
                                type="button"
                                className="relative sm:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
                                aria-label="Notifications"
                            >
                                <Search color="#406C65" size={20} />
                            </button>
                            <Input endContent={<Search color="#9A9A9A" />} type="search" className="max-w-lg max-sm:hidden min-w-sm" placeholder="Search here..." />
                        </div>
                    </header>
                    <Outlet />
                </div>
            </main>
        </>
    );
}

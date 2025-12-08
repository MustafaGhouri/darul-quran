import { Link, Outlet } from "react-router-dom";
import Sidebar from "../dashboard-components/sidebar";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Spinner } from "@heroui/react";
import { SidebarClose, SidebarOpen } from "lucide-react";

export default function ChatLayout() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? saved === "true" : true; 
    });

    useEffect(() => {
        localStorage.setItem("sidebarOpen", isSidebarOpen);
    }, [isSidebarOpen]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (window.innerWidth < 645) {
            setIsMobile(true)
        } else {
            setIsMobile(false);
            // setIsSidebarOpen(true)
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
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        type="button"
                        className="absolute z-30 top-0 cursor-pointer inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                        aria-label="Sidebar Button"
                        title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                    >
                        {isSidebarOpen ? <SidebarClose size={14} /> : <SidebarOpen size={14} />}
                    </button>
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

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, User } from "@heroui/react";
import { ChevronDown, Settings } from "lucide-react";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { errorMessage, successMessage } from "../../lib/toast.config";
import { clearUser } from "../../redux/reducers/user";

export default function LogoutToggule() {
    const { user } = useSelector((s) => s?.user);
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const [loggingOut, setLoggingOut] = useState(false);

    const getRoleFromPath = (pathname) => {
        if (pathname.startsWith("/admin")) return "admin";
        if (pathname.startsWith("/teacher")) return "teacher";
        if (pathname.startsWith("/student")) return "student";
        return "student"; // fallback for dashboard or other student routes
    };
    const role = getRoleFromPath(pathname);
    const profileLink = `/${role}/profile`;

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            const res = await fetch(
                import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );
            const data = await res.json();

            if (!res.ok) throw new Error(data?.message || "Logout failed");

            successMessage(data?.message || "Logout successful");
            dispatch(clearUser());
            localStorage.removeItem("token");
            // location.href = '/'
        } catch (error) {
            console.log(error);
            errorMessage(error.message);
        } finally {
            setLoggingOut(false);
        }
    };
    return (
        <Dropdown
            showArrow
            className="mx-3 w-full"
            classNames={{
                base: "before:bg-default-200", 
                content:
                    "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
            }}
        >
            <DropdownTrigger className="mx-2 shadow-lg shadow-[#1a5850]/10">
                <div className="px-2 py-1.5 cursor-pointer border rounded-full border-[#1a5850]/10 hover:bg-[#1a5850]/5 transition-colors">
                    <div className="flex items-center gap-1 sm:gap-3 px-1">
                        <User
                            avatarProps={{
                                src: user?.avatar,
                                alt: "user",
                                size: "sm",
                                className: "shrink-0",
                            }}
                            name={user?.firstName + " " + user?.lastName}
                            classNames={{
                                description: "max-sm:hidden text-gray-500 wrap-break-word line-clamp-1 w-32 overflow-hidden",
                                name: "max-sm:hidden text-gray-700 font-semibold wrap-break-word line-clamp-1 w-32 overflow-hidden",
                            }}
                            description={
                                user?.email
                            }
                        />

                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                </div>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User Options"
                variant="faded"
            >
                <DropdownItem
                    key="profile"
                    as={Link}
                    to={profileLink}
                    className="hover:text-white! text-[#323232] hover:bg-[#406C65]!"
                    startContent={
                        <span className="w-5">
                            <Settings size={18} />
                        </span>
                    }
                >
                    Settings
                </DropdownItem>
                <DropdownItem
                    key="logout"
                    className="hover:text-white! text-[#323232] hover:bg-[#406C65]!"
                    startContent={
                        loggingOut ? (
                            <Spinner color="success" size="sm" />
                        ) : (
                            <span className="w-5">
                                <MdLogout size={18} />
                            </span>
                        )
                    }
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
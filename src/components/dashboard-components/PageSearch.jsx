import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { adminMenu, teacherMenu, studentMenu } from "../../lib/Menues";
import { Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react";

// Page descriptions for better search context
const pageDescriptions = {
  // Admin pages
  "/admin/dashboard": "Main admin dashboard with overview and statistics",
  "/admin/courses-management": "Manage all courses, create and edit course details",
  "/admin/courses-management/builder": "Build and design course curriculum",
  "/admin/courses-management/attendance": "Track student attendance and progress",
  "/admin/user-management": "Manage users, roles and permissions",
  "/admin/class-scheduling": "View and manage class schedules",
  "/admin/attendance-list": "Student attendance list and tracking",
  "/admin/payments": "Manage payments, subscriptions and refunds",
  "/admin/analytics": "View analytics and reports",
  "/admin/notifications": "Manage system notifications",
  "/admin/announcements": "Create and manage announcements",
  "/admin/profile": "View and edit your profile",
  "/admin/help/messages": "Message center for communication",
  "/admin/help/chat": "Chat with teachers and students",
  "/admin/tickets": "Manage support tickets",
  "/admin/help/reviews": "View and manage reviews",
  "/admin/faqs": "Manage frequently asked questions",

  // Teacher pages
  "/teacher/dashboard": "Teacher dashboard with overview",
  "/teacher/courses": "View and manage your assigned courses",
  "/teacher/courses/upload-material": "Upload course materials and resources",
  "/teacher/student-attendance": "Progress Overview, Track student Course progress",
  "/teacher/attendance-list": "Student attendance overview",
  "/teacher/class-scheduling": "View your class schedule",
  "/teacher/chat": "Chat center for communication",
  "/teacher/announcements": "View announcements",
  "/teacher/notifications": "View notifications",
  "/teacher/support-tickets": "Manage support tickets",
  "/teacher/faqs": "View frequently asked questions",
  "/teacher/profile": "View and edit your profile",

  // Student pages
  "/student/dashboard": "Student dashboard with overview",
  "/student/class-scheduling": "View and schedule classes",
  "/student/reschedule-requests": "Manage your reschedule requests",
  "/student/browse-courses": "Browse and explore available courses",
  "/student/payments": "Manage payments and subscriptions",
  "/student/notifications": "View notifications",
  "/student/announcements": "View announcements",
  "/student/help/messages": "Chat center for communication",
  "/student/support-tickets": "Create and view support tickets",
  "/student/faqs": "View frequently asked questions",
  "/student/profile": "View and edit your profile",
};

const PageSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  // Detect role from current pathname
  const getRoleFromPath = (pathname) => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/teacher")) return "teacher";
    if (pathname.startsWith("/student")) return "student";
    return "student";
  };

  const role = getRoleFromPath(location.pathname);

  // Get menu based on role
  const baseMenu =
    role === "admin"
      ? adminMenu
      : role === "teacher"
      ? teacherMenu
      : studentMenu;

  // Filter menu items based on permissions (for sub-admin)
  const filteredMenu = useMemo(() => {
    if (role !== "admin") return baseMenu;

    // Super admin gets all pages
    if (user?.email === import.meta.env.VITE_PUBLIC_ADMIN_EMAIL) {
      return baseMenu;
    }

    // Filter based on permissions
    return baseMenu
      .map((tab) => {
        let filteredChildren = [];
        if (tab.children) {
          filteredChildren = tab.children.filter(
            (child) =>
              user?.permissions?.includes(child.link) ||
              user?.permissions?.includes(tab.link)
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
  }, [baseMenu, role, user]);

  // Flatten menu items into searchable list
  const allPages = useMemo(() => {
  const pagesMap = new Map();

  filteredMenu.forEach((item) => {
    // 1. Process Parent
    if (item.link) {
      const parentLink = item.link.trim().replace(/\/$/, "");
      pagesMap.set(parentLink, {
        name: item.name,
        link: item.link,
        description: pageDescriptions[item.link] || "",
        icon: item.icon,
      });
    }

    // 2. Process Children (They will overwrite parents with the same link)
    if (item.children) {
      item.children.forEach((child) => {
        if (child.link) {
          const childLink = child.link.trim().replace(/\/$/, "");
          pagesMap.set(childLink, {
            name: child.name,
            link: child.link,
            description: pageDescriptions[child.link] || "",
            icon: child.icon || item.icon,
          });
        }
      });
    }
  });

  // Convert the Map values (which are now unique and prioritized) back to an array
  return Array.from(pagesMap.values());
}, [filteredMenu]);

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return allPages;

    const query = searchQuery.toLowerCase();
    return allPages.filter(
      (page) =>
        page.name.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query) ||
        page.link.toLowerCase().includes(query)
    );
  }, [searchQuery, allPages]);

  // Handle page selection
  const handleSelectPage = (page) => {
    navigate(page.link);
    setSearchQuery("");
    onClose?.();
  };

  return (
    <Popover
      placement="bottom"
      offset={10}
    >
      <PopoverTrigger>
        <button
          type="button"
          className="relative smd:hidden inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm hover:shadow-md"
          aria-label="Search pages"
        >
          <Search color="#406C65" size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-w-[90vw] p-0">
        <div className="flex flex-col w-full">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <Input
              autoFocus
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={18} color="#9A9A9A" />}
              endContent={
                searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer"
                  >
                    <X size={18} color="#9A9A9A" />
                  </button>
                )
              }
              classNames={{
                input: "text-sm",
                inputWrapper: "h-10",
              }}
            />
          </div>

          {/* Results List */}
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {filteredPages.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No pages found for "{searchQuery}"
              </div>
            ) : (
              <div className="py-2">
                {filteredPages.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPage(page)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-gray-600">
                      {page.icon || <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {page.name}
                      </div>
                      {page.description && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {page.description}
                        </div>
                      )}
                      {/* <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {page.link}
                      </div> */}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              {filteredPages.length} page{filteredPages.length !== 1 ? "s" : ""}{" "}
              available
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PageSearch;

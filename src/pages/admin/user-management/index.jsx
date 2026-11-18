import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Input,
  Tooltip,
  User,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Chip,
} from "@heroui/react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  MessageCircle,
  Plus,
  SquarePen,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { dateFormatter, debounce } from "../../../lib/utils";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { useBulkDeleteUserMutation, useDeleteUserMutation, useGetAllUsersQuery, useSyncUserWithZoomMutation } from "../../../redux/api/user";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector(state => state.user);
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "true", label: "Active" },
    { key: "false", label: "Inactive" },
  ];

  const studentHeader = [
    { key: "User", label: "User" },
    { key: "Class", label: "Schedule" },
    { key: "Teacher", label: "Teacher" },
    { key: "Fees", label: "Fees / Last Paid" },
    { key: "Status", label: "Status" },
    { key: "Date", label: "Join Date" },
    { key: "lastActive", label: "Last Active" },
    { key: "Action", label: "Action", style: "text-center" },
  ];

  const defaultHeader = [
    { key: "User", label: "User" },
    { key: "Role", label: "Role" },
    { key: "Date", label: "Join Date" },
    { key: "lastActive", label: "Last Active" },
    { key: "Status", label: "Status" },
    { key: "Zoom", label: "Zoom" },
    { key: "Action", label: "Action", style: "text-center" },
  ];

  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  const [selectedTab, setSelectedTab] = useState("");
  const router = useNavigate();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(null);
  const { isOpen: isBulkDeleteOpen, onOpen: onBulkDeleteOpen, onClose: onBulkDeleteClose } = useDisclosure();

  const { data, isError, error, isFetching } = useGetAllUsersQuery({ page, limit, status, role, search });
  const [deleteUser] = useDeleteUserMutation()
  const [bulkDeleteUser] = useBulkDeleteUserMutation()
  const [syncUserWithZoom] = useSyncUserWithZoomMutation();

  useEffect(() => {
    if (isError) {
      errorMessage(error.data.error, error.status);
    }
  }, [isError]);

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    onOpen();
  };
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const res = await deleteUser(userToDelete);

      if (res.error) {
        throw new Error("Failed to delete user: " + res.error.message);
      } else {
        successMessage("User deleted successfully!");
        onClose();
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      errorMessage(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    onClose();
  };

  // Sync user with Zoom
  const handleSyncZoom = async (userId, userZoomId, userEmail) => {
    try {
      setIsSyncing(userId);
      const res = await syncUserWithZoom(userId);
      if (res.error) {
        throw new Error(res.error.data.message || res.error.data.error || "Failed to sync with Zoom");
      }
      successMessage(userZoomId ? "Zoom user updated successfully!" : "Zoom user created successfully!");
    } catch (error) {
      console.error("Error syncing with Zoom:", error);
      errorMessage(error.message);
    } finally {
      setIsSyncing(null);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    let selectedIds = [...selectedUsers];
    if (selectedIds.length === 0) {
      errorMessage("No users selected");
      return;
    }
    try {
      setIsDeleting(true);
      const res = await bulkDeleteUser(selectedIds);
      if (res.error) {
        throw new Error("Failed to bulk delete users: " + res.error.message);
      }
      successMessage(`Users deleted successfully!`);
      setSelectedUsers(new Set());
      onBulkDeleteClose();
    } catch (error) {
      console.error("Error bbulk deleting users:", error);
      errorMessage(error?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isSelectionEmpty = (selection) => {
    if (selection === "all") return false;
    return selection.size === 0;
  };

  const getSelectionCount = (selection, total) => {
    if (selection === "all") return total;
    return selection.size;
  };

  const handleExportCSV = () => {
    if (!data?.users || data.users.length === 0) {
      errorMessage("No users to export");
      return;
    }

    const isStudent = role === 'student';

    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Role",
      "Email",
      "Phone Number",
      "City",
      "Country",
      "Status",
      "Join Date",
      "Last Active",
      ...(isStudent
        ? ["Classes", "Teachers", "Fees / Last Paid", "Last Paid Date"]
        : ["Experience (Years)", "Tagline", "Bio"])
    ];

    const csvRows = [headers.join(",")];

    data.users.forEach(user => {
      const baseRow = [
        user.id,
        `"${(user.firstName || "").replace(/"/g, '""')}"`,
        `"${(user.lastName || "").replace(/"/g, '""')}"`,
        `"${(user.role || "").replace(/"/g, '""')}"`,
        `"${(user.email || "").replace(/"/g, '""')}"`,
        `"${(user.phoneNumber || "").replace(/"/g, '""')}"`,
        `"${(user.city || "").replace(/"/g, '""')}"`,
        `"${(user.country || "").replace(/"/g, '""')}"`,
        user.isActive ? "Active" : "Inactive",
        `"${user.createdAt || ""}"`,
        user.lastActive ? `"${user.lastActive}"` : "N/A",
      ];

      if (isStudent) {
        const classesStr = (user.classes || []).map(c => c.title || c.name).join("; ");
        const teachersStr = (user.teachers || []).map(t => t.name).join("; ");
        const feeStatus = user.lastPayment
          ? (user.lastPayment.status === 'free'
              ? 'Free'
              : `${user.lastPayment.amount ? `£${Number(user.lastPayment.amount).toFixed(2)} ` : ''}${user.lastPayment.status || ''}`.trim())
          : 'N/A';
        const feeDate = user.lastPayment?.date ? dateFormatter(user.lastPayment.date) : 'N/A';

        baseRow.push(
          `"${classesStr.replace(/"/g, '""')}"`,
          `"${teachersStr.replace(/"/g, '""')}"`,
          `"${feeStatus.replace(/"/g, '""')}"`,
          `"${feeDate.replace(/"/g, '""')}"`
        );
      } else {
        baseRow.push(
          user.experience_years ?? "N/A",
          `"${(user.tagline || "").replace(/"/g, '""')}"`,
          `"${(user.bio || "").replace(/"/g, '""')}"`
        );
      }

      csvRows.push(baseRow.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `users_${role}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    successMessage("Users exported successfully!");
  };


  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 h-screen max:md:absolute top-0 bottom-0 right-0 left-0 overflow-y-auto pb-5">
      <DashHeading
        title={"Users Management"}
        desc={
          "Manage all users including students, teachers, and support staff"
        }
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2 max-md:w-full">
          <Select
            className="min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            onSelectionChange={(keys) => {
              const keysArray = keys instanceof Set ? Array.from(keys) : Array.isArray(keys) ? keys : [];
              const selectedKey = keysArray[0];

              setStatus(selectedKey)
            }}
            placeholder="Select Status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Input
            type="search"
            placeholder="Search..."
            radius="sm"
            defaultValue={search}
            onChange={(e) =>
              debounce(() => {
                setSearch(e.target.value);
              }, 400)
            }
          />
        </div>
        <div className=" flex gap-3 max-md:flex-wrap max-md:w-full">
          {/* Bulk Delete Button - Shows when users are selected */}
          {(!isSelectionEmpty(selectedUsers)) && (
            <Button
              radius="sm"
              startContent={<Trash2 color="white" size={15} />}
              className="bg-red-600 text-white py-4 px-3 sm:px-8 max-md:w-full"
              onPress={onBulkDeleteOpen}
            >
              Delete Selected ({
                getSelectionCount(selectedUsers, data?.total)
              })
            </Button>
          )}
          <Button
            variant="bordered"
            radius="sm"
            startContent={<Plus color="#06574C" size={15} />}
            className="border-[#06574C] text-[#06574C] py-4 px-3 sm:px-8 max-md:w-full"
            onPress={handleExportCSV}
          >
            Export
          </Button>
          <Button
            radius="sm"
            as={Link}
            to={"/admin/user-management/add-user"}
            startContent={<Plus color="white" size={15} />}
            className="bg-[#06574C] text-white py-4 px-3 sm:px-8 max-md:w-full"
          //   onPress={()=>{router.push("/admin/user-management/add-user")}}
          >
            Add User
          </Button>
        </div>
      </div>
      <div>
        <div className=" ">
          <Tabs aria-label="Tabs colors" radius="full"
            defaultSelectedKey={role}
            className="flex"
          >
            <Tab
              key="student"
              onClick={() => { setRole('student'); setSearchParams({ role: 'student' }); setSelectedUsers(new Set()); }}
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Students</span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {data?.meta?.countsByRole?.find((count) => count.role === 'student')?.count || 0}
                  </Chip>
                </div>
              }
            >
            </Tab>
            <Tab
              key="teacher"
              onClick={() => { setRole('teacher'); setSearchParams({ role: 'teacher' }); setSelectedUsers(new Set()); }}
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Teachers</span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {data?.meta?.countsByRole?.find((count) => count.role === 'teacher')?.count || 0}
                  </Chip>
                </div>
              }
            >
            </Tab>
            <Tab
              key="admin"
              onClick={() => { setRole('admin'); setSearchParams({ role: 'admin' }); setSelectedUsers(new Set()); }}
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Admins </span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {data?.meta?.countsByRole?.find((count) => count.role === 'admin')?.count || 0}
                  </Chip>
                </div>
              }
            >
            </Tab>
          </Tabs>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Table
                align="start"
                isHeaderSticky
                selectionMode={data?.total > 0 ? "multiple" : undefined}
                selectedKeys={selectedUsers}
                onSelectionChange={setSelectedUsers}
                aria-label="Pending approvals table"
                removeWrapper
                classNames={{
                  base: "w-full bg-white my-3 rounded-lg overflow-x-scroll w-full no-scrollbar  min-h-[50vh]",
                  th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-white",
                  tbody: "overflow-y-scroll no-scrollbar",
                  td: "py-3 items-center whitespace-nowrap truncate",
                  tr: "border-b border-default-200 ",
                }}
              >
                <TableHeader>
                  {(role === 'student' ? studentHeader : defaultHeader).map((item) => (
                    <TableColumn className={item.style} key={item.key}>{item.label}</TableColumn>
                  ))}
                </TableHeader>

                <TableBody
                  emptyContent={<p className="text-center py-4 h-[calc(100vh-350px)]">
                    No {role} Users Found.
                  </p>}
                  items={data?.users || []}
                  loadingState={isFetching ? 'loading' : 'idle'}
                  loadingContent={<Spinner color="success" />}>
                  {(classItem) =>
                    role === 'student' ? (
                      <TableRow key={classItem.id}>
                        {/* 1. User */}
                        <TableCell className="px-4">
                          <User
                            avatarProps={{
                              src: classItem.avatar,
                              size: "md",
                              className: "shrink-0"
                            }}
                            name={`${classItem.firstName || ""} ${classItem.lastName || ""}`.trim() || "User"}
                            description={classItem.email}
                            classNames={{
                              name: "font-medium text-gray-900",
                              description: "text-xs text-gray-500 mt-0.5 truncate",
                            }}
                          />
                        </TableCell>

                        {/* 2. Schedule */}
                        <TableCell className="max-w-[220px]">
                          {(!classItem.classes || classItem.classes.length === 0) ? (
                            <span className="text-xs text-gray-400 italic">No schedule</span>
                          ) : classItem.classes.length === 1 ? (
                            <div className="flex items-center gap-1.5" title={classItem.classes[0].title || classItem.classes[0].name}>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#06574C]/10 text-[#06574C] max-w-[200px] truncate">
                                <BookOpen size={13} className="shrink-0 text-[#06574C]" />
                                <span className="truncate">{classItem.classes[0].title || classItem.classes[0].name}</span>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#06574C]/10 text-[#06574C] max-w-[140px] truncate" title={classItem.classes[0].title || classItem.classes[0].name}>
                                <BookOpen size={13} className="shrink-0 text-[#06574C]" />
                                <span className="truncate">{classItem.classes[0].title || classItem.classes[0].name}</span>
                              </span>
                              <Popover placement="bottom-start" showArrow offset={8}>
                                <PopoverTrigger>
                                  <button type="button" className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition">
                                    +{classItem.classes.length - 1}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-3 max-w-[300px]">
                                  <div className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1.5">
                                    Assigned Schedules ({classItem.classes.length})
                                  </div>
                                  <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
                                    {classItem.classes.map((cls, idx) => (
                                      <div key={cls.id || idx} className="flex flex-col gap-0.5 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                        <div className="flex items-center gap-1.5 font-medium">
                                          <BookOpen size={13} className="shrink-0 text-[#06574C]" />
                                          <span className="truncate flex-1">{cls.title || cls.name}</span>
                                        </div>
                                        {cls.teacherName && (
                                          <div className="text-[11px] text-gray-500 pl-4">
                                            Teacher: <span className="font-medium text-gray-700">{cls.teacherName}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </TableCell>

                        {/* 3. Teacher */}
                        <TableCell className="max-w-[200px]">
                          {(!classItem.teachers || classItem.teachers.length === 0) ? (
                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                          ) : classItem.teachers.length === 1 ? (
                            <div className="flex items-center gap-2 max-w-[180px]" title={classItem.teachers[0].name}>
                              <Avatar
                                src={classItem.teachers[0].avatar}
                                name={classItem.teachers[0].name}
                                size="sm"
                                className="w-6 h-6 text-[10px] shrink-0 bg-[#06574C]/20 text-[#06574C]"
                              />
                              <span className="text-xs font-medium text-gray-800 truncate">
                                {classItem.teachers[0].name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1.5 max-w-[130px]" title={classItem.teachers[0].name}>
                                <Avatar
                                  src={classItem.teachers[0].avatar}
                                  name={classItem.teachers[0].name}
                                  size="sm"
                                  className="w-6 h-6 text-[10px] shrink-0 bg-[#06574C]/20 text-[#06574C]"
                                />
                                <span className="text-xs font-medium text-gray-800 truncate">
                                  {classItem.teachers[0].name}
                                </span>
                              </div>
                              <Popover placement="bottom-start" showArrow offset={8}>
                                <PopoverTrigger>
                                  <button type="button" className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition">
                                    +{classItem.teachers.length - 1}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-3 max-w-[280px]">
                                  <div className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1.5">
                                    Assigned Teachers ({classItem.teachers.length})
                                  </div>
                                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                                    {classItem.teachers.map((tch, idx) => (
                                      <div key={tch.id || idx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-1.5 rounded">
                                        <Avatar
                                          src={tch.avatar}
                                          name={tch.name}
                                          size="sm"
                                          className="w-6 h-6 text-[10px] shrink-0 bg-[#06574C]/20 text-[#06574C]"
                                        />
                                        <div className="flex flex-col min-w-0 flex-1">
                                          <span className="font-medium truncate">{tch.name}</span>
                                          {tch.classes && tch.classes.length > 0 && (
                                            <span className="text-[10px] text-gray-400 truncate">
                                              {tch.classes.join(", ")}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </TableCell>

                        {/* 4. Fees / Last Paid */}
                        <TableCell>
                          {classItem.lastPayment ? (
                            <div className="flex flex-col gap-0.5 items-start">
                              {classItem.lastPayment.status === 'free' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  Free
                                </span>
                              ) : classItem.lastPayment.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                  {classItem.lastPayment.amount ? `£${Number(classItem.lastPayment.amount).toFixed(2)} Paid` : "Paid"}
                                </span>
                              ) : classItem.lastPayment.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock size={12} className="text-amber-600 shrink-0" />
                                  {classItem.lastPayment.amount ? `£${Number(classItem.lastPayment.amount).toFixed(2)} Pending` : "Pending"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                                  {classItem.lastPayment.amount ? `£${Number(classItem.lastPayment.amount).toFixed(2)}` : classItem.lastPayment.status}
                                </span>
                              )}
                              {classItem.lastPayment.date && (
                                <span className="text-[11px] text-gray-400">
                                  {dateFormatter(classItem.lastPayment.date)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">---</span>
                          )}
                        </TableCell>

                        {/* 5. Status */}
                        <TableCell>
                          <Button className={`text-sm p-2 rounded-md ${classItem.isActive === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                            {classItem.isActive == true ? "Active" : "Inactive"}
                          </Button>
                        </TableCell>

                        {/* 6. Join Date */}
                        <TableCell>{dateFormatter(classItem.createdAt)}</TableCell>

                        {/* 7. Last Active */}
                        <TableCell>{classItem.lastActive ? dateFormatter(classItem.lastActive, true) : "No Activity"}</TableCell>

                        {/* 8. Action */}
                        <TableCell className="flex gap-2">
                          <Button
                            radius="sm"
                            className="bg-[#06574C] text-white"
                            as={Link}
                            to={`/admin/user-management/users-details/${classItem.id}`}
                          >
                            View Details
                          </Button>
                          {classItem.id !== user?.id && <Button
                            radius="sm"
                            className="bg-[#06574C] text-white font-medium px-4"
                            startContent={<MessageCircle size={16} />}
                            as={Link}
                            to={`/admin/help/messages`}
                            state={{
                              startChatWith: classItem.id,
                              receiverName: [classItem?.firstName, classItem?.lastName].filter(Boolean).join(" ").trim() || "Teacher",
                              receiverRole: "teacher",
                            }} 
                          >
                            Chat
                          </Button>}
                          <Button
                            variant="bordered"
                            radius="sm"
                            className="border-[#06574C]"
                            startContent={
                              <SquarePen size={18} color="#06574C" />
                            }
                            onPress={() => { router(`/admin/user-management/edit-user/${classItem.id}`, { state: classItem }) }}
                          >
                            Edit
                          </Button>
                          {classItem?.email !== import.meta.env.VITE_PUBLIC_ADMIN_EMAIL && <Button
                            radius="sm"
                            className="bg-[#06574C] text-white"
                            startContent={<Trash2 size={18} color="white" />}
                            onPress={() => openDeleteModal(classItem.id)}
                          >
                            Delete
                          </Button>}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={classItem.id}>
                        {/* 1. User */}
                        <TableCell className="px-4">
                          <User
                            avatarProps={{
                              src: classItem.avatar,
                              size: "md",
                              className: "shrink-0"
                            }}
                            name={`${classItem.firstName || ""} ${classItem.lastName || ""}`.trim() || "User"}
                            description={classItem.email}
                            classNames={{
                              name: "font-medium text-gray-900",
                              description: "text-xs text-gray-500 mt-0.5 truncate",
                            }}
                          />
                        </TableCell>

                        {/* 2. Role */}
                        <TableCell>
                          <Button className="text-sm p-2 rounded-md bg-[#FBF4EC] text-[#D28E3D]">
                            {classItem.role}
                          </Button>
                        </TableCell>

                        {/* 3. Join Date */}
                        <TableCell>{dateFormatter(classItem.createdAt)}</TableCell>

                        {/* 4. Last Active */}
                        <TableCell>{classItem.lastActive ? dateFormatter(classItem.lastActive, true) : "No Activity"}</TableCell>

                        {/* 5. Status */}
                        <TableCell>
                          <Button className={`text-sm p-2 rounded-md ${classItem.isActive === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                            {classItem.isActive == true ? "Active" : "Inactive"}
                          </Button>
                        </TableCell>

                        {/* 6. Zoom */}
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {(role === 'teacher') ? (
                              <>
                                {classItem.zoomUserId ? (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    className="bg-[#95C4BE33] text-[#06574C]"
                                    startContent={<Video size={14} />}
                                  >
                                    Connected
                                  </Chip>
                                ) : (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    className="bg-gray-200 text-gray-600"
                                  >
                                    Not Synced
                                  </Chip>
                                )}
                                {!classItem.zoomUserId && <Tooltip content="Sync teacher with Zoom">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    className="text-[#06574C] p-0 min-w-auto w-8 h-8"
                                    onPress={() => handleSyncZoom(classItem.id, classItem.zoomUserId, classItem.email)}
                                    isLoading={isSyncing === classItem.id}
                                    isDisabled={classItem.zoomUserId}
                                    title="Sync with Zoom"
                                  >
                                    <Video size={16} />
                                  </Button>
                                </Tooltip>}
                              </>
                            ) : '---'}
                          </div>
                        </TableCell>

                        {/* 7. Action */}
                        <TableCell className="flex gap-2">
                          <Button
                            radius="sm"
                            className="bg-[#06574C] text-white"
                            as={Link}
                            to={`/admin/user-management/users-details/${classItem.id}`}
                          >
                            View Details
                          </Button>
                          {classItem.id !== user?.id && <Button
                            radius="sm"
                            className="bg-[#06574C] text-white font-medium px-4"
                            startContent={<MessageCircle size={16} />}
                            as={Link}
                            to={`/admin/help/messages`}
                            state={{
                              startChatWith: classItem.id,
                              receiverName: [classItem?.firstName, classItem?.lastName].filter(Boolean).join(" ").trim() || "Teacher",
                              receiverRole: "teacher",
                            }} 
                          >
                            Chat
                          </Button>}
                          <Button
                            variant="bordered"
                            radius="sm"
                            className="border-[#06574C]"
                            startContent={
                              <SquarePen size={18} color="#06574C" />
                            }
                            onPress={() => { router(`/admin/user-management/edit-user/${classItem.id}`, { state: classItem }) }}
                          >
                            Edit
                          </Button>
                          {classItem?.email !== import.meta.env.VITE_PUBLIC_ADMIN_EMAIL && <Button
                            radius="sm"
                            className="bg-[#06574C] text-white"
                            startContent={<Trash2 size={18} color="white" />}
                            onPress={() => openDeleteModal(classItem.id)}
                          >
                            Delete
                          </Button>}
                        </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:flex-row  w-full md:justify-between md:items-center mb-3">
        <div className="flex text-sm items-center gap-1">
          <span>Showing</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={[String(data?.limit || 10)]}
            placeholder="1"
            onSelectionChange={(keys) => {
              const keysArray = keys instanceof Set ? Array.from(keys) : Array.isArray(keys) ? keys : [];
              const selectedKey = keysArray[0];

              setLimit(selectedKey)
            }}
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of {data?.total}</span>
        </div>

        <div className="">
          <Pagination
            loop
            showControls
            classNames={{
              cursor: "bg-[#06574C] text-white",
            }}
            initialPage={1}
            page={page}
            onChange={setPage}
            total={data?.totalPages}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={handleCancelDelete} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this user?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={handleCancelDelete}
              isDisabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal isOpen={isBulkDeleteOpen} onClose={onBulkDeleteClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Bulk Delete
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete {
              getSelectionCount(selectedUsers, data?.total)} selected user?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onBulkDeleteClose}
              isDisabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleBulkDelete}
              isLoading={isDeleting}
            >
              Yes, Delete All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div >
  );
};

export default UserManagement;

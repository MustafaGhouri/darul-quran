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
} from "@heroui/react";
import { Chip } from "@heroui/react";
import toast from "react-hot-toast";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  ListFilterPlusIcon,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { dateFormatter } from "../../../lib/utils";
import { errorMessage, showMessage } from "../../../lib/toast.config";

const UserManagement = () => {
  // const [events, setEvents] = useState([
  //   { title: "iOS Workshop", date: "2025-11-02" },
  //   { title: "React Basics", date: "2025-11-06", color: "#f0e68c" },
  //   { title: "Python Basics", date: "2025-11-09", color: "#dcd0ff" },
  //   { title: "Marketing Research", date: "2025-11-14", color: "#90ee90" },
  //   { title: "iOS Workshop", date: "2025-11-18", color: "#ffcccc" },
  //   { title: "JS Workshop", date: "2025-11-18", color: "#ffebcc" },
  //   { title: "React Basics", date: "2025-11-22", color: "#f0e68c" },
  //   { title: "iOS Workshop", date: "2025-11-22", color: "#ffcccc" },
  //   { title: "React Basics", date: "2025-11-28", color: "#f0e68c" },
  //   { title: "iOS Workshop", date: "2025-11-28", color: "#ffcccc" },
  //   { title: "JS Workshop", date: "2025-11-28", color: "#ffebcc" },
  //   { title: "Python Basics", date: "2025-11-28", color: "#dcd0ff" },
  // ]);
  // const classes = [
  //   {
  //     id: 1,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-27",
  //   },
  //   {
  //     id: 2,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-26",
  //   },
  //   {
  //     id: 3,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-17",
  //   },
  //   {
  //     id: 4,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-16",
  //   },
  //   {
  //     id: 5,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-15",
  //   },
  //   {
  //     id: 6,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-12",
  //   },
  //   {
  //     id: 7,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-03",
  //   },
  //   {
  //     id: 8,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-29",
  //   },
  //   {
  //     id: 9,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-22",
  //   },
  // ];
  // const Teachers = [
  //   {
  //     id: 1,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-27",
  //   },
  //   {
  //     id: 2,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-26",
  //   },
  //   {
  //     id: 3,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-17",
  //   },
  //   {
  //     id: 4,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-16",
  //   },
  //   {
  //     id: 5,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-15",
  //   },
  //   {
  //     id: 6,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-12",
  //   },
  //   {
  //     id: 7,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-03",
  //   },
  //   {
  //     id: 8,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-29",
  //   },
  //   {
  //     id: 9,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Teacher",
  //     status: "Active",
  //     date: "2025-11-22",
  //   },
  // ];
  // const Supports_Staff = [
  //   {
  //     id: 1,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-27",
  //   },
  //   {
  //     id: 2,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-26",
  //   },
  //   {
  //     id: 3,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-17",
  //   },
  //   {
  //     id: 4,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-16",
  //   },
  //   {
  //     id: 5,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-15",
  //   },
  //   {
  //     id: 6,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-12",
  //   },
  //   {
  //     id: 7,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-03",
  //   },
  //   {
  //     id: 8,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Support Staff",
  //     status: "Active",
  //     date: "2025-11-29",
  //   },
  //   {
  //     id: 9,
  //     name: "John Davis",
  //     desc: "Advanced JavaScript Course",
  //     last_active: "2 hourse ago",
  //     email: "john.davis@email.com",
  //     roles: "Students",
  //     status: "Active",
  //     date: "2025-11-22",
  //   },
  // ];

  // const studentsss = [
  //   { id: 1, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
  //   { id: 2, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
  //   { id: 3, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
  // ];

  const handleDateClick = (info) => {
    alert("Clicked on date: " + info.dateStr);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "Active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];
  const roles = [
    { key: "all", label: "All Roles" },
    { key: "Teachers", label: "Teachers" },
    { key: "Students", label: "Students" },
  ];

  const filters = [{ key: "all", label: "Filter" }];
  const header = [
    { key: "User", label: "User" },
    { key: "Role", label: "Role" },
    { key: "Date", label: "Join Date" },
    { key: "Status", label: "Status" },
    { key: "Active", label: "Last Active" },
    { key: "Action", label: "Action" },
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
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // States for bulk delete
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedTeachers, setSelectedTeachers] = useState(new Set());
  const [selectedAdmins, setSelectedAdmins] = useState(new Set());
  const { isOpen: isBulkDeleteOpen, onOpen: onBulkDeleteOpen, onClose: onBulkDeleteClose } = useDisclosure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getAllUsers");
        const data = await res.json();

        const teacherData = data.users.filter(u => u.role?.toLowerCase() === "teacher");
        const studentData = data.users.filter(u => u.role?.toLowerCase() === "student");
        const adminData = data.users.filter(u => u.role?.toLowerCase() === "admin");

        setTeachers(teacherData);
        setStudents(studentData);
        setAdmins(adminData);

      } catch (error) {
        console.log(error);
        errorMessage(error.message)
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    onOpen();
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/user/deleteUser/${userToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("User deleted successfully!");
        onClose();
        setUserToDelete(null);
        const response = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getAllUsers");
        const data = await response.json();
        const teacherData = data.users.filter(u => u.role === "Teacher");
        const studentData = data.users.filter(u => u.role === "Student");
        const adminData = data.users.filter(u => u.role === "Admin");
        setTeachers(teacherData);
        setStudents(studentData);
        setAdmins(adminData);
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    onClose();
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    const currentTab = getCurrentTab();
    const selectedIds = Array.from(currentTab.selectedKeys);

    if (selectedIds.length === 0) {
      toast.error("No users selected");
      return;
    }

    try {
      // Delete all selected users
      const deletePromises = selectedIds.map(userId =>
        fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/user/deleteUser/${userId}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(res => res.ok).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} user deleted successfully!`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} user`);
      }

      // Clear selections
      setSelectedStudents(new Set());
      setSelectedTeachers(new Set());
      setSelectedAdmins(new Set());

      onBulkDeleteClose();

      // Refresh user list
      const response = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getAllUsers");
      const data = await response.json();
      const teacherData = data.users.filter(u => u.role === "Teacher");
      const studentData = data.users.filter(u => u.role === "Student");
      const adminData = data.users.filter(u => u.role === "Admin");
      setTeachers(teacherData);
      setStudents(studentData);
      setAdmins(adminData);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("An error occurred while deleting users.");
    }
  };

  // Helper function to get current tab's selected keys
  const getCurrentTab = () => {
    // Determine which tab is active based on selected keys
    if (selectedStudents.size > 0) return { selectedKeys: selectedStudents, type: 'students' };
    if (selectedTeachers.size > 0) return { selectedKeys: selectedTeachers, type: 'teachers' };
    if (selectedAdmins.size > 0) return { selectedKeys: selectedAdmins, type: 'admins' };
    return { selectedKeys: new Set(), type: null };
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
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className="min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select Status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select Role"
          >
            {roles.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            radius="sm"
            className="min-w-[120px]"
            defaultSelectedKeys={["all"]}
            selectorIcon={<ListFilterPlusIcon />}
            placeholder="Select Filter"
          >
            {filters.map((filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className=" flex gap-3 max-md:flex-wrap max-md:w-full">
          {/* Bulk Delete Button - Shows when users are selected */}
          {(selectedStudents.size > 0 || selectedTeachers.size > 0 || selectedAdmins.size > 0) && (
            <Button
              radius="sm"
              startContent={<Trash2 color="white" size={15} />}
              className="bg-red-600 text-white py-4 px-3 sm:px-8 max-md:w-full"
              onPress={onBulkDeleteOpen}
            >
              Delete Selected ({selectedStudents.size + selectedTeachers.size + selectedAdmins.size})
            </Button>
          )}
          <Button
            variant="bordered"
            radius="sm"
            startContent={<Plus color="#06574C" size={15} />}
            className="border-[#06574C] text-[#06574C] py-4 px-3 sm:px-8 max-md:w-full"
          //   onPress={()=>{router.push("/admin/user-management/add-user")}}
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
            className="flex"
          >
            <Tab
              key="Students"
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Students</span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {students.length}
                  </Chip>
                </div>
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab ? selectedTab.label : "empty"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Table
                    isHeaderSticky
                    selectionMode={students.length > 0 ? "multiple" : undefined}
                    selectedKeys={selectedStudents}

                    onSelectionChange={setSelectedStudents}
                    aria-label="Pending approvals table"
                    removeWrapper
                    classNames={{
                      base: "w-full bg-white rounded-lg h-[calc(100vh-350px)] overflow-x-scroll w-full no-scrollbar",
                      th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-white",
                      tbody: "overflow-y-scroll no-scrollbar",
                      td: "py-3 items-center whitespace-nowrap",
                      tr: "border-b border-default-200 ",

                    }}
                  >
                    <TableHeader>
                      {header.map((item) => (
                        <TableColumn key={item.key}>{item.label}</TableColumn>
                      ))}
                    </TableHeader>

                    <TableBody loadingContent={<Spinner color="success"/>} emptyContent={"  No Student Users Found."} loadingState={loading ? 'loading' : 'idle'}>
                      {students?.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell className="px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {classItem.first_name} {classItem.last_name}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {classItem.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button className="text-sm p-2 rounded-md bg-[#FBF4EC] text-[#D28E3D]">
                              {classItem.role}
                            </Button>
                          </TableCell>
                          <TableCell>{dateFormatter(classItem.created_at)}</TableCell>
                          <TableCell>
                            <Button className={`text-sm p-2 rounded-md ${classItem.is_active === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                              {classItem.is_active == true ? "Active" : "Inactive"}
                            </Button>
                          </TableCell>
                          <TableCell>{classItem.last_active ? dateFormatter(classItem.last_active, true) : "N/A"}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="bordered"
                              radius="sm"
                              className="border-[#06574C]"
                              startContent={
                                <SquarePen size={18} color="#06574C" />
                              }
                              onPress={() => { router(`/admin/user-management/edit-user/${classItem.id}`) }}
                            >
                              Edit
                            </Button>
                            <Button
                              radius="sm"
                              className="bg-[#06574C] text-white"
                              startContent={<Trash2 size={18} color="white" />}
                              onPress={() => openDeleteModal(classItem.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) }
                    </TableBody>
                  </Table>
                </motion.div>
              </AnimatePresence>
            </Tab>
            <Tab
              key="Teachers"
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Teachers</span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {teachers.length}
                  </Chip>
                </div>
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab ? selectedTab.label : "empty"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Table
                    isHeaderSticky
                    selectionMode={teachers.length > 0 ? "multiple" : undefined}
                    selectedKeys={selectedTeachers}
                    onSelectionChange={setSelectedTeachers}
                    aria-label="Pending approvals table"
                    removeWrapper
                    classNames={{
                      base: "w-full bg-white rounded-lg h-[calc(100vh-350px)] overflow-x-scroll w-full no-scrollbar",
                      th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-white",
                      tbody: "overflow-y-scroll no-scrollbar",
                      td: "py-3 items-center whitespace-nowrap",
                      tr: "border-b border-default-200 ",
                    }}
                  >
                    <TableHeader>
                      {header.map((item) => (
                        <TableColumn key={item.key}>{item.label}</TableColumn>
                      ))}
                    </TableHeader>

                    <TableBody>
                      {teachers.length > 0 ?
                        teachers.map((classItem) => (
                          <TableRow key={classItem.id}>
                            <TableCell className="px-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {classItem.first_name} {classItem.last_name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {classItem.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button className="text-sm p-2 rounded-md bg-[#FBF4EC] text-[#D28E3D]">
                                {classItem.role}
                              </Button>
                            </TableCell>
                            <TableCell>{dateFormatter(classItem.created_at)}</TableCell>
                            <TableCell>
                              <Button className={`text-sm p-2 rounded-md ${classItem.is_active === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                                {classItem.is_active == true ? "Active" : "Inactive"}
                              </Button>
                            </TableCell>
                            <TableCell>{classItem.last_active ? dateFormatter(classItem.last_active, true) : "N/A"}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="bordered"
                                radius="sm"
                                className="border-[#06574C]"
                                startContent={
                                  <SquarePen size={18} color="#06574C" />
                                }
                                onPress={() => { router(`/admin/user-management/edit-user/${classItem.id}`) }}
                              >
                                Edit
                              </Button>
                              <Button
                                radius="sm"
                                className="bg-[#06574C] text-white"
                                startContent={<Trash2 size={18} color="white" />}
                                onPress={() => openDeleteModal(classItem.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                        : <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 h-[calc(100vh-350px)]">
                            No Teacher Users Found.
                          </TableCell>
                        </TableRow>}
                    </TableBody>
                  </Table>
                </motion.div>
              </AnimatePresence>
            </Tab>
            <Tab
              key="Supports_Staff"
              title={
                <div className="text-[#06574C] flex gap-2 items-center">
                  <span>Admins </span>
                  <Chip
                    size="sm"
                    className="text-xs text-[#06574C] bg-white shadow-md"
                  >
                    {admins.length}
                  </Chip>
                </div>
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab ? selectedTab.label : "empty"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Table
                    //    isHeaderSticky
                    isHeaderSticky
                    selectionMode={admins.length > 0 ? "multiple" : undefined}
                    selectedKeys={selectedAdmins}
                    onSelectionChange={setSelectedAdmins}
                    aria-label="Pending approvals table"
                    removeWrapper
                    classNames={{
                      base: "w-full bg-white rounded-lg h-[calc(100vh-350px)] overflow-x-scroll w-full no-scrollbar",
                      th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-white",
                      tbody: "overflow-y-scroll no-scrollbar",
                      td: "py-3 items-center whitespace-nowrap",
                      tr: "border-b border-default-200 ",
                    }}
                  >
                    <TableHeader>
                      {header.map((item) => (
                        <TableColumn key={item.key}>{item.label}</TableColumn>
                      ))}
                    </TableHeader>

                    <TableBody>
                      {admins.length > 0 ?
                        admins.map((classItem) => (
                          <TableRow key={classItem.id}>
                            <TableCell className="px-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {classItem.first_name} {classItem.last_name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {classItem.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button className="text-sm p-2 rounded-md bg-[#FBF4EC] text-[#D28E3D]">
                                {classItem.role}
                              </Button>
                            </TableCell>
                            <TableCell>{dateFormatter(classItem.created_at)}</TableCell>
                            <TableCell>
                              <Button className={`text-sm p-2 rounded-md ${classItem.is_active === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                                {classItem.is_active == true ? "Active" : "Inactive"}
                              </Button>
                            </TableCell>
                            <TableCell>{classItem.last_active ? dateFormatter(classItem.last_active, true) : "N/A"}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="bordered"
                                radius="sm"
                                className="border-[#06574C]"
                                startContent={
                                  <SquarePen size={18} color="#06574C" />
                                }
                                onPress={() => { router(`/admin/user-management/edit-user/${classItem.id}`) }}
                              >
                                Edit
                              </Button>
                              <Button
                                radius="sm"
                                className="bg-[#06574C] text-white"
                                startContent={<Trash2 size={18} color="white" />}
                                onPress={() => openDeleteModal(classItem.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        )) : <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 h-[calc(100vh-350px)]">
                            No Admin Users Found.
                          </TableCell>
                        </TableRow>}
                    </TableBody>
                  </Table>
                </motion.div>
              </AnimatePresence>
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-col gap-6  md:flex-row  w-full md:justify-between md:items-center mb-3">
        <div className="flex text-sm items-center gap-1">
          <span>Showing</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={["10"]}
            placeholder="1"
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of 58</span>
        </div>

        <div className="">
          <Pagination
            loop
            showControls
            classNames={{
              cursor: "bg-[#06574C] text-white",
            }}
            initialPage={1}
            total={5}
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
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
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
            <p>Are you sure you want to delete {selectedStudents.size + selectedTeachers.size + selectedAdmins.size} selected user?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={onBulkDeleteClose}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleBulkDelete}
            >
              Yes, Delete All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;

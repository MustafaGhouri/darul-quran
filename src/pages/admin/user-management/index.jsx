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
import { useGetAllUsersQuery } from "../../../redux/api/user";

const UserManagement = () => {

  const handleDateClick = (info) => {
    alert("Clicked on date: " + info.dateStr);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "true", label: "Active" },
    { key: "false", label: "Inactive" },
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
  const [role, setRole] = useState('student');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [userToDelete, setUserToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // States for bulk delete
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedTeachers, setSelectedTeachers] = useState(new Set());
  // const [selectedAdmins, setSelectedAdmins] = useState(new Set());
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen: isBulkDeleteOpen, onOpen: onBulkDeleteOpen, onClose: onBulkDeleteClose } = useDisclosure();

  const { data, isError, isFetching } = useGetAllUsersQuery({ page, limit, status, role });

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    onOpen();
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/user/deleteUser/${userToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("User deleted successfully!");
        onClose();
        setUserToDelete(null);
        const response = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getAllUsers");
        const data = await response.json();
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    onClose();
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    let selectedIds = [];

    if (selectedUsers.length) {
      selectedIds = selectedUsers.map(u => u.id);
    }

    if (selectedIds.length === 0) {
      errorMessage("No users selected");
      return;
    }

    try {
      setIsDeleting(true);
      // Delete all selected users via bulk API
      const res = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + `/api/user/bulkDelete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        toast.success(`Users deleted successfully!`);
      } else {
        toast.error(`Failed to delete users`);
      }

      // Clear selections
      setSelectedUsers(new Set());

      onBulkDeleteClose();

      // Refresh user list
      const response = await fetch(import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getAllUsers");
      const data = await response.json();

    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("An error occurred while deleting users.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get current tab's selected keys
  const getCurrentTab = () => {
    if (selectedStudents === "all" || (selectedStudents instanceof Set && selectedStudents.size > 0)) {
      return { selectedKeys: selectedStudents, type: 'students', total: students.length };
    }
    if (selectedTeachers === "all" || (selectedTeachers instanceof Set && selectedTeachers.size > 0)) {
      return { selectedKeys: selectedTeachers, type: 'teachers', total: teachers.length };
    }
    if (selectedAdmins === "all" || (selectedAdmins instanceof Set && selectedAdmins.size > 0)) {
      return { selectedKeys: selectedAdmins, type: 'admins', total: admins.length };
    }
    return { selectedKeys: new Set(), type: null, total: 0 };
  };

  const isSelectionEmpty = (selection) => {
    if (selection === "all") return false;
    return selection.size === 0;
  };

  const getSelectionCount = (selection, total) => {
    if (selection === "all") return total;
    return selection.size;
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
              onClick={() => { setRole('student'); setSelectedUsers(new Set()); }}
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
              key="Teachers"
              onClick={() => { setRole('teacher'); setSelectedUsers(new Set()); }}
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
              key="Supports_Staff"
              onClick={() => { setRole('admin'); setSelectedUsers(new Set()); }}
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
                //    isHeaderSticky
                isHeaderSticky
                selectionMode={data?.total > 0 ? "multiple" : undefined}
                selectedKeys={selectedUsers}
                onSelectionChange={setSelectedUsers}
                aria-label="Pending approvals table"
                removeWrapper
                classNames={{
                  base: "w-full bg-white my-3 rounded-lg h-[calc(100vh-350px)] overflow-x-scroll w-full no-scrollbar",
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

                <TableBody
                  emptyContent={<p className="text-center py-4 h-[calc(100vh-350px)]">
                    No {role} Users Found.
                  </p>}
                  items={data?.users || []}
                  loadingState={isFetching ? 'loading' : 'idle'}
                  loadingContent={<Spinner color="success" />}>
                  {(classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {classItem.firstName} {classItem.lastName}
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
                      <TableCell>{dateFormatter(classItem.createdAt)}</TableCell>
                      <TableCell>
                        <Button className={`text-sm p-2 rounded-md ${classItem.isActive === true ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} `}>
                          {classItem.isActive == true ? "Active" : "Inactive"}
                        </Button>
                      </TableCell>
                      <TableCell>{classItem.lastActive ? dateFormatter(classItem.lastActive, true) : "N/A"}</TableCell>
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
                  )}
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
            setPage={setPage}
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
    </div>
  );
};

export default UserManagement;

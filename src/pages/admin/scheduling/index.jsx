import React, { useState, useEffect } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Calendar, Copy, Edit, Plus, Trash2, Check, ExternalLink, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getStatusColor, getStatusText, formatTime12Hour } from "../../../utils/scheduleHelpers";

const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Pagination & Filtering (Basic Implementation)
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    teacherId: '',
    meetingLink: ''
  });

  useEffect(() => {
    fetchSchedules();
    fetchTeachers();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/getAll`);
      const data = await res.json();
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      toast.error("Failed to load schedules");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/user/getTeachers`);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.teacherId) {
      toast.error("Please fill required fields (Title, Date, Time, Teacher)");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit
        ? `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/update/${formData.id}`
        : `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/create`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(isEdit ? "Session Updated" : "Session Scheduled & Zoom Generated!");
        fetchSchedules();
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/delete/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Session Deleted");
        fetchSchedules();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting session");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      teacherId: '',
      meetingLink: ''
    });
    setIsEdit(false);
  };

  const openCreateModal = () => {
    resetForm();
    onOpen();
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    const dateStr = new Date(item.date).toISOString().split('T')[0];
    setFormData({
      id: item.id,
      title: item.title,
      date: dateStr,
      startTime: item.startTime,
      endTime: item.endTime,
      description: item.description,
      teacherId: item.teacherId ? String(item.teacherId) : '',
      meetingLink: item.meetingLink
    });
    onOpen();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Link Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to determine status
  const getStatus = (item) => {
    if (item.status === 'cancelled') return 'Cancelled';
    const now = new Date();
    const itemDate = new Date(`${item.date.split('T')[0]}T${item.endTime}`); // precise check if passed
    // Fallback simpler check
    const dateOnly = new Date(item.date);
    if (dateOnly < new Date().setHours(0, 0, 0, 0)) return 'Completed';
    return 'Upcoming';
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
  ];

  const filteredSchedules = schedules.filter(s => {
    if (statusFilter === 'all') return true;
    const status = getStatus(s).toLowerCase();
    return status === statusFilter;
  });

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 min-h-screen">
      <DashHeading
        title={"Schedule Live Classes"}
        desc={"Manage and organize your upcoming live sessions"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className="min-w-[150px]"
            radius="sm"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Select status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Button
          startContent={<PlusIcon />}
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white max-md:w-full"
          onPress={openCreateModal}
        >
          Schedule New
        </Button>
      </div>

      <div className="">
        <Table
          removeWrapper
          isHeaderSticky
          aria-label="Example static collection table"
          classNames={{
            base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar max-h-[500px] shadow-md",
            th: "font-bold bg-[#EBD4C9] p-4 text-md text-[#333333] capitalize tracking-widest ",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200",
          }}
        >
          <TableHeader>
            <TableColumn>Details</TableColumn>
            <TableColumn>Teacher</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Zoom Link</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"No sessions scheduled."}>
            {filteredSchedules.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{item.description || 'No description'}</div>
                    <div className="text-xs text-[#06574C] mt-1">{item.courseName || 'General Session'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex-col flex">
                    <span className="font-semibold">{item.teacherName || 'Unassigned'}</span>
                    <span className="text-xs text-gray-500">{item.teacherEmail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{new Date(item.date).toDateString()}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500 text-sm">{formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}</div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="capitalize"
                    color={getStatusColor(item)}
                  >
                    {getStatusText(item)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {item.meetingLink ? (
                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(item.meetingLink, item.id)}>
                      <Copy color="#3F86F2" size={16} />
                      <span className="text-[#3F86F2] hover:underline text-sm">
                        {copiedId === item.id ? "Copied!" : "Copy link"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No Link</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      radius="sm"
                      variant="bordered"
                      className="border-[#06574C] text-[#06574C]"
                      startContent={<Calendar size={18} />}
                      size="sm"
                      onPress={() => openEditModal(item)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      startContent={<Trash2 size={18} />}
                      size="sm"
                      isIconOnly
                      onPress={() => handleDelete(item.id)}
                    >
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Schedule / Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C]">
                {isEdit ? "Reschedule Session" : "Schedule New Session"}
              </ModalHeader>
              <ModalBody>
                {!isEdit && (
                  <p className="text-xs text-gray-500 mb-2">Zoom link and password will be auto-generated upon creation.</p>
                )}
                <Input
                  autoFocus
                  label="Session Title"
                  placeholder="e.g. React Workshop"
                  variant="bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Select
                  label="Assign Teacher"
                  variant="bordered"
                  placeholder="Select a teacher"
                  selectedKeys={formData.teacherId ? [formData.teacherId] : []}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                >
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} textValue={teacher.firstName + ' ' + teacher.lastName}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </SelectItem>
                  ))}
                </Select>

                <div className='flex gap-2'>
                  <Input
                    type="date"
                    label="Date"
                    variant="bordered"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className='flex gap-2'>
                  <Input
                    type="time"
                    label="Start Time"
                    variant="bordered"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                  <Input
                    type="time"
                    label="End Time"
                    variant="bordered"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Description"
                  placeholder="Session details..."
                  variant="bordered"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="bg-[#06574C] text-white" onPress={handleSubmit} isLoading={loading}>
                  {isEdit ? "Update Schedule" : "Schedule & Generate Zoom"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Scheduling;

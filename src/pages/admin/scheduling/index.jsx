import { useEffect, useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Calendar,
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
  CheckboxGroup,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Pagination,
  Image,
  Tooltip,
  Avatar,
} from "@heroui/react";
import { CalendarIcon, Copy, Trash2, PlusIcon, User, Bell } from "lucide-react";

import { getStatusColor, getStatusText, formatTime12Hour } from "../../../utils/scheduleHelpers";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { canReschedule, dateFormatter, debounce, limits, validateSchedule } from "../../../lib/utils";
import TeacherSelect from "../../../components/select/TeacherSelect";
import UserSelect from "../../../components/select/UserSelect";
import ManualEnrollmentModal from "../../../components/modals/ManualEnrollmentModal";
import { useCreateScheduleMutation, useDeleteScheduleMutation, useGetScheduleQuery, useUpdateScheduleMutation } from "../../../redux/api/schedules";
import CourseSelect from "../../../components/select/CourseSelect";
import Swal from "sweetalert2";
import { useGetAllUserForSelectQuery } from "../../../redux/api/user";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApproveRescheduleRequestMutation, useGetRescheduleRequestsQuery, useRejectRescheduleRequestMutation } from "../../../redux/api/reschedule";

const Scheduling = () => {
  const [searchParams] = useSearchParams();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [unenrolledStudents, setUnenrolledStudents] = useState([]);
  const {
    isOpen: isEnrollModalOpen,
    onOpen: onEnrollModalOpen,
    onOpenChange: onEnrollModalChange
  } = useDisclosure();
  const {
    isOpen: isEnrolledUsersModalOpen,
    onOpen: onEnrolledUsersModalOpen,
    onOpenChange: onEnrolledUsersModalChange
  } = useDisclosure();
  const {
    isOpen: isRescheduleModalOpen,
    onOpen: openRescheduleModal,
    onOpenChange: closeRescheduleModal,
  } = useDisclosure();
  const [selectedCourseForEnrolled, setSelectedCourseForEnrolled] = useState(null);

  // Reschedule requests state
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [reschedulePage, setReschedulePage] = useState(1);
  const [rescheduleStatusFilter, setRescheduleStatusFilter] = useState("all");
  const [selectedRescheduleRequest, setSelectedRescheduleRequest] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [actionType, setActionType] = useState(null);

  // Pagination & Filtering (Basic Implementation)
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const isCalenderView = searchParams.get('calender') === 'true';
  const isOpenModalOnLoad = searchParams.get('modal') === 'true';
  const { user } = useSelector(state => state.user)
  // Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [defultTeacher, setdefultTeacher] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacherId: null,
    meetingLink: '',
    courseId: '',
    scheduleType: "daily",
    price: undefined,
    sessionMode: "all", // "one-on-one" or "all"

    // common
    startTime: "",
    endTime: "",

    // once
    date: "",

    // recurring
    startDate: "",
    endDate: "",
    repeatInterval: 1,
    weeklyDays: [],
    specificStudentIds: [],
    // Zoom settings
    settings: {
      join_before_host: false,
      auto_recording: false,
      waiting_room: false,
    },
  });

  const { data, isFetching } = useGetScheduleQuery({
    page: page,
    limit: limit,
    search,
    status: statusFilter
  }, { skip: isCalenderView });
  // Fetch reschedule requests for teacher's classes
  const { data: rescheduleData, isFetching: isRescheduleLoading, refetch: refetchReschedules } = useGetRescheduleRequestsQuery({
    page: reschedulePage.toString(),
    limit: "50",
    status: rescheduleStatusFilter,
    scheduleId: selectedScheduleId,
  }, { skip: !selectedScheduleId });

  const [createSchedule, { isLoading: isSubmitting, isError }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating, isError: isError2 }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isError: isError3 }] = useDeleteScheduleMutation();
  const [approveRequest, { isLoading: isApproving }] = useApproveRescheduleRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRescheduleRequestMutation();
  // console.log(data);
  useEffect(() => {
    if (isOpenModalOnLoad) {
      openCreateModal();
    }
  }, [isOpenModalOnLoad]);

  if (isCalenderView) return null;


  const handleSubmit = async () => {
    // Run comprehensive validation
    const validation = validateSchedule(formData);
    if (!validation.valid) {
      errorMessage(validation.message);
      return;
    }

    if (formData.sessionMode === 'one-on-one') {
      const unenrolled = formData.selectedUsers?.filter(u => !u.enrollmentId);
      if (unenrolled?.length > 0) {
        setUnenrolledStudents(unenrolled);
        onEnrollModalOpen();
        return;
      }
    }

    try {
      let response;
      const payload = {
        ...formData,
        weeklyDays: formData.weeklyDays.map(String)
      }

      if (user?.role === "teacher") {
        payload.teacherId = user.id
      }
      if (isEdit) {
        response = await updateSchedule({ id: formData.id, data: payload });;
      } else {
        response = await createSchedule(payload);
      }

      const data = response.data;

      if (response?.error) {
        throw new Error(response?.error?.data?.message || "Operation failed");
      }
      successMessage(data?.message);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
      errorMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06574C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    if (!isConfirmed) return;
    try {
      setDeleteLoading(id);
      const res = await deleteSchedule(id);
      const error = res?.error?.data;
      if (error) {
        throw new Error(error.message || "Operation failed");
      }
      successMessage(res.data.message || "Course deleted successfully");
    } catch (error) {
      errorMessage("Error deleting session: " + error.message);
    } finally {
      setDeleteLoading(null);
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
      teacherId: null,
      meetingLink: '',
      courseId: '',
      scheduleType: '',
      sessionMode: 'all',
      repeatInterval: 1,
      weeklyDays: [],
      specificStudentIds: [],
      selectedUsers: [],
      settings: {
        join_before_host: false,
        auto_recording: false,
        waiting_room: true,
      },
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
      teacherId: item.teacherId ? item.teacherId : null,
      courseId: item.courseId ? item.courseId : null,
      meetingLink: item.meetingLink,
      scheduleType: item.scheduleType,
      sessionMode: item.specificStudents?.length > 0 ? 'one-on-one' : 'all',
      startDate: item?.startDate?.split("T")[0] || null,
      endDate: item?.endDate?.split("T")[0] || null,
      repeatInterval: item.repeatInterval,
      weeklyDays: item.weeklyDays || [],
      specificStudentIds: item.specificStudents,
      specificStudents: item.specificStudents,
      selectedUsers: [], // Will be populated by UserSelect's internal logic
      settings: {
        join_before_host: item.settings?.join_before_host || false,
        auto_recording: item.settings?.auto_recording || false,
        waiting_room: item.settings?.waiting_room || false,
      },
    });
    onOpen();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    successMessage("Link Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "live", label: "Live" },
  ];

  // Reschedule request handlers
  const handleViewRescheduleRequests = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedRescheduleRequest(null);
    setSelectedScheduleId(schedule?.id);
    setAdminResponse("");
    setIsResponseModalOpen(false);
    openRescheduleModal();
  };

  const handleApproveClick = async (request) => {
    setSelectedRescheduleRequest(request);
    setActionType("approve");
    setAdminResponse(`Your reschedule request has been approved. We will create a separate session for you and notify you with the new schedule details.`);
    setIsResponseModalOpen(true);
  };

  const handleRejectClick = (request) => {
    setSelectedRescheduleRequest(request);
    setActionType("reject");
    setAdminResponse("");
    setIsResponseModalOpen(true);
  };

  const handleSubmitRescheduleResponse = async () => {
    if (!selectedRescheduleRequest) return;

    if (actionType === "reject" && (!adminResponse || adminResponse.trim().length === 0)) {
      errorMessage("Please provide a reason for rejection");
      return;
    }

    try {
      if (actionType === "approve") {
        await approveRequest({
          id: selectedRescheduleRequest.id,
          adminResponse,
        }).unwrap();
        successMessage("Reschedule request approved successfully");
      } else {
        await rejectRequest({
          id: selectedRescheduleRequest.id,
          adminResponse,
        }).unwrap();
        successMessage("Reschedule request rejected");
      }
      setIsResponseModalOpen(false);
      setSelectedRescheduleRequest(null);
      setAdminResponse("");
      refetchReschedules();
    } catch (error) {
      errorMessage(error?.data?.message || "Failed to process request");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
      cancelled: "default",
    };
    return colors[status] || "default";
  };

  const getPendingRequestsCount = (scheduleId) => {
    if (!rescheduleData?.requests) return 0;
    return rescheduleData.requests.filter(
      (req) => req.scheduleId === scheduleId && req.status === "pending"
    ).length;
  };

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 ">
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
          <Input
            type="search"
            placeholder="Search by title or description"
            radius="sm"
            defaultValue={search}
            onChange={(e) =>
              debounce(() => {
                setSearch(e.target.value);
              }, 400)
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to={`/${user.role}/class-scheduling?calender=true`}
            radius="sm"
            size="md"
            startContent={<CalendarIcon color="white" size={15} />}
            color="success"
          >
            Calender View
          </Button>
          <Button
            startContent={<PlusIcon />}
            radius="sm"
            size="md"
            color="success"
            onPress={openCreateModal}
          >
            Schedule New
          </Button>
        </div>
      </div>

      <div className="">
        <Table
          removeWrapper
          isHeaderSticky
          aria-label="Example static collection table"
          classNames={{
            base: "w-full bg-white rounded-lg min-h-[55vh] overflow-x-scroll w-full no-scrollbfar max-sh-[500px] shadow-md",
            th: "font-bold bg-[#EBD4C9] p-4 text-md text-[#333333] capitalize tracking-widest ",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200",
          }}
        >
          <TableHeader>
            {/* <TableColumn>Image</TableColumn> */}
            <TableColumn width={200}>Details</TableColumn>
            <TableColumn width={200}>Teacher</TableColumn>
            <TableColumn width={200}>Dates<small>(Future 30)</small></TableColumn>
            <TableColumn width={200}>Students</TableColumn>
            <TableColumn width={200}>Time</TableColumn>
            <TableColumn width={200}>Schedule Type</TableColumn>
            <TableColumn width={200}>Class Type</TableColumn>
            <TableColumn width={200}>Status</TableColumn>
            <TableColumn width={200}>Zoom Link</TableColumn>
            <TableColumn width={200}>Actions</TableColumn>
          </TableHeader>

          <TableBody loadingContent={<Spinner color="success" />} loadingState={isFetching ? 'loading' : 'idle'} emptyContent={"No sessions scheduled."}>
            {data?.schedules?.map((item) => (
              <TableRow key={item.id}>
                {/* <TableCell>
                  <Image src={item.thumbnail}
                    width={50}
                    height={50}
                    alt={item.courseName}
                    className="rounded-lg" />
                </TableCell> */}
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 max-w-[200px] truncate">{item.title}</div>
                    <div title={item.description || 'No description'} className="text-xs cursor-pointer text-gray-500 mt-0.5 max-w-[200px] truncate"> {item.description || 'No description'}</div>
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
                  <Popover>
                    <PopoverTrigger>
                      <span className="cursor-pointer font-medium">
                        {item.scheduleDates?.length > 1 ? `${dateFormatter(item.scheduleDates[0])} - ${dateFormatter(item?.scheduleDates[item.scheduleDates?.length - 1])}`
                          : dateFormatter(item.scheduleDates[0])
                        }
                      </span>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        size="sm"
                        className="w-full booking-inputs"
                        variant="underlined"
                        color='success'
                        isReadOnly
                        isDateUnavailable={(date) =>
                          item.scheduleDates?.includes(date.toString())
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  {item.students?.length > 0 ? (
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <span className="text-[#06574C] text-sm font-semibold cursor-pointer underline hover:text-[#06574C]/80">
                          {item.students.length} {item.students.length === 1 ? 'Student' : 'Students'}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col gap-2 p-2 min-w-[200px]">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned Students</p>
                          {item.students.map((student, index) => (
                            <div key={index} className="flex flex-col border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                              <span className="font-semibold text-sm text-gray-900">
                                {student.firstName} {student.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {student.email}
                              </span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span
                      className="text-[#06574C] text-sm italic cursor-pointer underline hover:text-[#06574C]/80"
                      onClick={() => {
                        setSelectedCourseForEnrolled(item.courseId);
                        onEnrolledUsersModalOpen();
                      }}
                    >
                      Enrolled Students
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-gray-500 text-sm">{formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}</div>
                </TableCell>
                <TableCell className="text-center">
                  {item.specificStudents?.length > 0 ? 'One-on-one' : 'All'}
                </TableCell>
                <TableCell className="capitalize">
                  {item.scheduleType}
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
                <TableCell className=" ">
                  {item.meetingLink ? (
                    <div className="flex gap-2 items-center cursor-pointer" >
                      <Copy title="Copy Link" color="#3F86F2" size={16} onClick={() => copyToClipboard(item.meetingLink, item.id)} />
                      <a href={item.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#3F86F2] bg-[#3F86F2]/10 py-1 px-2 rounded-md hover:bg-[#3F86F2]/30 text-sm">
                        Join Zoom
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No Link</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip isDisabled={canReschedule(item)} color="success" content="Schedule can only be rescheduled before 4 hours of the start time.">
                      <span className="cursor-pointer">
                        <Button
                          radius="sm"
                          variant="bordered"
                          className="border-[#06574C] text-[#06574C]"
                          // isDisabled={!canReschedule(item)}
                          startContent={<CalendarIcon size={18} />}
                          size="sm"
                          onPress={() => openEditModal(item)}
                        >
                          Reschedule
                        </Button>
                      </span>
                    </Tooltip>
                    <Button
                      radius="sm"
                      size="md"
                      variant="bordered"
                      color="warning"
                      onPress={() => handleViewRescheduleRequests(item)}
                      startContent={
                        <div className="relative">
                          <Bell size={16} />
                          {getPendingRequestsCount(item.id) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                              {getPendingRequestsCount(item.id)}
                            </span>
                          )}
                        </div>
                      }
                    >
                      View Requests
                      {getPendingRequestsCount(item.id) > 0 && (
                        <span className="ml-1">({getPendingRequestsCount(item.id)})</span>
                      )}
                    </Button>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      size="sm"
                      isLoading={deleteLoading === item.id}
                      isIconOnly
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center p-4 gap-2 justify-between overflow-hidden">
          <div className="flex text-sm items-center gap-1">
            <span>Limit</span>
            <Select
              radius="sm"
              className="w-[70px]"
              defaultSelectedKeys={["10"]}
              isDisabled={isFetching || data?.total < 7}
              onSelectionChange={(k) => {
                const keys = [...k];
                setLimit(Number(keys[0]))
              }}
              placeholder="1"
            >
              {limits.map((limit) => (
                <SelectItem key={limit.key}>{limit.label}</SelectItem>
              ))}
            </Select>
            <span className="min-w-56">Out of {data?.total}</span>
          </div>
          <Pagination
            className=""
            showControls
            variant="ghost"
            initialPage={1}
            total={data?.totalPages}
            onChange={setPage}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} placement="center" backdrop="blur" size="lg">
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

                <div className="flex gap-2 mb-4">
                  <Button
                    radius="sm"
                    size="md"
                    color={formData.sessionMode === "all" ? "success" : "default"}
                    variant={formData.sessionMode === "all" ? "solid" : "bordered"}
                    className="w-full"
                    onPress={() => setFormData({ ...formData, sessionMode: "all" })}
                  >
                    For All Enrolled Users
                  </Button>
                  <Button
                    radius="sm"
                    size="md"
                    color={formData.sessionMode === "one-on-one" ? "success" : "default"}
                    className="w-full"
                    variant={formData.sessionMode === "one-on-one" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, sessionMode: "one-on-one" })}
                  >
                    One-on-One Live
                  </Button>
                </div>

                <Input
                  label="Session Title"
                  variant="bordered"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <CourseSelect
                  initialValue={formData.courseId}
                  onSelect={(course) => {
                    setFormData({ ...formData, courseId: course?.id });
                    setdefultTeacher(course?.teacherId)
                  }}
                  status="published"
                  type="live"
                  isDisabled={isEdit}
                />

                <div className="flex gap-2 mb-4">
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "once" ? "success" : "default"}
                    variant={formData.scheduleType === "once" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "once" })}
                  >
                    One Time
                  </Button>
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "daily" ? "success" : "default"}
                    variant={formData.scheduleType === "daily" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "daily" })}
                  >
                    Daily
                  </Button>
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "weekly" ? "success" : "default"}
                    variant={formData.scheduleType === "weekly" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "weekly" })}
                  >
                    Weekly
                  </Button>
                </div>

                {formData.scheduleType === "once" && (
                  <Input
                    type="date"
                    label="Session Date"
                    variant="bordered"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                )}

                {(formData.scheduleType === "daily" || formData.scheduleType === "weekly") && (
                  <>
                    <div className="flex gap-3">
                      <Input
                        type="date"
                        label="Start Date"
                        variant="bordered"
                        value={formData.startDate}
                        isRequired
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        label="End Date (optional)"
                        variant="bordered"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
                {formData.scheduleType === "daily" && (

                  <Input
                    type="number"
                    label="Repeat Every (Days)"
                    variant="bordered"
                    value={formData.repeatInterval}
                    min={1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        repeatInterval: Number(e.target.value),
                      })
                    }
                  />
                )}

                {formData.scheduleType === "weekly" && (
                  <>
                    <Input
                      type="number"
                      label="Repeat Every (Weeks)"
                      min={1}
                      variant="bordered"
                      value={formData.repeatInterval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repeatInterval: Number(e.target.value),
                        })
                      }
                    />

                    <CheckboxGroup
                      label="Select Days"
                      value={formData?.weeklyDays.map(String)}
                      orientation="horizontal"
                      color="success"
                      onChange={(val) =>
                        setFormData({ ...formData, weeklyDays: val })
                      }
                    >
                      <Checkbox value="1">Sunday</Checkbox>
                      <Checkbox value="2">Monday</Checkbox>
                      <Checkbox value="3">Tuesday</Checkbox>
                      <Checkbox value="4">Wednesday</Checkbox>
                      <Checkbox value="5">Thursday</Checkbox>
                      <Checkbox value="6">Friday</Checkbox>
                      <Checkbox value="7">Saturday</Checkbox>
                    </CheckboxGroup>
                  </>
                )}

                <div className="flex gap-3">
                  <Input
                    type="time"
                    label="Start Time"
                    variant="bordered"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                  <Input
                    type="time"
                    label="End Time"
                    variant="bordered"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
                {user?.role !== "teacher" && <TeacherSelect
                  initialValue={formData.teacherId}
                  courseTeacherId={defultTeacher}
                  courseId={formData.courseId}
                  onChange={(teacherId) => setFormData({ ...formData, teacherId })}
                />}
                {formData.sessionMode === "one-on-one" && (
                  <UserSelect
                    courseId={formData.courseId}
                    initialValues={formData?.specificStudentIds}
                    onChange={(ids, users) => setFormData({ ...formData, specificStudentIds: ids, selectedUsers: users })}
                  />
                )}

                <Textarea
                  label="Description"
                  variant="bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <div className="py-3 border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2 text-[#06574C]">Zoom Meeting Settings</h3>
                  <CheckboxGroup
                    orientation="vertical"
                    color="success"
                    value={[
                      ...(formData.settings?.join_before_host ? ['join_before_host'] : []),
                      ...(formData.settings?.auto_recording ? ['auto_recording'] : []),
                      ...(formData.settings?.waiting_room ? ['waiting_room'] : []),
                    ]}
                    onChange={(values) => {
                      setFormData({
                        ...formData,
                        settings: {
                          join_before_host: values?.includes('join_before_host'),
                          auto_recording: values?.includes('auto_recording'),
                          waiting_room: values?.includes('waiting_room'),
                        },
                      });
                    }}
                  >
                    <Tooltip
                      color="success"
                      content={
                        formData.settings?.join_before_host
                          ? 'Unselect "Participants must be admitted by the host before joining." to allow this option'
                          : "Allow students to join before host"
                      }
                      isDisabled={formData.settings?.join_before_host}
                    >
                      <span>
                        <Checkbox
                          isDisabled={formData.settings?.waiting_room}
                          value="join_before_host"
                        >
                          Allow students to join before host
                        </Checkbox>
                      </span>
                    </Tooltip>

                    <Checkbox value="auto_recording">
                      Record session automatically (cloud)
                    </Checkbox>

                    <Tooltip
                      color="success"
                      content={
                        formData.settings?.join_before_host
                          ? 'Unselect "Allow students to join before host" to allow this option'
                          : "Participants must be admitted by the host before joining."
                      }
                      isDisabled={formData.settings?.waiting_room}
                    >
                      <span>
                        <Checkbox
                          isDisabled={formData.settings?.join_before_host}
                          value="waiting_room"
                        >
                          Participants must be admitted by the host before joining.
                        </Checkbox>
                      </span>
                    </Tooltip>
                  </CheckboxGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="bg-[#06574C] text-white" onPress={handleSubmit} isLoading={isSubmitting || isUpdating}>
                  {isEdit ? "Update Schedule" : "Schedule & Generate Zoom"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ManualEnrollmentModal
        isOpen={isEnrollModalOpen}
        onOpenChange={onEnrollModalChange}
        unenrolledStudents={unenrolledStudents}
        courseId={formData.courseId}
        onEnrollmentSuccess={() => {
          // Update selectedUsers to mark them as enrolled
          const updatedUsers = formData.selectedUsers.map(u => ({ ...u, subscriptionId: true }));
          setFormData({ ...formData, selectedUsers: updatedUsers });
          successMessage("Now you can proceed with scheduling");

        }}
      />

      <Modal
        isOpen={isEnrolledUsersModalOpen}
        onOpenChange={onEnrolledUsersModalChange}
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C]">
                Enrolled Students
              </ModalHeader>
              <ModalBody>
                <EnrolledStudentsList courseId={selectedCourseForEnrolled} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Reschedule Requests Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onOpenChange={closeRescheduleModal}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-[#06574C]">
                Reschedule Requests for: {selectedSchedule?.title}
              </h2>
              <p className="text-sm text-gray-600">
                Course: {selectedSchedule?.courseName}
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3 flex justify-between items-center">
              <Select
                label="Filter by Status"
                selectedKeys={[rescheduleStatusFilter]}
                onChange={(e) => {
                  setRescheduleStatusFilter(e.target.value);
                  setReschedulePage(1);
                }}
                className="max-w-xs"
                size="sm"
              >
                <SelectItem key="all" value="all">All Requests</SelectItem>
                <SelectItem key="pending" value="pending">Pending</SelectItem>
                <SelectItem key="approved" value="approved">Approved</SelectItem>
                <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
                <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
              </Select>

              <Button
                size="sm"
                variant="flat"
                onPress={() => refetchReschedules()}
                className="bg-[#06574C] text-white"
              >
                Refresh
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Table
                removeWrapper
                isHeaderSticky
                aria-label="Reschedule Requests Table"
                classNames={{
                  base: "w-full bg-white rounded-lg min-h-[30vh] overflow-x-scroll w-full no-scrollbar max-h-[400px] shadow-md",
                  th: "font-bold bg-[#EBD4C9] p-3 text-sm text-[#333333] capitalize tracking-widest ",
                  td: "py-3 items-center whitespace-nowrap",
                  tr: "border-b border-default-200",
                }}
              >
                <TableHeader>
                  <TableColumn key="student">Student</TableColumn>
                  <TableColumn key="requestedSchedule">Requested Schedule</TableColumn>
                  <TableColumn key="reason">Reason</TableColumn>
                  <TableColumn key="status">Status</TableColumn>
                  <TableColumn key="requestedAt">Requested At</TableColumn>
                  <TableColumn key="actions" align="center">Actions</TableColumn>
                </TableHeader>
                <TableBody
                  loadingContent={<Spinner color="success" />}
                  loadingState={isRescheduleLoading ? 'loading' : 'idle'}
                  emptyContent={
                    <div className="text-center py-10">
                      <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-500 text-lg">No reschedule requests found</p>
                    </div>
                  }
                  items={rescheduleData?.requests?.filter(req => req.scheduleId === selectedSchedule?.id) || []}
                >
                  {(request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{request.studentName}</p>
                          <p className="text-xs text-gray-500">{request.studentEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-[#06574C]">
                            {new Date(request.requestedDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            {formatTime12Hour(request.requestedStartTime)} -{" "}
                            {formatTime12Hour(request.requestedEndTime)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate" title={request.reason}>
                          {request.reason || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={getStatusColor(request.status)}>
                          {request.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onPress={() => handleApproveClick(request)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => handleRejectClick(request)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {request.status !== "pending" && (
                            <Chip size="sm" variant="flat">
                              {request.status}
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {rescheduleData?.totalPages > 1 && (
                <div className="flex justify-center mt-4 p-4">
                  <Pagination
                    total={rescheduleData.totalPages}
                    page={reschedulePage}
                    onChange={setReschedulePage}
                    color="primary"
                    showControls
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => closeRescheduleModal()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reschedule Request Response Modal */}
      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </h2>
          </ModalHeader>
          <ModalBody>
            {selectedRescheduleRequest && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Student:</strong> {selectedRescheduleRequest.studentName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Requested Schedule:</strong> {new Date(selectedRescheduleRequest.requestedDate).toLocaleDateString()}
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Requested Time:</p>
                  <p className="text-sm font-medium">
                    {formatTime12Hour(selectedRescheduleRequest.requestedStartTime)} -{" "}
                    {formatTime12Hour(selectedRescheduleRequest.requestedEndTime)}
                  </p>
                </div>
              </div>
            )}

            <Textarea
              label={actionType === "approve" ? "Approval Message" : "Rejection Reason"}
              placeholder={
                actionType === "approve"
                  ? "Add a message for the student (optional)"
                  : "Please provide a reason for rejection"
              }
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              minRows={4}
              isRequired={actionType === "reject"}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsResponseModalOpen(false)}
              isDisabled={isApproving || isRejecting}
            >
              Cancel
            </Button>
            <Button
              color={actionType === "approve" ? "success" : "danger"}
              onPress={handleSubmitRescheduleResponse}
              isLoading={isApproving || isRejecting}
            >
              {isApproving || isRejecting ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const EnrolledStudentsList = ({ courseId }) => {
  const { data, isFetching } = useGetAllUserForSelectQuery(
    { courseId, enrolledStudents: true, limit: 100, page: 1 },
    { skip: !courseId }
  );

  if (isFetching) return <div className="flex justify-center p-4"><Spinner color="success" /></div>;

  if (!data?.users?.length) return <div className="text-center p-4 text-gray-500 text-sm">No students enrolled in this course yet.</div>;

  return (
    <div className="flex flex-col gap-3">
      {data.users.map((student) => (
        <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
          <Avatar
            name={`${student.firstName || ""} ${student.lastName || ""}`.trim() || undefined}
            src={student.avatar}
            className="w-12 h-12 shrink-0 shadow-lg"
            color="success"
            showFallback
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{student.firstName} {student.lastName}</span>
            <span className="text-xs text-gray-500">{student.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Scheduling;

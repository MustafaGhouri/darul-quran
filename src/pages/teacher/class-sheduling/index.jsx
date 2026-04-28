import { useState, useMemo } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Tabs,
  Tab,
  Textarea,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import {
  Clock,
  Lock,
  Video,
  Calendar as CalendarIcon,
  User,
  MapPin,
  PlusIcon,
} from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import CustomCalendar from "../../../components/teacher/CustomCalendar";
import {
  useGetScheduleQuery,
  useDeleteScheduleMutation,
  useAddScheduleNoteMutation,
} from "../../../redux/api/schedules";
import { useCreateRescheduleRequestMutation, useGetRescheduleRequestsQuery, useApproveRescheduleRequestMutation, useRejectRescheduleRequestMutation } from "../../../redux/api/reschedule";
import { useGetAllCancellationRequestsQuery, useUpdateCancellationRequestStatusMutation } from "../../../redux/api/cancellation";
import { Bell } from "lucide-react";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import {
  formatTime12Hour,
  isClassLive,
  isClassExpired,
  getStatusColor,
  getStatusText,
  getStatusTextForSingleDate,
  getHoursUntilClass,
} from "../../../utils/scheduleHelpers";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { canReschedule, dateFormatter } from "../../../lib/utils";
import QueryError from "../../../components/QueryError";
import { groupAndSortSchedulesByDate } from "../../../utils/scheduleHelpers";
import SchedulesByDateList from "../../../components/schedule/SchedulesByDateList";

const TeacherClassSheduling = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isMarking, setIsMarking] = useState(false);
  const [viewType, setViewType] = useState("normal");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNoteDate, setSelectedNoteDate] = useState(null);
  const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState([]);

  // Reschedule requests state
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [reschedulePage, setReschedulePage] = useState(1);
  const [rescheduleStatusFilter, setRescheduleStatusFilter] = useState("all");
  const [selectedRescheduleRequest, setSelectedRescheduleRequest] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [actionType, setActionType] = useState(null);

  // Cancellation requests state
  const [cancellationPage, setCancellationPage] = useState(1);
  const [cancellationStatusFilter, setCancellationStatusFilter] = useState("all");
  const [selectedCancellationRequest, setSelectedCancellationRequest] = useState(null);
  const [isCancellationResponseModalOpen, setIsCancellationResponseModalOpen] = useState(false);
  const [teacherResponse, setTeacherResponse] = useState("");
  const [cancellationActionType, setCancellationActionType] = useState(null);

  const { onOpenChange, isOpen } = useDisclosure();
  const {
    isOpen: isDateModalOpen,
    onOpen: openDateModal,
    onOpenChange: closeDateModal,
  } = useDisclosure();
  const {
    isOpen: isNoteModalOpen,
    onOpen: openNoteModal,
    onOpenChange: closeNoteModal,
  } = useDisclosure();
  const {
    isOpen: isRescheduleModalOpen,
    onOpen: openRescheduleModal,
    onOpenChange: closeRescheduleModal,
  } = useDisclosure();
  const {
    isOpen: isCancellationModalOpen,
    onOpen: openCancellationModal,
    onOpenChange: closeCancellationModal,
  } = useDisclosure();

  const {
    data: scheduleData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetScheduleQuery({
    page: "1",
    limit: "10",
    status: filterStatus === "all" ? undefined : filterStatus,
  });

  const [deleteSchedule, { isLoading: isCancelling }] =
    useDeleteScheduleMutation();
  const [addScheduleNote, { isLoading: isSavingNote }] =
    useAddScheduleNoteMutation();
  const [noteText, setNoteText] = useState("");

  // Fetch reschedule requests for teacher's classes
  const { data: rescheduleData, isFetching: isRescheduleLoading, refetch: refetchReschedules } = useGetRescheduleRequestsQuery({
    page: reschedulePage.toString(),
    limit: "50",
    status: rescheduleStatusFilter,
    scheduleId: selectedScheduleId,
  }, { skip: !selectedScheduleId });

  const [approveRequest, { isLoading: isApproving }] = useApproveRescheduleRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRescheduleRequestMutation();

  // Fetch cancellation requests for teacher's classes
  const { data: cancellationData, isFetching: isCancellationLoading, refetch: refetchCancellations } = useGetAllCancellationRequestsQuery({
    page: cancellationPage.toString(),
    limit: "50",
    status: cancellationStatusFilter,
    scheduleId: selectedScheduleId,
  }, { skip: !selectedScheduleId });

  const [updateCancellationStatus, { isLoading: isUpdatingCancellation }] = useUpdateCancellationRequestStatusMutation();

  const { user: currentUser } = useSelector((state) => state.user);

  const schedulesDates = useMemo(() => {
    if (!scheduleData?.schedules) return [];
    const grouped = scheduleData?.schedules.flatMap(
      (schedule) => schedule?.scheduleDates,
    );
    return grouped;
  }, [scheduleData]);

  // Helper function to parse date string (supports both YYYY-MM-DD and DD-M-YY formats)
  const parseDateFromDB = (dateStr) => {
    if (!dateStr) return null;

    // Try YYYY-MM-DD format first (from PostgreSQL date array)
    if (dateStr.includes("-") && dateStr.length === 10) {
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Try DD-M-YY format (e.g., "26-2-5")
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      let year = parseInt(parts[2], 10);
      // Handle 2-digit years (assume 20xx for years < 100)
      if (year < 100) year += 2000;
      const parsed = new Date(year, month, day);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Fallback to standard Date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };
  const handleDelete = async (id) => {
    try {
      if (!id) {
        errorMessage("Schedule not selected");
        return;
      }
      const res = await deleteSchedule(id);
      const error = res?.error?.data;
      if (error) {
        throw new Error(error.message || "Operation failed");
      }
      successMessage(res.data.message || "Course deleted successfully");
      onOpenChange(false);
    } catch (error) {
      errorMessage("Error deleting session: " + error.message);
    }
  };
  const schedulesByDate = useMemo(() => {
    return groupAndSortSchedulesByDate(scheduleData?.schedules, filterType);
  }, [scheduleData, filterType]);

  // lookup for calendar and other utilities
  const schedulesByDateAll = schedulesByDate.all;

  const handleCancelClass = (schedule) => {
    setSelectedSchedule(schedule);
    onOpenChange(true);
  };

  const handleAddNote = (schedule, date) => {
    setSelectedSchedule(schedule);
    const noteDate = date;
    setSelectedNoteDate(noteDate);
    setNoteText(schedule?.notes?.[noteDate] || "");
    openNoteModal();
  };

  const handleSaveNote = async () => {
    try {
      if (!selectedSchedule) return;
      if (!selectedSchedule?.scheduleDates?.includes(selectedNoteDate)) { errorMessage("Invalid date selected, The date should exist in the schedule or within 30 days from start date"); return };
      if (!noteText) { errorMessage("Note content is required"); return };
      const res = await addScheduleNote({
        id: selectedSchedule.id,
        note: noteText,
        date: selectedNoteDate,
      });
      if (res.error)
        throw new Error(res.error.data?.message || "Failed to save note");
      successMessage("Note saved successfully");
      closeNoteModal();
      setNoteText("");
    } catch (error) {
      errorMessage(error.message);
    }
  };

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

  // Cancellation request handlers
  const handleViewCancellationRequests = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedCancellationRequest(null);
    setSelectedScheduleId(schedule?.id);
    setTeacherResponse("");
    setIsCancellationResponseModalOpen(false);
    openCancellationModal();
  };

  const handleApproveCancellationClick = async (request) => {
    setSelectedCancellationRequest(request);
    setCancellationActionType("approve");
    setTeacherResponse(`Your cancellation request has been approved.`);
    setIsCancellationResponseModalOpen(true);
  };

  const handleRejectCancellationClick = (request) => {
    setSelectedCancellationRequest(request);
    setCancellationActionType("reject");
    setTeacherResponse("");
    setIsCancellationResponseModalOpen(true);
  };

  const handleSubmitCancellationResponse = async () => {
    if (!selectedCancellationRequest) return;

    if (cancellationActionType === "reject" && (!teacherResponse || teacherResponse.trim().length === 0)) {
      errorMessage("Please provide a reason for rejection");
      return;
    }

    try {
      await updateCancellationStatus({
        id: selectedCancellationRequest.id,
        status: cancellationActionType === "approve" ? "approved" : "rejected",
        teacherResponse,
      }).unwrap();

      successMessage(`Cancellation request ${cancellationActionType === "approve" ? "approved" : "rejected"} successfully`);
      setIsCancellationResponseModalOpen(false);
      setSelectedCancellationRequest(null);
      setTeacherResponse("");
      refetchCancellations();
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

  const canCancel = (schedule) => {
    const parsedDate = parseDateFromDB(schedule.date);
    const scheduleDateTime = parsedDate
      ? new Date(
        `${parsedDate.toISOString().split("T")[0]}T${schedule.startTime}`,
      )
      : new Date(`${schedule.date}T${schedule.startTime}`);
    const now = new Date();
    const hoursUntilClass = (scheduleDateTime - now) / (1000 * 60 * 60);
    return hoursUntilClass > 0;
  };

  const handleDateClick = (date) => {
    // date is a JavaScript Date object from CustomCalendar
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${year}-${month}-${day}`;

    setSelectedDate(date);

    // Find schedules for this date
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const schedules = schedulesByDate.all[dateKey] || [];
    setSchedulesForSelectedDate(schedules);
    openDateModal();
  };

  const getClassStatusBadge = (schedule, type = "single") => {
    let status = "";
    let hoursUntil = null;
    let isExpired = false;

    if (type === "single") {
      status = getStatusTextForSingleDate(
        schedule.date,
        schedule.startTime,
        schedule.endTime,
      );
      hoursUntil = getHoursUntilClass(schedule.date, schedule.startTime);
      const todayStr = new Date().toISOString().split("T")[0];
      isExpired =
        schedule.date < todayStr ||
        (schedule.date === todayStr && hoursUntil !== null && hoursUntil < 0);
    } else {
      status = getStatusText(schedule);
      const scheduleDates = schedule.scheduleDates || [];
      const todayStr = new Date().toISOString().split("T")[0];
      const upcomingDates = scheduleDates.filter((d) => d >= todayStr);

      if (upcomingDates.length > 0) {
        const nextDate = upcomingDates.sort()[0];
        hoursUntil = getHoursUntilClass(nextDate, schedule.startTime);
      } else if (scheduleDates.length > 0) {
        const lastDate = scheduleDates[scheduleDates.length - 1];
        hoursUntil = getHoursUntilClass(lastDate, schedule.startTime);
      }
      isExpired = isClassExpired(schedule);
    }

    if (status === "live") {
      return (
        <Button
          size="sm"
          className="bg-[#E8F1FF] text-[#3F86F2] animate-pulse"
          radius="sm"
          startContent={<Video size={14} />}
        >
          Live Now
        </Button>
      );
    }

    if (isExpired) {
      return (
        <Chip size="sm" variant="flat" color="default">
          Completed
        </Chip>
      );
    }

    if (hoursUntil !== null && hoursUntil > 0 && hoursUntil < 3) {
      return (
        <Button
          size="sm"
          className="bg-[#95C4BE33] text-[#06574C]"
          radius="sm"
          startContent={<Lock size={14} />}
        >
          Starts in {hoursUntil?.toFixed(1)} hr
        </Button>
      );
    }

    return (
      <Chip size="sm" variant="flat" color="warning">
        Upcoming
      </Chip>
    );
  };

  const ScheduleCard = ({ schedule, type = "allDates" }) => {
    const isLive = isClassLive(
      schedule,
      type === "normal" ? "multiple" : "single",
    );
    const isExpired = isClassExpired(schedule);
    const canJoin = isLive && schedule.meetingLink;
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
        <div className="flex flex-wrap gap-2 mb-3">
          {getClassStatusBadge(
            schedule,
            type === "normal" ? "multiple" : "single",
          )}
          {schedule.courseName && (
            <Button
              size="sm"
              className="bg-[#95C4BE33] text-[#06574C]"
              radius="sm"
            >
              Course: {schedule.courseName}
            </Button>
          )}
          <Button
            size="sm"
            color="success"
            radius="sm"
            onPress={() => handleAddNote(schedule, (type === "normal" ? null : schedule.date))}
          >
            {schedule?.notes?.[schedule.date] ? "Update Note" : "Add Note"}
          </Button>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {schedule.title}
        </h2>
        {schedule.description && (
          <p className="text-[#666666] text-sm mb-4 line-clamp-2">
            {schedule.description}
          </p>
        )}
        {type === "normal" && (
          <p className="text-[#666666] text-sm mb-4 line-clamp-2">
            {schedule.scheduleDates?.length === 1
              ? dateFormatter(schedule.scheduleDates[0])
              : `${dateFormatter(schedule.scheduleDates[0])} - to - ${schedule?.isDateGenerated ? "On Going" : dateFormatter(schedule.scheduleDates[schedule.scheduleDates.length - 1])}`}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex text-[#666666] text-sm items-center gap-2">
            {type === "normal" ? (
              "CreatedAt: "
            ) : (
              <CiCalendar color="#666666" size={20} />
            )}
            <p className="text-[#666666] text-sm">
              {dateFormatter(schedule.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock color="#666666" size={18} />
            <p className="text-[#666666] text-sm">
              {formatTime12Hour(schedule.startTime)} -{" "}
              {formatTime12Hour(schedule.endTime)}
            </p>
          </div>
        </div>

        {schedule.notes && type !== "normal" ? schedule?.notes?.[schedule.date] && (
          <div className="bg-amber-50 border-l-4 border-success p-3 mb-3 rounded-md">
            <p className="text-sm font-semibold text-amber-800 mb-1">Schedule Note:</p>
            <p className="text-sm text-amber-900">{dateFormatter(schedule.notes[schedule.date])}</p>
          </div>
        ) : schedule?.notes &&
        <details>
          <summary className="cursor-pointer text-[#406c65] hover:opacity-80 italic underline flex">All Notes</summary>
          {Object.keys(schedule?.notes).map((date) => (
            <div className="bg-amber-50 flex items-center gap-1 flex-wrap border-l-4 border-success p-3 mb-3 rounded-md">
              <p className="text-sm font-semibold text-amber-800 msb-1">{dateFormatter(date)}:</p>
              <p className="text-sm text-amber-900">{schedule?.notes[date]}</p>
            </div>
          ))}
        </details>
        }

        <Divider className="my-4" />

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center bg-[#95C4BE33] rounded-full shrink-0">
              <FaRegAddressCard color="#06574C" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                {schedule.teacherName || "Teacher"}
              </h3>
              {schedule.courseName && (
                <p className="text-xs text-gray-500">{schedule.courseName}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end w-full md:w-auto">
            {canJoin ? (
              <Button
                radius="sm"
                size="sm"
                variant="solid"
                className="bg-[#1570E8] text-white"
                startContent={<LuSquareArrowOutUpRight size={18} />}
                as={Link}
                to={schedule.meetingLink}
                target="_blank"
                isLoading={isMarking === schedule.id}
              >
                Join Zoom
              </Button>
            ) : (
              <Button
                radius="sm"
                size="sm"
                variant="solid"
                className="bg-[#9A9A9A] text-white"
                startContent={<Lock size={18} />}
                isDisabled={!isExpired}
              >
                {isExpired ? "Ended" : "Locked"}
              </Button>
            )}
            {type === "normal" && (
              <>
                <Tooltip
                  isDisabled={canReschedule(schedule)}
                  color="success"
                  content="Schedule can only be rescheduled before 4 hours of the start time."
                >
                  <Button
                    radius="sm"
                    size="sm"
                    variant="bordered"
                    color="success"
                    isDisabled={!canReschedule(schedule)}
                    onPress={() =>
                      navigate("/teacher/class-scheduling/manage", {
                        state: schedule,
                      })
                    }
                  >
                    Reschedule
                  </Button>
                </Tooltip>
                <Button
                  radius="sm"
                  size="sm"
                  variant="bordered"
                  color="warning"
                  onPress={() => handleViewRescheduleRequests(schedule)}
                  startContent={
                    <div className="relative">
                      <Bell size={16} />
                      {schedule.pendingRescheduleCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                          {schedule.pendingRescheduleCount}
                        </span>
                      )}
                    </div>
                  }
                >
                  View Requests
                  {schedule.pendingRescheduleCount > 0 && (
                    <span className="ml-1">({schedule.pendingRescheduleCount})</span>
                  )}
                </Button>
                <Button
                  radius="sm"
                  size="sm"
                  variant="bordered"
                  color="danger"
                  onPress={() => handleViewCancellationRequests(schedule)}
                  startContent={
                    <div className="relative">
                      <Bell size={16} />
                      {schedule.pendingCancellationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                          {schedule.pendingCancellationCount}
                        </span>
                      )}
                    </div>
                  }
                >
                  View Cancellations
                  {schedule.pendingCancellationCount > 0 && (
                    <span className="ml-1">({schedule.pendingCancellationCount})</span>
                  )}
                </Button>
                <Button
                  radius="sm"
                  size="sm"
                  variant="bordered"
                  color="danger"
                  onPress={() => handleCancelClass(schedule)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filters = [
    { key: "all", label: "All Status" },
    { key: "upcoming", label: "Upcoming" },
    { key: "live", label: "Live" },
    { key: "completed", label: "Completed" },
  ];

  if (error) {
    return (
      <QueryError
        height="300px"
        error={error}
        onRetry={refetch}
        showLogo={false}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="h-full relative bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full nddo-scrollbar top-0 bottom-0 overflow-auto">
      <DashHeading
        title="My Course's Schedules"
        desc="View and manage your upcoming live course's schedules"
      />
      <div className="flex items-center max-sm:flex-wrap gap-2">
        <Tabs
          color="success"
          variant="underlined"
          selectedKey={viewType}
          onSelectionChange={setViewType}
        >
          <Tab key="normal" title="View Schedule By Course" />
          <Tab key="allDates" title="View Schedule By Date" />
        </Tabs>
      </div>
      <div className="grid grid-cols-12 gap-4 items-start mt-4">
        {viewType === "allDates" ? (
          <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" color="success" />
              </div>
            ) : (
              <SchedulesByDateList 
                groupedSchedules={schedulesByDate} 
                renderCard={(schedule) => (
                  <ScheduleCard key={`${schedule.id}-${schedule.date}`} schedule={schedule} type="allDates" />
                )} 
              />
            )}
          </div>
        ) : (
          <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" color="success" />
              </div>
            ) : scheduleData?.schedules?.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <CalendarIcon
                  className="mx-auto mb-4 text-gray-400"
                  size={48}
                />
                <p className="text-gray-500">No classes scheduled</p>
              </div>
            ) : (
              scheduleData?.schedules?.map((i) => (
                <div key={i.id} className="mdb-6">
                  <DashHeading
                    title={"Course: " + i.courseName}
                    desc={
                      i.scheduleDates?.length === 1
                        ? new Date(i.scheduleDates[0]).toDateString()
                        : new Date(i.scheduleDates[0]).toDateString() +
                        " - to - " +
                        new Date(
                          i.scheduleDates[i.scheduleDates?.length - 1],
                        ).toDateString()
                    }
                  />
                  <div className="mt-d3">
                    <ScheduleCard key={i.id} schedule={i} type="normal" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sidebar - Calendar & Filters */}
        <div className="col-span-12 sm:sticky order-1 lg:order-2 top-2 lg:col-span-4 space-y-4 mb-4">
          <div className="bg-white w-full space-y-4 p-4 rounded-lg shadow-sm">
            <Button
              startContent={<PlusIcon />}
              radius="sm"
              size="md"
              color="success"
              as={Link}
              className="w-full"
              to="/teacher/class-scheduling/manage"
            >
              Schedule New
            </Button>
            <CustomCalendar
              selectedDates={schedulesDates}
              onDateClick={handleDateClick}
              className="max-w-[330px] mx-auto"
            />
          </div>

          {/* Filters */}
          <div className="bg-white pointer-events-auto p-4 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Filter by Status
              </label>
              <Select
                size="sm"
                label="Status Filter"
                className="w-full"
                selectedKeys={[filterStatus]}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {filters.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing schedule details when date is clicked */}
      <Modal
        isOpen={isDateModalOpen}
        onOpenChange={closeDateModal}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-[#06574C]">
                Schedule Details For
              </h2>
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            {schedulesForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon
                  className="mx-auto mb-4 text-gray-400"
                  size={48}
                />
                <p className="text-gray-500">
                  No classes scheduled for this date
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {schedulesForSelectedDate.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getClassStatusBadge(schedule, "single")}
                      {schedule.courseName && (
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-[#95C4BE33] text-[#06574C]"
                        >
                          Course: {schedule.courseName}
                        </Chip>
                      )}
                      <Button
                        size="sm"
                        color="success"
                        radius="sm"
                        onPress={() => handleAddNote(schedule, schedule.date)}
                      >
                        {schedule?.notes?.[schedule.date] ? "Update Note" : "Add Note"}
                      </Button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {schedule.title}
                    </h3>

                    {schedule.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {schedule.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <CiCalendar size={18} />
                        <span>{dateFormatter(schedule.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock size={18} />
                        <span>
                          {formatTime12Hour(schedule.startTime)} -{" "}
                          {formatTime12Hour(schedule.endTime)}
                        </span>
                      </div>
                      {schedule.notes && schedule?.notes?.["2026-04-07"] &&
                        <div className="bg-amber-50 border-l-4 border-success p-3 mb-3 rounded-r-md">
                          <p className="text-sm font-semibold text-amber-800 mb-1">Schedule Note:</p>
                          <p className="text-sm text-amber-900">{schedule.notes[schedule.date]}</p>
                        </div>}
                      {schedule.meetingLink && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Video size={18} />
                          <span>Zoom Class Available</span>
                        </div>
                      )}
                      {schedule.teacherName && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <User size={18} />
                          <span>{schedule.teacherName}</span>
                        </div>
                      )}
                    </div>

                    <Divider className="my-3" />

                    {/* <div className="flex flex-wrap gap-2">
                                            {schedule.meetingLink && isClassLive({ ...schedule, scheduleDates: [schedule.date] }) ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-[#1570E8] text-white"
                                                    startContent={<LuSquareArrowOutUpRight size={16} />}
                                                    onPress={() => handleJoinClass(schedule)}
                                                    isLoading={isMarking === schedule.id}
                                                >
                                                    Join Class
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    className="bg-[#9A9A9A] text-white"
                                                    startContent={<Lock size={16} />}
                                                    isDisabled
                                                >
                                                    Join Locked
                                                </Button>
                                            )}
                                            {canReschedule(schedule) && (
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    color="success"
                                                    onPress={() => {
                                                        closeDateModal();
                                                        navigate('/teacher/class-scheduling/manage', { state: schedule });
                                                    }}
                                                >
                                                    Reschedule
                                                </Button>
                                            )}
                                            {canCancel(schedule) && (
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    color="danger"
                                                    onPress={() => {
                                                        closeDateModal();
                                                        handleCancelClass(schedule);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div> */}
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => closeDateModal()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onOpenChange(false);
          setSelectedSchedule(null);
        }}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold text-[#06574C]">
              Cancel Schdule
            </h2>
          </ModalHeader>
          <ModalBody>
            {selectedSchedule && (
              <>
                <p className="text-gray-700">
                  Are you sure you want to cancel this schdule?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <p className="font-semibold text-sm">
                    {selectedSchedule.title}
                  </p>
                  <p className="font-bold text-xs ">
                    {selectedSchedule?.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {/* {(parseDateFromDB(selectedSchedule.date) || new Date(selectedSchedule.date)).toLocaleDateString()} at{" "} */}
                    {formatTime12Hour(selectedSchedule.startTime)} - {formatTime12Hour(selectedSchedule.endTime)}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-amber-800">
                    <strong>⚠️ Note:</strong> This action will notify the admin
                    and students.
                  </p>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                onOpenChange(false);
                setSelectedSchedule(null);
              }}
              isDisabled={isCancelling}
            >
              No, Keep It
            </Button>
            <Button
              color="danger"
              onPress={() => handleDelete(selectedSchedule?.id)}
              isLoading={isCancelling}
            >
              Yes, Cancel It
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isNoteModalOpen} onOpenChange={closeNoteModal} size="md">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold text-[#06574C]">
              {selectedSchedule?.notes?.[selectedNoteDate] ? "Update" : "Add"} Note for {selectedSchedule?.title}
            </h2>
          </ModalHeader>
          <ModalBody>
            {selectedNoteDate ?
              <p className="text-sm flex gap-3 w-full items-center text-gray-500 mb-2">
                <span className="mt-0.5">  Date: {new Date(selectedNoteDate).toLocaleDateString()}</span>
                <span className="text-xl text-[#406c65] cursor-pointer" onClick={() => setSelectedNoteDate(null)}>&times;</span>
              </p> :
              <Input
                type="date"
                label="Date"
                variant="bordered"
                value={selectedNoteDate}
                isRequired
                onChange={(e) =>
                  setSelectedNoteDate(e.target.value?.split("T")[0])
                }
              />
            }
            <Textarea
              label="Note"
              placeholder="Enter your note here..."
              variant="bordered"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              minRows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeNoteModal}>
              Cancel
            </Button>
            <Button
              color="success"
              onPress={handleSaveNote}
              isLoading={isSavingNote}
            >
              Save Note
            </Button>
          </ModalFooter>
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

      {/* Cancellation Requests Management Modal */}
      <Modal
        isOpen={isCancellationModalOpen}
        onOpenChange={closeCancellationModal}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#06574C]">Cancellation Requests</h2>
            <p className="text-sm text-gray-500 font-normal">
              Manage student cancellation requests for {selectedSchedule?.title}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
              <Select
                label="Filter by Status"
                selectedKeys={[cancellationStatusFilter]}
                onSelectionChange={(keys) => {
                  setCancellationStatusFilter(Array.from(keys)[0]);
                  setCancellationPage(1);
                }}
                className="max-w-xs"
                size="sm"
              >
                <SelectItem key="all" value="all">All Requests</SelectItem>
                <SelectItem key="pending" value="pending">Pending</SelectItem>
                <SelectItem key="approved" value="approved">Approved</SelectItem>
                <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
              </Select>

              <Button
                size="sm"
                variant="flat"
                onPress={() => refetchCancellations()}
                className="bg-[#06574C] text-white"
              >
                Refresh
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Table
                removeWrapper
                isHeaderSticky
                aria-label="Cancellation Requests Table"
                classNames={{
                  base: "w-full bg-white rounded-lg min-h-[30vh] overflow-x-scroll w-full no-scrollbar max-h-[400px] shadow-md",
                  th: "font-bold bg-[#EBD4C9] p-3 text-sm text-[#333333] capitalize tracking-widest ",
                  td: "py-3 items-center whitespace-nowrap",
                  tr: "border-b border-default-200",
                }}
              >
                <TableHeader>
                  <TableColumn key="student">Student</TableColumn>
                  <TableColumn key="type">Type</TableColumn>
                  <TableColumn key="dates">Dates</TableColumn>
                  <TableColumn key="reason">Reason</TableColumn>
                  <TableColumn key="status">Status</TableColumn>
                  <TableColumn key="requestedAt">Requested At</TableColumn>
                  <TableColumn key="actions" align="center">Actions</TableColumn>
                </TableHeader>
                <TableBody
                  loadingContent={<Spinner color="success" />}
                  loadingState={isCancellationLoading ? 'loading' : 'idle'}
                  emptyContent={
                    <div className="text-center py-10">
                      <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-500 text-lg">No cancellation requests found</p>
                    </div>
                  }
                  items={cancellationData?.requests || []}
                >
                  {(request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{request.studentName}</p>
                          <p className="text-xs text-gray-400">{request.studentEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color={request.cancellationType === "whole" ? "danger" : "warning"}>
                          {request.cancellationType === "whole" ? "Whole Schedule" : "Specific Dates"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {request.cancellationType === "whole" ? (
                            "All sessions"
                          ) : (
                            <div className="max-w-[150px] truncate" title={(request.cancellationDates || []).join(", ")}>
                              {request.cancellationDates?.map((date, index) => (
                                <span key={index}>
                                  {date}
                                  {index < request.cancellationDates.length - 1 && <br />}
                                </span>
                              ))}
                            </div>
                          )}
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
                                onPress={() => handleApproveCancellationClick(request)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => handleRejectCancellationClick(request)}
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

              {cancellationData?.totalPages > 1 && (
                <div className="flex justify-center mt-4 p-4">
                  <Pagination
                    total={cancellationData.totalPages}
                    page={cancellationPage}
                    onChange={setCancellationPage}
                    color="primary"
                    showControls
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => closeCancellationModal()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancellation Response Modal */}
      <Modal
        isOpen={isCancellationResponseModalOpen}
        onClose={() => setIsCancellationResponseModalOpen(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">
              {cancellationActionType === "approve" ? "Approve Cancellation" : "Reject Cancellation"}
            </h2>
          </ModalHeader>
          <ModalBody>
            {selectedCancellationRequest && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Student:</strong> {selectedCancellationRequest.studentName}
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Cancellation Type:</p>
                  <p className="text-sm font-medium">
                    {selectedCancellationRequest.cancellationType === "whole" ? "Whole Schedule" : `Specific Dates: ${(selectedCancellationRequest.cancellationDates || []).join(", ")}`}
                  </p>
                </div>
              </div>
            )}

            <Textarea
              label={cancellationActionType === "approve" ? "Approval Message" : "Rejection Reason"}
              placeholder={
                cancellationActionType === "approve"
                  ? "Add a message for the student (optional)"
                  : "Please provide a reason for rejection"
              }
              value={teacherResponse}
              onChange={(e) => setTeacherResponse(e.target.value)}
              minRows={4}
              isRequired={cancellationActionType === "reject"}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsCancellationResponseModalOpen(false)}
              isDisabled={isUpdatingCancellation}
            >
              Cancel
            </Button>
            <Button
              color={cancellationActionType === "approve" ? "success" : "danger"}
              onPress={handleSubmitCancellationResponse}
              isLoading={isUpdatingCancellation}
            >
              {isUpdatingCancellation ? "Processing..." : cancellationActionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeacherClassSheduling;

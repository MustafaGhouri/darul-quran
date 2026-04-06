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
import { useCreateRescheduleRequestMutation } from "../../../redux/api/reschedule";
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
    if (!scheduleData?.schedules) return {};

    const grouped = {};
    scheduleData.schedules.forEach((schedule) => {
      if (filterType !== "all") {
        if (filterType === "zoom" && !schedule.meetingLink) return;
        if (filterType === "video" && schedule.meetingLink) return;
      }

      // Iterate through scheduleDates array instead of deprecated date field
      if (!schedule.scheduleDates?.length) return;

      schedule.scheduleDates.forEach((scheduleDate) => {
        // Handle both string dates and object dates
        const dateStr =
          typeof scheduleDate === "string" ? scheduleDate : scheduleDate?.date;
        const parsedDate = parseDateFromDB(dateStr);
        if (!parsedDate || isNaN(parsedDate.getTime())) return;

        const dateKey = parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        // Add schedule with its specific date info
        grouped[dateKey].push({
          ...schedule,
          date: dateStr,
          startTime:
            typeof scheduleDate === "object"
              ? scheduleDate.startTime || schedule.startTime
              : schedule.startTime,
          endTime:
            typeof scheduleDate === "object"
              ? scheduleDate.endTime || schedule.endTime
              : schedule.endTime,
        });
      });
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const sortedGrouped = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  }, [scheduleData, filterType]);

  //formatted dates
  const scheduleDates = Object.keys(schedulesByDate);

  const handleCancelClass = (schedule) => {
    setSelectedSchedule(schedule);
    onOpenChange(true);
  };

  const handleAddNote = (schedule, date) => {
    setSelectedSchedule(schedule);
    const noteDate = date || new Date().toISOString().split("T")[0];
    setSelectedNoteDate(noteDate);
    setNoteText(schedule?.notes?.[noteDate] || "");
    openNoteModal();
  };

  const handleSaveNote = async () => {
    try {
      if (!selectedSchedule) return;
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
    const dateKey = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const schedules = schedulesByDate[dateKey] || [];
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
            onPress={() => handleAddNote(schedule, schedule.date)}
          >
            Add Note
          </Button>
        </div>

        {schedule?.notes?.[schedule.date] && (
          <div className="bg-amber-50 border-l-4 border-success p-3 mb-3 rounded-r-md">
            <p className="text-sm font-semibold text-amber-800 mb-1">Schedule Note:</p>
            <p className="text-sm text-amber-900">{schedule.notes[schedule.date]}</p>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {schedule.title}
        </h2>
        {schedule.description && (
          <p className="text-[#666666] text-sm mb-4 line-clamp-2">
            {schedule.description}
          </p>
        )}
        {type === "normal" && schedule?.scheduleType !== "once" ? (
          <p className="text-[#666666] text-sm mb-4 line-clamp-2">
            {schedule.scheduleDates?.length === 1
              ? new Date(schedule.scheduleDates[0]).toDateString()
              : `${new Date(schedule.scheduleDates[0]).toDateString()} - to - ${schedule?.isDateGenerated ? "On Going" : new Date(schedule.scheduleDates[schedule.scheduleDates.length - 1]).toDateString()}`}
          </p>
        ) : (
          <p className="text-[#666666] text-sm mb-4 line-clamp-2">
            {new Date(schedule.startDate).toDateString()}
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
              {dateFormatter(schedule.date, true)}
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
        {/* {type === 'normal' &&
                    <Calendar
                        size="sm"
                        variant="underlined"
                        color='success'
                        isReadOnly
                        isDateUnavailable={(date) =>
                            schedule?.scheduleDates?.includes(date.toString())
                        }
                    />
                } */}

        <Divider className="my-4" />

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center bg-[#95C4BE33] rounded-full">
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
          <div className="flex flex-wrap gap-2">
            {canJoin ? (
              <Button
                radius="sm"
                size="md"
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
                size="md"
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
                    size="md"
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
                  size="md"
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
            ) : scheduleDates.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <CalendarIcon
                  className="mx-auto mb-4 text-gray-400"
                  size={48}
                />
                <p className="text-gray-500">No classes scheduled</p>
              </div>
            ) : (
              scheduleDates.map((dateKey) => (
                <div key={dateKey} className="m b-6">
                  <DashHeading
                    title={dateKey}
                    desc={`${schedulesByDate[dateKey].length} ${schedulesByDate[dateKey].length === 1 ? "class" : "classes"} scheduled`}
                  />
                  <div className="mtd-3">
                    {schedulesByDate[dateKey].map((schedule) => (
                      <ScheduleCard key={schedule.id} schedule={schedule} />
                    ))}
                  </div>
                </div>
              ))
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
                        Add Note
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
              Delete Schdule
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
                  <p className="text-sm text-gray-600">
                    {/* {(parseDateFromDB(selectedSchedule.date) || new Date(selectedSchedule.date)).toLocaleDateString()} at{" "} */}
                    {formatTime12Hour(selectedSchedule.startTime)}
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
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isNoteModalOpen} onOpenChange={closeNoteModal} size="md">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold text-[#06574C]">
              Note for {selectedSchedule?.title}
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-500 mb-2">
              Date: {selectedNoteDate && new Date(selectedNoteDate).toLocaleDateString()}
            </p>
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
    </div>
  );
};

export default TeacherClassSheduling;

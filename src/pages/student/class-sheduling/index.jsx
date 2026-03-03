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
} from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import { Clock, Lock, Video, Calendar as CalendarIcon, User, MapPin } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import {
    useGetScheduleQuery,
    useDeleteScheduleMutation,
} from "../../../redux/api/schedules";
import { useCreateRescheduleRequestMutation } from "../../../redux/api/reschedule";
import { RescheduleRequestModal } from "../../../components/schedule/RescheduleRequestModal";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { formatTime12Hour, isClassLive, isClassExpired, getStatusColor, getStatusText } from "../../../utils/scheduleHelpers";
import { useSelector } from "react-redux";

const StudentClassSheduling = () => {
    const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isMarking, setIsMarking] = useState(false);

    const { data: scheduleData, isLoading, refetch } = useGetScheduleQuery({
        page: "1",
        limit: "100",
        status: filterStatus === "all" ? undefined : filterStatus,
    });

    const [createRescheduleRequest, { isLoading: isRescheduling }] = useCreateRescheduleRequestMutation();
    const [deleteSchedule, { isLoading: isCancelling }] = useDeleteScheduleMutation();

    const { user: currentUser } = useSelector((state) => state.user);

    const schedulesDates = useMemo(() => {
        if (!scheduleData?.schedules) return [];
        const grouped = scheduleData?.schedules.flatMap(schedule => schedule?.scheduleDates);
        return grouped;
    }, [scheduleData]);

    // Helper function to parse date string (supports both YYYY-MM-DD and DD-M-YY formats)
    const parseDateFromDB = (dateStr) => {
        if (!dateStr) return null;
        
        // Try YYYY-MM-DD format first (from PostgreSQL date array)
        if (dateStr.includes('-') && dateStr.length === 10) {
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
                const dateStr = typeof scheduleDate === 'string' ? scheduleDate : scheduleDate?.date;
                const parsedDate = parseDateFromDB(dateStr);
                if (!parsedDate || isNaN(parsedDate.getTime())) return;

                const dateKey = parsedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                // Add schedule with its specific date info
                grouped[dateKey].push({
                    ...schedule,
                    date: dateStr,
                    startTime: typeof scheduleDate === 'object' ? (scheduleDate.startTime || schedule.startTime) : schedule.startTime,
                    endTime: typeof scheduleDate === 'object' ? (scheduleDate.endTime || schedule.endTime) : schedule.endTime,
                });
            });
        });

        const sortedDates = Object.keys(grouped).sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        const sortedGrouped = {};
        sortedDates.forEach(date => {
            sortedGrouped[date] = grouped[date];
        });

        return sortedGrouped;
    }, [scheduleData, filterType]);

    //formatted dates
    const scheduleDates = Object.keys(schedulesByDate);

    const handleJoinClass = async (schedule) => {
        if (!currentUser) {
            errorMessage("Please login first");
            return;
        }
        setIsMarking(schedule.id);
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/attendance/mark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: schedule.id,
                    studentId: currentUser.id,
                    courseId: schedule.courseId,
                })
            });

            if (res.ok) {
                window.open(schedule.meetingLink, '_blank');
                successMessage("Joined class! Attendance marked.");
            } else {
                window.open(schedule.meetingLink, '_blank');
            }
        } catch (error) {
            console.error("Failed to mark attendance", error);
            window.open(schedule.meetingLink, '_blank');
        } finally {
            setIsMarking(null);
        }
    };

    const handleRequestReschedule = (schedule) => {
        setSelectedSchedule(schedule);
        setIsRescheduleModalOpen(true);
    };

    const handleSubmitRescheduleRequest = async (requestData) => {
        try {
            await createRescheduleRequest(requestData).unwrap();
            successMessage("Reschedule request submitted successfully! You will be notified once admin reviews your request.");
            setIsRescheduleModalOpen(false);
            setSelectedSchedule(null);
        } catch (error) {
            errorMessage(error?.data?.message || "Failed to submit reschedule request");
        }
    };

    const handleCancelClass = (schedule) => {
        setSelectedSchedule(schedule);
        setIsCancelModalOpen(true);
    };

    const confirmCancelClass = async () => {
        try {
            successMessage("Class cancellation request submitted. Admin will be notified.");
            setIsCancelModalOpen(false);
            setSelectedSchedule(null);
        } catch (error) {
            errorMessage(error?.data?.message || "Failed to cancel class");
        }
    };

    const canReschedule = (schedule) => {
        const parsedDate = parseDateFromDB(schedule.date);
        const scheduleDateTime = parsedDate 
            ? new Date(`${parsedDate.toISOString().split('T')[0]}T${schedule.startTime}`)
            : new Date(`${schedule.date}T${schedule.startTime}`);
        const now = new Date();
        const hoursUntilClass = (scheduleDateTime - now) / (1000 * 60 * 60);
        return hoursUntilClass > 4;
    };

    const canCancel = (schedule) => {
        const parsedDate = parseDateFromDB(schedule.date);
        const scheduleDateTime = parsedDate 
            ? new Date(`${parsedDate.toISOString().split('T')[0]}T${schedule.startTime}`)
            : new Date(`${schedule.date}T${schedule.startTime}`);
        const now = new Date();
        const hoursUntilClass = (scheduleDateTime - now) / (1000 * 60 * 60);
        return hoursUntilClass > 0; // Can cancel anytime before class starts
    };

    const getClassStatusBadge = (schedule) => {
        const status = getStatusText(schedule);
        const color = getStatusColor(schedule);

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

        if (isClassExpired(schedule)) {
            return (
                <Chip size="sm" variant="flat" color="default">
                    Completed
                </Chip>
            );
        }

        const parsedDate = parseDateFromDB(schedule.date);
        const scheduleDateTime = parsedDate 
            ? new Date(`${parsedDate.toISOString().split('T')[0]}T${schedule.startTime}`)
            : new Date(`${schedule.date}T${schedule.startTime}`);
        const now = new Date();
        const hoursUntilClass = Math.floor((scheduleDateTime - now) / (1000 * 60 * 60));

        if (hoursUntilClass < 3) {
            return (
                <Button
                    size="sm"
                    className="bg-[#95C4BE33] text-[#06574C]"
                    radius="sm"
                    startContent={<Lock size={14} />}
                >
                    Starts in {hoursUntilClass}h
                </Button>
            );
        }

        return (
            <Chip size="sm" variant="flat" color="warning">
                Upcoming
            </Chip>
        );
    };

    const ScheduleCard = ({ schedule }) => {
        const isLive = isClassLive(schedule);
        const isExpired = isClassExpired(schedule);
        const canJoin = isLive && schedule.meetingLink;
        const canResched = canReschedule(schedule);
        const canCanc = canCancel(schedule);

        // Parse the schedule date (could be DD-M-YY format or standard date)
        const scheduleDateObj = parseDateFromDB(schedule.date) || new Date(schedule.date);
        const displayDate = scheduleDateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap gap-2 mb-3">
                    {getClassStatusBadge(schedule)}
                    {schedule.courseName && (
                        <Button
                            size="sm"
                            className="bg-[#95C4BE33] text-[#06574C]"
                            radius="sm"
                        >
                            {schedule.courseName}
                        </Button>
                    )}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">{schedule.title}</h2>
                {schedule.description && (
                    <p className="text-[#666666] text-sm mb-4 line-clamp-2">
                        {schedule.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <CiCalendar color="#666666" size={20} />
                        <p className="text-[#666666] text-sm">
                            {displayDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock color="#666666" size={18} />
                        <p className="text-[#666666] text-sm">
                            {formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}
                        </p>
                    </div>
                </div>

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
                                onPress={() => handleJoinClass(schedule)}
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

                        {canResched && (
                            <Button
                                radius="sm"
                                size="md"
                                variant="bordered"
                                color="success"
                                onPress={() => handleRequestReschedule(schedule)}
                            >
                                Reschedule
                            </Button>
                        )}

                        {/* {canCanc && !isExpired && (
                            <Button
                                radius="sm"
                                size="md"
                                variant="bordered"
                                color="danger"
                                onPress={() => handleCancelClass(schedule)}
                            >
                                Cancel
                            </Button>
                        )} */}
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

    const classTypes = [
        { key: "all", label: "All Classes" },
        { key: "zoom", label: "Live Zoom" },
        { key: "video", label: "Video Lesson" },
    ];

    return (
        <div className="h-full relative bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full no-scrollbar top-0 bottom-0 overflow-auto">
            <DashHeading
                title="My Class Schedule"
                desc="View and manage your upcoming live classes"
            />

            <div className="grid grid-cols-12 gap-4 items-start mt-4">
                {/* Main Content - Schedule List */}
                <div className="col-span-12 lg:col-span-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : scheduleDates.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-500">No classes scheduled</p>
                        </div>
                    ) : (
                        scheduleDates.map((dateKey) => (
                            <div key={dateKey} className="mb-6">
                                <DashHeading
                                    title={dateKey}
                                    desc={`${schedulesByDate[dateKey].length} ${schedulesByDate[dateKey].length === 1 ? 'class' : 'classes'} scheduled`}
                                />
                                <div className="mt-3">
                                    {schedulesByDate[dateKey].map((schedule) => (
                                        <ScheduleCard key={schedule.id} schedule={schedule} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar - Calendar & Filters */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    {/* Quick Stats Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Schedule Overview</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#95C4BE33] p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-[#06574C]">
                                    {scheduleData?.schedules?.filter(s => getStatusText(s) === "upcoming").length || 0}
                                </p>
                                <p className="text-xs text-gray-600">Upcoming</p>
                            </div>
                            <div className="bg-[#E8F1FF] p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-[#3F86F2]">
                                    {scheduleData?.schedules?.filter(s => getStatusText(s) === "live").length || 0}
                                </p>
                                <p className="text-xs text-gray-600">Live</p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Calendar</h3>
                        <div className="w-full flex justify-center">
                            <style>{`
                                [data-selected="true"] {
                                    background-color: #06574C !important;
                                    color: white !important;
                                    border-radius: 9999px !important;
                                }
                                [data-hovered="true"] {
                                    background-color: #95C4BE !important;
                                    border-radius: 9999px !important;
                                }
                            `}</style>
                            <Calendar
                                aria-label="Select Date"
                                classNames={{
                                    headerWrapper: "bg-[#FBF4EC] w-full",
                                    gridHeaderRow: "bg-[#FBF4EC] w-full",
                                    gridBody: "bg-[#FBF4EC] w-full",
                                    gridWrapper: "bg-[#FBF4EC] w-full",
                                    root: "w-full",
                                    cell: "w-full",
                                    table: "w-full",
                                }}
                                isReadOnly
                                isDateUnavailable={(date) =>
                                    schedulesDates?.includes(date.toString())
                                }
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
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

                        {/* <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Class Type
                            </label>
                            <div className="flex flex-col gap-2">
                                {classTypes.map((type) => (
                                    <Button
                                        key={type.key}
                                        size="sm"
                                        radius="sm"
                                        className={`justify-start ${filterType === type.key
                                            ? "bg-[#06574C] text-white"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                        onPress={() => setFilterType(type.key)}
                                        variant={filterType === type.key ? "solid" : "flat"}
                                    >
                                        {type.key === "zoom" && <Video size={16} className="mr-2" />}
                                        {type.key === "video" && <Lock size={16} className="mr-2" />}
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Reschedule Request Modal */}
            <RescheduleRequestModal
                isOpen={isRescheduleModalOpen}
                onClose={() => {
                    setIsRescheduleModalOpen(false);
                    setSelectedSchedule(null);
                }}
                schedule={selectedSchedule}
                onSubmit={handleSubmitRescheduleRequest}
                isSubmitting={isRescheduling}
            />

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    setIsCancelModalOpen(false);
                    setSelectedSchedule(null);
                }}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-lg font-semibold text-[#06574C]">Cancel Class</h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedSchedule && (
                            <>
                                <p className="text-gray-700">
                                    Are you sure you want to cancel your enrollment for this class?
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                                    <p className="font-semibold text-sm">{selectedSchedule.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {(parseDateFromDB(selectedSchedule.date) || new Date(selectedSchedule.date)).toLocaleDateString()} at{" "}
                                        {formatTime12Hour(selectedSchedule.startTime)}
                                    </p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                    <p className="text-sm text-amber-800">
                                        <strong>⚠️ Note:</strong> This action will notify the admin. You may lose your spot in this class.
                                    </p>
                                </div>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => {
                                setIsCancelModalOpen(false);
                                setSelectedSchedule(null);
                            }}
                            isDisabled={isCancelling}
                        >
                            No, Keep It
                        </Button>
                        <Button
                            color="danger"
                            onPress={confirmCancelClass}
                            isLoading={isCancelling}
                        >
                            Yes, Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default StudentClassSheduling;

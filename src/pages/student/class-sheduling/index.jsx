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
} from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import { Clock, Lock, Video, Calendar as CalendarIcon, User, MapPin } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { Calendar } from "@heroui/react";
import {
    useGetScheduleQuery,
} from "../../../redux/api/schedules";
import { useCreateRescheduleRequestMutation } from "../../../redux/api/reschedule";
import { RescheduleRequestModal } from "../../../components/schedule/RescheduleRequestModal";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { formatTime12Hour, isClassLive, isClassExpired, getStatusColor, getStatusText, getStatusTextForSingleDate, getHoursUntilClass } from "../../../utils/scheduleHelpers";
import { useSelector } from "react-redux";
import { dateFormatter } from "../../../lib/utils";
import CustomCalendar from "../../../components/teacher/CustomCalendar";
import QueryError from "../../../components/QueryError";

const StudentClassSheduling = () => {
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isMarking, setIsMarking] = useState(false);
    const [viewType, setViewType] = useState('allDates');
    const [selectedDate, setSelectedDate] = useState(null);
    const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState([]);
    const { data: scheduleData, isLoading, isFetching, refetch, error } = useGetScheduleQuery({
        page: "1",
        limit: "10",
        status: filterStatus === "all" ? undefined : filterStatus,
    });

    const [createRescheduleRequest, { isLoading: isRescheduling }] = useCreateRescheduleRequestMutation();

    const { user: currentUser } = useSelector((state) => state.user);
    const { isOpen: isDateModalOpen, onOpen: openDateModal, onOpenChange: closeDateModal } = useDisclosure();

    const schedulesDates = useMemo(() => {
        if (!scheduleData?.schedules) return [];
        const grouped = scheduleData?.schedules.flatMap(schedule => {
            // Use scheduleDates if available, otherwise fall back to date field
            if (schedule.scheduleDates?.length > 0) {
                return schedule.scheduleDates;
            } else if (schedule.date) {
                return [schedule.date];
            }
            return [];
        });
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

            // Handle both scheduleDates array and fallback to date field
            const datesToProcess = schedule.scheduleDates?.length > 0 
                ? schedule.scheduleDates 
                : (schedule.date ? [schedule.date] : []);

            if (!datesToProcess.length) return;

            datesToProcess.forEach((scheduleDate) => {
                // Handle both string dates and object dates
                const dateStr = scheduleDate;
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
            year: "numeric"
        });

        const schedules = schedulesByDate[dateKey] || [];
        setSchedulesForSelectedDate(schedules);
        openDateModal();
    };

    const handleJoinClass = async (schedule) => {
        if (!currentUser) {
            errorMessage("Please login first");
            return;
        }
        setIsMarking(schedule.id);
        const finalToken = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/attendance/mark`, {
                method: "POST",
                credentials: "include",
                headers: { "Authorization": `Bearer ${finalToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: schedule.id,
                    studentId: currentUser.id,
                    courseId: schedule.courseId,
                    date: schedule.date
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.open(data?.link, '_blank');
                successMessage("Joined class! Attendance marked.");
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Failed to mark attendance", error);
            errorMessage(error.message);
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
        const scheduleDates = schedule.scheduleDates?.length > 0 
            ? schedule.scheduleDates 
            : (schedule.date ? [schedule.date] : []);
        const todayStr = new Date().toISOString().split('T')[0];
        const upcomingDates = scheduleDates.filter(d => d >= todayStr);

        if (upcomingDates.length === 0) return false;

        // Use the next upcoming date
        const nextDate = upcomingDates.sort()[0];
        const hoursUntil = getHoursUntilClass(nextDate, schedule.startTime);
        return hoursUntil > 4;
    };

    const canCancel = (schedule) => {
        const scheduleDates = schedule.scheduleDates?.length > 0 
            ? schedule.scheduleDates 
            : (schedule.date ? [schedule.date] : []);
        const todayStr = new Date().toISOString().split('T')[0];
        const upcomingDates = scheduleDates.filter(d => d >= todayStr);

        if (upcomingDates.length === 0) return false;

        // Use the next upcoming date
        const nextDate = upcomingDates.sort()[0];
        const hoursUntil = getHoursUntilClass(nextDate, schedule.startTime);
        return hoursUntil > 0; // Can cancel anytime before class starts
    };

    const getClassStatus = (schedule, type = 'single') => {
        let status = '';
        let hoursUntil = null;
        let isExpired = false;

        if (type === 'single') {
            status = getStatusTextForSingleDate(schedule.date, schedule.startTime, schedule.endTime);
            hoursUntil = getHoursUntilClass(schedule.date, schedule.startTime);
            const todayStr = new Date().toISOString().split('T')[0];
            isExpired = schedule.date < todayStr || (schedule.date === todayStr && hoursUntil !== null && hoursUntil < 0);
        } else {
            status = getStatusText(schedule);
            const scheduleDates = schedule.scheduleDates?.length > 0 
                ? schedule.scheduleDates 
                : (schedule.date ? [schedule.date] : []);
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingDates = scheduleDates.filter(d => d >= todayStr);

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
            return 'Live Now';
        }

        if (isExpired) {
            return "Completed";
        }

        if (hoursUntil !== null && hoursUntil > 0 && hoursUntil < 3) {
            return `Starts in ${(hoursUntil)?.toFixed(1)} hr`;
        }

        return "Upcoming";

    };

    const getClassStatusBadge = (schedule, type = 'single') => {
        let status = '';
        let hoursUntil = null;
        let isExpired = false;

        if (type === 'single') {
            status = getStatusTextForSingleDate(schedule.date, schedule.startTime, schedule.endTime);
            hoursUntil = getHoursUntilClass(schedule.date, schedule.startTime);
            const todayStr = new Date().toISOString().split('T')[0];
            isExpired = schedule.date < todayStr || (schedule.date === todayStr && hoursUntil !== null && hoursUntil < 0);
        } else {
            status = getStatusText(schedule);
            const scheduleDates = schedule.scheduleDates?.length > 0 
                ? schedule.scheduleDates 
                : (schedule.date ? [schedule.date] : []);
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingDates = scheduleDates.filter(d => d >= todayStr);

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
                    className="animate-pulse"
                    color="primary"
                    radius="sm"
                    variant="flat"
                    startContent={<Video size={14} />}
                >
                    Live Now
                </Button>
            );
        }

        if (isExpired) {
            return (
                <Button size="sm" variant="flat" color="default">
                    Completed
                </Button>
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
                    Starts in {(hoursUntil)?.toFixed(1)} hr
                </Button>
            );
        }

        return (
            <Button size="sm" variant="flat" color="warning">
                Upcoming
            </Button>
        );
    };

    const ScheduleCard = ({ schedule, type = 'allDates' }) => {
        const isLive = isClassLive(schedule, (type === 'normal' ? 'multiple' : 'single'));
        const isExpired = isClassExpired(schedule);
        const canJoin = isLive;
        const canResched = canReschedule(schedule);
        const canCanc = canCancel(schedule);

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap gap-2 mb-3">
                    {getClassStatusBadge(schedule, (type === 'normal' ? 'multiple' : 'single'))}
                    {type === 'allDates' && (getClassStatus(schedule, 'single') === 'Completed') && (
                        <Button
                            size="sm"
                            variant="flat"
                            color={schedule?.attendance?.includes(schedule.date) ? 'success' : 'danger'}
                        >
                            Attendance: {schedule?.attendance?.includes(schedule.date) ? 'Present' : 'Absent'}
                        </Button>
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
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">{schedule.title}</h2>
                {schedule.description && (
                    <p className="text-[#666666] text-sm mb-4 line-clamp-2">
                        {schedule.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-4 mb-4">
                    {type === 'normal' ? (
                        // For schedule overview (type='normal'), show the date range from scheduleDates
                        <>
                            <div className="flex text-[#666666] text-sm items-center gap-2">
                                <CiCalendar color="#666666" size={20} />
                                <p className="text-[#666666] text-sm">
                                    {schedule.scheduleDates?.length > 0 ? (
                                        <>
                                            {new Date(schedule.scheduleDates[0]).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                            {schedule.scheduleDates.length > 1 && (
                                                <>
                                                    {' - '}
                                                    {schedule?.isDateGenerated ? 'On Going' : new Date(schedule.scheduleDates[schedule.scheduleDates?.length - 1]).toDateString()}

                                                </>
                                            )}
                                            {' '}
                                            ({schedule.scheduleDates.length} {schedule.scheduleDates.length === 1 ? 'date' : 'dates'})
                                        </>
                                    ) : (
                                        dateFormatter(schedule.date)
                                    )}
                                </p>
                            </div>
                            <div className="flex text-[#666666] text-sm items-center gap-2">
                                <CalendarIcon color="#666666" size={18} />
                                <p className="text-[#666666] text-sm">
                                    {schedule.scheduleType || 'Recurring'}
                                    {schedule.repeatInterval && ` (Every ${schedule.repeatInterval} ${schedule.scheduleType === 'daily' ? 'day' : schedule.scheduleType === 'weekly' ? 'week' : 'month'})`}
                                </p>
                            </div>
                        </>
                    ) : (
                        // For date-grouped view, show the specific date
                        <>
                            <div className="flex text-[#666666] text-sm items-center gap-2">
                                <CiCalendar color="#666666" size={20} />
                                <p className="text-[#666666] text-sm">
                                    {dateFormatter(schedule.date)}
                                </p>
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-2">
                        <Clock color="#666666" size={18} />
                        <p className="text-[#666666] text-sm">
                            {formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}
                        </p>
                    </div>
                </div>
                {type === 'normal' &&
                    <Calendar
                        size="sm"
                        variant="underlined"
                        color='success'
                        isReadOnly
                        isDateUnavailable={(date) => {
                            const datesToCheck = schedule.scheduleDates?.length > 0 
                                ? schedule.scheduleDates 
                                : (schedule.date ? [schedule.date] : []);
                            return datesToCheck.includes(date.toString());
                        }}
                    />
                }
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
                                isDisabled={isMarking === schedule.id}
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

    if (error) {
        return <QueryError
            height="300px"
            error={error}
            onRetry={refetch}
            showLogo={false}
            isLoading={isFetching}
        />
    }

    return (
        <div className="h-full relative bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full no-scsrollbar top-0 bottom-0 overflow-auto">
            <DashHeading
                title="My Class Schedule"
                desc="View and manage your upcoming live classes"
            />

            <div className="grid grid-cols-12 gap-4 items-start mt-4">
                {viewType === 'allDates' ?
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner size="lg" color="success" />
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
                    :
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner size="lg" color="success" />
                            </div>
                        ) : scheduleData?.schedules?.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">No classes scheduled</p>
                            </div>
                        ) : (
                            scheduleData?.schedules?.map((i) => (
                                <div key={i.id} className="mb-6">
                                    <DashHeading
                                        title={i.scheduleDates?.length === 1 ? new Date(i.scheduleDates[0]).toDateString() : (new Date(i.scheduleDates[0]).toDateString()
                                            + ' to ' +
                                            new Date(i.scheduleDates[i.scheduleDates?.length - 1]).toDateString())}
                                    />
                                    <div className="mt-3">
                                        <ScheduleCard key={i.id} schedule={i} type="normal" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                }

                {/* Sidebar - Calendar & Filters */}
                <div className="col-span-12 sm:sticky top-2 order-1 lg:order-2  lg:col-span-4 space-y-4 mb-4">
                    {/* Quick Stats Card */}
                    {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Schedule Overview</h3>
                        {viewType === 'normal' ?
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
                            :
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#95C4BE33] p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-[#06574C]">
                                        {(() => {
                                            const todayStr = new Date().toISOString().split('T')[0];
                                            let count = 0;
                                            scheduleData?.schedules?.forEach(s => {
                                                const scheduleDates = s.scheduleDates || [];
                                                // Count each upcoming date individually
                                                const upcomingDates = scheduleDates.filter(d => d >= todayStr);
                                                count += upcomingDates.length;
                                            });
                                            return count;
                                        })()}
                                    </p>
                                    <p className="text-xs text-gray-600">Upcoming</p>
                                </div>
                                <div className="bg-[#E8F1FF] p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-[#3F86F2]">
                                        {(() => {
                                            const todayStr = new Date().toISOString().split('T')[0];
                                            let count = 0;
                                            scheduleData?.schedules?.forEach(s => {
                                                const scheduleDates = s.scheduleDates || [];
                                                // Count today's dates that are currently live
                                                if (scheduleDates.includes(todayStr)) {
                                                    const [startHour, startMin] = (s.startTime || "").split(":").map(Number);
                                                    const [endHour, endMin] = (s.endTime || "").split(":").map(Number);
                                                    const now = new Date();
                                                    const [year, month, day] = todayStr.split("-").map(Number);
                                                    const startTime = new Date(year, month - 1, day, startHour, startMin);
                                                    const endTime = new Date(year, month - 1, day, endHour, endMin);
                                                    if (now >= startTime && now <= endTime) {
                                                        count++;
                                                    }
                                                }
                                            });
                                            return count;
                                        })()}
                                    </p>
                                    <p className="text-xs text-gray-600">Live</p>
                                </div>
                            </div>
                        }
                    </div> */}

                    <div className="bg-white w-full space-y-4 p-4 rounded-lg shadow-sm">
                        <CustomCalendar
                            selectedDates={schedulesDates}
                            onDateClick={handleDateClick}
                            className="max-w-[330px] mx-auto"
                        />
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
                    </div>
                </div>
            </div>

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
                                        year: "numeric"
                                    })}
                                </p>
                            )}
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {schedulesForSelectedDate.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">No classes scheduled for this date</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {schedulesForSelectedDate.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {getClassStatusBadge(schedule, 'single')}
                                            {getClassStatus(schedule, 'single') === 'Completed' && (
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color={schedule?.attendance?.includes(schedule.date) ? 'secondary' : 'danger'}
                                                >
                                                    Attendance: {schedule?.attendance?.includes(schedule.date) ? 'Present' : 'Absent'}
                                                </Button>
                                            )}
                                            {schedule.courseName && (
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="success"
                                                >
                                                    Course: {schedule.courseName}
                                                </Button>
                                            )}
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
                                                <span>
                                                    {dateFormatter(schedule.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Clock size={18} />
                                                <span>
                                                    {formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}
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
                        <Button
                            variant="flat"
                            onPress={() => closeDateModal()}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
                        // isDisabled={isCancelling}
                        >
                            No, Keep It
                        </Button>
                        <Button
                            color="danger"
                            onPress={confirmCancelClass}
                        // isLoading={isCancelling}
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

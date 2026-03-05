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
import { Clock, Lock, Video, Calendar as CalendarIcon, User, MapPin, PlusIcon } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { Calendar } from "@heroui/react";
import {
    useGetScheduleQuery,
    useDeleteScheduleMutation,
} from "../../../redux/api/schedules";
import { useCreateRescheduleRequestMutation } from "../../../redux/api/reschedule";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { formatTime12Hour, isClassLive, isClassExpired, getStatusColor, getStatusText, getStatusTextForSingleDate, getHoursUntilClass } from "../../../utils/scheduleHelpers";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { dateFormatter } from "../../../lib/utils";

const TeacherClassSheduling = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isMarking, setIsMarking] = useState(false);
    const [viewType, setViewType] = useState('normal');

    const { onOpenChange, isOpen } = useDisclosure()

    const { data: scheduleData, isLoading } = useGetScheduleQuery({
        page: "1",
        limit: "100",
        status: filterStatus === "all" ? undefined : filterStatus,
    });

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
    const handleDelete = async (id) => {
        try {
            if (!id) {
                errorMessage('Schedule not selected');
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





    const handleCancelClass = (schedule) => {
        setSelectedSchedule(schedule);
        onOpenChange(true);
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
            const scheduleDates = schedule.scheduleDates || [];
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
                    Starts in {(hoursUntil)?.toFixed(1)} hr
                </Button>
            );
        }

        return (
            <Chip size="sm" variant="flat" color="warning">
                Upcoming
            </Chip>
        );
    };

    const ScheduleCard = ({ schedule, type = 'allDates' }) => {
        const isLive = isClassLive(schedule);
        const isExpired = isClassExpired(schedule);
        const canJoin = isLive && schedule.meetingLink;
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap gap-2 mb-3">
                    {getClassStatusBadge(schedule, (type === 'normal' ? 'multiple' : 'single'))}
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
                <p className="text-[#666666] text-sm mb-4 line-clamp-2">
                    {schedule.scheduleDates?.length === 1 ? new Date(schedule.scheduleDates[0]).toDateString() : (new Date(schedule.scheduleDates[0]).toDateString()
                        + ' - to - ' +
                        new Date(schedule.scheduleDates[schedule.scheduleDates?.length - 1]).toDateString())}
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex text-[#666666] text-sm items-center gap-2">
                        {type === 'normal' ? "CreatedAt: " : <CiCalendar color="#666666" size={20} />}
                        <p className="text-[#666666] text-sm">
                            {dateFormatter(schedule.date, true)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock color="#666666" size={18} />
                        <p className="text-[#666666] text-sm">
                            {formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}
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
                        {type === 'normal' && (
                            <>

                                <Button
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    color="success"
                                    onPress={() => navigate('/teacher/class-scheduling/manage', { state: schedule })}
                                >
                                    Reschedule
                                </Button>
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


    return (
        <div className="h-full relative bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full nddo-scrollbar top-0 bottom-0 overflow-auto">
            <div className="flex items-center max-sm:flex-wrap justify-between gap-2">
                <DashHeading
                    title="My Course's Schedules"
                    desc="View and manage your upcoming live course's schedules"
                />
                <Button
                    startContent={<PlusIcon />}
                    radius="sm"
                    size="md"
                    color="success"
                    as={Link}
                    // onPress={() => navigate('/teacher/class-scheduling/manage',{state:})}
                    to="/teacher/class-scheduling/manage"
                >
                    Schedule New
                </Button>
            </div>
            <div className="flex items-center max-sm:flex-wrap gap-2">
                <Button
                    radius="sm"
                    size="sm"
                    onPress={() => setViewType('normal')}
                    variant={viewType === 'normal' ? 'solid' : 'bordered'}
                    color="success"
                >
                    View Schedule By Course
                </Button>
                <Button
                    radius="sm"
                    size="sm"
                    variant={viewType === 'allDates' ? 'solid' : 'bordered'}
                    color="success"
                    onPress={() => setViewType('allDates')}
                >
                    View Schedule By Date
                </Button>
            </div>
            <div className="grid grid-cols-12 gap-4 items-start mt-4">
                {viewType === 'allDates' ? <div className="col-span-12 lg:col-span-8">
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
                    <div className="col-span-12 lg:col-span-8">
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
                                            + ' - to - ' +
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
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    {/* Quick Stats Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
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
                    </div>
                </div>
            </div>
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
                        <h2 className="text-lg font-semibold text-[#06574C]">Delete Schdule</h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedSchedule && (
                            <>
                                <p className="text-gray-700">
                                    Are you sure you want to cancel this schdule?
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
                                        <strong>⚠️ Note:</strong> This action will notify the admin and students.
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
        </div >
    );
};

export default TeacherClassSheduling;

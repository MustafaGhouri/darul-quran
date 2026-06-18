import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Chip,
    Button,
    DateRangePicker,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, Clock, Calendar, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import CourseSelect from "../../../components/select/CourseSelect";
import { useGetIndividualStudentAttendanceHistoryQuery } from "../../../redux/api/attendance";
import { dateFormatter } from "../../../lib/utils";
import { formatTime12Hour } from "../../../utils/scheduleHelpers";

const StudentAttendanceDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [courseId, setCourseId] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [selectedDateGroup, setSelectedDateGroup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Formatting date helper for API
    const formatDateForApi = (calendarDate) => {
        if (!calendarDate) return null;
        return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
    };

    const startDate = formatDateForApi(dateRange?.start);
    const endDate = formatDateForApi(dateRange?.end);

    const { data, isFetching } = useGetIndividualStudentAttendanceHistoryQuery({
        studentId,
        courseId,
        startDate,
        endDate,
    }, { skip: !studentId });

    const history = data?.history || [];

    // Memoize attendance status calculation for efficiency
    const getAttendanceStatus = useCallback((item) => {
        let statusColor = "danger";
        let displayStatus = item.status;
        let notes = "-";
        let isLate = false;
        let isEarly = false;

        const normalizedStatus = String(item.status || '').toLowerCase();

        if (normalizedStatus === 'attended' || normalizedStatus === 'present') {
            statusColor = "success";
            displayStatus = item.status || "Present";

            if (item.joinedAt && item.startTime) {
                const joinedTime = new Date(item.joinedAt);
                const scheduleDateString = item.date.split('T')[0];
                const expectedStart = new Date(`${scheduleDateString}T${item.startTime}`);

                const lateThreshold = 15 * 60 * 1000; // 15 mins grace period
                const earlyThreshold = 10 * 60 * 1000; // 10 mins early threshold

                if (joinedTime.getTime() > expectedStart.getTime() + lateThreshold) {
                    statusColor = "warning";
                    displayStatus = "Late";
                    notes = `Joined at ${joinedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    isLate = true;
                } else if (joinedTime.getTime() < expectedStart.getTime() - earlyThreshold) {
                    isEarly = true;
                    notes = `Joined early at ${joinedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                } else {
                    notes = `Joined on time at ${joinedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
            } else if (item.joinedAt) {
                notes = `Joined at ${new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
        } else if (normalizedStatus === 'missed' || normalizedStatus === 'absent') {
            displayStatus = item.status || "Missed";
            notes = "No attendance recorded";
        }

        return { statusColor, displayStatus, notes, isLate, isEarly };
    }, []);

    // Memoize grouped attendance by date for efficient rendering
    const groupedAttendance = useMemo(() => {
        const grouped = new Map();

        history.forEach((item) => {
            const dateKey = item.date.split('T')[0];

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, {
                    dateKey,
                    date: item.date,
                    records: [],
                });
            }

            grouped.get(dateKey).records.push(item);
        });

        return Array.from(grouped.values()).sort(
            (a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime(),
        );
    }, [history]);

    const getSummaryStatus = useCallback((records) => {
        const normalizedStatuses = records.map((record) => String(record.status || '').toLowerCase());
        const presentCount = normalizedStatuses.filter((status) => status === 'present' || status === 'attended').length;
        const missedCount = normalizedStatuses.filter((status) => status === 'missed' || status === 'absent').length;

        if (records.length === 0) {
            return { label: "No Records", color: "default" };
        }

        if (presentCount === records.length) {
            return { label: "Present", color: "success" };
        }

        if (missedCount === records.length) {
            return { label: "Missed", color: "danger" };
        }

        return { label: "Mixed", color: "warning" };
    }, []);

    // Handle opening modal with attendance details
    const handleViewDetails = (dateGroup) => {
        setSelectedDateGroup(dateGroup);
        setIsModalOpen(true);
    };

    const renderStatusChip = (status) => {
        return (
            <Chip
                size="sm"
                variant="flat"
                color={status.color}
                className="font-semibold px-2"
            >
                {status.label}
            </Chip>
        );
    };

    return (
        <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-8 min-h-screen">
            <div className="pt-4 mb-4">
                <Button
                    variant="light"
                    startContent={<ArrowLeft size={18} />}
                    onPress={() => navigate(-1)}
                    className="font-medium text-gray-600 hover:text-[#06574C] transition-colors"
                >
                    Back to Students List
                </Button>
            </div>

            <DashHeading
                title={"Student Attendance Details"}
                desc={"Detailed view of the student's attendance history"}
            />

            <div className="bg-[#EBD4C9] p-4 rounded-lg my-4 flex max-sm:flex-wrap gap-4 items-end shadow-sm w-full">
                <div>
                    <CourseSelect
                        label="Course Filter (Optional)"
                        onChange={(id) => setCourseId(id ? id : null)}
                    />
                </div>

                <DateRangePicker
                    label="Date Range (Optional)"
                    labelPlacement="outside"
                    size="lg"
                    radius="lg"
                    className="max-w-[300px]"
                    value={dateRange}
                    onChange={setDateRange}
                />
                {(dateRange?.start || dateRange?.end) &&
                    <Button size="lg" onPress={() => setDateRange(null)} className="text-2xl" isIconOnly variant="bordered" color="success">
                        &times;
                    </Button>}
            </div>

            {/* Main Attendance Table - Simplified View */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
                <Table
                    aria-label="Student Attendance Table"
                    removeWrapper
                    classNames={{
                        base: "w-full overflow-x-auto h-[calc(100vh-350px)] no-scrollbar",
                        th: "bg-[#FBF4EC] text-black font-bold py-4 px-6 text-sm uppercase tracking-wider",
                        td: "py-4 px-6 border-b border-gray-50",
                        tr: "hover:bg-gray-50/50 transition-colors",
                    }}
                >
                    <TableHeader>
                        <TableColumn>DATE</TableColumn>
                        <TableColumn>ATTENDANCE STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={groupedAttendance}
                        loadingState={isFetching ? 'loading' : 'idle'}
                        loadingContent={<Spinner color="success" size="lg" />}
                        emptyContent={"No attendance records found"}
                    >
                        {(dateGroup) => {
                            const summaryStatus = getSummaryStatus(dateGroup.records);

                            return (
                            <TableRow key={dateGroup.dateKey}>
                                <TableCell className="text-gray-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        {dateFormatter(dateGroup.date)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {renderStatusChip(summaryStatus)}
                                        <span className="text-xs text-gray-500">
                                            {dateGroup.records.length} record{dateGroup.records.length > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        color="success"
                                        onPress={() => handleViewDetails(dateGroup)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                            );
                        }}
                    </TableBody>
                </Table>
            </div>

            {/* Detailed Attendance Modal */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                size="lg"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader >
                                <div className="flex items-center gap-2">
                                    <BookOpen size={20} />
                                    <span className="text-lg font-bold">Attendance Details</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {selectedDateGroup && (
                                    <div className="space-y-4 py-2">
                                        {/* Date Section */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar size={18} className="text-[#06574C]" />
                                                <span className="font-semibold text-gray-700">Date</span>
                                            </div>
                                            <p className="text-gray-600 ml-6">
                                                {dateFormatter(selectedDateGroup.date)}
                                            </p>
                                        </div>

                                        {selectedDateGroup.records.map((attendance, index) => (
                                            <div key={`${attendance.scheduleId || index}-${attendance.joinedAt || attendance.date}`} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                                <div className="mb-4 flex items-center justify-between gap-3">
                                                    <span className="font-semibold text-gray-800">
                                                        Record {index + 1}
                                                    </span>
                                                    <Chip
                                                        size="sm"
                                                        variant="flat"
                                                        color={String(attendance.status || '').toLowerCase() === 'present' || String(attendance.status || '').toLowerCase() === 'attended' ? 'success' : 'danger'}
                                                        className="font-semibold px-2 capitalize"
                                                    >
                                                        {attendance.status}
                                                    </Chip>
                                                </div>

                                                {/* Course Information */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <BookOpen size={18} className="text-[#06574C]" />
                                                        <span className="font-semibold text-gray-700">Course Information</span>
                                                    </div>
                                                    <div className="ml-6 space-y-1">
                                                        <p className="text-gray-800 font-medium">
                                                            {attendance.courseName || "N/A"}
                                                        </p>
                                                        {attendance.courseId && (
                                                            <p className="text-sm text-gray-500">
                                                                Course ID: {attendance.courseId}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Schedule Information */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Clock size={18} className="text-[#06574C]" />
                                                        <span className="font-semibold text-gray-700">Schedule Details</span>
                                                    </div>
                                                    <div className="ml-6 space-y-2">
                                                        <p className="text-gray-800 font-medium">
                                                            {attendance.title || "N/A"}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                Start: {formatTime12Hour(attendance.startTime)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                End: {formatTime12Hour(attendance.endTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Attendance Status */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle size={18} className="text-[#06574C]" />
                                                        <span className="font-semibold text-gray-700">Attendance Status</span>
                                                    </div>
                                                    <div className="ml-6 space-y-2">
                                                {attendance.joinedAt && (
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Joined at:</span>{" "}
                                                        {new Date(attendance.joinedAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </p>
                                                )}
                                                {attendance.leftAt && (
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Left at:</span>{" "}
                                                        {new Date(attendance.leftAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </p>
                                                )}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertCircle size={18} className="text-[#06574C]" />
                                                        <span className="font-semibold text-gray-700">Notes</span>
                                                    </div>
                                                    <p className="text-gray-600 ml-6 italic">
                                                        {getAttendanceStatus(attendance).notes}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="border-t">
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default StudentAttendanceDetails;

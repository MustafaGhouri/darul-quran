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
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import CourseSelect from "../../../components/select/CourseSelect";
import { useGetIndividualStudentAttendanceHistoryQuery } from "../../../redux/api/attendance";
import { dateFormatter } from "../../../lib/utils";
import { formatTime12Hour } from "../../../utils/scheduleHelpers";
import { getLocalTimeZone, today } from "@internationalized/date";

const StudentAttendanceDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const [courseId, setCourseId] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    // Formatting date helper for API
    const formatDateForApi = (calendarDate) => {
        if (!calendarDate) return null;
        return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
    };

    const startDate = formatDateForApi(dateRange?.start);
    const endDate = formatDateForApi(dateRange?.end);

    const { data, isLoading } = useGetIndividualStudentAttendanceHistoryQuery({
        studentId,
        courseId,
        startDate,
        endDate,
    }, { skip: !studentId });

    const history = data?.history || [];

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

            <div className="bg-[#EBD4C9] p-4 rounded-lg my-4 flex flex-col sm:flex-row  gap-4 items-end shadow-sm w-full">
                <div className=" ">
                    <CourseSelect
                        label="Course Filter"
                        onChange={(id) => setCourseId(id ? id : null)}
                    />
                </div>
                
                <DateRangePicker
                    label="Date Range"
                    labelPlacement="outside"
                    size="lg"
                    radius="lg"
                    className=" max-w-[300px]"
                    value={dateRange}
                    onChange={setDateRange}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
                <Table
                    aria-label="Student Attendance Details Table"
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
                        <TableColumn>COURSE NAME</TableColumn>
                        <TableColumn>SCHEDULE</TableColumn>
                        <TableColumn>ATTENDANCE STATUS</TableColumn>
                        <TableColumn>NOTES</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={history}
                        isLoading={isLoading}
                        loadingContent={<Spinner color="success" size="lg" />}
                        emptyContent={isLoading ? " " : "No attendance records found"}
                    >
                        {(item) => {
                            // Determine status formatting
                            let statusColor = "danger";
                            let displayStatus = item.status;
                            let notes = "-";

                            if (item.status === 'Attended') {
                                statusColor = "success";
                                
                                // Simple late logic: if joined at is more than 5 mins after start time
                                if (item.joinedAt && item.startTime) {
                                    const joinedTime = new Date(item.joinedAt);
                                    const scheduleDateString = item.date.split('T')[0];
                                    const expectedStart = new Date(`${scheduleDateString}T${item.startTime}`);
                                    
                                    // Add 15 mins grace period
                                    const gracePeriod = 15 * 60 * 1000;
                                    if (joinedTime.getTime() > expectedStart.getTime() + gracePeriod) {
                                        statusColor = "warning";
                                        displayStatus = "Late";
                                        notes = `Joined at ${joinedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                    } else {
                                        notes = `Joined on time`;
                                    }
                                } else if (item.joinedAt) {
                                    notes = `Joined at ${new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                }
                            }

                            return (
                                <TableRow key={item.scheduleId}>
                                    <TableCell className="text-gray-600 font-medium">
                                        {dateFormatter(item.date)}
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-800">
                                        {item.courseName || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">
                                                {item.title}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={statusColor}
                                            className={`font-semibold px-2 ${statusColor === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}`}
                                        >
                                            {displayStatus}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm italic">
                                        {notes}
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default StudentAttendanceDetails;

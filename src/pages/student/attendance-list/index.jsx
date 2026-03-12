import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DateRangePicker,
  Pagination,
} from "@heroui/react";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetIndividualStudentAttendanceHistoryQuery } from "../../../redux/api/attendance";
import { formatTime12Hour } from "../../../utils/scheduleHelpers";
import { dateFormatter } from "../../../lib/utils";

const AttendanceList = () => {
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [page, setPage] = useState(1);

  const formatDateForApi = (calendarDate) => {
    if (!calendarDate) return null;
    return `${calendarDate.year}-${String(calendarDate.month).padStart(2, "0")}-${String(calendarDate.day).padStart(2, "0")}`;
  };

  const startDate = formatDateForApi(dateRange?.start);
  const endDate = formatDateForApi(dateRange?.end);

  const { data, isLoading } = useGetIndividualStudentAttendanceHistoryQuery(
    { studentId: user?.id, startDate, endDate },
    { skip: !user?.id },
  );

  const history = data?.history || [];

  const rowsPerPage = 10;
  const pages = Math.ceil(history.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return history.slice(start, end);
  }, [page, history]);

  useEffect(() => {
    setPage(1);
  }, [dateRange]);

  const getAttendanceStatus = (item) => {
    let statusColor = "danger";
    let displayStatus = item.status || "Missed";
    let notes = "-";
    let isLate = false;
    let isEarly = false;

    if (item.status === "Attended") {
      statusColor = "success";

      if (item.joinedAt && item.startTime) {
        const joinedTime = new Date(item.joinedAt);
        const scheduleDateString = item.date?.split("T")[0];
        const expectedStart = new Date(
          `${scheduleDateString}T${item.startTime}`,
        );

        const lateThreshold = 15 * 60 * 1000; // 15 mins grace period
        const earlyThreshold = 10 * 60 * 1000; // 10 mins early threshold

        if (joinedTime.getTime() > expectedStart.getTime() + lateThreshold) {
          statusColor = "warning";
          displayStatus = "Late";
          notes = `Joined at ${joinedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          isLate = true;
        } else if (
          joinedTime.getTime() <
          expectedStart.getTime() - earlyThreshold
        ) {
          isEarly = true;
          notes = `Joined early at ${joinedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        } else {
          notes = `Joined on time at ${joinedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
      } else if (item.joinedAt) {
        notes = `Joined at ${new Date(item.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      }
    } else if (item.status === "Missed" || !item.status) {
      notes = "No attendance recorded";
    }

    return { statusColor, displayStatus, notes, isLate, isEarly };
  };

  const handleViewDetails = (item) => {
    setSelectedAttendance(item);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-8">
      <div className="pt-4">
        <DashHeading
          title={"Attendance List"}
          desc={"Track your attendance and course progress"}
        />
      </div>
      <div className=" flex flex-col items-center">
        <div className="bg-[#EBD4C9] p-4 rounded-lg flex max-sm:flex-wrap gap-4 items-end shadow-sm w-full">
          <DateRangePicker
            label="Date Range"
            labelPlacement="outside"
            size="lg"
            radius="lg"
            className="max-w-[300px]"
            value={dateRange}
            onChange={setDateRange}
          />
          {(dateRange?.start || dateRange?.end) && (
            <Button
              size="lg"
              onPress={() => setDateRange(null)}
              className="text-2xl"
              isIconOnly
              variant="bordered"
              color="success"
            >
              &times;
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center p-10 w-full">
            <Spinner color="success" size="lg" />
          </div>
        ) : (
          <Table
            aria-label="Student Attendance History Table"
            className="mt-6"
            removeWrapper
            classNames={{
              base: "w-full bg-white rounded-lg overflow-x-auto no-scrollbar shadow-md h-[calc(100vh-300px)]",
              th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
              td: "py-3 items-center whitespace-nowrap",
              tr: "border-b border-default-200",
            }}
          >
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>ATTENDANCE STATUS</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <p>No attendance history found.</p>
                </div>
              }
            >
              {items.map((record, index) => {
                const { statusColor, displayStatus } =
                  getAttendanceStatus(record);
                return (
                  <TableRow key={record.scheduleId || index}>
                    <TableCell className="font-medium text-gray-700">
                      {dateFormatter(record.date)}
                    </TableCell>
                    <TableCell>
                      <Chip variant="flat" color={statusColor} size="sm">
                        {displayStatus}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        color="success"
                        onPress={() => handleViewDetails(record)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
         <div className="flex w-full justify-center mt-4 mb-4">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="success"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
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
              <ModalHeader>
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span className="text-lg font-bold">Attendance Details</span>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedAttendance && (
                  <div className="space-y-4 py-2">
                    {/* Date Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-[#06574C]" />
                        <span className="font-semibold text-gray-700">
                          Date
                        </span>
                      </div>
                      <p className="text-gray-600 ml-6">
                        {dateFormatter(selectedAttendance.date)}
                      </p>
                    </div>

                    {/* Course Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} className="text-[#06574C]" />
                        <span className="font-semibold text-gray-700">
                          Course Information
                        </span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <p className="text-gray-800 font-medium">
                          {selectedAttendance.courseName || "N/A"}
                        </p>
                        {selectedAttendance.courseId && (
                          <p className="text-sm text-gray-500">
                            Course ID: {selectedAttendance.courseId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-[#06574C]" />
                        <span className="font-semibold text-gray-700">
                          Schedule Details
                        </span>
                      </div>
                      <div className="ml-6 space-y-2">
                        <p className="text-gray-800 font-medium">
                          {selectedAttendance.title || "N/A"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Start:{" "}
                            {formatTime12Hour(selectedAttendance.startTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            End: {formatTime12Hour(selectedAttendance.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-[#06574C]" />
                        <span className="font-semibold text-gray-700">
                          Attendance Status
                        </span>
                      </div>
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center gap-3">
                          <Chip
                            size="md"
                            variant="flat"
                            color={
                              getAttendanceStatus(selectedAttendance)
                                .statusColor
                            }
                            className="font-semibold"
                          >
                            {
                              getAttendanceStatus(selectedAttendance)
                                .displayStatus
                            }
                          </Chip>
                        </div>
                        {selectedAttendance.joinedAt && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Joined at:</span>{" "}
                            {new Date(
                              selectedAttendance.joinedAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        )}
                        {selectedAttendance.leftAt && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Left at:</span>{" "}
                            {new Date(
                              selectedAttendance.leftAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Late/Early Analysis */}
                    {selectedAttendance.status === "Attended" &&
                      selectedAttendance.joinedAt && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-[#06574C]" />
                            <span className="font-semibold text-gray-700">
                              Timing Analysis
                            </span>
                          </div>
                          <div className="ml-6 space-y-2">
                            {getAttendanceStatus(selectedAttendance).isLate && (
                              <div className="flex items-start gap-2">
                                <XCircle
                                  size={16}
                                  className="text-orange-500 mt-0.5"
                                />
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium text-orange-600">
                                    Late Arrival:
                                  </span>{" "}
                                  Joined 15+ minutes after scheduled start time
                                </p>
                              </div>
                            )}
                            {getAttendanceStatus(selectedAttendance)
                              .isEarly && (
                              <div className="flex items-start gap-2">
                                <CheckCircle
                                  size={16}
                                  className="text-green-500 mt-0.5"
                                />
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium text-green-600">
                                    Early Arrival:
                                  </span>{" "}
                                  Joined before scheduled start time
                                </p>
                              </div>
                            )}
                            {!getAttendanceStatus(selectedAttendance).isLate &&
                              !getAttendanceStatus(selectedAttendance)
                                .isEarly && (
                                <div className="flex items-start gap-2">
                                  <CheckCircle
                                    size={16}
                                    className="text-green-500 mt-0.5"
                                  />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium text-green-600">
                                      On Time:
                                    </span>{" "}
                                    Joined within the grace period
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      )}

                    {/* Notes */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-[#06574C]" />
                        <span className="font-semibold text-gray-700">
                          Notes
                        </span>
                      </div>
                      <p className="text-gray-600 ml-6 italic">
                        {getAttendanceStatus(selectedAttendance).notes}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t">
                <Button variant="light" onPress={onClose}>
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

export default AttendanceList;

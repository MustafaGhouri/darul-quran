import {
  Button,
  Link,
  Progress,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Spinner,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Download,
  Eye,
  ListFilterIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  useGetCourseAttendanceSummaryQuery,
  useGetCourseAttendanceDetailQuery,
} from "../../../redux/api/attendance";
import { useGetTopPerformingStudentsQuery } from "../../../redux/api/enrollmentAdmin";
import { dateFormatter } from "../../../lib/utils";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const Attendance = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailPage, setDetailPage] = useState(1);
  const [type, setType] = useState('all');

  const {
    data: attendanceData,
    isFetching,
    refetch,
  } = useGetCourseAttendanceSummaryQuery({
    page,
    limit,
    search,
    sort,
    status: status === "all" ? undefined : status,
    type
  });

  const { data: topStudentsData } = useGetTopPerformingStudentsQuery({
    page: 1,
    limit: 3,
    sortBy: "progress",
  });

  const {
    data: courseDetailData,
    isFetching: isDetailLoading,
  } = useGetCourseAttendanceDetailQuery(
    { courseId: selectedCourse?.id, page: detailPage, limit: 10 },
    { skip: !selectedCourse || !isDetailModalOpen }
  );

  const handleViewDetail = (course) => {
    setSelectedCourse(course);
    setDetailPage(1);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCourse(null);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "archived", label: "Archived" },
  ];

  const sortOptions = [
    { key: "latest", label: "Latest" },
    { key: "oldest", label: "Oldest" },
    { key: "a-z", label: "A-Z" },
    { key: "z-a", label: "Z-A" },
    { key: "highest_attendance", label: "Highest Attendance" },
    { key: "lowest_attendance", label: "Lowest Attendance" },
  ];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (attendanceData?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const exportCourseAttendance = () => {
    if (!attendanceData?.courses || attendanceData.courses.length === 0) {
     errorMessage("No data to export");
      return;
    }

    const headers = [
      "Course Name",
      "Type",
      "Status",
      "Created At",
      "Category",
      "Total Enrollments",
      "Attended Count",
      "Attendance Rate (%)",
      "Total Completed Lessons",
      "Avg Progress Rate (%)",
    ];

    const rows = attendanceData.courses.map((course) => [
      course.courseName,
      course.type,
      course.status,
      course.createdAt,
      course.categoryName || "N/A",
      course.totalEnrollments,
      course.attendedCount,
      course.attendanceRate,
      course.totalCompletedLessons,
      course.avgProgressRate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    downloadCSV(csvContent, "course_attendance_summary.csv");
    successMessage("Course attendance data exported successfully");
  };

  const exportTopStudents = () => {
    if (!topStudentsData?.students || topStudentsData.students.length === 0) {
      errorMessage("No data to export");
      return;
    }

    const headers = [
      "Student ID",
      "First Name",
      "Last Name",
      "Email",
      "Enrollment ID",
      "Course ID",
      "Course Name",
      "Enrolled At",
      "Payment Status",
      "Progress Status",
      "Completed Lessons",
      "Total Lessons",
      "Progress Rate (%)",
      "Is Completed",
    ];

    const rows = topStudentsData.students.map((student) => [
      student.studentId,
      student.firstName,
      student.lastName,
      student.email,
      student.enrollmentId,
      student.courseId,
      student.courseName,
      student.enrolledAt,
      student.paymentStatus,
      student.progressStatus,
      student.completedLessonsCount,
      student.totalLessons,
      student.progressRate,
      student.isCompleted,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    downloadCSV(csvContent, "top_performing_students.csv");
   successMessage("Top performing students data exported successfully");
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5">
      <DashHeading
        title={"Attendance & Progress"}
        desc={"Track student attendance and course progress"}
      />

      {/* Filters */}
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={handleSearchChange}
            className="min-w-[200px] flex-1"
            radius="sm"
          />
          {/* <Select
            className="min-w-[130px]  flex-1"
            radius="sm"
            selectedKeys={[status]}
            onSelectionChange={(keys) => setStatus(Array.from(keys)[0])}
            placeholder="Select status"
          >
            {statuses.map((statusOption) => (
              <SelectItem key={statusOption.key}>{statusOption.label}</SelectItem>
            ))}
          </Select> */}
          <Select
            radius="sm"
            className="min-w-[150px]  flex-1"
            selectedKeys={[sort]}
            onSelectionChange={(keys) => setSort(Array.from(keys)[0])}
            selectorIcon={<ListFilterIcon />}
            placeholder="Sort by"
          >
            {sortOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            radius="sm"
            placeholder="Select Type"
            title="Select Type"
            className="w-xl flex-1"
            onSelectionChange={(k) => {
              const keys = [...k];
              setType(keys[0]);
            }}
          // defaultSelectedKeys={["all"]}
          >
            <SelectItem key="all" value="all" className="capitalize">
              All Courses
            </SelectItem>

            <SelectItem key="one_time" value="one_time" className="capitalize">
              One Time Paid
            </SelectItem>

            <SelectItem key="live" value="live" className="capitalize">
              Live Classes
            </SelectItem>
          </Select>
        </div>
        <Button
          radius="sm"
          size="md"
          startContent={<Download color="white" size={15} />}
          color="success"
          onPress={exportCourseAttendance}
        >
          Export Courses
        </Button>
      </div>


      <Table
        aria-label="Attendance Table"
        removeWrapper
        classNames={{
          base: "table-fixed w-full bg-white rounded-lg min-h-[500px] overflow-y-auto",
          th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] cursor-default",
          td: "py-3 align-center",
          tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936]",
        }}
      >
        <TableHeader>
          <TableColumn >Session</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Enrollments</TableColumn>
          <TableColumn>Attended</TableColumn>
          <TableColumn>Progress Rate</TableColumn>
          <TableColumn>Attendance Rate</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody loadingContent={<Spinner color="success" />} loadingState={isFetching ? 'loading' : 'idle'} emptyContent={"No courses found"}>
          {attendanceData?.courses?.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="px-4 flex items-center gap-2">
                    {course.courseName}
              </TableCell>

              <TableCell>
                {new Date(course.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="capitalize">{course.type?.replace("_", '')}</TableCell>
              <TableCell>{course.totalEnrollments}</TableCell>
              <TableCell>{course.attendedCount}</TableCell>
              <TableCell>
                <div className="flex justify-between items-center gap-2">
                  <Progress
                    classNames={{ indicator: "bg-[#95C4BE]" }}
                    size="sm"
                    value={course.avgProgressRate}
                  />
                  <p className="text-end text-sm font-medium">
                    {course.avgProgressRate?.toFixed(0)}%
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-between items-center gap-2">
                  <Progress
                    classNames={{ indicator: "bg-[#95C4BE]" }}
                    size="sm"
                    value={course.attendanceRate}
                  />
                  <p className="text-end text-sm font-medium">
                    {course.attendanceRate}%
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  radius="sm"
                  className="bg-[#06574C] text-white"
                  startContent={<Eye size={18} color="white" />}
                  onPress={() => handleViewDetail(course)}
                >
                  View Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {attendanceData?.totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, attendanceData.total)} of{" "}
            {attendanceData.total} entries
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={page === 1}
              onPress={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {attendanceData.totalPages}
            </span>
            <Button
              size="sm"
              disabled={page === attendanceData.totalPages}
              onPress={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <div className="bg-white px-4 py-3 rounded-lg my-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Top Performing Students</h1>
          <Button
            radius="sm"
            size="sm"
            startContent={<Download color="white" size={15} />}
            color="success"
            onPress={exportTopStudents}
          >
            Export Attendence
          </Button>
        </div>

        {topStudentsData?.students?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No students found</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topStudentsData?.students?.map((s, i) => (
              <div
                key={i}
                className="rounded-lg px-4 py-6 bg-[#EAF6F4] shadow-sm flex flex-col justify-between"
                style={{ minHeight: 120 }}
              >
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {s.firstName} {s.lastName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{s.courseName}</div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#06574C] font-semibold">
                      Progress
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {s.progressRate}%
                    </div>
                  </div>

                  <Progress
                    className="h-2 rounded-full"
                    classNames={{ indicator: "bg-[#95C4BE]" }}
                    showValueLabel={false}
                    size="md"
                    value={s.progressRate}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedCourse?.courseName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCourse?.description}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                {isDetailLoading ? <Spinner color="success" size="lg" /> : <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#EAF6F4] p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Total Enrollments</p>
                      <p className="text-2xl font-bold text-[#06574C]">
                        {courseDetailData?.course?.totalEnrollments || 0}
                      </p>
                    </div>
                    <div className="bg-[#EAF6F4] p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Attended Students</p>
                      <p className="text-2xl font-bold text-[#06574C]">
                        {courseDetailData?.course?.attendedCount || 0}
                      </p>
                    </div>
                    <div className="bg-[#EAF6F4] p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-[#06574C]">
                        {selectedCourse?.attendanceRate || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-3">Student Attendance Details</h3>
                    <Table
                      aria-label="Student attendance table"
                      removeWrapper
                      classNames={{
                        base: "table-fixed w-full bg-white rounded-lg overflow-y-auto",
                        th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] cursor-default",
                        td: "py-3 align-center",
                        tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936]",
                      }}
                    >
                      <TableHeader>
                        <TableColumn>Student</TableColumn>
                        <TableColumn>Enrolled</TableColumn>
                        <TableColumn>Sessions</TableColumn>
                        <TableColumn>Rate</TableColumn>
                      </TableHeader>
                      <TableBody
                        emptyContent={
                          <p className="text-center py-4">No students found</p>
                        }
                      >
                        {courseDetailData?.students?.map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {dateFormatter(student.enrolledAt)}
                            </TableCell>
                            <TableCell>
                              {student.attendedSessions ? `${student.attendedSessions} / ${student.totalSessions}` : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  size="sm"
                                  value={student.attendanceRate}
                                  classNames={{ indicator: "bg-[#95C4BE]" }}
                                />
                                <span className="text-sm">{student.attendanceRate}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {courseDetailData?.totalPages > 1 && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        size="sm"
                        disabled={detailPage === 1}
                        onPress={() => {
                          setDetailPage(detailPage - 1);
                        }}
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-1 text-sm">
                        {detailPage} / {courseDetailData.totalPages}
                      </span>
                      <Button
                        size="sm"
                        disabled={detailPage === courseDetailData.totalPages}
                        onPress={() => {
                          setDetailPage(detailPage + 1);
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>}
              </ModalBody>

              <ModalFooter>
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

export default Attendance;

import { Button, Calendar, Chip, Input, Tab, Tabs } from "@heroui/react";
import {
  Clock,
  Download,
  Plus,
  Search,
  UsersRound,
  Video,
} from "lucide-react";
import { AiOutlineBook, AiOutlineLineChart } from "react-icons/ai";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { RiDeleteBin6Line, RiGroupLine } from "react-icons/ri";
import { IoBulbOutline } from "react-icons/io5";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { PiFilePdfDuotone } from "react-icons/pi";
import { FaClipboardList, FaRegLightbulb } from "react-icons/fa";
import { TbListCheck } from "react-icons/tb";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetCourseByTeacherIdQuery,
  useGetCourseFilesQuery,
  useGetCourseStudentsQuery,
} from "../../../redux/api/courses";
import { useGetCourseAttendanceDetailQuery } from "../../../redux/api/attendance";
import { debounce } from '../../../lib/utils';
import Loader from "../../../components/Loader";
import QueryError from "../../../components/QueryError";

const MyCourses = () => {
  const { id: courseId } = useParams();
  const [activeTab, setActiveTab] = useState("materials");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: courseData,
    isLoading: courseLoading,
    refetch: refetchCourse,
    error,
  } = useGetCourseByTeacherIdQuery(
    { courseId, includeSchedules: true, includeStats: true },
    { skip: !courseId }
  );

  const { data: filesData, isLoading: filesLoading } = useGetCourseFilesQuery(
    {
      courseId,
      page: 1,
      limit: 50,
      search: searchQuery,
      includeCourse: false,
    },
    {
      skip: !courseId ||
        (activeTab !== "materials" && activeTab !== "quizzes") ||
        !courseData?.stats?.totalMaterials
    }
  );

  const { data: studentsData, isLoading: studentsLoading } =
    useGetCourseStudentsQuery(
      {
        courseId,
        page,
        limit,
        search: searchQuery,
        sort: "latest",
      },
      { skip: !courseId || activeTab !== "students" }
    );

  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetCourseAttendanceDetailQuery(
      { courseId, page: 1, limit: 50 },
      { skip: !courseId || activeTab !== "attendance" }
    );


  const now = new Date();
  const upcomingClasses =
    courseData?.schedules
      ?.flatMap((schedule) => {
        if (!schedule.scheduleDates || !Array.isArray(schedule.scheduleDates)) {
          return [];
        }
        return schedule.scheduleDates
          .filter((date) => {
            const scheduleDate = date ? new Date(date) : null;
            return scheduleDate && scheduleDate >= now;
          })
          .map((date) => ({
            ...schedule,
            scheduleDate: date,
          }));
      })
      .slice(0, 5) || [];

  const shouldShowZoomButton = upcomingClasses.some((schedule) => {
    if (!schedule.startTime || !schedule.endTime || !schedule.scheduleDate) return false;
    const scheduleDateTime = new Date(`${schedule.scheduleDate}T${schedule.startTime}`);
    const nowTime = new Date();
    const endTime = new Date(`${schedule.scheduleDate}T${schedule.endTime}`);

    return nowTime >= scheduleDateTime && nowTime <= endTime;
  });

  const activeSchedule = upcomingClasses.find((schedule) => {
    if (!schedule.startTime || !schedule.endTime || !schedule.scheduleDate) return false;
    const scheduleDateTime = new Date(`${schedule.scheduleDate}T${schedule.startTime}`);
    const nowTime = new Date();
    const endTime = new Date(`${schedule.scheduleDate}T${schedule.endTime}`);

    return nowTime >= scheduleDateTime && nowTime <= endTime;
  });

  const cardsData = [
    {
      title: "Total Materials",
      value: courseData?.stats
        ? `${courseData.stats.totalMaterials}`
        : "0%",
      icon: <AiOutlineBook color="#06574C" size={22} />,
      // changeText: "N/A",
      changeColor: "text-[#9A9A9A]",
    },
    {
      title: "Avg. Attendance",
      value: courseData?.stats
        ? `${Math.round(courseData.stats.avgAttendance * 100)}%`
        : "0%",
      icon: <AiOutlineLineChart color="#06574C" size={22} />,
      // changeText: "N/A",
      changeColor: "text-[#9A9A9A]",
    },
    {
      title: "Total Students",
      value: courseData?.stats?.totalStudents?.toLocaleString() || "0",
      icon: <UsersRound color="#06574C" size={22} />,
      // changeText: "N/A",
      changeColor: "text-[#9A9A9A]",
    },
    {
      title: "Active Quizzes",
      value: courseData?.stats
        ? `${courseData.stats.totalQuizzes}`
        : "0%", icon: <IoBulbOutline color="#06574C" size={22} />,
      // changeText:s "N/A",
      changeColor: "text-[#9A9A9A]",
    },
  ];

  const coursesonline = [
    {
      id: 1,
      name: "Duration",
      title: courseData?.course?.duration || "N/A",
    },
    {
      id: 2,
      name: "Type",
      title: courseData?.course?.type?.replace("_", " ") || "N/A",
    },
    {
      id: 3,
      name: "Status",
      title: `${courseData?.course?.status || "N/A"}`,
    },
  ];

  const handleSearch = (value) => {
    setPage(1);
    debounce(() => setSearchQuery(value), 500);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getFileIcon = (fileType) => {
    if (fileType?.toLowerCase().includes("quiz")) {
      return <FaRegLightbulb color="#06574C" size={30} />;
    }
    if (fileType?.toLowerCase().includes("pdf")) {
      return <PiFilePdfDuotone color="#06574C" size={30} />;
    }
    if (fileType?.toLowerCase().includes("video")) {
      return <Video color="#06574C" size={30} />;
    }
    return <FaClipboardList color="#06574C" size={30} />;
  };

  const handleJoinZoom = () => {
    const link = activeSchedule?.meetingLink || courseData?.course?.meetingLink;
    if (link) {
      window.open(link, "_blank");
    }
  };

  if (courseLoading) {
    return <Loader text="Loading course data..." />;
  }

  if (error) {
    return <QueryError
      height="300px"
      error={error}
      onRetry={refetchCourse}
      showLogo={false}
    />
  }
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <div className="md:flex md:justify-between md:items-center max-md:pb-3 ">
        <div className="flex flex-wrap items-start">
          <DashHeading
            title={courseData?.course?.courseName || "Course Name"}
            desc={`${courseData?.stats?.totalStudents || 0} Students Enrolled`}
          />
          <p className="bg-white capitalize text-[#06574C] mt-8 py-1.5 text-xs  rounded-md text-center font-semibold w-20 max-md:absolute max-md:top-1/10 max-md:left-3/4">
            {courseData?.course?.status || "Active"}
          </p>
        </div>
        <Button
          className=" max-md:w-full"
          color="success"
          size="lg"
          radius="sm"
          startContent={<LuSquareArrowOutUpRight size={20} color="white" />}
          onPress={handleJoinZoom}
          isDisabled={!shouldShowZoomButton && !activeSchedule?.meetingLink}
        >
          {shouldShowZoomButton || activeSchedule?.meetingLink
            ? "Join Zoom"
            : "No Active Session"}
        </Button>
      </div>

      <div className="pb-4 gap-5  overflow-x-auto grid grid-cols-1 sm:grid-cols-4">
        {cardsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#F1E0D9] sm:bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4"
          >
            <h1 className="font-semibold text-[#333333]">{item.title}</h1>

            <div className="flex items-center gap-2 justify-start">
              <div className="rounded-full p-3 bg-[#95C4BE]/20">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className={`${item.changeColor} text-sm`}>
                  {item.changeText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Schedules Section */}
      {courseData?.schedules?.length > 0 && (
        <div className="bg-white rounded-lg mb-3 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Class Schedules</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseData.schedules.map((schedule, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[#06574C]">
                    {schedule.title || `Schedule ${index + 1}`}
                  </h3>
                  {schedule.scheduleDates?.some((date) => {
                    const scheduleDateTime = schedule.startTime
                      ? new Date(`${date}T${schedule.startTime}`)
                      : new Date(date);
                    return scheduleDateTime >= now;
                  }) && (
                      <Chip size="sm" className="bg-green-100 text-green-800">
                        Upcoming
                      </Chip>
                    )}
                </div>
                <div className="space-y-2 text-sm">
                  {schedule.startTime && schedule.endTime && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  )}
                  {schedule.scheduleDates && schedule.scheduleDates.length > 0 && (
                    <div className="flex justify-center">
                      <Calendar isReadOnly color="success"
                        isDateUnavailable={(date) =>
                          schedule.scheduleDates?.includes(date.toString())
                        }
                      />
                    </div>
                  )}
                  {schedule.meetingLink && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video size={16} />
                      <a
                        href={schedule.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1570E8] hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg mb-3 p-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Course Outline</h1>
          {/* <Button
            variant="bordered"
            color="#06574C"
            className="  text-[#06574C]"
            size="sm"
            radius="sm"
            startContent={<LuSquareArrowOutUpRight size={18} color="#06574C" />}
          >
            Edit
          </Button> */}
        </div>
        <div className="py-3">
          <div className="flex justify-between items-center">
            {coursesonline.map((item, index) => (
              <div key={index} className="flex justify-between  w-full">
                <div className="w-full flex flex-col ">
                  <p className="text-[#666666] text-sm">{item.name}</p>
                  <p className="text-md font-medium capitalize">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-[#666666] text-sm">Description</p>
            <span className=" text-md">
              {courseData?.course?.description ||
                "This course covers modern web development technologies including HTML5, CSS3, JavaScript ES6+, React, Node.js, and database integration. Students will build full-stack web applications and learn industry best practices."}
            </span>
          </div>
        </div>
      </div>
      <div className=" bg-white rounded-lg mb-3 ">
        <div className="flex w-full flex-col p-2">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#06574C]",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-[#06574C] group-data-[selected=true]:font-bold",
            }}
            color="primary"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={(key) => {
              setActiveTab(key);
              setSearchQuery("");
              setPage(1);
            }}
          >
            <Tab
              key="materials"
              title={
                <div className="flex items-center space-x-2">
                  <span>Materials</span>
                </div>
              }
            />
            <Tab
              key="quizzes"
              title={
                <div className="flex items-center space-x-2">
                  <span>Quizzes</span>
                </div>
              }
            />
            <Tab
              key="students"
              title={
                <div className="flex items-center space-x-2">
                  <span>Student</span>
                </div>
              }
            />
            <Tab
              key="attendance"
              title={
                <div className="flex items-center space-x-2">
                  <span>Attendance</span>
                </div>
              }
            />
          </Tabs>
        </div>
        <div className="p-3 flex justify-between items-center ">
          <div>
            <Input
              className="w-100"
              size="md"
              radius="sm"
              placeholder={`Search ${activeTab}...`}
              defaultValue={searchQuery}
              onValueChange={handleSearch}
              type="search"
              endContent={<Search />}
            />
          </div>
          <div>
            {activeTab === "materials" && (
              <Button
                size="md"
                radius="sm"
                startContent={<Plus size={18} />}
                as={Link}
                to={'/teacher/courses/upload-material?courseId=' + courseId}
                className="bg-[#06574C] text-white"
              >
                Upload Materials
              </Button>
            )}
          </div>
        </div>

        {activeTab === "materials" && (
          <div className="flex flex-col gap-3">
            {filesLoading ? (
              <p className="text-center text-gray-500 py-8">Loading materials...</p>
            ) : filesData?.results?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No materials uploaded yet.</p>
            ) : (
              filesData?.results?.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#EAF3F2]"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                      <div className="h-15 w-15 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                        {getFileIcon(item.fileType)}
                      </div>
                      <div>
                        <div className="text-lg text-[#06574C] font-semibold">
                          {item.title}
                        </div>
                        <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                          {item.file?.pages > 0 && (
                            <p>{item.file.pages} pages</p>
                          )}
                          {item.file?.duration > 0 && (
                            <p>{item.file.duration} Duration</p>
                          )}
                          {item.file?.size && (
                            <p>{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="items-center flex justify-between gap-3">
                      <Button
                        startContent={<Download size={18} color="#06574C" />}
                        size="md"
                        radius="sm"
                        variant="bordered"
                        color="#06574C"
                        onPress={() => window.open(item.url, "_blank")}
                      >
                        Download
                      </Button>
                      <Button
                        isIconOnly
                        className="bg-white"
                        startContent={
                          <LuSquareArrowOutUpRight size={18} color="#06574C" />
                        }
                        onPress={() => window.open(item.url, "_blank")}
                      />
                      <Button
                        isIconOnly
                        className="bg-[#FFEAEC]"
                        startContent={
                          <RiDeleteBin6Line size={18} color="#E8505B" />
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="flex flex-col gap-3">
            {filesLoading ? (
              <p className="text-center text-gray-500 py-8">Loading quizzes...</p>
            ) : filesData?.quizzes?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No quizzes available.</p>
            ) : (
              filesData?.quizzes?.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#EAF3F2]"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                      {/* <div className="h-15 w-15 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                        {getFileIcon(item.fileType)}
                      </div> */}
                      <div>
                        <div className="text-lg text-[#06574C] font-semibold">
                          {item.title}
                        </div>
                        <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                          <div className="flex items-center gap-1 ">
                            <TbListCheck size={20} />
                            {item.file?.totalQuestions || "10"} Questions
                          </div>
                          {item.file?.duration && (
                            <div className="flex items-center gap-1 ">
                              <Clock size={16} />
                              {item.file.duration} Minutes
                            </div>
                          )}
                          {item.file?.passingScore && (
                            <div className="flex items-center gap-1 ">
                              <p className="text-xs text-[#06574C] p-2 bg-white rounded-md">
                                Passing: {item.file.passingScore}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="items-center flex justify-between gap-3">
                      <Button
                        startContent={<Download size={18} color="#06574C" />}
                        size="md"
                        radius="sm"
                        variant="bordered"
                        color="#06574C"
                      >
                        Download
                      </Button>
                      <Button
                        isIconOnly
                        className="bg-white"
                        startContent={
                          <LuSquareArrowOutUpRight size={18} color="#06574C" />
                        }
                      />
                      <Button
                        isIconOnly
                        className="bg-[#FFEAEC]"
                        startContent={
                          <RiDeleteBin6Line size={18} color="#E8505B" />
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Students Tab Content */}
        {activeTab === "students" && (
          <div className="flex flex-col gap-3">
            {studentsLoading ? (
              <p className="text-center text-gray-500 py-8">Loading students...</p>
            ) : studentsData?.students?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No students enrolled yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentsData?.students?.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 rounded-full bg-[#95C4BE]/20 flex items-center justify-center">
                                <RiGroupLine color="#06574C" size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(student.enrolledAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.completedLessonsCount || 0} lessons
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Chip
                              size="sm"
                              className={`${student.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {student.paymentStatus || "pending"}
                            </Chip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {studentsData?.totalPages > 1 && (
                  <div className="flex justify-between items-center px-4 py-3">
                    <div className="text-sm text-gray-500">
                      Showing {((page - 1) * limit) + 1} to{" "}
                      {Math.min(page * limit, studentsData.total)} of{" "}
                      {studentsData.total} students
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={page === 1}
                        onPress={() => handlePageChange(page - 1)}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: studentsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={page === pageNum ? "solid" : "bordered"}
                          color={page === pageNum ? "primary" : "default"}
                          onPress={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={page === studentsData.totalPages}
                        onPress={() => handlePageChange(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Attendance Tab Content */}
        {activeTab === "attendance" && (
          <div className="flex flex-col gap-3">
            {attendanceLoading ? (
              <p className="text-center text-gray-500 py-8">Loading attendance...</p>
            ) : attendanceData?.students?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No attendance records yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sessions Attended
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sessions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData?.students?.map((student) => (
                        <tr key={student.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 rounded-full bg-[#95C4BE]/20 flex items-center justify-center">
                                <RiGroupLine color="#06574C" size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(student.enrolledAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.attendedSessions || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.totalSessions || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Chip
                              size="sm"
                              className={`${Number(student.attendanceRate) >= 75
                                ? "bg-green-100 text-green-800"
                                : Number(student.attendanceRate) >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {student.attendanceRate}%
                            </Chip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

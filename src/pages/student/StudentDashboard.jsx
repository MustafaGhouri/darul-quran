import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Pagination, Skeleton } from "@heroui/react";
import { Clock, Video, VideoIcon, Check, Lock } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa";
import { BiGroup } from "react-icons/bi";
import { GrAnnounce } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { useSelector } from "react-redux";
import NotificationPermission from "../../components/NotificationPermission"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Spinner } from "@heroui/react";
import VideoPlayer from "../../components/dashboard-components/Video";
import { useGetEnrolledCoursesQuery } from "../../redux/api/courses";
import { useGetAllAnnouncementQuery } from "../../redux/api/announcements";
import { errorMessage, successMessage } from "../../lib/toast.config";
import { dateFormatter } from "../../lib/utils";
import QueryError from "../../components/QueryError";
import { formatTime12Hour, isClassExpired, isClassLive, getHoursUntilClass, getStatusText } from "../../utils/scheduleHelpers";
import { useGetStudentDashboardQuery } from "../../redux/api/dashboard"; 

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isMarking, setIsMarking] = useState(false);
  const { data, error, isLoading, isFetching, refetch } = useGetEnrolledCoursesQuery({
    page,
  });

  const {
    data: dashboardData,
    error: dashboardError,
    isLoading: dashboardLoading,
    refetch: dashboardRefetch
  } = useGetStudentDashboardQuery()

  const announcementsSlider = dashboardData?.data?.announcements || [];
  const upcomingClasses = dashboardData?.data?.upcomingClasses || [];
  const announcementsList = dashboardData?.data?.recentAnnouncements || [];
  const handleJoinClass = async (schedule) => {
    if (!user) {
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
          studentId: user.id,
          courseId: schedule.courseId,
          date: schedule.date
        })
      });
      const data = await res.json();
      if (res.ok) {
        window.open(data?.link, '_blank');
        // successMessage(data?.message || "Joined class! Attendance marked.");
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
  if (dashboardError) {
    return <QueryError
      height="300px"
      error={dashboardError}
      onRetry={dashboardRefetch}
      showLogo={false}
      isLoading={dashboardLoading}
    />
  }
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-fsull px-2 sm:px-3">
      {/* banner slider */}
      <div className="mt-3 w-full rounded-lg overflow-hidden">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Autoplay, SwiperPagination, Navigation]}
          className="mySwiper rounded-lg"
        >
          {announcementsSlider.length > 0 ? (
            announcementsSlider.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div
                  className="space-y-4 p-4 w-full flex flex-col justify-center bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage: item?.announcement_file
                      ? `url('${item.announcement_file}')`
                      : `url('/images/banner.png')`,
                  }}
                >
                  <div className="flex max-sm:flex-wrap gap-3 justify-between items-start">
                    <div>
                      <h1 className="text-xl sm:text-4xl text-white font-bold capitalize mb-2 drop-shadow-md">
                        {item?.title}
                      </h1>
                      <p className="text-white text-lg sm:text-xl font-medium overflow-hidden line-clamp-3 max-w-2xl drop-shadow-sm">
                        {item?.description}
                      </p>
                      <Button
                        as={Link}
                        to={`/student/announcements`}
                        size="md"
                        className="bg-[#06574C] text-white rounded-md mt-6 font-semibold hover:bg-[#086d5f] transition-all"
                      >
                        View Announcements
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="space-y-4 bg-white/50 p-4 w-full flex flex-col justify-center">
                <div className="flex max-sm:flex-wrap gap-3 justify-between items-start">
                  <div>
                    <h1 className="text-xl sm:text-4xl text-white font-bold capitalize mb-2 drop-shadow-md">
                      Welcome to Darul Quran
                    </h1>
                    <p className="text-white text-lg sm:text-xl font-medium overflow-hidden line-clamp-2 drop-shadow-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <Button
                      as={Link}
                      to={`/student/announcements`}
                      size="md"
                      className="bg-[#06574C] text-white rounded-md mt-6 font-semibold hover:bg-[#086d5f] transition-all"
                    >
                      View Announcements
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div>
        {error &&
          <QueryError
            height="300px"
            error={error}
            onRetry={refetch}
            showLogo={false}
            isLoading={isFetching}
          />
        }
        <div className="grid grid-cols-12 gap-3 py-4">

          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100/50 p-4 space-y-4">
                  {/* Status Badge */}
                  <Skeleton className="h-6 w-24 rounded-md" />

                  {/* Course Title */}
                  <Skeleton className="h-8 w-3/4 rounded-md mx-auto" />

                  {/* Student + Next Class Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16 rounded-md" />
                        <Skeleton className="h-3 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="space-y-2 text-end">
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                  </div>

                  {/* Button */}
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))
          ) : data?.courses?.length === 0 ? (
            <div className="col-span-12 text-center py-10 text-gray-500">
              You haven't enrolled in any courses yet.
            </div>
          ) : (
            data?.courses?.map((item) => (
              <div
                key={item.id}
                className="col-span-12 md:col-span-6 lg:col-span-4 "
              >
                <div className="w-full bg-white rounded-lg shadow-md hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden rounded-t-lg bg-gray-100">
                    <VideoPlayer
                      src={item.video}
                      className="w-full h-full object-contain bg-black"
                      poster={item.thumbnail}
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h1 className="text-lg font-bold text-[#06574C] line-clamp-1">
                      {item.courseName}
                    </h1>

                    <div className="flex justify-between items-center text-sm text-black">
                      <div className="flex gap-1 items-center ">
                        {<FaRegAddressCard size={16} />}{" "}
                        {item.teacherName || "Instructor"}
                      </div>
                      <div className="flex gap-1 items-center ">
                        <span className="text-xs font-semibold text-success">Enrolled At :</span>
                        {<CiCalendar size={16} />}{" "}
                        {dateFormatter(item.enrolledAt, true)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-black">
                      <div className="flex gap-1 items-center ">
                        <span className="text-xs font-semibold text-success">Expires At :</span>
                        {<CiCalendar size={16} />}{" "}
                        {item?.cancelledAt || item?.cancelledat ? dateFormatter(item?.cancelledAt || item?.cancelledat, true) : "Live Time"}
                      </div>
                    </div>
                    <div>
                      <Button
                        size="md"
                        radius="sm"
                        variant="bordered"
                        color="success"
                        className="w-full mt-2 font-medium"
                        startContent={<AiOutlineEye size={20} />}
                        onPress={() =>
                          navigate(`/student/course/${item.id}/learn`, {
                            state: item,
                          })
                        }
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {data?.totalPages > 1 && (
          <Pagination
            showControls
            className="mb-4"
            variant="ghost"
            initialPage={1}
            onChange={(page) => setPage(page)}
            total={data?.totalPages || 1}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        )}
      </div>

      <div className=" bg-white rounded-lg mb-3 ">
        <h1 className="p-3 text-xl text-[#333333]">Today's Classes</h1>
        <div className="flex flex-col gap-3">
          {dashboardLoading ? (
            // 🔥 Skeleton Loader (3 dummy rows)
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-md p-4 bg-gray-100 animate-pulse"
              >
                <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">

                  {/* Left Section */}
                  <div className="flex flex-col md:flex-row gap-3 md:items-center">

                    {/* Date Circle Skeleton */}
                    <div className="h-20 w-20 rounded-full bg-gray-300"></div>

                    {/* Text Content */}
                    <div className="space-y-3">
                      <div className="h-4 w-48 bg-gray-300 rounded"></div>
                      <div className="h-3 w-64 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))
          ) : upcomingClasses.length === 0 ? (
            <div className="p-4 text-gray-500 text-center bg-[#F5E3DA]/20 rounded-lg">
              No today classes found.
            </div>
          ) : upcomingClasses.map((item, index) => {
            const today = new Date();
            return (
              <div
                key={index}
                className={`${item.meeting_link ? "bg-[#EAF3F2]" : "bg-[#F5E3DA]"
                  } rounded-md`}
              >
                <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                    <div className="h-20 w-20 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                      {(() => {
                        // Get the next upcoming class date for display
                        const allDates = item.schedule_dates || item.scheduleDates || [];
                        const todayStr = new Date().toISOString().split('T')[0];
                        const upcomingDates = allDates.filter(d => d >= todayStr);
                        const nextClassDate = upcomingDates.length > 0 ? upcomingDates.sort()[0] : (allDates[0] || item.date);
                        const classDateObj = nextClassDate ? new Date(nextClassDate) : today;
                        return (
                          <p className="text-[16px] text-[#06574C] font-semibold">
                            {dateFormatter(classDateObj)?.split(",")[0]} <br />
                            {dateFormatter(classDateObj)?.split(",")[1]?.split("20")[0]}
                          </p>
                        );
                      })()}
                    </div>
                    <div>
                      <div className="text-lg text-[#06574C] font-semibold">
                        {item.title}
                      </div>
                      <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                        <div className="flex items-center gap-1 ">
                          <Clock size={20} />
                          {formatTime12Hour(item.start_time)} - {formatTime12Hour(item.end_time)}
                        </div>
                        <div className="flex items-center gap-1 ">
                          <Video size={20} />
                          {item.meeting_link ? "Online (Zoom)" : "Pending"}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-white text-[#06574C]">
                          {item.course_name || "General Class"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const live = isClassLive(item);
                      const expired = isClassExpired(item);

                      if (expired) {
                        return (
                          <Button
                            startContent={<Check size={20} />}
                            size="sm"
                            className="bg-gray-400 w-32 text-white rounded-md"
                            isDisabled
                          >
                            Completed
                          </Button>
                        );
                      } else if (live && item.meeting_link) {
                        return (
                          <Button
                            startContent={<Video size={20} />}
                            size="sm"
                            color="success"
                            onPress={() => handleJoinClass(item)}
                            isLoading={isMarking}
                            // as={Link}
                            // to={item.meeting_link}
                            target="_blank"
                          >
                            Start Class
                          </Button>
                        );
                      } else if (item.meeting_link) {
                        return (
                          <Button
                            startContent={<Clock size={20} />}
                            size="sm"
                            className="bg-[#06574C] w-32 text-white rounded-md"
                            isDisabled
                          >
                            Locked
                          </Button>
                        );
                      } else {
                        return (
                          <Button
                            startContent={<AiOutlineEye size={22} />}
                            size="sm"
                            className="bg-[#06574C] w-32 text-white rounded-md"
                          >
                            Details
                          </Button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div >
      <div className=" bg-white rounded-lg mb-3 ">
        <h1 className="p-3 text-xl font-medium text-[#333333]">
          Recent Announcements
        </h1>
        <div className="flex flex-col gap-3">
          {dashboardLoading ? (
            <div className="flex justify-center py-10">
              <Spinner color="success" size="lg" />
            </div>
          ) : !announcementsList ||
            announcementsList?.length <= 0 ? (
            <div className="text-center py-10 text-gray-500">
              No announcements found
            </div>
          ) : (
            announcementsList.map((item, index) => (
              <div
                key={item.id}
                className={`${item.created_by === "teacher" ||
                  item.description?.toLowerCase()?.includes("schedule")
                  ? "bg-[#F5E3DA]"
                  : "bg-[#EAF3F2]"
                  } `}
              >
                <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-start">
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                    <div className="h-20 shrink-0 w-20 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                      {item.created_by === "teacher" ||
                        item.description?.toLowerCase()?.includes("schedule") ? (
                        <CiCalendar color="#D28E3D" size={30} />
                      ) : (
                        <GrAnnounce color="#06574C" size={30} />
                      )}
                    </div>
                    <div>
                      <div
                        className={`${item.created_by === "teacher" ||
                          item.description?.toLowerCase()?.includes("schedule")
                          ? "text-[#B7721F]"
                          : "text-[#06574C]"
                          } font-semibold`}
                      >
                        {item.title}
                      </div>
                      <div className=" text-xs text-[#666666]">
                        <p>{dateFormatter(item.date)}</p>
                      </div>
                      <div className=" max-w-4xl text-sm text-[#666666] line-clamp-2">
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#666666]">
                      {item.sender_name || "Admin"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div >
  );
};
export default StudentDashboard;

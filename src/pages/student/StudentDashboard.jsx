import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Progress } from "@heroui/react";
import {
  BookIcon,
  ChartPie,
  Clock,
  Edit,
  MapPin,
  MegaphoneIcon,
  PlusIcon,
  UsersIcon,
  UsersRound,
  UserStar,
  Video,
} from "lucide-react";
import OverviewCards from "../../components/dashboard-components/OverviewCards";
import {
  AiOutlineBook,
  AiOutlineEye,
  AiOutlineLineChart,
} from "react-icons/ai";
import { LuClock4 } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { FaRegAddressCard } from "react-icons/fa";
import { BiGroup } from "react-icons/bi";
import { GrAnnounce } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { useSelector } from "react-redux";
import NotificationPermission from "../../components/NotificationPermission";

import { Spinner } from "@heroui/react";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/my-courses`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const cardsData = [
    {
      title: "Total Enrollments",
      value: "12,847",
      icon: <AiOutlineBook color="#06574C" size={22} />,
      changeText: "Active",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Attendance Rate",
      value: "$89,432",
      icon: <AiOutlineLineChart color="#06574C" size={22} />,
      changeText: "+8.2% from last month",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Total Students",
      value: "3,847",
      icon: <UsersRound color="#06574C" size={22} />,
      changeText: "-2.1% from last week",
      changeColor: "text-[#E8505B]",
    },
    {
      title: "Total Hours",
      value: "24",
      icon: <LuClock4 color="#06574C" size={22} />,
      changeText: " +8.2% from last month",
      changeColor: "text-[#06574C]",
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      day: "11",
      month: "Nov",
      time: "2:00",
      Title: "Advanced Web Development",
      students: "32",
      role: "Student",
      status: "Online",
      course: "Python",
      location: "Join Zoom",
      minutes: "60 minutes",
    },
    {
      id: 2,
      day: "11",
      month: "Nov",
      time: "2:00",
      Title: "Advanced Web Development",
      students: "32",
      role: "Student",
      status: "Online",
      course: "Python",
      minutes: "Due Today",
    },
    {
      id: 3,
      day: "11",
      month: "Nov",
      time: "2:00",
      Title: "Advanced Web Development",
      role: "Student",
      status: "Online",
      course: "Python",
      location: "Join Zoom",
      minutes: "30 minutes",
    },
  ];
  const Announcements = [
    {
      id: 1,
      icone: <GrAnnounce color="#06574C" size={30} />,
      time: "2 hours ago",
      desc: "Web Development 101: Complete the React project by Friday. Check the assignment details in your course portal.",
      Title: "Advanced Web Development",
      students: "32",
      professer: "Prof. Sarah Johnson",
    },
    {
      id: 2,
      icone: <CiCalendar color="#D28E3D" size={30} />,
      time: "2 hours ago",
      desc: "Web Development 101: Complete the React project by Friday. Check the assignment details in your course portal.",
      Title: "Class Schedule Update",
      professer: "Prof. Sarah Johnson",
    },
    {
      id: 3,
      icone: <GrAnnounce color="#06574C" size={30} />,
      time: "2 hours ago",
      desc: "Web Development 101: Complete the React project by Friday. Check the assignment details in your course portal.",
      Title: "Advanced Web Development",
      professer: "Prof. Sarah Johnson",
    },
  ];
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      {/* banner */}
      <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl sm:text-3xl text-white font-semibold mb-0 ">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-white text-sm">
              Ready to continue your learning journey? Let's make today productive!
            </p>
            <Button size="sm" className="bg-[#06574C] text-white rounded-md">
              Learn More
            </Button>
          </div>
          <div>
            <NotificationPermission />
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-12 gap-3 py-4">
          {loading ? (
            <div className="col-span-12 flex justify-center py-10"><Spinner size="lg" /></div>
          ) : courses.length === 0 ? (
            <div className="col-span-12 text-center py-10 text-gray-500">You haven't enrolled in any courses yet.</div>
          ) : (
            courses.map((item) => (
              <div key={item.id} className="col-span-12 md:col-span-6 lg:col-span-4 ">
                <div className="w-full bg-white rounded-lg border shadow-sm hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      className="w-full h-full object-cover"
                      src="/images/studentcard.png"
                      alt={item.courseName}
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h1 className="text-lg font-bold text-[#06574C] line-clamp-1">{item.courseName}</h1>

                    <div className="flex justify-between items-center text-sm text-[#6B7280]">
                      <div className="flex gap-1 items-center ">
                        {<FaRegAddressCard size={18} />}
                        {" "}
                        {item.teacherName || "Instructor"}
                      </div>
                      <div className="flex gap-1 items-center ">
                        {<CiCalendar size={18} />}
                        {" "}
                        {new Date(item.enrolledAt).toLocaleDateString()}
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
                        onPress={() => navigate(`/student/course/${item.id}/learn`)}
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>

      <div className=" bg-white rounded-lg mb-3 ">
        <h1 className="p-3 text-xl font-medium text-[#333333]">
          Today's Schedule
        </h1>
        <div className="flex flex-col gap-3">
          {upcomingClasses.map((item, index) => (
            <div
              key={item.id}
              className={`${item.location === "Join Zoom" ? "bg-[#EAF3F2]" : "bg-[#F5E3DA]"
                } `}
            >
              <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                  <div className="h-20 w-20 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                    <p className="text-xl text-[#06574C] font-semibold">
                      {item.time}
                    </p>
                    <p className="text-sm text-[#06574C] font-semibold">PM</p>
                  </div>
                  <div>
                    <div className="text-lg text-[#06574C] font-semibold">
                      {item.Title}
                    </div>
                    <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                      <div className="flex items-center gap-1 ">
                        <Clock size={20} />
                        {item.minutes}
                      </div>
                      {item.students && (
                        <div className="flex items-center gap-1 ">
                          <BiGroup size={20} />
                          {item.students} {item.role}
                        </div>
                      )}
                      <div className="flex items-center gap-1 ">
                        <Video size={20} />
                        {item.status}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" className="bg-white text-[#06574C]">
                        {item.course}
                      </Button>
                      <Button size="sm" className="bg-white text-[#D28E3D]">
                        Starting Soon
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  {item.id === 1 && (
                    <Button
                      size="sm"
                      className={` bg-[#06574C]  w-32 text-white rounded-md`}
                    >
                      Join class
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" bg-white rounded-lg mb-3 ">
        <h1 className="p-3 text-xl font-medium text-[#333333]">
          Recent Announcements
        </h1>
        <div className="flex flex-col gap-3">
          {Announcements.map((item, index) => (
            <div
              key={item.id}
              className={`${item.Title !== "Class Schedule Update"
                ? "bg-[#EAF3F2]"
                : "bg-[#F5E3DA]"
                } `}
            >
              <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-start">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                  <div className="h-20 w-20 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                    {item.icone}
                  </div>
                  <div>
                    <div
                      className={`${item.Title === "Class Schedule Update"
                        ? "text-[#B7721F]"
                        : "text-[#06574C]"
                        } font-semibold`}
                    >
                      {item.Title}
                    </div>
                    <div className=" text-xs text-[#666666]">
                      <p>{item.time}</p>
                    </div>
                    <div className=" text-sm text-[#666666]">
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm text-[#666666]">
                    {item.professer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;

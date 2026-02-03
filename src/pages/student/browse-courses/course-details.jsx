import React from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Button, Divider, Progress } from "@heroui/react";
import { FaStar, FaUserGraduate } from "react-icons/fa";
import { IoPlay, IoStarSharp } from "react-icons/io5";
import { IoIosCheckmark } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import {
  Album,
  Calendar,
  ChartNoAxesColumn,
  ChartPie,
  Check,
  Clock,
} from "lucide-react";
import { HiOutlinePlay, HiUserGroup } from "react-icons/hi";
import { PiFilePdfLight } from "react-icons/pi";
import { GoLightBulb } from "react-icons/go";
import { GiCheckMark, GiPhotoCamera } from "react-icons/gi";
import { BsClipboard2Check } from "react-icons/bs";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { LiaCertificateSolid } from "react-icons/lia";
import { MdMenuBook } from "react-icons/md";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course } = location.state || {};

  console.log("course....................", course)
  if (!course) {
    navigate("/student/browse-courses");
    return null;
  }
  const quickStats = [
    {
      title: `${course?.videoCount || course?.lesson_video?.length || 0} Video Lessons`,
      desc: `${course?.videoDuration || 0} minutes of video`,
      icon: <HiOutlinePlay size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: `${course?.pdf_notes?.length || 0} PDF Resources`,
      desc: "Downloadable materials",
      icon: <PiFilePdfLight size={22} color="#06574C" />,
    },
    {
      title: `${course?.quizzes?.length || 0} Quizzes`,
      desc: "Test your knowledge",
      icon: <GoLightBulb size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: `${course?.assignments?.length || 0} Assignments`,
      desc: "Practice exercises",
      icon: <BsClipboard2Check size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: "Lifetime Access",
      desc: "Learn at your own pace",
      icon: <GiCheckMark size={22} color="#06574C" />,
    },
    {
      title: "Mobile Access",
      desc: "Learn on any device",
      icon: <HiDevicePhoneMobile size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: "Certificate",
      desc: "Upon course completion",
      icon: <LiaCertificateSolid size={22} color="#06574C" />,
    },
  ];

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"Course Details"}
        desc={"Everything you need to know about this course"}
      />
      <div
        className="p-4 rounded-xl mb-3  bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url(/images/student-banner.png)" }}
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-8 space-y-3">
            <h1 className="text-3xl font-bold">
              {course?.courseName}
            </h1>
            <div className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
              {/* Instructor Row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 flex items-center justify-center bg-[#95C4BE33] rounded-full">
                    <FaRegAddressCard size={26} color="#06574C" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#06574C]">
                      {course?.first_name + " " + course?.last_name}
                    </h2>
                    <p className="text-sm text-[#6B7280]">Teacher</p>
                  </div>
                </div>

                {/* Category Badge */}
                <Button
                  size="sm"
                  radius="sm"
                  className="bg-[#E6F2F0] text-[#06574C] font-medium px-4"
                >
                  {course?.category_name}
                </Button>
              </div>

              {/* Description */}
              <p className="text-[#374151] text-sm leading-relaxed">
                {course?.description.slice(0, 150) + "..."}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm text-[#6B7280] mt-10">
                <div>
                  <div className="flex items-center gap-1">
                    <IoStarSharp size={18} color="#FACC15" />
                    <span className="font-medium text-[#111827]">4.8</span>
                    <span>(3,245 ratings)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Last updated: November 2025</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={16} />
                    <span>15,432 students enrolled</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>12 hours 30 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4  rounded-lg bg-white ">
            {course?.thumbnailurl ? (
              <div className="w-full h-48 rounded-t-lg overflow-hidden bg-black relative">
                {course.thumbnailurl.match(/\.(mp4|webm|ogg)$/i) || course.thumbnailurl.includes('utfs.io') ? (
                  <video
                    src={course.thumbnailurl}
                    className="w-full h-full object-contain bg-black"
                    controls
                    poster={course.videoThumbnail || course.thumbnailurl.replace(/\.(mp4|webm|ogg)$/i, '.jpg')}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={course.thumbnailurl}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)] h-30 p-3 flex items-center relative rounded-t-lg">
                <h1 className="text-xl font-bold text-center ">
                  {course?.courseName}
                </h1>
                <div className="h-15 w-15 flex justify-center items-center rounded-full  absolute p-2 bg-[#95C4BEC4] left-1/2 -translate-x-1/2">
                  <IoPlay color="#06574C" size={35} />
                </div>
              </div>
            )}
            <div className="flex justify-between items-center p-3">
              <div className="flex gap-1 items-center ">
                <h1 className="text-2xl font-bold text-[#06574C]">${course?.coursePrice} </h1>
                <h1 className="text-lg  text-[#666666]  line-through">
                  ${course?.coursePrice}
                </h1>
              </div>
              <Button
                radius="sm"
                size="sm"
                className="bg-[#FFEAEC] text-[#E8505B]"
              >
                {course?.coursePrice == 0 ? "0" : "55"}% OFF
              </Button>
            </div>
            <div className="p-3">
              <Button
                radius="sm"
                size="sm"
                variant="bordered"
                color="success"
                className="w-full "
              >
                Enroll Now
              </Button>
            </div>
            <Divider size="sm" className="mb-3" />
            <div className="p-3">
              <div className="flex flex-row gap-1 items-center text-[#666666]">
                <IoIosCheckmark size={22} />
                <h1 className="text-sm  ">Full lifetime access</h1>
              </div>
              <div className="flex flex-row gap-1 items-center text-[#666666]">
                <IoIosCheckmark size={22} />
                <h1 className="text-sm  ">Access on mobile and desktop</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="bg-white p-3 rounded-xl col-span-12 md:col-span-8">
          <div className=" rounded-xl h-full">
            {/* Description */}
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {course.description}
            </p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl col-span-12 md:col-span-4">
          <h2 className="text-xl font-semibold mb-3">What's included</h2>
          {quickStats.map((item, index) => (
            <div
              key={index}
              className={`my-2 flex gap-2 ${item?.bg ? `bg-[${item.bg}]` : "bg-[#EBD4C982]"
                } items-center p-2 rounded-lg`}
            >
              <div className="h-10 w-10 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
                {item.icon}
              </div>
              <div className="">
                <p className="text-sm">{item.title}</p>
                <p className="text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mb-3">
        {/* LEFT SIDE */}
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-col gap-3">
            {/* Student Reviews */}
            <div className="bg-white p-5 rounded-xl">
              <h3 className="text-base font-semibold mb-4">Student Reviews</h3>

              <div className="flex gap-6">
                {/* Rating */}
                <div className="min-w-[100px]">
                  <p className="text-3xl font-bold">4.8</p>

                  <div className="flex gap-1 text-yellow-400 my-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar key={i} size={16} />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">(578 Reviews)</p>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 space-y-3">
                  {[
                    { star: 5, value: 85, count: 488 },
                    { star: 4, value: 40, count: 74 },
                    { star: 3, value: 10, count: 14 },
                    { star: 2, value: 0, count: 0 },
                    { star: 1, value: 0, count: 0 },
                  ].map((item) => (
                    <div key={item.star} className="flex items-center gap-2">
                      <span className="w-12 text-xs text-gray-500">
                        {item.star} stars
                      </span>

                      <Progress
                        value={item.value}
                        size="sm"
                        radius="full"
                        className="flex-1"
                        classNames={{
                          indicator: "bg-yellow-400",
                          track: "bg-gray-100",
                        }}
                      />

                      <span className="w-6 text-xs text-gray-500 text-right">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Single Review */}
            <div className="bg-white p-5 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Jan 20, 2025</p>

              <div className="flex gap-1 text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-full bg-[#95C4BE] flex items-center justify-center text-xs font-semibold text-[#06574C]">
                  AK
                </div>

                <div>
                  <p className="text-sm font-medium">Alex K.</p>
                  <p className="text-xs text-gray-400">Senior Analyst</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                Working at SamAI has been an incredible journey so far. The
                technology we’re building is truly cutting-edge and immensely
                fulfilling.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white p-5 rounded-xl h-full">
            <h3 className="text-xl font-semibold mb-5">About The Teacher</h3>

            <div className="flex gap-4 mb-5 items-center">
              <div className="h-20 w-20 rounded-full bg-[#95C4BE33] flex items-center justify-center text-emerald-700">
                <HiUserGroup size={28} color="#06574C" />
              </div>

              <div>
                <p className="text-xl font-semibold text-emerald-700">
                  Sarah Mitchell
                </p>
                <p className="text-sm text-gray-500">
                  Senior UI/UX Designer at TechCorp
                </p>
              </div>
            </div>

            <div className="flex gap-6 text-md text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span>4.9 Teacher Rating</span>
              </div>

              <div className="flex items-center gap-1">
                <HiUserGroup />
                <span>15,432 students</span>
              </div>

              <div className="flex items-center gap-1">
                <MdMenuBook />
                <span>8 Courses</span>
              </div>
            </div>

            <p className="text-sm text-[#333333] font-medium mb-2">
              Sarah is a Senior UI/UX Designer with over 10 years of experience
              working with Fortune 500 companies and startups. She has designed
              products used by millions of users worldwide and is passionate
              about teaching the next generation of designers. Her teaching
              style focuses on practical, real-world skills that help students
              get hired quickly.
            </p>

            <p className="text-sm text-[#333333] font-medium">
              Sarah is a Senior UI/UX Designer with over 10 years of experience
              working with Fortune 500 companies and startups. She has designed
              products used by millions of users worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

import React, { useState, useEffect, useMemo } from "react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Avatar, Button, Divider, Pagination, Progress } from "@heroui/react";
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
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { dateFormatter } from "../../../lib/utils";
import { useGetCourseByIdQuery, useGetCourseByIdViewQuery, useGetCourseFilesQuery, useGetReviewsQuery } from "../../../redux/api/courses";
import RatingStars from "../../../components/RatingStar";

const CourseDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseFromState = location.state || {};
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [ratingForSearch, setRatingForSearch] = useState(null);
  const teacherId = searchParams.get('teacher') || courseFromState?.teacher_id;

  if (!courseFromState) {
    navigate("/student/browse-courses");
    return null;
  }

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [overview, setOverview] = useState(null);
  const [shouldFetchOverview, setShouldFetchOverview] = useState(true);

  const { data, error, isLoading, isError } = useGetCourseByIdViewQuery({ courseId: id, includeCourse: !courseFromState?.id, teacherId }, { skip: !id });
  const { data: reviewData, isLoading: isReviewLoading, isError: reviewIsError, error: reviewError } = useGetReviewsQuery(
    { courseId: id, page, limit, includeOverview: shouldFetchOverview, rating: ratingForSearch },
    { skip: !id }
  );

  const course = useMemo(() => {
    if (courseFromState?.id) return courseFromState;
    if (data?.course) return data.course;
    return null;
  }, [courseFromState, data]);
  const courseFiles = data?.counts;

  useEffect(() => {
    if (data?.agg && shouldFetchOverview) {
      setOverview(data.agg);
      setShouldFetchOverview(false);
    }
  }, [data, shouldFetchOverview]);

  useEffect(() => {
    if (course?.id) {
      checkEnrollmentStatus();
    }
  }, [course]);

  const checkEnrollmentStatus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/check-enrollment/${course.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error("Failed to check enrollment", error);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ courseId: course.id })
      });
      const data = await res.json();
      if (data.success) {
        successMessage("Successfully enrolled!");
        setIsEnrolled(true);
        navigate("/student/dashboard");
      } else if (data.requiresPayment) {
        successMessage("Redirecting to payment...");
        const paymentRes = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ courseId: course.id })
        });
        const paymentData = await paymentRes.json();
        if (paymentData.success && paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          // toast.dismiss();
          errorMessage("Payment setup failed: " + paymentData.message);
        }
      } else {
        if (data.message === "Already enrolled") {
          setIsEnrolled(true);
          successMessage("You are already enrolled!");
        } else {
          errorMessage(data.message || "Enrollment failed");
        }
      }
    } catch (error) {
      console.error(error);
      errorMessage("Something went wrong");
    } finally {
      setEnrolling(false);
    }
  };
  const quickStats = [
    {
      title: `${courseFiles?.lessonVideo || 0} Video Lessons`,
      // desc: `${courseFiles?.totalMinutes || 0} minutes of video`,
      icon: <HiOutlinePlay size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: `${courseFiles?.pdfResources || 0} PDF Resources`,
      desc: "Downloadable materials",
      icon: <PiFilePdfLight size={22} color="#06574C" />,
    },
    {
      title: `${courseFiles?.quizzes || 0} Quizzes`,
      desc: "Test your knowledge",
      icon: <GoLightBulb size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: `${courseFiles?.assignments || 0} Assignments`,
      desc: "Practice exercises",
      icon: <BsClipboard2Check size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: course?.accessDuration?.replace("_", " ") + (course?.accessDuration?.toLowerCase()?.includes("access") ? "" : " access"),
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
    <>
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
                      <span className="font-medium text-[#111827]">{course?.rating}</span>
                      <span>({course?.numOfReviews} ratings)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Last updated: {dateFormatter(course?.updatedAt)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={16} />
                      <span>{course?.studentCourseCount} students enrolled</span>
                    </div>

                    {/* <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>12 hours 30 minutes</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4  rounded-lg bg-white ">
              {(course?.thumbnail || course?.video) ? (
                <div className="w-full h-48 rounded-t-lg overflow-hidden bg-black relative">
                  <video
                    src={course.video}
                    className="w-full h-full object-contain bg-black"
                    controls
                    poster={course.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </video>
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
                {isEnrolled ? (
                  <Button
                    radius="sm"
                    size="sm"
                    className="w-full bg-[#06574C] text-white"
                    onPress={() => navigate("/student/dashboard")}
                  >
                    Go to Course
                  </Button>
                ) : (
                  <Button
                    radius="sm"
                    size="sm"
                    variant="bordered"
                    color="success"
                    className="w-full"
                    onPress={handleEnroll}
                    isLoading={enrolling}
                  >
                    Enroll Now
                  </Button>
                )}
              </div>
              <Divider size="sm" className="mb-3" />
              <div className="p-3">
                <div className="flex flex-row gap-1 items-center text-[#666666]">
                  <IoIosCheckmark size={22} />
                  <h1 className="text-sm  ">{course?.accessDuration?.replace("_", " ")}{course?.accessDuration?.toLowerCase()?.includes("access") ? "" : " access"}</h1>
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
              <p dangerouslySetInnerHTML={{ __html: course?.description }} className="text-sm text-gray-600 leading-relaxed mb-4" />
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
                    <p className="text-3xl font-bold">{course?.rating}</p>

                    <div className="flex gap-1 text-yellow-400 my-1">
                      <RatingStars rating={course?.rating} />
                    </div>

                    <p className="text-xs text-gray-500">({course?.numOfReviews} Reviews)</p>
                  </div>

                  {/* Progress Bars */}
                  <div className="flex-1 space-y-3">
                    {[
                      { star: 5, value: (overview?.five / overview?.total) * 100, count: overview?.five },
                      { star: 4, value: ((overview?.four / overview?.total) * 100), count: overview?.four },
                      { star: 3, value: ((overview?.three / overview?.total) * 100), count: overview?.three },
                      { star: 2, value: ((overview?.two / overview?.total) * 100), count: overview?.two },
                      { star: 1, value: ((overview?.one / overview?.total) * 100), count: overview?.one },
                    ].map((item) => (
                      <div onClick={() => setRatingForSearch(item.star)} key={item.star} className="flex hover:opacity-50 cursor-pointer items-center gap-2">
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
              {reviewData?.reviews?.length > 0 && reviewData?.reviews.map((item) => (
                <div className="bg-white p-5 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">{item.createdAt ? dateFormatter(item.createdAt) : 'N/A'}</p>

                  <div className="flex gap-1 text-yellow-400 mb-2">
                    <RatingStars rating={item.rating} />
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <Avatar
                      name={item.username || "User"}
                      size="sm"
                      color="success"
                    />

                    <div>
                      <p className="text-sm font-medium">{item.username}</p>
                      <p className="text-xs text-gray-400">{item.email}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
              <Pagination
                className=""
                showControls
                // variant="ghost"
                initialPage={1}
                page={page}
                total={reviewData?.totalPages}
                onChange={setPage}
                classNames={{
                  item: "rounded-sm hover:bg-[#06574C]/10",
                  cursor: "bg-[#06574C] rounded-sm text-white",
                  prev: "rounded-sm bg-white/80",
                  next: "rounded-sm bg-white/80",
                }}
              />
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
                    {data?.teacher?.firstName} {data?.teacher?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {data?.teacher?.tagline}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 text-md text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span>{data?.teacher?.rating} Teacher Rating</span>
                </div>

                <div className="flex items-center gap-1">
                  <HiUserGroup />
                  <span>{data?.teacher?.studentCount} students</span>
                </div>

                <div className="flex items-center gap-1">
                  <MdMenuBook />
                  <span>{data?.teacher?.coursesCount} Courses</span>
                </div>
              </div>

              <p className="text-sm text-[#333333] font-medium mb-2">
                {data?.teacher?.bio}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default CourseDetails;

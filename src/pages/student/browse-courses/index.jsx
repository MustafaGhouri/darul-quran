import React from "react";
import {
  Button,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
  useCheckbox,
  VisuallyHidden,
  tv,
  Pagination,
  Spinner,
  Tooltip, // ✅ IMPORTANT IMPORT
} from "@heroui/react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { RiGroupLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { CheckIcon, Clock } from "lucide-react";
import { FaIdCard } from "react-icons/fa";
import { IoSearchOutline, IoStarSharp } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery, useGetAllCoursesQuery } from "../../../redux/api/courses";
import { errorMessage } from "../../../lib/toast.config";
import Loader from "../../../components/Loader";
import { debounce } from "../../../lib/utils";

// Helper function to format duration in seconds to readable format
const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const BrowseCourses = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [difficultys, setDifficultys] = useState([]);
  const [search, setSearch] = useState('');
  const [isFree, setIsFree] = useState();
  const [sort, setSort] = useState();
  const [categoryIds, setCategoryIds] = useState([]);
  const [type, setType] = useState('all');
  const { user } = useSelector((state) => state.user);

  const { data, isFetching: isLoading, isError, error } = useGetAllCoursesQuery({ page, sort, isFree, difficulties: difficultys, categoryIds, limit, search, type });
  const { data: categoriesData, isError: categoriesError, error: categoriesErrorData } = useGetAllCategoriesQuery();

  const categories = categoriesData?.categories || [];
  const course = data?.courses || [];

  useEffect(() => {
    if (isError) {
      errorMessage(error.data.error, error.status);
    } else if (categoriesError) {
      errorMessage(categoriesErrorData.data.error, categoriesErrorData.status);
    }
  }, [isError, categoriesError]);



  const viewCourseDetails = (courseData) => {
    window.scroll(0, 0);
    navigate(`/student/browse-courses/course-details/${courseData.id}?teacher=${courseData?.teacherId || courseData?.teacher_id}`, {
      state: courseData
    });
  };

  const Sort = [
    { key: "a-z", label: "A-Z" },
    { key: "z-a", label: "Z-A" },
    { key: "latest", label: "Latest" },
    { key: "oldest", label: "Oldest" },
    { key: "Most_popular", label: "Most Popular" },
  ];

  const Subscription = [
    { key: "all", label: "All" },
    { key: "false", label: "Paid" },
    { key: "true", label: "Free" },
  ];
  const difficultyOptions = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 min-h-screen flex flex-col">
      <DashHeading
        title={"Browse Courses"}
        desc={"Discover your next learning adventure from 2,847 courses"}
      />

      <div className="bg-white p-3  rounded-lg mb-3">
        <div className="flex flex-col md:flex-row gap-3 items-center w-full">
          <Input
            placeholder="Search for a course"
            size="sm"
            radius="md"
            className="max-w-sm"
            onChange={(e) =>
              debounce(() => {
                setSearch(e.target.value);
              }, 400)
            }
            endContent={<IoSearchOutline size={20} color="#06574C" />}
          />
          <div className="flex gap-1 items-center w-fit">
            <span className="text-sm text-nowrap">Sort by:</span>
            <Select 
              placeholder="Sort" 
              size="sm"
              radius="md"
              className="w-100"
              onSelectionChange={(k) => {
                const keys = [...k];
                setSort(keys[0]);
              }}
              defaultSelectedKeys={["Most Popular"]}
            >
              {Sort.map((item) => (
                <SelectItem
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Payment type"
              title="Payment type"
              size="sm"
              radius="md"
              className="w-100"
              onSelectionChange={(k) => {
                const keys = [...k];
                setIsFree(keys[0]);
              }}
              defaultSelectedKeys={["all"]}
            >
              {Subscription.map((item) => (
                <SelectItem
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
             <Select
          placeholder="Select Course Type"
          title="Select Course Type"
          size="sm"
          radius="md"
          className=" "
          onSelectionChange={(k) => {
            const keys = [...k];
            setSort(keys[0]);
          }}
        // defaultSelectedKeys={["all"]}
        >
          <SelectItem key="all" value="all" className="capitalize">
            All Courses
          </SelectItem>

          <SelectItem description={<span title=" Pay once and get lifetime access to all course materials. Includes course player, files, and progress tracking." className="block text-xs text-gray-500">
            Pay once and get lifetime access to all course materials. Includes course player, files, and progress tracking.
          </span>} key="one_time" value="one_time" className="capitalize">
            One Time Paid
          </SelectItem>

          <SelectItem description={<span title="Scheduled live sessions requiring subscription. Access course player, files, and track progress for each live class." className="block text-xs text-gray-500">
            Scheduled live sessions requiring subscription. Access course player, files, and track progress for each live class.
          </span>} key="live" value="live" className="capitalize">
            Live Classes
          </SelectItem>
        </Select>
          </div>
        </div>
       

        <div className="mt-4">
          <div className="flex gap-2 items-center ">
            
          </div>

          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666] mb-1">
              Difficulty Level
            </h1>
            <Select
              placeholder="Select Difficulty"
              size="sm"
              radius="md"
              selectionMode="multiple"
              className="max-w-md"
              selectedKeys={new Set(difficultys)}
              onSelectionChange={(k) => {
                setDifficultys([...k]);
              }}
            >
              {difficultyOptions.map((item) => (
                <SelectItem key={item.key} value={item.key} className="capitalize">
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666] mb-1">
              Categories
            </h1>
            <Select
              placeholder="Select Categories"
              size="sm"
              radius="md"
              selectionMode="multiple"
              className="max-w-md"
              selectedKeys={new Set(categoryIds)}
              onSelectionChange={(k) => {
                setCategoryIds([...k]);
              }}
            >
              {categories.map((item) => (
                <SelectItem key={item.id} value={item.id} className="capitalize">
                  {item.categoryName}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center py-4">
        {isLoading ? <Loader height={50} /> :
          <div className="grid grid-cols-12 gap-3 pb-4">
            {course.map((item, index) => (
              <div key={index} className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  {item.thumbnail && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={item.thumbnail}
                        alt={item.courseName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Button
                          size="sm"
                          radius="sm"
                          className={`bg-white px-3 font-bold text-xs ${item.coursePrice === "0" || item.coursePrice === "00" ? "text-[#D28E3D]" : "text-[#34A853]"}`}
                        >
                          {item.coursePrice === "0" || item.coursePrice === "00" ? "Free" : "Paid"}
                        </Button>
                        {item.isFree && (
                          <span className="bg-[#34A853] text-white px-2 py-1 rounded text-xs font-semibold">
                            Free
                          </span>
                        )}
                      </div>
                      {item.rating > 0 && <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                        <IoStarSharp size={16} color="#FDD835" />
                        <p className="text-white text-xs font-medium">
                          {item.rating?.toFixed(1) || "0.0"}
                        </p>
                      </div>}
                    </div>
                  )}

                  <div className={`p-3 ${!item.thumbnail ? "bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)] rounded-t-lg" : ""}`}>
                    {!item.thumbnail && (
                      <div className="flex justify-between items-center mb-2">
                        <Button
                          size="sm"
                          radius="sm"
                          className={`bg-white px-4 font-bold text-xs ${item.coursePrice === "0" || item.coursePrice === "00" ? "text-[#D28E3D]" : "text-[#34A853]"}`}
                        >
                          {item.coursePrice === "0" || item.coursePrice === "00" ? "Free" : "Paid"}
                        </Button>
                        <div className="flex items-center gap-1">
                          <IoStarSharp size={18} color="#FDD835" />
                          <p className="text-[#060606] text-xs font-medium">
                            {item.rating?.toFixed(1) || "0.0"}
                          </p>
                        </div>
                      </div>
                    )}

                    <h3 title={item.courseName} className="text-base font-semibold text-[#060606] line-clamp-2 min-h-[2.5rem]">
                      {item.courseName}
                    </h3>

                    {item.description && (
                      <p title={item.description} className="text-xs text-[#666666] mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="p-3 pt-0 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#95C4BE33] flex items-center justify-center text-[#06574C] font-bold text-xs shrink-0">
                            {item.first_name?.charAt(0) || item.teacherId?.toString().charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#06574C] text-xs">
                              {item.first_name} {item.last_name}
                            </p>
                            <p className="text-[#666666] text-[10px]">Instructor</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <p className={`font-bold text-lg ${item.coursePrice === "0" || item.coursePrice === "00" ? "text-[#34A853]" : "text-[#D28E3D]"}`}>
                            {item.coursePrice === "0" || item.coursePrice === "00" ? "Free" : `$${item.coursePrice}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-[#6B7280] mt-3">
                        {item.studentCourseCount > 0 && (
                          <div className="flex items-center gap-1">
                            <RiGroupLine size={16} color="#06574C" />
                            <span>{item.studentCourseCount} enrolled</span>
                          </div>
                        )}
                        {item.totalLesson > 0 && (
                          <div className="flex items-center gap-1">
                            <AiOutlineEye size={16} color="#06574C" />
                            <span>{item.totalLesson} Lesson{item.totalLesson > 1 ? 's' : ""}</span>
                          </div>
                        )}

                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} color="#6B7280" />
                            <span>{item.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.category_name && (
                          <span className="text-xs px-2 py-1 rounded-md bg-[#95C4BE33] text-[#06574C]">
                            {item.category_name}
                          </span>
                        )}
                        {item.difficultyLevel && (
                          <span className="text-xs px-2 py-1 rounded-md bg-[#F1C2AC33] text-[#D28E3D]">
                            {item.difficultyLevel}
                          </span>
                        )}
                        <Tooltip color="success" content={item.type === 'live' ? 'Contains Live Class, requires subscription' : 'Contains Recorded Lessons, requires onetime payment'}>
                          <span
                            title={item.type === 'live' ? 'Contains Live Class, requires subscription' : 'Contains Recorded Lessons, requires onetime payment'}
                            className="cursor-pointer text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 capitalize">
                            {item.type.replace('_', ' ')}
                          </span>
                        </Tooltip>
                      </div>
                    </div>

                    <Button
                      radius="sm"
                      size="sm"
                      className="bg-[#06574C] text-white rounded-md w-full mt-3"
                      startContent={<AiOutlineEye size={18} />}
                      onPress={() => viewCourseDetails(item)}
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      </div>
      <div className="md:flex md:flex-row items-center pb-4 gap-2 justify-between overflow-hidden ">
        <div className="flex text-sm items-center gap-1">
          <span>Limit</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={["10"]}
            onSelectionChange={(k) => {
              const keys = [...k];
              setLimit(Number(keys[0]))
            }}
            placeholder="1"
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of {data?.total}</span>
        </div>
        <Pagination
          className=""
          showControls
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
      </div>
    </div>
  );
};

export default BrowseCourses;


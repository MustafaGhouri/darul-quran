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
  Spinner, // ✅ IMPORTANT IMPORT
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
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
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
            className="w-full"
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
              placeholder="Sort "
              size="sm"
              radius="md"
              className="w-35"
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
              className="w-20"
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
          </div>
        </div>
        <Select
          placeholder="Select Type"
          title="Select Type"
          size="sm"
          radius="md"
          className="max-w-xl mt-2"
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

        <div className="mt-4">
          <div className="flex gap-2 items-center ">
            <h1 className="text-lg font-semibold"> Filters</h1>
            <MdKeyboardArrowDown size={22} />
          </div>

          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666]  mt-3">
              Difficulty Level
            </h1>

            <CheckboxGroup onChange={(e) => setDifficultys(e)} orientation="horizontal" className="gap-2">
              {difficultyOptions.map((item) => (
                <CustomCheckbox
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666]  mt-3">
              Categories
            </h1>


            <CheckboxGroup
              onChange={(e) => setCategoryIds(e)}
              orientation="horizontal"
              className="gap-2">
              {categories.map((item) => (
                <CustomCheckbox
                  key={item.id}
                  value={item.id}
                  className="capitalize"
                >
                  {item.categoryName}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </div>

      <div>
        {isLoading ? <Loader height={50} /> : <div className="grid min-h-[45vh]  grid-cols-12 gap-3 pb-4">
          {course.map((item, index) => (
            <div key={index} className="col-span-12 md:col-span-6 lg:col-span-4 ">
              <div className="w-full bg-white rounded-lg">
                <div className="bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)]  rounded-lg p-3 ">
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      radius="sm"
                      className={`bg-white  px-4 font-bold ${item.coursePrice === "00" ? "text-[#D28E3D]" : "text-[#34A853]"}`}
                    >
                      {item.coursePrice === "00" ? "Free" : "Paid"}
                    </Button>
                    <div className="flex items-center gap-1">
                      <IoStarSharp size={20} color="#FDD835" />
                      <p className="text-[#060606] text-sm font-medium">
                        {item.rating}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <span className=" flex justify-center items-center text-center py-6 text-2xl font-semibold ">
                      {item.courseName}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#95C4BE33] flex items-center justify-center text-white font-bold text-sm  shrink-0">
                        <RiGroupLine size={22} color="#06574C" />
                      </div>
                      {item.studentCourseCount > 0 && <div>
                        <p className="font-semibold text-[#06574C] text-[16px] leading-tight">
                          {item.studentCourseCount} Enrolled
                        </p>
                      </div>}
                    </div>
                    <div className="text-end">
                      <p className={`font-semibold text-xl leading-tight ${item.Status === "Paid" ? "text-[#D28E3D]" : "text-[#34A853]"}`}>
                        {item.price}
                      </p>
                      <div className="text-sm flex items-center gap-1 text-[#666666]">
                        <FaIdCard size={20} color="#666666" />
                        {item.first_name + " " + item.last_name}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-[#6B7280]">
                      {item.duration && <div className="flex items-center gap-1 text-sm">
                        <Clock size={20} color="#6B7280" />
                        {item.duration}
                      </div>}
                      <span className="text-xs px-2 py-1 rounded-md bg-[#95C4BE33] text-[#06574C]">
                        {item.category_name}
                      </span>
                    </div>
                    {/* <Progress
                      color="success"
                      value={item.value}
                      size="sm"
                    ></Progress> */}
                  </div>
                  <div>
                    <Button
                      radius="sm"
                      size="sm"
                      className="bg-[#06574C] text-white rounded-md w-full"
                      startContent={<AiOutlineEye size={22} />}
                      onPress={() => viewCourseDetails(item)}
                    >
                      View Course
                    </Button>


                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}
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
    </div>
  );
};

export default BrowseCourses;
const CustomCheckbox = (props) => {
  const checkbox = tv({
    slots: {
      base: "border-0 bg-transparent",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "bg-success text-white rounded-md",
          content: "text-primary-foreground ",
        },
      },
    },
  });

  const { children, isSelected, getBaseProps, getLabelProps, getInputProps } =
    useCheckbox(props);

  const styles = checkbox({ isSelected });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        startContent={isSelected ? <CheckIcon size={20} color="white" /> : null}
        variant="faded"
        {...getLabelProps()}
      >
        {children}
      </Chip>
    </label>
  );
};

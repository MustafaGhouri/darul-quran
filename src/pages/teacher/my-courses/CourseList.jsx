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
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { RiGroupLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { CheckIcon, Clock } from "lucide-react";
import { FaIdCard } from "react-icons/fa";
import { IoSearchOutline, IoStarSharp } from "react-icons/io5";
import { MdKeyboardArrowDown, MdOutlineFilterList } from "react-icons/md";
import { X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery, useGetAllCoursesQuery } from "../../../redux/api/courses";
import { errorMessage } from "../../../lib/toast.config";
import Loader from "../../../components/Loader";
import { debounce } from "../../../lib/utils";
import QueryError from "../../../components/QueryError";

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

const CourseList = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [difficultys, setDifficultys] = useState([]);
    const [search, setSearch] = useState('');
    const [isFree, setIsFree] = useState();
    const [sort, setSort] = useState();
    const [categoryIds, setCategoryIds] = useState([]);
    const [type, setType] = useState('all');

    const { data, isFetching: isLoading, isError, error, refetch } = useGetAllCoursesQuery({ page, sort, isFree, difficulties: difficultys, categoryIds, limit, search, type });
    const { data: categoriesData, isError: categoriesError, error: categoriesErrorData } = useGetAllCategoriesQuery();

    const handleClearFilters = () => {
        setPage(1);
        setDifficultys([]);
        setIsFree("all");
        setSort("latest");
        setCategoryIds([]);
        setType("all");
        setSearch("");
    };

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
        navigate(`/teacher/courses/${courseData.id}?teacher=${courseData?.teacherId || courseData?.teacher_id}`, {
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
    if (error) {
        return <QueryError
            height="300px"
            error={error}
            onRetry={refetch}
            isLoading={isLoading}
            showLogo={false}
        />
    }
    return (

        <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 h-screen flex flex-col">
            <DashHeading
                title={"My Courses"}
                desc={"Manage your courses and track course progress"}
            />

            <div className="bg-white p-3 rounded-lg ">
                <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                    <Input
                        placeholder="Search for a course"
                        size="sm"
                        radius="md"
                        value={search}
                        className="w-full md:max-w-md"
                        onChange={(e) => setSearch(e.target.value)}
                        endContent={<IoSearchOutline size={20} color="#06574C" />}
                    />
                    <div className="flex gap-2 items-center w-full md:w-fit">
                        <Popover placement="bottom-end" showArrow offset={10}>
                            <PopoverTrigger>
                                <Button
                                    variant="bordered"
                                    startContent={<MdOutlineFilterList size={20} />}
                                    endContent={<MdKeyboardArrowDown size={20} />}
                                    size="sm"
                                    className="border-[#06574C] text-[#06574C] font-medium"
                                >
                                    All Filters
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-4">
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex justify-between items-center  ">
                                        <h3 className="font-semibold text-lg">Filters</h3>                                          
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Sort by</label>
                                            <Select
                                                placeholder="Sort"
                                                size="sm"
                                                radius="md"
                                                variant="bordered"
                                                className="mt-1"
                                                selectedKeys={sort ? [sort] : ["latest"]}
                                                onSelectionChange={(k) => {
                                                    const keys = [...k];
                                                    setSort(keys[0]);
                                                }}
                                            >
                                                {Sort.map((item) => (
                                                    <SelectItem key={item.key} value={item.key} className="capitalize">
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Payment type</label>
                                            <Select
                                                placeholder="Payment type"
                                                size="sm"
                                                radius="md"
                                                variant="bordered"
                                                className="mt-1"
                                                selectedKeys={isFree ? [isFree] : ["all"]}
                                                onSelectionChange={(k) => {
                                                    const keys = [...k];
                                                    setIsFree(keys[0]);
                                                }}
                                            >
                                                {Subscription.map((item) => (
                                                    <SelectItem key={item.key} value={item.key} className="capitalize">
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Course Type</label>
                                            <Select
                                                placeholder="Select Type"
                                                size="sm"
                                                radius="md"
                                                variant="bordered"
                                                className="mt-1"
                                                selectedKeys={[type]}
                                                onSelectionChange={(k) => {
                                                    const keys = [...k];
                                                    setType(keys[0]);
                                                }}
                                            >
                                                <SelectItem key="all" value="all" className="capitalize">All Courses</SelectItem>
                                                <SelectItem key="one_time" value="one_time" className="capitalize">One Time Paid</SelectItem>
                                                <SelectItem key="live" value="live" className="capitalize">Live Classes</SelectItem>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Difficulty Level</label>
                                            <Select
                                                placeholder="Difficulty Level"
                                                size="sm"
                                                radius="md"
                                                variant="bordered"
                                                selectionMode="multiple"
                                                className="mt-1"
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

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Categories</label>
                                            <Select
                                                placeholder="Categories"
                                                size="sm"
                                                variant="bordered"
                                                radius="md"
                                                selectionMode="multiple"
                                                className="mt-1"
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

                                    <Button
                                        color="primary"
                                        variant="flat"
                                        size="sm"
                                        className="w-full mt-2"
                                        onPress={handleClearFilters}
                                        startContent={<X size={16} />}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-center py-4">
                {isLoading ? <Loader height={50} /> : (
                    <div className="grid grid-cols-12 gap-3">
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
                    </div>
                )}
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

export default CourseList;


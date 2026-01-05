import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ListFilterIcon, Trash2 } from "lucide-react";
import CourseForm from "../../../components/dashboard-components/forms/CourseForm";
import { useEffect, useState } from "react";

const CourseManagement = () => {
  const classes = [
    {
      id: 1,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "draft",
      date: "2025-11-27",
    },
    {
      id: 2,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-26",
    },
    {
      id: 3,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Draft",
      date: "2025-11-17",
    },
    {
      id: 4,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-16",
    },
    {
      id: 5,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-15",
    },
    {
      id: 6,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-12",
    },
    {
      id: 7,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-03",
    },
    {
      id: 8,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-29",
    },
    {
      id: 9,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      teacher: "John Davis",
      email: "john.davis@email.com",
      enrolled: "1296",
      enrollment_limit: 1300,
      price: 199,
      reviews: "Great course, I learned a lot...",
      category: "Web Development",
      status: "Published",
      date: "2025-11-22",
    },
  ];
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${
          import.meta.env.VITE_PUBLIC_SERVER_URL
        }/api/admin/getAllCourses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setCourses(data.courses || []);
    };
    fetchCourses();
  }, []);
  const [courses, setCourses] = useState([]);
  console.log("courses",courses);
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const categories = [
    { key: "Web Development", label: "Web Development" },
    { key: "all", label: "All Category" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading desc={"Manage and monitor course catalog"} />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className=" min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select an status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select an category"
          >
            {categories.map((category) => (
              <SelectItem key={category.key}>{category.label}</SelectItem>
            ))}
          </Select>
          <Select
            radius="sm"
            className="min-w-[120px]"
            defaultSelectedKeys={["all"]}
            selectorIcon={<ListFilterIcon />}
            placeholder="Filter"
          >
            {filters.map((filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            ))}
          </Select>
        </div>
        <CourseForm />
      </div>
      <div className="">
        <div className="overflow-x-auto no-scrollbar bg-white rounded-lg">
          <Table
            aria-label="Pending approvals table"
            removeWrapper
            classNames={{
              base: "table-fixed w-full bg-white rounded-lg",
              th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] cursor-default",
              td: "py-3 align-center",
              tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936]",
            }}
          >
            <TableHeader>
              <TableColumn className="w-1/4">Course</TableColumn>
              <TableColumn className="w-1/6 text-center">Category</TableColumn>
              <TableColumn className="w-1/6">Teacher</TableColumn>
              <TableColumn className="w-1/12 text-center">Price</TableColumn>
              <TableColumn className="w-1/12 text-center">Enrolled</TableColumn>
              <TableColumn className="w-1/12 text-center">Status</TableColumn>
              <TableColumn className="w-1/6">Reviews</TableColumn>
              <TableColumn className="w-24">Actions</TableColumn>
            </TableHeader>

            <TableBody>
              {courses?.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {classItem?.course_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 whitespace-normal max-w-[220px]">
                        {classItem?.description}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="p-2 w-full text-center text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20">
                      {classItem?.category}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {classItem?.teacher_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                        {classItem?.teacher_email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-medium">${classItem?.course_price}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-medium">{classItem?.enroll_number}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <p className="p-2 w-full text-xs text-center rounded-md text-[#06574C] bg-[#95C4BE]/20">
                      {classItem.status}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-0 flex items-center">
                      <span className="font-medium truncate max-w-[220px] block">
                        {classItem?.reviews || "No reviews"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="flex items-center gap-2 justify-end">
                    <CourseForm initialData={classItem} />
                    <Button
                      radius="sm"
                      size="md"
                      className="bg-[#06574C] text-white"
                      startContent={<Trash2 color="white" />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-wrap items-center p-4 gap-2 justify-between overflow-hidden">
        <div className="flex text-sm items-center gap-1">
          <span>Showing</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={["10"]}
            placeholder="1"
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of 58</span>
        </div>
        <Pagination
          className=""
          showControls
          variant="ghost"
          initialPage={1}
          total={10}
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

export default CourseManagement;

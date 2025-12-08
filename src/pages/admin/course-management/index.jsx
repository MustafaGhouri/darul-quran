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
        <div className="flex  items-center gap-2">
          <Select
            className="md:min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select an status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="md:min-w-[120px]"
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
            className="md:min-w-[120px]"
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
      <div className="max-sm:hsidden overflow-hidden">
        <Table
          aria-label="Pending approvals table"
          removeWrapper
          classNames={{
            base: "bg-white rounded-lg ",
            th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] cursor-default",
            td: "py-3",
            tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936] text-nowrap cursor-pointer overflow-hidden",
          }}
        >
          <TableHeader>
            <TableColumn >Course</TableColumn>
            <TableColumn >Category</TableColumn>
            <TableColumn >Teacher</TableColumn>
            <TableColumn >Price</TableColumn>
            <TableColumn >Enrolled</TableColumn>
            <TableColumn >Status</TableColumn>
            <TableColumn >Reviews</TableColumn>
            <TableColumn >Actions</TableColumn>
          </TableHeader>

          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {classItem.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {classItem.desc}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="p-2 w-full text-center text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20">
                    {classItem.category}
                  </p>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{classItem.teacher}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {classItem.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${classItem.price}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{classItem.enrolled}</span>
                </TableCell>
                <TableCell>
                  <p className="p-2 w-full text-xs text-center rounded-md text-[#06574C] bg-[#95C4BE]/20">
                    {classItem.status}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-medium truncate max-w-56">
                    {classItem.reviews}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <CourseForm initialData={classItem} />
                  <Button
                    radius="sm"
                    size="sm"
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
      <div className="flex items-center p-4 gap-2 justify-between">
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

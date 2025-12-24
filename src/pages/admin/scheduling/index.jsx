import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
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
import { Calendar, Copy, ListFilterIcon, PlusIcon, Trash2 } from "lucide-react";

const Scheduling = () => {
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
      status: "Completed",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Upcoming",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Completed",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Cancelled",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Upcoming",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Completed",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Completed",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Completed",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
      status: "Canceled",
      date: "2025-11-27",
      time: "Today, 2:00 PM",
      cencelled: "#E8505B",
      cancelledbg: "#FFEAEC",
      complete: "#06574C",
      completebg: "#95C4BE33",
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
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"Schedule Live Classes"}
        desc={"Manage and organize your upcoming live sessions"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className="min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
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
          <DatePicker showMonthAndYearPickers radius="sm"></DatePicker>
        </div>
        {/* <CourseForm /> */}
        <Button
          startContent={<PlusIcon />}
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white max-md:w-full"
        >
          Schedule New
        </Button>
      </div>
      <div className="">
        <Table
          removeWrapper
          classNames={{
            base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar",
            th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C936]",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200 ",
          }}
        >
          <TableHeader>
            <TableColumn className="bg-[#EBD4C9]/30">Course</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Teacher</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Date</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Time</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Status</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Zoom Link</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Actions</TableColumn>
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
                  <div className="flex-col flex">
                    <span className="font-semibold">{classItem.teacher}</span>
                    <span>{classItem.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{classItem.date}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{classItem.time}</span>
                </TableCell>
                <TableCell>
                  <p
                    className={`p-2 w-full text-center rounded-md ${
                      classItem.status === "Completed" ||
                      classItem.status === "Upcoming"
                        ? `text-[${classItem.complete}] bg-[${classItem.completebg}]`
                        : `text-[${classItem.cencelled}] bg-[${classItem.cancelledbg}]`
                    } `}
                  >
                    {classItem.status}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <span>
                      <Copy color="#3F86F2" size={20} />
                    </span>
                    <span className="text-[#3F86F2]">Copy link</span>
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {/* <CourseForm initialData={classItem} /> */}
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="border-[#06574C] "
                    startContent={<Calendar size={20} color="#06574C" />}
                  >
                    Reschedule
                  </Button>
                  <Button
                    radius="sm"
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

export default Scheduling;

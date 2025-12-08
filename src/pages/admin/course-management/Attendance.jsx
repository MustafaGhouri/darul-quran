import {
  Button,
  Link,
  Progress,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Download,
  Edit,
  ExternalLink,
  Eye,
  ListFilterIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SharedLayoutAnimation from "../../../components/dashboard-components/motiondiv";

const Attendance = () => {
  const [events, setEvents] = useState([
    { title: "iOS Workshop", date: "2025-11-02" },
    { title: "React Basics", date: "2025-11-06", color: "#f0e68c" },
    { title: "Python Basics", date: "2025-11-09", color: "#dcd0ff" },
    { title: "Marketing Research", date: "2025-11-14", color: "#90ee90" },
    { title: "iOS Workshop", date: "2025-11-18", color: "#ffcccc" },
    { title: "JS Workshop", date: "2025-11-18", color: "#ffebcc" },
    { title: "React Basics", date: "2025-11-22", color: "#f0e68c" },
    { title: "iOS Workshop", date: "2025-11-22", color: "#ffcccc" },
    { title: "React Basics", date: "2025-11-28", color: "#f0e68c" },
    { title: "iOS Workshop", date: "2025-11-28", color: "#ffcccc" },
    { title: "JS Workshop", date: "2025-11-28", color: "#ffebcc" },
    { title: "Python Basics", date: "2025-11-28", color: "#dcd0ff" },
  ]);
  const classes = [
    {
      id: 1,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "draft",
      date: "2025-11-27",
    },
    {
      id: 2,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-26",
    },
    {
      id: 3,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Draft",
      date: "2025-11-17",
    },
    {
      id: 4,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-16",
    },
    {
      id: 5,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-15",
    },
    {
      id: 6,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-12",
    },
    {
      id: 7,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-03",
    },
    {
      id: 8,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-29",
    },
    {
      id: 9,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      enrollments: "1,247",
      email: "john.davis@email.com",
      attendance_rate: 70,
      price: "1,247",
      reviews: "Great course, I learned a lot...",
      category: "Nov 20, 2025",
      status: "Published",
      date: "2025-11-22",
    },
  ];

    const students = [
    { id: 1, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
    { id: 2, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
    { id: 3, name: "Alex Thompson", course: "React Masterclass", progress: 75 },
  ];

  const handleDateClick = (info) => {
    alert("Clicked on date: " + info.dateStr);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];

  const filters = [{ key: "all", label: "Filter" }];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 ">
      <DashHeading
        title={"Attendance & Progress"}
        desc={"Track student attendance and course progress"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex  items-center gap-2">
          <Select
            className="md:min-w-[160px]"
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
        <Button
          radius="sm"
          startContent={<Download color="white" size={15} />}
          className="bg-[#06574C] text-white py-6 px-3 sm:px-4"
        >
          Export
        </Button>
      </div>
      {/* <div className="max-sm:hidden overflow-hidden"> */}
      <Table
        //    isHeaderSticky
        aria-label="Pending approvals table"
        removeWrapper
        classNames={{
          base: "bg-white rounded-lg ",
          th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
          td: "py-3",
          tr: "border-b border-default-200",
        }}
      >
        <TableHeader>
          <TableColumn>Session</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Enrollments</TableColumn>
          <TableColumn>Attended</TableColumn>
          <TableColumn>Attendance Rate</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell className="px-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {classItem.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {classItem.desc}
                  </div>
                </div>
              </TableCell>

              <TableCell>{classItem.category}</TableCell>
              <TableCell>{classItem.enrollments}</TableCell>
              <TableCell>{classItem.price}</TableCell>

              <TableCell>
                <div className="flex justify-between items-center gap-2">
                <Progress
                  classNames={{ indicator: "bg-[#95C4BE]" }}
                  // showValueLabel
                  size="sm"
                  value={classItem.attendance_rate}
                />
                  <p className="text-end">{classItem.attendance_rate}%</p>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  radius="sm"
                  className="bg-[#06574C] text-white"
                  startContent={<Eye size={18} color="white" />}
                >
                  View Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div> */}
    
     <div className="bg-white px-4 py-3 rounded-lg my-3">
      <h1 className="text-xl font-bold">Top Performing Students</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {students.map((s) => (
          <div
            key={s.id}
            className="rounded-lg px-4 py-6 bg-[#EAF6F4] shadow-sm flex flex-col justify-between"
            style={{ minHeight: 120 }}
          >
            <div>
              <div className="text-sm font-semibold text-gray-800">{s.name}</div>
              <div className="text-xs text-gray-500 mt-1">{s.course}</div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-[#06574C] font-semibold">Progress</div>
                <div className="text-sm font-semibold text-gray-700">{s.progress}%</div>
              </div>

              <Progress
                className="h-2 rounded-full"
                classNames={{ indicator: "bg-[#95C4BE]" }}
                showValueLabel={false}
                size="md"
                value={s.progress}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </div>
  );
};

export default Attendance;

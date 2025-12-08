import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
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
import {
  Album,
  BellRing,
  Book,
  ChartLine,
  Download,
  Edit,
  Eye,
  ListFilterIcon,
  Mail,
  MessageSquare,
  Pi,
  PlusIcon,
  SearchIcon,
  Trash2,
  UsersRound,
} from "lucide-react";
import OverviewCards from "../../../components/dashboard-components/OverviewCards";
import AnalyticsCards from "../../../components/dashboard-components/AnalyticsCards";
import ApexChart from "../../../components/dashboard-components/AnalyticsChat";
import BarChart from "../../../components/dashboard-components/BarChart";
import PieChart from "../../../components/dashboard-components/PieChart";
import { details, title } from "framer-motion/client";

const Analytics = () => {
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const Datefilters = [
    { key: "Today, 4 Dec 2025", label: "Today, 4 Dec 2025" },
    { key: "Yesterday,  3 Dec2025", label: "Yesterday, 3 Dec 2025" },
    { key: "Tommorrow, 5 Dec 2025", label: "Tommorrow, 5 Dec 2025" },
  ];
  const cardsData = [
    {
      title: "Total Enrollments",
      value: "12,847",
      icon: <Album size={26} color="#06574C" />,
      changeText: "+12.5% from last month",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Revenue",
      value: "$89,432",
      icon: <ChartLine size={26} color="#06574C" />,
      changeText: "Avg. duration: 28m",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Active Users",
      value: "3,847",
      icon: <UsersRound size={26} color="#06574C" />,
      changeText: "-2.1% from last week",
      changeColor: "text-[#E8505B]",
    },
  ];

  const refundheader = [
    { key: "User Name", label: "User Name" },
    { key: "Role", label: "Role" },
    { key: "Details ", label: "Details " },
    { key: "Action", label: "Action" },
    { key: "Date ", label: "Date " },
    { key: "Time", label: "Time" },
    { key: "Status", label: "Status" },
  ];

  const PaymentTable = [
    {
      id: 1,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      details: "Successful login via web browser",
      email: "john.davis@email.com",
      amount: "$149.99",
      role: "Student",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Login",
      date: "Nov 20, 2025",
      status: "Failed",
    },
    {
      id: 2,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      details: "Enrolled in 'Advanced Mathematics'",
      email: "john.davis@email.com",
      amount: "$149.99",
      role: "Teacher",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Enrollment",
      date: "Nov 20, 2025",
      status: "Success",
    },
    {
      id: 3,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      details: "Paid $350 for 'Chemistry Basics'",
      email: "john.davis@email.com",
      amount: "$149.99",
      role: "Student",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Payment",
      date: "Nov 20, 2025",
      status: "Failed",
    },
    {
      id: 4,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      details: "Marked attendance for 'Physics 101'",
      email: "john.davis@email.com",
      amount: "$149.99",
      role: "Teacher",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Attendance",
      date: "Nov 20, 2025",
      status: "Success",
    },
  ];

  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const progressbar = [
    // Left Side
    { title: "Python", value: 36, color: "#EBD4C9" },
    { title: "HTML", value: 24, color: "#EBD4C9" },
    { title: "React", value: 310, color: "#EBD4C9" },

    // Right Side
    { title: "JavaScript", value: 19, color: "#95C4BE" },
    { title: "Urdu", value: 32, color: "#95C4BE" },
    { title: "CSS", value: 270, color: "#95C4BE" },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"Announcements"}
        desc={"Manage and send announcements to your organization"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex  items-center gap-2">
          <Select
            className="md:min-w-[150px]"
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
          startContent={<Download size={20} />}
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Export
        </Button>
      </div>
      <AnalyticsCards data={cardsData} />
      <div className="grid grid-cols-12 gap-3 my-3">
        <div className="col-span-6 bg-white p-3 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Revenue Analytics</h1>
            <Select
              radius="sm"
              className="w-50"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
          <ApexChart />
        </div>
        <div className="col-span-6 bg-white p-3 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Enrollment Trends</h1>
            <Select
              radius="sm"
              className="w-50"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
          <BarChart />
        </div>
        <div className="col-span-6 bg-white px-3 py-5 rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Course Performance Analytics</h1>
            <Select
              radius="sm"
              className="w-50"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-between mt-6">
            <div className="w-[48%]">
              {progressbar
                .slice(0, Math.ceil(progressbar.length / 2))
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-gray-600">{item.value}</span>
                    </div>
                    <Progress
                      aria-label="Loading..."
                      className="w-full"
                      classNames={{
                        track: "bg-gray-200", // Background color
                        indicator: `bg-[${item.color}]`, // Fill color
                      }}
                      size="md"
                      value={item.value}
                    />
                  </div>
                ))}
            </div>
            <div className="w-[48%]">
              {progressbar
                .slice(Math.ceil(progressbar.length / 2))
                .map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600">{item.value}</span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <Progress
                      aria-label="Loading..."
                      className="w-full "
                      classNames={{
                        track: "bg-gray-200", // Background color
                        indicator: `bg-[${item.color}]`, // Fill color
                      }}
                      size="md"
                      value={item.value}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-6 bg-white p-3 rounded-lg">
          <PieChart />
        </div>
        <div className="col-span-12 bg-white px-3 py-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">User Activity Logs</h1>
            </div>
            <div className="flex gap-3 items-center">
              <Select
                radius="sm"
                className="w-60 !border-[#06574C]"
                variant="bordered"
                // defaultSelectedKeys={["all"]}
                placeholder="Filter"
              >
                {statuses.map((items) => (
                  <SelectItem key={items.key}>{items.label}</SelectItem>
                ))}
              </Select>
              <DatePicker
                radius="sm"
                className="w-50"
                variant="bordered"
                showMonthAndYearPickers
              />
              <Input
                radius="sm"
                variant="bordered"
                placeholder="Search user activities..."
                endContent={<SearchIcon size={20} />}
              />
            </div>
          </div>
          <div className="mt-3">
            <Table
              //    isHeaderSticky
              aria-label="Pending approvals table"
              removeWrapper
              classNames={{
                base: "bg-white rounded-lg ",
                th: "font-bold p-4  text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
                td: "py-3",
                tr: "border-b border-default-200",
              }}
            >
              <TableHeader>
                {refundheader.map((item) => (
                  <TableColumn key={item.key}>{item.label}</TableColumn>
                ))}
              </TableHeader>

              <TableBody>
                {PaymentTable.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="px-4">
                      <h1 className="font-semibold text-sm">
                        {classItem.student_name}
                      </h1>
                      <h1 className="text-xs">{classItem.email}</h1>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-[#95C4BE33] text-[#06574C] w-30"
                      >
                        {classItem.role}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span>{classItem.details}</span>
                    </TableCell>

                    <TableCell>
                      <div className="p-2 bg-[#FBF4EC] text-[#D28E3D] text-xs text-center rounded-md">
                        {classItem.action}
                      </div>
                    </TableCell>
                    <TableCell>{classItem.date}</TableCell>
                    <TableCell>{classItem.time}</TableCell>

                    <TableCell>
                      <div
                        className={`p-2 ${
                          classItem.status === "Failed"
                            ? "bg-[#FFEAEC] text-[#E8505B]"
                            : "bg-[#95C4BE33] text-[#06574C]"
                        } text-xs text-center rounded-md`}
                      >
                        {classItem.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        </div>
      </div>
    </div>
  );
};

export default Analytics;

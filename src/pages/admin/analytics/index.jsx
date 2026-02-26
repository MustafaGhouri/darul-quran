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
import { useGetAnalyticsQuery } from "../../../redux/api/analytics";

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
  const { data, isLoading } = useGetAnalyticsQuery();

  const cardsData = [
    {
      title: "Active Courses",
      value: data?.data?.activeCourses?.toLocaleString() || "0",
      icon: <Album size={26} color="#06574C" />,
      changeText: "+12.5% from last month",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Revenue",
      value: `$${data?.data?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      icon: <ChartLine size={26} color="#06574C" />,
      changeText: "Avg. duration: 28m",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Active Users",
      value: data?.data?.totalUsers?.toLocaleString() || "0",
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
  const progressbar = data?.data?.coursePerformance?.map((item, index) => ({
    title: item.title,
    value: item.value,
    color: index % 2 === 0 ? "#EBD4C9" : "#95C4BE",
  })) || [];

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"Logs & Analytics"}
        desc={"Monitor platform activity and performance metrics"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex  items-center gap-2">
          <Select
            className="min-w-[130px]"
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
        </div>
        <Button
          startContent={<Download size={20} />}
          size="lg"
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Export
        </Button>
      </div>
      <AnalyticsCards data={cardsData} isLoading={isLoading} />
      <div className="grid grid-cols-12 gap-3 my-3 px-3 md:px-0">
        <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
          <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4">
            <h1 className="text-2xl font-bold">Revenue Analytics</h1>
            <Select
              radius="sm"
              className="w-50 "
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
              classNames={{
                value: "!text-gray-400",
                trigger: "!text-gray-400",
                listbox: "!text-gray-400",
                item: "!data-[selected=true]:text-gray-400",
              }}
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
          <ApexChart data={data?.data?.revenueAnalytics}  isLoading={isLoading}/>
        </div>
        <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
          <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4">
            <h1 className="text-2xl font-bold">Enrollment Trends</h1>
            <Select
              radius="sm"
              className="w-50"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
              classNames={{
                value: "!text-gray-400",
                trigger: "!text-gray-400",
                listbox: "!text-gray-400",
                item: "!data-[selected=true]:text-gray-400",
              }}
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
          <BarChart data={data?.data?.enrollmentTrends} isLoading={isLoading}/>
        </div>
        <div className="col-span-12 md:col-span-6 bg-white px-3 py-5 rounded-lg">
          <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
            <h1 className="text-2xl font-bold">Course Performance Analytics</h1>
            {/* <Select
              radius="sm"
              className="w-50"
              variant="bordered"
              defaultSelectedKeys={["all"]}
              placeholder="Select Filtered Date"
              classNames={{
                value: "!text-gray-400",
                trigger: "!text-gray-400",
                listbox: "!text-gray-400",
                item: "!data-[selected=true]:text-gray-400",
              }}
            >
              {Datefilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select> */}
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
                      maxValue={Math.max(...progressbar.map(p => p.value), 100)}
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
                      <span className="font-medium text-right flex-1">{item.title}</span>
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
                      maxValue={Math.max(...progressbar.map(p => p.value), 100)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
          <PieChart data={data?.data?.classStatusOverview} />
        </div>
        <div className="col-span-12 bg-white px-3 py-6 rounded-lg">
          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-xl font-bold">User Activity Logs</h1>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Select
                radius="sm"
                className="w-full md:w-60 !border-[#06574C] "
                variant="bordered"
                defaultSelectedKeys={["all"]}
                placeholder="Filter"
              >
                {statuses.map((items) => (
                  <SelectItem key={items.key}>{items.label}</SelectItem>
                ))}
              </Select>
              <DatePicker
                radius="sm"
                className="w-full md:w-50"
                variant="bordered"
                showMonthAndYearPickers
              />
              <Input
                className="w-full md:w-60"
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
                base: "bg-white rounded-lg overflow-x-scroll no-scrollbar",
                th: "font-bold text-sm p-4  text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
                td: "py-3 items-center whitespace-nowrap",
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
                      <h1 className="text-xs text-[#9A9A9A]">{classItem.email}</h1>
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
                        } text-xs text-center rounded-md font-semibold`}
                      >
                        {classItem.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-wrap overflow-hidden items-center p-4 gap-2 justify-between">
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

import React, { useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Progress,
  Select,
  SelectItem,
  Skeleton,
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
import { useGetAnalyticsQuery, useGetActivitiesQuery } from "../../../redux/api/analytics";
import QueryError from "../../../components/QueryError";
import { format } from "date-fns";

const Analytics = () => {
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const [revenueFilter, setRevenueFilter] = useState("week");
  const [enrollmentFilter, setEnrollmentFilter] = useState("week");
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(10);
  const [logsSearch, setLogsSearch] = useState("");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const Datefilters = [
    { key: "today", label: `Today, ${formatDate(today)}` },
    { key: "yesterday", label: `Yesterday, ${formatDate(yesterday)}` },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  const { data, isLoading, error, refetch } = useGetAnalyticsQuery({
    revenueFilter,
    enrollmentFilter,
  });

  const { data: logsDataResponse, isLoading: logsLoading } = useGetActivitiesQuery({
    page: logsPage,
    limit: logsLimit,
    search: logsSearch,
  });

  if (error) {
    return (
      <QueryError
        height="300px"
        error={error.message}
        onRetry={refetch}
        showLogo={false}
      />
    );
  }

  const analyticsData = data?.data;

  const cardsData = [
    {
      title: "Active Courses",
      value: analyticsData?.activeCourses?.toLocaleString() || "0",
      icon: <Album size={26} color="#06574C" />,
      changeText: `${Number(analyticsData?.activeCoursesChange) >= 0 ? "+" : ""}${analyticsData?.activeCoursesChange || "0.0"}% from last month`,
      changeColor:
        Number(analyticsData?.activeCoursesChange) >= 0
          ? "text-[#38A100]"
          : "text-[#E8505B]",
    },
    {
      title: "Revenue",
      value: `€${(analyticsData?.revenueToday || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <ChartLine size={26} color="#06574C" />,
      changeText: `${Number(analyticsData?.revenueChange) >= 0 ? "+" : ""}${analyticsData?.revenueChange || "0.0"}% from yesterday`,
      changeColor:
        Number(analyticsData?.revenueChange) >= 0
          ? "text-[#38A100]"
          : "text-[#E8505B]",
    },
    {
      title: "Active Users",
      value: analyticsData?.totalUsers?.toLocaleString() || "0",
      icon: <UsersRound size={26} color="#06574C" />,
      changeText: `${Number(analyticsData?.activeUsersChange) >= 0 ? "+" : ""}${analyticsData?.activeUsersChange || "0.0"}% from last week`,
      changeColor:
        Number(analyticsData?.activeUsersChange) >= 0
          ? "text-[#38A100]"
          : "text-[#E8505B]",
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

  const activities = logsDataResponse?.activities || [];
  const totalLogs = logsDataResponse?.total || 0;

  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const progressbar =
    data?.data?.coursePerformance?.map((item, index) => ({
      title: item.title,
      value: item.value,
      color: index % 2 === 0 ? "#EBD4C9" : "#95C4BE",
    })) || [];

  const handleExport = () => {
    // Basic cards data
    const overviewData = [
      ["Metric", "Value", "Change"],
      ...cardsData.map((c) => [
        `"${c.title}"`,
        `"${c.value.replace(/\$/g, "")}"`, // Remove $ for clean numbers
        `"${c.changeText}"`,
      ]),
      [],
    ];

    // Revenue Analytics
    const revenueData = [
      ["Revenue Analytics"],
      ["Week/Period", "Revenue"],
      ...(data?.data?.revenueAnalytics || []).map((item) => [
        `"${item.week_label || ""}"`,
        `"${item.revenue || "0"}"`,
      ]),
      [],
    ];

    // Enrollment Trends
    const enrollmentData = [
      ["Enrollment Trends"],
      ["Period", "Enrollments"],
      ...(data?.data?.enrollmentTrends || []).map((item) => [
        `"${item.x || ""}"`,
        `"${item.y || "0"}"`,
      ]),
      [],
    ];

    // Course Performance Analytics
    const coursePerformanceData = [
      ["Course Performance Analytics"],
      ["Course Title", "Value"],
      ...progressbar.map((item) => [
        `"${item.title || ""}"`,
        `"${item.value || "0"}"`,
      ]),
      [],
    ];

    // Class Status Overview
    const classStatusLabels = [
      "Upcoming",
      "Cancelled",
      "Missed",
      "In Progress",
    ];
    const classStatusData = [
      ["Class Status Overview"],
      ["Status", "Value"],
      ...(data?.data?.classStatusOverview || []).map((item, index) => [
        `"${classStatusLabels[index] || ""}"`,
        `"${item || "0"}"`,
      ]),
      [],
    ];

    // Activity Logs data
    const logsHeader = [
      ["User Activity Logs"],
      [
        "Student Name",
        "Email",
        "Role",
        "Details",
        "Action",
        "Date",
        "Time",
        "Status",
      ],
    ];

    const logsData = PaymentTable.map((item) => [
      `"${item.student_name}"`,
      `"${item.email}"`,
      `"${item.role}"`,
      `"${item.details}"`,
      `"${item.action}"`,
      `"${item.date}"`,
      `"${item.time}"`,
      `"${item.status}"`,
    ]);

    const csvContent = [
      ...overviewData,
      ...revenueData,
      ...enrollmentData,
      ...coursePerformanceData,
      ...classStatusData,
      ...logsHeader,
      ...logsData,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_export_${formatDate(today).replace(/ /g, "_")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <div className="flex justify-between items-center">
        <DashHeading
          title={"Logs & Analytics"}
          desc={"Monitor platform activity and performance metrics"}
        />
        <Button
          onPress={handleExport}
          startContent={<Download size={20} />}
          size="lg"
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Export
        </Button>
      </div>
      {/* <div> */}
      <AnalyticsCards data={cardsData} isLoading={isLoading} />
      <div className="grid grid-cols-12 gap-3 my-3 px-3 md:px-0">
        {isLoading ? (
          <Skeleton className="col-span-12 md:col-span-6 w-full h-[400px] bg-white rounded-lg p-4 shadow-sm" />
        ) : (
          <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
            <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4">
              <h1 className="text-2xl font-bold">Revenue Analytics</h1>
              <Select
                radius="sm"
                className="w-50 "
                variant="bordered"
                selectedKeys={[revenueFilter]}
                onSelectionChange={(keys) =>
                  setRevenueFilter(Array.from(keys)[0])
                }
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

            <ApexChart
              data={data?.data?.revenueAnalytics}
              isLoading={isLoading}
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="col-span-12 md:col-span-6 w-full h-[400px] bg-white rounded-lg p-4 shadow-sm" />
        ) : (
          <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
            <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mb-4">
              <h1 className="text-2xl font-bold">Enrollment Trends</h1>
              <Select
                radius="sm"
                className="w-50"
                variant="bordered"
                selectedKeys={[enrollmentFilter]}
                onSelectionChange={(keys) =>
                  setEnrollmentFilter(Array.from(keys)[0])
                }
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
            <BarChart
              data={data?.data?.enrollmentTrends}
              isLoading={isLoading}
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="col-span-12 md:col-span-6 w-full h-[400px] bg-white rounded-lg p-4 shadow-sm" />
        ) : (
          <div className="col-span-12 md:col-span-6 bg-white px-3 py-5 rounded-lg">
            <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
              <h1 className="text-2xl font-bold">
                Course Performance Analytics
              </h1>
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
                        maxValue={Math.max(
                          ...progressbar.map((p) => p.value),
                          100,
                        )}
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
                        <span className="font-medium text-right flex-1">
                          {item.title}
                        </span>
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
                        maxValue={Math.max(
                          ...progressbar.map((p) => p.value),
                          100,
                        )}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        {isLoading ? (
          <Skeleton className="col-span-12 md:col-span-6 w-full h-[400px] bg-white rounded-lg p-4 shadow-sm" />
        ) : (
          <div className="col-span-12 md:col-span-6 bg-white p-3 rounded-lg">
            <PieChart data={data?.data?.classStatusOverview} />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="col-span-12 w-full h-[400px] bg-white rounded-lg p-4 shadow-sm" />
        ) : (
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
                  value={logsSearch}
                  onValueChange={setLogsSearch}
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

                <TableBody
                  isLoading={logsLoading}
                  loadingContent={<Skeleton className="w-full h-8" />}
                  emptyContent={"No activity logs found."}
                >
                  {activities.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="px-4">
                        <h1 className="font-semibold text-sm">
                          {log.userName}
                        </h1>
                        <h1 className="text-xs text-[#9A9A9A]">
                          {log.email}
                        </h1>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-[#95C4BE33] text-[#06574C] w-30 capitalize"
                        >
                          {log.role}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span>{log.activity}</span>
                      </TableCell>

                      <TableCell>
                        <div className="p-2 bg-[#FBF4EC] text-[#D28E3D] text-xs text-center rounded-md">
                          {log.activityTitle}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(log.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(log.createdAt), "hh:mm a")}</TableCell>

                      <TableCell>
                        <div
                          className={`p-2 bg-[#95C4BE33] text-[#06574C] text-xs text-center rounded-md font-semibold`}
                        >
                          Success
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
                    selectedKeys={[String(logsLimit)]}
                    onSelectionChange={(keys) => setLogsLimit(Number(Array.from(keys)[0]))}
                    placeholder="1"
                  >
                    {limits.map((limit) => (
                      <SelectItem key={limit.key}>{limit.label}</SelectItem>
                    ))}
                  </Select>
                  <span className="min-w-56">Out of {totalLogs}</span>
                </div>
                <Pagination
                  className=""
                  showControls
                  variant="ghost"
                  page={logsPage}
                  onChange={setLogsPage}
                  total={logsDataResponse?.totalPages || 1}
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
        )}
      </div>
    </div>
  );
};

export default Analytics;

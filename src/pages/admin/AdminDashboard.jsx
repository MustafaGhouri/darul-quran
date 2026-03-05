import {
  Button,
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
import BarCharts from "../../components/charts/BarCharts";
import AreaCharts from "../../components/charts/AreaChart";
import {
  BookIcon,
  ChartPie,
  MegaphoneIcon,
  PlusIcon,
  UsersIcon,
  UsersRound,
  UserStar,
  Video,
} from "lucide-react";
import OverviewCards from "../../components/dashboard-components/OverviewCards";
import { Link, useNavigate } from "react-router-dom";
import NotificationPermission from "../../components/NotificationPermission";
import { useGetAdminDashboardQuery } from "../../redux/api/dashboard";
import { convertTo12hrsFormat } from "../../lib/utils";
import { useSelector } from "react-redux";
import QueryError from "../../components/QueryError";

const AdminDashboard = () => {
  const { data: dashboardData, isLoading, error, refetch } = useGetAdminDashboardQuery();
  const { user: currentUser } = useSelector((state) => state.user);

  const data = dashboardData?.data || {};
  const stats = data.stats || {};

  const cardsData = [
    {
      title: "Total Enrollments",
      value: stats.total_enrollments || "0",
      icon: <UserStar color="#06574C" size={22} />,
      changeText: "Total students registered",
      changeColor: "text-[#06574C]",
    },
    {
      title: "Revenue",
      value: `$${Number(stats.total_revenue || 0).toLocaleString()}`,
      icon: <ChartPie color="#06574C" size={22} />,
      changeText: "Total revenue generated",
      changeColor: "text-[#06574C]",
    },
    {
      title: "Active Users",
      value: stats.active_users || "0",
      icon: <UsersRound color="#06574C" size={22} />,
      changeText: "Active in last week",
      changeColor: "text-[#06574C]",
    },
    {
      title: "Live Classes Today",
      value: stats.live_classes_today || "0",
      icon: <Video color="#06574C" size={22} />,
      changeText: "Scheduled for today",
      changeColor: "text-[#06574C]",
    },
  ];

  const upcomingClasses = data?.upcomingClasses || [];

  const columns = "2fr 1.5fr 1fr 0.8fr 0.8fr";
  const featured = data?.featured || [];
  const navigate = useNavigate();
  if (error) {
    return <QueryError
      height="300px"
      error={error}
      onRetry={refetch}
      showLogo={false}
    />
  }
  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      {/* banner */}
      <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <div className="flex max-sm:flex-wrap gap-3 justify-between items-start">
          <div>
            {featured.length > 0 ? (
              <div>
                <h1 className="text-xl sm:text-3xl text-white font-semibold capitalize">
                  {featured[0]?.title}
                </h1>
                <p className="text-white text-lg sm:text-xl overflow-hidden line-clamp-2">
                  {featured[0]?.description}
                </p>
              </div>
            ) : (
              <p className="text-white text-xl">
                {" "}
                Welcome to Darul Quran{" "}
                {currentUser?.firstName + "" + currentUser?.lastName}{" "}
              </p>
            )}
            <Button
              as={Link}
              to={`/admin/announcements`}
              size="sm"
              className="bg-[#06574C] text-white rounded-md mt-2"
            >
              View Announcements
            </Button>
          </div>
          <div>
            <NotificationPermission />
          </div>
        </div>
      </div>

      <OverviewCards data={cardsData} isLoading={isLoading} />

      <div className="py-4 grid grid-cols-1 md:grid-cols-2 justify-between gap-4 items-center  px-2 md:px-0">
        {isLoading ? (
          <Skeleton
            className="w-full h-100 bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4 shadow-lg"
            count={1}
          />
        ) : (
          <div className=" flex flex-col items-center bg-white w-full rounded-lg overflow-scroll no-scrollbar">
            <div className="p-4 w-full flex items-center justify-between ">
              <h1 className="text-xl font-bold">Revenue Trend</h1>
            </div>
            <div className="overflow-scroll no-scrollbar w-full ">
              <AreaCharts data={data.revenueTrend} />
            </div>
          </div>
        )}
        {isLoading ? (
          <Skeleton
            className="w-full h-100 bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4 shadow-lg"
            count={1}
          />
        ) : (
          <div className="p-4 flex flex-col items-center  w-full bg-white  rounded-lg">
            <div className="flex items-center w-full  justify-between">
              <h1 className="text-xl font-bold">User Activity</h1>
            </div>
            <BarCharts data={data.userActivity} />
          </div>
        )}
      </div>

      {isLoading ? (
        <Skeleton
          className="w-full h-100 bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4 shadow-lg"
          count={1}
        />
      ) : (
        <div className="px-2 sm:px-6 py-4 sm:rounded-lg sm:bg-white">
          <div className="pace-y-6">
            <div className="sm:hidden rounded-2xl overflow-hidden">
              <div className="flex justify-between my-4 items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Upcoming Live Classes
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">View all</p>
              </div>

              <div className="divide-y divide-gray-100 space-y-2">
                {upcomingClasses.slice(0, 4).map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classItem={{
                      ...classItem,
                      name: classItem.title,
                      subtitle: classItem.description,
                      teacher: "Teacher", // Add placeholder if needed
                      email: "",
                      time: `${classItem.start_time} - ${classItem.end_time}`,
                      enrolled: "N/A",
                      status: classItem.status || "Scheduled",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="max-sm:hidden overflow-hidden">
              <div className="flex items-center justify-between py-4 ">
                <h2 className="text-xl font-medium text-gray-900">
                  Upcoming Live Classes
                </h2>
                <Button
                  startContent={<PlusIcon />}
                  className="text-sm bg-[#06574C] text-white"
                  onPress={() => navigate("/admin/class-scheduling")}
                >
                  Schedule New
                </Button>
              </div>

              <Table
                aria-label="Upcoming classes table"
                removeWrapper
                classNames={{
                  base: "bg-white  ",
                  th: "font-bold p-4  text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200 ",
                  td: "py-3",
                  tr: "border-b border-default-200",
                }}
              >
                <TableHeader columns={columns}>
                  <TableColumn className="bg-[#EBD4C9]/30 rounded-none">
                    Class
                  </TableColumn>
                  <TableColumn className="bg-[#EBD4C9]/30">Time</TableColumn>
                  <TableColumn className="bg-[#EBD4C9]/30">Enrolled</TableColumn>
                  <TableColumn className="bg-[#EBD4C9]/30">Status</TableColumn>
                </TableHeader>

                <TableBody emptyContent={"No upcoming classes found"}>
                  {upcomingClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {classItem.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                            {classItem.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {convertTo12hrsFormat(classItem.start_time)} -{" "}
                          {convertTo12hrsFormat(classItem.end_time)} UTC
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{classItem.totalEnrolled}/{classItem.enrollmentLimit}</span>
                      </TableCell>
                      <TableCell>
                        <p className="p-2 w-full text-center rounded-md text-[#06574C] bg-[#95C4BE]/20">
                          {classItem.status || "Scheduled"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      <div className="px-2 sm:px-6 py-4 sm:rounded-lg sm:bg-white my-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="solid"
            color="primary"
            startContent={<PlusIcon />}
            className="w-full py-4 bg-[#06574C] text-white"
            as={Link}
            to={"/admin/user-management/add-user"}
          >
            Add New User
          </Button>
          <Button
            variant="solid"
            color="primary"
            startContent={<BookIcon />}
            as={Link}
            to={"/admin/courses-management/builder"}
            className="w-full py-4 bg-[#06574C] text-white"
          >
            Create Course
          </Button>
          <Button
            variant="flat"
            as={Link}
            to={'/admin/announcements'}
            startContent={<MegaphoneIcon />}
            className="w-full py-4 bg-[#95C4BE] text-[#06574C] font-semibold"
          >
            Send Announcement
          </Button>
        </div>
      </div>
    </div>
  );
};
const ClassCard = ({ classItem }) => {
  return (
    <div className="bg-[#F1E0D9] rounded-2xl border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm  shrink-0">
          {classItem.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 ">
            <h3 className="font-semibold text-[#06574C] text-sm leading-tight">
              {classItem.name}
            </h3>
            <span className="px-2.5 py-1 text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20 whitespace-nowrap font-medium">
              {classItem.status}
            </span>
          </div>

          <p className="text-xs text-gray-500 ">{classItem.subtitle}</p>

          <div className="s">
            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-600">{classItem.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;

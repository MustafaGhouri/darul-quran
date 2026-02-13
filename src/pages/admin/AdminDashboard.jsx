import { Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import BarCharts from '../../components/charts/BarCharts'
import AreaCharts from '../../components/charts/AreaChart'
import { BookIcon, ChartPie, MegaphoneIcon, PlusIcon, UsersIcon, UsersRound, UserStar, Video } from 'lucide-react'
import OverviewCards from '../../components/dashboard-components/OverviewCards'
import { Link } from "react-router-dom";
import NotificationPermission from '../../components/NotificationPermission'

const AdminDashboard = () => {
  const classes = [
    {
      id: 1,
      name: 'React Hooks Deep Dive',
      subtitle: 'Advanced JavaScript Course',
      teacher: 'John Davis',
      email: 'john.davis@email.com',
      time: 'Today, 2:00 PM',
      enrolled: '47/50',
      status: 'Live',
      statusColor: 'success'
    },
    {
      id: 2,
      name: 'React Hooks Deep Dive',
      subtitle: 'Advanced JavaScript Course',
      teacher: 'John Davis',
      email: 'john.davis@email.com',
      time: 'Today, 3:00 PM',
      enrolled: '47/50',
      status: 'Scheduled',
      statusColor: 'default'
    },
    {
      id: 3,
      name: 'React Hooks Deep Dive',
      subtitle: 'Advanced JavaScript Course',
      teacher: 'John Davis',
      email: 'john.davis@email.com',
      time: 'Today, 4:00 PM',
      enrolled: '47/50',
      status: 'Scheduled',
      statusColor: 'default'
    },
    {
      id: 4,
      name: 'React Hooks Deep Dive',
      subtitle: 'Advanced JavaScript Course',
      teacher: 'John Davis',
      email: 'john.davis@email.com',
      time: 'Today, 5:00 PM',
      enrolled: '47/50',
      status: 'Scheduled',
      statusColor: 'default'
    }
  ];
  const cardsData = [
    {
      title: "Total Enrollments",
      value: "12,847",
      icon: <UserStar color='#06574C' size={22} />,
      changeText: "+12.5% from last month",
      changeColor: "text-[#38A100]"
    },
    {
      title: "Revenue",
      value: "$89,432",
      icon: <ChartPie color='#06574C' size={22} />,
      changeText: "+8.2% from last month",
      changeColor: "text-[#38A100]"
    },
    {
      title: "Active Users",
      value: "3,847",
      icon: <UsersRound color='#06574C' size={22} />,
      changeText: "-2.1% from last week",
      changeColor: "text-[#E8505B]"
    },
    {
      title: "Live Classes Today",
      value: "24",
      icon: <Video color='#06574C' size={22} />,
      changeText: "6 upcoming sessions",
      changeColor: "text-[#06574C]"
    }
  ];

  const columns = '2fr 1.5fr 1fr 0.8fr 0.8fr';
  const Datefilters = [
    { key: "Today, 4 Dec 2025", label: "Today, 4 Dec 2025" },
    { key: "Yesterday,  3 Dec2025", label: "Yesterday, 3 Dec 2025" },
    { key: "Tommorrow, 5 Dec 2025", label: "Tommorrow, 5 Dec 2025" },
  ];
  return (
    <div className='bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3'>

      {/* banner */}
      <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <div className="flex justify-between items-start">
          <div>
            <h1 className='text-xl sm:text-3xl text-white font-semibold '>
              Sharpen Your Skills <br />
              With Trending Courses This Month
            </h1>
            <Button size='sm' className='bg-[#06574C] text-white rounded-md'>
              View Course
            </Button>
          </div>
          <div>
            <NotificationPermission />
          </div>
        </div>
      </div>

      <OverviewCards data={cardsData} />

      <div className='py-4 grid grid-cols-1 md:grid-cols-2 justify-between gap-4 items-center  px-2 md:px-0'>
        <div className=" flex flex-col items-center bg-white w-full rounded-lg overflow-scroll no-scrollbar">
          <div className='p-4 w-full flex items-center justify-between '>
            <h1 className='text-xl font-bold'>Revenue Trend</h1>
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
          <div className='overflow-scroll no-scrollbar w-full '>
            <AreaCharts />
          </div>
        </div>
        <div className="p-4 flex flex-col items-center  w-full bg-white  rounded-lg">
          <div className='flex items-center w-full  justify-between'>
            <h1 className='text-xl font-bold'>User Activity</h1>
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
          <BarCharts />
        </div>
      </div>

      <div className="px-2 sm:px-6 py-4 sm:rounded-lg sm:bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="sm:hidden rounded-2xl overflow-hidden">
            <div className='flex justify-between my-4 items-center'>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Live Classes</h2>
              <p className="text-xs text-gray-500 mt-0.5">View all</p>
            </div>

            <div className="divide-y divide-gray-100 space-y-2">
              {classes.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </div>
          <div className="max-sm:hidden overflow-hidden">
            <div className="flex items-center justify-between py-4 ">
              <h2 className="text-xl font-medium text-gray-900">Upcoming Live Classes</h2>
              <Button
                startContent={<PlusIcon />}
                className="text-sm bg-[#06574C] text-white"
              >
                Schedule New
              </Button>
            </div>

            <Table
              aria-label="Pending approvals table"
              removeWrapper
              classNames={{
                base: "bg-white  ",
                th: "font-bold p-4  text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200 ",
                td: "py-3",
                tr: "border-b border-default-200",
              }}>
              <TableHeader columns={columns}>
                <TableColumn className='bg-[#EBD4C9]/30 rounded-none'>Class</TableColumn>
                <TableColumn className='bg-[#EBD4C9]/30'>Teacher</TableColumn>
                <TableColumn className='bg-[#EBD4C9]/30'>Time</TableColumn>
                <TableColumn className='bg-[#EBD4C9]/30'>Enrolled</TableColumn>
                <TableColumn className='bg-[#EBD4C9]/30'>Status</TableColumn>
              </TableHeader>

              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id} columns={columns}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{classItem.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{classItem.subtitle}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classItem.teacher}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{classItem.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{classItem.time}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{classItem.enrolled}</span>
                    </TableCell>
                    <TableCell>
                      <p className='p-2 w-full text-center rounded-md text-[#06574C] bg-[#95C4BE]/20'>{classItem.status}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-6 py-4 sm:rounded-lg sm:bg-white my-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
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
            startContent={<MegaphoneIcon />}
            className="w-full py-4 bg-[#95C4BE] text-[#06574C] font-semibold"
          >
            Send Announcement
          </Button>
        </div>
      </div>
    </div>
  )
}
const ClassCard = ({ classItem }) => {
  return (
    <div className="bg-[#F1E0D9] rounded-2xl border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm  shrink-0">
          {classItem.teacher.split(' ').map(n => n[0]).join('')}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 ">
            <h3 className="font-semibold text-[#06574C] text-sm leading-tight">{classItem.name}</h3>
            <span className="px-2.5 py-1 text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20 whitespace-nowrap font-medium">
              {classItem.status}
            </span>
          </div>

          <p className="text-xs text-gray-500 ">{classItem.subtitle}</p>

          <div className="s">
            <div className="flex text-gray-500 items-center gap-1 text-xs">
              <span className="">With</span>
              <span className="font-medium">{classItem.teacher}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{classItem.time}</span>
              </div>

              <div className="flex items-center gap-1">
                <UsersIcon />
                <span className="text-gray-600 font-medium">{classItem.enrolled}</span>
                <span className="text-gray-400">Enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard

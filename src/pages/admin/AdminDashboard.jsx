import { Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import BarCharts from '../../components/charts/BarCharts'
import AreaCharts from '../../components/charts/AreaChart'
import { BookIcon, MegaphoneIcon, PlusIcon, UsersIcon } from 'lucide-react'

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

  const columns = '2fr 1.5fr 1fr 0.8fr 0.8fr';

  return (
    <div className='bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3'>

      {/* banner */}
      <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <h1 className='text-xl sm:text-3xl text-white font-semibold '>
          Sharpen Your Skills <br />
          With Trending Courses This Month
        </h1>
        <Button size='sm' className='bg-[#06574C] text-white rounded-md'>
          View Course
        </Button>
      </div>

      <div className='py-4 gap-5 flex overflow-x-auto'>
        <div className='bg-[#F1E0D9] sm:bg-white min-w-[15em] space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Total Enrollments</h1>
          <div className='flex items-center gap-2 justify-start'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>12,847</p>
            </div>
          </div>
          <p className='text-[#38A100]'>+12.5% from last month</p>
        </div>
        <div className='bg-[#F1E0D9] sm:bg-white min-w-[15em]  space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Revenue</h1>
          <div className='flex items-center justify-start gap-2'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>$89,432</p>
            </div>
          </div>
          <p className='text-[#38A100]'> +8.2% from last month</p>
        </div>
        <div className='bg-[#F1E0D9] sm:bg-white min-w-[15em]  space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Active Users</h1>
          <div className='flex items-center justify-start gap-2'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>3,847</p>
            </div>
          </div>
          <p className='text-[#E8505B]'>-2.1% from last week</p>
        </div>
        <div className='bg-[#F1E0D9] sm:bg-white min-w-[15em]  space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Live Classes Today</h1>
          <div className='flex items-center justify-start gap-2'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>24</p>
            </div>
          </div>
          <p className='text-[#06574C]'>6 upcoming sessions</p>
        </div>
      </div>
      <div className='py-4 flex max-md:flex-wrap justify-between gap-4 items-center'>
        <div className="app w-full bg-white  rounded-lg">
          <div className='p-4 flex items-center justify-between'>
            <h1>Revenue Trend</h1>
            <Select
              size="md"
              variant="bordered"
              aria-label="language"
              className="min-w-[100px] max-w-[100px]"
            >
              <SelectItem textValue={'Today, 13 Sep 2025'}>
                <span className="flex items-center gap-2">
                  Today, 13 Sep 2025
                </span>
              </SelectItem>
            </Select>
          </div>
          <AreaCharts />
        </div>
        <div className="p-4 app w-full bg-white  rounded-lg">
          <div className='flex items-center justify-between'>
            <h1>User Activity</h1>
            <Select
              size="md"
              variant="bordered"
              aria-label="language"
              className="min-w-[100px] max-w-[100px]"
            >
              <SelectItem textValue={'Today, 13 Sep 2025'}>
                <span className="flex items-center gap-2">
                  Today, 13 Sep 2025
                </span>
              </SelectItem>
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

            <Table >
              <TableHeader columns={columns}>
                <TableColumn className='bg-[#EBD4C9]/30'>Class</TableColumn>
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

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="solid"
                color="primary"
                startContent={<PlusIcon />}
                className="w-full py-4 bg-[#06574C] text-white"
              >
                Add New User
              </Button>
              <Button
                variant="solid"
                color="primary"
                startContent={<BookIcon />}
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

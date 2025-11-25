import { Button, Chip, Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import BarCharts from '../../components/charts/BarCharts'
import { motion } from 'framer-motion'
import LineCharts from '../../components/charts/AreaChart'
import { BookIcon, MegaphoneIcon, PlusIcon } from 'lucide-react'

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
    <div className='bg-linear-to-t from-[#F1C2AC]/50 h-screen to-[#95C4BE]/50 p-3'>

      {/* banner */}
      <div className="space-y-4 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <h1 className='text-3xl text-white font-semibold '>
          Sharpen Your Skills <br />
          With Trending Courses This Month
        </h1>
        <Button size='sm' className='bg-[#06574C] text-white rounded-md'>
          View Course
        </Button>
      </div>

      <div className='py-4 gap-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 oversflow-x-hidden'>
        <div className='bg-white space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Total Enrollments</h1>
          <div className='flex items-center justify-between'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>12,847</p>
              <p className='text-[#38A100]'>+12.5% from last month</p>
            </div>
          </div>
        </div>
        <div className='bg-white space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Revenue</h1>
          <div className='flex items-center justify-between'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>$89,432</p>
              <p className='text-[#38A100]'> +8.2% from last month</p>
            </div>
          </div>
        </div>
        <div className='bg-white space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Active Users</h1>
          <div className='flex items-center justify-between'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>3,847</p>
              <p className='text-[#E8505B]'>-2.1% from last week</p>
            </div>
          </div>
        </div>
        <div className='bg-white space-y-4 rounded-lg p-4'>
          <h1 className='font-semibold text-[#333333]'>Live Classes Today</h1>
          <div className='flex items-center justify-between'>
            <img src="/icons/user-medal.png" alt="" className='w-14 h-14 p-4 rounded-full bg-[#95C4BE]/20' />
            <div>
              <p className='text-2xl font-semibold'>24</p>
              <p className='text-[#06574C]'>6 upcoming sessions</p>
            </div>
          </div>
        </div>
      </div>
      <div className='py-4 flex justify-between gap-4 items-center'>
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
          <LineCharts />
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
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Upcoming Live Classes Section */}
          <div className=" rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Live Classes</h2>
              <Button
                startContent={<PlusIcon />}
                className="text-sm bg-[#06574C] text-white"
              >
                Schedule New
              </Button>
            </div>

            <Table>
              <TableHeader className='bg-[#EBD4C9]/20' columns={columns}>
                <TableColumn>Class</TableColumn>
                <TableColumn>Teacher</TableColumn>
                <TableColumn>Time</TableColumn>
                <TableColumn>Enrolled</TableColumn>
                <TableColumn>Status</TableColumn>
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
                      {/* <Chip color={classItem.statusColor}>
                        {classItem.status}
                      </Chip> */}
                      <p className='p-2 w-full text-center rounded-md text-[#06574C] bg-[#95C4BE]/20'>{classItem.status}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Quick Actions Section */}
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

export default AdminDashboard

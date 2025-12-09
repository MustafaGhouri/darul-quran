import { Download, ListFilter, Upload } from "lucide-react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Pagination,
  Progress,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { filter } from "framer-motion/client";
const PaymentsRefunds = () => {
  const PaymentTable = [
    {
      id: 1,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
      reason: "Missed",
    },
    {
      id: 2,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
      reason: "Missed",
    },
    {
      id: 3,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
      reason: "Cancelled",
    },
    {
      id: 4,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
      reason: "Missed",
    },
  ];
  const TeachersTable = [
    {
      id: 1,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
    },
    {
      id: 2,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
    },
    {
      id: 3,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
    },
    {
      id: 4,
      student_name: "Jhon Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
      date: "Nov 20, 2025",
    },
  ];
  const Paymentheader = [
    { key: "Students Name", label: "Students Name" },
    { key: "Course Name", label: "Course Name" },
    { key: "Amount", label: "Amount" },
    { key: "Status", label: "Status" },
    { key: "Payment Method", label: "Payment Method" },
    { key: "Time", label: "Time" },
    { key: "Date", label: "Date" },
    { key: "Action", label: "Action" },
  ];
  const refundheader = [
    { key: "Students Name", label: "Students Name" },
    { key: "Course Name", label: "Course Name" },
    { key: "Reason", label: "Reason" },
    { key: "Amount", label: "Amount" },
    { key: "Refund by", label: "Refund by" },
    { key: "Refund Date", label: "Refund Date" },
    { key: "Action", label: "Action" },
  ];
  const Teacherheader = [
    { key: "teacher_name", label: "Teacher Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "action", label: "Action" },
  ];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  const filters = [
    { key: "All", label: "All" },
    { key: "Completed", label: "Completed" },
    { key: "Pending", label: "Pending" },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 ">
      <DashHeading
        title={"Payment & Refund"}
        desc={
          "Keep track of all payments and refunds with transparency and ease"
        }
      />

      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-xl font-bold ">Students Payment</h1>
          <div className="flex gap-3 items-center">
            <Select
              variant="bordered"
              color="success"
              size="lg"
              radius="sm"
              className=" text-[#06574C] w-30 !border-[#06574C]"
              // classNames={{}}
              // endContent={<ListFilter size={16} />}
              placeholder="Filter"
            >
              {filters.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Button
              radius="sm"
              size="lg"
              className="bg-[#06574C] text-white"
              startContent={<Upload size={20} />}
            >
              Export
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Table
            //    isHeaderSticky
            aria-label="Pending approvals table"
            removeWrapper
            classNames={{
              base: "bg-white rounded-lg ",
              th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
              td: "py-3",
              tr: "border-b border-default-200 hover:bg-default-200 cursor-pointer",
            }}
          >
            <TableHeader>
              {Paymentheader.map((item) => (
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
                    <h1 className="font-semibold text-sm">
                      {classItem.course_name}
                    </h1>
                    <h1 className="text-xs">{classItem.course_desc}</h1>
                  </TableCell>
                  <TableCell className="felx flex-col">
                    <h1 className="font-semibold text-sm">
                      {classItem.amount}
                    </h1>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-[#95C4BE33] text-[#06574C] w-30"
                    >
                      {classItem.status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <img src="/icons/Visa.svg" alt="" />
                      {classItem.payment_method}
                    </div>
                  </TableCell>
                  <TableCell>{classItem.time}</TableCell>
                  <TableCell className="felx flex-col">
                    <h1>{classItem.date}</h1>
                  </TableCell>
                  <TableCell>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      startContent={<Download size={18} color="white" />}
                    >
                      {classItem.action}
                    </Button>
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
      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-xl font-bold ">Teacher Payouts</h1>
          <div className="flex gap-3 items-center">
            {/* <Button
              variant="bordered"
              size="lg"
              className="border-[#06574C] text-[#06574C]"
              endContent={<ListFilter size={16} />}
            >
              Filter
            </Button> */}
            <Select
              radius="sm"
              variant="bordered"
              color="success"
              size="lg"
              className=" text-[#06574C] w-30 !border-[#06574C]"
              // classNames={{}}
              // endContent={<ListFilter size={16} />}
              placeholder="Filter"
            >
              {filters.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Button
              radius="sm"
              size="lg"
              className="bg-[#06574C] text-white"
              startContent={<Upload size={20} />}
            >
              New Payout
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Table
            //    isHeaderSticky
            aria-label="Pending approvals table"
            removeWrapper
            classNames={{
              base: "bg-white rounded-lg ",
              th: "font-bold text-sm p-4 text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
              td: "py-3",
              tr: "border-b border-default-200 hover:bg-default-200 cursor-pointer",
            }}
          >
            <TableHeader>
              {Teacherheader.map((item) => (
                <TableColumn key={item.key}>{item.label}</TableColumn>
              ))}
            </TableHeader>

            <TableBody>
              {TeachersTable.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="px-4">
                    <div>
                      <h1 className="font-semibold text-sm">
                        {classItem.student_name}
                      </h1>
                      <h1 className="text-xs">{classItem.email}</h1>
                    </div>
                  </TableCell>
                  <TableCell className="felx flex-col">
                    <h1 className="font-semibold text-sm">
                      {classItem.amount}
                    </h1>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-[#95C4BE33] text-[#06574C] w-30"
                    >
                      {classItem.status}
                    </Button>
                  </TableCell>
                  <TableCell>{classItem.date}</TableCell>
                  <TableCell>{classItem.time}</TableCell>
                  <TableCell>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      startContent={<Download size={18} color="white" />}
                    >
                      {classItem.action}
                    </Button>
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
      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-xl font-bold ">Refund History</h1>
          <div className="flex gap-3 items-center">
            <Select
              radius="sm"
              variant="bordered"
              color="success"
              size="lg"
              className=" text-[#06574C] w-30"
              placeholder="Filter"
            >
              {filters.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Button
              radius="sm"
              size="lg"
              className="bg-[#06574C] text-white"
              startContent={<Upload size={20} />}
            >
              Export
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Table
            //    isHeaderSticky
            aria-label="Pending approvals table"
            removeWrapper
            selectionMode="multiple"
            classNames={{
              base: "bg-white rounded-lg ",
              th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
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
                    <h1 className="font-semibold text-sm">
                      {classItem.course_name}
                    </h1>
                    <h1 className="text-xs">{classItem.course_desc}</h1>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-[#95C4BE33] text-[#06574C] w-30"
                    >
                      {classItem.reason}
                    </Button>
                  </TableCell>
                  <TableCell className="felx flex-col">
                    <h1 className="font-semibold text-sm">
                      {classItem.amount}
                    </h1>
                  </TableCell>
                  <TableCell>
                    <h1 className="font-semibold text-sm">
                      {classItem.student_name}
                    </h1>
                    <h1 className="text-xs">{classItem.email}</h1>
                  </TableCell>
                  <TableCell>{classItem.time}</TableCell>
                  <TableCell>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      startContent={<Download size={18} color="white" />}
                    >
                      {classItem.action}
                    </Button>
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
  );
};

export default PaymentsRefunds;

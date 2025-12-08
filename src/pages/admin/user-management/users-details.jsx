import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
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
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Album,
  Ban,
  Calendar,
  ChartAreaIcon,
  ChartNoAxesColumn,
  ChartPie,
  Check,
  Clock,
  Download,
  ExpandIcon,
  Eye,
  ListFilter,
  Plus,
  SearchCheck,
  SquarePen,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

const UsersDetails = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const role = [
    { key: "Admin", label: "Admin" },
    { key: "Teacher", label: "Teacher" },
    { key: "Student", label: "Student" },
  ];

  const courses = [
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
  ];

  const personalDetails = [
    { title: "Email Address", desc: "john.davis@email.com" },
    { title: "Phone Number", desc: "+1 (555) 123-4567" },
    { title: "Location", desc: "San Francisco, CA" },
    { title: "Email Address", desc: "john.davis@email.com" },
  ];
  const quickStats = [
    {
      title: "Total Courses",
      desc: "15",
      icon: <Album size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: "Completed",
      desc: "15",
      icon: <Check size={22} color="#06574C" />,
    },
    {
      title: "In Progress",
      desc: "15",
      icon: <ChartPie size={22} color="#06574C" />,
      bg: "#95C4BE",
    },
    {
      title: "Attendance Rate",
      desc: "75%",
      icon: <ChartNoAxesColumn size={22} color="#06574C" />,
    },
  ];

  const recentactivity = [
    {
      title: "Completed 'React Advanced Patterns'",
      desc: "2 hours ago",
      bg: "#95C4BE",
    },
    {
      title: "Completed 'React Advanced Patterns'",
      desc: "2 hours ago",
      bg: "#EBD4C982",
    },
    {
      title: "Completed 'React Advanced Patterns'",
      desc: "2 hours ago",
      bg: "#95C4BE",
    },
    {
      title: "Completed 'React Advanced Patterns'",
      desc: "2 hours ago",
      bg: "#EBD4C982",
    },
    {
      title: "Completed 'React Advanced Patterns'",
      desc: "2 hours ago",
      bg: "#95C4BE",
    },
  ];

  const classes = [
    {
      id: 1,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "In Progress",
      date: "2025-11-27",
    },
    {
      id: 2,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "Completed",
      date: "2025-11-26",
    },
    {
      id: 3,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "Completed",
      date: "2025-11-17",
    },
    {
      id: 4,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "Completed",
      date: "2025-11-16",
    },
    {
      id: 5,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "Completed",
      date: "2025-11-15",
    },
    {
      id: 6,
      name: "React Hooks Deep Dive",
      desc: "Advanced JavaScript Course",
      email: "john.davis@email.com",
      attendance_rate: 75,
      time: "Today, 2:00 PM",
      category: "John Davis",
      status: "In Progress",
      date: "2025-11-12",
    },
  ];

  const header = [
    { key: "Course Name", label: "Course Name" },
    { key: "Attendance Rate", label: "Attendance Rate" },
    { key: "Teacher", label: "Teacher" },
    { key: "Status", label: "Status" },
    { key: "Time", label: "Time" },
    { key: "Action", label: "Action" },
  ];
  const Paymentheader = [
    { key: "Transaction ID", label: "Transaction ID" },
    { key: "Course Name", label: "Course Name" },
    { key: "Amount", label: "Amount" },
    { key: "Status", label: "Status" },
    { key: "Payment Method", label: "Payment Method" },
    { key: "Time", label: "Time" },
    { key: "Action", label: "Action" },
  ];

  const PaymentTable = [
    {
      id: 1,
      transaction_id: "#TXN-8472",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
    },
    {
      id: 2,
      transaction_id: "#TXN-8472",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
    },
    {
      id: 3,
      transaction_id: "#TXN-8472",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
    },
    {
      id: 4,
      transaction_id: "#TXN-8472",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      attendance_rate: 75,
      email: "john.davis@email.com",
      amount: "$149.99",
      status: "Completed",
      payment_method: "•••• 4532",
      time: "Today, 2:00 PM",
      action: "Download",
    },
  ];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3">
      <DashHeading
        title={"Users Management"}
        desc={
          "Manage all users including students, teachers, and support staff"
        }
      />
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex gap-4 items-center mb-3">
              <h1 className="text-3xl font-bold">Jhon Davis</h1>
              <Button
                size="sm"
                className="bg-[#95C4BE33] text-[#06574C] text-xs"
              >
                Active
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Calendar size={20} color="#666666" />
                <span>Joined</span> : <h1>Jan 15, 2023</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Clock size={20} color="#666666" />
                <span>Last Active</span> : <h1>2 hours ago</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Album size={20} color="#666666" />
                <span>5</span>
                <h1>Courses Enrolled</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <ChartNoAxesColumn size={20} color="#666666" />
                <span>78%</span>
                <h1>Avg Progress</h1>
              </div>
            </div>
          </div>
          <div className="self-center">
            <Button
              size="lg"
              radius="sm"
              startContent={<Ban color="#E8505B" />}
              className="bg-[#FFEAEC] text-[#E8505B] text-md"
            >
              Suspend Account
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 my-4 space-x-4">
        <div className="grid col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Personal Details</h1>
            <SquarePen size={22}  color="#06574C"/>
          </div>
          {personalDetails.map((item) => (
            <div className="my-2">
              <h1 className="text-md text-[#333333]">{item.title}</h1>
              <h1 className="text-lg text-[#333333] font-medium">
                {item.desc}
              </h1>
            </div>
          ))}
        </div>
        <div className="grid col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Quick Statistics</h1>
            {/* <SquarePen size={20} /> */}
          </div>
          {quickStats.map((item) => (
            <div
              className={`my-2 flex gap-2 ${
                item?.bg ? `bg-[${item.bg}]` : "bg-[#EBD4C982]"
              } items-center p-2 rounded-lg`}
            >
              <div className="h-12 w-12 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
                {item.icon}
              </div>
              <div>
                <h1>{item.title}</h1>
                <h1>{item.desc}</h1>
              </div>
            </div>
          ))}
        </div>
        <div className="grid col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Recent Activity</h1>
            {/* <SquarePen size={20} /> */}
          </div>
          {recentactivity.map((item) => (
            <div className="my-2 flex gap-2 items-start">
              <div
                className={`h-2 w-2 rounded-full ${
                  item?.bg ? `bg-[${item.bg}]` : "bg-[#EBD4C982]"
                } mt-2`}
              />
              <div>
                <h1>{item.title}</h1>
                <h1 className="text-sm text-[#666666]">{item.desc}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-xl font-bold ">Enrolled Courses</h1>
          <Button
            radius="sm"
            // size="lg"
            className="bg-[#06574C] text-white py-7 "
            startContent={<Plus size={20} />}
          >
            Enrolled Course
          </Button>
        </div>
        <div className="mt-3">
          <Table
            //    isHeaderSticky
            aria-label="Pending approvals table"
            removeWrapper
            classNames={{
              base: "bg-white rounded-lg ",
              th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
              td: "py-3",
              tr: "border-b border-default-200 cursor-pointer ",
            }}
          >
            <TableHeader>
              {header.map((item) => (
                <TableColumn key={item.key}>{item.label}</TableColumn>
              ))}
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
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      <Progress
                      classNames={{ indicator: "bg-[#95C4BE]" }}
                      // showValueLabel
                      size="sm"
                      value={classItem.attendance_rate}
                    />
                      <h1 className="font-semibold text-sm">{classItem.attendance_rate}%</h1>
                    </div>
                  </TableCell>
                  <TableCell className="felx flex-col">
                    <h1 className="font-semibold text-sm">
                      {classItem.category}
                    </h1>
                    <h1 className="text-xs text-[#9A9A9A]">{classItem.email}</h1>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-[#95C4BE33] text-[#06574C] w-30"
                    >
                      {classItem.status}
                    </Button>
                  </TableCell>
                  <TableCell>{classItem.time}</TableCell>
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
        </div>
      </div>

      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-xl font-bold ">Payment History</h1>
          <div className="flex gap-3 items-center">
            <Button
              variant="bordered"
              size="lg"
              radius="sm"
              className="border-[#06574C] text-[#06574C]"
              endContent={<ListFilter size={16} />}
            >
              Filter
            </Button>
            <Button
              size="lg"
              radius="sm"
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
              th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
              td: "py-3",
              tr: "border-b border-default-200",
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
                    <div>
                      <div className="font-medium text-gray-900">
                        {classItem.transaction_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <h1 className="font-semibold text-sm">
                      {classItem.course_name}
                    </h1>
                    <h1 className="text-xs text-[#9A9A9A]">{classItem.course_desc}</h1>
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
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-[#333333] text-sm">
              <span>Total Revenue:</span>
              <span className="font-semibold">$899.93</span>
            </div>
            <div>
              <span className="text-sm text-[#06574C] font-bold">
                View all Transaction
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;

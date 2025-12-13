import React from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Pagination,
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
  Download,
  Eye,
  ListFilterIcon,
  PlusIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import * as motion from "motion/react-client";

const PaymentsInvoices = () => {
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const Supports_Staff = [
    {
      id: 1,
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      name: "John Davis",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      payment_method: "•••• 4532",
      roles: "Support Staff",
      status: "Active",
      date: "Nov 20, 2025",
    },
    {
      id: 2,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      payment_method: "•••• 4532",
      roles: "Support Staff",
      status: "Active",
      date: "Nov 20, 2025",
    },
    {
      id: 3,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      payment_method: "•••• 4532",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      roles: "Support Staff",
      status: "Active",
      payment_method: "•••• 4532",
      date: "Nov 20, 2025",
    },
    {
      id: 4,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      payment_method: "•••• 4532",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      roles: "Support Staff",
      status: "Active",
      payment_method: "•••• 4532",
      date: "Nov 20, 2025",
    },
    {
      id: 5,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      payment_method: "•••• 4532",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      roles: "Support Staff",
      status: "Active",
      date: "Nov 20, 2025",
    },
    {
      id: 6,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      payment_method: "•••• 4532",
      roles: "Support Staff",
      status: "Active",
      date: "2Nov 20, 2025",
    },
    {
      id: 7,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      payment_method: "•••• 4532",
      roles: "Support Staff",
      status: "Active",
      date: "Nov 20, 2025",
    },
    {
      id: 8,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      payment_method: "•••• 4532",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      roles: "Support Staff",
      status: "Active",
      date: "Nov 20, 2025",
    },
    {
      id: 9,
      name: "John Davis",
      course_name: "React Hooks Deep Dive",
      course_desc: "Advanced JavaScript Course",
      price: "$ 199",
      desc: "Advanced JavaScript Course",
      last_active: "2 hourse ago",
      email: "john.davis@email.com",
      roles: "Students",
      payment_method: "•••• 4532",
      status: "Active",
      date: "Nov 20, 2025",
    },
  ];
  const header = [
    { key: "Course Name", label: "Course Name" },
    { key: "Date", label: "Date" },
    { key: "Prices", label: "Prices" },
    { key: "Payment Method", label: "Payment Method" },
    { key: "Status", label: "Status" },
    { key: "Action", label: "Action" },
  ];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"Payments & Invoices"}
        desc={"Keep track of all payments with transparency and ease"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className="min-w-[120px]"
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
        {/* <CourseForm /> */}
        <Button
          startContent={<Download size={16} />}
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white max-md:w-full"
        >
          Export
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          //   key={selectedTab ? selectedTab.label : "empty"}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Table
            isHeaderSticky
            // selectionMode="multiple"
            aria-label="Pending approvals table"
            removeWrapper
            classNames={{
              base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar mb-3",
              th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C936]",
              td: "py-3 items-center whitespace-nowrap",
              tr: "border-b border-default-200 ",
            }}
          >
            <TableHeader>
              {header.map((item) => (
                <TableColumn key={item.key}>{item.label}</TableColumn>
              ))}
            </TableHeader>

            <TableBody>
              {Supports_Staff.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {classItem.course_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {classItem.course_desc}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {classItem.date}
                  </TableCell>
                  <TableCell>{classItem.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <img src="/icons/Visa.svg" alt="" />
                      {classItem.payment_method}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button className="text-sm p-2 rounded-md bg-[#95C4BE33] text-[#06574C]">
                      {classItem.status}
                    </Button>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="bordered"
                      radius="sm"
                      className="border-[#06574C]"
                      startContent={<Eye size={18} color="#06574C" />}
                    >
                      View Details
                    </Button>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      startContent={<Download size={18} color="white" />}
                    >
                        Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center pb-4 gap-2 justify-between">
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentsInvoices;

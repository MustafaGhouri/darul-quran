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
  BellRing,
  Edit,
  Eye,
  ListFilterIcon,
  Mail,
  MessageSquare,
  PlusIcon,
  Trash2,
} from "lucide-react";

const SupportTickets = () => {
  const classes = [
    {
      id: 1,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Resolved",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      issue:"Unable to access course materials",
    },
    {
      id: 2,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Pending",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      issue:"Unable to access course materials",
    },
    {
      id: 3,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Resolved",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      issue:"Unable to access course materials",
    },
    {
      id: 4,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Pending",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      issue:"Unable to access course materials",
    },
    {
      id: 5,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Open",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      issue:"Unable to access course materials",
    },
    {
      id: 6,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Pending",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      issue:"Unable to access course materials",
    },
    {
      id: 7,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Resolved",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      issue:"Unable to access course materials",
    },
    {
      id: 8,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Pending",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      issue:"Unable to access course materials",
    },
    {
      id: 9,
      name: "John Davis",
      desc: "john.davis@email.com",
      status: "Open",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      issue:"Unable to access course materials",
    },
  ];
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const supportheader = [   
    { key: "Student Name", label: "Student Name" },
    { key: "Issue Summary", label: "Issue Summary" },
    { key: "Role", label: "Role" },
    { key: "Status", label: "Status" },
    { key: "Date", label: "Date" },
    { key: "Action", label: "Action" },
  ]
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
          startContent={<Trash2 size={20} />}
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Clear All
        </Button>
      </div>
      <div className=" overflow-hidden">
        <Table
        removeWrapper
          classNames={{
            base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar",
            th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C936]",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200 ",
          }}
        >
          <TableHeader>
            {supportheader.map((item) => (
                <TableColumn key={item.key}>{item.label}</TableColumn>
              ))}
          </TableHeader>

          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>
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
                  {classItem.issue}
                </TableCell>
                <TableCell>
                  {/* <div>
                    <Button
                      startContent={
                        classItem.delivery === "Email" ? (
                          <Mail size={20} color="#06574C" />
                        ) : (
                          <BellRing size={20} color="#06574C" />
                        )
                      }
                      className={`p-2 w-full text-center rounded-md bg-[#95C4BE33] text-[#06574C] `}
                    >
                      {classItem.delivery}
                    </Button>
                  </div> */}
                  <div className="flex-col flex">
                    <p
                      className={`p-2 w-full text-center rounded-md bg-[#FBF4EC] text-[#D28E3D] `}
                    >
                      {classItem.sendto}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {/* <span>{classItem.time}</span> */}
                  <p
                      className={`p-2 w-full text-center rounded-md  ${classItem.status === "Pending" ? "bg-[#FBF4EC] text-[#D28E3D]" : classItem.status === "Open" ? "bg-[#E8F1FF] text-[#3F86F2]" : "bg-[#95C4BE33] text-[#06574C]"} `}
                    >
                      {classItem.status}
                    </p>
                </TableCell>
                <TableCell>
                  <span>{classItem.time}</span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="border-[#06574C] "
                    startContent={<Eye size={20} color="#06574C" />}
                  >
                    View
                  </Button>
                  <Button
                    radius="sm"
                    className="bg-[#06574C] text-white"
                    startContent={<MessageSquare size={20} color="white" />}
                  >
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
  );
};

export default SupportTickets;

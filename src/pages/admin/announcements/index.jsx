import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
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
  BeakerIcon,
  BellRing,
  Calendar,
  Copy,
  Edit,
  ListFilterIcon,
  Mail,
  PlusIcon,
  Trash2,
} from "lucide-react";

const Announcements = () => {
  const classes = [
    {
      id: 1,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "Email",
    },
    {
      id: 2,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Upcoming",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "In-App",
    },
    {
      id: 3,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "Email",
    },
    {
      id: 4,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Cancelled",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "In-App",
    },
    {
      id: 5,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Upcoming",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "Email",
    },
    {
      id: 6,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "In-App",
    },
    {
      id: 7,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "Email",
    },
    {
      id: 8,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "In-App",
    },
    {
      id: 9,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Canceled",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "Email",
    },
  ];
  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const categories = [
    { key: "Web Development", label: "Web Development" },
    { key: "all", label: "All Category" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"Announcements"}
        desc={"Manage and send announcements to your organization"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex  items-center gap-2">
          <Select
            isRequired
            className="md:min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            placeholder="Select an status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          {/* <Select
                        isRequired
                        className="md:min-w-[120px]"
                        radius="sm"
                        defaultSelectedKeys={["all"]}
                        placeholder="Select an category"
                    >
                        {categories.map((category) => (
                            <SelectItem key={category.key}>{category.label}</SelectItem>
                        ))}
                    </Select> */}
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
          startContent={<PlusIcon />}
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Schedule New
        </Button>
      </div>
      <div className="max-sm:hidden overflow-hidden">
        <Table
        removeWrapper
                    classNames={{
                      base: "bg-white rounded-lg ",
                      th: "font-bold p-4  text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
                      td: "py-3 ",
                      tr: "border-b border-default-200 ",
                    }}
        >
          <TableHeader>
            <TableColumn className="bg-[#EBD4C9]/30">Title</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Send To</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Delivery Type</TableColumn>
            <TableColumn className="bg-[#EBD4C9]/30">Date Sent</TableColumn>
            {/* <TableColumn className='bg-[#EBD4C9]/30'>Status</TableColumn>
                        <TableColumn className='bg-[#EBD4C9]/30'>Zoom Link</TableColumn> */}
            <TableColumn className="bg-[#EBD4C9]/30">Actions</TableColumn>
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
                  <div className="flex-col flex">
                    <p
                      className={`p-2 w-full text-center rounded-md bg-[#FBF4EC] text-[#D28E3D] `}
                    >
                      {classItem.sendto}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
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
                  </div>
                </TableCell>
                <TableCell>
                  <span>{classItem.time}</span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="border-[#06574C] "
                    startContent={<Edit size={20} color="#06574C" />}
                  >
                    Edit
                  </Button>
                  <Button
                    radius="sm"
                    className="bg-[#06574C] text-white"
                    startContent={<Trash2 color="white" />}
                  >
                    Delete
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

export default Announcements;

import {
  Button,
  Pagination,
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
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Download } from "lucide-react";
import { useGetActivitiesQuery } from "../../../redux/api/analytics";
import { useState } from "react";
import { format } from "date-fns";

const UserLogs = () => {
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(10);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsRole, setLogsRole] = useState("all");
  const [logsDate, setLogsDate] = useState(null);

  const refundheader = [
    { key: "User Name", label: "User Name" },
    { key: "Role", label: "Role" },
    { key: "Details ", label: "Details " },
    { key: "Action", label: "Action" },
    { key: "Date ", label: "Date " },
    { key: "Time", label: "Time" },
    { key: "Status", label: "Status" },
  ];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const { data: logsDataResponse, isLoading: logsLoading } =
    useGetActivitiesQuery({
      page: logsPage,
      limit: logsLimit,
      search: logsSearch,
      role: logsRole,
      date: logsDate
        ? format(
            new Date(logsDate.year, logsDate.month - 1, logsDate.day),
            "yyyy-MM-dd",
          )
        : "",
    });
  const activities = logsDataResponse?.activities || [];
  const totalLogs = logsDataResponse?.total || 0;

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <div className="flex justify-between items-center">
        <DashHeading
          title={"User Logs / Activity"}
          desc={"Monitor users activity and logs"}
        />
        {/* <Button
          startContent={<Download size={20} />}
          size="lg"
          radius="sm"
          className="bg-[#06574C] text-white"
        >
          Export
        </Button> */}
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
                    <h1 className="font-semibold text-sm">{log.userName}</h1>
                    <h1 className="text-xs text-[#9A9A9A]">{log.email}</h1>
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
                  <TableCell>
                    {format(new Date(log.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.createdAt), "hh:mm a")}
                  </TableCell>

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
                onSelectionChange={(keys) =>
                  setLogsLimit(Number(Array.from(keys)[0]))
                }
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
  );
};

export default UserLogs;

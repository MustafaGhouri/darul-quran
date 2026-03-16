import React, { useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DateRangePicker,
  Image,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@heroui/react";
import { useGetEnrollmentsQuery } from "../../../redux/api/enrollmentAdmin";
import { dateFormatter } from "../../../lib/utils";
import { XIcon } from "lucide-react";

const Enrollments = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useGetEnrollmentsQuery({
    status: selectedStatus,
    startDate: dateRange?.start ? `${dateRange.start.year}-${String(dateRange.start.month).padStart(2, '0')}-${String(dateRange.start.day).padStart(2, '0')}` : undefined,
    endDate: dateRange?.end ? `${dateRange.end.year}-${String(dateRange.end.month).padStart(2, '0')}-${String(dateRange.end.day).padStart(2, '0')}` : undefined,
    page: page,
    limit: 10
  });

//   console.log(data);

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 pb-3">
      <div className="">
        <DashHeading
          title={"Enrollments"}
          desc={"Track your course enrollments"}
        />
      </div>
      <div className="bg-[#EBD4C9] p-4 rounded-lg flex max-sm:flex-wrap gap-3 items-center shadow-sm w-full">
        <DateRangePicker
          label="Date Range"
          labelPlacement="inside"
          size="sm"
          radius="lg"
          className="sm:max-w-[300px]"
          placeholder="Select a date range"
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
            setPage(1);
          }}
        />
      {dateRange && <Button
          color="success"
          size="sm"
          radius="lg"
          isIconOnly
          onPress={() => setDateRange(null)}
          startContent={<XIcon  size={16}/>}
        />}
        <Select
          label="Status"
          placeholder="Select a status"
          labelPlacement="inside"
          size="sm"
          radius="lg"
          className="sm:max-w-[200px]"
          selectedKeys={[selectedStatus]}
          onSelectionChange={(keys) => {
            setSelectedStatus(Array.from(keys)[0]);
            setPage(1);
          }}
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="completed">Completed</SelectItem>
          <SelectItem key="refunded">Refunded</SelectItem>
        </Select>   
      </div>

      <div className="mt-4">
        <Table
          aria-label="Student Enrollments Table"
          removeWrapper
          isHeaderSticky
          classNames={{
            base: "w-full bg-white my-3 rounded-lg overflow-x-scroll w-full no-scrollbar  min-h-[50vh] shadow-sm",
            th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C9]",
            tbody: "overflow-y-scroll no-scrollbar",
            td: "py-3 items-center whitespace-nowrap text-sm text-[#333333] font-semibold",
            tr: "border-b border-default-200 ",
          }}
        >
          <TableHeader>
            <TableColumn>Thumbnail</TableColumn>
            <TableColumn>Course Name</TableColumn>
            <TableColumn>Payment Status</TableColumn>
            <TableColumn>Enrolled At</TableColumn>
            <TableColumn>Expired At</TableColumn>
          </TableHeader>
          <TableBody 
          loadingState={(isLoading || isFetching) ? "loading" : "idle"}
            loadingContent={<Spinner color="success" size="lg" label="Loading..." />}
            emptyContent={
              <div className="flex flex-col items-center justify-center p-8">
                <p>No enrollments found.</p>
              </div>
            }
          >
            {data?.enrollments?.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>
                  <Image
                    src={enrollment.thumbnail}
                    alt={enrollment.courseName}
                    width={50}
                      height={50}
                      className="rounded-lg shrink-0" />
                   
                </TableCell>
                <TableCell>{enrollment.courseName}</TableCell>
                <TableCell
                  className={`capitalize ${enrollment.paymentStatus === "completed" ? "text-success" : "text-danger"}`}
                >
                  {enrollment.paymentStatus}
                </TableCell>
                <TableCell>{dateFormatter(enrollment.enrolledAt)}</TableCell>
                <TableCell>
                  {enrollment.cancelledAt
                    ? dateFormatter(enrollment.cancelledAt, true)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.totalPages > 1 && (
          <div className="flex justify-center mt-4 pb-4">
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={page}
              total={data.totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollments;

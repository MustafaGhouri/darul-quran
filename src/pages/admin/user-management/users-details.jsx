import React, { useState } from "react";
import {
  Button,
  Progress,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Spinner,
  Input,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Album,
  Ban,
  Calendar,
  ChartNoAxesColumn,
  ChartPie,
  Check,
  Clock,
  Download,
  Eye,
  Plus,
  SquarePen,
  Upload,
  Search,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { showMessage } from "../../../lib/toast.config";
import {
  useGetUserDetailsQuery,
  useGetUserEnrollmentsQuery,
  useGetUserInvoicesQuery,
} from "../../../redux/api/user";

const UsersDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Pagination states
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const [enrollmentLimit, setEnrollmentLimit] = useState(10);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");

  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceLimit, setInvoiceLimit] = useState(10);
  const [invoiceStatus, setInvoiceStatus] = useState("all");

  // Fetch user details
  const { data: userDetailsData, isLoading: isUserLoading, refetch } = useGetUserDetailsQuery(id, {
    skip: !id,
  });

  // Fetch enrollments
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetUserEnrollmentsQuery(
    { id, page: enrollmentPage, limit: enrollmentLimit, search: enrollmentSearch },
    { skip: !id }
  );

  // Fetch invoices
  const { data: invoicesData, isLoading: isInvoicesLoading } = useGetUserInvoicesQuery(
    { id, page: invoicePage, limit: invoiceLimit, status: invoiceStatus },
    { skip: !id }
  );

  const user = userDetailsData?.user;
  const enrollments = enrollmentsData?.enrollments || [];
  const invoices = invoicesData?.invoices || [];

  const filters = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
    { key: "open", label: "Open" },
    { key: "void", label: "Void" },
  ];

  const handleSuspendAccount = () => {
    // TODO: Implement suspend functionality
    showMessage("Suspend account functionality coming soon");
  };

  const handleDownloadInvoice = (invoice) => {
    if (invoice.invoicePdf) {
      window.open(invoice.invoicePdf, "_blank");
    } else if (invoice.hostedInvoiceUrl) {
      window.open(invoice.hostedInvoiceUrl, "_blank");
    } else {
      showMessage("Invoice not available");
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: "bg-[#95C4BE33] text-[#06574C]",
      in_progress: "bg-[#FBF4EC] text-[#D28E3D]",
      not_started: "bg-gray-100 text-gray-600",
      cancelled: "bg-[#FFCDD2] text-[#C62828]",
      paid: "bg-[#95C4BE33] text-[#06574C]",
      pending: "bg-[#FBF4EC] text-[#D28E3D]",
      failed: "bg-[#FFCDD2] text-[#C62828]",
      open: "bg-[#FBF4EC] text-[#D28E3D]",
      void: "bg-gray-100 text-gray-600",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  if (isUserLoading) {
    return (
      <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3 min-h-screen flex items-center justify-center">
        <Spinner color="success" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600">User not found</h1>
          <Button
            className="mt-4 bg-[#06574C] text-white"
            onPress={() => navigate("/admin/user-management")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-3">
      <DashHeading
        title={"Users Management"}
        desc={
          "Manage all users including students, teachers, and support staff"
        }
      />
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <div className="flex gap-4 items-center mb-3">
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <Button
                size="sm"
                className={`${user?.isActive ? "bg-[#95C4BE33] text-[#06574C]" : "bg-[#FBF4EC] text-[#D28E3D]"} text-xs`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Calendar size={20} color="#666666" />
                <span>Joined</span> :{" "}
                <h1>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Clock size={20} color="#666666" />
                <span>Last Active</span> :{" "}
                <h1>{formatTimeAgo(user?.lastActive)}</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <Album size={20} color="#666666" />
                <span>{user?.stats?.totalCourses || 0}</span>
                <h1>Courses Enrolled</h1>
              </div>
              <div className="flex gap-1 text-[#666666] font-semibold">
                <ChartNoAxesColumn size={20} color="#666666" />
                <span>{user?.stats?.attendanceRate || 0}%</span>
                <h1>Avg Attendance</h1>
              </div>
            </div>
          </div>
          <div className="md:self-center">
            <Button
              size="lg"
              radius="sm"
              startContent={<Ban color="#E8505B" />}
              className="bg-[#FFEAEC] text-[#E8505B] text-md"
              onPress={handleSuspendAccount}
            >
              Suspend Account
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 my-4 md:space-x-4 max-md:gap-4">
        <div className="grid col-span-12 md:col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Personal Details</h1>
            <SquarePen size={22} color="#06574C" />
          </div>
          <div className="my-2">
            <h1 className="text-md text-[#333333]">Email Address</h1>
            <h1 className="text-lg text-[#333333] font-medium">{user?.email || "N/A"}</h1>
          </div>
          <div className="my-2">
            <h1 className="text-md text-[#333333]">Phone Number</h1>
            <h1 className="text-lg text-[#333333] font-medium">{user?.phoneNumber || "N/A"}</h1>
          </div>
          <div className="my-2">
            <h1 className="text-md text-[#333333]">Location</h1>
            <h1 className="text-lg text-[#333333] font-medium">
              {user?.city && user?.country ? `${user.city}, ${user.country}` : user?.city || user?.country || "N/A"}
            </h1>
          </div>
          <div className="my-2">
            <h1 className="text-md text-[#333333]">Role</h1>
            <h1 className="text-lg text-[#333333] font-medium capitalize">{user?.role || "N/A"}</h1>
          </div>
        </div>
        <div className="grid col-span-12 md:col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Quick Statistics</h1>
          </div>
          <div className="my-2 flex gap-2 bg-[#95C4BE] items-center p-2 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
              <Album size={22} color="#06574C" />
            </div>
            <div>
              <h1>Total Courses</h1>
              <h1 className="font-semibold">{user?.stats?.totalCourses || 0}</h1>
            </div>
          </div>
          <div className="my-2 flex gap-2 bg-[#EBD4C982] items-center p-2 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
              <Check size={22} color="#06574C" />
            </div>
            <div>
              <h1>Completed</h1>
              <h1 className="font-semibold">{user?.stats?.completedCourses || 0}</h1>
            </div>
          </div>
          <div className="my-2 flex gap-2 bg-[#95C4BE] items-center p-2 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
              <ChartPie size={22} color="#06574C" />
            </div>
            <div>
              <h1>In Progress</h1>
              <h1 className="font-semibold">{user?.stats?.inProgressCourses || 0}</h1>
            </div>
          </div>
          <div className="my-2 flex gap-2 bg-[#EBD4C982] items-center p-2 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-white shadow-[5px_6px_16.2px_0px_#0000001C] items-center flex justify-center">
              <ChartNoAxesColumn size={22} color="#06574C" />
            </div>
            <div>
              <h1>Attendance Rate</h1>
              <h1 className="font-semibold">{user?.stats?.attendanceRate || 0}%</h1>
            </div>
          </div>
        </div>
        <div className="grid col-span-12 md:col-span-4 bg-white rounded-lg px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Recent Activity</h1>
          </div>
          {isUserLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" color="success" />
            </div>
          ) : user?.recentActivity?.length > 0 ? (
            user.recentActivity.map((item, index) => (
              <div key={index} className="my-2 flex gap-2 items-start">
                <div
                  className={`h-2 w-2 rounded-full mt-2`}
                  style={{ backgroundColor: item.bg }}
                />
                <div>
                  <h1>{item.title}</h1>
                  <h1 className="text-sm text-[#666666]">{item.desc}</h1>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex md:flex-row flex-col gap-2 md:justify-between md:items-center">
          <h1 className="text-3xl md:text-xl font-bold">Enrolled Courses</h1>
          <div className="flex gap-2 items-center">
            <Input
              size="sm"
              radius="sm"
              placeholder="Search courses..."
              startContent={<Search size={16} />}
              value={enrollmentSearch}
              onChange={(e) => {
                setEnrollmentSearch(e.target.value);
                setEnrollmentPage(1);
              }}
              className="w-64"
            />
            <Button
              radius="sm"
              className="bg-[#06574C] text-white"
              startContent={<Plus size={20} />}
            >
              Enroll Course
            </Button>
          </div>
        </div>
        <div className="mt-3">
          {isEnrollmentsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner color="success" />
            </div>
          ) : (
            <>
              <Table
                aria-label="Enrolled courses table"
                removeWrapper
                classNames={{
                  base: "bg-white rounded-lg overflow-x-scroll no-scrollbar",
                  th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
                  td: "py-3 ",
                  tr: "border-b border-default-200 cursor-pointer ",
                }}
              >
                <TableHeader>
                  <TableColumn>Course Name</TableColumn>
                  <TableColumn>Attendance Rate</TableColumn>
                  <TableColumn>Teacher</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Enrolled Date</TableColumn>
                  <TableColumn>Action</TableColumn>
                </TableHeader>

                <TableBody emptyContent={<p className="text-center py-4">No enrollments found</p>}>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {enrollment.courseName || "Course"}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {enrollment.courseDescription || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center gap-2">
                          <Progress
                            classNames={{ indicator: "bg-[#95C4BE]" }}
                            value={enrollment.attendanceRate || 0}
                            size="sm"
                          />
                          <h1 className="font-semibold text-sm">
                            {enrollment.attendanceRate || 0}%
                          </h1>
                        </div>
                      </TableCell>
                      <TableCell className="flex flex-col">
                        <h1 className="font-semibold text-sm">
                          {enrollment.teacherName || "TBD"}
                        </h1>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className={`${getStatusColor(enrollment.progressStatus)} w-30`}>
                          {enrollment.progressStatus?.replace("_", " ") || "N/A"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {enrollment.enrolledAt
                          ? new Date(enrollment.enrolledAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          radius="sm"
                          className="bg-[#06574C] text-white"
                          startContent={<Eye size={18} color="white" />}
                          onPress={() => showMessage("View course detail coming soon")}
                        >
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination for Enrollments */}
              {enrollmentsData?.meta?.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {((enrollmentPage - 1) * enrollmentLimit) + 1} to{" "}
                    {Math.min(enrollmentPage * enrollmentLimit, enrollmentsData.meta.total)} of{" "}
                    {enrollmentsData.meta.total} enrollments
                  </div>
                  <Pagination
                    loop
                    showControls
                    classNames={{
                      cursor: "bg-[#06574C] text-white",
                    }}
                    page={enrollmentPage}
                    onChange={setEnrollmentPage}
                    total={enrollmentsData.meta.totalPages}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-white p-3 my-4 rounded-lg">
        <div className="flex md:flex-row flex-col gap-2 md:justify-between md:items-center">
          <h1 className="text-3xl md:text-xl font-bold">Payment History</h1>
          <div className="flex gap-3 items-center">
            <Select
              radius="sm"
              variant="bordered"
              color="success"
              size="md"
              className="text-[#06574C] w-40"
              placeholder="Filter by status"
              selectedKeys={[invoiceStatus]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setInvoiceStatus(selectedKey);
                setInvoicePage(1);
              }}
            >
              {filters.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
            <Button
              size="md"
              radius="sm"
              className="bg-[#06574C] text-white"
              startContent={<Upload size={20} />}
              onPress={() => showMessage("Export functionality coming soon")}
            >
              Export
            </Button>
          </div>
        </div>
        <div className="mt-3">
          {isInvoicesLoading ? (
            <div className="flex justify-center py-8">
              <Spinner color="success" />
            </div>
          ) : (
            <>
              <Table
                aria-label="Payment history table"
                removeWrapper
                classNames={{
                  base: "bg-white rounded-lg overflow-x-scroll no-scrollbar",
                  th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936] border-t border-default-200",
                  td: "py-3",
                  tr: "border-b border-default-200",
                }}
              >
                <TableHeader>
                  <TableColumn>Transaction ID</TableColumn>
                  <TableColumn>Course Name</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Payment Method</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Action</TableColumn>
                </TableHeader>

                <TableBody emptyContent={<p className="text-center py-4">No payment history found</p>}>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {invoice.transactionId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <h1 className="font-semibold text-sm">
                          {invoice.courseName || "Course"}
                        </h1>
                        <h1 className="text-xs text-[#9A9A9A]">
                          {invoice.courseDescription || ""}
                        </h1>
                      </TableCell>
                      <TableCell className="flex flex-col">
                        <h1 className="font-semibold text-sm">{invoice.amount}</h1>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className={`${getStatusColor(invoice.status)} w-30`}>
                          {invoice.status || "N/A"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 items-center">
                          <img src="/icons/Visa.svg" alt="Visa" className="h-6" />
                          {invoice.paymentMethodDisplay}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.time}</TableCell>
                      <TableCell>
                        <Button
                          radius="sm"
                          className="bg-[#06574C] text-white"
                          startContent={<Download size={18} color="white" />}
                          onPress={() => handleDownloadInvoice(invoice)}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination and Total Revenue for Invoices */}
              {invoicesData?.meta?.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {((invoicePage - 1) * invoiceLimit) + 1} to{" "}
                    {Math.min(invoicePage * invoiceLimit, invoicesData.meta.total)} of{" "}
                    {invoicesData.meta.total} invoices
                  </div>
                  <Pagination
                    loop
                    showControls
                    classNames={{
                      cursor: "bg-[#06574C] text-white",
                    }}
                    page={invoicePage}
                    onChange={setInvoicePage}
                    total={invoicesData.meta.totalPages}
                  />
                </div>
              )}

              <div className="flex justify-between items-center mt-2 px-1">
                <div className="text-[#333333] text-sm">
                  <span>Total Revenue:</span>
                  <span className="font-semibold">
                    {invoicesData?.meta?.totalRevenue || "$0.00"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-[#06574C] font-bold">
                    View all Transactions
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;

import { 
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  DatePicker,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Eye, MessageCircle } from "lucide-react";
import { useGetStudentAttendanceListQuery, useGetStudentsForFilterQuery } from "../../../redux/api/attendance";
import { dateFormatter } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";

const StudentAttendanceList = () => {
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const messagesPath = user?.role === "admin" ? "/admin/help/messages" : "/teacher/chat";

  const handleOpenChat = (student) => {
    navigate(messagesPath, {
      state: {
        startChatWith: student.studentId,
        receiverName: student.studentName,
        receiverRole: "student",
      },
    });
  };

  const { data, isLoading } = useGetStudentAttendanceListQuery({
    page,
    limit,
    search,
  });

  const attendanceData = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.total || 0;

  const columns = [
    { name: "STUDENT", uid: "student" },
    { name: "TOTAL ATTENDANCE", uid: "total_attendance" },
    { name: "LATEST ACTIVITY", uid: "latestActivity" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleViewDetails = (student) => {
    navigate(`${student.studentId}`);
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-8 min-h-screen">
      <DashHeading
        title={"Student Attendance List"}
        desc={"Comprehensive view of student attendance across courses"}
      /> 
      
      <div className="bg-[#EBD4C9] p-4 rounded-lg my-4 flex flex-wrap gap-4 items-end shadow-sm w-full">
        
          <Input
            label="Search Student"
            placeholder="Search by name, email or course..."
            labelPlacement="outside"
            size="lg"
            radius="lg"  
            className="w-full sm:max-w-[350px]"
            startContent={<IoSearchOutline className="text-gray-400" size={20} />}
            value={search}
            onValueChange={setSearch}
          /> 

      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table
          aria-label="Student Attendance Table"
          removeWrapper
          classNames={{
            base: "w-full overflow-x-auto h-[calc(100vh-300px)] no-scrollbar",
            th: "bg-[#FBF4EC] text-black font-bold py-4 px-6 text-sm uppercase tracking-wider",
            td: "py-4 px-6 border-b border-gray-50",
            tr: "hover:bg-gray-50/50 transition-colors",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody 
            items={attendanceData}
            isLoading={isLoading}
            loadingContent={<Spinner color="success" size="lg" />}
            emptyContent={isLoading ? " " : "No students found"}
          >
            {(item) => (
              <TableRow key={item.studentId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#06574C] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {item.studentName?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 line-clamp-1">{item.studentName}</span>
                      <span className="text-xs text-gray-500 font-normal">{item.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                    <span className="text-[#06574C] font-semibold">{item.attendedSessions}</span> 
                    <span className="text-gray-400 mx-1">/</span> 
                    <span className="text-gray-600">{item.totalSessions} Sessions</span>
                </TableCell>
                <TableCell className="text-gray-600">
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-700">
                            {item.latestAttendance ? dateFormatter(item.latestAttendance) : "No Activity"}
                        </span>
                        {item.latestAttendance && (
                            <span className="text-[10px] text-gray-500 font-medium">
                                {new Date(item.latestAttendance).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-[#06574C]/10 text-[#06574C] font-semibold hover:bg-[#06574C] hover:text-white transition-all duration-300"
                      startContent={<Eye size={16} />}
                      onPress={() => handleViewDetails(item)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-[#95C4BE]/50 text-[#06574C] font-semibold hover:bg-[#06574C] hover:text-white transition-all duration-300"
                      startContent={<MessageCircle size={16} />}
                      onPress={() => handleOpenChat(item)}
                    >
                      Chat
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-[#FBF4EC]/30">
            <span className="text-sm text-gray-500 font-medium">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} students
            </span>
            <Pagination
              showControls
              color="success"
              page={page}
              total={totalPages}
              onChange={setPage}
              variant="flat"
              classNames={{
                cursor: "bg-[#06574C] text-white",
                prev: "bg-white",
                next: "bg-white",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceList;

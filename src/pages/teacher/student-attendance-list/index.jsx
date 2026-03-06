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
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import CourseSelect from "../../../components/select/CourseSelect";
import { useGetIndividualStudentAttendanceHistoryQuery, useGetStudentAttendanceListQuery, useGetStudentsForFilterQuery } from "../../../redux/api/attendance";
import { dateFormatter } from "../../../lib/utils";
import { formatTime12Hour } from "../../../utils/scheduleHelpers";

const StudentAttendanceList = () => {
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const { data, isLoading } = useGetStudentAttendanceListQuery({
    page,
    limit,
    search,
    courseId,
    studentId,
  });

  const { data: studentsData } = useGetStudentsForFilterQuery({ courseId });
  const filterStudents = studentsData?.students || [];

  const attendanceData = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.total || 0;

  const columns = [
    { name: "STUDENT", uid: "student" },
    { name: "COURSE", uid: "course" },
    { name: "SUBSCRIPTION DATE", uid: "enrolledAt" },
    { name: "ATTENDED", uid: "attended" },
    { name: "MISSED", uid: "missed" },
    { name: "TOTAL", uid: "total" },
    { name: "LATEST ACTIVITY", uid: "latestActivity" },
    { name: "ATTENDANCE RATE", uid: "rate" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleViewDetails = (student) => {
    setSelectedRecipient(student);
    onOpen();
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

        <div className="">
          <CourseSelect   
            label="Course" 
            onChange={(id) => {
              setCourseId(id);
              setStudentId(null);
              setPage(1);
            }} 
          />
        </div>
        <Select
          label="Student"
          placeholder="Select Student"
          labelPlacement="outside"
          size="lg"
          radius="lg"
          className="w-full sm:max-w-[200px]"
          selectedKeys={studentId ? [String(studentId)] : []}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            setStudentId(val);
            setPage(1);
          }}
        >
          {filterStudents.map((s) => (
            <SelectItem key={String(s.id)} textValue={s.name}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
              <TableRow key={`${item.studentId}-${item.courseId}`}>
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
                <TableCell className="font-medium text-gray-700">{item.courseName}</TableCell>
                <TableCell className="text-gray-600 font-medium">
                    {item.enrolledAt ? dateFormatter(item.enrolledAt) : "N/A"}
                </TableCell>
                <TableCell>
                    {item.attendedSessions}
                </TableCell>
                <TableCell>
                        {item.missedSessions}
                </TableCell>
                <TableCell>
                    {item.totalSessions}
                </TableCell>
                <TableCell className="text-gray-600">
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">
                            {item.latestAttendance ? dateFormatter(item.latestAttendance) : "No Activity"}
                        </span>
                        {item.latestAttendance && (
                            <span className="text-[10px] text-gray-400">
                                {new Date(item.latestAttendance).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 w-24">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className={item.attendanceRate < 50 ? 'text-red-500' : 'text-green-600'}>
                            {item.attendanceRate}%
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                item.attendanceRate < 50 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#06574C] shadow-[0_0_8px_rgba(6,87,76,0.3)]'
                            }`}
                            style={{ width: `${item.attendanceRate}%` }}
                        />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-[#06574C]/10 text-[#06574C] font-semibold hover:bg-[#06574C] hover:text-white transition-all duration-300"
                    startContent={<Eye size={16} />}
                    onPress={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
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

      <AttendanceDetailsModal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        student={selectedRecipient} 
      />
    </div>
  );
};

const AttendanceDetailsModal = ({ isOpen, onOpenChange, student }) => {
    const { data, isLoading } = useGetIndividualStudentAttendanceHistoryQuery({
        studentId: student?.studentId,
        courseId: student?.courseId
    }, { skip: !student });

    const history = data?.history || [];

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            size="4xl" 
            scrollBehavior="inside"
            backdrop="blur"
            classNames={{
                header: "border-b border-gray-100 bg-[#FBF4EC]/50",
                footer: "border-t border-gray-100",
                closeButton: "hover:bg-red-100 hover:text-red-500 transition-colors"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span className="text-[#06574C] text-xl">Attendance History</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium text-gray-700">{student?.studentName}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-sm font-medium text-[#D28E3D]">{student?.courseName}</span>
                            </div>
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <Table 
                                aria-label="Individual Attendance History"
                                removeWrapper
                                classNames={{
                                    th: "bg-gray-50 text-gray-600 font-bold py-3 px-4 text-xs uppercase",
                                    td: "py-3 px-4 border-b border-gray-50",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>SESSION TITLE</TableColumn>
                                    <TableColumn>DATE</TableColumn>
                                    <TableColumn>TIME</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                    <TableColumn>JOINED AT</TableColumn>
                                </TableHeader>
                                <TableBody 
                                    items={history}
                                    isLoading={isLoading}
                                    loadingContent={<Spinner color="success" />}
                                    emptyContent={isLoading ? " " : "No history found for this student"}
                                >
                                    {(item) => (
                                        <TableRow key={item.scheduleId}>
                                            <TableCell className="font-medium text-gray-800">{item.title}</TableCell>
                                            <TableCell className="text-gray-600">{dateFormatter(item.date)}</TableCell>
                                            <TableCell className="text-gray-500 text-sm">
                                                {formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="sm"
                                                    variant="dot"
                                                    color={item.status === 'Attended' ? 'success' : 'danger'}
                                                    className="font-bold border-none"
                                                >
                                                    {item.status}
                                                </Chip>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-xs italic">
                                                {item.joinedAt ? new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default StudentAttendanceList;

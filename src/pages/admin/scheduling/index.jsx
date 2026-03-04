import { useEffect, useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Calendar,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CheckboxGroup,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Pagination,
} from "@heroui/react";
import { CalendarIcon, Copy, Trash2, PlusIcon, User } from "lucide-react";

import { getStatusColor, getStatusText, formatTime12Hour } from "../../../utils/scheduleHelpers";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { dateFormatter, debounce, limits } from "../../../lib/utils";
import TeacherSelect from "../../../components/select/TeacherSelect";
import UserSelect from "../../../components/select/UserSelect";
import { useCreateScheduleMutation, useDeleteScheduleMutation, useGetScheduleQuery, useUpdateScheduleMutation } from "../../../redux/api/schedules";
import CourseSelect from "../../../components/select/CourseSelect";
import Swal from "sweetalert2";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Scheduling = () => {
  const [searchParams] = useSearchParams();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Pagination & Filtering (Basic Implementation)
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const isCalenderView = searchParams.get('calender') === 'true';
  const isOpenModalOnLoad = searchParams.get('modal') === 'true';
  const { user } = useSelector(state => state.user)
  // Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacherId: "",
    meetingLink: '',
    courseId: '',
    scheduleType: "daily",
    price: undefined,
    sessionMode: "all", // "one-on-one" or "all"

    // common
    startTime: "",
    endTime: "",

    // once
    date: "",

    // recurring
    startDate: "",
    endDate: "",
    repeatInterval: 0,
    weeklyDays: [],
    specificStudentIds: [],
    // Zoom settings
    settings: {
      join_before_host: false,
      auto_recording: false,
    },
  });

  const { data, isFetching } = useGetScheduleQuery({
    page: page,
    limit: limit,
    search,
    status: statusFilter
  }, { skip: isCalenderView });
  const [createSchedule, { isLoading: isSubmitting, isError }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating, isError: isError2 }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isError: isError3 }] = useDeleteScheduleMutation();

  useEffect(() => {
    if (isOpenModalOnLoad) {
      openCreateModal();
    }
  }, [isOpenModalOnLoad]);

  if (isCalenderView) return null;

  const handleSubmit = async () => {
    if (!formData.title || !formData.startTime) {
      errorMessage("Please fill required fields (Title,  Time, Teacher)");
      return;
    }
    try {
      let response;
      const payload = {
        ...formData,
      }

      if (user?.role === "teacher") {
        payload.teacherId = user.id
      }
      if (isEdit) {
        response = await updateSchedule({ id: formData.id, data: payload });;
      } else {
        response = await createSchedule(payload);
      }

      const data = response.data;

      if (response?.error) {
        throw new Error(response?.error?.data?.message || "Operation failed");
      }
      successMessage(data?.message);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
      errorMessage("Error submitting form: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06574C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    if (!isConfirmed) return;
    try {
      setDeleteLoading(id);
      const res = await deleteSchedule(id);
      const error = res?.error?.data;
      if (error) {
        throw new Error(error.message || "Operation failed");
      }
      successMessage(res.data.message || "Course deleted successfully");
    } catch (error) {
      errorMessage("Error deleting session: " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      teacherId: '',
      meetingLink: '',
      courseId: '',
      scheduleType: '',
      sessionMode: 'all',
      repeatInterval: 0,
      weeklyDays: [],
      specificStudentIds: [],
      settings: {
        join_before_host: false,
        auto_recording: false,
      },
    });
    setIsEdit(false);
  };

  const openCreateModal = () => {
    resetForm();
    onOpen();
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    const dateStr = new Date(item.date).toISOString().split('T')[0];
    setFormData({
      id: item.id,
      title: item.title,
      date: dateStr,
      startTime: item.startTime,
      endTime: item.endTime,
      description: item.description,
      teacherId: item.teacherId ? String(item.teacherId) : '',
      courseId: item.courseId ? String(item.courseId) : '',
      meetingLink: item.meetingLink,
      scheduleType: item.scheduleType,
      sessionMode: item.specificStudents?.length > 0 ? 'one-on-one' : 'all',
      startDate: item?.scheduleDates[0],
      endDate: item?.scheduleDates[1],
      repeatInterval: item.repeatInterval,
      weeklyDays: item.weeklyDays,
      specificStudentIds: item.specificStudents,
      specificStudents: item.specificStudents,
      settings: {
        join_before_host: item.settings?.join_before_host || false,
        auto_recording: item.settings?.auto_recording || false,
      },
    });
    onOpen();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    successMessage("Link Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "live", label: "Live" },
  ];



  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 ">
      <DashHeading
        title={"Schedule Live Classes"}
        desc={"Manage and organize your upcoming live sessions"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className="min-w-[150px]"
            radius="sm"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Select status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Input
            type="search"
            placeholder="Search by title or description"
            radius="sm"
            defaultValue={search}
            onChange={(e) =>
              debounce(() => {
                setSearch(e.target.value);
              }, 400)
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to={`/${user.role}/class-scheduling?calender=true`}
            radius="sm"
            size="md"
            startContent={<CalendarIcon color="white" size={15} />}
            color="success"
          >
            Calender View
          </Button>
          <Button
            startContent={<PlusIcon />}
            radius="sm"
            size="md"
            color="success"
            onPress={openCreateModal}
          >
            Schedule New
          </Button>
        </div>
      </div>

      <div className="">
        <Table
          removeWrapper
          isHeaderSticky
          aria-label="Example static collection table"
          classNames={{
            base: "w-full bg-white rounded-lg min-h-[55vh] overflow-x-scroll w-full no-scrollbar max-h-[500px] shadow-md",
            th: "font-bold bg-[#EBD4C9] p-4 text-md text-[#333333] capitalize tracking-widest ",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200",
          }}
        >
          <TableHeader>
            <TableColumn>Details</TableColumn>
            <TableColumn>Teacher</TableColumn>
            <TableColumn>Dates</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Zoom Link</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody loadingContent={<Spinner color="success" />} loadingState={isFetching ? 'loading' : 'idle'} emptyContent={"No sessions scheduled."}>
            {data?.schedules?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{item.description || 'No description'}</div>
                    <div className="text-xs text-[#06574C] mt-1">{item.courseName || 'General Session'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex-col flex">
                    <span className="font-semibold">{item.teacherName || 'Unassigned'}</span>
                    <span className="text-xs text-gray-500">{item.teacherEmail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <span className="cursor-pointer font-medium">{dateFormatter(item.scheduleDates[0])} - {dateFormatter(item?.scheduleDates[item.scheduleDates?.length - 1])}</span>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        size="sm"
                        className="w-full booking-inputs"
                        variant="underlined"
                        color='success'
                        isReadOnly
                        isDateUnavailable={(date) =>
                          item.scheduleDates?.includes(date.toString())
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500 text-sm">{formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}</div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="capitalize"
                    color={getStatusColor(item)}
                  >
                    {getStatusText(item)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {item.meetingLink ? (
                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => copyToClipboard(item.meetingLink, item.id)}>
                      <Copy color="#3F86F2" size={16} />
                      <span className="text-[#3F86F2] hover:underline text-sm">
                        {copiedId === item.id ? "Copied!" : "Copy link"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No Link</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      radius="sm"
                      variant="bordered"
                      className="border-[#06574C] text-[#06574C]"
                      startContent={<CalendarIcon size={18} />}
                      size="sm"
                      onPress={() => openEditModal(item)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      radius="sm"
                      className="bg-[#06574C] text-white"
                      size="sm"
                      isLoading={deleteLoading === item.id}
                      isIconOnly
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center p-4 gap-2 justify-between overflow-hidden">
          <div className="flex text-sm items-center gap-1">
            <span>Limit</span>
            <Select
              radius="sm"
              className="w-[70px]"
              defaultSelectedKeys={["10"]}
              isDisabled={isFetching || data?.total < 7}
              onSelectionChange={(k) => {
                const keys = [...k];
                setLimit(Number(keys[0]))
              }}
              placeholder="1"
            >
              {limits.map((limit) => (
                <SelectItem key={limit.key}>{limit.label}</SelectItem>
              ))}
            </Select>
            <span className="min-w-56">Out of {data?.total}</span>
          </div>
          <Pagination
            className=""
            showControls
            variant="ghost"
            initialPage={1}
            total={data?.totalPages}
            onChange={setPage}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} placement="center" backdrop="blur" size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C]">
                {isEdit ? "Reschedule Session" : "Schedule New Session"}
              </ModalHeader>
              <ModalBody>
                {!isEdit && (
                  <p className="text-xs text-gray-500 mb-2">Zoom link and password will be auto-generated upon creation.</p>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    radius="sm"
                    size="md"
                    color={formData.sessionMode === "all" ? "success" : "default"}
                    variant={formData.sessionMode === "all" ? "solid" : "bordered"}
                    className="w-full"
                    onPress={() => setFormData({ ...formData, sessionMode: "all" })}
                  >
                    For All Enrolled Users
                  </Button>
                  <Button
                    radius="sm"
                    size="md"
                    color={formData.sessionMode === "one-on-one" ? "success" : "default"}
                    className="w-full"
                    variant={formData.sessionMode === "one-on-one" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, sessionMode: "one-on-one" })}
                  >
                    One-on-One Live
                  </Button>
                </div>

                <Input
                  label="Session Title"
                  variant="bordered"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <CourseSelect
                  initialValue={formData.courseId}
                  onChange={(courseId) => setFormData({ ...formData, courseId })}
                  status="published"
                  type="live"
                  isDisabled={isEdit}
                />

                <div className="flex gap-2 mb-4">
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "once" ? "success" : "default"}
                    variant={formData.scheduleType === "once" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "once" })}
                  >
                    One Time
                  </Button>
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "daily" ? "success" : "default"}
                    variant={formData.scheduleType === "daily" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "daily" })}
                  >
                    Daily
                  </Button>
                  <Button
                    radius="md"
                    size="md"
                    color={formData.scheduleType === "weekly" ? "success" : "default"}
                    variant={formData.scheduleType === "weekly" ? "solid" : "bordered"}
                    onPress={() => setFormData({ ...formData, scheduleType: "weekly" })}
                  >
                    Weekly
                  </Button>
                </div>

                {formData.scheduleType === "once" && (
                  <Input
                    type="date"
                    label="Session Date"
                    variant="bordered"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                )}

                {formData.scheduleType === "daily" && (
                  <>
                    <div className="flex gap-3">
                      <Input
                        type="date"
                        label="Start Date"
                        variant="bordered"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        label="End Date"
                        variant="bordered"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>

                    <Input
                      type="number"
                      label="Repeat Every (Days)"
                      min={1}
                      variant="bordered"
                      value={formData.repeatInterval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repeatInterval: Number(e.target.value),
                        })
                      }
                    />
                  </>
                )}

                {formData.scheduleType === "weekly" && (
                  <>
                    <div className="flex gap-3">
                      <Input
                        type="date"
                        label="Start Date"
                        variant="bordered"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        label="End Date"
                        variant="bordered"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>

                    <Input
                      type="number"
                      label="Repeat Every (Weeks)"
                      min={1}
                      variant="bordered"
                      value={formData.repeatInterval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repeatInterval: Number(e.target.value),
                        })
                      }
                    />

                    <CheckboxGroup
                      label="Select Days"
                      value={formData?.weeklyDays}
                      orientation="horizontal"
                      color="success"
                      onChange={(val) =>
                        setFormData({ ...formData, weeklyDays: val })
                      }
                    >
                      <Checkbox value="1">Sunday</Checkbox>
                      <Checkbox value="2">Monday</Checkbox>
                      <Checkbox value="3">Tuesday</Checkbox>
                      <Checkbox value="4">Wednesday</Checkbox>
                      <Checkbox value="5">Thursday</Checkbox>
                      <Checkbox value="6">Friday</Checkbox>
                      <Checkbox value="7">Saturday</Checkbox>
                    </CheckboxGroup>
                  </>
                )}

                <div className="flex gap-3">
                  <Input
                    type="time"
                    label="Start Time"
                    variant="bordered"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                  <Input
                    type="time"
                    label="End Time"
                    variant="bordered"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
                {user?.role!== "teacher" && <TeacherSelect
                  initialValue={formData.teacherId}
                  onChange={(teacherId) => setFormData({ ...formData, teacherId })}
                />}
                {formData.sessionMode === "one-on-one" && (
                  <UserSelect
                    courseId={formData.courseId}
                    initialValues={formData?.specificStudentIds}
                    onChange={(specificStudentIds) => setFormData({ ...formData, specificStudentIds })}
                  />
                )}

                <Textarea
                  label="Description"
                  variant="bordered"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <div className="py-3 border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2 text-[#06574C]">Zoom Meeting Settings</h3>
                  <CheckboxGroup
                    orientation="vertical"
                    color="success"
                    value={[
                      ...(formData.settings?.join_before_host ? ['join_before_host'] : []),
                      ...(formData.settings?.auto_recording ? ['auto_recording'] : []),
                    ]}
                    onChange={(values) => {
                      setFormData({
                        ...formData,
                        settings: {
                          join_before_host: values.includes('join_before_host'),
                          auto_recording: values.includes('auto_recording'),
                        },
                      });
                    }}
                  >
                    <Checkbox value="join_before_host">Allow students to join before host</Checkbox>
                    <Checkbox value="auto_recording">Record session automatically</Checkbox>
                  </CheckboxGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="bg-[#06574C] text-white" onPress={handleSubmit} isLoading={isSubmitting || isUpdating}>
                  {isEdit ? "Update Schedule" : "Schedule & Generate Zoom"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Scheduling;

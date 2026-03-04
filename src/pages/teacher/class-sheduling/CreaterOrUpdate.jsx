import { useEffect, useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
    Button,
    useDisclosure,
    Input,
    Textarea,
    CheckboxGroup,
    Checkbox,
    Form,
} from "@heroui/react";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import TeacherSelect from "../../../components/select/TeacherSelect";
import UserSelect from "../../../components/select/UserSelect";
import { useCreateScheduleMutation, useDeleteScheduleMutation, useGetScheduleQuery, useUpdateScheduleMutation } from "../../../redux/api/schedules";
import CourseSelect from "../../../components/select/CourseSelect";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CreaterOrUpdateSchedule = () => {
    const [searchParams] = useSearchParams();
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const scheduleFromState = location.state || {};
    const { user } = useSelector(state => state.user)

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
    const [createSchedule, { isLoading: isSubmitting, isError }] = useCreateScheduleMutation();
    const [updateSchedule, { isLoading: isUpdating, isError: isError2 }] = useUpdateScheduleMutation();
    const [deleteSchedule, { isError: isError3 }] = useDeleteScheduleMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
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


    useEffect(() => {
        if (!scheduleFromState.id) return;
        setIsEdit(true);
        const item = scheduleFromState;
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
    }, [scheduleFromState])

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        successMessage("Link Copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!scheduleFromState) {
        navigate("/student/browse-courses");
        return null;
    }


    return (
        <div className="bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 ">
            <div className="flex items-center justify-between gap-2">
                <DashHeading
                    title={isEdit ? "Reschedule Session" : "Schedule New Session"}
                />
                <Button
                    // startContent={<PlusIcon />}
                    radius="sm"
                    size="md"
                    color="success"
                    as={Link}
                    to="/teacher/class-scheduling"
                >
                    Back
                </Button>
            </div>
            <Form onSubmit={handleSubmit} className="bg-white w-full px-2 sm:px-4 py-6 rounded-md space-y-3">
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
                        isRequired={formData.scheduleType === "once"}
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
                                isRequired={formData.scheduleType === "daily"}
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                            />
                            <Input
                                type="date"
                                label="End Date"
                                variant="bordered"
                                isRequired={formData.scheduleType === "daily"}
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
                                isRequired={formData.scheduleType === "weekly"}
                                value={formData.startDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                            />
                            <Input
                                type="date"
                                label="End Date"
                                variant="bordered"
                                isRequired={formData.scheduleType === "weekly"}
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
                            isRequired={formData.scheduleType === "weekly"}
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
                        isRequired
                        value={formData.startTime}
                        onChange={(e) =>
                            setFormData({ ...formData, startTime: e.target.value })
                        }
                    />
                    <Input
                        type="time"
                        label="End Time"
                        isRequired
                        variant="bordered"
                        value={formData.endTime}
                        onChange={(e) =>
                            setFormData({ ...formData, endTime: e.target.value })
                        }
                    />
                </div>
                {user?.role !== "teacher" && <TeacherSelect
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
                <div className="flex items-center max-sm:flex-wrap gap-3 w-full">
                    <Button color="danger" variant="flat" as={Link} to={'/teacher/class-scheduling'}>
                        Cancel
                    </Button>
                    <Button color="success" type="submit" isLoading={isSubmitting || isUpdating}>
                        {isEdit ? "Update Schedule" : "Schedule & Generate Zoom"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreaterOrUpdateSchedule

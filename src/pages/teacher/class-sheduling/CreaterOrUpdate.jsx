import { useCallback, useEffect, useState, useMemo } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
    Button,
    Input,
    Textarea,
    CheckboxGroup,
    Checkbox,
    Form,
    Select,
    SelectItem,
} from "@heroui/react";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import TeacherSelect from "../../../components/select/TeacherSelect";
import UserSelect from "../../../components/select/UserSelect";
import { useCreateScheduleMutation, useUpdateScheduleMutation } from "../../../redux/api/schedules";
import CourseSelect from "../../../components/select/CourseSelect";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { validateSchedule } from "../../../lib/utils";

// ── SmartTimeInput ──────────────────────────────────────────────────────────
// Keeps its own local value so the parent doesn't re-render on every keystroke.
// Commits (calls onCommit) only on blur or Enter.
const SmartTimeInput = ({ initialValue = "", onCommit, label, className }) => {
    const [local, setLocal] = useState(initialValue);
    useEffect(() => setLocal(initialValue), [initialValue]);
    const commit = useCallback(() => {
        if (local !== initialValue) onCommit(local);
    }, [local, initialValue, onCommit]);
    return (
        <Input
            type="time"
            label={label}
            variant="bordered"
            size="sm"
            value={local}
            className={className}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            onBlur={commit}
        />
    );
};
// ───────────────────────────────────────────────────────────────────────────

const DAYS = [["1", "Monday"], ["2", "Tuesday"], ["3", "Wednesday"], ["4", "Thursday"], ["5", "Friday"], ["6", "Saturday"], ["7", "Sunday"]];

const CreaterOrUpdateSchedule = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scheduleFromState = location.state || {};
    const { user } = useSelector(state => state.user);

    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        teacherId: "",
        meetingLink: "",
        courseId: "",
        scheduleType: "daily",
        sessionMode: "all",
        startTime: "",
        endTime: "",
        date: "",
        startDate: "",
        endDate: "",
        repeatInterval: 1,
        weeklyDays: [],
        specificStudentIds: [],
        specificDates: [],   // array of "YYYY-MM-DD" strings (selected keys)
        settings: {
            join_before_host: false,
            auto_recording: false,
            waiting_room: true,
        },
    });

    // Per-date timing map: { "2026-05-06": { startTime: "13:00", endTime: "14:00" }, ... }
    const [specificDateTimings, setSpecificDateTimings] = useState({});

    const [createSchedule, { isLoading: isSubmitting }] = useCreateScheduleMutation();
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();

    // ── init from location state ────────────────────────────────────────────
    useEffect(() => {
        if (!scheduleFromState.id) return;
        setIsEdit(true);
        const item = scheduleFromState;
        const dateStr = new Date(item.date).toISOString().split("T")[0];

        // specificDates from DB is JSONB: { "YYYY-MM-DD": { startTime, endTime } }
        let sdKeys = [];
        let sdTimings = {};
        if (item.specificDates && typeof item.specificDates === "object" && !Array.isArray(item.specificDates)) {
            sdKeys = Object.keys(item.specificDates);
            sdTimings = item.specificDates;
        } else if (Array.isArray(item.specificDates)) {
            sdKeys = item.specificDates;
        }

        setFormData({
            id: item.id,
            title: item.title,
            date: dateStr,
            startTime: item.startTime,
            endTime: item.endTime,
            description: item.description,
            teacherId: item.teacherId || null,
            courseId: item.courseId || null,
            meetingLink: item.meetingLink,
            scheduleType: item.scheduleType,
            sessionMode: item.specificStudents?.length > 0 ? "one-on-one" : "all",
            startDate: item?.startDate?.split("T")[0] || null,
            endDate: item?.endDate?.split("T")[0] || null,
            repeatInterval: item.repeatInterval,
            weeklyDays: item.weeklyDays,
            specificStudentIds: item.specificStudents,
            specificStudents: item.specificStudents,
            specificDates: sdKeys,
            settings: {
                join_before_host: item.settings?.join_before_host || false,
                waiting_room: item.settings?.waiting_room || false,
                auto_recording: item.settings?.auto_recording || false,
            },
        });
        setSpecificDateTimings(sdTimings);
    }, [scheduleFromState]);

    // ── available dates derived from startDate/endDate range ───────────────
    const availableDates = useMemo(() => {
        if (!formData.startDate) return [];
        const start = new Date(formData.startDate);
        const end = formData.endDate
            ? new Date(formData.endDate)
            : new Date(start.getFullYear(), start.getMonth(), 28);

        const dates = [];
        const current = new Date(start);
        let count = 0;
        while (current <= end && count < 31) {
            if (current.getDate() <= 28) {
                dates.push({
                    key: current.toISOString().split("T")[0],
                    label: current.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                });
            }
            current.setDate(current.getDate() + 1);
            count++;
        }
        return dates;
    }, [formData.startDate, formData.endDate]);

    // Remove specificDates that fall outside the updated range
    useEffect(() => {
        if (formData.specificDates.length === 0) return;
        const validKeys = new Set(availableDates.map(d => d.key));
        const filtered = formData.specificDates.filter(d => validKeys.has(d));
        if (filtered.length !== formData.specificDates.length) {
            setFormData(prev => ({ ...prev, specificDates: filtered }));
            setSpecificDateTimings(prev => {
                const next = {};
                filtered.forEach(d => { if (prev[d]) next[d] = prev[d]; });
                return next;
            });
        }
    }, [availableDates]);

    // ── commit a single date's start or end time ────────────────────────────
    // Uses functional update so it doesn't need formData in its dep array
    const commitTiming = useCallback((dateKey, field, value) => {
        setSpecificDateTimings(prev => ({
            ...prev,
            [dateKey]: {
                ...prev[dateKey],
                [field]: value,
            },
        }));
    }, []);

    // ── submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateSchedule(formData);
        if (!validation.valid) { errorMessage(validation.message); return; }

        try {
            // Build JSONB payload: each selected date gets its own timing
            // Falls back to the global startTime/endTime if no custom timing set
            const sdPayload = {};
            formData.specificDates.forEach(dateKey => {
                sdPayload[dateKey] = {
                    startTime: specificDateTimings[dateKey]?.startTime || formData.startTime,
                    endTime: specificDateTimings[dateKey]?.endTime || formData.endTime,
                };
            });

            const payload = {
                ...formData,
                weeklyDays: formData.weeklyDays?.map(String),
                specificDates: formData.specificDates.length > 0 ? sdPayload : {},
            };

            if (user?.role === "teacher") payload.teacherId = user.id;

            const response = isEdit
                ? await updateSchedule({ id: formData.id, data: payload })
                : await createSchedule(payload);

            if (response?.error) throw new Error(response.error?.data?.message || "Operation failed");
            successMessage(response.data?.message);
            navigate("/teacher/class-scheduling");
        } catch (error) {
            errorMessage("Error submitting form: " + error.message);
        }
    };

    const hasSpecificDates = formData.specificDates.length > 0;
    const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));
    const setVal = (field) => (val) => setFormData(p => ({ ...p, [field]: val }));

    return (
        <div className="bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
            <div className="flex items-center justify-between gap-2">
                <DashHeading title={isEdit ? "Reschedule Session" : "Schedule New Session"} />
                <Button radius="sm" size="md" color="success" as={Link} to="/teacher/class-scheduling">
                    Back
                </Button>
            </div>

            <Form onSubmit={handleSubmit} className="bg-white w-full px-2 sm:px-4 py-6 rounded-md space-y-3">
                {!isEdit && (
                    <p className="text-xs text-gray-500">Zoom link and password will be auto-generated upon creation.</p>
                )}
                <p className="text-xs text-warning">Note: 29th, 30th and 31st dates will be blocked for every month.</p>
                {isEdit && hasSpecificDates && (
                    <p className="text-sm text-danger">
                        Note: You can't edit all schedule details after selecting specific dates. You can only update the timing of specific dates.
                    </p>
                )}

                {/* Session mode */}
                <div className="flex gap-2">
                    {["all", "one-on-one"].map(mode => (
                        <Button
                            key={mode} radius="sm" size="md" className="w-full"
                            color={formData.sessionMode === mode ? "success" : "default"}
                            variant={formData.sessionMode === mode ? "solid" : "bordered"}
                            onPress={() => setFormData(p => ({ ...p, sessionMode: mode }))}
                        >
                            {mode === "all" ? "For All Enrolled Users" : "One-on-One Live"}
                        </Button>
                    ))}
                </div>

                <Input
                    label="Session Title" variant="bordered"
                    value={formData.title}
                    isDisabled={hasSpecificDates}
                    onChange={set("title")}
                />

                <CourseSelect
                    initialValue={formData.courseId}
                    onChange={setVal("courseId")}
                    status="published,private"
                    type="live"
                    isDisabled={isEdit}
                />

                {/* ── Specific dates selector (edit-mode only) ── */}
                {isEdit && (
                    <div className="w-full">
                        <Select
                            labelPlacement="outside"
                            label="Select Specific Dates"
                            placeholder={formData.startDate ? "Pick specific dates from range" : "Please select start date first"}
                            selectionMode="multiple"
                            variant="bordered"
                            size="md"
                            isDisabled={!formData.startDate}
                            selectedKeys={new Set(formData.specificDates)}
                            onSelectionChange={(keys) => {
                                const next = Array.from(keys);
                                setFormData(p => ({ ...p, specificDates: next }));
                                // Drop timings for deselected dates
                                setSpecificDateTimings(prev => {
                                    const updated = {};
                                    next.forEach(d => { if (prev[d]) updated[d] = prev[d]; });
                                    return updated;
                                });
                            }}
                        >
                            {availableDates.map(dateObj => (
                                <SelectItem key={dateObj.key} textValue={dateObj.label}>
                                    {dateObj.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                )}

                {hasSpecificDates && (
                    <div className="bordefr rounded-lg p-3 space-y-3 bg-gray-50">
                        <p className="text-xs font-semibold text-[#06574C] uppercase tracking-wider">
                            Set timing for each specific date (defaults to global times if left unchanged):
                        </p>
                        {formData.specificDates.map(dateKey => {
                            const timing = specificDateTimings[dateKey] || {};
                            const label = availableDates.find(d => d.key === dateKey)?.label || dateKey;
                            return (
                                <div key={dateKey} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b pb-2 last:border-0 last:pb-0">
                                    <p className="text-sm font-medium text-gray-700 w-36 shrink-0">{label}</p>
                                    <SmartTimeInput
                                        label="Start Time"
                                        initialValue={timing.startTime || formData.startTime}
                                        onCommit={(v) => commitTiming(dateKey, "startTime", v)}
                                        className="flex-1"
                                    />
                                    <SmartTimeInput
                                        label="End Time"
                                        initialValue={timing.endTime || formData.endTime}
                                        onCommit={(v) => commitTiming(dateKey, "endTime", v)}
                                        className="flex-1"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Schedule type ── */}
                <div className="flex gap-2">
                    {["once", "daily", "weekly"].map(type => (
                        <Button
                            key={type} radius="md" size="md"
                            color={formData.scheduleType === type ? "success" : "default"}
                            variant={formData.scheduleType === type ? "solid" : "bordered"}
                            isDisabled={hasSpecificDates}
                            onPress={() => setFormData(p => ({ ...p, scheduleType: type }))}
                        >
                            {type === "once" ? "One Time" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                    ))}
                </div>

                {formData.scheduleType === "once" && (
                    <Input
                        type="date" label="Session Date" variant="bordered"
                        value={formData.date}
                        isRequired
                        onChange={set("date")}
                    />
                )}

                {(formData.scheduleType === "daily" || formData.scheduleType === "weekly") && (
                    <div className="flex gap-3">
                        <Input
                            type="date" label="Start Date" variant="bordered" labelPlacement="outside"
                            isRequired={formData.scheduleType === "daily"}
                            // isDisabled={hasSpecificDates}
                            value={formData.startDate }
                            onChange={set("startDate")}
                        />
                        <Input
                            className="hidden"
                            type="date" label="End Date (optional)" variant="bordered" labelPlacement="outside"
                            isDisabled={hasSpecificDates}
                            value={formData.endDate}
                            onChange={set("endDate")}
                        />
                    </div>
                )}

                {formData.scheduleType === "daily" && (
                    <Input
                        type="number" label="Repeat Every (Days)" min={1} variant="bordered"
                        value={formData.repeatInterval}
                        isDisabled={hasSpecificDates}
                        onChange={(e) => setFormData(p => ({ ...p, repeatInterval: Number(e.target.value) }))}
                    />
                )}

                {formData.scheduleType === "weekly" && (
                    <>
                        <Input
                            type="number" label="Repeat Every (Weeks)" min={1} variant="bordered"
                            value={formData.repeatInterval}
                            onChange={(e) => setFormData(p => ({ ...p, repeatInterval: Number(e.target.value) }))}
                        />
                        <CheckboxGroup
                            label="Select Days"
                            value={formData?.weeklyDays?.map(String)}
                            orientation="horizontal"
                            color="success"
                            isDisabled={hasSpecificDates}
                            isRequired
                            onChange={setVal("weeklyDays")}
                        >
                            {DAYS.map(([v, l]) => <Checkbox key={v} value={v}>{l}</Checkbox>)}
                        </CheckboxGroup>
                    </>
                )}

                {/* ── Default times (fallback for specific dates without custom timing) ── */}
                <div className="flex gap-3">
                    <Input
                        type="time" label="Default Start Time" variant="bordered" isRequired
                        value={formData.startTime}
                        onChange={set("startTime")}
                    />
                    <Input
                        type="time" label="Default End Time" variant="bordered" isRequired
                        value={formData.endTime}
                        onChange={set("endTime")}
                    />
                </div>

                {user?.role !== "teacher" && (
                    <TeacherSelect
                        initialValue={formData.teacherId}
                        onChange={setVal("teacherId")}
                    />
                )}

                {formData.sessionMode === "one-on-one" && (
                    <UserSelect
                        courseId={formData.courseId}
                        initialValues={formData?.specificStudentIds}
                        onChange={setVal("specificStudentIds")}
                    />
                )}

                <Textarea
                    label="Description" variant="bordered"
                    value={formData.description}
                    isDisabled={hasSpecificDates}
                    onChange={set("description")}
                />

                <div className="py-3 border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2 text-[#06574C]">Zoom Meeting Settings</h3>
                    <CheckboxGroup
                        orientation="vertical" color="success"
                        value={[
                            ...(formData.settings?.join_before_host ? ["join_before_host"] : []),
                            ...(formData.settings?.auto_recording ? ["auto_recording"] : []),
                            ...(formData.settings?.waiting_room ? ["waiting_room"] : []),
                        ]}
                        onChange={(values) => setFormData(p => ({
                            ...p,
                            settings: {
                                join_before_host: values.includes("join_before_host"),
                                auto_recording: values.includes("auto_recording"),
                                waiting_room: values.includes("waiting_room"),
                            },
                        }))}
                    >
                        <Checkbox value="auto_recording">Record session automatically (cloud)</Checkbox>
                        <Checkbox value="waiting_room">Participants must be admitted by the host before joining.</Checkbox>
                    </CheckboxGroup>
                </div>

                <div className="flex items-center max-sm:flex-wrap gap-3 w-full">
                    <Button color="danger" variant="flat" as={Link} to="/teacher/class-scheduling">
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

export default CreaterOrUpdateSchedule;

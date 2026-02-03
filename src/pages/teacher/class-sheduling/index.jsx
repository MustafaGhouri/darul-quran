import React, { useState, useEffect } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Calendar } from "lucide-react";
import { CiCircleAlert, CiVideoOn } from "react-icons/ci";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ClassSheduling = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    date: null,
    startTime: null,
    duration: 60,
    customDuration: "",
    description: "",
    meetingLink: "",
  });

  const [settings, setSettings] = useState({
    recordSession: false,
    sendEmail: false,
    allowEarlyJoin: false,
  });

  const durationOptions = [30, 45, 60, 90];

  useEffect(() => {
    fetchCurrentTeacher();
  }, []);

  useEffect(() => {
    if (currentTeacher) {
      fetchCourses();
    }
  }, [currentTeacher]);

  const fetchCurrentTeacher = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.user) {
        setCurrentTeacher(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch teacher", error);
    }
  };

  const fetchCourses = async () => {
    try {
      if (!currentTeacher) return;

      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/getAll?teacherId=${currentTeacher.id}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const handleGenerateZoomLink = async () => {
    if (!formData.title || !formData.date || !formData.startTime) {
      toast.error("Please fill in Title, Date, and Start Time first");
      return;
    }

    setLoading(true);
    try {
      const zoomSettings = {
        join_before_host: settings.allowEarlyJoin,
        auto_recording: settings.recordSession
      };

      const requestData = {
        title: formData.title,
        date: `${formData.date.year}-${String(formData.date.month).padStart(2, '0')}-${String(formData.date.day).padStart(2, '0')}`,
        startTime: `${String(formData.startTime.hour).padStart(2, '0')}:${String(formData.startTime.minute).padStart(2, '0')}`,
        description: formData.description,
        settings: zoomSettings
      };

      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/generate-zoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, meetingLink: data.meetingLink }));
        toast.success("Zoom link generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate Zoom link");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating Zoom link");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClass = async () => {
    if (!formData.title || !formData.date || !formData.startTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!currentTeacher) {
      toast.error("Teacher information not found");
      return;
    }

    setLoading(true);
    try {
      const duration = formData.customDuration || formData.duration;
      const startHour = formData.startTime.hour;
      const startMinute = formData.startTime.minute;

      const endMinutes = startMinute + parseInt(duration);
      const endHour = startHour + Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;

      const zoomSettings = {
        join_before_host: settings.allowEarlyJoin,
        auto_recording: settings.recordSession
      };

      const scheduleData = {
        title: formData.title,
        date: `${formData.date.year}-${String(formData.date.month).padStart(2, '0')}-${String(formData.date.day).padStart(2, '0')}`,
        startTime: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
        endTime: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`,
        description: formData.description,
        teacherId: currentTeacher.id,
        courseId: formData.courseId || null,
        settings: zoomSettings
      };

      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Class scheduled successfully!");
        setFormData({
          courseId: "",
          title: "",
          date: null,
          startTime: null,
          duration: 60,
          customDuration: "",
          description: "",
          meetingLink: "",
        });
        setTimeout(() => navigate("/teacher/class-scheduling/sheduled-class"), 1000);
      } else {
        toast.error(data.message || "Failed to schedule class");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error scheduling class");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (formData.meetingLink) {
      navigator.clipboard.writeText(formData.meetingLink);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-screen px-2 sm:px-3 overflow-y-auto pb-20">
      <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
        <DashHeading
          title={"Class Scheduling"}
          desc={"Fill in the details below to schedule your live class"}
        />

        <Button
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white"
          startContent={<Calendar size={20} />}
          onPress={() => navigate("/teacher/class-scheduling/sheduled-class")}
        >
          View Scheduled Classes
        </Button>
      </div>

      <div className="rounded-md bg-[#F1C2AC69] p-4 flex flex-col gap-3 md:flex-row items-center mb-3">
        <div>
          <CiCircleAlert size={60} color="#B7721F" />
        </div>
        <div>
          <h1 className="text-[#B7721F] text-lg font-bold">
            Important Scheduling Notice
          </h1>
          <p className="text-[#B7721F] text-sm">
            Classes must be scheduled or changed at least 4 hours before the
            start time to ensure proper notification to all enrolled students.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md mb-3">
        <h1 className="text-xl font-semibold">New Live Class Session</h1>
        <div className="grid grid-cols-12 gap-3 py-3 md:space-y-2">
          <Select
            className="md:col-span-6 col-span-12"
            radius="sm"
            label="Select Course (Optional)"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Select Course"
            selectedKeys={formData.courseId ? [formData.courseId] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setFormData(prev => ({ ...prev, courseId: selectedKey || "" }));
            }}
          >
            {courses.map((course) => (
              <SelectItem key={course.id}>
                {course.courseName}
              </SelectItem>
            ))}
          </Select>

          <Input
            className="md:col-span-6 col-span-12"
            radius="sm"
            label="Class Title *"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter Class Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />

          <DatePicker
            className="md:col-span-6 col-span-12"
            radius="sm"
            label="Date *"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Select Date"
            showMonthAndYearPickers
            value={formData.date}
            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
          />

          <TimeInput
            className="md:col-span-6 col-span-12"
            radius="sm"
            variant="bordered"
            labelPlacement="outside"
            label="Start Time *"
            value={formData.startTime}
            onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
          />
        </div>

        <div>
          <h1 className="text-sm ">Duration</h1>
          <div className="grid grid-cols-12 gap-3 py-3 md:space-y-2">
            {durationOptions.map((minutes) => (
              <Button
                key={minutes}
                radius="sm"
                variant={formData.duration === minutes && !formData.customDuration ? "solid" : "bordered"}
                className={`md:col-span-3 col-span-12 ${formData.duration === minutes && !formData.customDuration
                  ? 'bg-[#06574C] text-white border-[#06574C]'
                  : 'border-gray-300 text-gray-700'
                  }`}
                size="md"
                onPress={() => setFormData(prev => ({ ...prev, duration: minutes, customDuration: "" }))}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </div>

        <Input
          radius="sm"
          label="Custom Duration (Minutes)"
          variant="bordered"
          labelPlacement="outside"
          type="number"
          placeholder="Enter Custom Duration"
          value={formData.customDuration}
          onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e.target.value, duration: "" }))}
        />

        <div className="p-4 bg-[#3F86F212] border-[#3F86F2] border-1 mt-3 rounded-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex flex-row gap-3 items-center">
              <div className="h-15 w-15 bg-white rounded-full shadow-xl items-center flex justify-center">
                <CiVideoOn color="#3F86F2" size={30} />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Meeting Link</h1>
                <p className="text-sm text-[#666666]">
                  Generate a Zoom meeting link automatically
                </p>
              </div>
            </div>
            <Button
              radius="sm"
              variant="solid"
              size="lg"
              className="bg-[#3F86F2] text-white"
              startContent={<FaWandMagicSparkles size={20} />}
              onPress={handleGenerateZoomLink}
              isLoading={loading}
            >
              Auto-Generate
            </Button>
          </div>
          <div className="my-3 border-[#3F86F2] border-1 rounded-md p-3 mt-3 bg-white">
            <Input
              radius="sm"
              label="Meeting URL"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Click Auto-Generate to create Zoom link"
              value={formData.meetingLink}
              readOnly
              endContent={
                <Button
                  isIconOnly
                  radius="sm"
                  className="bg-[#95C4BE33]"
                  onPress={copyToClipboard}
                  isDisabled={!formData.meetingLink}
                >
                  <MdContentCopy color="#06574C" size={20} />
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md mb-3">
        <h1 className="text-xl font-semibold">Additional Settings</h1>
        <div className="py-3">
          <CheckboxGroup>
            <Checkbox
              color="success"
              size="sm"
              isSelected={settings.recordSession}
              onValueChange={(val) => setSettings(prev => ({ ...prev, recordSession: val }))}
            >
              Record session automatically
            </Checkbox>
            <Checkbox
              color="success"
              size="sm"
              isSelected={settings.sendEmail}
              onValueChange={(val) => setSettings(prev => ({ ...prev, sendEmail: val }))}
            >
              Send email notification to students
            </Checkbox>
            <Checkbox
              color="success"
              size="sm"
              isSelected={settings.allowEarlyJoin}
              onValueChange={(val) => setSettings(prev => ({ ...prev, allowEarlyJoin: val }))}
            >
              Allow students to join before host
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div className="py-3">
          <Textarea
            label="Class Description (Optional)"
            labelPlacement="outside"
            placeholder="Add any additional information or instructions for students..."
            variant="bordered"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>

      <div className="p-3 my-5 flex flex-col md:flex-row md:justify-end gap-3">
        <Button
          variant="bordered"
          size="lg"
          radius="sm"
          color="success"
          startContent={<IoIosSave size={20} />}
          onPress={() => toast.success("Draft saved!")}
        >
          Save Draft
        </Button>
        <Button
          size="lg"
          radius="sm"
          variant="flat"
          className="bg-[#06574C] text-white"
          onPress={handleScheduleClass}
          isLoading={loading}
        >
          Schedule Class
        </Button>
      </div>
    </div>
  );
};

export default ClassSheduling;

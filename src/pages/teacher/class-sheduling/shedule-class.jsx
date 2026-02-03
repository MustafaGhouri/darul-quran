import React, { useState, useEffect } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Button, Divider, Select, SelectItem, Chip } from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import { Clock } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { RangeCalendar } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatTime12Hour, isClassLive, isClassExpired } from "../../../utils/scheduleHelpers";

const SheduleClass = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "All Status" },
    { key: "upcoming", label: "Upcoming" },
    { key: "live", label: "Live Now" },
    { key: "completed", label: "Completed" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current teacher
      const meRes = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/me`, {
        credentials: 'include'
      });
      const meData = await meRes.json();

      if (meData.user) {
        setCurrentTeacher(meData.user);

        // Fetch schedules for this teacher
        const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/getAll?teacherId=${meData.user.id}`);
        const data = await res.json();

        if (data.success) {
          setSchedules(data.schedules || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to cancel this class?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/delete/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Class cancelled successfully");
        fetchData();
      } else {
        toast.error("Failed to cancel class");
      }
    } catch (error) {
      toast.error("Error cancelling class");
    }
  };

  const groupSchedulesByDate = () => {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    schedules.forEach(schedule => {
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      const dateKey = scheduleDate.toDateString();

      // Apply filter
      if (filter !== "all") {
        if (filter === "upcoming" && isClassExpired(schedule)) return;
        if (filter === "live" && !isClassLive(schedule)) return;
        if (filter === "completed" && !isClassExpired(schedule)) return;
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });

    return grouped;
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today, " + date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow, " + date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const groupedSchedules = groupSchedulesByDate();

  if (loading) {
    return (
      <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-screen px-2 sm:px-3">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06574C]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 min-h-screen px-2 sm:px-3 pb-20">
      <DashHeading
        title={"Scheduled Classes"}
        desc={`You have ${schedules.length} classes scheduled`}
      />

      <div className="grid grid-cols-12 gap-3 items-start justify-between mb-3 w-full">
        <div className="col-span-12 md:col-span-8 ">
          {Object.keys(groupedSchedules).length === 0 ? (
            <div className="bg-white p-8 rounded-md text-center">
              <p className="text-gray-500">No classes scheduled</p>
              <Button
                className="mt-4 bg-[#06574C] text-white"
                radius="sm"
                onPress={() => navigate("/teacher/class-scheduling")}
              >
                Schedule a Class
              </Button>
            </div>
          ) : (
            Object.keys(groupedSchedules).sort((a, b) => new Date(a) - new Date(b)).map((dateKey) => (
              <div key={dateKey} className="mb-6">
                <h2 className="text-lg font-semibold text-[#06574C] mb-3">
                  {getDateLabel(dateKey)}
                </h2>

                {groupedSchedules[dateKey].map((item) => {
                  const live = isClassLive(item);
                  const expired = isClassExpired(item);

                  return (
                    <div key={item.id} className="bg-white p-3 rounded-md mb-3">
                      <div className="flex flex-col md:flex-row gap-3 ">
                        <Chip
                          size="sm"
                          className="bg-[#E8F1FF] text-[#3F86F2]"
                          radius="sm"
                        >
                          Live Zoom
                        </Chip>
                        {item.courseName && (
                          <Chip
                            size="sm"
                            className="bg-[#95C4BE33] text-[#06574C]"
                            radius="sm"
                          >
                            {item.courseName}
                          </Chip>
                        )}
                        <Chip
                          size="sm"
                          variant="flat"
                          color={expired ? "default" : live ? "success" : "warning"}
                        >
                          {expired ? "Completed" : live ? "Live Now" : "Upcoming"}
                        </Chip>
                      </div>

                      <div className="py-3">
                        <h1 className="text-xl font-bold">{item.title}</h1>
                        <p className="text-[#666666] text-sm">{item.description || "No description provided"}</p>
                        <div className="flex flex-row gap-4 my-3">
                          <div className="flex flex-row gap-1 items-center">
                            <CiCalendar color="#666666" size={22} />
                            <p className="text-[#666666] text-sm">{new Date(item.date).toDateString()}</p>
                          </div>
                          <div className="flex flex-row gap-1 items-center">
                            <Clock color="#666666" size={19} />
                            <p className="text-[#666666] text-sm">
                              {formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}
                            </p>
                          </div>
                        </div>
                        <Divider className="mt-6 mb-3" />

                        <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                          <div className="flex gap-3 items-center">
                            <div className="h-15 w-15 flex items-center justify-center bg-[#95C4BE33] rounded-full">
                              <FaRegAddressCard color="#06574C" size={30} />
                            </div>
                            <div>
                              <h1 className="text-md font-bold text-[#666666]">
                                {currentTeacher?.firstName} {currentTeacher?.lastName}
                              </h1>
                              <p className="text-xs text-gray-500">Instructor</p>
                            </div>
                          </div>

                          <div className="flex gap-3 items-center flex-wrap">
                            <Button
                              radius="sm"
                              size="md"
                              variant="bordered"
                              color="danger"
                              className="text-[#E8505B]"
                              onPress={() => handleDelete(item.id)}
                            >
                              Cancel Class
                            </Button>

                            {expired ? (
                              <Button
                                radius="sm"
                                size="md"
                                variant="solid"
                                className="bg-gray-400 text-white"
                                isDisabled
                              >
                                Completed
                              </Button>
                            ) : live && item.meetingLink ? (
                              <Button
                                radius="sm"
                                size="md"
                                variant="solid"
                                className="bg-green-600 text-white"
                                startContent={<LuSquareArrowOutUpRight size={20} />}
                                as="a"
                                href={item.meetingLink}
                                target="_blank"
                              >
                                Start Class
                              </Button>
                            ) : item.meetingLink ? (
                              <Button
                                radius="sm"
                                size="md"
                                variant="solid"
                                className="bg-[#9A9A9A] text-white"
                                isDisabled
                              >
                                Starts Soon
                              </Button>
                            ) : (
                              <Button
                                radius="sm"
                                size="md"
                                variant="bordered"
                                className="text-orange-600"
                              >
                                No Zoom Link
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="col-span-12 md:col-span-4 bg-white p-3 rounded-md space-y-4">
          <Button
            size="md"
            variant="solid"
            className="bg-[#06574C] text-white w-full"
            onPress={() => navigate("/teacher/class-scheduling")}
          >
            Schedule New Class
          </Button>

          <div className="w-full flex justify-center">
            <style>{`
              [data-selection-start="true"] {
                background-color: #8FC9C3 !important;
                color: white !important;
                border-radius: 9999px !important;
              }
              [data-selection-end="true"] {
                background-color: #F04D23 !important;
                color: white !important;
                border-radius: 9999px !important;
              }
              [data-range-selection="true"]{
                color: #06574C !important;
              }
            `}</style>
            <RangeCalendar
              showMonthAndYearPickers
              classNames={{
                headerWrapper: "bg-[#FBF4EC] w-full",
                gridHeaderRow: "bg-[#FBF4EC] w-full",
                gridBody: "bg-[#FBF4EC] w-full md:flex md:flex-col md:gap-1.5",
                gridWrapper: "bg-[#FBF4EC] w-full",
                root: "md:w-full",
                cell: "w-auto md:w-full",
                table: "md:w-full",
              }}
              aria-label="Class Calendar"
              className="md:w-full shadow-lg"
              style={{ width: "100%" }}
            />
          </div>

          <Select
            color="success"
            size="sm"
            label="Filter"
            className="w-full"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {filters.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <h1 className="text-[#666666] font-medium">Class Type</h1>
          <div className="flex flex-row gap-2 items-center">
            <Button size="sm" radius="sm" className="bg-[#06574C] text-white">
              Live Zoom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheduleClass;

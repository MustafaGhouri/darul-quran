import {
  Button,
  Progress,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Form,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  BookIcon,
  ChartPie,
  Clock,
  Edit,
  LucideClock4,
  MapPin,
  MegaphoneIcon,
  PlusIcon,
  UsersIcon,
  UsersRound,
  UserStar,
  Video,
  Check,
} from "lucide-react";
import OverviewCards from "../../components/dashboard-components/OverviewCards";
import {
  AiOutlineBook,
  AiOutlineEye,
  AiOutlineLineChart,
} from "react-icons/ai";
import { LuClock4 } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { GrAnnounce, GrAttachment, GrClose, GrSend } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { formatTime12Hour, isClassLive, isClassExpired } from "../../utils/scheduleHelpers";
const TeachersDashboard = () => {
  const cardsData = [
    {
      title: "Total Courses ",
      value: "12,847",
      icon: <AiOutlineBook color="#06574C" size={22} />,
      changeText: "Active",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Attendance Rate",
      value: "92%",
      icon: <AiOutlineLineChart color="#06574C" size={22} />,
      changeText: "+8.2% from last month",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Total Students",
      value: "3,847",
      icon: <UsersRound color="#06574C" size={22} />,
      changeText: "-2.1% from last week",
      changeColor: "text-[#E8505B]",
    },
    {
      title: "Total Hours",
      value: "24",
      icon: <LuClock4 color="#06574C" size={22} />,
      changeText: " +8.2% from last month",
      changeColor: "text-[#06574C]",
    },
  ];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const courseCard = [
    {
      id: 1,
      Status: "Active",
      course: "Advanced Web Development",
      students: "32",
      role: "Student",
      time: "Nov 11, 10:00 AM",
      value: 70,
    },
    {
      id: 2,
      Status: "Active",
      course: "Advanced Web Development",
      students: "32",
      role: "Student",
      time: "Nov 11, 10:00 AM",
      value: 70,
    },
    {
      id: 3,
      Status: "Active",
      course: "Advanced Web Development",
      students: "32",
      role: "Student",
      time: "Nov 11, 10:00 AM",
      value: 70,
    },
  ];

  /* Dynamic Classes Fetching */
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // 1. Get Current User Info (Session Cookie based)
        const meRes = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/me`, {
          credentials: 'include'
        });
        const meData = await meRes.json();

        if (meData.user) {
          // 2. Fetch Schedules for this Teacher
          const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/getAll?teacherId=${meData.user.id}`);
          const data = await res.json();
          if (data.success) {
            // Filter for future/today
            const future = data.schedules.filter(s => new Date(s.date) >= new Date().setHours(0, 0, 0, 0));
            setUpcomingClasses(future.slice(0, 5)); // Show top 5
          }
        }
      } catch (e) { console.error("Failed to load classes", e); }
    };
    fetchClasses();
  }, []);
  const [placement, setPlacement] = useState("left");

  const handleOpen = (placement) => {
    setPlacement(placement);
    onOpen();
  };
  const courses = [
    { key: "WebDevelopment", label: "Web Development" },
    { key: "React", label: "React js" },
    { key: "Next js", label: "Next js" },
  ];

  const announcements = [
    {
      id: 1,
      title: "Important Update",
      description:
        "The deadline for Assignment 3 has been extended to Friday, 5 PM. Make sure to submit your work before the new deadline.",
      time: "2 hours ago",
      course: "Web Development 101",
      students: "42 students",
      icone: <GrAnnounce color="#D28E3D" size={22} />,
    },
    {
      id: 2,
      title: "Upcoming Event",
      description:
        "Guest lecture on Advanced React Patterns scheduled for next Monday at 3 PM. Don't miss this opportunity!",
      time: "2 hours ago",
      course: "Web Development 101",
      students: "42 students",
      icone: <CiCalendar color="#D28E3D" size={22} />,
    },
    {
      id: 3,
      title: "Reminder",
      description:
        "Mid-term exam preparation sessions will be held every Tuesday and Thursday at 4 PM in Room 301.",
      time: "2 hours ago",
      course: "Web Development 101",
      students: "42 students",
      icone: <IoAlertCircleOutline color="#D28E3D" size={22} />,
    },
    {
      id: 4,
      title: "Reminder",
      description:
        "The deadline for Assignment 3 has been extended to Friday, 5 PM. Make sure to submit your work before the new deadline.",
      time: "2 hours ago",
      course: "Web Development 101",
      students: "42 students",
      icone: <IoAlertCircleOutline color="#D28E3D" size={22} />,
    },
  ];

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      {/* banner */}
      <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <h1 className="text-xl sm:text-3xl text-white font-semibold ">
          Upload your class materials 24 hours before the <br /> session to give
          students time to prepare. <br />
        </h1>
        <Button size="sm" className="bg-[#06574C] text-white rounded-md">
          Learn More
        </Button>
      </div>

      <OverviewCards data={cardsData} />

      <div>
        <div className="grid grid-cols-12 gap-3 pb-4">
          {courseCard.map((item, index) => (
            <div className="col-span-12 md:col-span-6 lg:col-span-4 ">
              <div className="w-full bg-white rounded-lg">
                <div className="bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)]  rounded-lg p-3 ">
                  <Button
                    size="sm"
                    radius="sm"
                    className="bg-white text-[#06574C] px-4"
                  >
                    {item.Status}
                  </Button>
                  <div className="">
                    <span className=" flex justify-center items-center py-6 text-2xl font-semibold ">
                      {item.course}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center ">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#95C4BE33] flex items-center justify-center text-white font-bold text-sm  shrink-0">
                        <RiGroupLine size={22} color="#06574C" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#06574C] text-lg leading-tight">
                          {item.students}
                        </p>
                        <p className="text-sm text-[#666666]">{item.role}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="font-semibold text-black text-sm leading-tight">
                        Next Class
                      </p>
                      <p className="text-sm text-[#666666]">{item.time}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-[#6B7280]">
                      <span>Progress</span>
                      <span>{item.value}%</span>
                    </div>
                    <Progress
                      color="success"
                      value={item.value}
                      size="sm"
                    ></Progress>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      className="bg-[#06574C] text-white rounded-md w-full mt-2"
                      startContent={<AiOutlineEye size={22} />}
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className=" bg-white rounded-lg mb-3 ">
        <h1 className="p-3 text-xl text-[#333333]">Upcoming Classes</h1>
        <div className="flex flex-col gap-3">
          {upcomingClasses.length === 0 ? (
            <div className="p-4 text-gray-500 text-center bg-[#F5E3DA]/20 rounded-lg">
              No upcoming classes found.
            </div>
          ) : upcomingClasses.map((item, index) => {
            const dateObj = new Date(item.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('default', { month: 'short' });
            return (
              <div
                key={item.id}
                className={`${item.meetingLink ? "bg-[#EAF3F2]" : "bg-[#F5E3DA]"
                  } rounded-md`}
              >
                <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                    <div className="h-20 w-20 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                      <p className="text-xl text-[#06574C] font-semibold">
                        {day}
                      </p>
                      <p className="text-sm text-[#06574C] font-semibold">
                        {month}
                      </p>
                    </div>
                    <div>
                      <div className="text-lg text-[#06574C] font-semibold">
                        {item.title}
                      </div>
                      <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                        <div className="flex items-center gap-1 ">
                          <Clock size={20} />
                          {formatTime12Hour(item.startTime)} - {formatTime12Hour(item.endTime)}
                        </div>
                        <div className="flex items-center gap-1 ">
                          <Video size={20} />
                          {item.meetingLink ? "Online (Zoom)" : "Pending"}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-white text-[#06574C]">
                          {item.courseName || "General Class"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const live = isClassLive(item);
                      const expired = isClassExpired(item);

                      if (expired) {
                        return (
                          <Button
                            startContent={<Check size={20} />}
                            size="sm"
                            className="bg-gray-400 w-32 text-white rounded-md"
                            isDisabled
                          >
                            Completed
                          </Button>
                        );
                      } else if (live && item.meetingLink) {
                        return (
                          <Button
                            startContent={<Video size={20} />}
                            size="sm"
                            className="bg-green-600 w-32 text-white rounded-md"
                            as={Link}
                            to={item.meetingLink}
                            target="_blank"
                          >
                            Start Class
                          </Button>
                        );
                      } else if (item.meetingLink) {
                        return (
                          <Button
                            startContent={<Clock size={20} />}
                            size="sm"
                            className="bg-[#06574C] w-32 text-white rounded-md"
                            isDisabled
                          >
                            Locked
                          </Button>
                        );
                      } else {
                        return (
                          <Button
                            startContent={<AiOutlineEye size={22} />}
                            size="sm"
                            className="bg-[#06574C] w-32 text-white rounded-md"
                          >
                            Details
                          </Button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="px-3 sm:px-6 py-4 rounded-lg bg-white my-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["left"].map((placement) => (
            <Button
              radius="sm"
              key={placement}
              variant="solid"
              color="primary"
              startContent={<PlusIcon />}
              className="w-full py-4 bg-[#06574C] text-white"
              onPress={() => handleOpen(placement)}
            >
              New Announcement
            </Button>
          ))}
          <Button
            radius="sm"
            variant="solid"
            color="primary"
            startContent={<PlusIcon />}
            className="w-full py-4 bg-[#06574C] text-white"
            as={Link}
            to="/teacher/class-scheduling"
          >
            Shedule New Class
          </Button>
          <Button
            radius="sm"
            variant="flat"
            startContent={<PlusIcon />}
            className="w-full py-4 bg-[#06574C] text-white font-semibold"
          >
            Create Quiz
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          placement={placement}
          backdrop={"blur"}
          size={"sm"}
          onOpenChange={onOpenChange}
          className="no-scrollbar overflow-hidden"
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1 ">
                  Announcements
                  <Button className="bg-[#06574C] text-white">
                    New Announcement
                  </Button>
                </DrawerHeader>
                <DrawerBody className="!px-0">
                  <Form className="bg-[#95C4BE47] p-3">
                    <Select
                      radius="sm"
                      label="Select Course"
                      name="Course"
                      variant="bordered"
                      defaultSelectedKeys={"React"}
                      labelPlacement="outside"
                      placeholder="Select Course"
                    >
                      {courses.map((item, index) => (
                        <SelectItem key={index}>{item.label}</SelectItem>
                      ))}
                    </Select>
                  </Form>
                  <div className="overflow-y-scroll no-scrollbar">
                    {announcements.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-md my-2 group hover:bg-[#FBF4EC] border-[#D28E3D] border-1 m-3 cursor-pointer"
                      >
                        <div className="flex gap-3 itmes-center">
                          <div className="h-10 w-10 flex justify-center items-center group-hover:bg-white bg-[#FBF4EC] rounded-full shadow-xl">
                            {item.icone}
                          </div>
                          <div>
                            <h1 className="text-sm font-bold group-hover:text-[#D28E3D]">
                              {item.title}
                            </h1>
                            <p className="text-[#666666] text-xs">
                              {item.time}
                            </p>
                          </div>
                        </div>
                        <div className="my-2">
                          <p className="text-[#B7721F] text-xs">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                          <p className="text-xs text-[#B7721f]">
                            {item.course}
                          </p>
                          <div className="text-xs flex gap-1 items-center text-[#B7721f]">
                            <RiGroupLine size={14} />
                            {item.students}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DrawerBody>
                <DrawerFooter className="rounded-xl">
                  <div className="relative w-full no-scrollbar">
                    <Textarea
                      classNames={{ base: "rounded-xl" }}
                      variant="bordered"
                      radius="sm"
                      className="shadow-xl"
                      placeholder="Write your announcement..."
                      startContent={
                        <GrAttachment
                          className="absolute bottom-3 left-2 cursor-pointer"
                          size={20}
                          onClick={handleAttachmentClick}
                        />
                      }
                      endContent={
                        <div className="p-2 bg-[#06574C] rounded-md absolute right-2 bottom-1 cursor-pointer">
                          <GrSend color="white" size={16} />
                        </div>
                      }
                    />

                    {/* Preview Overlay */}
                    {files.length > 0 && (
                      <div className="absolute inset-0 top-[-8px]  rounded-xl p-3 flex gap-3 no-scrollbar overflow-hidden z-10 aspect-3/1">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="relative min-w-[80px] h-[40px] rounded-lg border flex items-center justify-center"
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-xs text-center px-1">
                                {file.name}
                              </span>
                            )}

                            <GrClose
                              size={12}
                              className="absolute top-1 right-1 cursor-pointer"
                              onClick={() => removeFile(index)}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
export default TeachersDashboard;

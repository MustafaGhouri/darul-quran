import { Button, Chip, Input, Tab, Tabs } from "@heroui/react";
import {
  Clock,
  Download,
  MapPin,
  Plus,
  Search,
  UsersRound,
  Video,
} from "lucide-react";
import { AiOutlineBook, AiOutlineLineChart } from "react-icons/ai";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { RiDeleteBin6Line, RiGroupLine } from "react-icons/ri";
import { IoBulbOutline } from "react-icons/io5";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { PiFilePdfDuotone } from "react-icons/pi";
import { FaClipboardList, FaRegLightbulb } from "react-icons/fa";
import { TbListCheck } from "react-icons/tb";

const MyCourses = () => {
  const cardsData = [
    {
      title: "Total Courses ",
      value: "24",
      icon: <AiOutlineBook color="#06574C" size={22} />,
      changeText: "8%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Avg. Attendance",
      value: "87%",
      icon: <AiOutlineLineChart color="#06574C" size={22} />,
      changeText: "5%",
      changeColor: "text-[#38A100]",
    },
    {
      title: "Total Students",
      value: "3,847",
      icon: <UsersRound color="#06574C" size={22} />,
      changeText: "12%",
      changeColor: "text-[#E8505B]",
    },
    {
      title: "Active Quizzes",
      value: "24",
      icon: <IoBulbOutline color="#06574C" size={22} />,
      changeText: "-0%",
      changeColor: "text-[#9A9A9A]",
    },
  ];
  const coursesonline = [
    {
      id: 1,
      name: "Duration",
      title: "14 Weeks",
    },
    {
      id: 1,
      name: "Shedule",
      title: "Mon, Wed, Fri • 10:00 AM",
    },
    {
      id: 1,
      name: "Progress",
      title: "Week 9 of 14 (68%)",
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      day: "11",
      month: "Nov",
      size: "2.4 MB",
      pages: "8 pages",
      Title: "HTML Cheat Sheet",
      course: "Python",
      location: "Join Zoom",
      icone: <PiFilePdfDuotone color="#06574C" size={30} />,
    },
    {
      id: 2,
      day: "11",
      month: "Nov",
      Title: "Build Your First Webpage",
      due: "7 days after enrollment",
      course: "Python",
      icone: <FaClipboardList color="#06574C" size={30} />,
    },
    {
      id: 3,
      day: "11",
      month: "Nov",
      time: "15 Minutes",
      Title: "HTML Basics Quiz",
      students: "32",
      role: "Student",
      status: "Online",
      course: "Python",
      location: "Join Zoom",
      icone: <FaRegLightbulb color="#06574C" size={30} />,
      quizs: "10 Questions",
      Passing: "70%",
    },
  ];

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      {/* banner */}
      {/* <div className="space-y-4 mt-3 w-full bg-[url('/images/banner.png')] p-4 rounded-lg bg-center bg-no-repeat bg-cover">
        <h1 className="text-xl sm:text-3xl text-white font-semibold ">
          Upload your class materials 24 hours before the <br /> session to give
          students title to prepare. <br />
        </h1>
        <Button size="sm" className="bg-[#06574C] text-white rounded-md">
          Learn More
        </Button>
      </div> */}
      <div className="md:flex md:justify-between md:items-center max-md:pb-3 ">
        <div className="flex flex-wrap items-start">
          <DashHeading
            title={"Advanced Web Development"}
            desc={"32 Students Enrolled"}
          />
          <p className="bg-white text-[#06574C] mt-8 py-1.5 text-xs  rounded-md text-center font-semibold w-20 max-md:absolute max-md:top-1/10 max-md:left-3/4">
            Active
          </p>
        </div>
        <Button
          className="bg-[#1570E8] text-white max-md:w-full"
          size="lg"
          radius="sm"
          startContent={<LuSquareArrowOutUpRight size={20} color="white" />}
        >
          Join Zoom
        </Button>
      </div>

      <div className="pb-4 gap-5  overflow-x-auto grid grid-cols-1 sm:grid-cols-4">
        {cardsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#F1E0D9] sm:bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4"
          >
            <h1 className="font-semibold text-[#333333]">{item.title}</h1>

            <div className="flex items-center gap-2 justify-start">
              <div className="rounded-full p-3 bg-[#95C4BE]/20">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className={`${item.changeColor} text-sm`}>
                  {item.changeText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg mb-3 p-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Course Outline</h1>
          <Button
            variant="bordered"
            color="#06574C"
            className="  text-[#06574C]"
            size="sm"
            radius="sm"
            startContent={<LuSquareArrowOutUpRight size={18} color="#06574C" />}
          >
            Edit
          </Button>
        </div>
        <div className="py-3">
          <div className="flex justify-between items-center">
            {coursesonline.map((item, index) => (
              <div key={index} className="flex justify-between  w-full">
                <div className="w-full flex flex-col ">
                  <p className="text-[#666666] text-sm">{item.name}</p>
                  <p className="text-md font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-[#666666] text-sm">Description</p>
            <span className=" text-md">
              This course covers modern web development technologies including
              HTML5, CSS3, JavaScript ES6+, React, Node.js, and database
              integration. Students will build full-stack web applications and
              learn industry best practices.
            </span>
          </div>
        </div>
      </div>
      <div className=" bg-white rounded-lg mb-3 ">
        {/* <h1 className="p-3 text-xl text-[#333333]">Upcoming Classes</h1> */}
        <div className="flex w-full flex-col p-2">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#06574C]",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-[#06574C] group-data-[selected=true]:font-bold",
            }}
            color="primary"
            variant="underlined"
          >
            <Tab
              key="photos"
              title={
                <div className="flex items-center space-x-2">
                  <span>Materials</span>
                </div>
              }
            />
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>Quizzes</span>
                </div>
              }
            />
            <Tab
              key="videos"
              title={
                <div className="flex items-center space-x-2">
                  <span>Student</span>
                </div>
              }
            />
            <Tab
              key="Attendance"
              title={
                <div className="flex items-center space-x-2">
                  <span>Attendance</span>
                </div>
              }
            />
          </Tabs>
        </div>
        <div className="p-3 flex justify-between items-center ">
          <div>
            <Input
              className="w-100"
              size="md"
              radius="sm"
              placeholder="Search Cources..."
              endContent={<Search />}
            />
          </div>
          <div>
            <Button
              size="md"
              radius="sm"
              startContent={<Plus size={18} />}
              className="bg-[#06574C] text-white"
            >
              Upload Materials
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingClasses.map((item, index) => (
            <div
              className={`${
                item.location === "Join Zoom" ? "bg-[#EAF3F2]" : "bg-[#F5E3DA]"
              } `}
            >
              <div className="flex flex-col md:flex-row gap-4 md:justify-between p-4 md:items-center">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-center">
                  <div className="h-15 w-15 rounded-full shadow-xl flex flex-col items-center justify-center bg-white">
                    {item.icone}
                  </div>
                  <div>
                    <div className="text-lg text-[#06574C] font-semibold">
                      {item.Title}
                    </div>
                    {item.Title === "HTML Basics Quiz" ? (
                      <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                        <div className="flex items-center gap-1 ">
                          <TbListCheck size={20} />
                          {item.quizs}
                        </div>
                        <div className="flex items-center gap-1 ">
                          <Clock size={16} />
                          {item.time}
                        </div>
                        <div className="flex items-center gap-1 ">
                          <p className="text-xs text-[#06574C] p-2 bg-white rounded-md">
                            Passing: {item.Passing}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap max-md:my-3 md:items-center mb-2 gap-5 text-sm text-[#666666]">
                        {item.Title === "HTML Cheat Sheet" ? (
                          <div className="flex items-center gap-3">
                            <p>{item.size}</p>
                            <p>{item.pages}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <p>Due:</p>
                            <p>{item.due}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="items-center flex justify-between gap-3">
                  <Button
                    startContent={<Download size={18} color="#06574C" />}
                    size="md"
                    radius="sm"
                    variant="bordered"
                    color="#06574C"
                    className=" text-[#06574C]"
                  >
                    Download
                  </Button>
                  <Button
                    isIconOnly
                    className="bg-white"
                    startContent={
                      <LuSquareArrowOutUpRight size={18} color="#06574C" />
                    }
                  />
                  <Button
                    isIconOnly
                    className="bg-[#FFEAEC]"
                    startContent={
                      <RiDeleteBin6Line size={18} color="#E8505B" />
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

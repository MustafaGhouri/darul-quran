import React from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Button, Divider, Select, SelectItem } from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import { Clock } from "lucide-react";
import { FaRegAddressCard } from "react-icons/fa";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { RangeCalendar } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { filter } from "framer-motion/client";
const StudentClassSheduling = () => {
  const SheduledClass = [
    {
      id: 1,
      title: "Advanced React Hooks & State Management",
      desc: "Learn how to effectively use React Hooks and manage complex state in your applications with practical examples.",
      time: "10:00 AM - 11:30 AM",
      day: "Today, Jan 15",
      classRoom: "Classroom 1",
      name: "Sarah Johnson",
      coursename: "Javascript",
    },
    {
      id: 2,
      title: "Advanced React Hooks & State Management",
      desc: "Learn how to effectively use React Hooks and manage complex state in your applications with practical examples.",
      time: "10:00 AM - 11:30 AM",
      day: "Today, Jan 15",
      classRoom: "Classroom 1",
      name: "Sarah Johnson",
      coursename: "Javascript",
    },
  ];
  const filters = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"Today, January 15"}
        desc={"You have 3 classes scheduled today"}
      />
      <div className="grid grid-cols-12 gap-3 items-start justify-between mb-3 w-full">
        <div className="col-span-12 md:col-span-8 ">
          {SheduledClass.map((item, index) => (
            <div className="bg-white p-3 rounded-md mb-3">
              <div className="flex flex-col md:flex-row gap-3 ">
                <Button
                  size="sm"
                  className="bg-[#E8F1FF] text-[#3F86F2]"
                  radius="sm"
                >
                  Live Zoom
                </Button>
                <Button
                  size="sm"
                  className="bg-[#95C4BE33] text-[#06574C]"
                  radius="sm"
                >
                  {item.coursename}
                </Button>
              </div>
              <div className="py-3">
                <h1 className="text-xl font-bold">{item.title}</h1>
                <p className="text-[#666666] text-sm">{item.desc}</p>
                <div className="flex flex-row gap-4 my-3">
                  <div className="flex flex-row gap-1 items-center">
                    <CiCalendar color="#666666" size={22} />
                    <p className="text-[#666666] text-sm">{item.day}</p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <Clock color="#666666" size={19} />
                    <p className="text-[#666666] text-sm">{item.time}</p>
                  </div>
                </div>
                <Divider className="mt-6 mb-3" />
                <div className="  border-t-default-400 flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                  <div className="flex gap-3 items-center">
                    <div className="h-15 w-15 flex items-center justify-center bg-[#95C4BE33] rounded-full">
                      <FaRegAddressCard color="#06574C" size={30} />
                    </div>
                    <div>
                      <h1 className="text-md font-bold text-[#666666]">
                        {item.name}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Button
                      radius="sm"
                      size="md"
                      variant="bordered"
                      color="danger"
                      className="text-[#E8505B]"
                    >
                      Cancel Class
                    </Button>
                    <Button
                      radius="sm"
                      size="md"
                      variant="bordered"
                      color="success"
                    >
                      Reschedule
                    </Button>
                    <Button
                      radius="sm"
                      size="md"
                      variant="solid"
                      className="bg-[#1570E8] text-white"
                      startContent={<LuSquareArrowOutUpRight size={20} />}
                    >
                      Join Zoom
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className=" col-span-12 md:col-span-4 bg-white p-3 rounded-md space-y-4">
          <Button
            size="md"
            variant="solid"
            className="bg-[#06574C] text-white w-full"
          >
            Shedule
          </Button>
          <div className=" w-full flex justify-center ">
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
              aria-label="Date (Read Only)"
              className="md:w-full shadow-lg"
              style={{ width: "100%" }}
            />
          </div>
          <Select
            //   variant="solid"
            color="success"
            size="sm"
            label="Filter"
            className="w-full "
          >
            {filters.map((item, index) => (
              <SelectItem key={index} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <h1 className="text-[#666666] font-medium">Class Type</h1>
          <div className=" flex flex-row gap-2 items-center">
            <Button size="sm" radius="sm" className="bg-[#06574C] text-white">
              Live Zoom
            </Button>
            <p>Video Lesson</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 ">
          <DashHeading title={"Tomorrow, January 16"} />
        </div>
        {SheduledClass.map((item, index) => (
          <div className="col-span-12 md:col-span-8 ">
            <div className="bg-white p-3 rounded-md mb-3">
              <div className="flex flex-col md:flex-row gap-3 ">
                <Button
                  size="sm"
                  className="bg-[#E8F1FF] text-[#3F86F2]"
                  radius="sm"
                >
                  Live Zoom
                </Button>
                <Button
                  size="sm"
                  className="bg-[#95C4BE33] text-[#06574C]"
                  radius="sm"
                >
                  {item.coursename}
                </Button>
              </div>
              <div className="py-3">
                <h1 className="text-xl font-bold">{item.title}</h1>
                <p className="text-[#666666] text-sm">{item.desc}</p>
                <div className="flex flex-col md:flex-row gap-4 my-3">
                  <div className="flex flex-col md:flex-row gap-1 items-center">
                    <CiCalendar color="#666666" size={22} />
                    <p className="text-[#666666] text-sm">{item.day}</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-1 items-center">
                    <Clock color="#666666" size={19} />
                    <p className="text-[#666666] text-sm">{item.time}</p>
                  </div>
                </div>
                <Divider className="mt-6 mb-3" />
                <div className="  border-t-default-400 flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                  <div className="flex gap-3 items-center">
                    <div className="h-15 w-15 flex items-center justify-center bg-[#95C4BE33] rounded-full">
                      <FaRegAddressCard color="#06574C" size={30} />
                    </div>
                    <div>
                      <h1 className="text-md font-bold text-[#666666]">
                        {item.name}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Button
                      radius="sm"
                      size="md"
                      variant="bordered"
                      color="danger"
                      className="text-[#E8505B]"
                    >
                      Cancel Class
                    </Button>
                    <Button
                      radius="sm"
                      size="md"
                      variant="bordered"
                      color="success"
                    >
                      Reschedule
                    </Button>
                    <Button
                      radius="sm"
                      size="md"
                      variant="solid"
                      className="bg-[#1570E8] text-white"
                      startContent={<LuSquareArrowOutUpRight size={20} />}
                    >
                      Join Zoom
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClassSheduling;

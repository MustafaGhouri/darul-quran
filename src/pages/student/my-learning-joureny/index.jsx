import React from "react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { FaUserGraduate } from "react-icons/fa";
import { Button, Progress } from "@heroui/react";
const MyLearning = () => {
  const progresscard = [
    {
      id: 1,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "Completed",
    },
    {
      id: 2,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "Active",
    },
    {
      id: 3,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "In Progress",
    },
    {
      id: 5,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "In Progress",
    },
    {
      id: 6,
      title: "Advanced Web Development",
      desc:"HTML, CSS & JavaScript basics",
      progress: "75%",
      status: "In Progress",
    },
  ]
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"My Learning Journey"}
        desc={"See & continue your learning journey"}
      />
      <div
        className="p-4 rounded-xl mb-3 "
        style={{ backgroundImage: "url(/images/student-banner.png)" }}
      >
        <div className=" p-3 bg-white rounded-lg">
          <div className="flex gap-3 flex-col md:flex-row items-center">
            <div className="h-15 w-15 rounded-full bg-[#FBF4EC] flex justify-center items-center">
              <FaUserGraduate size={30} color="#D28E3D" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold ">Sarah Mitchell</h1>
              <div className="flex gap-3 items-center mt-1">
                <p className="text-xs text-[#06574C] bg-[#95C4BE33] w-20 py-2 rounded-lg text-center">
                  Level 3
                </p>
                <p className="text-xs text-[#D28E3D] bg-[#FBF4EC] w-25 py-2 rounded-lg text-center">
                  68% Complete
                </p>
              </div>
            </div>
          </div>
          <p className="text-md my-3">
            Track your learning journey and unlock new achievements as you
            progress.
          </p>
          <Progress
            classNames={{ indicator: "bg-[#06574C]" }}
            showValueLabel
            className="mt-3"
            label="Overall Progress"
            size="sm"
            value={70}
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 mt-3">
          <Button
          size="md"
          radius="sm"
          className="w-full bg-[#06574C] text-white "
          >
            Joureny Overview
          </Button>
          <Button
          size="md"
          radius="sm"
          color="success"
          variant="bordered"
          className="w-full bg-white "
          >
            Recordings
          </Button>
          <Button
          size="md"
          radius="sm"
          color="success"
          variant="bordered"
          className="w-full bg-white "
          >
            Session History
          </Button>
        </div>
      </div>
      <div className="p-6 bg-white mb-3 rounded-lg">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold">Level 3</p>
            <p className="text-xs text-center py-1 w-24 rounded-md bg-[#95C4BE33] text-[#06574C]">Current Level</p>
          </div>
          <p className="py-3 text-sm text-[#333333]">Currently on Level 3 of 6 - Master the fundamentals</p>
          <div>
            <Progress
              classNames={{ indicator: "bg-[#06574C]" }}
              showValueLabel
              label="Level Progress"
              size="sm"
              value={50}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-3">
          {progresscard.map((item, index) => 
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)] rounded-lg p-3 w-full border-1 border-[#B3B3B333] ">
            <p className="bg-white text-[#06574C] text-center text-sm py-1 w-24 rounded-md">{item.status}</p>
            <div className="my-3">
              <p className="text-xl text-[#333333] font-semibold">{item.title}</p>
              <p className="text-sm text-[#333333]">{item.desc}</p>
            </div>
            <div>
              <Progress
                classNames={{ indicator: "bg-[#06574C]" }}
                showValueLabel
                label="Progress"
                size="sm"
                value={70}
              />
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;

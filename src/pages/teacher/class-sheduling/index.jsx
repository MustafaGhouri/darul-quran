import React from "react";
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
import { IoAlertCircleOutline, IoEyeOutline } from "react-icons/io5";
import { CiCircleAlert, CiVideoOn } from "react-icons/ci";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { GoRocket } from "react-icons/go";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ClassSheduling = () => {
  const courses = [
    { key: "Web Development", label: "Web Development" },
    { key: "React", label: "React js" },
    { key: "Next js", label: "Next js" },
  ];
  const router = useNavigate();
  const checks = [
    { key: "Check 1", label: "Record session automatically" },
    { key: "Check 2", label: "Send email notification to students" },
    { key: "Check 3", label: "Allow students to join before host" },
  ];

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
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
        >
          View Full Calender
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
            label="Select Course"
            name="Course"
            variant="bordered"
            defaultValue="all"
            labelPlacement="outside"
            placeholder="Select Course"
          >
            {courses.map((item, index) => (
              <SelectItem key={index}>{item.label}</SelectItem>
            ))}
          </Select>
          <Input
            className="md:col-span-6 col-span-12"
            radius="sm"
            label="Class Title"
            name="Class Title"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Select Class Title"
          />
          <DatePicker
            className="md:col-span-6 col-span-12"
            radius="sm"
            label="Date"
            name="Date"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Select Date"
            showMonthAndYearPickers
          />
          <TimeInput
            className="md:col-span-6 col-span-12"
            radius="sm"
            variant="bordered"
            labelPlacement="outside"
            label="Start Time"
          />
        </div>
        <div>
          <h1 className="text-sm ">Duration</h1>
          <div className="grid grid-cols-12 gap-3 py-3 md:space-y-2">
            <Button
              radius="sm"
              variant="bordered"
              className="md:col-span-3 col-span-12"
              size="md"
            >
              30 min
            </Button>
            <Button
              radius="sm"
              variant="bordered"
              className="md:col-span-3 col-span-12"
              size="md"
            >
              45 min
            </Button>
            <Button
              radius="sm"
              variant="bordered"
              className="md:col-span-3 col-span-12"
              size="md"
            >
              60 min
            </Button>
            <Button
              radius="sm"
              variant="bordered"
              className="md:col-span-3 col-span-12"
              size="md"
            >
              90 min
            </Button>
          </div>
        </div>
        <Input
          radius="sm"
          label="Custom Duration (Minutes)"
          name="Custom Duration (Minutes)"
          variant="bordered"
          labelPlacement="outside"
          defaultValue="40"
          type="number"
          placeholder="Enter Custom Duration"
        ></Input>

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
            >
              Auto-Generate
            </Button>
          </div>
          <div className="my-3 border-[#3F86F2] border-1 rounded-md p-3 mt-3 bg-white">
            <Input
              radius="sm"
              label="Meeting URL"
              name="Meeting URL"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Click “Auto-Generate” to create Zoom link"
              endContent={
                <Button isIconOnly radius="sm" className=" bg-[#95C4BE33]">
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
          <CheckboxGroup
          //   defaultValue={["buenos-aires", "london"]}
          >
            {checks.map((item, index) => (
              <Checkbox color="success" size="sm" key={index} value={item.key}>
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
        <div className="py-3">
          <Textarea
            // defaultValue="HeroUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
            label="Class Description (Optional)"
            labelPlacement="outside"
            placeholder="Add any additional information or instructions for students..."
            variant="bordered"
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
                  >
                      Save Draft
                  </Button>
                  <Button
                  size="lg"
                  radius="sm"
                  variant="flat"
                  className="bg-[#06574C] text-white"
                  onPress={(()=>{
                    router("/teacher/class-scheduling/sheduled-class")
                  })}
                  >
                      Schedule Class
                  </Button>
            </div>
    </div>
  );
};

export default ClassSheduling;

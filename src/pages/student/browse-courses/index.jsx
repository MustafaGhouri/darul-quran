import React from "react";
import {
  Button,
  CheckboxGroup,
  Chip,
  Input,
  Select,
  SelectItem,
  useCheckbox,
  VisuallyHidden,
  tv, // ✅ IMPORTANT IMPORT
} from "@heroui/react";

import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { RiGroupLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { Clock } from "lucide-react";
import { FaIdCard } from "react-icons/fa";
import { IoSearchOutline, IoStarSharp } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

const BrowseCourses = () => {
  const courseCard = [
    {
      id: 1,
      Status: "Paid",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      name: "Sarah Johnson",
      role: "Student",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Design",
    },
    {
      id: 2,
      Status: "Free",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      name: "Sarah Johnson",
      role: "Student",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Development",
    },
    {
      id: 3,
      Status: "Free",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      role: "Student",
      name: "Sarah Johnson",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Marketing",
    },
    {
      id: 4,
      Status: "Paid",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      name: "Sarah Johnson",
      role: "Student",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Design",
    },
    {
      id: 5,
      Status: "Free",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      name: "Sarah Johnson",
      role: "Student",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Development",
    },
    {
      id: 6,
      Status: "Free",
      course: "Full Stack Web Development: React, Node.js & MongoDB",
      students: "15,432",
      role: "Student",
      name: "Sarah Johnson",
      time: "30 Minutes",
      price: "$89.99",
      rating: "4.8",
      stacks: "Marketing",
    },
  ];

  const Sort = [
    { key: "a-z", label: "A-Z" },
    { key: "z-a", label: "Z-A" },
    { key: "latest", label: "Latest" },
    { key: "oldest", label: "Oldest" },
    { key: "Most Popular", label: "Most Popular" },
  ];

  const Subscription = [
    { key: "All", label: "All" },
    { key: "Paid", label: "Paid" },
    { key: "Free", label: "Free" },
  ];
  const category = [
    { key: "Design", label: "Design" },
    { key: "Development", label: "Development" },
    { key: "Business", label: "Business" },
    { key: "Marketing", label: "Marketing" },
    { key: "Photography", label: "Photography" },
  ];
  const Difficulty = [
    { key: "Beginner", label: "Beginner" },
    { key: "Intermediate", label: "Intermediate" },
    { key: "Advanced", label: "Advanced" },
  ];
  const Duration = [
    { key: "Design", label: "Design" },
    { key: "Development", label: "Development" },
    { key: "Business", label: "Business" },
    { key: "Marketing", label: "Marketing" },
    { key: "Photography", label: "Photography" },
  ];
  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-scrseen px-2 sm:px-3">
      <DashHeading
        title={"My Learning Journey"}
        desc={"See & continue your learning journey"}
      />

      <div className="bg-white p-3 rounded-lg mb-3">
        <div className="flex flex-col md:flex-row gap-3 items-center w-full">
          <Input
            placeholder="Search for a course"
            size="sm"
            radius="md"
            className="w-[100%]"
            endContent={<IoSearchOutline size={20} color="#06574C" />}
          />
          <div className="flex gap-1 items-center w-fit">
            <span className="text-sm text-nowrap">Sort by:</span>
            <Select
              placeholder="Sort "
              size="sm"
              radius="md"
              className="w-35"
              defaultSelectedKeys={["Most Popular"]}
            >
              {Sort.map((item) => (
                <SelectItem
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Sort "
              size="sm"
              radius="md"
              className="w-20"
              defaultSelectedKeys={["Free"]}
            >
              {Subscription.map((item) => (
                <SelectItem
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex gap-2 items-center ">
            <h1 className="text-lg font-semibold"> Filters</h1>
            <MdKeyboardArrowDown size={22} />
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666]  mt-3">Categories</h1>
            <CheckboxGroup 
             orientation="horizontal" className="gap-2">
              {category.map((item) => (
                <CustomCheckbox
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666]  mt-3">Difficulty Level</h1>
            <CheckboxGroup orientation="horizontal" className="gap-2">
              {Difficulty.map((item) => (
                <CustomCheckbox
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
          <div className="mt-5">
            <h1 className="text-sm font-semibold text-[#666666]  mt-3">Categories</h1>
            <CheckboxGroup orientation="horizontal" className="gap-2">
              {category.map((item) => (
                <CustomCheckbox
                  key={item.key}
                  value={item.key}
                  className="capitalize"
                >
                  {item.label}
                </CustomCheckbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-12 gap-3 pb-4">
          {courseCard.map((item, index) => (
            <div className="col-span-12 md:col-span-6 lg:col-span-4 ">
              <div className="w-full bg-white rounded-lg">
                <div className="bg-[linear-gradient(110.57deg,rgba(241,194,172,0.25)_0.4%,rgba(149,196,190,0.25)_93.82%)]  rounded-lg p-3 ">
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      radius="sm"
                      className="bg-white text-[#06574C] px-4"
                    >
                      {item.Status}
                    </Button>
                    <div className="flex items-center gap-1">
                      <IoStarSharp size={20} color="#FDD835" />
                      <p className="text-[#060606] text-sm font-medium">
                        {item.rating}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <span className=" flex justify-center items-center text-center py-6 text-2xl font-semibold ">
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
                      <p className="font-semibold text-[#D28E3D] text-xl leading-tight">
                        {item.price}
                      </p>
                      <div className="text-sm flex items-center gap-1 text-[#666666]">
                        <FaIdCard size={20} color="#666666" />
                        {item.name}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-[#6B7280]">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock size={20} color="#6B7280" />
                        {item.time}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-[#95C4BE33] text-[#06574C]">
                        {item.stacks}%
                      </span>
                    </div>
                    {/* <Progress
                      color="success"
                      value={item.value}
                      size="sm"
                    ></Progress> */}
                  </div>
                  <div>
                    <Button
                      size="sm"
                      className="bg-[#06574C] text-white rounded-md w-full mt-"
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
    </div>
  );
};

export default BrowseCourses;
const CustomCheckbox = (props) => {
  const checkbox = tv({
    slots: {
      base: "border-0 bg-transparent",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "bg-success text-white rounded-md",
          content: "text-primary-foreground ",
        },
      },
    },
  });

  const { children, isSelected, getBaseProps, getLabelProps, getInputProps } =
    useCheckbox(props);

  const styles = checkbox({ isSelected });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        // startContent={isSelected ? <CheckIcon /> : null}
        variant="faded"
        {...getLabelProps()}
      >
        {children}
      </Chip>
    </label>
  );
};


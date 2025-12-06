import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Chip,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  Switch,
} from "@heroui/react";
import FileDropzone from "../../../components/dashboard-components/dropzone";
import { title } from "framer-motion/client";
import { File, FolderDot, Lightbulb, Rocket, ScrollText, Video } from "lucide-react";
const CourseBuilder = () => {
  const count = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
  ];

  const category = [
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
  ];
  const Duration = [
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "One_Month", label: "One Month", },
    { key: "Yearly", label: "Yearly" },
  ];
  const Difficulty  = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];
  const coursepreview = [
    {title:"Title:", desc :"Untitled Course" },
    {title:"Category:", desc :"No Selected" },
    {title:"Difficulty Level:", desc :"Beginner" },
    {title:"Price:", desc :"Free" },
  ]

  const card =[
    {title:"Videos", count :"10" , icone:<Video size={20} color="#06574C" />},
    {title:"PDFs:", count :"10" , icone:<File size={20} color="#06574C" />},
    {title:"Quizzes", count :"20" , icone:<Lightbulb size={20} color="#06574C" /> },
    {title:"Assignments", count :"15" , icone:<ScrollText size={20} color="#06574C" /> },
  ]

  const accessDuration =[
    { key: "108_days", label: "108 Days", },
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "360_days", label: "360 Days" },
  ]

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 ">
      <DashHeading
        title={"Course Builder"}
        desc={"Create a new course step by step"}
      />
      <div className="flex w-full flex-col my-3">
        <Tabs
          className="w-full inline-block py-2"
          aria-label="Disabled Options"
          classNames={{
            tabList: "bg-white rounded-lg px-2 py-1",
            tab: `
      data-[selected=true]:bg-[#EBD4C9E5] rounded-lg 
      data-[selected=true]:rounded-lg 
      data-[selected=true]:border-b-3 
      data-[selected=true]:border-[#06574C] 
      rounded-none
      px-6 py-4
    `,
            tabContent: `
      group-data-[selected=true]:text-[#06574C]
      text-[#3F3F44]
      font-semibold
      flex items-center gap-3
    `,
          }}
        >
          <Tab
            className="h-20"
            key="photos"
            title={
              <div className="flex gap-3 justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  h-15 w-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">1</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    Basic Information
                  </h1>
                  <h1 className="text-md"> Course details & settings</h1>
                </div>
              </div>
            }
          >
            <Form className="w-full py-4">
              <div className="grid grid-cols-12 gap-2 w-full">
                <div className="bg-white rounded-lg p-4 col-span-8 shadow-xl">
                  <div>
                    <h1 className="text-xl font-medium text-[#333333]">Course Details</h1>
                  </div>
                  <div className="py-4">
                    <Input
                      size="lg"
                      variant="bordered"
                      label="Course Title "
                      labelPlacement="outside"
                      placeholder="Enter course title "
                      className="w-full"
                    />

                    <div className="flex gap-3 items-center pt-4">
                      <Select
                        size="lg"
                        variant="bordered"
                        label="Category"
                        labelPlacement="outside"
                        placeholder="Select category"
                        className="w-full"
                      >
                        {category.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        size="lg"
                        variant="bordered"
                        label="Difficulty Level"
                        labelPlacement="outside"
                        placeholder="Select Difficulty Level"
                        className="w-full"
                      >
                        {Difficulty.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="py-4">
                      <Textarea
                        size="lg"
                        variant="bordered"
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Enter course description"
                      />
                    </div>
                    <Input
                      size="lg"
                      variant="bordered"
                      label="Course Price ($)"
                      labelPlacement="outside"
                      placeholder="$  0.00"
                      className="w-full"
                    />
                    <div className="py-4">
                      <Select
                        size="lg"
                        variant="bordered"
                        label="Category"
                        labelPlacement="outside"
                        placeholder="Select category"
                        className="w-full"
                      >
                        {category.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="bg-white rounded-lg p-3 shadow-xl">
                    <h1 className="text-xl font-medium text-[#333333]">Course Details</h1>
                    <div className="py-6">
                      <FileDropzone />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-xl mt-3">
                    <h1 className="text-xl font-medium text-[#333333]">Course Preview</h1>
                    <div className="py-2">
                      {coursepreview.map((item) => (
                        <div className="py-1 flex justify-between items-center">
                          <h1 className="text-md font-medium text-[#666666]">
                            {item.title}
                          </h1>
                          <p className="text-md font-semibold text-[#333333]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center w-full ">
                <div>
                  <Button size="lg" startContent={<FolderDot color="#06574C" size={16}/>} variant="bordered" className="border-[#06574C] text-[#06574C]" type="submit">Save Draft</Button> 
                </div>
                <div className="flex gap-3">
                  <Button size="lg" startContent={<Rocket color="white" size={16}/>} className="bg-[#B1A7A7] text-white w-60" type="submit">Publish Course</Button>
                  <Button size="lg" className="bg-[#06574C] text-white w-35" type="submit">Next Step</Button>
                </div> 
              </div>
            </Form>
          </Tab>
          <Tab
            className="h-20"
            key="music"
            title={
              <div className="flex gap-3 justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  h-15 w-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">2</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    Content Upload
                  </h1>
                  <h1 className="text-md">
                    Vedios, PDFs, quizzes & assignments
                  </h1>
                </div>
              </div>
            }
          >
            <div className="grid grid-cols-12 gap-2">
            {card.map((item) =>
            <div className="col-span-3 p-3 bg-white rounded-lg">
              <h1 className="text-[#333333] text-md font-semibold">{item.title}</h1>
              <div className="mt-3 flex gap-2 items-center">
                <div className="h-12 w-12 rounded-full bg-[#95C4BE33] p-1 items-center flex justify-center">
                  {item.icone}
                </div>
                <h1 className="text-2xl text-[#333333] font-bold">
                  {item.count}
                </h1>
              </div>
            </div>
          )}    
          </div>  
          </Tab>
          <Tab
            className="h-20"
            key="videos"
            title={
              <div className="flex gap-3 justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  h-15 w-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">3</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    {" "}
                    Pricing & Access
                  </h1>
                  <h1 className="text-md"> Configure pricing & access rules</h1>
                </div>
              </div>
            }
          >
            <Form className="w-full py-4">
              <div className="grid grid-cols-12 gap-2 w-full">
                <div className="bg-white rounded-lg p-4 col-span-12 shadow-xl">
                  <div>
                    <h1 className="text-xl font-medium text-[#333333]">Pricing & Access Settings</h1>
                  </div>
                  <div className="py-4">
                    <div className="p-3 bg-[#95C4BE33] rounded-lg flex justify-between items-center">
                      <div>
                        <h1 className="text-[#06574C] font-medium text-lg">Course Type</h1>
                        <h1 className="text-[#06574C] font-medium text-sm">Choose between paid or free course</h1>
                      </div>
                      <div>
                        <Switch defaultSelected aria-label="Automatic updates" />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center pt-4">
                      <Input
                        size="lg"
                        variant="bordered"
                        label="Course Price"
                        labelPlacement="outside"
                        placeholder="$  9.99"
                        className="w-full"
                      />
                      <Select
                        size="lg"
                        variant="bordered"
                        label="Access Duration"
                        labelPlacement="outside"
                        placeholder="Select Difficulty Level"
                        className="w-full"
                      >
                        {Duration.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                        <h1 className="pt-4 text-xl text-[#333333] font-bold">Access Settings</h1>

                    <div className="flex gap-3 items-center py-4">
                      <Select
                        size="lg"
                        variant="bordered"
                        label="Access Duration"
                        labelPlacement="outside"
                        placeholder="Select Access Duration"
                        className="w-full"
                      >
                        {accessDuration.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        size="lg"
                        variant="bordered"
                        label="Preview Lessons "
                        labelPlacement="outside"
                        placeholder="Select Preview Lessons "
                        className="w-full"
                        type="number"
                      />
                    </div>
                    <Input
                      size="lg"
                      variant="bordered"
                      label="Enrollment Limit"
                      labelPlacement="outside"
                      placeholder="0"
                      className="w-full"
                      type="number"
                    />
                    <span className="text-xs text-[#06574C]">Leave empty for unlimited enrollments</span>
                    <div className="my-3 text-xl font-bold">Publish Status</div>
                    <div className="p-3 bg-[#EBD4C982] rounded-lg flex justify-between items-center">
                      <div>
                        <h1 className="text-[#333333] font-bold text-lg">Current Status: Draft</h1>
                        <h1 className="text-[#666666] font-medium text-sm">Your course is not visible to students yet</h1>
                      </div>
                      <div>
                        <Button
                        variant="bordered"
                        className="border-[#06574C] text-[#06574C]"
                        >Change To Public</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center w-full ">
                <div>
                  <Button size="lg" startContent={<FolderDot color="#06574C" size={16}/>} variant="bordered" className="border-[#06574C] text-[#06574C]" type="submit">Save Draft</Button> 
                </div>
                <div className="flex gap-3">
                  <Button size="lg" startContent={<Rocket color="white" size={16}/>} className="bg-[#06574C] text-white w-60" type="submit">Publish Course</Button>
                </div> 
              </div>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;

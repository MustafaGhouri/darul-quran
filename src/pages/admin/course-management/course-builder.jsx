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
} from "@heroui/react";
import FileDropzone from "../../../components/dashboard-components/dropzone";
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
  const Difficulty = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];

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
                    <h1 className="text-xl font-medium">Course Details</h1>
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
                    <h1 className="text-xl font-medium">Course Details</h1>
                    <div className="py-6">
                      <FileDropzone />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-xl mt-3">
                    
                  </div>
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
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
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
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;

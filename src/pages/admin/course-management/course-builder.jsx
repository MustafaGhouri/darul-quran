import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Tabs,
  Tab,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  Switch,
} from "@heroui/react";
import { motion } from "framer-motion";
import FileDropzone from "../../../components/dashboard-components/dropzone";
import {
  File,
  FolderDot,
  Lightbulb,
  Rocket,
  ScrollText,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import Videos, {
  Assignments,
  PdfAndNotes,
  Quizzes,
} from "../../../components/dashboard-components/forms/ContentUpload";
import { useSearchParams } from "react-router-dom";
import { label } from "framer-motion/client";
import { UploadButton, UploadDropzone } from "../../../lib/uploadthing";
const containerVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      // staggerChildren: 0.06,
      // delayChildren: 0.02,
      duration: 0.2,
    },
  },
};
const CourseBuilder = () => {
// useEffect(() => {
//   const fetchCourses = async () => {
//     const response = await fetch(
//       import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/addCourse",
//       {
//         method: "POST",
//       }
//     );
//     const data = await response.json();
//     console.log(data);
//   };

//   fetchCourses();
// }, []);

  const [thumbnail, setThumbnail] = useState([]); //file
  console.log("thumbnail",thumbnail);
  const category = [
    { key: "Advance_JavaScript", label: "Advance JavaScript" },
    { key: "Advance_React", label: "Advance React" },
    { key: "Advance_Python", label: "Advance Python" },
  ];
  const Duration = [
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "One_Month", label: "One Month" },
    { key: "Yearly", label: "Yearly" },
  ];
  const Difficulty = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];
  const coursepreview = [
    { title: "Title:", desc: "Untitled Course" },
    { title: "Category:", desc: "No Selected" },
    { title: "Difficulty Level:", desc: "Beginner" },
    { title: "Price:", desc: "Free" },
  ];

  const teacher = [
    { id: "All:", label: "All Teachers" },
    { id: "jhon_davis:", label: "John Davis" },
  ];

  const card = [
    {
      title: "Videos",
      count: "10",
      icone: <Video size={20} color="#06574C" />,
    },
    { title: "PDFs:", count: "10", icone: <File size={20} color="#06574C" /> },
    {
      title: "Quizzes",
      count: "20",
      icone: <Lightbulb size={20} color="#06574C" />,
    },
    {
      title: "Assignments",
      count: "15",
      icone: <ScrollText size={20} color="#06574C" />,
    },
  ];
  const [isSelected, setIsSelected] = useState(true);

  const accessDuration = [
    { key: "108_days", label: "108 Days" },
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "360_days", label: "360 Days" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const [selected, setSelected] = useState(currentTab || "info");
  useEffect(() => {
    if (currentTab) {
      setSelected(currentTab);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);
  const handleSelected = (value) => {
    setSelected(value);
    // searchParams.set('tab', value);
    setSearchParams({ tab: value });
  };
const [formData, setFormData] = useState({
  course_name: "",
  category: "",
  difficulty_level: "",
  description: "",
  course_price: "",
  teacher_name: "",
  access_duration: "",
  previous_lesson: "",
  enroll_number: "",
  status: "Draft", // Default
});
const handleChange = (name, value) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
 const handleSubmitTab1 = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    previous_lesson: formData.previous_lesson ? parseInt(formData.previous_lesson) : null,
    enroll_number: formData.enroll_number ? parseInt(formData.enroll_number) : null,
    status: "Draft",
  };
  const uploadfiles = {
    thumbnail: thumbnail,
    // videos: videos,
    // pdf_and_notes: pdf_and_notes,
    // assignments: assignments,
    // quizzes: quizzes,
  };
  console.log("uploadfiles",uploadfiles);
  try{
  const uploadfilesData = await response.json();
  if(uploadfilesData.success){
    const response = await fetch (
      import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/addCourse",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(payload , uploadfilesData),
      }
    );
    const data = await response.json();
    console.log(data);
  }
  }catch(error){
    console.log(error);
  }
  // const response = await fetch(
  //   import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/addCourse",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   }
  // );

  // const data = await response.json();

  // if (data.success) {
  //   // Navigate to Tab 2 with the course ID
  //   navigate(`/course-builder/${data.courseId}?tab=content`);
  // }
};
// const handleSubmitTab1 = async (e) => {
//   e.preventDefault();

//   const payload = {
//     ...formData,
//     previous_lesson: formData.previous_lesson
//       ? parseInt(formData.previous_lesson)
//       : null,
//     enroll_number: formData.enroll_number
//       ? parseInt(formData.enroll_number)
//       : null,
//     status: "Draft",
//   };

//   const uploadfiles = {
//     images: thumbnail, // ⚠️ backend expects "images"
//     isConvert: true,
//   };

//   try {
//     const response = await fetch(
//   import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/uploadImages",
//   {
//     method: "POST",
//     credentials: "include",
//     body: formData, // ✅ NO headers
//   }
//     );

//     const uploadfilesData = await response.json();

//     if (!response.ok) {
//       console.error(uploadfilesData);
//       return;
//     }

//     // upload success
//     const courseResponse = await fetch(
//       import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/admin/addCourse",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           ...payload,
//           thumbnail: uploadfilesData.uploaded,
//         }),
//       }
//     );

//     const data = await courseResponse.json();
//     console.log("Course Created:", data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const handleUpdate = async (fieldsToUpdate) => {
//   if (!courseId) return;

//   const response = await fetch(
//     `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/admin/updateCourse/${courseId}`,
//     {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(fieldsToUpdate),
//     }
//   );

//   const data = await response.json();
//   console.log(data);
// };
  return (
    <div className="h-full bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full no-scrollbar top-0 bottom-0 overflow-y-auto">
      <DashHeading
        title={"Course Builder"}
        desc={"Create a new course step by step"}
      />
      <div className="flex w-full flex-col my-3">
        <Tabs
          className="w-full md:inline-block py-2"
          aria-label="Disabled Options"
          selectedKey={selected}
          onSelectionChange={handleSelected}
          classNames={{
            base: "w-full",
            tabList: " flex flex-wrap rounded-lg px-2 py-1 ",
            tab: `
            w-full flex-1
      data-[selected=true]:bg-[#EBD4C9E5] rounded-lg 
      data-[selected=true]:rounded-lg 
      data-[selected=true]:border-b-3 
      data-[selected=true]:max-md:border-3 
      data-[selected=true]:border-[#06574C] 
      rounded-none
      px-6 py-4
    `,
            tabContent: `
      group-data-[selected=true]:text-[#06574C]
      text-[#3F3F44]
      font-semibold
      flex  md:items-center gap-3
    `,
          }}
        >
          <Tab
            className="h-20"
            key="info"
            title={
              <div className="flex gap-3 justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  size-9 sm:size-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">1</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    Basic Information
                  </h1>
                  <h1 className="text-xs wrap-break-word">
                    {" "}
                    Course details & settings
                  </h1>
                </div>
              </div>
            }
          >
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              transition={{ when: "beforeChildren" }}
            >
              <Form onSubmit={handleSubmitTab1} className="w-full py-4">
                <div className="grid grid-cols-12 gap-2 w-full">
                  <div className="bg-white rounded-lg p-4 col-span-12 sm:col-span-8 shadow-xl">
                    <div>
                      <h1 className="text-xl font-medium text-[#333333]">
                        Course Details
                      </h1>
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

                      <div className="flex max-sm:flex-wrap gap-3 items-center pt-4">
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Category"
                          labelPlacement="outside"
                          placeholder="Select category"
                          className="w-full"
                          selectedKeys={[formData.category]}
                          onSelectionChange={(keys) => handleChange("category", [...keys][0])}
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
                          selectedKeys={[formData.difficulty_level]}
                          onSelectionChange={(keys) => handleChange("difficulty_level", [...keys][0])}
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
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
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
                        value={formData.course_price}
                        onChange={(e) => handleChange("course_price", e.target.value)}
                      />
                      <div className="py-4">
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Teacher Name"
                          labelPlacement="outside"
                          placeholder="Select teacher"
                          className="w-full"
                          selectedKeys={[formData.teacher_name]}
                          onSelectionChange={(keys) => handleChange("teacher_name", [...keys][0])}
                        >
                          {teacher.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <div className="bg-white rounded-lg p-3 shadow-xl">
                      <h1 className="text-xl font-medium text-[#333333]">
                        Course Details
                      </h1>
                      <div className="py-6">
                        {/* <FileDropzone
                          files={thumbnail}
                          setFiles={setThumbnail}
                        /> */}
                       <UploadDropzone
                         className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 relative"
                         endpoint="imageUploader"
                         appearance={{
                           container: {
                             width: "100%",
                             height: "300px",
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                             backgroundColor: "white",
                             
                           },
                           button: {
                            position: "absolute",
                            bottom: "3rem",
                             background: "#06574C",
                             color: "white",
                             marginTop: "1rem", // Add spacing if needed
                           },
                           label: {
                             color: "#06574C",
                           },
                         }}
                         onClientUploadComplete={(res) => {
                           console.log("Files: ", res);
                           toast.success("Upload Completed");
                         }}
                         onUploadError={(error) => {
                           // Do something with the error.
                           toast.error(`ERROR! ${error.message}`);
                         }}
                       />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-xl mt-3">
                      <h1 className="text-xl font-medium text-[#333333]">
                        Course Preview
                      </h1>
                      <div className="py-2">
                        {coursepreview.map((item) => (
                          <div className="py-1 flex justify-between items-center">
                            <h1 className="text-md font-medium text-[#666666]">
                              {item.title}
                            </h1>
                            <p className="text-md font-semibold text-[#333333]">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap justify-center sm:justify-between items-center w-full ">
                  <Button
                    size="lg"
                    startContent={<FolderDot color="#06574C" size={16} />}
                    variant="bordered"
                    className="border-[#06574C] w-78  sm:w-40 text-[#06574C]"
                    type="submit"
                  >
                    Save Draft
                  </Button>
                   {/* 
                   <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Upload complete:", res);
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
      }}
    /> 
    */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      startContent={<Rocket color="white" size={16} />}
                      className="bg-[#B1A7A7] w-full text-white sm:w-60"
                      type="submit"
                    >
                      Publish Course
                    </Button>
                    <Button
                      size="lg"
                      className="bg-[#06574C] w-full text-white sm:w-35"
                      type="submit"
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </Form>
            </motion.div>
          </Tab>
          <Tab
            className="h-20"
            key="content"
            title={
              <div className="flex gap-3  justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  size-9 sm:size-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">2</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    Content Upload
                  </h1>
                  <h1 className="text-xs wrap-break-word">
                    Videos, PDFs, quizzes & assignments
                  </h1>
                </div>
              </div>
            }
          >
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              transition={{ when: "beforeChildren" }}
            >
              <Form 
              // onSubmit={handleUpdate} 
              >
              <div className="w-full grid grid-cols-2 md:grid-cols-4 py-4 gap-2">
                {card.map((item) => (
                  <div className="w-full sm:flex-1 max-sm:border border-gray-300 p-3 bg-white rounded-lg">
                    <h1 className="text-[#333333] text-md font-semibold">
                      {item.title}
                    </h1>
                    <div className="mt-3 flex gap-2 items-center">
                      <div className="h-12 w-12 rounded-full bg-[#95C4BE33] p-1 items-center flex justify-center">
                        {item.icone}
                      </div>
                      <h1 className="text-2xl text-[#333333] font-bold">
                        {item.count}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
              <Videos />
              <PdfAndNotes />
              <Assignments />
              <Quizzes />
              <div className="p-3 my-5 bg-[#95C4BE33] rounded-md flex justify-between items-center">
                <div>
                  <h1 className="text-[#06574C] font-medium text-lg">
                    Content Drip Schedule
                  </h1>
                  <h1 className="text-[#06574C] font-medium text-sm">
                    Control when students can access each lesson. Content will
                    be released automatically based on their enrollment date.
                    This helps create a structured learning experience and
                    prevents overwhelming students with too much content at
                    once.
                  </h1>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-center sm:justify-between items-center w-full ">
                <Button
                  size="lg"
                  startContent={<FolderDot color="#06574C" size={16} />}
                  variant="bordered"
                  className="border-[#06574C] w-78 sm:w-40 text-[#06574C]"
                  onPress={() => handleSelected("info")}
                >
                  Previous Step
                </Button>
                <div className="flex flex-wrap my-5 gap-3">
                  <Button
                    size="lg"
                    startContent={<Rocket color="white" size={16} />}
                    className="bg-[#B1A7A7] w-full text-white sm:w-60"
                    type="submit"
                  >
                    Publish Course
                  </Button>
                  <Button
                    size="lg"
                    className="bg-[#06574C] w-full text-white sm:w-35"
                    // type="submit"
                    onPress={() => handleSelected("pricing")}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
              </Form>
            </motion.div>
          </Tab>
          <Tab
            className="h-20"
            key="pricing"
            title={
              <div className="flex gap-3 justify-between items-center">
                <div className="bg-white text-[#3F3F44] shadow-2xl  size-9 sm:size-15 rounded-full flex items-center justify-center">
                  <h1 className="text-xl font-bold text-[#06574C]">3</h1>
                </div>
                <div className="text-start">
                  <h1 className="text-[#06574C] text-lg font-bold">
                    {" "}
                    Pricing & Access
                  </h1>
                  <h1 className="text-xs wrap-break-word">
                    {" "}
                    Configure pricing & access rules
                  </h1>
                </div>
              </div>
            }
          >
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              transition={{ when: "beforeChildren" }}
            >
              <Form className="w-full py-4">
                <div className="grid grid-cols-12 gap-2 w-full">
                  <div className="bg-white rounded-lg p-4 col-span-12 shadow-xl">
                    <div>
                      <h1 className="text-xl font-medium text-[#333333]">
                        Pricing & Access Settings
                      </h1>
                    </div>
                    <div className="py-4">
                      <div className="p-3 bg-[#95C4BE33] rounded-lg flex justify-between items-center">
                        <div>
                          <h1 className="text-[#06574C] font-medium text-lg">
                            Course Type
                          </h1>
                          <h1 className="text-[#06574C] font-medium text-sm">
                            Choose between paid or free course
                          </h1>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-md text-[#06574C]">
                            {isSelected ? "Active" : "Inactive"}
                          </p>
                          <Switch
                            color="success"
                            defaultSelected
                            aria-label="Automatic updates"
                            // isSelected={isSelected}
                            // onValueChange={setIsSelected}
                            isSelected={formData.status === "Published"}
                            onValueChange={(val) =>
                              handleChange("status", val ? "Published" : "Draft")
                            }
                          />
                        </div>
                      </div>
                      {/* <div className="flex gap-3 items-center pt-4">
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
                      </div> */}

                      <h1 className="pt-4 text-xl text-[#333333] font-bold">
                        Access Settings
                      </h1>

                      <div className="flex gap-3 items-center py-4">
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Access Duration"
                          labelPlacement="outside"
                          placeholder="Select Access Duration"
                          className="w-full"
                          selectedKeys={[formData.access_duration]}
                          onSelectionChange={(keys) => handleChange("access_duration", [...keys][0])}
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
                          value={formData.previous_lesson}
                          onChange={(e) => handleChange("previous_lesson", e.target.value)}
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
                        value={formData.enroll_number}
                        onChange={(e) => handleChange("enroll_number", e.target.value)} 
                      />
                      <span className="text-xs text-[#06574C]">
                        Leave empty for unlimited enrollments
                      </span>
                      <div className="my-3 text-xl font-bold">
                        Publish Status
                      </div>
                      <div className="p-3 bg-[#EBD4C982] rounded-lg flex justify-between items-center">
                        <div>
                          <h1 className="text-[#333333] font-bold text-lg">
                            Current Status: Draft
                          </h1>
                          <h1 className="text-[#666666] font-medium text-sm">
                            Your course is not visible to students yet
                          </h1>
                        </div>
                        <div>
                          <Button
                            variant="bordered"
                            className="border-[#06574C] text-[#06574C]"
                          >
                            Change To Public
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-between items-center w-full ">
                  <div className="flex flex-wrap items-center justify-center  gap-2">
                    <Button
                      size="lg"
                      startContent={<FolderDot color="#06574C" size={16} />}
                      variant="bordered"
                      className="border-[#06574C] w-80 sm:w-40 text-[#06574C]"
                      onPress={() => handleSelected("content")}
                    >
                      Previous Step
                    </Button>
                    <Button
                      size="lg"
                      startContent={<FolderDot color="#06574C" size={16} />}
                      variant="bordered"
                      className="border-[#06574C] text-[#06574C] w-80 sm:w-40"
                      type="submit"
                    >
                      Save Draft
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      startContent={<Rocket color="white" size={16} />}
                      className="bg-[#06574C] text-white w-80 sm:w-60"
                      type="submit"
                    >
                      Publish Course
                    </Button>
                  </div>
                </div>
              </Form>
            </motion.div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;

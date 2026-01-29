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
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { motion } from "framer-motion";
import FileDropzone from "../../../components/dashboard-components/dropzone";
import {
  File,
  FolderDot,
  Lightbulb,
  Rocket,
  ScrollText,
  Trash2Icon,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Videos, {
  Assignments,
  PdfAndNotes,
  Quizzes,
} from "../../../components/dashboard-components/forms/ContentUpload";
import { useSearchParams } from "react-router-dom";
import { label } from "framer-motion/client";
import { UploadButton, UploadDropzone, useUploadThing } from "../../../lib/uploadthing";
import { useNavigate } from "react-router-dom";

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
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_PUBLIC_SERVER_URL + "/api/user/getTeachers"
        );
        const data = await response.json();

        if (data.success) {
          setTeachers(data.user);
          console.log("Teachers", data.user);
        }
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };

    fetchTeachers();
  }, []);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState([]); //file
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const { startUpload } = useUploadThing("imageUploader");

  // const category = [
  //   { key: "Advance_JavaScript", label: "Advance JavaScript" },
  //   { key: "Advance_React", label: "Advance React" },
  //   { key: "Advance_Python", label: "Advance Python" },
  // ];
  // const Duration = [
  //   { key: "Lifetime_Access", label: "Lifetime Access" },
  //   { key: "One_Month", label: "One Month" },
  //   { key: "Yearly", label: "Yearly" },
  // ];
  const Difficulty = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];

  const card = [
    {
      title: "Videos",
      count: videos.length || 0,
      icone: <Video size={20} color="#06574C" />,
    },
    { title: "PDFs:", count: pdfs.length || 0, icone: <File size={20} color="#06574C" /> },
    {
      title: "Quizzes",
      count: quizzes.length || 0,
      icone: <Lightbulb size={20} color="#06574C" />,
    },
    {
      title: "Assignments",
      count: assignments.length || 0,
      icone: <ScrollText size={20} color="#06574C" />,
    },
  ];
  // const [isSelected, setIsSelected] = useState(true);
  const [categories, setCategories] = useState([]);
  const accessDuration = [
    { key: "108_days", label: "108 Days" },
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "360_days", label: "360 Days" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const courseId = searchParams.get("id");
  const [selected, setSelected] = useState(currentTab || "info");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (currentTab) {
      setSelected(currentTab);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);
  const handleSelected = (value) => {
    setSelected(value);
    // Preserve existing params like 'id'
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", value);
      return newParams;
    });
  };

  const [formData, setFormData] = useState({
    course_name: "",
    category_id: null,
    difficulty_level: "",
    description: "",
    category_name: "",
    course_price: "",
    teacher_id: "",
    access_duration: "",
    previous_lesson: "",
    enroll_number: "",
    status: "Draft", // Default
  });
  // console.log(formData);
  const coursepreview = [
    { title: "Title:", desc: formData?.course_name || "Add Tittle" },
    { title: "Category:", desc: categories?.find((category) => category.id === formData?.category_id)?.categoryName || formData?.category_name || "Add Category" },
    { title: "Difficulty Level:", desc: formData?.difficulty_level || "Add Difficulty Level" },
    { title: "Price:", desc: formData?.course_price || "Add Price" },
  ];
  // handle change
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };
  // handle submit tab 1
  const handleSubmitTab1 = async (e) => {
    e.preventDefault();
    setLoadingAction(pendingAction);

    let currentThumbnailUrl = thumbnailUrl;

    if (thumbnail.length > 0) {
      try {
        const res = await startUpload(thumbnail);
        if (res && res[0]) {
          currentThumbnailUrl = res[0].url;
          setThumbnailUrl(currentThumbnailUrl);
          toast.success("Thumbnail uploaded successfully");
        }
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload thumbnail");
        setLoadingAction(null);
        setPendingAction(null);
        return;
      }
    }

    if (!currentThumbnailUrl) {
      toast.error("Please upload a thumbnail image first");
      setLoadingAction(null);
      setPendingAction(null);
      return;
    }

    const payload = {
      ...formData,
      previous_lesson: formData.previous_lesson
        ? parseInt(formData.previous_lesson)
        : null,
      enroll_number: formData.enroll_number
        ? parseInt(formData.enroll_number)
        : null,
      status: "Draft",
      thumbnailurl: currentThumbnailUrl,
      teacher_id: Number(formData.teacher_id),
      lesson_video: videos,
      pdf_notes: pdfs,
      assignments: assignments,
      quizzes: quizzes,
    };
    console.log("payload", payload);
    try {
      const courseId = searchParams.get("id");
      let response; // ✅ yahan declare karo

      if (courseId) {
        // ✅ UPDATE COURSE
        response = await fetch(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL
          }/api/course/updateCourse/${courseId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
      } else {
        // ✅ ADD COURSE
        response = await fetch(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/addCourse`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await response.json(); // ✅ ab safe hai

      if (data.success) {
        toast.success(courseId ? "Course Updated!" : "Course Created!");

        if (!courseId && data.courseId) {
          setSearchParams({ tab: "content", id: data.courseId });
        } else {
          handleSelected("content");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
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

  const saveContent = async (updatedList, field) => {
    if (!courseId) return;
    const payload = {
      ...formData,
      thumbnailurl: thumbnailUrl,
      lesson_video: field === 'lesson_video' ? updatedList : videos,
      pdf_notes: field === 'pdf_notes' ? updatedList : pdfs,
      assignments: field === 'assignments' ? updatedList : assignments,
      quizzes: field === 'quizzes' ? updatedList : quizzes,
    };
    try {
      await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/updateCourse/${courseId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoadingAction(pendingAction);
    if (!courseId) return;

    // Validation: All uploads required
    if (videos.length === 0 || pdfs.length === 0 || assignments.length === 0 || quizzes.length === 0) {
      toast.error("All content sections (Videos, PDFs, Assignments, Quizzes) must have at least one upload.");
      setLoadingAction(null);
      setPendingAction(null);
      return;
    }

    try {
      const payload = {
        ...formData,
        thumbnailurl: thumbnailUrl,
        lesson_video: videos,
        pdf_notes: pdfs,
        assignments: assignments,
        quizzes: quizzes,
      };
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL
        }/api/course/updateCourse/${courseId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Use full payload including URLs
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("Course details updated!");
        handleSelected("pricing");
      } else {
        toast.error("Failed to update course");
        setLoadingAction(null);
        setPendingAction(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };
  // handle submit 3rd tab
  const handleSubmit3tab = async (e) => {
    if (e) e.preventDefault();
    setLoadingAction(pendingAction);
    console.log(formData);

    try {
      const payload = {
        ...formData,
        thumbnailurl: thumbnailUrl,
        lesson_video: videos,
        pdf_notes: pdfs,
        assignments: assignments,
        quizzes: quizzes,
      };
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL
        }/api/course/updateCourse/${courseId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("Course Updated Successfully");
        navigate("/admin/courses-management");
      } else {
        toast.error("Failed to update course");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating course");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };
  // fetch course by id and set form data
  useEffect(() => {
    const fetchCourseById = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL
          }/api/course/getCourseById/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await response.json();
        if (!data.success) return;

        const course = data.course;

        // ✅ 1. Form data
        setFormData({
          course_name: course.course_name || "",
          category: course.category || "",
          difficulty_level: course.difficulty_level || "",
          description: course.description || "",
          course_price: course.course_price || "",
          category_id: Number(course.category_id) || "",
          teacher_id: Number(course.teacher_id) || "",
          access_duration: course.access_duration || "",
          previous_lesson: course.previous_lesson || "",
          enroll_number: course.enroll_number || "",
          status: course.status || "Draft",
        });
        // ✅ 2. Thumbnail
        setThumbnailUrl(course.thumbnailurl || "");
        // ✅ 3. Content files
        setVideos(course.lesson_video || []);
        setPdfs(course.pdf_notes || []);
        setAssignments(course.assignments || []);
        setQuizzes(course.quizzes || []);
      } catch (error) {
        console.error("Failed to fetch course", error);
        toast.error("Failed to load course data");
      }
    };

    fetchCourseById();
  }, [searchParams]);
  // add category
  const handleSubmitAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/addCategory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            category_name: newCategory,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to add category");
        return;
      }
      setCategories((prev) => [...prev, data.category]);
      toast.success("Category added successfully");
      setIsAddCategoryOpen(false);
      setNewCategory("");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };
  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/getAllCategories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to fetch categories");
        return;
      }

      setCategories(data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };
  // useEffect fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);
  // delete category
  const deleteCategory = async (id) => {
    try {
      console.log("id", id);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/course/deleteCategory`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            category_id: id,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {

        toast.error(data.message || "Failed to delete category");
        return;
      }

      setCategories((prev) => prev.filter((category) => category.id !== id));
      console.log("data", data);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full pb-10">
      <DashHeading
        title={"Course Builder"}
        desc={"Create a new course step by step"}
      />
      <div className="flex w-full flex-col my-3">
        <Tabs
          isDisabled
          className="w-full md:inline-block py-2 !opacity-100"
          aria-label="Disabled Options"
          // disabledKeys={["info" , "pricing" , "content"]}
          selectedKey={selected}
          onSelectionChange={handleSelected}
          classNames={{
            base: "w-full !opacity-100",
            tabList: " flex flex-wrap rounded-lg px-2 py-1 !opacity-100",
            tab: `!opacity-100
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
      flex  md:items-center gap-3 opacity-100
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
                        label="Course Title"
                        labelPlacement="outside"
                        placeholder="Enter course title"
                        className="w-full"
                        isRequired
                        errorMessage="Course title is required"
                        value={formData.course_name}
                        onChange={(e) =>
                          handleChange("course_name", e.target.value)
                        }
                      />

                      <div className="flex max-sm:flex-wrap gap-3 items-center pt-6">
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Category"
                          labelPlacement="outside"
                          placeholder="Select category"
                          className="w-full"
                          isRequired
                          errorMessage="Category is required"
                          selectedKeys={
                            formData.category_id ? [String(formData.category_id)] : []
                          }
                          onSelectionChange={(keys) => {
                            const selected = [...keys][0];
                            if (selected === "add-category") {
                              setIsAddCategoryOpen(true);
                              return;
                            }

                            handleChange("category_id", Number(selected));
                          }}
                        >
                          {categories.map((item) => (
                            <SelectItem
                              endContent={<Button
                                size="sm"
                                variant="light"
                                color="danger"
                                isIconOnly
                                onPress={() => { deleteCategory(item.id) }}
                              >
                                <Trash2Icon className="text-red-500" size={15} />
                              </Button>}
                              key={String(item.id)} value={String(item.id)}>
                              {item.categoryName}
                            </SelectItem>
                          ))}

                          <SelectItem
                            key="add-category"
                            className="text-primary font-semibold"
                            textValue="Add Category"
                          >
                            ➕ Add Category
                          </SelectItem>
                        </Select>
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Difficulty Level"
                          labelPlacement="outside"
                          placeholder="Select Difficulty Level"
                          isRequired
                          errorMessage="Difficulty Level is required"
                          className="w-full"
                          selectedKeys={[formData.difficulty_level]}
                          onSelectionChange={(keys) =>
                            handleChange("difficulty_level", [...keys][0])
                          }
                        >
                          {Difficulty.map((item) => (
                            <SelectItem key={item.key} value={item.id}>
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
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
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
                        isRequired
                        errorMessage="Course Price is required"
                        className="w-full"
                        value={formData.course_price}
                        onChange={(e) =>
                          handleChange("course_price", e.target.value)
                        }
                      />
                      <div className="pt-6">
                        <Select
                          size="lg"
                          variant="bordered"
                          label="Teacher Name"
                          labelPlacement="outside"
                          placeholder="Select teacher"
                          isRequired
                          errorMessage="Teacher is required"
                          className="w-full"
                          selectedKeys={
                            formData.teacher_id
                              ? new Set([String(formData.teacher_id)])
                              : new Set()
                          }
                          onSelectionChange={(keys) => {
                            const teacherId = Number([...keys][0]); // ✅ convert to number
                            handleChange("teacher_id", teacherId);
                          }}
                        >
                          {teachers.map((teacher) => {
                            const fullName = `${teacher.firstName} ${teacher.lastName}`;
                            return (
                              <SelectItem
                                key={String(teacher.id)}
                                textValue={fullName}
                              >
                                {fullName}
                              </SelectItem>
                            );
                          })}
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
                        {thumbnailUrl ? (
                          <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                            <Image
                              removeWrapper
                              className="w-full h-full object-cover"
                              src={thumbnailUrl}
                              alt="Course Thumbnail"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2 bg-red-500 text-white z-10"
                              onPress={() => setThumbnailUrl("")}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <FileDropzone
                            files={thumbnail}
                            setFiles={setThumbnail}
                            label="Upload Course Thumbnail"
                            text="Recommended: 1280x720 pixels (JPG, PNG, WEBP)"
                          />
                        )}
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
                    onPress={() => setPendingAction("save-1")}
                    isLoading={loadingAction === "save-1"}
                  >
                    Save Draft
                  </Button>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-[#06574C] w-full text-white sm:w-35"
                      type="submit"
                      onPress={() => setPendingAction("next-1")}
                      isLoading={loadingAction === "next-1"}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </Form>
              <Modal
                isOpen={isAddCategoryOpen}
                onOpenChange={setIsAddCategoryOpen}
              >
                <ModalContent>
                  <ModalHeader>Add Category</ModalHeader>

                  <ModalBody>
                    <Input
                      size="lg"
                      variant="bordered"
                      label="Category Name"
                      labelPlacement="outside"
                      placeholder="Enter category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      variant="light"
                      onPress={() => setIsAddCategoryOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button color="primary" onPress={handleSubmitAddCategory}>
                      Add
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
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
              <Form onSubmit={handleUpdate}>
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
                <Videos videos={videos} setVideos={setVideos} onSave={(data) => saveContent(data, 'lesson_video')} />
                <PdfAndNotes pdfs={pdfs} setPdfs={setPdfs} onSave={(data) => saveContent(data, 'pdf_notes')} />
                <Assignments
                  assignments={assignments}
                  setAssignments={setAssignments}
                  onSave={(data) => saveContent(data, 'assignments')}
                />
                <Quizzes quizzes={quizzes} setQuizzes={setQuizzes} onSave={(data) => saveContent(data, 'quizzes')} />
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
                    {/* <Button
                      size="lg"
                      startContent={<Rocket color="white" size={16} />}
                      className="bg-[#B1A7A7] w-full text-white sm:w-60"
                      type="submit"
                      onPress={() => setPendingAction("publish-2")}
                      isLoading={loadingAction === "publish-2"}
                    >
                      Publish Course
                    </Button> */}
                    <Button
                      size="lg"
                      className="bg-[#06574C] w-full text-white sm:w-35"
                      type="submit"
                      onPress={() => setPendingAction("next-2")}
                      isLoading={loadingAction === "next-2"}
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
              <Form onSubmit={handleSubmit3tab} className="w-full py-4">
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
                            {formData.status === "Published" ? "Paid" : "Free"}
                          </p>
                          <Switch
                            color="success"
                            defaultSelected
                            aria-label="Automatic updates"
                            // isSelected={isSelected}
                            // onValueChange={setIsSelected}
                            isSelected={formData.status === "Published"}
                            onValueChange={(val) =>
                              handleChange(
                                "status",
                                val ? "Published" : "Draft"
                              )
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
                          onSelectionChange={(keys) =>
                            handleChange("access_duration", [...keys][0])
                          }
                        >
                          {accessDuration.map((item) => (
                            <SelectItem key={item.key} value={item.label}>
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
                          onChange={(e) =>
                            handleChange("previous_lesson", e.target.value)
                          }
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
                        onChange={(e) =>
                          handleChange("enroll_number", e.target.value)
                        }
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
                      onPress={() => setPendingAction("save-3")}
                      isLoading={loadingAction === "save-3"}
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
                      onPress={() => setPendingAction("publish-3")}
                      isLoading={loadingAction === "publish-3"}
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

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
import Videos, {
  Assignments,
  PdfAndNotes,
  Quizzes,
} from "../../../components/dashboard-components/forms/ContentUpload";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAddCategoryMutation, useAddCourseMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useGetCourseByIdQuery, useUpdateCourseMutation } from "../../../redux/api/courses";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import { FormOverlayLoader } from "../../../components/Loader";
import { uploadFilesToServer } from "../../../lib/utils";
import { IntervalInput } from "../../../components/dashboard-components/forms/IntervalInput";
import TeacherSelect from "../../../components/select/TeacherSelect";
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

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const courseId = searchParams.get("id");

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
  const [video, setVideo] = useState([]); //file objects with metadata
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState([]); // Cover image file objects with metadata
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Cover image URL
  const [removedUrls, setRemovedUrls] = useState([""]);
  const [files, setFiles] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  //query/fetch
  const { data = {}, isLoading, isError, error } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data: categoriesData, isError: categoriesError, error: categoriesErrorData } = useGetAllCategoriesQuery();
  //mutations/actions
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addCategory] = useAddCategoryMutation();

  useEffect(() => {
    if (isError) {
      errorMessage(error.data.error, error.status);
    } else if (categoriesError) {
      errorMessage(categoriesErrorData.data.error, categoriesErrorData.status);
    }
  }, [isError, categoriesError]);

  useEffect(() => {
    const fetchCourseById = async () => {
      if (!courseId) return;
      try {
        if (!data?.course) return;

        const course = data.course;
        setFormData({
          course_name: course.courseName || "",
          category_id: Number(course.category) || "",
          difficulty_level: course.difficultyLevel || "",
          description: course.description || "",
          course_price: course.coursePrice || "",
          teacher_id: Number(course.teacherId) || "",
          access_duration: course.accessDuration || "",
          previous_lesson: course?.files?.length || "",
          enroll_number: course.enrollNumber || "",
          status: course.status || "draft",
          videoDuration: course.videoDuration || "",
          is_free: course.isFree || false,
          video_count: course.videoCount || 0,
          type: course.type || 'one_time',
          interval: course.interval || '',
          duration: course.duration || '',
        });

        setVideoUrl(course.video || "");
        setThumbnailUrl(course.thumbnail || "");
        setFiles(course.files || []);
      } catch (error) {
        console.error("Failed to fetch course", error);
        errorMessage("Failed to load course data: " + error?.message);
      }
    };

    fetchCourseById();
  }, [data, courseId]);

  const Difficulty = [
    { key: "Beginner", label: "Beginner" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
  ];

  const card = [
    {
      title: "Videos",
      count: (files?.filter((f) => f.fileType === "lesson_video")).length || 0,
      icone: <Video size={20} color="#06574C" />,
    },
    { title: "PDFs:", count: (files?.filter((f) => f.fileType === "pdf_notes")).length || 0, icone: <File size={20} color="#06574C" /> },
    {
      title: "Quizzes",
      count: 0,
      icone: <Lightbulb size={20} color="#06574C" />,
    },
    {
      title: "Assignments",
      count: (files?.filter((f) => f.fileType === "assignments")).length || 0,
      icone: <ScrollText size={20} color="#06574C" />,
    },
  ];
  const [categories, setCategories] = useState([]);
  const accessDuration = [
    { key: "108_days", label: "108 Days" },
    { key: "Lifetime_Access", label: "Lifetime Access" },
    { key: "360_days", label: "360 Days" },
  ];

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
    type: "one_time",
    teacher_id: "",
    access_duration: "",
    previous_lesson: 0,
    enroll_number: "",
    status: "draft", // Default
    videoDuration: "",
    duration: "",
    interval: "",
    is_free: false, // Free/Paid toggle
    video_count: 0, // Number of videos
  });
  // console.log(formData);
  const coursepreview = [
    { title: "Title:", desc: formData?.course_name || "Add Tittle" },
    { title: "Category:", desc: categories?.find((category) => category.id === formData?.category_id)?.categoryName || formData?.category_name || "Add Category" },
    { title: "Difficulty Level:", desc: formData?.difficulty_level || "Add Difficulty Level" },
    { title: "Price:", desc: formData?.course_price || "Add Price" },
    { title: "Type:", desc: formData?.type?.replace("_", " ") || "Add Type" },
    { title: "Duration:", desc: formData?.duration || "Add Duration" },
    formData?.type === "live" && { title: "Subscription - Interval:", desc: formData?.interval || "Add Subscription - Interval" },
  ];
  // handle change
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // handle submit tab 1
  // Function to upload files to server

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      previous_lesson: files?.length || 0
    }))
  }, [files])

  const handleSubmitTab1 = async (e) => {
    e.preventDefault();
    setLoadingAction(pendingAction);

    const urlMap = {};
    if (video.length > 0 || thumbnail.length > 0) {
      const filesToUpload = [];
      if (video.length > 0) filesToUpload.push({ file: video[0], type: "video" });
      if (thumbnail.length > 0) filesToUpload.push({ file: thumbnail[0], type: "thumbnail" });
      console.log(thumbnail);

      try {
        const uploadedUrls = await uploadFilesToServer(filesToUpload.map(f => f.file));
        uploadedUrls.forEach((url, index) => {
          const type = filesToUpload[index].type;
          urlMap[type] = url;
        });

        if (urlMap.video) { setVideoUrl(urlMap.video); setVideo([]) };
        if (urlMap.thumbnail) { setThumbnailUrl(urlMap.thumbnail); setThumbnail([]) };
      } catch (error) {
        console.error("Upload failed", error);
        errorMessage("Failed to upload files");
        setLoadingAction(null);
        setPendingAction(null);
        return;
      }
    }

    const payload = {
      ...formData,
      previous_lesson: formData.previous_lesson
        ? parseInt(formData.previous_lesson)
        : null,
      enroll_number: formData.enroll_number
        ? parseInt(formData.enroll_number)
        : null,
      status: formData.status,
      videoUrl: urlMap.video,
      thumbnailurl: urlMap.thumbnail,
      teacher_id: Number(formData.teacher_id),
      is_free: formData.is_free,
    };
    try {
      const courseId = searchParams.get("id");
      let response;

      if (courseId) {
        response = await updateCourse({ id: courseId, data: payload });;
      } else {
        response = await addCourse(payload);
      }

      const data = response.data;

      if (data.success) {
        successMessage(courseId ? "Course Updated!" : "Course Created!");

        if (!courseId && data.courseId) {
          setSearchParams({ tab: "content", id: data.courseId });
        } else {
          handleSelected("content");
        }
      } else {
        errorMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      errorMessage("An error occurred");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };

  const handleSubmit2tab = async (e) => {
    if (e) e.preventDefault();
    setLoadingAction(pendingAction);
    if (files.length === 0) { errorMessage("Please upload at least one file"); return; };

    if (data.previous_lesson === formData.previous_lesson) {
      handleSelected("pricing");
    }
    try {

      const payload = {
        previous_lesson: formData.previous_lesson,
      };

      const response = await updateCourse({ id: courseId, data: payload });

      const data = response.data;
      if (data.success) {
        successMessage("Course Files Updated  Successfully");
        handleSelected("pricing");
      } else {
        errorMessage(data.message || "Failed to update course");
      }
    } catch (error) {
      console.error(error);
      errorMessage(error?.message || "Failed to update course");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };


  // handle submit 3rd tab
  const handleSubmit3tab = async (e) => {
    if (e) e.preventDefault();
    setLoadingAction(pendingAction);
    if (formData?.status === 'published' && files.length === 0) {
      errorMessage("Please add at least one file to publish the course.");
      return;
    };

    try {

      const payload = {
        ...formData,
        is_free: formData.is_free,
      };

      const response = await updateCourse({ id: courseId, data: payload });

      const data = response.data;
      if (data.success) {
        successMessage("Course Updated Successfully");
        navigate("/admin/courses-management");
      } else {
        errorMessage(data.message || "Failed to update course");
      }
    } catch (error) {
      console.error(error);
      errorMessage(error?.message || "Failed to update course");
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };


  const handleSubmitAddCategory = async () => {
    if (!newCategory.trim()) {
      errorMessage("Category name is required");
      return;
    }

    try {
      const res = await addCategory(newCategory);
      const data = res.data;

      if (!data.success) {
        errorMessage(data.message || "Failed to add category");
        return;
      }
      setCategories((prev) => [...prev, data.category]);
      successMessage("Category added successfully");
      setIsAddCategoryOpen(false);
      setNewCategory("");
    } catch (error) {
      console.error(error);
      errorMessage("Server error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await deleteCategory(id);
      if (res.data.success) {
        successMessage(res.data.message || "Category deleted successfully");
        return;
      }
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      console.error(error);
      errorMessage("Server error");
    }
  };

  return (
    <div className="h-full relative bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 w-full no-scrollbar top-0 bottom-0 overflow-auto">
      <FormOverlayLoader loading={isLoading || !!loadingAction} loadingText={loadingAction ? 'Saving...' : "Fetching Data..."} />
      <DashHeading
        title={"Course Builder"}
        desc={"Create a new course step by step"}
      />
      <div className="flex w-full flex-col my-3">
        <Tabs
          isDisabled={data?.course?.status !== "published"}
          className="w-full  md:inline-block py-2 opacity-100!"
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
                          {categoriesData?.categories?.map((item) => (
                            <SelectItem
                              endContent={<Button
                                size="sm"
                                variant="light"
                                color="danger"
                                isIconOnly
                                onPress={() => { handleDeleteCategory(item.id) }}
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
                        <TeacherSelect
                          onChange={(id) => handleChange("teacher_id", id)}
                        />
                      </div>
                      <div className="pt-6">
                        <Select
                          placeholder="Select Type"
                          label="Select Type"
                          labelPlacement="outside"
                          title="Select Type"
                          radius="md"
                          size="lg"
                          errorMessage="Type is required"
                          variant="bordered"
                          onSelectionChange={(k) => {
                            const keys = [...k];
                            handleChange("type", keys[0]);
                          }}
                          selectedKeys={
                            formData.type
                              ? new Set([String(formData.type)])
                              : new Set()
                          }
                        >
                          <SelectItem key="all" value="all" className="capitalize">
                            All Courses
                          </SelectItem>

                          <SelectItem description={<span title=" Pay once and get lifetime access to all course materials. Includes course player, files, and progress tracking." className="block text-xs text-gray-500">
                            Pay once and get lifetime access to all course materials. Includes course player, files, and progress tracking.
                          </span>} key="one_time" value="one_time" className="capitalize">
                            One Time Paid
                          </SelectItem>

                          <SelectItem description={<span title="Scheduled live sessions requiring subscription. Access course player, files, and track progress for each live class." className="block text-xs text-gray-500">
                            Scheduled live sessions requiring subscription. Access course player, files, and track progress for each live class.
                          </span>} key="live" value="live" className="capitalize">
                            Live Classes
                          </SelectItem>
                        </Select>
                      </div>
                      <IntervalInput
                        label="Course duration"
                        inputWidth={140}
                        className="mt-3"
                        initialValue={formData?.duration}
                        onUpdate={(interval) => handleChange("duration", interval)}
                        releasedImmediately={false}
                      />
                      {formData?.type === 'live' &&
                        <IntervalInput
                          label="Subscription Interval"
                          inputWidth={140}
                          toolTipContent={'How do want to charge student for live sessions on this course'}
                          className="mt-3"
                          initialValue={formData?.interval}
                          onUpdate={(interval) => handleChange("interval", interval)}
                          releasedImmediately={false}
                        />
                      }
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <div className="bg-white rounded-lg p-3 shadow-xl">
                      <h1 className="text-xl font-medium text-[#333333]">
                        Introduction Video
                      </h1>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload a preview video to showcase your course
                      </p>
                      <div className="py-6">
                        <div className="flex flex-col gap-4">
                          {videoUrl ? (
                            <div className="relative w-full h-[300px] overflow-hidden rounded-lg bg-black">
                              <video
                                className="w-full h-full object-contain"
                                src={videoUrl}
                                controls
                                preload="metadata"
                              >
                                Your browser does not support the video tag.
                              </video>
                              <Button
                                size="sm"
                                className="absolute top-2 right-2 bg-red-500 text-white z-10"
                                onPress={() => {
                                  setRemovedUrls([...removedUrls, videoUrl]);
                                  setVideoUrl("");
                                  setThumbnailUrl("");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <FileDropzone
                              files={video}
                              setFiles={setVideo}
                              fileType="video"
                              label="Upload Introduction Video"
                              text="Recommended: MP4, Webm format, 1280x720 pixels."
                            />
                          )}
                          {/* Video Cover Image Uploader */}
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-sm mb-2 text-gray-700">Video Cover Image (thumbnail)</h4>
                            {thumbnailUrl ? (
                              <div className="relative w-full h-40 rounded-lg overflow-hidden group border border-gray-300">
                                <Image
                                  removeWrapper
                                  src={thumbnailUrl}
                                  className="w-full h-full object-cover"
                                  alt="Video Poster"
                                />
                                <Button
                                  size="sm"
                                  color="danger"
                                  className="absolute top-2 right-2 z-10"
                                  onPress={() => { setRemovedUrls([...removedUrls, thumbnailUrl]); setThumbnailUrl(""); }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <FileDropzone
                                files={thumbnail}
                                setFiles={setThumbnail}
                                label="Upload Cover Image"
                                text="JPG/PNG, 1280x720 recommended"
                                height="150px"
                                fileType="image"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-xl mt-3">
                      <h1 className="text-xl font-medium text-[#333333]">
                        Course Preview
                      </h1>
                      <div className="py-2">
                        {coursepreview.map((item, i) => (
                          <div key={i} className="py-1 flex justify-between items-center">
                            <h1 className="text-[16px] font-medium text-[#666666]">
                              {item.title}
                            </h1>
                            <p className="text-[16px] text-end capitalize font-semibold text-[#333333]">
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
              <div className="w-full grid grid-cols-2 md:grid-cols-4 py-4 gap-2">
                {card.map((item, i) => (
                  <div key={i} className="w-full sm:flex-1 max-sm:border border-gray-300 p-3 bg-white rounded-lg">
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
              <Videos
                courseId={courseId}
                files={files}
                setFiles={setFiles}
              />
              <PdfAndNotes
                courseId={courseId}
                files={files}
                setFiles={setFiles}
              />
              <Assignments
                courseId={courseId}
                files={files}
                setFiles={setFiles}
              />
              {/* <Quizzes
                  quizzes={quizzes}
                  setQuizzes={setQuizzes}
                  onSave={(data) => setQuizzes(data)}
                /> */}
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
                    className="bg-[#06574C] w-full text-white sm:w-35"
                    type="submit"
                    onPress={handleSubmit2tab}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
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
                    Access
                  </h1>
                  <h1 className="text-xs wrap-break-word">
                    {" "}
                    Configure access rules
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
                        Access Settings
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
                            {formData.is_free ? "Free" : "Paid"}
                          </p>
                          <Switch
                            color="success"
                            aria-label="Free or Paid course"
                            isSelected={!formData.is_free}
                            onValueChange={(val) => {
                              handleChange("is_free", !val);
                              // If switching to free, set price to 0
                              if (val === false) {
                                handleChange("course_price", "0");
                              }
                            }}
                          />
                        </div>
                      </div>

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

                        <div className="flex items-center gap-3">
                          <p className="text-md text-[#06574C]">
                            {formData.status === "published" ? "Public" : "Draft"}
                          </p>
                          <Switch
                            color="success"
                            aria-label="set active status of course"
                            isSelected={formData.status === "published"}
                            onValueChange={(val) => {
                              handleChange("status", "published")

                              if (val === false) {
                                handleChange("status", "draft")
                              }
                            }}
                          />
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
                      onPress={() => { setPendingAction("save-3"); handleChange("status", "draft"); }}
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
                      isDisabled={formData?.status !== "published"}
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

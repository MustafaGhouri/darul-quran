import React, { useState } from "react";
import {
  Spinner,
  Pagination,
  Card,
  CardBody,
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Tooltip,
  Form,
  useDisclosure,
} from "@heroui/react";
import { useSelector } from "react-redux";
import {
  useGetAllAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../../../redux/api/announcements";
import { successMessage, errorMessage } from "../../../lib/toast.config";
import { dateFormatter } from "../../../lib/utils";
import { CiCalendar } from "react-icons/ci";
import { GrAdd, GrAnnounce, GrAttachment, GrClose, GrSend } from "react-icons/gr";
import { RiGroupLine } from "react-icons/ri";
import CourseSelect from "../../../components/select/CourseSelect";
import { useRef } from "react";

const Announcements = () => {
  const { user } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetAllAnnouncementQuery({
    page,
    limit: 10,
  });

  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [course, setCourse] = useState("");
  const [announcementType, setAnnouncementType] = useState("");
  const [delivery, setDelivery] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpen = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setIsFeatured(announcement.isFeatured || false);
      setCourse(announcement.courseId || "");
      setAnnouncementType(announcement.title || "");
      setDelivery(announcement.delivery || "");
      setDescription(announcement.description || "");
    } else {
      setSelectedAnnouncement(null);
      setIsFeatured(false);
      setCourse("");
      setAnnouncementType("");
      setDelivery("");
      setDescription("");
      setFiles([]);
    }
    onOpen();
  };

  const handleClose = () => {
    setSelectedAnnouncement(null);
    setIsFeatured(false);
    setCourse("");
    setAnnouncementType("");
    setDelivery("");
    setDescription("");
    setFiles([]);
    onClose();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!course || !announcementType || !description || !delivery)  {
      errorMessage("Please fill all required fields");
      return;
    }

    const payload = new FormData();
    payload.append("userId", user?.id);
    payload.append("title", announcementType);
    payload.append("description", description);
    payload.append("type", announcementType);
    payload.append("delivery", delivery);
    payload.append("isFeatured", isFeatured);
    payload.append("sendTo", "students");
    payload.append("courseId", course);
    payload.append("senderName", user?.firstName + " " + user?.lastName);
    payload.append("createdBy", user?.role);
    payload.append("date", new Date().toISOString());

    files.forEach((file) => {
      payload.append("files", file);
    });

    try {
      let result;
      if (selectedAnnouncement) {
        result = await updateAnnouncement({ id: selectedAnnouncement.id, data: payload }).unwrap();
      } else {
        result = await createAnnouncement(payload).unwrap();
      }

      if (result.success) {
        handleClose();
        successMessage(result.message);
      } else {
        errorMessage(result.message);
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Something went wrong");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Failed to load announcements
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#06574C]">All Announcements</h1>
        <Button
          color="success"
          size="md"
          startContent={<GrAdd size={20} />}
          onPress={() => handleOpen()}
        >
          Create Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner color="success" size="lg" />
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-2">
            <GrAnnounce size={40} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-500">No announcements found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.data.map((item) => (
            <Card
              key={item.id}
              className="w-full border-none shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <CardBody className="p-5">
                <div className="flex gap-4 md:gap-6">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 justify-center items-center bg-[#FBF4EC] rounded-full shadow-inner">
                    {item.createdBy === "teacher" ||
                    item.description?.toLowerCase()?.includes("schedule") ? (
                      <CiCalendar color="#D28E3D" size={24} />
                    ) : (
                      <GrAnnounce color="#06574C" size={24} />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="sm:hidden h-8 w-8 shrink-0 flex justify-center items-center bg-[#FBF4EC] rounded-full">
                          {item.createdBy === "teacher" ||
                          item.description?.toLowerCase()?.includes("schedule") ? (
                            <CiCalendar color="#D28E3D" size={16} />
                          ) : (
                            <GrAnnounce color="#06574C" size={16} />
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#06574C]">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-400 font-medium whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">
                        {dateFormatter(item.date)}
                      </span>
                    </div>

                    <p className="text-[#666666] text-sm leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap justify-between items-center pt-2 mt-2 border-t border-gray-100 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#B7721F]">
                          Created by {item.senderName || "Admin"}
                        </span>
                        {item.sendTo && (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            className="text-[10px]"
                          >
                            To: <span className="capitalize">{item.sendTo}</span>
                          </Chip>
                        )}
                        {item.courseId && (
                          <Chip
                            size="sm"
                            variant="dot"
                            color="success"
                            className="text-[10px] border-none"
                          >
                            Course Specific
                          </Chip>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(item.sendTo === "students" ||
                          item.sendTo === "all") &&
                          item.studentCount > 0 && (
                            <div className="text-[11px] flex gap-1.5 items-center bg-[#EAF3F2] px-2.5 py-1 rounded-md text-[#06574C] font-semibold border border-[#d6edea]">
                              <RiGroupLine size={14} />
                              {item.studentCount} students
                            </div>
                          )}
                        <Button
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => handleOpen(item)}
                          className="min-w-unit-0 p-1 h-auto"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            showControls
            variant="ghost"
            initialPage={1}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            total={data.totalPages}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50 text-gray-600",
              cursor: "bg-[#06574C] rounded-sm text-white",
            }}
          />
        </div>
      )}

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={handleClose}
        placement="center"
        size="md"
        scrollBehavior="inside"
        className="no-scrollbar"
      >
        <ModalContent className="rounded-xl overflow-hidden">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C] border-b border-gray-100 bg-white">
                {selectedAnnouncement
                  ? "Edit Announcement"
                  : "Create Announcement"}
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="flex flex-col h-full">
                  <Form className="p-4 flex flex-col gap-4">
                    <CourseSelect 
                      label="Select Course" 
                      initialValue={course}
                      onChange={(val) => setCourse(val)} 
                    />
                    <div className="flex gap-3 w-full">
                      <Select
                        className="w-1/2"
                        radius="md"
                        label="Announcement Type"
                        variant="bordered"
                        selectedKeys={announcementType ? [announcementType] : []}
                        onSelectionChange={(k) => setAnnouncementType([...k][0])}
                        labelPlacement="outside"
                        placeholder="Select Type"
                      >
                        <SelectItem key={"Live Class"}>Live Class</SelectItem>
                        <SelectItem key={"Assignment"}>Assignment</SelectItem>
                        <SelectItem key={"Exam"}>Exam</SelectItem>
                        <SelectItem key={"Other"}>Other</SelectItem>
                        <SelectItem key={"Holiday"}>Holiday</SelectItem>
                        <SelectItem key={"Fee"}>Fee</SelectItem>
                        <SelectItem key={"Result"}>Result</SelectItem>
                        <SelectItem key={"Information"}>Information</SelectItem>
                        <SelectItem key={"Important Notice"}>Important Notice</SelectItem>
                      </Select>
                      <Select
                        className="w-1/2"
                        radius="md"
                        label="Delivery"
                        variant="bordered"
                        selectedKeys={delivery ? [delivery] : []}
                        onSelectionChange={(k) => setDelivery([...k][0])}
                        labelPlacement="outside"
                        placeholder="Select Delivery"
                      >
                        <SelectItem key={"Email"}>Email</SelectItem>
                        <SelectItem key={"In-App"}>In-App</SelectItem>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        color="success"
                        isSelected={isFeatured}
                        onValueChange={setIsFeatured}
                      />
                      <span className="text-xs font-semibold text-gray-600">Mark as Featured</span>
                    </div>
                  </Form>
                  
                  <div className="p-4 flex flex-col gap-3">
                    {files.length > 0 && (
                      <div className="flex gap-2 w-full overflow-x-auto no-scrollbar py-1">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="relative w-16 h-16 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center shrink-0 bg-gray-50 bg-white"
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-[10px] text-center px-1 break-all line-clamp-2">
                                {file.name}
                              </span>
                            )}
                            <div
                              className="absolute -top-1 -right-1 bg-red-500 rounded-full cursor-pointer z-10 p-0.5"
                              onClick={() => removeFile(index)}
                            >
                              <GrClose size={10} color="white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea
                        variant="bordered"
                        radius="md"
                        minRows={3}
                        value={description}
                        placeholder="Write your announcement..."
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center gap-3">
                        <GrAttachment
                          className="cursor-pointer text-gray-500 hover:text-[#06574C] transition-colors"
                          size={20}
                          onClick={handleAttachmentClick}
                        />
                      </div>
                      <div 
                        onClick={() => handleSubmit()} 
                        className="absolute bottom-2.5 right-2 p-2 bg-[#06574C] text-white rounded-lg cursor-pointer hover:bg-[#05463d] transition-colors shadow-md flex items-center justify-center"
                      >
                        <GrSend size={16} />
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                  </div>
                </div>
              </ModalBody>
              <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-white rounded-b-xl">
                 <Button color="danger" variant="light" size="sm" onPress={handleClose}>
                    Close
                  </Button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Announcements;

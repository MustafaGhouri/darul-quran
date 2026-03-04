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
import { GrAdd, GrAnnounce } from "react-icons/gr";
import { RiGroupLine } from "react-icons/ri";

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

  const handleOpen = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setIsFeatured(announcement.isFeatured || false);
    } else {
      setSelectedAnnouncement(null);
      setIsFeatured(false);
    }
    onOpen();
  };

  const handleClose = () => {
    setSelectedAnnouncement(null);
    setIsFeatured(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      userId: user?.id,
      createdBy: user?.role,
      senderName: user?.firstName + " " + user?.lastName,
      isFeatured,
      date: new Date(),
    };

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
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C]">
                {selectedAnnouncement
                  ? "Edit Announcement"
                  : "Create Announcement"}
              </ModalHeader>
              <ModalBody>
                <Form className="w-full" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3 w-full">
                    <Input
                      label="Title"
                      type="text"
                      name="title"
                      labelPlacement="outside"
                      placeholder="Enter title"
                      variant="bordered"
                      defaultValue={selectedAnnouncement?.title}
                    />
                    <Textarea
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter description"
                      variant="bordered"
                      name="description"
                      defaultValue={selectedAnnouncement?.description}
                    />
                    <div className="flex justify-start gap-3 items-center w-full">
                      <Select
                        className="w-[48%]"
                        label="Delivery"
                        labelPlacement="outside"
                        placeholder="Select Delivery"
                        variant="bordered"
                        name="delivery"
                        defaultSelectedKeys={
                          selectedAnnouncement?.delivery
                            ? [selectedAnnouncement.delivery]
                            : []
                        }
                      >
                        <SelectItem key="Email">Email</SelectItem>
                        <SelectItem key="In-App">In-App</SelectItem>
                      </Select>
                      <Tooltip content="Top Featured">
                        <Switch
                          radius="sm"
                          color="success"
                          size="lg"
                          className="pt-5 w-[48%]"
                          label="Send to all"
                          placeholder="As Featured"
                          isSelected={isFeatured}
                          labelPlacement="outside"
                          name="sendToAll"
                          onValueChange={setIsFeatured}
                        />
                      </Tooltip>
                    </div>
                    <Select
                      label="Send To"
                      labelPlacement="outside"
                      placeholder="Select Audience"
                      variant="bordered"
                      name="sendTo"
                      defaultSelectedKeys={
                        selectedAnnouncement?.sendTo
                          ? [selectedAnnouncement.sendTo]
                          : []
                      }
                    >
                      <SelectItem key="all">All</SelectItem>
                      <SelectItem key="teachers">Teachers</SelectItem>
                      <SelectItem key="students">Students</SelectItem>
                      <SelectItem key="admins">Admins</SelectItem>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 items-center w-full">
                    <Button color="danger" variant="flat" onPress={handleClose}>
                      Cancel
                    </Button>
                    <Button className="bg-[#06574C] text-white" type="submit">
                      {selectedAnnouncement ? "Update" : "Create"}
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Announcements;

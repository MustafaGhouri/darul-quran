import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Textarea,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Switch,
  Tooltip,
  Form,
  Spinner,
  Skeleton,
} from "@heroui/react";
import { useSelector } from "react-redux";
import {
  BeakerIcon,
  BellRing,
  Calendar,
  Copy,
  Edit,
  ListFilterIcon,
  Mail,
  PlusIcon,
  Trash2,
} from "lucide-react";
import { successMessage, errorMessage } from "../../../lib/toast.config";
import { useEffect, useState } from "react";
import { dateFormatter, formatForInput } from "../../../lib/utils";
import Swal from "sweetalert2";
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAllAnnouncementQuery,
  useUpdateAnnouncementMutation,
} from "../../../redux/api/announcements";

const Announcements = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user, "user");

  const classes = [
    {
      id: 1,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "Email",
    },
    {
      id: 2,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Upcoming",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "In-App",
    },
    {
      id: 3,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "Email",
    },
    {
      id: 4,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Cancelled",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "In-App",
    },
    {
      id: 5,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Upcoming",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "Email",
    },
    {
      id: 6,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "In-App",
    },
    {
      id: 7,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "All",
      delivery: "Email",
    },
    {
      id: 8,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Completed",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Teachers",
      delivery: "In-App",
    },
    {
      id: 9,
      name: "Welcome Back - New Semester Updates",
      desc: "Important information for the upcoming semester",
      status: "Canceled",
      date: "2025-11-27",
      time: "Nov 20, 2025",
      sendto: "Students",
      delivery: "Email",
    },
  ];
  const statuses = [
    { key: "all", label: "All" },
    { key: "students", label: "Students" },
    { key: "teachers", label: "Teachers" },
    { key: "admins", label: "Admin" },
  ];
  const categories = [
    { key: "Web Development", label: "Web Development" },
    { key: "all", label: "All Category" },
  ];
  const filters = [
    { key: "all", label: "All" },
    { key: "Email", label: "Email" },
    { key: "In-App", label: "In-App" },
  ];
  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bannerImage, setBannerImage] = useState(null);   // { file, preview }
  const fileInputRef = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sendToFilter, setSendToFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  const { data: announcementData, isLoading: fetchLoading } = useGetAllAnnouncementQuery({
    page,
    limit,
    sendTo: sendToFilter === "all" ? undefined : sendToFilter,
    delivery: deliveryFilter === "all" ? undefined : deliveryFilter,
  });

  const [createAnnouncement, { isLoading: createLoading }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: updateLoading }] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const announcements = announcementData?.data || [];
  const totalAnnouncements = announcementData?.total || 0;
  const totalPages = announcementData?.totalPages || 1;

  const loading = fetchLoading || createLoading || updateLoading;

  const handleOpen = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setIsFeatured(announcement.isFeatured || false);
      // Show existing image as preview (URL string)
      setBannerImage(announcement.announcementFile ? { file: null, preview: announcement.announcementFile } : null);
    } else {
      setSelectedAnnouncement(null);
      setIsFeatured(false);
      setBannerImage(null);
    }
    onOpen();
  };

  const handleClose = () => {
    setSelectedAnnouncement(null);
    setIsFeatured(false);
    setBannerImage(null);
    onClose();
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerImage({ file, preview: URL.createObjectURL(file) });
  };

  const removeBanner = () => {
    setBannerImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawForm = new FormData(e.currentTarget);
    const data = Object.fromEntries(rawForm.entries());
    if (!data.description || !data.delivery || !data.sendTo || !data.title) {
      errorMessage("Please fill all fields");
      return;
    }

    // Build multipart FormData so the file is sent correctly
    const payload = new FormData();
    payload.append("userId", user?.id);
    payload.append("title", data.title);
    payload.append("description", data.description);
    payload.append("delivery", data.delivery);
    payload.append("sendTo", data.sendTo);
    payload.append("isFeatured", isFeatured);
    payload.append("createdBy", user?.role);
    payload.append("senderName", `${user?.firstName} ${user?.lastName}`);
    payload.append("date", data.date ? new Date(data.date).toISOString() : new Date().toISOString());

    // Attach new file if selected
    if (bannerImage?.file) {
      payload.append("files", bannerImage.file);
    }

    try {
      let result;
      if (selectedAnnouncement) {
        result = await updateAnnouncement({
          id: selectedAnnouncement.id,
          data: payload,
        }).unwrap();
      } else {
        result = await createAnnouncement(payload).unwrap();
      }

      if (result.success) {
        handleClose();
        successMessage(result.message);
      } else {
        errorMessage(result.message);
      }
    } catch (error) {
      errorMessage(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06574C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteAnnouncement(id).unwrap();
          if (res.success) {
            successMessage(res.message);
            Swal.fire({
              title: "Deleted!",
              text: "Your announcement has been deleted.",
              icon: "success",
              confirmButtonColor: "#06574C",
            });
          } else {
            errorMessage(res.message);
          }
        } catch (error) {
          errorMessage(error?.data?.message || "Failed to delete announcement");
        }
      }
    });
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading
        title={"Announcements"}
        desc={"Manage and send announcements to your organization"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex  items-center gap-2 max-sm:w-full">
          <Select
            label="Role"
            labelPlacement="outside"
            className="min-w-[120px] max-sm:w-full"
            radius="sm"
            selectedKeys={[sendToFilter]}
            placeholder="Select Audience"
            aria-label="Filter by Audience"
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) {
                setSendToFilter(val.toString());
                setPage(1);
              }
            }}
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Delivery Type"
            labelPlacement="outside"
            radius="sm"
            className="min-w-[120px] max-sm:w-full"
            selectedKeys={[deliveryFilter]}
            selectorIcon={<ListFilterIcon />}
            placeholder="Delivery Type"
            aria-label="Filter by Delivery Type"
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) {
                setDeliveryFilter(val.toString());
                setPage(1);
              }
            }}
          >
            {filters.map((filter) => (
              <SelectItem key={filter.key}>{filter.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Button
          startContent={<PlusIcon />}
          radius="sm"
          size="lg"
          onPress={() => handleOpen()}
          className="bg-[#06574C] text-white max-sm:w-full"
        >
          Create Announcement
        </Button>
      </div>
      <div className="">
        <Table
          removeWrapper
          classNames={{
            base: "w-full bg-white rounded-lg overflow-y-scroll overflow-x-scroll w-full no-scrollbar min-h-[calc(100vh-350px)] items-center",
            th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C936]",
            td: "py-3 items-center",
            tr: "border-b border-default-200 ",
          }}
        >
          <TableHeader>
            <TableColumn width={200} className="bg-[#EBD4C9]/30">Title / Description</TableColumn>

            <TableColumn width={120} className="bg-[#EBD4C9]/30">Created By</TableColumn>
            <TableColumn width={120} className="bg-[#EBD4C9]/30">Send To</TableColumn>
            <TableColumn width={150} className="bg-[#EBD4C9]/30">Delivery Type</TableColumn>
            <TableColumn width={180} className="bg-[#EBD4C9]/30">Date Sent</TableColumn>
            <TableColumn width={220} className="bg-[#EBD4C9]/30">Actions</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"No Announcements Found"} loadingState={loading ? "loading" : "idle"} loadingContent={<Spinner color="success" size="lg" />}>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>
                  <div className="flex items-center gap-3 max-w-[400px]">
                    {announcement.announcementFile ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img
                          src={announcement.announcementFile}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Skeleton
                        className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 break-all">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex-col flex">
                    <p
                      className={`px-3 w-full text-gray-500 text-md font-bold capitalize`}
                    >
                      {announcement.createdBy}
                    </p>
                    <p className="px-3 text-sm text-gray-500  line-clamp-2 wrap-break-word">
                      {announcement.senderName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex-col flex">
                    <p
                      className={`p-2 w-full text-center rounded-md bg-[#FBF4EC] text-[#D28E3D] capitalize`}
                    >
                      {announcement.sendTo}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p
                      startContent={
                        announcement.delivery === "Email" ? (
                          <Mail size={20} color="#06574C" />
                        ) : (
                          <BellRing size={20} color="#06574C" />
                        )
                      }
                      className={`p-2 w-full text-center rounded-md bg-[#95C4BE33] text-[#06574C] `}
                    >
                      {announcement.delivery}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{dateFormatter(announcement.date, true)}</span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="border-[#06574C] "
                    startContent={<Edit size={20} color="#06574C" />}
                    onPress={() => handleOpen(announcement)}
                  >
                    Edit
                  </Button>
                  <Button
                    radius="sm"
                    className="bg-[#06574C] text-white"
                    startContent={<Trash2 color="white" />}
                    onPress={() => handleDelete(announcement.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex max-md:flex-wrap overflow-hidden items-center p-4 gap-2 justify-between">
        <div className="flex text-sm items-center gap-1">
          <span>Showing</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={[limit.toString()]}
            placeholder="1"
            aria-label="Items per page"
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) {
                setLimit(Number(val));
                setPage(1); // Reset to first page when limit changes
              }
            }}
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of {totalAnnouncements}</span>
        </div>
        <Pagination
          className=""
          showControls
          variant="ghost"
          page={page}
          total={totalPages}
          onChange={(p) => setPage(p)}
          classNames={{
            item: "rounded-sm hover:bg-bg-[#06574C]/50",
            cursor: "bg-[#06574C] rounded-sm text-white",
            prev: "rounded-sm bg-white/80",
            next: "rounded-sm bg-white/80",
          }}
        />
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={handleClose} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#06574C]">
                {selectedAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full"
                  onSubmit={handleSubmit}
                >
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

                    {/* Banner Image Upload */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Banner Image <span className="text-xs text-gray-400">(optional)</span></label>
                      {bannerImage?.preview ? (
                        <div className="relative w-full rounded-lg overflow-hidden border border-dashed border-gray-300">
                          <img
                            src={bannerImage.preview}
                            alt="Banner preview"
                            className="w-full h-36 object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeBanner}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1 shadow text-xs font-semibold transition"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="banner-upload"
                          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#06574C] hover:bg-[#06574C]/5 transition-colors"
                        >
                          <span className="text-sm text-gray-500">Click to upload banner image</span>
                          <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                        </label>
                      )}
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerChange}
                      />
                    </div>
                    <div className="flex justify-start gap-3 items-center w-full">
                      <Select
                        className="w-[48%]"
                        label="Delivery"
                        labelPlacement="outside"
                        placeholder="Select Delivery"
                        variant="bordered"
                        name="delivery"
                        defaultSelectedKeys={selectedAnnouncement?.delivery ? [selectedAnnouncement.delivery] : []}
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
                      defaultSelectedKeys={selectedAnnouncement?.sendTo ? [selectedAnnouncement.sendTo] : []}
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
                    <Button className="bg-[#06574C] text-white" type="submit" isLoading={loading} disabled={loading}>
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

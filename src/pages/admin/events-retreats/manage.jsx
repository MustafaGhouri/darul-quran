import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Switch,
  Textarea,
} from "@heroui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import FileDropzone from "../../../components/dashboard-components/dropzone";
import { uploadFilesToServer } from "../../../lib/utils";
import {
  useCreateEventMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from "../../../redux/api/events";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const initialFormData = {
  title: "",
  image: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  location: "",
  seats: "",
  link: "",
  linkType: "registration",
  isfeatured: false,
};

const linkTypes = [
  { label: "Registration", value: "registration" },
  { label: "Information", value: "information" },
  { label: "Payment", value: "payment" },
  { label: "External", value: "external" },
];

const EventRetreatManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);

  const { data, isFetching } = useGetEventByIdQuery(id, { skip: !isEditMode });
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  useEffect(() => {
    if (!data?.data) return;

    setFormData({
      title: data.data.title || "",
      image: data.data.image || "",
      description: data.data.description || "",
      startDate: data.data.startDate || "",
      startTime: data.data.startTime || "",
      endDate: data.data.endDate || "",
      endTime: data.data.endTime || "",
      location: data.data.location || "",
      seats: String(data.data.seats ?? ""),
      link: data.data.link || "",
      linkType: data.data.linkType || "registration",
      isfeatured: Boolean(data.data.isfeatured),
    });
    setImageFiles(data.data.image ? [data.data.image] : []);
  }, [data]);

  const pageTitle = isEditMode ? "Edit Events & Retreats" : "Add Events & Retreats";
  const isSaving = isCreating || isUpdating;

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      errorMessage("Please fill in title, start, and end schedule fields");
      return;
    }

    if (!formData.seats || Number(formData.seats) < 0) {
      errorMessage("Please enter a valid number of seats");
      return;
    }

    try {
      let imageUrl = typeof imageFiles[0] === "string" ? imageFiles[0] : "";

      if (imageFiles.length > 0 && typeof imageFiles[0] !== "string" && imageFiles[0].file) {
        const uploaded = await uploadFilesToServer([imageFiles[0]]);
        imageUrl = uploaded?.[0] || "";
      }

      const payload = {
        ...formData,
        image: imageUrl,
        seats: Number(formData.seats),
      };

      const res = isEditMode
        ? await updateEvent({ id, data: payload }).unwrap()
        : await createEvent(payload).unwrap();

      if (res.success) {
        successMessage(res.message);
        navigate("/admin/events-retreats");
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to save event or retreat");
    }
  };

  if (isEditMode && isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <DashHeading
          title={pageTitle}
          desc="Create or update event and retreat details for the admin calendar."
        />
        <Button
          as={Link}
          to="/admin/events-retreats"
          variant="bordered"
          startContent={<FiArrowLeft />}
        >
          All Events & Retreats
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-5">
          <Input
            label="Title"
            placeholder="Enter event or retreat title"
            variant="bordered"
            labelPlacement="outside"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            isRequired
          />
          <Switch
            radius="sm"
            color="success"
            className="mt-3"
            isSelected={formData.isfeatured}
            onValueChange={(value) => updateField("isfeatured", value)}
          >
            {formData.isfeatured ? "Featured" : "Not Featured"}
          </Switch>
        </div>
          <div>
            <FileDropzone
            label="Upload Event Image"
            text="PNG, JPG or WEBP"
            files={imageFiles}
            setFiles={setImageFiles}
            fileType="image"
            isMultiple={false}
            maxSize={5}
            height="120px"
            showFilesNamesThere={false}
          />
          </div>
        <Textarea
          label="Description"
          placeholder="Add details about the event or retreat"
          variant="bordered"
          labelPlacement="outside"
          minRows={4}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Input
            type="date"
            label="Start Date"
            variant="bordered"
            labelPlacement="outside"
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            isRequired
          />
          <Input
            type="time"
            label="Start Time"
            variant="bordered"
            labelPlacement="outside"
            value={formData.startTime}
            onChange={(e) => updateField("startTime", e.target.value)}
            isRequired
          />
          <Input
            type="date"
            label="End Date"
            variant="bordered"
            labelPlacement="outside"
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            isRequired
          />
          <Input
            type="time"
            label="End Time"
            variant="bordered"
            labelPlacement="outside"
            value={formData.endTime}
            onChange={(e) => updateField("endTime", e.target.value)}
            isRequired
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Input
            label="Location"
            placeholder="Venue or online"
            variant="bordered"
            labelPlacement="outside"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
          <Input
            type="number"
            min="0"
            label="Seats"
            placeholder="50"
            variant="bordered"
            labelPlacement="outside"
            value={formData.seats}
            onChange={(e) => updateField("seats", e.target.value)}
            isRequired
          />
          <Select
            label="Link Type"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[formData.linkType]}
            onSelectionChange={(keys) => updateField("linkType", Array.from(keys)[0])}
          >
            {linkTypes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Link"
            placeholder="https://example.com/register"
            variant="bordered"
            labelPlacement="outside"
            value={formData.link}
            onChange={(e) => updateField("link", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button as={Link} to="/admin/events-retreats" variant="light">
            Cancel
          </Button>
          <Button
            type="submit"
            color="success"
            startContent={<FiSave />}
            isLoading={isSaving}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventRetreatManage;

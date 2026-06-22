import React, { useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { DashHeading } from "../../components/dashboard-components/DashHeading";
import {
  useCreateTestimonalMutation,
  useDeleteTestimonalMutation,
  useGetAllTestimonalsQuery,
  useUpdateTestimonalMutation,
} from "../../redux/api/testimonals";
import { errorMessage, successMessage } from "../../lib/toast.config";

const getDisplayName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "User";
};

const Testimonials = () => {
  const { user } = useSelector((state) => state.user);
  const currentUserName = getDisplayName(user);
  const { data, isLoading } = useGetAllTestimonalsQuery();
  const [createTestimonal, { isLoading: isCreating }] = useCreateTestimonalMutation();
  const [updateTestimonal, { isLoading: isUpdating }] = useUpdateTestimonalMutation();
  const [deleteTestimonal, { isLoading: isDeleting }] = useDeleteTestimonalMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTestimonal, setSelectedTestimonal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const testimonials = data?.data || [];

  const handleOpen = (testimonal = null) => {
    if (testimonal) {
      setSelectedTestimonal(testimonal);
      setFormData({
        title: testimonal.title || "",
        description: testimonal.description || "",
      });
    } else {
      setSelectedTestimonal(null);
      setFormData({
        title: "",
        description: "",
      });
    }
    onOpen();
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (!payload.title || !payload.description) {
      errorMessage("Title and description are required");
      return;
    }

    try {
      const res = selectedTestimonal
        ? await updateTestimonal({ id: selectedTestimonal.id, data: payload }).unwrap()
        : await createTestimonal(payload).unwrap();

      if (res.success) {
        successMessage(res.message);
        onClose();
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await deleteTestimonal(id).unwrap();
      if (res.success) {
        successMessage(res.message);
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to delete testimonial");
    }
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <DashHeading
          title="All Testimonials"
          desc="Create and manage testimonials for your dashboard."
        />
        <Button
          color="success"
          startContent={<FiPlus />}
          onPress={() => handleOpen()}
          className="shadow-md"
        >
          Create Testimonials
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="success" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 italic text-gray-400">
          No testimonials found. Click "Create Testimonials" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={item.image || undefined}
                    name={item.name || "User"}
                    className="shrink-0"
                  />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#333333] truncate">
                      {item.name || "User"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      User ID: {item.userId || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Tooltip content="Edit Testimonials">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-blue-500"
                      onPress={() => handleOpen(item)}
                    >
                      <FiEdit2 size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete Testimonials" color="danger">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-red-500"
                      isLoading={isDeleting}
                      onPress={() => handleDelete(item.id)}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#06574C] break-words">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#666666] leading-relaxed whitespace-pre-wrap break-words">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#06574C]">
                {selectedTestimonal ? "Edit Testimonials" : "Create Testimonials"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  isReadOnly
                  label="Name"
                  variant="bordered"
                  labelPlacement="outside"
                  value={currentUserName}
                />
                <Input
                  isRequired
                  label="Title"
                  placeholder="Enter testimonial title"
                  variant="bordered"
                  labelPlacement="outside"
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Textarea
                  isRequired
                  label="Description"
                  placeholder="Write the testimonial description"
                  variant="bordered"
                  labelPlacement="outside"
                  minRows={5}
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  isLoading={isCreating || isUpdating}
                  onPress={handleSubmit}
                >
                  {selectedTestimonal ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Testimonials;

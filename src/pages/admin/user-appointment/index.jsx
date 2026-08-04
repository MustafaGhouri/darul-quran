import React, { useState } from "react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  CalendarPlus,
  Clock,
  Mail,
  Phone,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  useGetAppointmentSlotsQuery,
  useAddAppointmentSlotMutation,
  useDeleteAppointmentSlotMutation,
  useGetAppointmentRequestsQuery,
  useUpdateAppointmentRequestStatusMutation,
} from "../../../redux/api/appointments";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor = {
  available: "success",
  booked: "warning",
  pending: "default",
  approved: "success",
  rejected: "danger",
};

function getRequestType(req) {
  const hasSlotId =
    req.slotId !== null && req.slotId !== undefined && req.slotId !== "";

  return hasSlotId
    ? { label: "Slot Booking", color: "primary" }
    : { label: "Preferred Time Enquiry", color: "warning" };
}

const UserAppointment = () => {
  const addModal = useDisclosure();
  const [form, setForm] = useState({ date: "", time: "", note: "" });

  const { data: slotsData, isLoading: slotsLoading, isFetching: slotsFetching } =
    useGetAppointmentSlotsQuery();
  const {
    data: requestsData,
    isLoading: requestsLoading,
    isFetching: requestsFetching,
  } = useGetAppointmentRequestsQuery();

  const [addSlot, { isLoading: adding }] = useAddAppointmentSlotMutation();
  const [deleteSlot] = useDeleteAppointmentSlotMutation();
  const [updateRequestStatus] = useUpdateAppointmentRequestStatusMutation();

  const slots = slotsData?.slots || [];
  const requests = requestsData?.requests || [];

  const handleAdd = async () => {
    if (!form.date || !form.time) {
      errorMessage("Please select a date and time");
      return;
    }
    try {
      const res = await addSlot({
        date: form.date,
        time: form.time,
        note: form.note,
      }).unwrap();
      successMessage(res.message || "Appointment slot added");
      setForm({ date: "", time: "", note: "" });
      addModal.onClose();
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to add appointment slot");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteSlot(id).unwrap();
      successMessage(res.message || "Appointment slot removed");
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to remove slot");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await updateRequestStatus({ id, status }).unwrap();
      successMessage(res.message || "Request updated");
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to update request");
    }
  };

  const tableClassNames = {
    base: "w-full overflow-x-auto no-scrollbar",
    th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-wide bg-[#ebd4c9]",
    td: "py-3 px-4 align-middle",
    tr: "border-b border-default-200",
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <DashHeading
          title="User Appointment"
          desc="Manage available appointment dates and review user appointment requests."
        />
        <Button
          radius="sm"
          className="bg-[#06574C] text-white"
          startContent={<CalendarPlus size={18} />}
          onPress={addModal.onOpen}
        >
          Add Appointment
        </Button>
      </div>

      {/* Available Dates */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <CalendarDays size={18} className="text-[#06574C]" />
          <h3 className="font-semibold text-[#333333]">Available Dates</h3>
        </div>
        <Table removeWrapper aria-label="Available appointment dates" classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Note</TableColumn>
            <TableColumn align="end">Action</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={slotsLoading || slotsFetching}
            loadingContent={<Spinner color="success" />}
            emptyContent="No available dates yet. Click 'Add Appointment' to create one."
          >
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell className="font-medium text-[#333333] whitespace-nowrap">
                  {formatDate(slot.date)}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2 text-gray-600">
                    <Clock size={15} className="text-[#06574C]" />
                    {slot.time}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusColor[slot.status] || "default"}
                    className="capitalize"
                  >
                    {slot.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                  {slot.note || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Tooltip content="Remove slot" color="danger">
                      <Button
                        isIconOnly
                        radius="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(slot.id)}
                      >
                        <Trash2 size={17} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Requests */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Mail size={18} className="text-[#06574C]" />
          <h3 className="font-semibold text-[#333333]">
            User Requests for Appointment
          </h3>
        </div>
        <Table removeWrapper aria-label="User appointment requests" classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>User</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Contact</TableColumn>
            <TableColumn>Preferred</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Requested</TableColumn>
            <TableColumn align="end">Action</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={requestsLoading || requestsFetching}
            loadingContent={<Spinner color="success" />}
            emptyContent="No appointment requests yet."
          >
            {requests.map((req) => {
              const requestType = getRequestType(req);

              return (
              <TableRow key={req.id}>
                <TableCell className="font-medium text-[#333333] whitespace-nowrap">
                  {req.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={requestType.color}
                  >
                    {requestType.label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm min-w-40">
                    <p className="flex items-center gap-2 text-[#333333]">
                      <Mail size={15} className="text-[#06574C]" />
                      {req.email}
                    </p>
                    {req.phone && (
                      <p className="flex items-center gap-2 text-gray-500">
                        <Phone size={15} className="text-[#06574C]" />
                        {req.phone}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                  {req.preferredDate ? formatDate(req.preferredDate) : "-"}
                  {req.preferredTime ? ` · ${req.preferredTime}` : ""}
                </TableCell>
                <TableCell className="text-sm text-gray-600 max-w-xs line-clamp-2">
                  {req.message || "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusColor[req.status] || "default"}
                    className="capitalize"
                  >
                    {req.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDateTime(req.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {req.status !== "approved" && (
                      <Button
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="success"
                        onPress={() => handleStatus(req.id, "approved")}
                      >
                        Approve
                      </Button>
                    )}
                    {req.status !== "rejected" && (
                      <Button
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => handleStatus(req.id, "rejected")}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add Appointment Modal */}
      <Modal isOpen={addModal.isOpen} onOpenChange={addModal.onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <CalendarPlus size={20} className="text-[#06574C]" />
                Add Available Appointment
              </ModalHeader>
              <ModalBody className="space-y-3">
                <Input
                  type="date"
                  label="Date"
                  radius="sm"
                  labelPlacement="outside"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
                <Input
                  type="time"
                  label="Time"
                  radius="sm"
                  labelPlacement="outside"
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                />
                <Textarea
                  label="Note (optional)"
                  radius="sm"
                  labelPlacement="outside"
                  placeholder="Any note about this slot..."
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" radius="sm" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#06574C] text-white"
                  radius="sm"
                  isLoading={adding}
                  onPress={handleAdd}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserAppointment;

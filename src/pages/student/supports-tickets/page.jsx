import React, { useState } from "react";
import {
  PlusIcon,
  Trash2,
  Eye,
  X,
  TicketIcon,
  MessageSquare,
} from "lucide-react";
import {
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input,
  Spinner,
  Chip,
  Pagination,
} from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {
  useGetMyTicketsQuery,
  useCreateTicketMutation,
  useDeleteTicketMutation,
} from "../../../redux/api/supportTickets";
import { addToast } from "@heroui/react";

const STATUS_COLORS = {
  open: { bg: "bg-[#E8F1FF]", text: "text-[#3F86F2]" },
  pending: { bg: "bg-[#FBF4EC]", text: "text-[#D28E3D]" },
  resolved: { bg: "bg-[#95C4BE33]", text: "text-[#06574C]" },
  cancelled: { bg: "bg-[#FFE8E8]", text: "text-[#E53E3E]" },
};

const SupportTicketsStudent = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);

  const createModal = useDisclosure();
  const viewModal = useDisclosure();

  const { data, isLoading, isFetching } = useGetMyTicketsQuery({ page, limit: 10 });
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();

  const tickets = data?.tickets || [];
  const totalPages = data?.totalPages || 1;

  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast({ title: "Please fill in all fields", color: "warning" });
      return;
    }
    try {
      await createTicket(formData).unwrap();
      addToast({ title: "Ticket submitted successfully!", color: "success" });
      setFormData({ title: "", description: "" });
      createModal.onClose();
    } catch (err) {
      addToast({ title: err?.data?.message || "Failed to create ticket", color: "danger" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id).unwrap();
      addToast({ title: "Ticket deleted", color: "success" });
    } catch (err) {
      addToast({ title: err?.data?.message || "Failed to delete ticket", color: "danger" });
    }
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    viewModal.onOpen();
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 h-full">
      <DashHeading
        title={"Support Tickets"}
        desc={"Submit and track your help requests"}
      />

      {/* Toolbar */}
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex flex-row justify-between items-center">
        <Select
          label="Status"
          radius="sm"
          size="sm"
          className="w-40"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="open">Open</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="resolved">Resolved</SelectItem>
          <SelectItem key="cancelled">Cancelled</SelectItem>
        </Select>

        <Button
          startContent={<PlusIcon size={20} />}
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white"
          onPress={createModal.onOpen}
        >
          New Ticket
        </Button>
      </div>

      {/* Table */}
      <Table
        removeWrapper
        classNames={{
          base: "w-full bg-white rounded-lg overflow-x-auto no-scrollbar shadow-md",
          th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
          td: "py-3 items-center whitespace-nowrap",
          tr: "border-b border-default-200",
        }}
      >
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading || isFetching}
          loadingContent={<Spinner color="success" />}
          emptyContent="No tickets found. Submit your first support ticket!"
        >
          {filteredTickets.map((ticket) => {
            const color = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
            return (
              <TableRow key={ticket.id}>
                <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                <TableCell className="font-medium text-gray-700">{ticket.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}
                  >
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      radius="sm"
                      variant="solid"
                      color="success"
                      // className="text-gray-500 hover:text-[#06574C]"
                      onPress={() => handleView(ticket)}
                      startContent={<Eye size={16} />}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      radius="sm"
                      variant="bordered"
                      color="danger"
                      // className="border-red-400 text-red-500 hover:bg-red-50/"
                      startContent={<Trash2 size={16} />}
                      isLoading={isDeleting}
                      onPress={() => handleDelete(ticket.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 pb-4">
          <Pagination
            showControls
            variant="ghost"
            page={page}
            total={totalPages}
            onChange={setPage}
            classNames={{
              item: "rounded-sm",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        </div>
      )}

      {/* ── Create Ticket Modal ── */}
      <Modal isOpen={createModal.isOpen} onOpenChange={createModal.onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <TicketIcon size={20} className="text-[#06574C]" />
                New Support Ticket
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Subject"
                  placeholder="Brief title of your issue"
                  radius="sm"
                  value={formData.title}
                  onValueChange={(v) => setFormData((p) => ({ ...p, title: v }))}
                  classNames={{ inputWrapper: "border border-gray-200" }}
                />
                <Textarea
                  label="Description"
                  placeholder="Describe your issue in detail..."
                  radius="sm"
                  minRows={4}
                  value={formData.description}
                  onValueChange={(v) => setFormData((p) => ({ ...p, description: v }))}
                  classNames={{ inputWrapper: "border border-gray-200" }}
                />
              </ModalBody>
              <ModalFooter>
                <Button radius="sm" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  radius="sm"
                  className="bg-[#06574C] text-white"
                  isLoading={isCreating}
                  onPress={handleCreate}
                >
                  Submit Ticket
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ── View Ticket Modal ── */}
      <Modal isOpen={viewModal.isOpen} onOpenChange={viewModal.onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Eye size={20} className="text-[#06574C]" />
                Ticket Details
              </ModalHeader>
              <ModalBody>
                {selectedTicket && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Subject</p>
                      <p className="font-semibold text-gray-800">{selectedTicket.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Your Description</p>
                      <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">
                        {selectedTicket.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[selectedTicket.status]?.bg
                          } ${STATUS_COLORS[selectedTicket.status]?.text}`}
                        >
                          {selectedTicket.status.charAt(0).toUpperCase() +
                            selectedTicket.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Submitted on</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedTicket.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedTicket.adminResponse ? (
                      <div>
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <MessageSquare size={12} /> Admin Response
                        </p>
                        <div className="bg-[#95C4BE20] border border-[#06574C30] rounded-lg p-3">
                          <p className="text-gray-800 text-sm">{selectedTicket.adminResponse}</p>
                          {selectedTicket.adminResponseAt && (
                            <p className="text-xs text-gray-400 mt-2">
                              Responded on{" "}
                              {new Date(selectedTicket.adminResponseAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#FBF4EC] rounded-lg p-3 text-center">
                        <p className="text-[#D28E3D] text-sm">
                          Awaiting admin response...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button radius="sm" className="bg-[#06574C] text-white" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SupportTicketsStudent;

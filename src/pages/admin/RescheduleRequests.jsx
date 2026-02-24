import { useState, useEffect } from "react";
import {
    Button,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
    Pagination,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { DashHeading } from "../../components/dashboard-components/DashHeading";
import {
    useGetRescheduleRequestsQuery,
    useApproveRescheduleRequestMutation,
    useRejectRescheduleRequestMutation,
} from "../../redux/api/reschedule";
import { errorMessage, successMessage } from "../../lib/toast.config";
import { formatTime12Hour } from "../../utils/scheduleHelpers";
import { Calendar as CalendarIcon } from "lucide-react";

const AdminRescheduleRequests = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [adminResponse, setAdminResponse] = useState("");
    const [actionType, setActionType] = useState(null);

    const { data, isLoading, refetch } = useGetRescheduleRequestsQuery({
        page: page.toString(),
        limit: "10",
        status: statusFilter,
    });

    useEffect(() => {
        if (data) {
            console.log("Reschedule Requests Data:", data);
        }
    }, [data]);

    const [approveRequest, { isLoading: isApproving }] = useApproveRescheduleRequestMutation();
    const [rejectRequest, { isLoading: isRejecting }] = useRejectRescheduleRequestMutation();

    const handleApproveClick = (request) => {
        setSelectedRequest(request);
        setActionType("approve");
        setAdminResponse(`Your reschedule request has been approved. We will create a separate session for you and notify you with the new schedule details.`);
        setIsResponseModalOpen(true);
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setActionType("reject");
        setAdminResponse("");
        setIsResponseModalOpen(true);
    };

    const handleSubmitResponse = async () => {
        if (!selectedRequest) return;

        if (actionType === "reject" && (!adminResponse || adminResponse.trim().length === 0)) {
            errorMessage("Please provide a reason for rejection");
            return;
        }

        try {
            if (actionType === "approve") {
                await approveRequest({
                    id: selectedRequest.id,
                    adminResponse,
                }).unwrap();
                successMessage("Reschedule request approved successfully");
            } else {
                await rejectRequest({
                    id: selectedRequest.id,
                    adminResponse,
                }).unwrap();
                successMessage("Reschedule request rejected");
            }
            setIsResponseModalOpen(false);
            setSelectedRequest(null);
            refetch();
        } catch (error) {
            errorMessage(error?.data?.message || "Failed to process request");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "warning",
            approved: "success",
            rejected: "danger",
            cancelled: "default",
        };
        return colors[status] || "default";
    };

    const columns = [
        { key: "student", label: "Student" },
        { key: "class", label: "Class" },
        { key: "originalSchedule", label: "Original Schedule" },
        { key: "requestedSchedule", label: "Requested Schedule" },
        { key: "reason", label: "Reason" },
        { key: "status", label: "Status" },
        { key: "requestedAt", label: "Requested At" },
        { key: "actions", label: "Actions" },
    ];

    return (
        <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 min-h-screen">
            <DashHeading
                title="Reschedule Requests"
                desc="Review and manage student reschedule requests"
            />

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center">
                <Select
                    label="Filter by Status"
                    selectedKeys={[statusFilter]}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="max-w-xs"
                    size="sm"
                >
                    <SelectItem key="all" value="all">All Requests</SelectItem>
                    <SelectItem key="pending" value="pending">Pending</SelectItem>
                    <SelectItem key="approved" value="approved">Approved</SelectItem>
                    <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
                    <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
                </Select>

                <Button
                    size="sm"
                    variant="flat"
                    onPress={() => refetch()}
                    className="bg-[#06574C] text-white"
                >
                    Refresh
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Table
                    removeWrapper
                    isHeaderSticky
                    aria-label="Reschedule Requests Table"
                    classNames={{
                        base: "w-full bg-white rounded-lg min-h-[50vh] overflow-x-scroll w-full no-scrollbar max-h-[500px] shadow-md",
                        th: "font-bold bg-[#EBD4C9] p-4 text-md text-[#333333] capitalize tracking-widest ",
                        td: "py-3 items-center whitespace-nowrap",
                        tr: "border-b border-default-200",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        loloadingContent={<Spinner color="success" />}
                        loadingState={isLoading ? 'loading' : 'idle'}
                        emptyContent={<div className="text-center py-20">
                            <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-500 text-lg">No reschedule requests found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {statusFilter !== "all"
                                    ? `Try changing the filter from "${statusFilter}" to "all"`
                                    : "Students haven't submitted any requests yet"}
                            </p>
                        </div>}
                        items={data.requests || []}>
                        {(request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-sm">{request.studentName}</p>
                                        <p className="text-xs text-gray-500">{request.studentEmail}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-sm">{request.scheduleTitle}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(request.scheduleDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p>
                                            {new Date(request.scheduleDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-500">
                                            {formatTime12Hour(request.scheduleStartTime)}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p className="font-medium text-[#06574C]">
                                            {new Date(request.requestedDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-500">
                                            {formatTime12Hour(request.requestedStartTime)} -{" "}
                                            {formatTime12Hour(request.requestedEndTime)}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm max-w-xs truncate" title={request.reason}>
                                        {request.reason || "-"}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Chip size="sm" variant="flat" color={getStatusColor(request.status)}>
                                        {request.status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm">
                                        {new Date(request.requestedAt).toLocaleDateString()}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        {request.status === "pending" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    onPress={() => handleApproveClick(request)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => handleRejectClick(request)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {request.status !== "pending" && (
                                            <Chip size="sm" variant="flat">
                                                {request.status}
                                            </Chip>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {data.totalPages > 1 && (
                    <div className="flex justify-center mt-4 p-4">
                        <Pagination
                            total={data.totalPages}
                            page={page}
                            onChange={setPage}
                            color="primary"
                            showControls
                        />
                    </div>
                )}
            </div>

            <Modal
                isOpen={isResponseModalOpen}
                onClose={() => setIsResponseModalOpen(false)}
                size="md"
            >
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-lg font-semibold">
                            {actionType === "approve" ? "Approve Request" : "Reject Request"}
                        </h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedRequest && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Student:</strong> {selectedRequest.studentName}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Class:</strong> {selectedRequest.scheduleTitle}
                                </p>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Requested Schedule:</p>
                                    <p className="text-sm font-medium">
                                        {new Date(selectedRequest.requestedDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                        {formatTime12Hour(selectedRequest.requestedStartTime)} -{" "}
                                        {formatTime12Hour(selectedRequest.requestedEndTime)}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Textarea
                            label={actionType === "approve" ? "Approval Message" : "Rejection Reason"}
                            placeholder={
                                actionType === "approve"
                                    ? "Add a message for the student (optional)"
                                    : "Please provide a reason for rejection"
                            }
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            minRows={4}
                            isRequired={actionType === "reject"}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => setIsResponseModalOpen(false)}
                            isDisabled={isApproving || isRejecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={actionType === "approve" ? "success" : "danger"}
                            onPress={handleSubmitResponse}
                            isLoading={isApproving || isRejecting}
                        >
                            {isApproving || isRejecting ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AdminRescheduleRequests;

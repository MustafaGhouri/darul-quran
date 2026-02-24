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
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

    const { data, isLoading, refetch } = useGetRescheduleRequestsQuery({
        page: page.toString(),
        limit: "10",
        status: statusFilter,
    });

    // Debug: Log data when it changes
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
        setAdminResponse("Your reschedule request has been approved.");
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

            {/* Debug: Remove after testing */}
            {/* {JSON.stringify(data, null, 2)} */}
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="primary" />
                    </div>
                ) : !data?.requests || data.requests.length === 0 ? (
                    <div className="text-center py-20">
                        <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-500 text-lg">No reschedule requests found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {statusFilter !== "all" 
                                ? `Try changing the filter from "${statusFilter}" to "all"` 
                                : "Students haven't submitted any requests yet"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#EBD4C9]">
                                    <tr>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Student</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Class</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Original Schedule</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Requested Schedule</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Reason</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Status</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Requested At</th>
                                        <th className="p-4 text-left font-bold text-[#333333] capitalize">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.requests.map((request) => (
                                        <tr key={request.id} className="border-b border-default-200 hover:bg-gray-50">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-sm">{request.studentName}</p>
                                                    <p className="text-xs text-gray-500">{request.studentEmail}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-sm">{request.scheduleTitle}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(request.scheduleDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p>
                                                        {new Date(request.scheduleDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        {formatTime12Hour(request.scheduleStartTime)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-medium text-[#06574C]">
                                                        {new Date(request.requestedDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        {formatTime12Hour(request.requestedStartTime)} -{" "}
                                                        {formatTime12Hour(request.requestedEndTime)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm max-w-xs truncate" title={request.reason}>
                                                    {request.reason || "-"}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <Chip size="sm" variant="flat" color={getStatusColor(request.status)}>
                                                    {request.status}
                                                </Chip>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm">
                                                    {new Date(request.requestedAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
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
                    </>
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

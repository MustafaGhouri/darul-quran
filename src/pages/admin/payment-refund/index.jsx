/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Pagination,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  Tooltip
} from "@heroui/react";

import { errorMessage, successMessage } from "../../../lib/toast.config";
import {
  useGetAdminRefundRequestsQuery,
  useGetAdminPaymentHistoryQuery,
  useProcessRefundActionMutation
} from "../../../redux/api/payments";
import { debounce } from "../../../lib/utils";

const PaymentsRefunds = () => {
  const [refundPage, setRefundPage] = useState(1);
  const [refundLimit, setRefundLimit] = useState(20);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentLimit, setPaymentLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redux queries
  const { data: refundData, isLoading: refundsLoading, refetch: refetchRefunds } = useGetAdminRefundRequestsQuery({
    page: refundPage,
    limit: refundLimit,
    search: searchQuery,
    status: statusFilter
  });

  const { data: paymentData, isLoading: paymentsLoading, refetch: refetchPayments } = useGetAdminPaymentHistoryQuery({
    page: paymentPage,
    limit: paymentLimit
  });

  const [processRefundAction, { isLoading: actionLoading }] = useProcessRefundActionMutation();

  // Admin Notes Modal
  const { isOpen: isNotesOpen, onOpen: onNotesOpen, onOpenChange: onNotesOpenChange } = useDisclosure();
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const refundRequests = refundData?.requests || [];
  const refundTotal = refundData?.total || 0;
  const refundTotalPages = refundData?.totalPages || 1;

  const allPayments = paymentData?.history || [];
  const paymentTotal = paymentData?.total || 0;
  const paymentTotalPages = paymentData?.totalPages || 1;

  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  const openActionModal = (refundId, action) => {
    setSelectedRefundId(refundId);
    setPendingAction(action);
    setAdminNotes("");
    onNotesOpen();
  };

  const handleAction = async (onClose) => {
    if (!selectedRefundId || !pendingAction) return;

    try {
      const res = await processRefundAction({
        refundRequestId: selectedRefundId,
        action: pendingAction,
        adminNotes: adminNotes.trim() || null
      });

      if (res.error) {
        throw new Error(res?.error?.data?.message);
      }

      successMessage(res.data.message);
      onClose();
      refetchRefunds();
      refetchPayments();
    } catch (error) {
      errorMessage(error?.message);
    }
  };

  const handleSearch = () => {
    setRefundPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const refundHeader = [
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course" },
    { key: "reason", label: "Reason" },
    { key: "amount", label: "Amount" },
    { key: "requestedAt", label: "Requested Date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" }
  ];

  const paymentHeader = [
    { key: "studentName", label: "Students Name" },
    { key: "courseName", label: "Course Name" },
    { key: "amountPaid", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "type", label: "Type" },
    { key: "date", label: "Date" },
    { key: "invoice", label: "Invoice" },
  ];

  const statusFilters = [
    { key: "all", label: "All Status" },
    { key: "requested", label: "Requested" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "processing", label: "Processing" },
    { key: "refunded", label: "Refunded" },
    { key: "failed", label: "Failed" }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested':
        return 'bg-[#F1C2AC33] text-[#D28E3D]';
      case 'approved':
      case 'processing':
        return 'bg-[#FDEBD0] text-[#D68910]';
      case 'refunded':
        return 'bg-[#95C4BE33] text-[#06574C]';
      case 'rejected':
      case 'failed':
        return 'bg-[#FFEAEC] text-[#E8505B]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-10 h-screen overflow-y-auto">
      <DashHeading
        title={"Payment & Refund"}
        desc={"Keep track of all payments and refunds with transparency and ease"}
      />

      {/* REFUND REQUESTS SECTION */}
      <div className="bg-white p-3 my-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
          <h1 className="text-xl font-bold text-red-600">Refund Requests</h1>
          <div className="flex gap-2 max-md:flex-wrap">
            <Input
              placeholder="Search by student/course..."
              defaultValue={searchQuery}
              onValueChange={(e) => debounce(() => setSearchQuery(e), 500)}
              onKeyDown={handleSearchKeyDown}
              startContent={<Search size={18} className="text-gray-400" />}
              className="max-w-sm"
              radius="sm"
              size="sm"
            />
            <Select
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] || 'all')}
              className="max-w-48"
              size="sm"
              radius="sm"
            >
              {statusFilters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
            <Button size="sm" variant="flat" onPress={refetchRefunds}>Refresh</Button>
          </div>
        </div>

        <div className="mt-3">
          <Table
            isHeaderSticky
            aria-label="Refund requests table"
            removeWrapper
            classNames={{
              base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar mb-3",
              th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
              td: "py-3 items-center whitespace-nowrap",
              tr: "border-b border-default-200 ",
            }}
          >
            <TableHeader>
              {refundHeader.map((h) => (
                <TableColumn key={h.key}>{h.label}</TableColumn>
              ))}
            </TableHeader>

            <TableBody
              emptyContent="No refund requests found"
              loadingState={refundsLoading ? "loading" : "idle"}
              loadingContent={<Spinner color="success" />}
              items={refundRequests || []}
            >
              {((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold text-sm">{item.studentName}</p>
                      <p className="text-xs text-gray-500">{item.studentEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.courseName}</TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-sm">
                    <Tooltip content={item.reason}>
                      <span className="line-clamp-1 cursor-pointer">{item.reason}</span>
                    </Tooltip>
                    {item.adminNotes && (
                      <div className="mt-1 text-xs text-gray-400 italic">
                        Admin: {item.adminNotes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>£{item.amount}</TableCell>
                  <TableCell>{new Date(item.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      className={getStatusColor(item.status)}
                      variant="flat"
                    >
                      {item.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {item.status === 'requested' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#06574C] text-white"
                          onPress={() => openActionModal(item.id, 'approve')}
                          isLoading={actionLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="bordered"
                          onPress={() => openActionModal(item.id, 'reject')}
                          isLoading={actionLoading}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {item.status !== 'requested' && (
                      <span className="text-xs text-gray-400">
                        {item.status === 'refunded' ? 'Completed' : 'Processed'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="md:flex items-center pb-4 gap-2 justify-between overflow-hidden mt-4">
            <div className="flex text-sm items-center gap-1">
              <span>Limit</span>
              <Select
                radius="sm"
                className="w-[70px]"
                selectedKeys={[String(refundLimit)]}
                onSelectionChange={(keys) => {
                  setRefundLimit(Number(Array.from(keys)[0]));
                  setRefundPage(1);
                }}
              >
                {limits.map((l) => (
                  <SelectItem key={l.key}>{l.label}</SelectItem>
                ))}
              </Select>
              <span className="min-w-56">Out of {refundTotal}</span>
            </div>
            <Pagination
              showControls
              variant="ghost"
              page={refundPage}
              total={refundTotalPages}
              onChange={(newPage) => setRefundPage(newPage)}
              classNames={{
                item: "rounded-sm hover:bg-bg-[#06574C]/50",
                cursor: "bg-[#06574C] rounded-sm text-white",
                prev: "rounded-sm bg-white/80",
                next: "rounded-sm bg-white/80",
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 my-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">Student Payments</h1>
          <Button size="sm" variant="light" onPress={refetchPayments}>Refresh History</Button>
        </div>
        <Table
          isHeaderSticky
          aria-label="Student Payments History table"
          removeWrapper
          classNames={{
            base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar mb-3",
            th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
            td: "py-3 items-center whitespace-nowrap",
            tr: "border-b border-default-200 ",
          }}
        >
          <TableHeader>
            {paymentHeader.map((h) => (
              <TableColumn key={h.key}>{h.label}</TableColumn>
            ))}
          </TableHeader>

          <TableBody
            emptyContent="No payment history found"
            loadingState={paymentsLoading ? "loading" : "idle"}
            loadingContent={<Spinner color="success" />}
            items={allPayments || []}
          >
            {((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-bold text-sm">{item.studentName}</p>
                    <p className="text-xs text-gray-500">{item.studentEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{item.courseName}</TableCell>
                <TableCell>£{item.amountPaid}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Chip
                      size="sm"
                      className="text-white"
                      color={
                        item.status === 'paid' || item.status === 'completed'
                          ? 'success'
                          : item.status === 'refunded'
                            ? 'danger'
                            : item.status === 'open' || item.status === 'pending'
                              ? 'warning'
                              : 'default'
                      }
                    >
                      {item.status ? item.status.toUpperCase() : 'UNKNOWN'}
                    </Chip>
                    {item.refundStatus && item.refundStatus !== 'none' && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-fit ${item.refundStatus === 'refunded'
                        ? 'bg-[#95C4BE33] text-[#06574C]'
                        : item.refundStatus === 'rejected' || item.refundStatus === 'failed'
                          ? 'bg-[#FFEAEC] text-[#E8505B]'
                          : item.refundStatus === 'processing' || item.refundStatus === 'pending_refund'
                            ? 'bg-[#FDEBD0] text-[#D68910]'
                            : 'bg-[#F1C2AC33] text-[#D28E3D]'
                        }`}>
                        Refund: {item.refundStatus}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 capitalize">
                    {item.type === 'live' ? 'Subscription' : 'One-time'}
                  </span>
                </TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {item.receiptUrl || item.invoicePdf ? (
                    <Button
                      size="sm"
                      isIconOnly
                      variant="ghost"
                      onPress={() => window.open(item.receiptUrl || item.invoicePdf, '_blank')}
                    >
                      <Download size={16} className="text-gray-600" />
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="md:flex items-center pb-4 gap-2 justify-between overflow-hidden mt-4">
          <div className="flex text-sm items-center gap-1">
            <span>Limit</span>
            <Select
              radius="sm"
              className="w-[70px]"
              selectedKeys={[String(paymentLimit)]}
              onSelectionChange={(keys) => {
                setPaymentLimit(Number(Array.from(keys)[0]));
                setPaymentPage(1);
              }}
            >
              {limits.map((l) => (
                <SelectItem key={l.key}>{l.label}</SelectItem>
              ))}
            </Select>
            <span className="min-w-56">Out of {paymentTotal}</span>
          </div>
          <Pagination
            showControls
            variant="ghost"
            page={paymentPage}
            total={paymentTotalPages}
            onChange={(newPage) => setPaymentPage(newPage)}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        </div>
      </div>

      {/* Admin Notes Modal */}
      <Modal isOpen={isNotesOpen} onOpenChange={onNotesOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {pendingAction === 'approve' ? 'Approve Refund' : 'Reject Refund'}
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500 mb-2">
                  {pendingAction === 'approve'
                    ? 'This will initiate the refund process. Add optional admin notes below.'
                    : 'This will reject the refund request. Please provide a reason.'}
                </p>
                <Textarea
                  label="Admin Notes"
                  placeholder={
                    pendingAction === 'approve'
                      ? 'Optional notes (e.g., approved by manager)'
                      : 'Reason for rejection'
                  }
                  value={adminNotes}
                  onValueChange={setAdminNotes}
                  minRows={3}
                  isRequired={pendingAction === 'reject'}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color={pendingAction === 'approve' ? 'success' : 'danger'}
                  isLoading={actionLoading}
                  onPress={() => handleAction(onClose)}
                >
                  {pendingAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
};

export default PaymentsRefunds;

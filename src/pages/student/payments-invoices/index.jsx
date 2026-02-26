/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input
} from "@heroui/react";
import {
  Download,
  EyeIcon,
  ListFilterIcon,
  Search
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import * as motion from "motion/react-client";

import { errorMessage, successMessage } from "../../../lib/toast.config";
import {
  useGetPaymentHistoryQuery,
  useGetMyRefundRequestsQuery,
  useRequestRefundMutation
} from "../../../redux/api/payments";
import { debounce } from "../../../lib/utils";

const PaymentsInvoices = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refundPage, setRefundPage] = useState(1);
  const [refundLimit, setRefundLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Redux Toolkit queries
  const { data: paymentData, isLoading: paymentsLoading } = useGetPaymentHistoryQuery({ page, limit });
  const { data: refundRequestsData, isFetching: refundRequestsLoading, refetch: refetchRefundRequests } = useGetMyRefundRequestsQuery({
    page: refundPage,
    limit: refundLimit,
    search: searchQuery
  });
  const [requestRefund, { isLoading: refundLoading }] = useRequestRefundMutation();

  // Refund Modal State
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [refundReason, setRefundReason] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Extract data from Redux responses
  const invoices = paymentData?.invoices || [];
  const total = paymentData?.total || 0;
  const totalPages = paymentData?.totalPages || 1;

  const refundRequests = refundRequestsData?.enrollments || [];
  const refundTotal = refundRequestsData?.total || 0;
  const refundTotalPages = refundRequestsData?.totalPages || 1;

  const openRefundModal = (invoice) => {
    setSelectedInvoice(invoice);
    setRefundReason("");
    onOpen();
  };

  const submitRefund = async (onClose) => {
    if (!refundReason.trim()) {
      errorMessage("Please enter a reason");
      return;
    }

    try {
      const res = await requestRefund({
        courseId: selectedInvoice.courseId,
        reason: refundReason
      });

      if (res.error) {
        throw new Error(res?.error?.data?.message);
      }
      successMessage(res.data.message);
      onClose();
    } catch (error) {
      errorMessage(error?.message);
    }
  };

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];

  const header = [
    { key: "Course Name", label: "Course Name" },
    { key: "Date", label: "Date" },
    { key: "Prices", label: "Prices" },
    { key: "Payment Method", label: "Payment Method" },
    { key: "Status", label: "Status" },
    { key: "Type", label: "Type" },
    { key: "Action", label: "Action" },
  ];

  const refundHeader = [
    { key: "Course Name", label: "Course Name" },
    { key: "Request Date", label: "Request Date" },
    { key: "Amount", label: "Amount" },
    { key: "Reason", label: "Reason" },
    { key: "Status", label: "Status" },
  ];

  const limits = [
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];

  // Check if invoice is refundable
  const isRefundable = (invoice) => {
    if (!invoice.stripePaymentIntentId) return false;
    if (invoice.status !== 'paid' && invoice.status !== 'completed') return false;
    // Check if refund is already requested or processed
    const refundStatus = invoice.refundStatus?.toLowerCase();
    if (refundStatus && refundStatus !== 'none' && refundStatus !== 'requested') return false;
    return true;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested':
        return 'bg-[#F1C2AC33] text-[#D28E3D]';
      case 'processing':
      case 'pending_refund':
        return 'bg-[#FDEBD0] text-[#D68910]';
      case 'refunded':
        return 'bg-[#95C4BE33] text-[#06574C]';
      case 'rejected':
      case 'failed':
        return 'bg-[#FFEAEC] text-[#E8505B]';
      default:
        return 'bg-[#F1C2AC33] text-[#D28E3D]';
    }
  };

  const getRefundStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested':
        return 'Requested';
      case 'processing':
      case 'pending_refund':
        return 'Processing';
      case 'refunded':
        return 'Refunded';
      case 'rejected':
        return 'Rejected';
      case 'failed':
        return 'Failed';
      default:
        return status;
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

  return (
    <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 h-screen px-2 sm:px-3 overflow-y-auto">
      <DashHeading
        title={"Payments & Invoices"}
        desc={"Keep track of all payments with transparency and ease"}
      />

      {/* Invoices Table */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-[#06574C] mb-3">All Invoices</h2>
        <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
          <div className="flex max-md:flex-wrap items-center gap-2 max-md:w-full">
            <Select
              className="w-full md:min-w-[120px]"
              radius="sm"
              defaultSelectedKeys={["all"]}
              placeholder="Select status"
            >
              {statuses.map((status) => (
                <SelectItem key={status.key}>{status.label}</SelectItem>
              ))}
            </Select>
            <Select
              radius="sm"
              className="w-full md:min-w-[120px]"
              defaultSelectedKeys={["all"]}
              selectorIcon={<ListFilterIcon />}
              placeholder="Filter"
            >
              {filters.map((filter) => (
                <SelectItem key={filter.key}>{filter.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Table
              isHeaderSticky
              aria-label="Payments table"
              removeWrapper
              classNames={{
                base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar mb-3",
                th: "font-bold p-4 text-md text-[#333333] capitalize tracking-widest bg-[#EBD4C936]",
                td: "py-3 items-center whitespace-nowrap",
                tr: "border-b border-default-200 ",
              }}
            >
              <TableHeader>
                {header.map((item) => (
                  <TableColumn key={item.key}>{item.label}</TableColumn>
                ))}
              </TableHeader>

              <TableBody
                emptyContent="No payments found"
                loadingState={paymentsLoading ? "loading" : "idle"}
                loadingContent={<Spinner color="success" />}
              >
                {invoices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.courseName || "Course"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                          {item.description || item.billingReason || "Payment"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt || item.date).toLocaleDateString()}</TableCell>
                    <TableCell>${(item.amountPaid || item.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <img src="/icons/Visa.svg" alt="Card" className="w-8" />
                        •••• 4242
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button className={`text-sm p-2 rounded-md capitalize h-8 ${item.status === "paid" || item.status === "completed"
                          ? "bg-[#95C4BE33] text-[#06574C]"
                          : item.status === "pending" || item.status === "open"
                            ? "bg-[#F1C2AC33] text-[#D28E3D]"
                            : "bg-[#FFEAEC] text-[#E8505B]"
                          }`}>
                          {item.status || "Unknown"}
                        </Button>
                        {item.refundStatus && item.refundStatus !== 'none' && (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-fit ${
                            item.refundStatus === 'refunded' 
                              ? 'bg-[#95C4BE33] text-[#06574C]'
                              : item.refundStatus === 'rejected' || item.refundStatus === 'failed'
                                ? 'bg-[#FFEAEC] text-[#E8505B]'
                                : item.refundStatus === 'processing' || item.refundStatus === 'pending_refund'
                                  ? 'bg-[#FDEBD0] text-[#D68910]'
                                  : 'bg-[#F1C2AC33] text-[#D28E3D]'
                          }`}>
                            Refund: {getRefundStatusText(item.refundStatus)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 capitalize">
                        {item.type === 'live' ? 'Subscription' : 'One-time'}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {(item.hostedInvoiceUrl || item.invoicePdf || item.receiptUrl) ? (
                        <Button
                          radius="sm"
                          className="bg-[#06574C] text-white"
                          onPress={() => window.open(item.hostedInvoiceUrl || item.invoicePdf || item.receiptUrl, '_blank')}
                          startContent={<EyeIcon size={18} color="white" />}
                        >
                          View Invoice
                        </Button>
                      ) : (
                        <Button radius="sm" isDisabled variant="flat">
                          No Invoice
                        </Button>
                      )}

                      {isRefundable(item) && (
                        <Button
                          variant="ghost"
                          color="danger"
                          radius="sm"
                          onPress={() => openRefundModal(item)}
                        >
                          Request Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </AnimatePresence>

        <div className="md:flex items-center pb-4 gap-2 justify-between overflow-hidden">
          <div className="flex text-sm items-center gap-1">
            <span>Showing</span>
            <Select
              radius="sm"
              className="w-[70px]"
              selectedKeys={[String(limit)]}
              placeholder="1"
              onSelectionChange={(keys) => {
                const newLimit = Number(Array.from(keys)[0]);
                setLimit(newLimit);
                setPage(1);
              }}
            >
              {limits.map((limit) => (
                <SelectItem key={limit.key}>{limit.label}</SelectItem>
              ))}
            </Select>
            <span className="min-w-56">Out of {total}</span>
          </div>
          <Pagination
            className=""
            showControls
            variant="ghost"
            page={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
            classNames={{
              item: "rounded-sm hover:bg-bg-[#06574C]/50",
              cursor: "bg-[#06574C] rounded-sm text-white",
              prev: "rounded-sm bg-white/80",
              next: "rounded-sm bg-white/80",
            }}
          />
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#06574C] mb-3">My Refund Requests</h2>

        <div className="bg-[#EBD4C9] p-2 sm:p-4 rounded-lg mb-3">
          <Input
            placeholder="Search by course name..."
            defaultValue={searchQuery}
            onValueChange={(e) => debounce(() => setSearchQuery(e), 500)}
            onKeyDown={handleSearchKeyDown}
            startContent={<Search size={18} className="text-gray-400" />}
            className="max-w-sm"
            radius="sm"
            type="search"
          />
        </div>

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
            {refundHeader.map((item) => (
              <TableColumn key={item.key}>{item.label}</TableColumn>
            ))}
          </TableHeader>

          <TableBody
            emptyContent="No refund requests found"
            loadingState={refundRequestsLoading ? "loading" : "idle"}
            loadingContent={<Spinner color="success" />}
          >
            {refundRequests.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4">
                  <div className="font-medium text-gray-900">
                    {item.courseName || "Course"}
                  </div>
                </TableCell>
                <TableCell>{new Date(item.createdAt || item.enrolledAt).toLocaleDateString()}</TableCell>
                <TableCell>${(item.amountPaid || item.amount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="max-w-[250px] text-sm text-gray-600 truncate" title={item.refundReason}>
                    {item.refundReason || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Button className={`text-sm p-2 rounded-md capitalize h-8 ${getStatusColor(item.refundStatus)}`}>
                    {item.refundStatus || "Unknown"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="md:flex items-center pb-4 gap-2 justify-between overflow-hidden">
          <div className="flex text-sm items-center gap-1">
            <span>Showing</span>
            <Select
              radius="sm"
              className="w-[70px]"
              selectedKeys={[String(refundLimit)]}
              placeholder="1"
              onSelectionChange={(keys) => {
                const newLimit = Number(Array.from(keys)[0]);
                setRefundLimit(newLimit);
                setRefundPage(1);
              }}
            >
              {limits.map((limit) => (
                <SelectItem key={limit.key}>{limit.label}</SelectItem>
              ))}
            </Select>
            <span className="min-w-56">Out of {refundTotal}</span>
          </div>
          <Pagination
            className=""
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

      <div className="text-center text-xs text-gray-500 mt-4 pb-4 font-style-italic">
        Note: "Classes will resume after the next successful payment inshaAllah."
      </div>

      {/* Refund Request Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Request Refund</ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500 mb-2">
                  Please provide a reason for your refund request. Our team will review it shortly.
                </p>
                <Textarea
                  label="Reason"
                  placeholder="Enter your reason here..."
                  value={refundReason}
                  onValueChange={setRefundReason}
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  isLoading={refundLoading}
                  onPress={() => submitRefund(onClose)}
                >
                  Submit Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PaymentsInvoices;

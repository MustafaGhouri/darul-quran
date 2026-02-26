/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Download, Upload, Filter, ListFilter } from "lucide-react";
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
  Chip
} from "@heroui/react";

import { errorMessage, successMessage } from "../../../lib/toast.config";

const PaymentsRefunds = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchRefunds();
    fetchAllHistory();
  }, []);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment/admin/refunds`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setRefundRequests(data.requests);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchAllHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment/admin/history`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAllPayments(data.history);
    } catch (e) { console.error(e); }
  };

  const handleAction = async (id, action) => {
    const confirm = window.confirm(`Are you sure you want to ${action} this request?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/payment/admin/refund-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enrollmentId: id, action })
      });
      const data = await res.json();
      if (data.success) {
        successMessage(data.message);
        fetchRefunds(); // Refresh requests
        fetchAllHistory(); // Refresh history too
      } else {
        errorMessage(data.message);
      }
    } catch (e) {  errorMessage("Error"); }
  };

  const refundHeader = [
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course" },
    { key: "reason", label: "Reason" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
    { key: "action", label: "Action" }
  ];

  const Paymentheader = [
    { key: "studentName", label: "Students Name" },
    { key: "courseName", label: "Course Name" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "invoice", label: "Invoice" },
  ];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 pb-10 h-screen overflow-y-auto">
      <DashHeading
        title={"Payment & Refund"}
        desc={"Keep track of all payments and refunds with transparency and ease"}
      />

      {/* REFUND REQUESTS SECTION (DYNAMIC) */}
      <div className="bg-white p-3 my-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:justify-between  md:items-center ">
          <h1 className="text-xl font-bold text-red-600">Refund Requests (Action Required)</h1>
          <Button size="sm" variant="flat" onPress={fetchRefunds}>Refresh</Button>
        </div>
        <div className="mt-3">
          {loading ? <Spinner /> : refundRequests.length === 0 ? <p className="text-gray-500 py-4">No pending refund requests.</p> :
            <Table aria-label="Refund Requests" removeWrapper>
              <TableHeader>
                {refundHeader.map((h) => <TableColumn key={h.key}>{h.label}</TableColumn>)}
              </TableHeader>
              <TableBody>
                {refundRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-sm">{item.studentName}</p>
                        <p className="text-xs text-gray-500">{item.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.courseName}</TableCell>
                    <TableCell className="max-w-xs whitespace-normal text-sm">{item.reason}</TableCell>
                    <TableCell>${item.amount}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-[#06574C] text-white" onPress={() => handleAction(item.id, 'approve')}>Approve</Button>
                        <Button size="sm" color="danger" variant="bordered" onPress={() => handleAction(item.id, 'reject')}>Reject</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </div>
      </div>

      {/* ALL PAYMENTS HISTORY (DYNAMIC) */}
      <div className="bg-white p-3 my-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">All Payments (History)</h1>
          <Button size="sm" variant="light" onPress={fetchAllHistory}>Refresh History</Button>
        </div>

        {allPayments.length === 0 ? <p className="text-gray-500 p-4">No payment history found.</p> :
          <Table aria-label="Payment History" removeWrapper>
            <TableHeader>
              {Paymentheader.map((h) => <TableColumn key={h.key}>{h.label}</TableColumn>)}
            </TableHeader>
            <TableBody>
              {allPayments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.studentName}</TableCell>
                  <TableCell>{item.courseName}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      className="text-white"
                      color={item.status === 'completed' ? 'success' : item.status === 'refunded' ? 'danger' : 'warning'}
                    >
                      {item.status ? item.status.toUpperCase() : 'UNKNOWN'}
                    </Chip>
                  </TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {item.receiptUrl ? (
                      <Button size="sm" isIconOnly variant="ghost" onPress={() => window.open(item.receiptUrl, '_blank')}>
                        <Download size={16} className="text-gray-600" />
                      </Button>
                    ) : <span className="text-xs text-gray-400">N/A</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>

    </div>
  );
};

export default PaymentsRefunds;

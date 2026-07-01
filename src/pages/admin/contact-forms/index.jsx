import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
  useDisclosure,
} from "@heroui/react";
import { Eye, Mail, MessageSquareText, Phone, Search } from "lucide-react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { useGetContactSubmissionsQuery } from "../../../redux/api/contactForms";
import { debounce } from "../../../lib/utils";

const formatDate = (value) => {
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

const ContactForms = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const viewModal = useDisclosure();

  const { data, isLoading, isFetching } = useGetContactSubmissionsQuery({
    page,
    limit: 10,
    search,
  });

  const submissions = data?.submissions || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const stats = useMemo(
    () => [
      { label: "Total submissions", value: total },
      { label: "This page", value: submissions.length },
      { label: "Page", value: `${page} of ${totalPages}` },
    ],
    [page, submissions.length, total, totalPages]
  );

  const handleSearch = (value) => {
    debounce(() => {
      setPage(1);
      setSearch(value);
    }, 400);
  };

  const openSubmission = (submission) => {
    setSelectedSubmission(submission);
    viewModal.onOpen();
  };

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <DashHeading
          title="View Contact Forms"
          desc="View website contact form submissions from prospective students and visitors."
        />
        <Input
          type="search"
          radius="sm"
          placeholder="Search name, email, phone, subject..."
          className="w-full lg:max-w-sm"
          startContent={<Search size={18} className="text-gray-400" />}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {stats.map((item) => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold text-[#06574C] mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-3">
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-10 bg-white rounded-lg">
            <Spinner color="success" />
          </div>
        )}

        {!isLoading && !isFetching && submissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100 text-gray-500">
            No contact forms found.
          </div>
        )}

        {!isLoading &&
          submissions.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[#333333] truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(item.createdAt)}</p>
                </div>
                <Button isIconOnly radius="sm" size="sm" variant="flat" onPress={() => openSubmission(item)}>
                  <Eye size={17} />
                </Button>
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2 min-w-0">
                  <Mail size={16} className="text-[#06574C] shrink-0" />
                  <span className="truncate">{item.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-[#06574C] shrink-0" />
                  <span>{item.phone}</span>
                </p>
                <p className="font-medium text-[#333333] line-clamp-2">{item.subject}</p>
                <p className="line-clamp-3">{item.message}</p>
              </div>
            </div>
          ))}
      </div>

      <div className="hidden md:block bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <Table
          removeWrapper
          isHeaderSticky
          aria-label="Contact form submissions"
          classNames={{
            base: "w-full overflow-x-auto no-scrollbar h-[calc(100vh-335px)] min-h-[360px]",
            th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-wide bg-[#ebd4c9]",
            td: "py-3 px-4 align-top",
            tr: "border-b border-default-200",
          }}
        >
          <TableHeader>
            <TableColumn>Visitor</TableColumn>
            <TableColumn>Contact</TableColumn>
            <TableColumn>Subject</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Submitted</TableColumn>
            <TableColumn align="end">Action</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading || isFetching}
            loadingContent={<Spinner color="success" />}
            emptyContent="No contact forms found."
          >
            {submissions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <User
                    name={item.name}
                    description={`#${item.id}`}
                    avatarProps={{
                      radius: "sm",
                      name: item.name?.charAt(0),
                      className: "bg-[#06574C] text-white font-bold",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm min-w-48">
                    <p className="flex items-center gap-2 text-[#333333]">
                      <Mail size={15} className="text-[#06574C]" />
                      {item.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                      <Phone size={15} className="text-[#06574C]" />
                      {item.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#333333] min-w-40 max-w-56 line-clamp-2">
                    {item.subject}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 min-w-56 max-w-sm line-clamp-3">
                    {item.message}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Tooltip content="View message">
                      <Button
                        isIconOnly
                        radius="sm"
                        variant="light"
                        className="text-[#06574C]"
                        onPress={() => openSubmission(item)}
                      >
                        <Eye size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4">
        <span className="text-sm text-gray-500">
          Showing page {page} of {totalPages}
        </span>
        <Pagination
          showControls
          variant="ghost"
          page={page}
          total={totalPages}
          onChange={setPage}
          classNames={{
            item: "rounded-sm",
            cursor: "bg-[#06574C] rounded-sm text-white",
            prev: "rounded-sm bg-gray-200",
            next: "rounded-sm bg-gray-200",
          }}
        />
      </div>

      <Modal isOpen={viewModal.isOpen} onOpenChange={viewModal.onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <MessageSquareText size={20} className="text-[#06574C]" />
                Contact Form Details
              </ModalHeader>
              <ModalBody>
                {selectedSubmission && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <User
                        name={selectedSubmission.name}
                        description={selectedSubmission.email}
                        avatarProps={{
                          radius: "sm",
                          name: selectedSubmission.name?.charAt(0),
                          className: "bg-[#06574C] text-white font-bold",
                        }}
                      />
                      <p className="text-xs text-gray-500">{formatDate(selectedSubmission.createdAt)}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <a className="text-sm font-medium text-[#06574C] break-all" href={`mailto:${selectedSubmission.email}`}>
                          {selectedSubmission.email}
                        </a>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Phone</p>
                        <a className="text-sm font-medium text-[#06574C]" href={`tel:${selectedSubmission.phone}`}>
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Subject</p>
                      <p className="font-semibold text-[#333333]">{selectedSubmission.subject}</p>
                    </div>

                    <div className="bg-[#95C4BE20] border border-[#06574C20] rounded-lg p-4">
                      <p className="text-xs text-[#06574C] font-semibold mb-2">Message</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#06574C] text-white" radius="sm" onPress={onClose}>
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

export default ContactForms;

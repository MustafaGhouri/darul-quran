import React from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import { Button, Select, SelectItem } from "@heroui/react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Eye } from "lucide-react";
const SupportTicketsStudent = () => {
  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 h-full">
      <DashHeading
        title={"Support Tickets"}
        desc={"Manage and respond to student help requests"}
      />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="">
          <Select
            label="Status"
            radius="sm"
            size="sm"
            className="min-w-40"
          >
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </Select>
        </div>
        
        <Button
          startContent={<PlusIcon size={20} />}
          radius="sm"
          size="lg"
          className="bg-[#06574C] text-white"
        >
          New Ticket
        </Button>
      </div>

      <Table
      removeWrapper
      classNames={{
        base: "w-full bg-white rounded-lg overflow-x-scroll w-full no-scrollbar shadow-md  h-[calc(100vh-300px)]",
        th: "font-bold p-4 text-md  text-[#333333] capitalize tracking-widest  bg-[#EBD4C936]",
        td: "py-3 items-center whitespace-nowrap",
        tr: "border-b border-default-200 ",
      }}
      >
        <TableHeader>
          <TableColumn>Ticket ID</TableColumn>
          <TableColumn>Subject</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>
              <Button
                isIconOnly
                size="sm"
                radius="sm"
                variant="light"
                className="text-gray-500 hover:text-blue-600"
              >
                <Eye size={20} />
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                className="text-gray-500 hover:text-blue-600"
                startContent={<Trash2    size={20} />}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SupportTicketsStudent;

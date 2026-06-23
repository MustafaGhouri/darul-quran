import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  useDeleteEventMutation,
  useGetAllEventsQuery,
} from "../../../redux/api/events";
import { errorMessage, successMessage } from "../../../lib/toast.config";

const formatDateTime = (date, time) => {
  if (!date && !time) return "-";
  return [date, time].filter(Boolean).join(" at ");
};

const EventsRetreats = () => {
  const { data, isLoading } = useGetAllEventsQuery();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;

    try {
      const res = await deleteEvent(event.id).unwrap();
      if (res.success) {
        successMessage(res.message);
      }
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to delete event or retreat");
    }
  };

  const events = data?.data || [];

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-6 py-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <DashHeading
          title="All Events & Retreats"
          desc="Manage upcoming events, retreats, registration links, and seating."
        />
        <Button
          as={Link}
          to="/admin/events-retreats/manage"
          color="success"
          startContent={<FiPlus />}
          className="shadow-md"
        >
          Add Events & Retreats
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="success" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 italic text-gray-400">
          No Events & Retreats found. Add one to get started.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table aria-label="All Events and Retreats">
            <TableHeader>
              <TableColumn>Title</TableColumn>
              <TableColumn>Schedule</TableColumn>
              <TableColumn>Location</TableColumn>
              <TableColumn>Seats</TableColumn>
              <TableColumn>Link Type</TableColumn>
              <TableColumn>Featured</TableColumn>
              <TableColumn align="end">Actions</TableColumn>
            </TableHeader>
            <TableBody items={events}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-56">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#E7F2F0] border border-gray-100" />
                      )}
                      <div>
                        <p className="font-semibold text-[#333333]">{item.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700">
                      <p>{formatDateTime(item.startDate, item.startTime)}</p>
                      <p className="text-xs text-gray-500">
                        Ends {formatDateTime(item.endDate, item.endTime)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>{item.seats}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="success" className="capitalize">
                      {item.linkType || "registration"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={item.isfeatured ? "success" : "default"}
                    >
                      {item.isfeatured ? "Featured" : "No"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Tooltip content="Edit">
                        <Button
                          as={Link}
                          to={`/admin/events-retreats/manage/${item.id}`}
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-blue-500"
                        >
                          <FiEdit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete" color="danger">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-red-500"
                          isLoading={isDeleting}
                          onPress={() => handleDelete(item)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default EventsRetreats;

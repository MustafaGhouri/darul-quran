import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  useGetCourseByIdQuery,
  useGetWaitingListQuery,
  useInviteFromWaitingListMutation,
} from "../../../redux/api/courses";
import { dateFormatter } from "../../../lib/utils";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import QueryError from "../../../components/QueryError";

const WaitingList = () => {
  const { courseId } = useParams();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [invitingId, setInvitingId] = useState(null);

  const { data: courseData } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data, isFetching, isError, error, refetch } = useGetWaitingListQuery(
    { courseId, page, limit },
    { skip: !courseId },
  );
  const [inviteFromWaitingList] = useInviteFromWaitingListMutation();

  const handleInvite = async (entryId) => {
    try {
      setInvitingId(entryId);
      const result = await inviteFromWaitingList(entryId).unwrap();
      successMessage(result.message || "Invitation sent successfully");
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to send invitation");
    } finally {
      setInvitingId(null);
    }
  };

  if (isError) {
    return (
      <QueryError height="300px" error={error} onRetry={refetch} showLogo={false} />
    );
  }

  const courseName = courseData?.course?.courseName || "Course";

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button
          as={Link}
          to="/admin/courses-management"
          isIconOnly
          variant="light"
          radius="full"
        >
          <ChevronLeft size={24} />
        </Button>
        <DashHeading
          title={`Waiting List — ${courseName}`}
          desc="Manage students waiting for a spot in this in-person course"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <Table
          aria-label="Waiting list table"
          removeWrapper
          classNames={{
            base: "min-h-[400px]",
            th: "font-bold p-4 text-sm text-[#333333] bg-[#EBD4C936]",
            td: "py-3",
            tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936]",
          }}
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Phone</TableColumn>
            <TableColumn>Message</TableColumn>
            <TableColumn>Joined</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody
            loadingContent={<Spinner color="success" />}
            loadingState={isFetching ? "loading" : "idle"}
            emptyContent="No waiting list entries yet."
          >
            {(data?.entries || []).map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.firstName} {entry.lastName}
                </TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell>{entry.phone || "—"}</TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-[200px] text-sm text-gray-600">
                    {entry.message || "—"}
                  </span>
                </TableCell>
                <TableCell>{dateFormatter(entry.createdAt)}</TableCell>
                <TableCell>
                  {entry.isInvited ? (
                    <Chip size="sm" color="success" variant="flat">
                      Invited
                      {entry.invitedAt && (
                        <span className="ml-1 text-xs opacity-70">
                          {dateFormatter(entry.invitedAt)}
                        </span>
                      )}
                    </Chip>
                  ) : (
                    <Chip size="sm" color="warning" variant="flat">
                      Waiting
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  {!entry.isInvited && (
                    <Button
                      size="sm"
                      color="success"
                      variant="bordered"
                      isLoading={invitingId === entry.id}
                      isDisabled={invitingId !== null}
                      onPress={() => handleInvite(entry.id)}
                    >
                      Invite
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            showControls
            variant="ghost"
            total={data.totalPages}
            page={page}
            onChange={setPage}
            classNames={{
              cursor: "bg-[#06574C] rounded-sm text-white",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WaitingList;

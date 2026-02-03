import { Button, Chip } from "@heroui/react";
import { CiCalendar } from "react-icons/ci";
import { LuClock4 } from "react-icons/lu";
import { CiVideoOn } from "react-icons/ci";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { formatTime12Hour, getStatusColor, getStatusText, isClassLive, isClassExpired } from "../../utils/scheduleHelpers";

/**
 * Reusable Schedule Card Component - matches theme styling
 * Uses @heroui/react components and react-icons for consistency
 */
export const ScheduleCard = ({
    schedule,
    onJoin,
    showJoinButton = true,
    showTeacherName = true,
    actionButtons = null
}) => {
    const live = isClassLive(schedule);
    const expired = isClassExpired(schedule);

    return (
        <div className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#06574C] flex-1">{schedule.title}</h3>
                <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(schedule)}
                    className="ml-2"
                >
                    {getStatusText(schedule)}
                </Chip>
            </div>

            {schedule.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {schedule.description}
                </p>
            )}

            <div className="space-y-2 mb-4">
                {showTeacherName && schedule.teacherName && (
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <AiOutlineUser size={16} />
                        <span className="font-medium">{schedule.teacherName}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CiCalendar size={16} />
                    <span>{new Date(schedule.date).toDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <LuClock4 size={16} />
                    <span>{formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}</span>
                </div>
            </div>

            {schedule.courseName && (
                <div className="mb-4">
                    <Chip size="sm" variant="flat" className="bg-[#95C4BE]/20 text-[#06574C]">
                        {schedule.courseName}
                    </Chip>
                </div>
            )}

            {/* Custom action buttons or default join button */}
            {actionButtons ? (
                actionButtons
            ) : showJoinButton ? (
                expired ? (
                    <Button
                        className="w-full bg-gray-300 text-gray-600"
                        isDisabled
                        radius="sm"
                    >
                        Class Ended
                    </Button>
                ) : live && schedule.meetingLink ? (
                    <Button
                        className="w-full bg-[#06574C] text-white"
                        startContent={<CiVideoOn size={20} />}
                        onPress={() => onJoin && onJoin(schedule)}
                        radius="sm"
                    >
                        Join Class
                    </Button>
                ) : schedule.meetingLink ? (
                    <Button
                        className="w-full bg-gray-400 text-white"
                        startContent={<AiOutlineLock size={18} />}
                        isDisabled
                        radius="sm"
                    >
                        Locked - Starts Soon
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-gray-200 text-gray-500"
                        isDisabled
                        radius="sm"
                    >
                        No Meeting Link
                    </Button>
                )
            ) : null}
        </div>
    );
};

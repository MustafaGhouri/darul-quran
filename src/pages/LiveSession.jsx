import { Button, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@heroui/react'
import { DashHeading } from '../components/dashboard-components/DashHeading'
import { Plus, ArrowBigLeft, CalendarIcon, Video, Clock, User } from 'lucide-react';
import { useState, useMemo, useRef, lazy } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { useGetSchedulesByMonthQuery } from '../redux/api/schedules';
import QueryError from '../components/QueryError';
import { formatTime12Hour, getHoursUntilClass, getStatusText, getStatusTextForSingleDate, isClassExpired } from '../utils/scheduleHelpers';
import { dateFormatter } from '../lib/utils';
import { CiCalendar } from 'react-icons/ci';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const LiveSession = ({ isTeacher = false }) => {
    const [searchParams] = useSearchParams();
    const calendarRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const isCalenderView = searchParams.get('calender') === 'true';
    const { data, isLoading, error, refetch } = useGetSchedulesByMonthQuery(currentMonth, { skip: !isCalenderView });
    const [selectedDate, setSelectedDate] = useState(null);
    const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState([]);

    const { isOpen: isDateModalOpen, onOpen: openDateModal, onOpenChange: closeDateModal } = useDisclosure();
    const events = useMemo(() => {
        if (!data?.schedules) return [];

        return data.schedules.flatMap(schedule => {
            if (!schedule.scheduleDates || !Array.isArray(schedule.scheduleDates)) {
                return [];
            }

            return schedule.scheduleDates.map(date => ({
                id: `${schedule.id}-${date}`,
                title: `${formatTime12Hour(schedule.startTime)} - ${formatTime12Hour(schedule.endTime)} ● ${schedule.title}`,
                start: date,
                // startTime: schedule.startTime,
                // endTime: schedule.endTime,
                backgroundColor: '#dcd0ff',
                borderColor: '#dcd0ff',
                textColor: '#06574C',
                extendedProps: {
                    description: schedule.description,
                    courseName: schedule.courseName,
                    scheduleId: schedule.id,
                }
            }));
        });
    }, [data]);

    const stats = useMemo(() => {
        if (!data?.schedules) return { upcoming: 0, completed: 0 };
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const upcoming = data.schedules.filter(s =>
            s.scheduleDates?.some(date => date >= today)
        ).length;
        return { upcoming, completed: data.schedules.length - upcoming };
    }, [data]);

    const handleDateClick = (publicId) => {
        // date is a JavaScript Date object from CustomCalendar
        if (!publicId) return;

        const scheduleId = Number(publicId.split('-')[0]);
        const dateStr = publicId?.replace(`${scheduleId}-`, '');

        setSelectedDate(dateStr);

        // // Find schedules for this date
        // const dateKey = date.toLocaleDateString("en-US", {
        //     weekday: "long",
        //     month: "long",
        //     day: "numeric",
        //     year: "numeric"
        // });

        const filteredSchedules = data?.schedules
            .filter(schedule =>
                Array.isArray(schedule.scheduleDates) &&
                schedule.scheduleDates.includes(dateStr)
            ) || [];
        console.log(filteredSchedules);

        const formattedSchedules = filteredSchedules
            ?.filter(Boolean)
            ?.map(i => ({
                ...i,
                date: Array.isArray(i.scheduleDates) ? i.scheduleDates.find(d => d === dateStr) : null
            }));
        // console.log(formattedSchedules);

        setSchedulesForSelectedDate(formattedSchedules);
        openDateModal();
    };

    const handleDatesSet = (arg) => {
        const viewDate = arg.view.currentStart;
        const year = viewDate.getFullYear();
        const month = String(viewDate.getMonth() + 1).padStart(2, '0');
        setCurrentMonth(`${year}-${month}`);
    };
    if (!isCalenderView) return null;

    if (error) {
        return <QueryError
            height="300px"
            error={error}
            onRetry={refetch}
            showLogo={false}
        />
    }
    const getClassStatusBadge = (schedule, type = 'single') => {
        let status = '';
        let hoursUntil = null;
        let isExpired = false;

        if (type === 'single') {
            status = getStatusTextForSingleDate(schedule.date, schedule.startTime, schedule.endTime);
            hoursUntil = getHoursUntilClass(schedule.date, schedule.startTime);
            const todayStr = new Date().toISOString().split('T')[0];
            isExpired = schedule.date < todayStr || (schedule.date === todayStr && hoursUntil !== null && hoursUntil < 0);
        } else {
            status = getStatusText(schedule);
            const scheduleDates = schedule.scheduleDates || [];
            const todayStr = new Date().toISOString().split('T')[0];
            const upcomingDates = scheduleDates.filter(d => d >= todayStr);

            if (upcomingDates.length > 0) {
                const nextDate = upcomingDates.sort()[0];
                hoursUntil = getHoursUntilClass(nextDate, schedule.startTime);
            } else if (scheduleDates.length > 0) {
                const lastDate = scheduleDates[scheduleDates.length - 1];
                hoursUntil = getHoursUntilClass(lastDate, schedule.startTime);
            }
            isExpired = isClassExpired(schedule);
        }

        if (status === "live") {
            return (
                <Button
                    size="sm"
                    className="bg-[#E8F1FF] text-[#3F86F2] animate-pulse"
                    radius="sm"
                    startContent={<Video size={14} />}
                >
                    Live Now
                </Button>
            );
        }

        if (isExpired) {
            return (
                <Chip size="sm" variant="flat" color="default">
                    Completed
                </Chip>
            );
        }

        // if (hoursUntil !== null && hoursUntil > 0 && hoursUntil < 3) {
        //     return (
        //         <Button
        //             size="sm"
        //             className="bg-[#95C4BE33] text-[#06574C]"
        //             radius="sm"
        //             startContent={<Lock size={14} />}
        //         >
        //             Starts in {(hoursUntil)?.toFixed(1)} hr
        //         </Button>
        //     );
        // }

        return (
            <Chip size="sm" variant="flat" color="warning">
                Upcoming
            </Chip>
        );
    };
    return (
        <div className='bg-white   sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 '>
            <div className="flex justify-between items-center py-4">
                <DashHeading
                    title={"Scheduled Live Classes Calendar"}
                    desc={'View live classes and sessions in calender'} />
                {/* <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full"><Calendar className="text-blue-600" size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Upcoming for this month</p>
                        <p className="text-xl font-bold text-[#06574C]">{stats.upcoming}</p>
                    </div>
                </div> */}
            </div>

            <div className="bg-[#EBD4C9] max-md:flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex flex-col md:flex-row justify-between md:items-center">
                <Button as={Link} color='success' variant='bordered' to={isTeacher ? '/teacher/class-scheduling' : '/admin/class-scheduling'} radius="sm" startContent={<ArrowBigLeft size={15} />} >
                    Back
                </Button>
                <Button as={Link} to={isTeacher ? '/teacher/class-scheduling?calender=true' : '/admin/scheduling?modal=true'} radius="sm" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white py-4 px-3 sm:px-8">
                    Schedule Session
                </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow mb-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Spinner size="lg" variant="dots" labelColor="success" color="success" />
                    </div>
                ) : (
                    <FullCalendar
                        ref={calendarRef}
                        showNonCurrentDates={true}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        height="auto"
                        eventClick={(info) => handleDateClick(info?.event?._def?.publicId)}
                        datesSet={handleDatesSet}
                    />
                )}
            </div>
            {/* Modal for showing schedule details when date is clicked */}
            <Modal
                isOpen={isDateModalOpen}
                onOpenChange={closeDateModal}
                size="lg"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold text-[#06574C]">
                                Schedule Details For
                            </h2>
                            {selectedDate && (
                                <p className="text-sm text-gray-600">
                                    {selectedDate}
                                </p>
                            )}
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {schedulesForSelectedDate.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">No classes scheduled for this date</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {schedulesForSelectedDate.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {getClassStatusBadge(schedule, 'single')}
                                            {schedule.courseName && (
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    className="bg-[#95C4BE33] text-[#06574C]"
                                                >
                                                    Course: {schedule.courseName}
                                                </Chip>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {schedule.title}
                                        </h3>

                                        {schedule.description && (
                                            <p className="text-gray-600 text-sm mb-3">
                                                {schedule.description}
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <CiCalendar size={18} />
                                                <span>
                                                    {dateFormatter(schedule.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Clock size={18} />
                                                <span>
                                                    {formatTime12Hour(schedule.startTime)} - {formatTime12Hour(schedule.endTime)}
                                                </span>
                                            </div>
                                            {schedule.meetingLink && (
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Video size={18} />
                                                    <span>Zoom Class Available</span>
                                                </div>
                                            )}
                                            {schedule.teacherName && (
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <User size={18} />
                                                    <span>{schedule.teacherName}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Divider className="my-3" />

                                        {/* <div className="flex flex-wrap gap-2">
                                                        {schedule.meetingLink && isClassLive({ ...schedule, scheduleDates: [schedule.date] }) ? (
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#1570E8] text-white"
                                                                startContent={<LuSquareArrowOutUpRight size={16} />}
                                                                onPress={() => handleJoinClass(schedule)}
                                                                isLoading={isMarking === schedule.id}
                                                            >
                                                                Join Class
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#9A9A9A] text-white"
                                                                startContent={<Lock size={16} />}
                                                                isDisabled
                                                            >
                                                                Join Locked
                                                            </Button>
                                                        )}
                                                        {canReschedule(schedule) && (
                                                            <Button
                                                                size="sm"
                                                                variant="bordered"
                                                                color="success"
                                                                onPress={() => {
                                                                    closeDateModal();
                                                                    navigate('/teacher/class-scheduling/manage', { state: schedule });
                                                                }}
                                                            >
                                                                Reschedule
                                                            </Button>
                                                        )}
                                                        {canCancel(schedule) && (
                                                            <Button
                                                                size="sm"
                                                                variant="bordered"
                                                                color="danger"
                                                                onPress={() => {
                                                                    closeDateModal();
                                                                    handleCancelClass(schedule);
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div> */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => closeDateModal()}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    )
}

export default LiveSession

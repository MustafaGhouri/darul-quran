import { Button, Spinner } from '@heroui/react'
import { DashHeading } from '../../../components/dashboard-components/DashHeading'
import { Plus, Calendar, ChevronLeft, ChevronRight, ArrowBigLeft } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { errorMessage } from '../../../lib/toast.config';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetSchedulesByMonthQuery } from '../../../redux/api/schedules';
import QueryError from '../../../components/QueryError';
import { formatTime12Hour } from '../../../utils/scheduleHelpers';

const LiveSession = ({ isTeacher = false }) => {
    const [searchParams] = useSearchParams();
    const calendarRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const isCalenderView = searchParams.get('calender') === 'true';
    const { data, isLoading, error, refetch } = useGetSchedulesByMonthQuery(currentMonth, { skip: !isCalenderView });

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

    return (
        <div className='bg-white   sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 '>
            <div className="flex justify-between items-center py-4">
                <DashHeading
                    title={"Scheduled Live Classes Calendar"}
                    desc={'View live classes and sessions in calender'} />
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full"><Calendar className="text-blue-600" size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Upcoming</p>
                        <p className="text-xl font-bold text-[#06574C]">{stats.upcoming}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#EBD4C9] max-md:flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex flex-col md:flex-row justify-between md:items-center">
                <Button as={Link} color='success' variant='bordered' to={isTeacher ? '/teacher/class-scheduling' : '/admin/scheduling'} radius="sm" startContent={<ArrowBigLeft size={15} />} >
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
                        eventClick={(info) => { }}
                        datesSet={handleDatesSet}
                    />
                )}
            </div>
        </div>
    )
}

export default LiveSession

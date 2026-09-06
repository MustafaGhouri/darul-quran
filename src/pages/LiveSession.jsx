import { Button, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@heroui/react';
import { DashHeading } from '../components/dashboard-components/DashHeading';
import { Plus, ArrowBigLeft, CalendarIcon, Video, Clock, User } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetScheduleOccurrencesQuery } from '../redux/api/schedules';
import QueryError from '../components/QueryError';
import { CiCalendar } from 'react-icons/ci';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const badgeFor = (state) => {
  if (state === 'live') return <Button size="sm" className="bg-[#E8F1FF] text-[#3F86F2] animate-pulse" radius="sm" startContent={<Video size={14} />}>Live Now</Button>;
  if (state === 'completed') return <Chip size="sm" variant="flat" color="default">Completed</Chip>;
  if (state === 'cancelled') return <Chip size="sm" variant="flat" color="danger">Cancelled</Chip>;
  return <Chip size="sm" variant="flat" color="warning">Upcoming</Chip>;
};

const LiveSession = ({ isTeacher = false }) => {
  const [searchParams] = useSearchParams();
  const calendarRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const isCalendarView = searchParams.get('calender') === 'true';
  const range = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    return { from: `${currentMonth}-01`, to: `${currentMonth}-${String(new Date(Date.UTC(year, month, 0)).getUTCDate()).padStart(2, '0')}` };
  }, [currentMonth]);
  const { data, isLoading, error, refetch } = useGetScheduleOccurrencesQuery(range, { skip: !isCalendarView });
  const occurrences = data?.occurrences || [];
  const events = useMemo(() => occurrences.map((occurrence) => ({
    id: String(occurrence.id), start: occurrence.localDate,
    title: `${occurrence.display.startTime} - ${occurrence.display.endTime} • ${occurrence.title}`,
    backgroundColor: occurrence.state === 'cancelled' ? '#fee2e2' : '#dcd0ff',
    borderColor: occurrence.state === 'cancelled' ? '#fecaca' : '#dcd0ff', textColor: '#06574C',
  })), [occurrences]);

  if (!isCalendarView) return null;
  if (error) return <QueryError height="300px" error={error} onRetry={refetch} showLogo={false} />;
  return <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5">
    <div className="flex justify-between items-center py-4"><DashHeading title="Scheduled Live Classes Calendar" desc="View live classes and sessions in calendar" /></div>
    <div className="bg-[#EBD4C9] gap-2 p-2 sm:p-4 rounded-lg my-3 flex flex-col md:flex-row justify-between md:items-center">
      <Button as={Link} color="success" variant="bordered" to={isTeacher ? '/teacher/class-scheduling' : '/admin/class-scheduling'} radius="sm" startContent={<ArrowBigLeft size={15} />}>Back</Button>
      <Button as={Link} to={isTeacher ? '/teacher/class-scheduling?calender=true' : '/admin/class-scheduling?modal=true'} radius="sm" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white py-4 px-3 sm:px-8">Schedule Session</Button>
    </div>
    <div className="p-4 bg-white min-h-[60vh] rounded-lg shadow mb-6">
      {isLoading ? <div className="flex justify-center items-center py-12"><Spinner size="lg" variant="dots" labelColor="success" color="success" /></div> :
        <FullCalendar ref={calendarRef} showNonCurrentDates plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} height="auto"
          eventClick={(info) => { const occurrence = occurrences.find((item) => item.id === Number(info.event.id)); if (occurrence) { setSelectedOccurrence(occurrence); onOpen(); } }}
          datesSet={(arg) => setCurrentMonth(`${arg.view.currentStart.getFullYear()}-${String(arg.view.currentStart.getMonth() + 1).padStart(2, '0')}`)} />}
    </div>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg"><ModalContent>{() => <>
      <ModalHeader><div><h2 className="text-lg font-semibold text-[#06574C]">Schedule details</h2><p className="text-sm text-gray-600">{selectedOccurrence?.display.date} ({selectedOccurrence?.timezone})</p></div></ModalHeader>
      <ModalBody>{!selectedOccurrence ? <div className="text-center py-8"><CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} /><p>No class selected</p></div> : <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2 mb-3">{badgeFor(selectedOccurrence.state)}<Chip size="sm" variant="flat" className="bg-[#95C4BE33] text-[#06574C]">Course: {selectedOccurrence.course?.name}</Chip></div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedOccurrence.title}</h3>
        {selectedOccurrence.description && <p className="text-gray-600 text-sm mb-3">{selectedOccurrence.description}</p>}
        <div className="flex flex-col gap-2 text-gray-600 text-sm"><div className="flex items-center gap-2"><CiCalendar size={18} />{selectedOccurrence.display.date}</div><div className="flex items-center gap-2"><Clock size={18} />{selectedOccurrence.display.startTime} - {selectedOccurrence.display.endTime}</div>{selectedOccurrence.meeting.available && <div className="flex items-center gap-2"><Video size={18} />Zoom class available</div>}{selectedOccurrence.teacher?.name && <div className="flex items-center gap-2"><User size={18} />{selectedOccurrence.teacher.name}</div>}</div>
        <Divider className="my-3" />
      </div>}</ModalBody>
      <ModalFooter><Button variant="flat" onPress={() => onOpenChange(false)}>Close</Button></ModalFooter>
    </>}</ModalContent></Modal>
  </div>;
};

export default LiveSession;

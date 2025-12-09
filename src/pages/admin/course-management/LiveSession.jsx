import { Button, Link, Select, SelectItem } from '@heroui/react'
import { DashHeading } from '../../../components/dashboard-components/DashHeading'
import { Edit, ExternalLink, ListFilterIcon, Plus, Trash2, Video } from 'lucide-react';
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const LiveSession = () => {

    const [events, setEvents] = useState([
        { title: "iOS Workshop", date: "2025-11-02" ,color: "#FEEDED" ,textColor:"#DC2626" },
        { title: "React Basics", date: "2025-11-06", color: "#FEEDED" ,textColor:"#DC2626"},
        { title: "Python Basics", date: "2025-11-09", color: "#dcd0ff" },
        { title: "Marketing Research", date: "2025-11-14", color: "#90ee90" },
        { title: "iOS Workshop", date: "2025-11-18", color: "#ffcccc" },
        { title: "JS Workshop", date: "2025-11-18", color: "#ffebcc" },
        { title: "React Basics", date: "2025-11-22", color: "#f0e68c" },
        { title: "iOS Workshop", date: "2025-11-22", color: "#ffcccc" },
        { title: "React Basics", date: "2025-11-28", color: "#f0e68c" },
        { title: "iOS Workshop", date: "2025-11-28", color: "#ffcccc" },
        { title: "JS Workshop", date: "2025-11-28", color: "#ffebcc" },
        { title: "Python Basics", date: "2025-11-28", color: "#dcd0ff" },
    ]);

    const handleDateClick = (info) => {
        // alert("Clicked on date: " + info.dateStr);
    };

    const statuses = [
        { key: "all", label: "All Status" },
        { key: "draft", label: "Draft" },
        { key: "published", label: "Published" },
    ];
    const sessions = [
        { id: 1, title: "React Fundamentals - Advanced Hooks", date: "Oct 25, 2024 at 10:00 AM PST", teacher: "John Davis", link: '#' },
        { id: 2, title: "React Fundamentals - Advanced Hooks", date: "Oct 25, 2024 at 10:00 AM PST", teacher: "John Davis", link: '#' },
    ];
    const filters = [
        { key: "all", label: "Filter" },
    ];

    return (
        <div className='bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5'>

            <DashHeading
            title={"Live Sessions Schedule"}
            desc={'Manage upcoming live classes and sessions'} />
            <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
                <div className="flex  items-center gap-2">
                    <Select
                        className="min-w-[180px]"
                        radius="sm"
                        defaultSelectedKeys={["all"]}
                        placeholder="Select an status"
                    >
                        {statuses.map((status) => (
                            <SelectItem key={status.key}>{status.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        radius="sm"
                        className="min-w-[180px]"
                        defaultSelectedKeys={["all"]}
                        selectorIcon={<ListFilterIcon />}
                        placeholder="Filter"
                    >
                        {filters.map((filter) => (
                            <SelectItem key={filter.key}>{filter.label}</SelectItem>
                        ))}
                    </Select>
                </div>
                <Button radius="sm" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white py-4 px-3 sm:px-8">
                    Schedule Session
                </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    height="auto"
                />
            </div>
            <div className='py-4 space-y-3'>
                {sessions.map((i, _) => (<div className='bg-white max-sm:flex-col gap-3 p-4 rounded-lg flex items-center justify-between'>
                    <div className='flex gap-3 ustify-center items-center'>
                        <div className="rounded-full p-4 bg-[#95C4BE]/20">
                            <Video size={30} color="#06574C" />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold sm:text-2xl text-[#06574C]'>{i.title}</h3>
                            <p className='text-[#666666]'>With {i.teacher}</p>
                            <p className='text-[#666666]'>{i.date}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button isIconOnly variant='flat' className='bg-red-500/20' aria-label='Delete schedule'>
                            <Trash2 color='oklch(70.4% 0.191 22.216)' />
                        </Button>
                        <Button radius="sm" variant="bordered" className="border-[#06574C]" startContent={<Edit size={18} color="#06574C" />}>
                            Edit
                        </Button>
                        <Button as={Link} href={i.link} radius='sm' startContent={<ExternalLink size={18} color='white' />} color="primary">
                            join Zoom
                        </Button>
                    </div>
                </div>))}

            </div>
        </div>
    )
}

export default LiveSession

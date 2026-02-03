import { Button, Link, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure, Chip } from '@heroui/react'
import { DashHeading } from '../../../components/dashboard-components/DashHeading'
import { Edit, ExternalLink, Plus, Trash2, Video, Copy, Check, Calendar } from 'lucide-react';
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from 'react-hot-toast';

const LiveSession = () => {
    // Schedule Modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Reschedule Modal
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

    const [events, setEvents] = useState([]);
    const [rawSchedules, setRawSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ upcoming: 0, completed: 0 });
    const [copiedId, setCopiedId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
    });

    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/getAll`);
            const data = await res.json();
            if (data.success) {
                setRawSchedules(data.schedules);

                // Stats
                const now = new Date();
                const upcoming = data.schedules.filter(s => new Date(s.date) >= now || new Date(s.date).toDateString() === now.toDateString()).length;
                setStats({ upcoming, completed: data.schedules.length - upcoming });

                // Calendar Events
                const formattedEvents = data.schedules.map(s => {
                    const dateStr = new Date(s.date).toISOString().split('T')[0];
                    return {
                        id: s.id,
                        title: s.title,
                        start: `${dateStr}T${s.startTime}`,
                        end: `${dateStr}T${s.endTime}`,
                        backgroundColor: '#dcd0ff',
                        borderColor: '#dcd0ff',
                        textColor: '#06574C',
                        extendedProps: { ...s }
                    };
                });
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
            toast.error("Failed to load schedule");
        }
    };

    const handleCreate = async () => {
        if (!formData.title || !formData.date || !formData.startTime) {
            toast.error("Please fill required fields");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Scheduled & Zoom Link Generated!");
                fetchSessions();
                onOpenChange(false);
                setFormData({ title: '', date: '', startTime: '', endTime: '', description: '' });
            } else {
                toast.error(data.message || "Failed to schedule");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error scheduling session");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/update/${editData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Session Rescheduled Successfully");
                fetchSessions();
                onEditOpenChange(false);
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Error updating session");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this session?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/delete/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Session Deleted");
                fetchSessions();
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            toast.error("Error deleting session");
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Link Copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openRescheduleModal = (session) => {
        // Format date for input type="date"
        const dateStr = new Date(session.date).toISOString().split('T')[0];
        setEditData({
            ...session,
            date: dateStr
        });
        onEditOpen();
    };

    const sortedDetails = [...rawSchedules].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className='bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-5 min-h-screen'>
            <div className="flex justify-between items-center py-4">
                <DashHeading
                    title={"Live Sessions Schedule"}
                    desc={'Manage upcoming live classes and sessions'} />
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full"><Calendar className="text-blue-600" size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Upcoming</p>
                        <p className="text-xl font-bold text-[#06574C]">{stats.upcoming}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#EBD4C9] max-md:flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex flex-col md:flex-row justify-between md:items-center">
                <p className="text-[#06574C] font-medium hidden md:block">Zoom Integration Enabled</p>
                <Button onPress={onOpen} radius="sm" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white py-4 px-3 sm:px-8">
                    Schedule Session
                </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow mb-6">
                <FullCalendar
                    showNonCurrentDates={true}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    eventClick={(info) => {
                        // Could enable clicking event to edit
                        // For now just alert
                    }}
                />
            </div>

            {/* Create Schedule Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-[#06574C]">Schedule New Session (Zoom)</ModalHeader>
                            <ModalBody>
                                <p className="text-xs text-gray-500 mb-2">Zoom link and password will be auto-generated upon creation.</p>
                                <Input
                                    autoFocus
                                    label="Session Title"
                                    placeholder="e.g. React Doubt Session"
                                    variant="bordered"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <div className='flex gap-2'>
                                    <Input
                                        type="date"
                                        label="Date"
                                        variant="bordered"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <Input
                                        type="time"
                                        label="Start Time"
                                        variant="bordered"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                    <Input
                                        type="time"
                                        label="End Time"
                                        variant="bordered"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                                <Textarea
                                    label="Description/Agenda"
                                    placeholder="Details..."
                                    variant="bordered"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className="bg-[#06574C] text-white" onPress={handleCreate} isLoading={loading}>
                                    Schedule & Generate Zoom
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Reschedule Modal with Blur */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} placement="top-center" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-[#06574C]">Reschedule Session</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Session Title"
                                    variant="bordered"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                                <div className='flex gap-2'>
                                    <Input
                                        type="date"
                                        label="Date"
                                        variant="bordered"
                                        value={editData.date}
                                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <Input
                                        type="time"
                                        label="Start Time"
                                        variant="bordered"
                                        value={editData.startTime}
                                        onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                                    />
                                    <Input
                                        type="time"
                                        label="End Time"
                                        variant="bordered"
                                        value={editData.endTime}
                                        onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                                    />
                                </div>
                                <Textarea
                                    label="Description"
                                    variant="bordered"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                />
                                <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded">
                                    Note: This updates the local schedule. You may need to update the Zoom meeting separately via Zoom Dashboard if needed.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button className="bg-[#06574C] text-white" onPress={handleUpdate} isLoading={loading}>
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default LiveSession

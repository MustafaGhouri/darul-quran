import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { DashHeading } from "../../components/dashboard-components/DashHeading";
import { ScheduleCard } from "../../components/schedule/ScheduleCard";

const StudentClassSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/auth/me`, {
                credentials: 'include'
            });
            const data = await res.json();

            if (data.user) {
                setCurrentUser(data.user);
                await fetchSchedules();
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setLoading(false);
        }
    };

    const fetchSchedules = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/schedule/getAll`);
            const data = await res.json();

            if (data.success) {
                setSchedules(data.schedules);
            }
        } catch (error) {
            console.error("Failed to fetch schedules", error);
            toast.error("Failed to load class schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClass = async (schedule) => {
        if (!currentUser) {
            toast.error("Please login first");
            return;
        }

        try {
            await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/attendance/mark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: schedule.id,
                    studentId: currentUser.id
                })
            });

            window.open(schedule.meetingLink, '_blank');
            toast.success("Joined class! Attendance marked.");
        } catch (error) {
            console.error("Failed to mark attendance", error);
            window.open(schedule.meetingLink, '_blank');
        }
    };

    return (
        <div className="bg-white bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 min-h-screen">
            <DashHeading
                title="My Class Schedule"
                desc="View and join your upcoming live classes"
            />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06574C]"></div>
                </div>
            ) : schedules.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500">No upcoming classes scheduled</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                    {schedules.map((schedule) => (
                        <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                            onJoin={handleJoinClass}
                            showJoinButton={true}
                            showTeacherName={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentClassSchedule;

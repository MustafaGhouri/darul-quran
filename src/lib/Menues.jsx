import {
    BookIcon,
    CalendarIcon,
    CalendarPlus,
    ChartBarIcon,
    DollarSignIcon,
    FileQuestionIcon,
    HomeIcon,
    MegaphoneIcon,
    TicketIcon,
    TicketsIcon,
    UsersIcon,
    Video,
    BellRing,
    Users2Icon
} from 'lucide-react';
import { FaChalkboardTeacher } from 'react-icons/fa';

export const adminMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/admin/dashboard', value: 'dashboard' },
    {
        name: 'Courses Management',
        icon: <BookIcon />,
        link: '/admin/courses-management',
        value: 'courses-management',
        children: [
            { name: 'Course Builder', link: '/admin/courses-management/builder', value: 'course-builder' },
            { name: 'Attendance & Progress', link: '/admin/courses-management/attendance', value: 'attendance-progress' }
        ]
    },
    { name: 'User Management', icon: <UsersIcon />, link: '/admin/user-management', value: 'user-management' },
    { name: 'Class Scheduling', icon: <CalendarIcon />, link: '/admin/class-scheduling', value: 'class-scheduling' },
    { name: 'Announcements', icon: <MegaphoneIcon />, link: '/admin/announcements', value: 'announcements' },
    { name: 'Payments & Refunds', icon: <DollarSignIcon />, link: '/admin/payments', value: 'payments-refunds' },
    { name: 'Support Tickets', icon: <TicketIcon />, link: '/admin/tickets', value: 'support-tickets' },
    { name: 'Analytics', icon: <ChartBarIcon />, link: '/admin/analytics', value: 'analytics' },
    { name: 'Notifications', icon: <BellRing />, link: '/admin/notifications', value: 'notifications' },
    { name: 'Reschedule Requests', icon: <CalendarPlus />, link: '/admin/reschedule-requests' },
    {
        name: 'Help and Support',
        icon: <FileQuestionIcon />,
        link: '/admin/help/messages',
        value: 'help-support',
        children: [
            { name: 'Message Center', link: '/admin/help/messages', value: 'messages' },
            { name: 'Teacher & Student Chat', link: '/admin/help/chat', value: 'chat' },
            { name: 'Reviews', link: '/admin/help/reviews', value: 'reviews' },
            { name: 'FAQs', link: '/admin/help/faqs', value: 'faqs' }
        ]
    }
];
export const teacherMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/teacher/dashboard' },
    {
        name: 'My Courses',
        icon: <BookIcon />,
        link: '/teacher/courses',
        children: [
            // { name: 'Course Details View', link: '/teacher/courses/course-details' },
            { name: 'Upload Materials', link: '/teacher/courses/upload-material' }
        ]
    },
    { name: 'Student Attendance', icon: <CalendarIcon />, link: '/teacher/student-attendance' },
    { name: 'Student Attendance List', icon: <Users2Icon />, link: '/teacher/attendance-list' },
    { name: 'Class Schedule', icon: <MegaphoneIcon />, link: '/teacher/class-scheduling' },
    { name: 'Reschedule Requests', icon: <CalendarPlus />, link: '/teacher/reschedule-requests' },
    { name: 'Chat Center', icon: <TicketIcon />, link: '/teacher/chat' },
    { name: 'Support Tickets  ', icon: <TicketsIcon />, link: '/teacher/support-tickets' },
    { name: 'Announcements', icon: <MegaphoneIcon />, link: '/teacher/announcements' },
    { name: 'Notifications', icon: <BellRing />, link: '/teacher/notifications' },
];

export const studentMenu = [
    { name: 'Dashboard', icon: <HomeIcon />, link: '/student/dashboard' },
    { name: 'My Learning Journey', icon: <FaChalkboardTeacher />, link: '/student/my-learning' },
    { name: 'Class Schedule', icon: <Video />, link: '/student/class-scheduling' },
    { name: 'Browse Courses', icon: <Video />, link: '/student/browse-courses' },
    {
        name: 'Help and Support',
        icon: <FileQuestionIcon />,
        link: '/student/help/messages',
        children: [
            { name: 'Chat Center', link: '/student/help/messages' },
            { name: 'Payments & Invoices', link: '/student/payments' },
            { name: 'My Reschedule Requests', link: '/student/reschedule-requests' },
            // { name: 'Reviews', link: '/admin/help/reviews' },
            // { name: 'FAQs', link: '/admin/help/faqs' }
        ]
    },
    { name: 'Support Tickets  ', icon: <TicketsIcon />, link: '/student/support-tickets' },
    { name: "Announcements", icon: <MegaphoneIcon />, link: "/student/announcements" },
    { name: 'Notifications', icon: <BellRing />, link: '/student/notifications' }
];

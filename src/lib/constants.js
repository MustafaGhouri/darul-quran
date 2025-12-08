export const mockChatRooms = [
  {
    id: 1,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 2,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 3,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 4,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 5,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 6,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 7,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 8,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 9,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: true,
  },
  {
    id: 10,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 11,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
  {
    id: 12,
    student_name: "X-AE-A-13b",
    teacher_name: "Azunyan U",
    time: "12:25",
    isActive: false,
  },
];

export const mockUser = [
  {
    id: 1,
    name: "X-AE-A-13b",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 2,
    name: "Jerome White",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 3,
    name: "Madagascar Silver",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 4,
    name: "Pippins McGray",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 5,
    name: "McKinsey Vermillion",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: true,
  },
  {
    id: 6,
    name: "Dorian F. Gray",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 7,
    name: "Benedict Comber",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 8,
    name: "Kaori D. Miyazono",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 9,
    name: "Saylor Twift",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 10,
    name: "Miranda Blue",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 11,
    name: "Esmeralda Gray",
    role: "teacher",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
  {
    id: 12,
    name: "Oarack Babama",
    role: "student",
    message: "Enter your message description here...",
    time: "12:25",
    isActive: false,
  },
];

export const messages = [
    
    {
        id: 51,
        sender: 'teacher',
        text: "",
        time: '12:26 AM',
        hasAttachment: true,
        user_id: 1,
        chat_id: 1,
        attachment: {
            name: 'Design__project__2025.docx',
            size: '2.5gb • docx'
        }
    },
    {
        id: 0,
        sender: 'student',
        text: "Hello my dear Sir, I'm here to deliver the design requirement document for our next project.",
        user_id: 1,
        chat_id: 1,
        time: '10:25 AM',
    },
    {
        id: 1,
        sender: 'student',
        text: "",
        user_id: 1,
        chat_id: 1,
        time: '10:26 AM',
        hasAttachment: true,
        attachment: {
            name: 'Design__project__2025.docx',
            size: '2.5mb • docx'
        }
    },
    {
        id: 2,
        sender: 'teacher',
        user_id: 2,
        chat_id: 1,
        text: 'Thank you for sending this over. I will review the scope and get back to you with initial feedback by tomorrow.',
        time: '11:29 AM'
    },
    {
        id: 3,
        sender: 'student',
        user_id: 1,
        chat_id: 1,
        text: 'Do you need a quick rundown of the high-level features first?',
        time: '12:41 PM'
    },
    {
        id: 4,
        sender: 'teacher',
        user_id: 2,
        chat_id: 1,
        text: 'No, I can handle it. The document seems comprehensive. I appreciate the swift delivery.',
        time: '1:05 PM'
    },
    {
        id: 5,
        sender: 'student',
        user_id: 1,
        chat_id: 1,
        text: "Sounds great. Looking forward to your thoughts!",
        time: '1:06 PM'
    },

    // --- Chat 2: student 3 & 4 (6 Messages) ---
    {
        id: 6,
        sender: 'student',
        text: "The server migration is scheduled for 2 AM tonight. Please ensure all teams are notified.",
        user_id: 3,
        chat_id: 2,
        time: '09:00 AM',
    },
    {
        id: 7,
        sender: 'teacher',
        user_id: 4,
        chat_id: 2,
        text: 'Confirmed. I have sent out the email to Dev, QA, and Ops teams with the downtime window.',
        time: '09:05 AM'
    },
    {
        id: 8,
        sender: 'student',
        user_id: 3,
        chat_id: 2,
        text: 'Did we finalize the backup procedure? I want to make sure we have a rollback plan ready.',
        time: '09:15 AM'
    },
    {
        id: 9,
        sender: 'teacher',
        user_id: 4,
        chat_id: 2,
        text: "Yes, the full system snapshot is scheduled for 1:30 AM. It's fully redundant.",
        time: '09:17 AM'
    },
    {
        id: 10,
        sender: 'student',
        user_id: 3,
        chat_id: 2,
        text: 'Excellent. Keep me posted on any issues, even minor ones.',
        time: '09:20 AM'
    },
    {
        id: 11,
        sender: 'teacher',
        user_id: 4,
        chat_id: 2,
        text: 'Will do. I will be monitoring the process live.',
        time: '09:21 AM'
    },

    // --- Chat 3: student 5 & 6 (6 Messages) ---
    {
        id: 12,
        sender: 'student',
        text: "I need the Q4 sales figures ASAP for the board meeting slides.",
        user_id: 5,
        chat_id: 3,
        time: '01:30 PM',
    },
    {
        id: 13,
        sender: 'teacher',
        user_id: 6,
        chat_id: 3,
        text: 'Just finished compiling them. Sending the Excel sheet now.',
        time: '01:35 PM'
    },
    {
        id: 14,
        sender: 'teacher',
        user_id: 6,
        chat_id: 3,
        text: "",
        time: '01:35 PM',
        hasAttachment: true,
        attachment: {
            name: 'Q4_Sales_Report.xlsx',
            size: '5.1mb • xlsx'
        }
    },
    {
        id: 15,
        sender: 'student',
        user_id: 5,
        chat_id: 3,
        text: 'Thank you. Can you quickly highlight the growth in the European market?',
        time: '01:38 PM'
    },
    {
        id: 16,
        sender: 'teacher',
        user_id: 6,
        chat_id: 3,
        text: 'It grew by 18% YoY. I’ve added a comment in the file on tab "Summary".',
        time: '01:40 PM'
    },
    {
        id: 17,
        sender: 'student',
        user_id: 5,
        chat_id: 3,
        text: 'Perfect, that saves me a lot of time!',
        time: '01:42 PM'
    },

    // --- Chat 4: student 7 & 8 (6 Messages) ---
    {
        id: 18,
        sender: 'student',
        text: "We should consider switching from MongoDB to PostgreSQL for the new authentication service.",
        user_id: 7,
        chat_id: 4,
        time: '11:00 AM',
    },
    {
        id: 19,
        sender: 'teacher',
        user_id: 8,
        chat_id: 4,
        text: 'That’s a big shift. What are the main driving factors for making that change?',
        time: '11:05 AM'
    },
    {
        id: 20,
        sender: 'student',
        user_id: 7,
        chat_id: 4,
        text: 'Better ACID compliance and built-in features for handling relational data for student profiles.',
        time: '11:10 AM'
    },
    {
        id: 21,
        sender: 'teacher',
        user_id: 8,
        chat_id: 4,
        text: 'Makes sense. Have you checked the performance impact on write operations?',
        time: '11:15 AM'
    },
    {
        id: 22,
        sender: 'student',
        user_id: 7,
        chat_id: 4,
        text: 'Initial benchmarks show acceptable performance, especially with connection pooling.',
        time: '11:20 AM'
    },
    {
        id: 23,
        sender: 'teacher',
        user_id: 8,
        chat_id: 4,
        text: 'Okay, let’s schedule a meeting to discuss the implementation plan.',
        time: '11:25 AM'
    },

    // --- Chat 5: student 9 & 10 (6 Messages) ---
    {
        id: 24,
        sender: 'student',
        text: "Can we get an update on the marketing campaign launch for the 'Nova' product?",
        user_id: 9,
        chat_id: 5,
        time: '02:00 PM',
    },
    {
        id: 25,
        sender: 'teacher',
        user_id: 10,
        chat_id: 5,
        text: 'The campaign is on track to launch next Monday. All creatives are finalized.',
        time: '02:05 PM',
    },
    {
        id: 26,
        sender: 'student',
        user_id: 9,
        chat_id: 5,
        text: 'Are the A/B test variations set up for the landing page?',
        time: '02:10 PM',
    },
    {
        id: 27,
        sender: 'teacher',
        user_id: 10,
        chat_id: 5,
        text: 'Yes, we have three variations active for the first 48 hours to determine the winner.',
        time: '02:12 PM',
    },
    {
        id: 28,
        sender: 'student',
        user_id: 9,
        chat_id: 5,
        text: 'Great. Please share the reporting dashboard link once it’s live.',
        time: '02:15 PM',
    },
    {
        id: 29,
        sender: 'teacher',
        user_id: 10,
        chat_id: 5,
        text: 'Will do. I’ll send a final readiness check by end of day.',
        time: '02:17 PM',
    },

    // --- Chat 6: student 11 & 12 (6 Messages) ---
    {
        id: 30,
        sender: 'student',
        text: "I am having trouble accessing the shared HR drive. My password seems to be failing.",
        user_id: 11,
        chat_id: 6,
        time: '09:30 AM',
    },
    {
        id: 31,
        sender: 'teacher',
        user_id: 12,
        chat_id: 6,
        text: 'Sorry about that. I just reset your domain password. Try logging in again now.',
        time: '09:35 AM',
    },
    {
        id: 32,
        sender: 'student',
        user_id: 11,
        chat_id: 6,
        text: 'It worked! Thanks a bunch. Was there a security update I missed?',
        time: '09:37 AM',
    },
    {
        id: 33,
        sender: 'teacher',
        user_id: 12,
        chat_id: 6,
        text: 'You were part of an automated forced password rotation. It happens every 90 days.',
        time: '09:40 AM',
    },
    {
        id: 34,
        sender: 'student',
        user_id: 11,
        chat_id: 6,
        text: 'Ah, got it. Good to know. Closing the ticket now.',
        time: '09:42 AM',
    },
    {
        id: 35,
        sender: 'teacher',
        user_id: 12,
        chat_id: 6,
        text: 'No problem. Let me know if anything else comes up.',
        time: '09:43 AM',
    },

    // --- Chat 7: Mixed students (student 1, 3, 5, 7, 9) - Group Chat (8 Messages) ---
    {
        id: 36,
        sender: 'student',
        text: "We need to schedule the quarterly budget review meeting. When is everyone free next week?",
        user_id: 1,
        chat_id: 7,
        time: '03:00 PM',
    },
    {
        id: 37,
        sender: 'teacher',
        user_id: 3,
        chat_id: 7,
        text: 'Tuesday afternoon works best for me, between 2 PM and 4 PM.',
        time: '03:05 PM',
    },
    {
        id: 38,
        sender: 'student',
        user_id: 5,
        chat_id: 7,
        text: 'I can do Wednesday morning, but Tuesday is totally booked with external clients.',
        time: '03:10 PM',
    },
    {
        id: 39,
        sender: 'teacher',
        user_id: 7,
        chat_id: 7,
        text: 'Let’s aim for Wednesday at 10 AM then. Does that suit everyone?',
        time: '03:15 PM',
    },
    {
        id: 40,
        sender: 'student',
        user_id: 9,
        chat_id: 7,
        text: 'Wednesday 10 AM is perfect for me.',
        time: '03:16 PM',
    },
    {
        id: 41,
        sender: 'teacher',
        user_id: 1,
        chat_id: 7,
        text: 'I’ve sent out the calendar invite for Wednesday, 10 AM. Please confirm attendance.',
        time: '03:20 PM',
    },
    {
        id: 42,
        sender: 'student',
        user_id: 3,
        chat_id: 7,
        text: 'Confirmed.',
        time: '03:21 PM',
    },
    {
        id: 43,
        sender: 'teacher',
        user_id: 5,
        chat_id: 7,
        text: 'Confirmed. Thanks!',
        time: '03:22 PM',
    },

    // --- Chat 8: student 2, 4, 6, 8, 10, 12 - Group Chat (7 Messages) ---
    {
        id: 44,
        sender: 'student',
        text: "Did anyone find the missing documentation for the API endpoints we decommissioned?",
        user_id: 2,
        chat_id: 8,
        time: '04:00 PM',
    },
    {
        id: 45,
        sender: 'teacher',
        user_id: 4,
        chat_id: 8,
        text: 'I think it was archived in the old SharePoint repository under "Legacy Tech".',
        time: '04:05 PM',
    },
    {
        id: 46,
        sender: 'student',
        user_id: 6,
        chat_id: 8,
        text: 'Found it! It was in the ' + '`archive/v1/deprecated`' + ' folder. Sending the link.',
        time: '04:10 PM',
    },
    {
        id: 47,
        sender: 'teacher',
        user_id: 8,
        chat_id: 8,
        text: 'Great find! I was looking for that last week for reference.',
        time: '04:11 PM',
    },
    {
        id: 48,
        sender: 'student',
        user_id: 10,
        chat_id: 8,
        text: 'Please make sure to add a note to the current documentation pointing to the archive.',
        time: '04:15 PM',
    },
    {
        id: 49,
        sender: 'teacher',
        user_id: 12,
        chat_id: 8,
        text: `Will do. I've updated the main index page.`,
        time: '04:17 PM',
    },
    {
        id: 50, // Total 51 messages (ID 0 to 50)
        sender: 'student',
        user_id: 2,
        chat_id: 8,
        text: 'Thanks, everyone, for the quick help!',
        time: '04:18 PM',
    }
];
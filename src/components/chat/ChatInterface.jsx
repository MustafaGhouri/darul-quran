import { useEffect, useState } from "react";
import { messages as mockMessages } from "../../lib/constants";
import { FiBellOff, FiEye, FiFlag, FiLock, FiMoreVertical, FiPaperclip, FiPhone, FiSend, FiTrash2, FiUserX, FiXCircle } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";
import { Button, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { CheckCheck } from "lucide-react";
import { BiLeftArrow } from "react-icons/bi";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function ChatInterface({
    isTeacherAndStudent = false,
    user,
    chat,
    setSelectedData,
    showInput = true,
}) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (isTeacherAndStudent && chat?.id) {
            const messagesByChatId = mockMessages.filter(i => i.chat_id === chat?.id);
            setMessages(messagesByChatId)
            setIsOpen(true)
            console.log(messagesByChatId, chat?.id);

        } else if (user?.id) {
            const messagesByUserId = mockMessages.filter(i => i.user_id === user?.id);
            setMessages(messagesByUserId)
            setIsOpen(true)
        }
    }, [user?.id, chat?.id]);

    const handleBack = () => {
        setIsOpen(false)
        setTimeout(() => {

            setSelectedData({})
        }, 150)
    }

    return (
        <div className={`flex flex-col duration-300 transition-transform ${isOpen ? "max-md:translate-x-0" : "max-md:translate-x-[120%]"}  max-md:fixed md:flex-1 h-screen bg-[#d2ebe5]`}>
            <div className=" border-b border-gray-300 px-4 py-3 flex items-center justify-between shrink-0">
                {user?.id ?
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                isIconOnly
                                onClick={handleBack}
                                variant="light"
                            >
                                <FaArrowLeftLong color="gray" />
                            </button>
                            <div
                                className={
                                    " w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold "
                                }
                                style={{
                                    backgroundColor: 'student' === 'student' ? "#FBF4EC" : "#8bc0b956",
                                    color: 'student' === 'student' ? '#D28E3D' : '#06574C'
                                }}
                            >
                                {user?.role === 'teacher' ?
                                    <img src="/icons/teacher_icon.png" alt="teacher" />
                                    :
                                    <img src="/icons/student_icon.png" alt="student" />
                                }
                            </div>
                        </div>
                        <div className="flex max-sm:flex-col items-center sm:gap-2 mb-1">
                            <h3 className="font-bold text-sm max-sm:order-1 text-gray-800">{user?.name}</h3>
                            <span
                                className={
                                    "text-[10px] sm:text-xs capitalize font-medium px-1 py-0.5 rounded-md"
                                }
                                style={{
                                    backgroundColor: user?.role === 'student' ? "#FBF4EC" : "#8bc0b956",
                                    color: user?.role === 'student' ? '#D28E3D' : '#06574C'
                                }}
                            >
                                {user?.role}
                            </span>
                        </div>
                    </div> :
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                isIconOnly
                                onClick={handleBack}
                                variant="light"
                            >
                                <FaArrowLeftLong color="gray" />
                            </button>
                            <div
                                className={
                                    " w-11 bg-blue-50 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold "
                                }
                            >

                                <img src="/icons/group-user.png" alt="group user" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-sm text-gray-800">{chat?.student_name}</h3>
                                <span
                                    className={
                                        "text-xs capitalize font-medium px-2 py-1 rounded-md"
                                    }
                                    style={{
                                        backgroundColor: "#FBF4EC",
                                        color: '#D28E3D'
                                    }}
                                >
                                    {'Student'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-sm text-gray-800">{chat?.teacher_name}</h3>
                                <span
                                    className={
                                        "text-xs capitalize font-medium px-2 py-1 rounded-md"
                                    }
                                    style={{
                                        backgroundColor: "#8bc0b956",
                                        color: '#06574C'
                                    }}
                                >
                                    {'Teacher'}
                                </span>
                            </div>
                        </div>
                    </div>
                }
                <div className="flex items-center gap-2">
                    <button className="px-3 max-sm:hidden py-1.5 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800">
                        View Profile
                    </button>
                    <Popover classNames={{
                        base: [
                            // arrow color
                            "before:bg-default-200",
                        ],
                        content: [
                            "py-3 px-4 border border-default-200",
                            "bg-linear-to-br from-white to-default-300",
                            "dark:from-default-100 dark:to-default-50",
                        ],
                    }} className="relative">
                        <PopoverTrigger >
                            <button className="p-1 text-gray-600 hover:text-gray-900">
                                <FiMoreVertical size={20} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-s48 p-1 bg-white rounded-xl shadow-xl border border-gray-100">
                           {!isTeacherAndStudent? <ul className="py-1">
                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                    >
                                        <span className="text-[18px]"><FiPhone /></span> Contact Info
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                    >
                                        <span className="text-[18px]"><FiBellOff /></span> Mute Notifications
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition text-red-500`}
                                    >
                                        <span className="text-[18px]"><FiUserX /></span> Block
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition text-red-500`}
                                    >
                                        <span className="text-[18px]"><FiFlag /></span> Report
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                        onClick={handleBack}
                                    >
                                        <span className="text-[18px]"><FiXCircle /></span> Close Chat
                                    </button>
                                </li>
                            </ul>:
                            <ul className="py-1">
                                 <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                    >
                                        <span className="text-[18px]"><FiEye  /></span> Teacher Info
                                    </button>
                                     <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                    >
                                        <span className="text-[18px]"><FiPhone  /></span> Student Info
                                    </button>
                                </li>
                                 <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-red-600"}`}
                                    >
                                        <span className="text-[18px]"><FiLock  /></span> Restrict User
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className={`flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg transition ${"text-gray-700"}`}
                                        onClick={handleBack}
                                    >
                                        <span className="text-[18px]"><FiXCircle /></span> Close Chat
                                    </button>
                                </li>
                            </ul>
                            }
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="text-center py-3">
                <span className="text-xs text-gray-400">28 August</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                {messages.length > 0 ? messages.map((msg, index) => (
                    <div key={msg.id}>
                        {msg.sender === 'student' ? (
                            <div className="flex justify-start">
                                <div className="max-w-[75%] min-w-[60%]">
                                    <div className="text-sm flex-col flex justify-end bg-white p-1 rounded-md mb-1">
                                        {msg.hasAttachment && (
                                            <div className="rounded-md bg-gray-50 p-2 border border-gray-300 flex items-start gap-3">
                                                <FaRegFileAlt color="#1a5850" size={24} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-900 truncate">
                                                        {msg.attachment.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {msg.attachment.size}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {msg.text && <p className="m-2">{msg.text}</p>}
                                        {msg.time &&
                                            <div className="flex items-center justify-end gap-2 mt-1">
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                                <span className="text-xs text-teal-600"><CheckCheck size={15} /></span>
                                            </div>}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <div className="max-w-[75%] min-w-[60%]">
                                    <div className="text-sm text-white flex-col flex justify-end bg-teal-700 p-3 rounded-md mb-1">
                                        {msg.hasAttachment && (
                                            <div className="rounded-md bg-teal-700/30 p-2 border border-gray-300 flex items-start gap-3">
                                                <FaRegFileAlt color="#f9fafb " size={24} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-50 truncate">
                                                        {msg.attachment.name}
                                                    </p>
                                                    <p className="text-xs text-gray-100 mt-0.5">
                                                        {msg.attachment.size}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {msg.text && <p className="m-2">{msg.text}</p>}
                                        {msg.time && <div className="flex items-center justify-end gap-2 mt-1">
                                            <span className="text-xs text-gray-200">{msg.time}</span>
                                            <span className="text-xs text-gray-200"><CheckCheck size={15} /></span>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {index === 1 && (
                            <div className="text-center py-3">
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                        )}
                    </div>
                )) :
                    <div className="text-center py-3">
                        <span className="text-lg text-gray-600">No Messages</span>
                    </div>
                }
                {messages.length > 0 && true && <div className="flex justify-start">
                    <div className="max-w-[85%]">
                        <div className="text-sm flex-col flex justify-end bg-white px-3 rounded-md mb-1">
                            <Spinner color="success" variant="dots" />
                        </div>
                    </div>
                </div>}
                {message && <div className="flex justify-end">
                    <div className="max-w-[85%]">
                        <div className="text-sm text-white flex-col flex justify-end bg-teal-700 px-3 rounded-md mb-1">
                            <Spinner color="warning" variant="dots" />
                        </div>
                    </div>
                </div>}
            </div>

            {
        showInput && <div className=" border-t border-gray-200 px-4 py-3 shrink-0">
            <div className="flex bg-white p-3 rounded-xl items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 shrink-0">
                    <FiPaperclip size={20} />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400 min-w-0"
                />
                <button className="px-4 py-2 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800 flex items-center gap-2 shrink-0">
                    Send
                    <FiSend className='rotate-45' size={14} />
                </button>
            </div>
        </div>
    }
        </div >
    );
}
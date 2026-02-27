import { useEffect, useState, useRef } from "react";
import { messages as mockMessages } from "../../lib/constants";
import { FiMoreVertical, FiPaperclip, FiSend, FiXCircle, FiPhone, FiBellOff, FiUserX, FiFlag, FiEye, FiLock } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { CheckCheck } from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setIncomingMessage, clearIncomingMessage } from "../../redux/reducers/chat";

const API = import.meta.env.VITE_PUBLIC_SERVER_URL;

export default function ChatInterface({
  isTeacherAndStudent = false,
  user: legacyUser,
  chat: legacyChat,
  setSelectedData,
  showInput = true,
  // New props for real chat (teacher/student)
  chatId,
  otherUser,
  currentUserId,
  setSelectedChat,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const incomingMessage = useSelector((state) => state.chat?.incomingMessage);

  const isRealChat = Boolean(chatId && otherUser && currentUserId);
  const displayUser = isRealChat ? otherUser : legacyUser;

  // Load messages from API when using real chat
  useEffect(() => {
    if (!isRealChat || !chatId) return;
    setLoading(true);
    fetch(`${API}/api/chat/${chatId}/messages`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
        else setMessages([]);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [isRealChat, chatId]);

  // Mock data for admin / legacy view
  useEffect(() => {
    if (isRealChat) return;
    if (isTeacherAndStudent && legacyChat?.id) {
      const byChat = mockMessages.filter((i) => i.chat_id === legacyChat.id);
      setMessages(byChat);
      setIsOpen(true);
    } else if (legacyUser?.id) {
      const byUser = mockMessages.filter((i) => i.user_id === legacyUser.id);
      setMessages(byUser);
      setIsOpen(true);
    }
  }, [isRealChat, legacyUser?.id, legacyChat?.id, isTeacherAndStudent]);

  // Append incoming real-time message when it belongs to this chat
  useEffect(() => {
    if (!incomingMessage || !isRealChat || incomingMessage.chatId !== chatId) return;
    const msg = incomingMessage.message;
    if (!msg) {
      dispatch(clearIncomingMessage());
      return;
    }
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    dispatch(clearIncomingMessage());
  }, [incomingMessage, isRealChat, chatId, dispatch]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    if (messages.length) scrollToBottom();
  }, [messages.length]);

  const handleBack = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (setSelectedChat) setSelectedChat(null);
      if (setSelectedData) setSelectedData({});
    }, 150);
  };

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;
    if (isRealChat && otherUser?.id) {
      setSending(true);
      setMessage("");
      try {
        const res = await fetch(`${API}/api/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ receiverId: otherUser.id, message: text, type: "text" }),
        });
        const data = await res.json();
        if (data.success && data.data?.message) {
          setMessages((prev) => [...prev, data.data.message]);
        } else {
          setMessage(text);
        }
      } catch (err) {
        setMessage(text);
      } finally {
        setSending(false);
      }
    } else {
      setMessage("");
    }
  };

  const showInputArea = showInput && (isRealChat || !isTeacherAndStudent);

  return (
    <div
      className={`flex flex-col duration-300 transition-transform ${isOpen ? "max-md:translate-x-0" : "max-md:translate-x-[120%]"} max-md:fixed md:flex-1 h-screen bg-[#d2ebe5]`}
    >
      {/* Header */}
      <div className="border-b border-gray-300 px-4 py-3 flex items-center justify-between shrink-0">
        {displayUser ? (
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleBack} className="p-1 rounded hover:bg-black/5">
              <FaArrowLeftLong color="gray" />
            </button>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: (displayUser.role || "student") === "teacher" ? "#8bc0b956" : "#FBF4EC",
                color: (displayUser.role || "student") === "teacher" ? "#06574C" : "#D28E3D",
              }}
            >
              {(displayUser.role || "student") === "teacher" ? (
                <img src="/icons/teacher_icon.png" alt="teacher" />
              ) : (
                <img src="/icons/student_icon.png" alt="student" />
              )}
            </div>
            <div className="flex max-sm:flex-col items-center sm:gap-2">
              <h3 className="font-bold text-sm text-gray-800">{displayUser.name || "User"}</h3>
              <span
                className="text-[10px] sm:text-xs capitalize font-medium px-1 py-0.5 rounded-md"
                style={{
                  backgroundColor: (displayUser.role || "student") === "student" ? "#FBF4EC" : "#8bc0b956",
                  color: (displayUser.role || "student") === "student" ? "#D28E3D" : "#06574C",
                }}
              >
                {displayUser.role || "student"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleBack} className="p-1 rounded hover:bg-black/5">
              <FaArrowLeftLong color="gray" />
            </button>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <img src="/icons/group-user.png" alt="group" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-gray-800">{legacyChat?.student_name}</h3>
              <h3 className="font-bold text-sm text-gray-800">{legacyChat?.teacher_name}</h3>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Popover
            classNames={{
              content: "py-3 px-4 border border-default-200 bg-white rounded-xl shadow-xl",
            }}
          >
            <PopoverTrigger>
              <button type="button" className="p-1 text-gray-600 hover:text-gray-900">
                <FiMoreVertical size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1">
              {!isTeacherAndStudent ? (
                <ul className="py-1">
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiPhone className="text-lg" /> Contact Info</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiBellOff className="text-lg" /> Mute</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-500 hover:bg-gray-100 rounded-lg"><FiUserX className="text-lg" /> Block</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-500 hover:bg-gray-100 rounded-lg"><FiFlag className="text-lg" /> Report</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg" onClick={handleBack}><FiXCircle className="text-lg" /> Close Chat</button></li>
                </ul>
              ) : (
                <ul className="py-1">
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiEye className="text-lg" /> Teacher Info</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiPhone className="text-lg" /> Student Info</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-600 hover:bg-gray-100 rounded-lg"><FiLock className="text-lg" /> Restrict</button></li>
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg" onClick={handleBack}><FiXCircle className="text-lg" /> Close Chat</button></li>
                </ul>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner color="success" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSent = isRealChat ? msg.userId === currentUserId : msg.sender !== "student";
            const text = msg.text ?? msg.message;
            const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : msg.time || "";

            return (
              <div key={msg.id || index}>
                {!isSent ? (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] min-w-[60%]">
                      <div className="text-sm flex-col flex justify-end bg-white p-3 rounded-md mb-1">
                        {msg.hasAttachment && (
                          <div className="rounded-md bg-gray-50 p-2 border border-gray-300 flex items-start gap-3">
                            <FaRegFileAlt color="#1a5850" size={24} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{msg.attachment?.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{msg.attachment?.size}</p>
                            </div>
                          </div>
                        )}
                        {text && <p className="m-0">{text}</p>}
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs text-gray-400">{time}</span>
                          <span className="text-xs text-teal-600"><CheckCheck size={15} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[75%] min-w-[60%]">
                      <div className="text-sm text-white flex-col flex justify-end bg-teal-700 p-3 rounded-md mb-1">
                        {msg.hasAttachment && (
                          <div className="rounded-md bg-teal-700/30 p-2 border border-gray-300 flex items-start gap-3">
                            <FaRegFileAlt color="#f9fafb" size={24} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-50 truncate">{msg.attachment?.name}</p>
                              <p className="text-xs text-gray-100 mt-0.5">{msg.attachment?.size}</p>
                            </div>
                          </div>
                        )}
                        {text && <p className="m-0">{text}</p>}
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs text-gray-200">{time}</span>
                          <span className="text-xs text-gray-200"><CheckCheck size={15} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex justify-center py-8">
            <span className="text-gray-600">No messages yet. Say hello!</span>
          </div>
        )}
        {sending && (
          <div className="flex justify-end">
            <div className="max-w-[85%]">
              <div className="text-sm text-white bg-teal-700 px-3 py-2 rounded-md">
                <Spinner size="sm" color="white" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showInputArea && (
        <div className="border-t border-gray-200 px-4 py-3 shrink-0 sticky bottom-0 bg-[#d2ebe5]">
          <div className="flex bg-white p-3 rounded-xl items-center gap-2">
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700 shrink-0">
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Send a message..."
              className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder-gray-400 min-w-0"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={sending || !message.trim()}
              className="px-4 py-2 bg-teal-700 text-white text-xs font-medium rounded-md hover:bg-teal-800 disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              Send
              <FiSend className="rotate-45" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

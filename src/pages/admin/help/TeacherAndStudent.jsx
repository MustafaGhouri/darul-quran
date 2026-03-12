import { useState, useEffect } from "react";
import { Edit, Search } from "lucide-react";
import ChatInterface from "../../../components/chat/ChatInterface";

const API = import.meta.env.VITE_PUBLIC_SERVER_URL;

export default function TeacherAndStudentChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        const finalToken = localStorage.getItem("token");
        const headers = {};
        if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
        const res = await fetch(`${API}/api/chat/teacher-student-chats`, { credentials: "include", headers });
        const data = await res.json();
        if (res.ok && data.chats) setChats(data.chats);
        else setChats([]);
      } catch (err) {
        console.error("Failed to fetch teacher-student chats", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) => {
    const teacherName = [chat.teacherFirstName, chat.teacherLastName].filter(Boolean).join(" ").toLowerCase();
    const studentName = [chat.studentFirstName, chat.studentLastName].filter(Boolean).join(" ").toLowerCase();
    const q = searchQuery.toLowerCase();
    return teacherName.includes(q) || studentName.includes(q) || (chat.teacherEmail || "").toLowerCase().includes(q) || (chat.studentEmail || "").toLowerCase().includes(q);
  });

  const handleCloseChat = () => setSelectedChat(null);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      <div className="flex flex-col md:w-80 xl:w-96 border-r border-gray-200 h-screen overflow-hidden">
        <div className="shrink-0 border-b border-gray-100 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">Teacher & Student Chat</h1>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                {chats.length}
              </span>
            </div>
            <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full border border-teal-200 hover:bg-gray-50 transition-colors">
              <Edit size={20} className="text-teal-700" />
            </button>
          </div>

          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by teacher or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 no-scrollbar overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8 text-gray-500">Loading chats...</div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const teacherName = [chat.teacherFirstName, chat.teacherLastName].filter(Boolean).join(" ") || chat.teacherEmail || "Teacher";
              const studentName = [chat.studentFirstName, chat.studentLastName].filter(Boolean).join(" ") || chat.studentEmail || "Student";
              const time = chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
              return (
                <div
                  key={chat.id}
                  className={`
                    flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200
                    ${selectedChat?.id === chat.id ? "bg-[#EBD4C9] border-l-4 border-l-[#D28E3D]" : ""}
                  `}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-[#eff6ff]">
                    <img src="/icons/group-user.png" alt="chat" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-teal-700 font-medium">Teacher</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-amber-700 font-medium">Student</span>
                    </div>
                    <p className="font-bold text-sm text-gray-800 truncate">{teacherName}</p>
                    <p className="text-sm text-gray-600 truncate">{studentName}</p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{chat.lastMessage || "No messages yet"}</p>
                  </div>
                  <div className="shrink-0 text-xs text-gray-400">{time}</div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No teacher-student chats found.
            </div>
          )}
        </div>
      </div>

      {selectedChat ? (
        <ChatInterface
          adminViewMode
          chatId={selectedChat.id}
          adminTeacherId={selectedChat.teacherId}
          adminTeacherName={[selectedChat.teacherFirstName, selectedChat.teacherLastName].filter(Boolean).join(" ") || selectedChat.teacherEmail || "Teacher"}
          adminStudentName={[selectedChat.studentFirstName, selectedChat.studentLastName].filter(Boolean).join(" ") || selectedChat.studentEmail || "Student"}
          setSelectedData={setSelectedChat}
          showInput={false}
        />
      ) : (
        <div className="flex max-md:hidden flex-col flex-1 justify-center items-center h-screen bg-[#95c4be48]">
          <p className="text-gray-500 text-lg font-semibold">
            👋 Select a chat to view the conversation between teacher and student.
          </p>
        </div>
      )}
    </div>
  );
}

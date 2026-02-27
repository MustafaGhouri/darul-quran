import { useState, useEffect } from "react";
import { Edit, Search } from "lucide-react";
import ChatInterface from "../../../components/chat/ChatInterface";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChatId } from "../../../redux/reducers/chat";

const API = import.meta.env.VITE_PUBLIC_SERVER_URL;

export default function HelpMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state?.user);

  // Sync selected chat to Redux so App can avoid toasting when user is viewing this chat
  useEffect(() => {
    dispatch(setActiveChatId(selectedChat?.id ?? null));
    return () => dispatch(setActiveChatId(null));
  }, [selectedChat?.id, dispatch]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch(`${API}/api/chat`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.chats) {
          setChats(data.chats);
        } else {
          setChats([]);
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.id) fetchChats();
  }, [currentUser?.id]);

  const filteredChats = chats.filter((chat) => {
    const name = [chat.otherUserFirstName, chat.otherUserLastName].filter(Boolean).join(" ") || chat.otherUserEmail || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedOtherUser = selectedChat
    ? {
        id: selectedChat.otherUserId,
        name: [selectedChat.otherUserFirstName, selectedChat.otherUserLastName].filter(Boolean).join(" ") || selectedChat.otherUserEmail || "User",
        role: selectedChat.otherUserRole || "student",
      }
    : null;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      <div className="flex flex-col md:w-80 xl:w-96 border-r border-gray-200 h-screen overflow-hidden">
        <div className="shrink-0 border-b border-gray-100 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">Messages</h1>
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                {chats.length}
              </span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full border border-teal-200 hover:bg-gray-50 transition-colors">
              <Edit size={20} className="text-teal-700" />
            </button>
          </div>

          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search..."
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
              const name = [chat.otherUserFirstName, chat.otherUserLastName].filter(Boolean).join(" ") || chat.otherUserEmail || "User";
              const role = (chat.otherUserRole || "student").toLowerCase();
              const time = chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
              return (
                <div
                  key={chat.id}
                  className={`
                    flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:opacity-65 border-b border-b-gray-200 
                    ${chat.id === selectedChat?.id ? "bg-[#EBD4C9] border-l-4 border-l-[#D28E3D]" : ""}
                  `}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: role === "student" ? "#FBF4EC" : "#8bc0b956",
                      color: role === "student" ? "#D28E3D" : "#06574C",
                    }}
                  >
                    {role === "teacher" ? (
                      <img src="/icons/teacher_icon.png" alt="teacher" />
                    ) : (
                      <img src="/icons/student_icon.png" alt="student" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-800">{name}</h3>
                      <span
                        className="text-xs capitalize font-medium px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: role === "student" ? "#FBF4EC" : "#8bc0b956",
                          color: role === "student" ? "#D28E3D" : "#06574C",
                        }}
                      >
                        {role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage || "No messages yet"}</p>
                  </div>
                  <div className="shrink-0 text-xs text-gray-400">{time}</div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No chats yet. Start a conversation from a course or profile.
            </div>
          )}
        </div>
      </div>

      {selectedChat && selectedOtherUser && currentUser ? (
        <ChatInterface
          chatId={selectedChat.id}
          otherUser={selectedOtherUser}
          currentUserId={currentUser.id}
          setSelectedChat={setSelectedChat}
        />
      ) : (
        <div className="flex max-md:hidden flex-col flex-1 justify-center items-center h-screen bg-[#95c4be48]">
          <p className="text-gray-500 text-lg font-semibold">
            👋 Select a chat from the sidebar to view the conversation.
          </p>
        </div>
      )}
    </div>
  );
}

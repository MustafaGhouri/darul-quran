import { useState, useEffect, useRef } from "react";
import { Edit, Search, Headphones } from "lucide-react";
import ChatInterface from "../../../components/chat/ChatInterface";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChatId, setChats, updateChatPreview } from "../../../redux/reducers/chat";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  useDisclosure,
} from "@heroui/react";

const API = import.meta.env.VITE_PUBLIC_SERVER_URL;

export default function HelpMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const { chatId: chatIdParam } = useParams();
  const navigate = useNavigate();
  const handledStartChatRef = useRef(null);
  const handledFromTicketRef = useRef(null);
  const { user: currentUser, token } = useSelector((state) => state?.user);
  const reduxChats = useSelector((state) => state?.chat?.chats ?? []);
  const onlineUsers = useSelector((state) => state?.chat?.onlineUsers);
  const [chats, setChatsLocal] = useState(reduxChats);
  const adminModal = useDisclosure();
  const [adminsList, setAdminsList] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Base path for chat (no chatId) so we can build URLs
  const messagesBasePath = location.pathname.replace(/\/\d+$/, "").replace(/\/$/, "") || location.pathname;

  // Use pre-fetched chats from Redux for instant show; merge with local when we fetch
  useEffect(() => {
    if (reduxChats.length > 0) setChatsLocal(reduxChats);
  }, [reduxChats]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const finalToken = localStorage.getItem("token") || token;
        const headers = {};
        if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
        const res = await fetch(`${API}/api/chat`, { credentials: "include", headers });
        const data = await res.json();
        if (res.ok && data.chats) {
          setChatsLocal(data.chats);
          dispatch(setChats(data.chats));
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.id) fetchChats();
  }, [currentUser?.id, dispatch]);

  // When navigated with startChatWith (e.g. from course details or attendance list), open that chat or new conversation
  useEffect(() => {
    const state = location.state;
    if (!state?.startChatWith || !currentUser?.id || loading) return;
    const key = `${state.startChatWith}`;
    if (handledStartChatRef.current === key) return;
    handledStartChatRef.current = key;

    const receiverId = state.startChatWith;
    const receiverName = state.receiverName || "User";
    const receiverRole = state.receiverRole || "student";

    const base = location.pathname.replace(/\/\d+$/, "").replace(/\/$/, "") || location.pathname;
    const existing = chats.find((c) => Number(c.otherUserId) === Number(receiverId));
    if (existing) {
      setSelectedChat(existing);
      navigate(`${base}/${existing.id}`, { replace: true });
    } else {
      setSelectedChat({
        id: null,
        otherUserId: receiverId,
        otherUserFirstName: receiverName,
        otherUserLastName: "",
        otherUserEmail: "",
        otherUserRole: receiverRole,
      });
      navigate(base, { replace: true });
    }
  }, [location.state, loading, chats, currentUser?.id, location.pathname, navigate]);

  // Admin: start chat from ticket (navigated from support tickets page)
  useEffect(() => {
    const state = location.state;
    if (!state?.fromTicket) {
      handledFromTicketRef.current = null;
      return;
    }
    if (!state?.ticketId || currentUser?.role !== "admin" || loading) return;
    const key = `ticket-${state.ticketId}`;
    if (handledFromTicketRef.current === key) return;
    handledFromTicketRef.current = key;

    (async () => {
      try {
        const finalToken = localStorage.getItem("token") || token;
        const res = await fetch(`${API}/api/chat/start-from-ticket`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${finalToken}`, "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ticketId: state.ticketId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to start chat");
        const { chat: newChat } = data;
        setChatsLocal((prev) => {
          const exists = prev.some((c) => c.id === newChat.id);
          if (exists) return prev.map((c) => (c.id === newChat.id ? newChat : c));
          return [newChat, ...prev].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        });
        dispatch(updateChatPreview({ chat: newChat }));
        setSelectedChat(newChat);
        navigate(`${messagesBasePath}/${newChat.id}`, { replace: true });
      } catch (err) {
        console.error("Start chat from ticket failed:", err);
      }
    })();
  }, [location.state, currentUser?.role, loading, messagesBasePath, navigate, dispatch]);

  // Sync selected chat to Redux and URL: when chatId in URL exists, select that chat; when user selects chat, update URL
  useEffect(() => {
    dispatch(setActiveChatId(selectedChat?.id ?? null));
    return () => dispatch(setActiveChatId(null));
  }, [selectedChat?.id, dispatch]);

  // Open chat from URL (e.g. /student/help/messages/5)
  useEffect(() => {
    if (!chatIdParam || loading) return;
    const id = parseInt(chatIdParam, 10);
    if (isNaN(id)) return;
    const found = chats.find((c) => c.id === id);
    if (found) setSelectedChat(found);
  }, [chatIdParam, loading, chats]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (chat?.id != null) {
      navigate(`${messagesBasePath}/${chat.id}`, { replace: true });
    } else {
      navigate(messagesBasePath, { replace: true });
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    navigate(messagesBasePath, { replace: true });
  };

  const filteredChats = chats.filter((chat) => {
    const name = [chat.otherUserFirstName, chat.otherUserLastName].filter(Boolean).join(" ") || chat.otherUserEmail || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedOtherUser = selectedChat
    ? {
      id: selectedChat.otherUserId,
      name: [selectedChat.otherUserFirstName, selectedChat.otherUserLastName].filter(Boolean).join(" ") || selectedChat.otherUserEmail || "User",
      role: selectedChat.otherUserRole || "student",
      email: selectedChat.otherUserEmail || "",
    }
    : null;

  const handleChatCreated = (newChatId) => {
    setSelectedChat((prev) => (prev && prev.id == null ? { ...prev, id: newChatId } : prev));
    navigate(`${messagesBasePath}/${newChatId}`, { replace: true });
  };

  const setSelectedChatAndSyncUrl = (chatOrNullOrUpdater) => {
    const next = typeof chatOrNullOrUpdater === "function" ? chatOrNullOrUpdater(selectedChat) : chatOrNullOrUpdater;
    setSelectedChat(next);
    if (next == null) navigate(messagesBasePath, { replace: true });
    else if (next?.id != null) navigate(`${messagesBasePath}/${next.id}`, { replace: true });
  };

  const showChatWithAdmin = (currentUser?.role === "student" || currentUser?.role === "teacher");

  const openAdminModal = async () => {
    adminModal.onOpen();
    setLoadingAdmins(true);
    setAdminsList([]);
    try {
      const res = await fetch(`${API}/api/chat/admins`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.admins) setAdminsList(data.admins);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleSelectAdmin = (admin) => {
    const existing = chats.find((c) => Number(c.otherUserId) === Number(admin.id));
    if (existing) {
      setSelectedChat(existing);
      navigate(`${messagesBasePath}/${existing.id}`, { replace: true });
    } else {
      setSelectedChat({
        id: null,
        otherUserId: admin.id,
        otherUserFirstName: admin.firstName ?? "",
        otherUserLastName: admin.lastName ?? "",
        otherUserEmail: admin.email ?? "",
        otherUserRole: "admin",
      });
      navigate(messagesBasePath, { replace: true });
    }
    adminModal.onClose();
  };

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
            <div className="flex items-center gap-1">
              {showChatWithAdmin && (
                <button
                  type="button"
                  onClick={openAdminModal}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-teal-200 hover:bg-teal-50 transition-colors text-teal-700"
                  title="Chat with admin"
                >
                  <Headphones size={20} />
                </button>
              )}
              <button className="flex items-center justify-center w-10 h-10 rounded-full border border-teal-200 hover:bg-gray-50 transition-colors">
                <Edit size={20} className="text-teal-700" />
              </button>
            </div>
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
          {loading && chats.length === 0 ? (
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
                  onClick={() => handleSelectChat(chat)}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: role === "student" ? "#FBF4EC" : role === "admin" ? "#E5E7EB" : "#8bc0b956",
                      color: role === "student" ? "#D28E3D" : role === "admin" ? "#374151" : "#06574C",
                    }}
                  >
                    <div className="relative">
                      <span className={`absolute -bottom-3 -right-3 h-3 w-3 rounded-full ring-2 ring-white 
                  ${onlineUsers.includes(chat?.otherUserId) ? "bg-emerald-500" : "bg-neutral-300"}`} />
                      {role === "teacher" ? (
                        <img src="/icons/teacher_icon.png" alt="teacher" />
                      ) : role === "admin" ? (
                        <Headphones size={22} />
                      ) : (
                        <img src="/icons/student_icon.png" alt="student" />
                      )}                    </div>

                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-800">{name}</h3>
                      <span
                        className="text-xs capitalize font-medium px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: role === "student" ? "#FBF4EC" : role === "admin" ? "#E5E7EB" : "#8bc0b956",
                          color: role === "student" ? "#D28E3D" : role === "admin" ? "#374151" : "#06574C",
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
          setSelectedChat={setSelectedChatAndSyncUrl}
          onChatCreated={handleChatCreated}
        />
      ) : (
        <div className="flex max-md:hidden flex-col flex-1 justify-center items-center h-screen bg-[#95c4be48]">
          <p className="text-gray-500 text-lg font-semibold">
            👋 Select a chat from the sidebar to view the conversation.
          </p>
        </div>
      )}

      {/* Modal: Select admin to chat with (student/teacher only) */}
      <Modal isOpen={adminModal.isOpen} onOpenChange={adminModal.onOpenChange} size="md">
        <ModalContent>
          <ModalHeader>Chat with admin</ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 mb-3">Select an admin to start a conversation.</p>
            {loadingAdmins ? (
              <div className="flex justify-center py-6">
                <Spinner color="success" />
              </div>
            ) : adminsList.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No active admins available.</p>
            ) : (
              <ul className="space-y-2 max-h-[280px] overflow-y-auto">
                {adminsList.map((admin) => {
                  const name = [admin.firstName, admin.lastName].filter(Boolean).join(" ") || admin.email || "Admin";
                  return (
                    <li key={admin.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectAdmin(admin)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-200 text-gray-600">
                          <Headphones size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{name}</p>
                          <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

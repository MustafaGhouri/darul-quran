import { useEffect, useState, useRef } from "react";
import { messages as mockMessages } from "../../lib/constants";
import { FiMoreVertical, FiXCircle, FiPhone, FiBellOff, FiUserX, FiFlag, FiEye, FiLock } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, addToast } from "@heroui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIncomingMessage, clearIncomingMessage, setMessagesForChat, appendMessageToChat, replaceTempMessage, updateChatPreview } from "../../redux/reducers/chat";

import ChatMessageBubble from "./ChatMessageBubble";
import MessageStatusIcon from "./MessageStatusIcon";
import ChatInput from "./ChatInput";
import DateSeparator from "./DateSeparator";
import { parseMessageAttachment, getMessageDateKey, formatDateSeparator } from "./utils/chatMessage";

const API = import.meta.env.VITE_PUBLIC_SERVER_URL;
const MESSAGES_PAGE_SIZE = 30;

export default function ChatInterface({
  isTeacherAndStudent = false,
  user: legacyUser,
  chat: legacyChat,
  setSelectedData,
  showInput = true,
  // New props for real chat (teacher/student). chatId can be null for new conversation.
  chatId,
  otherUser,
  currentUserId,
  setSelectedChat,
  fetchChats,
  onChatCreated,
  // Admin view: observe teacher-student chat (read-only, no input)
  adminViewMode = false,
  adminTeacherId = null,
  adminTeacherName = "",
  adminTeacherEmail = "",
  adminStudentName = "",
  adminStudentEmail = "",
  // Restriction state
  isRestricted = false,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [teacherStudentInfoModalOpen, setTeacherStudentInfoModalOpen] = useState(false);
  const [mutedChats, setMutedChats] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_muted_ids");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [restricting, setRestricting] = useState(false);
  const [chatRestricted, setChatRestricted] = useState(isRestricted);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const [attachedAttachment, setAttachedAttachment] = useState(null);
  const dispatch = useDispatch();
  const incomingMessage = useSelector((state) => state.chat?.incomingMessage);
  const currentUser = useSelector((state) => state?.user?.user);
  const onlineUsers = useSelector((state) => state?.chat?.onlineUsers);
  const cachedMessages = useSelector((state) => (chatId != null ? state.chat?.messagesByChatId?.[chatId] : null));

  const isRealChat = Boolean(otherUser && currentUserId);
  const isAdminView = Boolean(adminViewMode && chatId != null);
  const displayUser = isRealChat ? otherUser : legacyUser;

  /** Use Redux messages when available so delivery/read updates (from socket) show immediately */
  const displayMessages = (isRealChat && chatId != null && Array.isArray(cachedMessages) && cachedMessages.length >= 0)
    ? cachedMessages
    : isAdminView && Array.isArray(cachedMessages) && cachedMessages.length >= 0
      ? cachedMessages
      : messages;

  // Load messages: use cache first for instant show, then fetch (merge/replace). Also load when admin is viewing a teacher-student chat.
  useEffect(() => {
    const shouldFetch = (isRealChat || isAdminView) && chatId;
    if (!shouldFetch) return;
    if (cachedMessages && cachedMessages.length > 0 && !isAdminView) {
      setMessages(cachedMessages);
      setLoading(false);
    } else if (isAdminView && cachedMessages && cachedMessages.length > 0) {
      setMessages(cachedMessages);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setHasMoreOlder(true);
    const finalToken = localStorage.getItem("token");
    const headers = {};
    if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
    const url = `${API}/api/chat/${chatId}/messages?limit=${MESSAGES_PAGE_SIZE}`;
    fetch(url, { credentials: "include", headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          dispatch(setMessagesForChat({ chatId, messages: data.messages }));
        } else if (!cachedMessages?.length) {
          setMessages([]);
        }
        setHasMoreOlder(!!data.hasMore);
        // Update restriction status from API response
        if (data.isRestricted !== undefined) {
          setChatRestricted(data.isRestricted);
        }
      })
      .catch(() => {
        if (!cachedMessages?.length) setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [isRealChat, isAdminView, chatId]);

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

  // Append incoming real-time message when it belongs to this chat (skip when chatId is null - new conversation)
  useEffect(() => {
    if (!incomingMessage || !isRealChat || chatId == null || incomingMessage.chatId !== chatId) return;
    const msg = incomingMessage.message;
    if (!msg) {
      dispatch(clearIncomingMessage());
      return;
    }
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    dispatch(appendMessageToChat({ chatId, message: msg }));
    dispatch(clearIncomingMessage());
  }, [incomingMessage, isRealChat, chatId, dispatch]);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  // When initial load finishes, scroll to bottom so latest messages are visible (not stuck at top)
  useEffect(() => {
    if (!loading && displayMessages.length > 0 && messagesTopRef.current) {
      const el = messagesTopRef.current;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [loading, chatId]);

  // Scroll to bottom when a new message is appended (sent or received), not on initial load or when loading older
  const prevLastIdRef = useRef(null);
  useEffect(() => {
    if (displayMessages.length === 0) return;
    const lastMsg = displayMessages[displayMessages.length - 1];
    const lastId = lastMsg?.id ?? lastMsg?.tempId ?? null;
    const hadMessages = prevLastIdRef.current !== null;
    if (lastId != null && hadMessages && lastId !== prevLastIdRef.current) {
      scrollToBottom("smooth");
    }
    prevLastIdRef.current = lastId;
  }, [displayMessages.length, displayMessages]);

  const handleBack = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (setSelectedChat) setSelectedChat(null);
      if (setSelectedData) setSelectedData(null);
    }, 150);
  };

  const muteKey = (chatId != null ? chatId : otherUser?.id) ?? "new";
  const isMuted = mutedChats.includes(muteKey);
  const toggleMute = () => {
    const next = isMuted ? mutedChats.filter((id) => id !== muteKey) : [...mutedChats, muteKey];
    setMutedChats(next);
    try {
      localStorage.setItem("chat_muted_ids", JSON.stringify(next));
    } catch (_) { }
    addToast({
      title: next.includes(muteKey) ? "Chat muted" : "Chat unmuted",
      color: "success",
      variant: "solid",
      placement: "bottom-right",
    });
  };

  const handleBlock = async () => {
    setBlocking(true);
    const finalToken = localStorage.getItem("token");
    const headers = {};
    if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
    const url = `${API}/api/chat/${chatId}/block`;
    try {

      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include", headers
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message)
      }
      addToast({
        title: data?.message,
        description: data?.block ? "They can no longer start new conversations with you." : "You can start new conversations with this user.",
        color: "warning",
        variant: "solid",
        placement: "bottom-right",
      });
      fetchChats?.()
      setBlockModalOpen(false);
      if (setSelectedChat) setSelectedChat(null);
    } catch (error) {
      addToast({
        title: error?.message,
        color: "danger",
        variant: "solid",
        placement: "bottom-right",
      });
    } finally {
      setBlocking(false);

    }
  };

  const handleReport = () => {
    setReportModalOpen(false);
    const role = (currentUser?.role || "student").toLowerCase();
    const path = role === "admin" ? "/admin/tickets" : role === "teacher" ? "/teacher/support-tickets" : "/student/support-tickets";
    navigate(path);
    addToast({
      title: "Opening support",
      description: "You can submit a report or ticket there.",
      color: "primary",
      variant: "solid",
      placement: "bottom-right",
    });
  };

  const handleRestrict = async () => {
    if (!isAdminView) {
      addToast({
        title: "Restrict conversation",
        description: "Contact an admin to restrict this chat.",
        color: "warning",
        variant: "solid",
        placement: "bottom-right",
      });
      return;
    }
    setRestricting(true);
    const finalToken = localStorage.getItem("token");
    const headers = {};
    if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
    const url = `${API}/api/chat/${chatId}/restrict`;
    try {
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to restrict chat");
      }
      setChatRestricted(data.isRestricted);
      addToast({
        title: data.isRestricted ? "Chat restricted" : "Chat unrestricted",
        description: data.isRestricted
          ? "Teacher and student can no longer send messages in this chat."
          : "Chat has been unrestricted. Teacher and student can now send messages.",
        color: "success",
        variant: "solid",
        placement: "bottom-right",
      });
      setRestrictModalOpen(false);
      fetchChats?.();
    } catch (error) {
      addToast({
        title: error?.message || "Failed to restrict chat",
        color: "danger",
        variant: "solid",
        placement: "bottom-right",
      });
    } finally {
      setRestricting(false);
    }
  };

  const deleteUploadedFile = async (url) => {
    if (!url) return;
    try {
      const finalToken = localStorage.getItem("token");
      await fetch(`${API}/api/chat/upload/delete`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${finalToken}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url }),
      });
    } catch (_) { }
  };

  const handleFileSelect = async (file) => {
    const previousUrl = attachedAttachment?.url;
    if (previousUrl) await deleteUploadedFile(previousUrl);

    setAttachedAttachment({ file, uploading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const finalToken = localStorage.getItem("token");
      const headers = {};
      if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
      const res = await fetch(`${API}/api/chat/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
        headers
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        addToast({ title: "Upload failed", color: "danger", placement: "bottom-right" });
        setAttachedAttachment(null);
        return;
      }
      const type = data.mimeType?.startsWith("image/") ? "image" : data.mimeType?.startsWith("video/") ? "video" : "file";
      setAttachedAttachment({
        url: data.url,
        name: data.name || file.name,
        size: data.size != null ? `${(data.size / 1024).toFixed(1)} KB` : "",
        type,
      });
    } catch (err) {
      addToast({ title: "Upload failed", color: "danger", placement: "bottom-right" });
      setAttachedAttachment(null);
    }
  };

  const handleRemoveAttachment = () => {
    const url = attachedAttachment?.url;
    if (url) deleteUploadedFile(url);
    setAttachedAttachment(null);
  };

  const sendMessage = async () => {
    // Prevent sending if chat is restricted by admin
    if (chatRestricted) {
      addToast({
        title: "Cannot send messages",
        description: "This conversation has been restricted by an admin.",
        color: "warning",
        placement: "bottom-right",
      });
      return;
    }

    // Prevent sending if chat is blocked by other user
    if (legacyChat?.isBlocked && legacyChat?.blockedBy !== currentUserId) {
      addToast({
        title: "Cannot send messages",
        description: "This conversation has been blocked by the other party.",
        color: "warning",
        placement: "bottom-right",
      });
      return;
    }

    const text = message.trim();
    const ready = attachedAttachment && attachedAttachment.url && !attachedAttachment.uploading;
    const hasAttachment = !!ready;
    if (!text && !hasAttachment) return;
    if (isRealChat && otherUser?.id) {
      const attachmentData = ready ? { url: attachedAttachment.url, name: attachedAttachment.name, size: attachedAttachment.size, type: attachedAttachment.type } : null;
      const filePayload = attachmentData ? JSON.stringify(attachmentData) : "";
      const textToSend = text || (hasAttachment ? "Attachment" : "");
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticMsg = {
        tempId,
        id: null,
        userId: currentUserId,
        text: textToSend,
        createdAt: new Date().toISOString(),
        pending: true,
        isDelivered: false,
        file: filePayload,
        hasAttachment: !!filePayload,
        attachment: attachmentData,
      };
      setMessage("");
      setAttachedAttachment(null);
      setMessages((prev) => [...prev, optimisticMsg]);
      dispatch(appendMessageToChat({ chatId: chatId ?? undefined, message: optimisticMsg }));
      setSending(true);
      try {
        const finalToken = localStorage.getItem("token");
        const res = await fetch(`${API}/api/chat/send`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${finalToken}`, "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            receiverId: otherUser.id,
            message: textToSend,
            type: filePayload ? "file" : "text",
            file: filePayload,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || data?.error)
        }
        if (data.success && data.data?.message) {
          const serverMsg = data.data.message;
          setMessages((prev) => prev.map((m) => (m.tempId === tempId ? serverMsg : m)));
          if (chatId != null) {
            dispatch(replaceTempMessage({ chatId, tempId, message: serverMsg }));
          } else {
            dispatch(appendMessageToChat({ chatId: data.data.chatId, message: serverMsg }));
          }
          if ((chatId == null || chatId === undefined) && data.data.chatId != null) {
            onChatCreated?.(data.data.chatId, data.data.chat);
          }
          dispatch(updateChatPreview({
            chat: {
              id: chatId ?? data.data.chatId,
              lastMessage: serverMsg.text,
              updatedAt: serverMsg.createdAt,
            },
          }));
        } else {
          setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
          setMessage(textToSend);
          if (attachmentData) setAttachedAttachment(attachmentData);
        }
      } catch (err) {
        addToast({
          title: err?.message,
          color: "danger",
          variant: "solid",
          placement: "bottom-right",
        });
        setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        setMessage(textToSend);
        if (attachmentData) setAttachedAttachment(attachmentData);
      } finally {
        setSending(false);
      }
    } else {
      setMessage("");
      setAttachedAttachment(null);
    }
  };

  const loadOlderMessages = () => {
    if (!chatId || loadingOlder || !hasMoreOlder || displayMessages.length === 0) return;
    const firstId = displayMessages[0]?.id;
    if (!firstId) return;
    setLoadingOlder(true);
    const finalToken = localStorage.getItem("token");
    const headers = {};
    if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;
    fetch(`${API}/api/chat/${chatId}/messages?limit=${MESSAGES_PAGE_SIZE}&beforeId=${firstId}`, { credentials: "include", headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          const current = cachedMessages ?? messages;
          const merged = [...data.messages, ...current];
          setMessages(merged);
          dispatch(setMessagesForChat({ chatId, messages: merged }));
        }
        setHasMoreOlder(!!data.hasMore);
      })
      .finally(() => setLoadingOlder(false));
  };

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop < 80 && hasMoreOlder && !loadingOlder) loadOlderMessages();
  };

  const showInputArea = showInput && !adminViewMode && (isRealChat || !isTeacherAndStudent);

  return (
    <div
      className={`flex flex-col duration-300 transition-transform ${isOpen ? "max-md:translate-x-0" : "max-md:translate-x-[120%]"} max-md:fixed md:flex-1 w-full h-[calc(100vh-64px)] bg-[#d2ebe5]`}
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
              <div className="relative">
                <span className={`absolute -bottom-2 -right-2 h-3 w-3 rounded-full ring-2 ring-white 
                  ${onlineUsers.includes(displayUser.id) ? "bg-emerald-500" : "bg-neutral-300"}`} />
                {(displayUser.role || "student") === "teacher" ? (
                  <img src="/icons/teacher_icon.png" alt="teacher" />
                ) : (
                  <img src="/icons/student_icon.png" alt="student" />
                )}
              </div>
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
        ) : isAdminView ? (
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleBack} className="p-1 rounded hover:bg-black/5">
              <FaArrowLeftLong color="gray" />
            </button>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <img src="/icons/group-user.png" alt="group" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs text-teal-700 font-medium truncate">Teacher: {adminTeacherName || legacyChat?.teacher_name}</p>
              <p className="text-xs text-amber-700 font-medium truncate">Student: {adminStudentName || legacyChat?.student_name}</p>
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
                  <li><button type="button" onClick={() => setContactModalOpen(true)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiPhone className="text-lg" /> Contact Info</button></li>
                  {legacyChat.otherUserRole !== "admin" &&
                    <>
                      <li><button type="button" onClick={toggleMute} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiBellOff className="text-lg" /> {isMuted ? "Unmute" : "Mute"}</button></li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setBlockModalOpen(true)}
                          disabled={(legacyChat?.isBlocked && legacyChat?.blockedBy != currentUserId)}
                          className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-500 hover:bg-gray-100 rounded-lg"><FiUserX className="text-lg" />
                          {(legacyChat?.isBlocked && legacyChat?.blockedBy == currentUserId) ?
                            "Unblock" :
                            legacyChat?.isBlocked ? "Blocked" : "Block"}
                        </button>
                      </li>
                      {currentUser?.role!=="admin" && <li><button type="button" onClick={() => setReportModalOpen(true)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-500 hover:bg-gray-100 rounded-lg"><FiFlag className="text-lg" /> Report</button></li>}
                    </>
                  }
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg" onClick={handleBack}><FiXCircle className="text-lg" /> Close Chat</button></li>
                </ul>
              ) : (
                <ul className="py-1">
                  <li><button type="button" onClick={() => setTeacherStudentInfoModalOpen(true)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiEye className="text-lg" /> Teacher Info</button></li>
                  <li><button type="button" onClick={() => setTeacherStudentInfoModalOpen(true)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg"><FiPhone className="text-lg" /> Student Info</button></li>
                  {isAdminView && <li><button type="button" onClick={() => setRestrictModalOpen(true)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] text-red-600 hover:bg-gray-100 rounded-lg"><FiLock className="text-lg" /> {chatRestricted ? "Unrestrict" : "Restrict"}</button></li>}
                  <li><button type="button" className="flex items-center gap-3 w-full text-left px-3 py-2 text-[15px] hover:bg-gray-100 rounded-lg" onClick={handleBack}><FiXCircle className="text-lg" /> Close Chat</button></li>
                </ul>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Blocked Banner */}
      {legacyChat?.isBlocked && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <FiUserX size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-red-800 mb-1">
                {legacyChat?.blockedBy == currentUserId
                  ? "You blocked this conversation"
                  : legacyChat?.blockedByName
                    ? `${legacyChat.blockedByName} blocked this conversation`
                    : "This conversation is blocked"}
              </h4>
              <p className="text-xs text-red-700">
                {legacyChat?.blockedBy == currentUserId
                  ? "You can unblock this user from the menu to resume messaging."
                  : "You cannot send messages in this conversation. The user who blocked this conversation can unblock it."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Restricted Banner */}
      {chatRestricted && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <FiLock size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-orange-800 mb-1">
                {isAdminView
                  ? "This chat has been restricted"
                  : "Admin has restricted this chat"}
              </h4>
              <p className="text-xs text-orange-700">
                {isAdminView
                  ? "Teacher and student can no longer send messages in this conversation."
                  : "You cannot send messages in this conversation. An admin has restricted this chat. Contact an admin if you believe this is an error."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-4"
        onScroll={handleScroll}
        ref={messagesTopRef}
        style={{ paddingBottom: showInputArea ? '100px' : '16px' }}
      >
        {loadingOlder && (
          <div className="flex justify-center py-2">
            <Spinner size="sm" color="success" />
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner color="success" />
          </div>
        ) : displayMessages.length > 0 ? (
          (() => {
            let lastDateKey = "";
            const uniqueMessages = [];
            const seenIds = new Set();
            for (const m of displayMessages) {
                const mid = m.id || m.tempId;
                if (mid && !seenIds.has(mid)) {
                    uniqueMessages.push(m);
                    seenIds.add(mid);
                } else if (!mid) {
                    uniqueMessages.push(m);
                }
            }

            return uniqueMessages.map((msg, index) => {
              const dateKey = getMessageDateKey(msg.createdAt);
              const showDate = dateKey && dateKey !== lastDateKey;
              if (showDate) lastDateKey = dateKey;

              const isSent = isAdminView ? msg.userId === adminTeacherId : isRealChat ? msg.userId === currentUserId : msg.sender !== "student";
              const text = msg.text ?? msg.message;
              const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : msg.time || "";
              const { attachment, hasAttachment } = parseMessageAttachment(msg);

              return (
                <>
                  {showDate && <DateSeparator label={formatDateSeparator(msg.createdAt)} />}
                  <div key={msg.id || msg.tempId || index}>
                    <ChatMessageBubble
                      isSent={isSent}
                      text={text}
                      time={time}
                      attachment={hasAttachment ? attachment : null}
                      statusIcon={isSent ? <MessageStatusIcon msg={msg} currentUserId={currentUserId} /> : null}
                    />
                  </div>
                </>
              );
            });
          })()
        ) : (
          <div className="flex justify-center py-8">
            <span className="text-gray-600">No messages yet!</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Contact Info Modal (real chat) */}
      {displayUser && !isTeacherAndStudent && (
        <Modal isOpen={contactModalOpen} onOpenChange={setContactModalOpen}>
          <ModalContent>
            <ModalHeader>Contact Info</ModalHeader>
            <ModalBody>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {displayUser.name || "—"}</p>
                <p><span className="font-medium">Role:</span> {(displayUser.role || "—").toLowerCase()}</p>
                {displayUser.email ? <p><span className="font-medium">Email:</span> {displayUser.email}</p> : null}
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Block confirmation */}
      <Modal isOpen={blockModalOpen} onOpenChange={setBlockModalOpen}>
        <ModalContent>
          <ModalHeader>{(legacyChat?.isBlocked && legacyChat?.blockedBy == currentUserId) ?
            "Unblock" :
            legacyChat?.isBlocked ? "Blocked" : "Block"} user?</ModalHeader>
          <ModalBody>
            <p>This user will no longer be able to start new conversations with you. You can unblock them later from settings.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setBlockModalOpen(false)}>Cancel</Button>
            <Button isLoading={blocking} color="danger" onPress={handleBlock}>{(legacyChat?.isBlocked && legacyChat?.blockedBy == currentUserId) ?
              "Unblock" :
              legacyChat?.isBlocked ? "Blocked" : "Block"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Report */}
      <Modal isOpen={reportModalOpen} onOpenChange={setReportModalOpen}>
        <ModalContent>
          <ModalHeader>Report conversation</ModalHeader>
          <ModalBody>
            <p>You will be taken to support where you can describe the issue or report this conversation.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setReportModalOpen(false)}>Cancel</Button>
            <Button color="primary" onPress={handleReport}>Go to Support</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Restrict confirmation */}
      {isAdminView && (
        <Modal isOpen={restrictModalOpen} onOpenChange={setRestrictModalOpen}>
          <ModalContent>
            <ModalHeader>{chatRestricted ? "Unrestrict" : "Restrict"} chat?</ModalHeader>
            <ModalBody>
              <p>{chatRestricted
                ? "Unrestricting will allow the teacher and student to send messages again."
                : "Restricting will prevent the teacher and student from sending messages in this chat. They will see a notification that the chat has been restricted by an admin."}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setRestrictModalOpen(false)}>Cancel</Button>
              <Button isLoading={restricting} color="danger" onPress={handleRestrict}>{chatRestricted ? "Unrestrict" : "Restrict"}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Teacher / Student Info (legacy teacher-student view or admin view) */}
      {((isTeacherAndStudent && legacyChat) || isAdminView) ? (
        <Modal isOpen={teacherStudentInfoModalOpen} onOpenChange={setTeacherStudentInfoModalOpen}>
          <ModalContent>
            <ModalHeader>Conversation Info</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-teal-700">Teacher</h3>
                  <div className="pl-3 space-y-1">
                    <p><span className="font-medium">Name:</span> {isAdminView ? adminTeacherName : (legacyChat?.teacher_name || "—")}</p>
                    <p><span className="font-medium">Email:</span> {isAdminView ? adminTeacherEmail : (legacyChat?.teacher_email || "—")}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-amber-700">Student</h3>
                  <div className="pl-3 space-y-1">
                    <p><span className="font-medium">Name:</span> {isAdminView ? adminStudentName : (legacyChat?.student_name || "—")}</p>
                    <p><span className="font-medium">Email:</span> {isAdminView ? adminStudentEmail : (legacyChat?.student_email || "—")}</p>
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}

      {showInputArea && (
        <div className="sticky bottom-0 left-0 right-0 bg-[#d2ebe5] px-4 py-3 border-t border-gray-300 shadow-lg z-10">
          <ChatInput
            message={message}
            onMessageChange={setMessage}
            attachedAttachment={attachedAttachment}
            onFileSelect={handleFileSelect}
            onRemoveAttachment={handleRemoveAttachment}
            onSend={sendMessage}
            sending={sending}
            disabled={legacyChat?.isBlocked}
            onInvalidFile={() =>
              addToast({
                title: "Only images and videos are allowed",
                color: "warning",
                placement: "bottom-right",
              })
            }
          />
        </div>
      )}
    </div>
  );
}

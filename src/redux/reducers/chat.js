import { createSlice } from "@reduxjs/toolkit";

// export interface User {
//   id: string;
//   email: string;
//   name?: string;
//   image?: string;
//   role: boolean;


const initialState = {
    onlineUsers: [],
    incomingMessage: null,
    activeChatId: null,
    loading: true,
    chats: [],
    messagesByChatId: {},
};

const chatReducer = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        setIncomingMessage(state, action) {
            state.incomingMessage = action.payload;
        },
        clearIncomingMessage(state) {
            state.incomingMessage = null;
        },
        setActiveChatId(state, action) {
            state.activeChatId = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setChats(state, action) {
            state.chats = action.payload ?? [];
        },
        /** Upsert chat preview (lastMessage/updatedAt) when a new message arrives or is sent */
        updateChatPreview(state, action) {
            const { chat } = action.payload;
            if (!chat || chat.id == null) return;
            const idx = state.chats.findIndex((c) => c.id === chat.id);
            if (idx !== -1) {
                state.chats[idx] = {
                    ...state.chats[idx],
                    lastMessage: chat.lastMessage ?? state.chats[idx].lastMessage,
                    updatedAt: chat.updatedAt ?? state.chats[idx].updatedAt,
                };
            } else {
                state.chats.unshift({
                    id: chat.id,
                    senderId: chat.senderId,
                    receiverId: chat.receiverId,
                    lastMessage: chat.lastMessage ?? "",
                    createdAt: chat.createdAt ?? new Date().toISOString(),
                    updatedAt: chat.updatedAt ?? new Date().toISOString(),
                    otherUserId: chat.otherUserId ?? null,
                    otherUserFirstName: chat.otherUserFirstName ?? "",
                    otherUserLastName: chat.otherUserLastName ?? "",
                    otherUserEmail: chat.otherUserEmail ?? "",
                    otherUserRole: chat.otherUserRole ?? "student",
                });
            }
            state.chats.sort((a, b) => {
                const ad = new Date(a.updatedAt || a.createdAt || 0).getTime();
                const bd = new Date(b.updatedAt || b.createdAt || 0).getTime();
                return bd - ad;
            });
        },
        setMessagesForChat(state, action) {
            const { chatId, messages } = action.payload;
            if (chatId != null) state.messagesByChatId[chatId] = messages ?? [];
        },
        appendMessageToChat(state, action) {
            const { chatId, message } = action.payload;
            if (chatId == null) return;
            if (!state.messagesByChatId[chatId]) state.messagesByChatId[chatId] = [];
            const arr = state.messagesByChatId[chatId];
            if (arr.some((m) => (m.id && m.id === message.id) || (m.tempId && m.tempId === message.tempId))) return;
            state.messagesByChatId[chatId].push(message);
        },
        replaceTempMessage(state, action) {
            const { chatId, tempId, message } = action.payload;
            if (chatId == null || !state.messagesByChatId[chatId]) return;
            const idx = state.messagesByChatId[chatId].findIndex((m) => m.tempId === tempId);
            if (idx !== -1) state.messagesByChatId[chatId][idx] = message;
        },
        updateMessageDelivery(state, action) {
            const { chatId, messageId, isDelivered } = action.payload;
            if (chatId == null || !state.messagesByChatId[chatId]) return;
            const m = state.messagesByChatId[chatId].find((x) => x.id === messageId);
            if (m) m.isDelivered = isDelivered;
        },
        /** Set isRead: true for all messages in chat that are from the given userId (the sender sees blue tick) */
        setMessagesReadInChat(state, action) {
            const { chatId, userId } = action.payload;
            if (chatId == null || !state.messagesByChatId[chatId]) return;
            state.messagesByChatId[chatId].forEach((m) => {
                if (m.userId === userId) m.isRead = true;
            });
        },
    },
});

export const {
    setOnlineUsers,
    setIncomingMessage,
    clearIncomingMessage,
    setActiveChatId,
    setLoading,
    setChats,
    updateChatPreview,
    setMessagesForChat,
    appendMessageToChat,
    replaceTempMessage,
    updateMessageDelivery,
    setMessagesReadInChat,
} = chatReducer.actions;

export default chatReducer.reducer;

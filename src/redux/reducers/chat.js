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
    /** Chat ID the user is currently viewing (null if not on chat or no chat selected). Used to avoid toasting when they're in that chat. */
    activeChatId: null,
    loading: true,
};

const chatReducer = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        /** Payload: { chatId, message, chat } from socket receive-message */
        setIncomingMessage(state, action) {
            state.incomingMessage = action.payload;
        },
        clearIncomingMessage(state) {
            state.incomingMessage = null;
        },
        /** Set when user opens a chat; clear when they leave or close. Used for toast: don't toast if activeChatId === incomingMessage.chatId */
        setActiveChatId(state, action) {
            state.activeChatId = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const {
    setOnlineUsers,
    setIncomingMessage,
    clearIncomingMessage,
    setActiveChatId,
    setLoading,
} = chatReducer.actions;

export default chatReducer.reducer;

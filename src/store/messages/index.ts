import { createSlice } from '@reduxjs/toolkit';
import { Message } from "react-simple-chat";

interface MessageInterface {
    messages: Message[];
}

export const initialState: MessageInterface = {
    messages: [] as Message[]
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload]
        }
    },
});
export const messageDatas = (state: any) => state.initialState.messages
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessageState {
    messages: string[];
}

export const initialState: MessageState = {
    messages: [] as string[]
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state: MessageState, action: PayloadAction<string>) => {
            state.messages = [...state.messages, action.payload]
        }
    },
});
export const messageDatas = (state: any) => state.initialState.messages
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  timestamp: number;
}

interface MessageState {
  messages: Message[];
  activeMessageId: string | null;
  isSaving: boolean;
}

const initialState: MessageState = {
  messages: [],
  activeMessageId: null,
  isSaving: false,
};

// Load from localStorage on initialization
const loadMessagesFromStorage = (): Message[] => {
  try {
    const stored = localStorage.getItem('savedMessages');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
  }
  return [];
};

// Load active message ID from localStorage
const loadActiveMessageId = (): string | null => {
  try {
    return localStorage.getItem('activeMessageId');
  } catch (error) {
    console.error('Failed to load active message ID:', error);
  }
  return null;
};

// Initialize state from localStorage
const storedMessages = loadMessagesFromStorage();
const storedActiveId = loadActiveMessageId();

initialState.messages = storedMessages;
initialState.activeMessageId = storedActiveId;

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    saveMessage: (state, action: PayloadAction<{ content: string; messageId?: string }>) => {
      // If messageId is provided, update existing message; otherwise create new one
      if (action.payload.messageId && state.messages.some((msg) => msg.id === action.payload.messageId)) {
        // Update existing message
        const messageIndex = state.messages.findIndex((msg) => msg.id === action.payload.messageId);
        if (messageIndex !== -1) {
          state.messages[messageIndex].content = action.payload.content;
          state.messages[messageIndex].timestamp = Date.now();
          // Move to top (most recent)
          const updatedMessage = state.messages[messageIndex];
          state.messages.splice(messageIndex, 1);
          state.messages.unshift(updatedMessage);
          state.activeMessageId = action.payload.messageId;
        }
      } else {
        // Create new message
        const newMessage: Message = {
          id: Date.now().toString(),
          content: action.payload.content,
          timestamp: Date.now(),
        };
        
        // Keep only last 3 messages
        const updatedMessages = [newMessage, ...state.messages].slice(0, 3);
        state.messages = updatedMessages;
        state.activeMessageId = newMessage.id;
      }

      // Persist to localStorage
      try {
        localStorage.setItem('savedMessages', JSON.stringify(state.messages));
        if (state.activeMessageId) {
          localStorage.setItem('activeMessageId', state.activeMessageId);
        }
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
    loadMessage: (state, action: PayloadAction<string>) => {
      state.activeMessageId = action.payload;
      localStorage.setItem('activeMessageId', action.payload);
    },
    updateMessageContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      // Update the content of an existing message in real-time (for live preview)
      // This doesn't persist until save is called
      const messageIndex = state.messages.findIndex((msg) => msg.id === action.payload.id);
      if (messageIndex !== -1) {
        state.messages[messageIndex].content = action.payload.content;
      }
    },
    clearActiveMessage: (state) => {
      state.activeMessageId = null;
      try {
        localStorage.removeItem('activeMessageId');
      } catch (error) {
        console.error('Failed to clear active message ID:', error);
      }
    },
  },
});

export const { setSaving, saveMessage, loadMessage, updateMessageContent, clearActiveMessage } =
  messageSlice.actions;
export default messageSlice.reducer;


export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderRole: 'User' | 'Admin';
  createdAt: number;
}

export interface Chat {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: number;
  lastMessage: string;
  lastMessageAt: number | null;
  unreadByAdmin: number;
  unreadByUser: number;
}

export interface ChatState {
  messages: ChatMessage[];
  chats: Chat[];
  userChats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

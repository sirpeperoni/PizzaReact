import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  increment,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../shared/firebase';
import type { Chat, ChatMessage } from '../types/chat.types';

class ChatService {
  createChat = async (userId: string, username: string, userEmail: string, subject: string): Promise<string> => {
    const chatsRef = collection(db, 'chats');
    const now = Date.now();

    const newChat: Omit<Chat, 'id'> = {
      userId,
      username,
      userEmail,
      subject,
      status: 'open',
      createdAt: now,
      lastMessage: '',
      lastMessageAt: null,
      unreadByAdmin: 0,
      unreadByUser: 0,
    };

    const docRef = await addDoc(chatsRef, newChat);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  };

  sendMessage = async (chatId: string, text: string, senderId: string, senderRole: 'User' | 'Admin'): Promise<void> => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const now = Date.now();

    await addDoc(messagesRef, { text, senderId, senderRole, createdAt: now });

    const chatRef = doc(db, 'chats', chatId);
    const unreadField = senderRole === 'User' ? 'unreadByAdmin' : 'unreadByUser';

    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageAt: now,
      [unreadField]: increment(1),
    });
  };

  closeChat = async (chatId: string): Promise<void> => {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, { status: 'closed' });
  };

  subscribeToMessages = (chatId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snapshot => {
      const messages: ChatMessage[] = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ChatMessage, 'id'>) }));
      callback(messages);
    });
  };

  // Admin: all open chats, sorted by lastMessageAt desc (client-side sort to avoid composite index)
  subscribeToOpenChats = (callback: (chats: Chat[]) => void): Unsubscribe => {
    const q = query(collection(db, 'chats'), where('status', '==', 'open'));
    return onSnapshot(q, snapshot => {
      const chats: Chat[] = snapshot.docs
        .map(d => ({ id: d.id, ...(d.data() as Omit<Chat, 'id'>) }))
        .sort((a, b) => (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt));
      callback(chats);
    });
  };

  // User: their own chats (all statuses), sorted by createdAt desc
  subscribeToUserChats = (userId: string, callback: (chats: Chat[]) => void): Unsubscribe => {
    const q = query(collection(db, 'chats'), where('userId', '==', userId));
    return onSnapshot(q, snapshot => {
      const chats: Chat[] = snapshot.docs
        .map(d => ({ id: d.id, ...(d.data() as Omit<Chat, 'id'>) }))
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(chats);
    });
  };

  markReadByUser = async (chatId: string): Promise<void> => {
    await updateDoc(doc(db, 'chats', chatId), { unreadByUser: 0 });
  };

  markReadByAdmin = async (chatId: string): Promise<void> => {
    await updateDoc(doc(db, 'chats', chatId), { unreadByAdmin: 0 });
  };
}

export const chatService = new ChatService();

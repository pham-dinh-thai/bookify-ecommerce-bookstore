'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChatMessage, ChatSession } from '../types';
import * as chatbotService from '../services/chatbot.service';

type ChatContextValue = {
  isOpen: boolean;
  toggleChat: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  createSession: (title?: string) => Promise<string>;
  selectSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatbot(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatbot must be used within ChatProvider');
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);

  const refreshSessions = useCallback(async () => {
    try {
      const list = await chatbotService.listSessions();
      setSessions(list);
    } catch {
      // silent
    }
  }, []);

  const createSession = useCallback(
    async (title?: string): Promise<string> => {
      const { sessionId } = await chatbotService.createSession(title);
      await refreshSessions();
      setActiveSessionId(sessionId);
      setMessages([]);
      return sessionId;
    },
    [refreshSessions],
  );

  const selectSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    try {
      const detail = await chatbotService.getSessionHistory(sessionId);
      setMessages(detail.messages);
    } catch {
      setMessages([]);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      let sessionId = activeSessionId;

      if (!sessionId) {
        sessionId = await createSession();
      }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      let assistantContent = '';

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const cleanup = chatbotService.sendMessageStream(
        sessionId,
        content,
        (chunk: string) => {
          assistantContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: assistantContent }
                : m,
            ),
          );
        },
        () => {
          setIsStreaming(false);
          refreshSessions();
        },
        () => {
          setIsStreaming(false);
        },
      );

      abortRef.current = cleanup;
    },
    [activeSessionId, createSession, refreshSessions],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      await chatbotService.deleteSession(sessionId);

      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }

      await refreshSessions();
    },
    [activeSessionId, refreshSessions],
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      isOpen,
      toggleChat,
      sessions,
      activeSessionId,
      messages,
      isLoading,
      isStreaming,
      createSession,
      selectSession,
      sendMessage,
      deleteSession,
      refreshSessions,
    }),
    [
      isOpen,
      toggleChat,
      sessions,
      activeSessionId,
      messages,
      isLoading,
      isStreaming,
      createSession,
      selectSession,
      sendMessage,
      deleteSession,
      refreshSessions,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

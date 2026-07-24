'use client';

import { useChatbot } from '../hooks/use-chatbot';
import { useAuth } from '@/shared/auth/hooks/use-auth';
import { useEffect } from 'react';

export function ChatWindow() {
  const { isAuth } = useAuth();
  const { sessions, activeSessionId, selectSession, refreshSessions } =
    useChatbot();

  useEffect(() => {
    if (isAuth) {
      refreshSessions();
    }
  }, [isAuth, refreshSessions]);

  return (
    <div className="flex flex-1 overflow-hidden">
      {sessions.length > 0 && (
        <div className="w-[140px] border-r border-gray-100 bg-gray-50 p-2 overflow-y-auto">
          <SessionList />
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}

function SessionList() {
  const { sessions, activeSessionId, selectSession, deleteSession } =
    useChatbot();

  return (
    <div className="flex flex-col gap-1">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
            activeSessionId === session.id
              ? 'bg-[#3f6754]/10 text-[#3f6754]'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => selectSession(session.id)}
        >
          <span className="truncate flex-1">{session.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSession(session.id);
            }}
            className="ml-1 hidden text-gray-400 hover:text-red-500 group-hover:block"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function MessageList() {
  const { messages, isStreaming } = useChatbot();

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-400">
        <div>
          <p className="font-medium text-gray-500">Xin chào!</p>
          <p className="mt-1">Tôi có thể giúp gì cho bạn?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#3f6754] text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.content || (isStreaming && msg.role === 'assistant' ? (
              <span className="inline-block animate-pulse">...</span>
            ) : null)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageInput() {
  const { sendMessage, isStreaming } = useChatbot();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const content = input.value.trim();
    if (!content || isStreaming) return;
    input.value = '';
    sendMessage(content);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 p-3"
    >
      <div className="flex gap-2">
        <input
          name="message"
          placeholder="Nhập tin nhắn..."
          disabled={isStreaming}
          className="flex-1 rounded-xl bg-gray-100 px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-[#3f6754]/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="rounded-xl bg-[#3f6754] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#335b48] disabled:opacity-50"
        >
          Gửi
        </button>
      </div>
    </form>
  );
}

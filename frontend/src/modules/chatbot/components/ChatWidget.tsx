'use client';

import { useTranslations } from 'next-intl';
import { useChatbot } from '../hooks/use-chatbot';
import { ChatWindow } from './ChatWindow';

export function ChatWidget() {
  const { isOpen, toggleChat } = useChatbot();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[400px] h-[600px] rounded-2xl bg-white shadow-[0px_20px_40px_rgba(43,53,47,0.12)] flex flex-col overflow-hidden">
          <ChatHeader />
          <ChatWindow />
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#3f6754] text-white shadow-lg transition-transform hover:scale-105"
        >
          <ChatIcon />
        </button>
      )}
    </div>
  );
}

function ChatHeader() {
  const { toggleChat } = useChatbot();
  const t = useTranslations('chatbot');

  return (
    <div className="flex items-center justify-between bg-[#3f6754] px-4 py-3 text-white">
      <div>
        <h3 className="text-sm font-semibold">{t('title')}</h3>
        <p className="text-xs opacity-80">{t('subtitle')}</p>
      </div>
      <button
        onClick={toggleChat}
        className="rounded-lg p-1 opacity-80 hover:opacity-100"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

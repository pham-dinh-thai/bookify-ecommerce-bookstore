'use client';

import { ChatProvider } from './hooks/use-chatbot';
import { ChatWidget } from './components/ChatWidget';

export function ChatBot() {
  return (
    <ChatProvider>
      <ChatWidget />
    </ChatProvider>
  );
}

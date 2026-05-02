'use client';
import { createContext, useContext, useState } from 'react';

type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

const ToastContext = createContext<any>(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-white ${
              t.type === 'success' ? 'bg-[#33691E]' : 'bg-[#B71C1C]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

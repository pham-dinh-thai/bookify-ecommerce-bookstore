import React from 'react';
import AuthHeaderContainer from './components/header/header-container';
import AuthFooterContainer from './components/footer/footer-container';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf5] flex flex-col">
      <AuthHeaderContainer />

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8">
        {children}
      </main>

      <AuthFooterContainer />
    </div>
  );
}

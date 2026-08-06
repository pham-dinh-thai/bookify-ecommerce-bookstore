import { Manrope } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Bookify',
    template: '%s | Bookify',
  },
  description: 'Bookify storefront',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}

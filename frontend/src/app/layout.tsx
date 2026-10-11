import React from 'react';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-arabic' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans bg-surface-alt text-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Mohamed Khalil ENT Clinic',
  description: 'Digital ENT clinic patient portal',
};

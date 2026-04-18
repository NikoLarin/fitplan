import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ForgeFit AI',
  description: 'Custom training + diet plans in 60 seconds.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

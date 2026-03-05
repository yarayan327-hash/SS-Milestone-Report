import './globals.css';
import { Poppins, Noto_Sans_Arabic } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font-poppins' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-[#F6F6F6]`}>
        {children}
      </body>
    </html>
  );
}

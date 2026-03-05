import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '600', '800'],
  variable: '--font-poppins' 
});

export const metadata = {
  title: 'Milestone Reports',
  description: 'Student Progress Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans bg-[#F6F6F6]`}>
        {children}
      </body>
    </html>
  );
}

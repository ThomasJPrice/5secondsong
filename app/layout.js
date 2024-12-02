import Navbar from "@/components/shared/Navbar";
import "./globals.css";
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/shared/theme-provider";
import Link from "next/link";

export const metadata = {
  title: "Home | 5 Second Song",
  description: "Choose an artist and get 5 seconds to guess each song!",
};

const CabinetGrotesk = localFont({
  src: './fonts/CabinetGrotesk.woff2',
  display: 'swap'
})

const Satoshi = localFont({
  src: './fonts/Satoshi.woff2',
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${Satoshi.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <div className={`flex flex-col min-h-screen`}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html >
  );
}

import Navbar from "@/components/shared/Navbar";
import "./globals.css";
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/shared/theme-provider";
import Link from "next/link";

export const metadata = {
  title: "Guess the Song!",
  description: "Choose an artist and guess 10 of their songs from a 5-second clip!",
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
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              {children}
            </main>

            <footer className="container pt-4">
              <div className="w-full h-[1px] bg-primary"></div>

              <div className="py-2 flex items-center justify-between">
                <p className="text-primary font-semibold">Made by <Link className="underline" href='https://thomasprice.me' target="_blank">Thomas Price</Link></p>

                <Link className="text-primary font-semibold" href='https://github.com/ThomasJPrice/guess-the-song' target="_blank">GitHub</Link>
              </div>
            </footer>

          </div>
        </ThemeProvider>
      </body>
    </html >
  );
}

import "./globals.css";

export const metadata = {
  title: "Guess the Song!",
  description: "Choose an artist and guess 10 of their songs from a 5-second clip!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

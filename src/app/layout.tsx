import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت پن‌پات - Penpot Management",
  description: "پنل مدیریت کاربران و اشتراک‌های پن‌پات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
      </head>
      <body className="min-h-screen bg-[#0f0f1a]">
        {children}
      </body>
    </html>
  );
}

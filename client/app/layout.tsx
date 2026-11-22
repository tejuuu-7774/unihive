import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniHive — Student Marketplace",
  description: "A verified marketplace for students to buy, sell, and earn on campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

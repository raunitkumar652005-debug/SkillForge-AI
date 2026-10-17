import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { AppLayout } from "@/components/layout/AppLayout";

export const metadata = {
  title: "WebDev Mentor AI Platform",
  description: "Hyper-refined developer intelligence terminal",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden">
        <AppLayout sidebar={<Sidebar />} topbar={<TopBar />}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}

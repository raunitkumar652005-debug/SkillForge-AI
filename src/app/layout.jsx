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
  title: {
    default: "SkillForge AI — Learn. Build. Practice. Get Hired.",
    template: "%s | SkillForge AI"
  },
  description: "An AI-powered developer learning platform for mastering concepts, building projects, practicing quizzes, preparing for interviews, and tracking progress.",
  keywords: ["SkillForge AI", "Full-Stack Development", "AI Coding Mentor", "Technical Interview Prep", "Interactive Quizzes"],
  icons: {
    icon: "/icon.svg"
  }
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

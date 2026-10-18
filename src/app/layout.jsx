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
  metadataBase: new URL("https://skill-forge-ai-kappa.vercel.app"),
  title: {
    default: "SkillForge AI — Learn. Build. Practice. Get Hired.",
    template: "%s | SkillForge AI"
  },
  description: "Developed by Raunit — Learn. Build. Practice. Get Hired.",
  keywords: [
    "SkillForge AI",
    "Full-Stack Development",
    "AI Coding Mentor",
    "Technical Interview Prep",
    "Interactive Quizzes"
  ],
  authors: [{ name: "Raunit" }],
  creator: "Raunit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skill-forge-ai-kappa.vercel.app",
    siteName: "SkillForge AI",
    title: "SkillForge AI — Learn. Build. Practice. Get Hired.",
    description: "Developed by Raunit — Learn. Build. Practice. Get Hired.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "SkillForge AI — Developed by Raunit"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillForge AI — Learn. Build. Practice. Get Hired.",
    description: "Developed by Raunit — Learn. Build. Practice. Get Hired.",
    images: ["/icon.svg"],
    creator: "@Raunit"
  },
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

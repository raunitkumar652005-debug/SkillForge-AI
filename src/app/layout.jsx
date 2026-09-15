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
        <Sidebar />
        <div className="flex-1 flex flex-col h-full min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 relative">
            <div className="absolute inset-0 bg-[#060911] -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

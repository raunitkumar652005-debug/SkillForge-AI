"use client";

import { usePathname } from "next/navigation";

export function AppLayout({ sidebar, topbar, children }) {
  const pathname = usePathname();

  // If on the login page, render only the children without the sidebar/topbar
  if (pathname === "/login") {
    return <main className="h-full w-full">{children}</main>;
  }

  // Otherwise, render the standard authenticated application layout
  return (
    <>
      {sidebar}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {topbar}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="absolute inset-0 bg-[#060911] -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
          {children}
        </main>
      </div>
    </>
  );
}

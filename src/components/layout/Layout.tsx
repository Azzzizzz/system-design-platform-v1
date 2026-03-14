import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* Absolute Atmospheric Lighting Elements */}
      <div className="bg-glow top-0 left-1/4" />
      <div className="bg-glow bottom-0 right-1/4 opacity-10" />

      <Topbar />

      <div className="flex flex-1 pt-14 h-full relative">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-14 relative z-10 w-full overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* React Router injects the current page here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

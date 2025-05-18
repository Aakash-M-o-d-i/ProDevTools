
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

/**
  DashboardLayout Component
  
 The main layout component that wraps all pages.
 Provides a collapsible sidebar navigation and header.
 */
const DashboardLayout = () => {
  // State to control sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-sidebar transition-all duration-300 overflow-hidden`}
      >
        <SidebarNav />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">Productivity Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

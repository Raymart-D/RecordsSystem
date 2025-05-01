import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [location] = useLocation();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-[250px]' : 'ml-0'}`}>
          <div className="container mx-auto py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  FileScan, 
  Settings,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Records",
      path: "/records",
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: "FileScan",
      path: "/scanner",
      icon: <FileScan className="w-5 h-5" />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === path;
    }
    return location.startsWith(path);
  };

  // If sidebar is closed and not mobile, return null
  if (!isOpen && !isMobile) {
    return null;
  }

  // Overlay for mobile sidebar
  const overlay = isMobile && isOpen && (
    <div 
      className="fixed inset-0 bg-black/30 z-40"
      onClick={closeSidebar}
    />
  );

  return (
    <>
      {overlay}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out z-50",
          "w-[250px] md:z-30",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen && isMobile,
          }
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-200 h-[66px]">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 rounded-md bg-gradient-to-r from-primary-600 to-primary-800 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <line x1="9" y1="9" x2="10" y2="9" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">RecordsVault</h1>
            </div>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <Link href="/records/add">
            <Button className="w-full mb-4">
              <Plus className="mr-2 h-4 w-4" /> 
              Add New Record
            </Button>
          </Link>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link href={item.path} key={item.path}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
            <h4 className="font-medium text-sm text-slate-800 mb-2">Need Help?</h4>
            <p className="text-xs text-slate-600 mb-3">
              Access user guides or contact support for assistance with your record management.
            </p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Documentation
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

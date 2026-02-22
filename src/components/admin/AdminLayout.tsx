import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Eye,
  LogOut,
  Menu,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/admin");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Respostas", icon: MessageCircle, href: "/admin/rsvp" },
    { label: "Acessos", icon: Eye, href: "/admin/visits" },
    { label: "Utilizadores", icon: Users, href: "/admin/users" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-white tracking-tight">
              Taly & Whollo
            </h2>
            <p className="text-[11px] text-stone-400 font-medium uppercase tracking-widest mt-0.5">
              Painel do Casamento
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-stone-400 hover:text-stone-200 hover:bg-white/5 rounded-xl"
          onClick={() => navigate("/")}
        >
          <ExternalLink className="w-4 h-4 mr-3" />
          Ver Site
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-stone-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100/80 flex">
      {/* Desktop Sidebar - premium dark */}
      <aside className="hidden md:flex md:flex-col w-72 fixed h-full z-30 bg-gradient-to-b from-stone-800 to-stone-900 border-r border-stone-700/50 shadow-elegant">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-30 bg-stone-800 border-b border-stone-700/50 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading text-lg font-semibold text-white">Taly & Whollo</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-stone-300 hover:text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-stone-800 border-stone-700">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-72 min-h-screen p-4 sm:p-6 lg:p-10 mt-16 md:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

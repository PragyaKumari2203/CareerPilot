import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, User, FileText, Upload, TrendingUp, 
  Briefcase, CheckSquare, LogOut, Sparkles, Menu 
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Page } from '../App';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userName: string;
};

export function DashboardLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  userName 
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: Upload },
    { id: 'career-paths', label: 'Career Paths', icon: TrendingUp },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: CheckSquare },
  ] as const;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-primary">CareerPilot</h2>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as Page);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="p-3 bg-muted rounded-lg mb-2">
          <p className="text-sm">Welcome back,</p>
          <p className="text-sm font-medium truncate">{userName}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between px-4 border-b border-border bg-card lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0">
              <VisuallyHidden>
                <SheetTitle>CareerPilot Navigation</SheetTitle>
              </VisuallyHidden>

              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-primary">CareerPilot</h2>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
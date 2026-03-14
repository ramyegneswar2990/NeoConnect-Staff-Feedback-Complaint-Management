"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FilePlus, 
  Inbox, 
  Users, 
  BarChart3, 
  Globe, 
  LogOut,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Staff', 'Secretariat', 'Case Manager', 'Admin'] },
    { name: 'Submit Case', href: '/cases/new', icon: FilePlus, roles: ['Staff'] },
    { name: 'My Cases', href: '/cases', icon: Inbox, roles: ['Staff'] },
    { name: 'Assigned Cases', href: '/cases', icon: CheckCircle2, roles: ['Case Manager'] },
    { name: 'Secretariat Inbox', href: '/cases/all', icon: Inbox, roles: ['Secretariat', 'Admin'] },
    { name: 'Public Hub', href: '/public', icon: Globe, roles: ['Staff', 'Secretariat', 'Case Manager', 'Admin'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Secretariat', 'Admin'] },
    { name: 'Polls', href: '/polls', icon: PieChart, roles: ['Staff', 'Secretariat', 'Admin'] },
    { name: 'Admin', href: '/admin', icon: Users, roles: ['Admin'] },
  ];

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 temple-card border-r border-border flex flex-col temple-glow">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-forest-300">NeoConnect</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                pathname === item.href ? "bg-night-500/30 text-white border border-night-400/50" : "text-temple-200 hover:bg-temple-700/50 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4 p-3 temple-card rounded-lg temple-glow">
            <div className="w-8 h-8 rounded-full bg-night-500/30 flex items-center justify-center text-white font-bold border border-night-400/50">
              {user?.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-foreground">{user?.name}</p>
              <p className="text-xs text-temple-300 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="temple-card border-b border-border p-4 flex justify-between items-center h-16 temple-glow">
          <h2 className="text-lg font-semibold text-foreground">
            {navItems.find(n => n.href === pathname)?.name || 'Dashboard'}
          </h2>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

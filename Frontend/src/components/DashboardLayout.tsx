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
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Staff', 'Secretariat', 'Case Manager'] },
      { name: 'Submit Case', href: '/cases/new', icon: FilePlus, roles: ['Staff'] },
      { name: 'My Cases', href: '/cases', icon: Inbox, roles: ['Staff'] },
      { name: 'Assigned Cases', href: '/cases', icon: CheckCircle2, roles: ['Case Manager'] },
      { name: 'Secretariat Inbox', href: '/cases/all', icon: Inbox, roles: ['Secretariat'] },
      { name: 'Quarterly Digest', href: '/public', icon: Globe, roles: ['Staff', 'Secretariat', 'Case Manager'] },
      { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Secretariat'] },
      { name: 'Polls', href: '/polls', icon: PieChart, roles: ['Staff', 'Secretariat'] },
      { name: 'Admin', href: '/admin', icon: Users, roles: ['Admin'] },
    ];

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen relative text-gray-900 bg-transparent">
      {/* Sidebar */}
      <div className="w-64 sidebar-premium flex flex-col relative z-20">
        {/* Brand header with gradient */}
        <div className="sidebar-brand p-6">
          <h1 className="text-xl font-bold">NeoConnect</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-primary/30">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border border-white/30">
              {user?.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-white/70 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full h-full">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-8 py-6 flex justify-between items-center shadow-premium">
          <h2 className="text-xl font-semibold text-white">
            {navItems.find(n => n.href === pathname)?.name || 'Dashboard'}
          </h2>
          <div className="text-sm text-white/80 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}

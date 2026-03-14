"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-minimal';
import { Users, Shield, Settings, Activity, Eye } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCases: 0, activeUsers: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get('/api/admin/users');
        const casesRes = await api.get('/api/admin/stats');
        setUsers(usersRes.data);
        setStats(casesRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading && user?.role === 'Admin') {
      fetchData();
    }
  }, [loading, user]);

  if (loading || loadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'Admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="temple-card p-8 rounded-lg temple-glow max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Access Denied</h3>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            count={stats.totalUsers} 
            icon={Users} 
            color="bg-night-500" 
          />
          <StatCard 
            title="Total Cases" 
            count={stats.totalCases} 
            icon={Activity} 
            color="bg-forest-500" 
          />
          <StatCard 
            title="Active Users" 
            count={stats.activeUsers} 
            icon={Eye} 
            color="bg-warm-500" 
          />
          <StatCard 
            title="System Health" 
            count="98%" 
            icon={Shield} 
            color="bg-purple-500" 
          />
        </div>

        {/* Users Management */}
        <div className="temple-card rounded-xl shadow-sm border overflow-hidden temple-glow">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground">User Management</h3>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Add New User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-temple-800/50 text-temple-300 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-temple-800/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-night-500/30 text-white border border-night-400/50">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-forest-500/30 text-white border border-forest-400/50'
                          : 'bg-red-500/30 text-white border border-red-400/50'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-night-300 hover:text-white transition-colors p-1">
                          <Eye size={16} />
                        </button>
                        <button className="text-warm-300 hover:text-white transition-colors p-1">
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, count, icon: Icon, color }: any) {
  return (
    <div className="temple-card p-6 rounded-xl shadow-sm border flex items-center space-x-4 temple-glow">
      <div className={`${color} p-3 rounded-lg text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground">{count}</p>
      </div>
    </div>
  );
}

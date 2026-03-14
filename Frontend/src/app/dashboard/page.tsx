"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-minimal';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, escalated: 0 });
  const [recentCases, setRecentCases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/cases');
        const cases = res.data;
        setRecentCases(cases.slice(0, 5));
        
        setStats({
          total: cases.length,
          resolved: cases.filter((c: any) => c.status === 'Resolved').length,
          pending: cases.filter((c: any) => ['Assigned', 'In Progress'].includes(c.status)).length,
          escalated: cases.filter((c: any) => c.status === 'Escalated').length
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (!loading && user) {
      fetchData();
    }
  }, [loading, user]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Cases" count={stats.total} icon={Activity} color="bg-night-500" />
        <StatCard title="Resolved" count={stats.resolved} icon={CheckCircle} color="bg-forest-500" />
        <StatCard title="In Progress" count={stats.pending} icon={Clock} color="bg-warm-500" />
        <StatCard title="Escalated" count={stats.escalated} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="temple-card rounded-xl shadow-sm border overflow-hidden temple-glow">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Recent Cases</h3>
          <Link href="/cases" className="text-night-300 text-sm font-medium hover:text-white transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-temple-800/50 text-temple-300 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentCases.map((c: any) => (
                <tr key={c._id} className="hover:bg-temple-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-night-300">
                    <Link href={`/cases/${c._id}`} className="hover:text-white transition-colors">{c.trackingId}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{c.category}</td>
                  <td className="px-6 py-4">
                    <span className={cnStatus(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-foreground">{c.severity}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

function cnStatus(status: string) {
  const base = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  switch (status) {
    case 'New': return `${base} bg-night-500/30 text-white border border-night-400/50`;
    case 'Assigned': return `${base} bg-purple-500/30 text-white border border-purple-400/50`;
    case 'In Progress': return `${base} bg-warm-500/30 text-white border border-warm-400/50`;
    case 'Resolved': return `${base} bg-forest-500/30 text-white border border-forest-400/50`;
    case 'Escalated': return `${base} bg-red-500/30 text-white border border-red-400/50`;
    default: return `${base} bg-temple-600/30 text-temple-200 border border-temple-500/50`;
  }
}

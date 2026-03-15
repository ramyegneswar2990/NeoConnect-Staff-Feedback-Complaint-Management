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
        <StatCard title="Total Cases" count={stats.total} icon={Activity} color="stat-icon-bg-blue" delay="animate-delay-100" />
        <StatCard title="Resolved" count={stats.resolved} icon={CheckCircle} color="stat-icon-bg-green" delay="animate-delay-200" />
        <StatCard title="In Progress" count={stats.pending} icon={Clock} color="stat-icon-bg-orange" delay="animate-delay-300" />
        <StatCard title="Escalated" count={stats.escalated} icon={AlertTriangle} color="stat-icon-bg-red" delay="animate-delay-400" />
      </div>

      <div className="premium-card premium-card-hover animate-delay-500">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Recent Cases</h3>
          <Link href="/cases" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-all duration-200 hover:scale-105">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c: any, index: number) => (
                <tr key={c._id} style={{ animationDelay: `${600 + index * 50}ms` }} className="animate-fadeInUp">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-blue-600">
                    <Link href={`/cases/${c._id}`} className="hover:text-blue-700 transition-all duration-200 hover:scale-105 inline-block">{c.trackingId}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.category}</td>
                  <td className="px-6 py-4">
                    <span className={`${cnStatus(c.status)} ${c.status === 'New' || c.status === 'In Progress' ? 'badge-pulse' : ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-900">{c.severity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentCases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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

function StatCard({ title, count, icon: Icon, color, delay }: any) {
  return (
    <div className={`stat-card-premium ${delay}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
        <div className={`${color} p-4 rounded-2xl shadow-soft icon-hover`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

function cnStatus(status: string) {
  switch (status) {
    case 'New': return "badge-primary";
    case 'Assigned': return "badge-purple";
    case 'In Progress': return "badge-warning";
    case 'Resolved': return "badge-success";
    case 'Escalated': return "badge-danger";
    case 'Pending': return "badge-warning";
    default: return "badge-primary";
  }
}

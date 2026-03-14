"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function CasesPage() {
  const { user, loading } = useAuth();
  const [cases, setCases] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/api/cases');
        setCases(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (!loading && user) {
      fetchCases();
    }
  }, [loading, user]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {user?.role === 'Case Manager' ? 'Assigned Cases' : (user?.role === 'Staff' ? 'My Submitted Cases' : 'All Cases')}
        </h2>
        {user?.role === 'Staff' && (
          <Link 
            href="/cases/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Submit New Case
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c: any) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-blue-600">
                    <Link href={`/cases/${c._id}`}>{c.trackingId}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{c.title}</td>
                  <td className="px-6 py-4 text-sm">{c.category}</td>
                  <td className="px-6 py-4">
                    <span className={cnStatus(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cnSeverity(c.severity)}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!fetching && cases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    No cases found.
                  </td>
                </tr>
              )}
              {fetching && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    Loading cases...
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

function cnStatus(status: string) {
  const base = "px-2.5 py-1 rounded-full text-xs font-bold";
  switch (status) {
    case 'New': return `${base} bg-blue-100 text-blue-700`;
    case 'Assigned': return `${base} bg-purple-100 text-purple-700`;
    case 'In Progress': return `${base} bg-yellow-100 text-yellow-700`;
    case 'Resolved': return `${base} bg-green-100 text-green-700`;
    case 'Escalated': return `${base} bg-red-100 text-red-700`;
    default: return `${base} bg-gray-100 text-gray-700`;
  }
}

function cnSeverity(severity: string) {
  const base = "px-2 py-0.5 rounded text-[10px] uppercase font-bold border";
  switch (severity) {
    case 'High': return `${base} bg-red-50 text-red-600 border-red-200`;
    case 'Medium': return `${base} bg-orange-50 text-orange-600 border-orange-200`;
    case 'Low': return `${base} bg-green-50 text-green-600 border-green-200`;
    default: return `${base} bg-gray-50 text-gray-600 border-gray-200`;
  }
}

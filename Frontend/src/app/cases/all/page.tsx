"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function SecretariatInboxPage() {
  const { user, loading } = useAuth();
  const [cases, setCases] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState<any>({});
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [cRes, mRes] = await Promise.all([
        api.get('/api/cases'),
        api.get('/api/auth/managers')
      ]);
      setCases(cRes.data);
      setManagers(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (!['Secretariat', 'Admin'].includes(user.role)) {
        router.push('/dashboard');
        return;
      }
      fetchData();
    }
  }, [loading, user, router]);

  const handleAssign = async (caseId: string) => {
    if (!selectedManager[caseId]) return;
    try {
      await api.patch(`/api/cases/${caseId}/assign`, { assignedTo: selectedManager[caseId] });
      fetchData();
    } catch (err) {
      alert('Assignment failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Secretariat Inbox - Case Assignment</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Case</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Submitter</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assign To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c: any) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/cases/${c._id}`} className="font-bold text-blue-600 block">{c.trackingId}</Link>
                    <span className="text-xs text-gray-500">{c.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{c.department}</td>
                  <td className="px-6 py-4 text-sm">{c.isAnonymous ? 'Anonymous' : c.submitter?.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{c.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {c.status === 'New' ? (
                      <div className="flex space-x-2">
                        <select 
                          className="border text-sm rounded p-1"
                          onChange={(e) => setSelectedManager({ ...selectedManager, [c._id]: e.target.value })}
                        >
                          <option value="">Select Manager</option>
                          {managers.map((m: any) => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleAssign(c._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Assign
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Assigned to {c.assignedTo?.name}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

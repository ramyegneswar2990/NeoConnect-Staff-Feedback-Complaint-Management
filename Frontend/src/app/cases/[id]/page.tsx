"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [caseItem, setCaseItem] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCase = async () => {
    try {
      const res = await api.get(`/api/cases/${id}`);
      setCaseItem(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchCase();
    }
  }, [id, authLoading, user]);

  const updateStatus = async (status: string) => {
    try {
      console.log('Sending update:', status);
      await api.patch(`/api/cases/${id}/status`, { status, note: newNote });
      setNewNote('');
      fetchCase();
    } catch (err: any) {
      console.error('Failed PATCH:', err);
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;
  if (!caseItem) return <DashboardLayout>Case not found</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-blue-600 font-mono">{caseItem.trackingId}</span>
            <h1 className="text-2xl font-bold mt-1">{caseItem.title}</h1>
            <div className="flex space-x-4 mt-2 text-sm text-gray-500">
              <span>Category: {caseItem.category}</span>
              <span>Severity: {caseItem.severity}</span>
              <span>Status: {caseItem.status}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Submitted by:</p>
            <p className="text-lg">{caseItem.isAnonymous ? 'Anonymous' : caseItem.submitter?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{caseItem.description}</p>
              
              {caseItem.attachments?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseItem.attachments.map((url: string, i: number) => (
                      <a 
                        key={i} 
                        href={url} 
                        target="_blank" 
                        className="p-2 border rounded bg-gray-50 text-blue-600 text-xs hover:bg-gray-100"
                      >
                        File {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Case History & Notes</h3>
              <div className="space-y-4">
                {caseItem.notes?.map((note: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{note.content}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>{note.addedBy?.name || 'System'} ({note.addedBy?.role || 'Auto'})</span>
                      <span>{new Date(note.addedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {caseItem.notes?.length === 0 && <p className="text-gray-500 italic">No notes yet.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {(user?.role === 'Case Manager' || user?.role === 'Secretariat' || user?.role === 'Admin') && (
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4">Actions</h3>
                <textarea
                  placeholder="Add a progress note..."
                  className="w-full border rounded-md p-2 text-sm mb-4 h-24"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="space-y-2">
                  <button 
                    onClick={() => updateStatus('In Progress')}
                    className="w-full bg-blue-100 text-blue-700 font-bold py-2 rounded text-sm hover:bg-blue-200"
                  >
                    Set In Progress
                  </button>
                  <button 
                    onClick={() => updateStatus('Pending')}
                    className="w-full bg-yellow-100 text-yellow-700 font-bold py-2 rounded text-sm hover:bg-yellow-200"
                  >
                    Set Pending
                  </button>
                  <button 
                    onClick={() => updateStatus('Resolved')}
                    className="w-full bg-green-600 text-white font-bold py-2 rounded text-sm hover:bg-green-700"
                  >
                    Resolve Case
                  </button>
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium">{caseItem.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{caseItem.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Assigned To</p>
                  <p className="font-medium">{caseItem.assignedTo?.name || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

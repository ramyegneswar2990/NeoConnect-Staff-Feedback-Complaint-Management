"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Safety',
    department: 'HR',
    location: '',
    severity: 'Medium',
    isAnonymous: false
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, (formData as any)[key]);
    });
    
    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append('attachments', files[i]);
      }
    }

    try {
      await api.post('/api/cases', data);
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Submit Feedback / Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2"
              placeholder="Brief summary of the issue"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full border rounded-md p-2 h-32"
              placeholder="Provide detailed information"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full border rounded-md p-2"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Safety</option>
                <option>Policy</option>
                <option>Facilities</option>
                <option>HR</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                required
                className="w-full border rounded-md p-2"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full border rounded-md p-2"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select 
                className="w-full border rounded-md p-2"
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            />
            <label htmlFor="anonymous" className="text-sm">Submit anonymously (hide your identity)</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Attachments (Photo or PDF)</label>
            <input
              type="file"
              multiple
              className="w-full text-sm"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-md py-2 font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Case'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

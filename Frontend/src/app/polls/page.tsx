"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PollsPage() {
  const { user, loading } = useAuth();
  const [polls, setPolls] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });

  const fetchPolls = async () => {
    try {
      const res = await api.get('/api/polls');
      setPolls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchPolls();
    }
  }, [loading, user]);

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await api.post(`/api/polls/${pollId}/vote`, { optionIndex });
      fetchPolls();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to vote');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/polls', newPoll);
      setShowCreate(false);
      setNewPoll({ question: '', options: ['', ''] });
      fetchPolls();
    } catch (err) {
      alert('Failed to create poll');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Polls</h2>
        {(user?.role === 'Secretariat' || user?.role === 'Admin') && (
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700"
          >
            Create New Poll
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-bold mb-4">New Poll</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Question"
              className="w-full border p-2 rounded"
              required
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
            />
            {newPoll.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                className="w-full border p-2 rounded"
                required
                value={opt}
                onChange={(e) => {
                  const opts = [...newPoll.options];
                  opts[i] = e.target.value;
                  setNewPoll({ ...newPoll, options: opts });
                }}
              />
            ))}
            <div className="flex space-x-2">
              <button 
                type="button" 
                className="text-sm text-blue-600 font-bold"
                onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
              >
                + Add Option
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Save Poll
              </button>
              <button 
                type="button" 
                className="bg-gray-200 px-4 py-1 rounded"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map((poll: any) => {
          const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0);
          return (
            <div key={poll._id} className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4">{poll.question}</h3>
              <div className="space-y-4">
                {poll.options.map((opt: any, i: number) => {
                  const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                  return (
                    <div key={i} className="relative">
                      <button
                        onClick={() => handleVote(poll._id, i)}
                        className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors z-10 relative overflow-hidden"
                      >
                        <div 
                          className="absolute left-0 top-0 h-full bg-blue-100 transition-all" 
                          style={{ width: `${percentage}%`, zIndex: -1 }}
                        />
                        <div className="flex justify-between font-medium">
                          <span>{opt.text}</span>
                          <span>{opt.votes} ({percentage.toFixed(0)}%)</span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-gray-500">Total votes: {totalVotes}</p>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

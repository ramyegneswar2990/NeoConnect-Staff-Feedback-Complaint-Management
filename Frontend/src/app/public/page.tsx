"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';

import { useAuth } from '@/context/AuthContext';

export default function PublicHubPage() {
  const { user, loading } = useAuth();
  const [digest, setDigest] = useState([]);
  const [impact, setImpact] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [search, setSearch] = useState('');
  
  const [isMgmt, setIsMgmt] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' });
  const [newMinute, setNewMinute] = useState({ title: '', date: '', fileUrl: '' });

  const fetchData = async () => {
    try {
      const [dRes, iRes, mRes] = await Promise.all([
        api.get('/api/public/digest'),
        api.get('/api/public/impact'),
        api.get('/api/public/minutes')
      ]);
      setDigest(dRes.data);
      setImpact(iRes.data);
      setMinutes(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/public/digest', newAnnouncement);
      setNewAnnouncement({ title: '', content: '', category: 'General' });
      fetchData();
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  const handleCreateMinute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/public/minutes', newMinute);
      setNewMinute({ title: '', date: '', fileUrl: '' });
      fetchData();
    } catch (err) {
      alert('Failed to post minutes');
    }
  };

  const filteredMinutes = minutes.filter((m: any) => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const canManage = user && ['Admin', 'Secretariat'].includes(user.role);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quarterly Digest & Public Hub</h1>
          <p className="text-white/80 mt-1">Real-time accountability and quarterly outcomes.</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setIsMgmt(!isMgmt)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${isMgmt ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white shadow-lg hover:shadow-xl'}`}
          >
            {isMgmt ? 'View Hub' : 'Manage Content'}
          </button>
        )}
      </div>

      {!isMgmt && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-600/80 to-indigo-700/80 backdrop-blur-md p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group border border-white/20">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd"></path></svg>
            </div>
            <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-2">Total Impact</p>
            <h4 className="text-4xl font-extrabold mb-1">{impact.length}</h4>
            <p className="text-sm text-blue-100 font-medium">Issues Resolved to Date</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-premium flex flex-col justify-center">
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px] mb-2">Latest Update</p>
            <h4 className="text-xl font-bold text-gray-900 line-clamp-1">{(digest[0] as any)?.title || 'Awaiting Digest'}</h4>
            <p className="text-sm text-gray-700 mt-1">{digest[0] ? new Date((digest[0] as any).publishedAt).toLocaleDateString() : 'Stay tuned'}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-premium flex flex-col justify-center">
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px] mb-2">Meeting Minutes</p>
            <h4 className="text-xl font-bold text-gray-900">{minutes.length} Archives</h4>
            <p className="text-sm text-gray-700 mt-1">Available for download</p>
          </div>
        </div>
      )}

      {isMgmt ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-blue-600">Post New Digest</h3>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all border"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
                <select
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all border"
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                >
                  <option>General</option>
                  <option>Safety</option>
                  <option>Policy</option>
                  <option>Infrastructure</option>
                </select>
                <textarea
                  placeholder="Announcement Content"
                  className="w-full border-gray-200 rounded-xl p-3 h-32 focus:ring-2 focus:ring-blue-500 transition-all border"
                  required
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Publish Announcement
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-yellow-600">Archive Meeting Minutes</h3>
              <form onSubmit={handleCreateMinute} className="space-y-4">
                <input
                  type="text"
                  placeholder="Meeting Title (e.g. Q1 Management Review)"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 transition-all border"
                  required
                  value={newMinute.title}
                  onChange={(e) => setNewMinute({ ...newMinute, title: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 transition-all border"
                  required
                  value={newMinute.date}
                  onChange={(e) => setNewMinute({ ...newMinute, date: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="PDF Link (URL)"
                  className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 transition-all border"
                  required
                  value={newMinute.fileUrl}
                  onChange={(e) => setNewMinute({ ...newMinute, fileUrl: e.target.value })}
                />
                <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl hover:bg-yellow-700 transition-colors">
                  Save Archive
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Quarterly Digest */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
              <span className="bg-blue-500 w-3 h-10 mr-4 rounded-full shadow-lg shadow-blue-500/50"></span>
              Quarterly Digest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {digest.map((item: any) => (
                <article key={item._id} className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-white/40 shadow-premium hover:shadow-premium-hover transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-800 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 border border-blue-500/30">{item.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 mb-6">{item.content}</p>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50 text-xs text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <button className="text-blue-600 font-bold hover:translate-x-1 transition-transform flex items-center">
                      Read More <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </article>
              ))}
              {digest.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400">
                  <p className="italic">No announcements have been published yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Impact Tracking */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
              <span className="bg-green-500 w-3 h-10 mr-4 rounded-full shadow-lg shadow-green-500/50"></span>
              Impact Tracking
            </h2>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Issue Raised</th>
                      <th className="px-8 py-5">Action Taken</th>
                      <th className="px-8 py-5">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {impact.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900 text-sm mb-1">{row.issue}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{row.category}</span>
                            <span>•</span>
                            <span>{row.department}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-600 leading-relaxed">{row.action}</td>
                        <td className="px-8 py-6">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight">
                            {row.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {impact.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-8 py-12 text-center text-gray-400 italic">No impact records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Minutes Archive */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
              <span className="bg-yellow-500 w-3 h-10 mr-4 rounded-full shadow-lg shadow-yellow-500/50"></span>
              Minutes Archive
            </h2>
            <div className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-white/40 shadow-premium">
              <div className="relative mb-8 max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search archives..."
                  className="w-full pl-11 pr-4 py-3 border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-500 transition-all border"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMinutes.map((m: any) => (
                  <div key={m._id} className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-gray-50 hover:border-yellow-200 transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-50 p-3 rounded-xl text-red-600 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{m.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(m.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <a href={m.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </a>
                  </div>
                ))}
                {filteredMinutes.length === 0 && <p className="col-span-full text-center py-8 text-gray-400 italic">No archive entries found.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-minimal';
import { Users, Shield, Settings, Activity, Eye, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCases: 0, activeUsers: 0 });
  const [loadingData, setLoadingData] = useState(true);
  
  // New user state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Staff', department: '' });
  const [errorDetails, setErrorDetails] = useState('');

  // Edit user state
  const [editUser, setEditUser] = useState<any>(null);

  const fetchUsersAndStats = async () => {
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

  useEffect(() => {
    if (!loading && user?.role === 'Admin') {
      fetchUsersAndStats();
    }
  }, [loading, user]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails('');
    try {
      await api.post('/api/admin/users', newUser);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'Staff', department: '' });
      fetchUsersAndStats(); // Refresh table
    } catch (err: any) {
      setErrorDetails(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await api.put(`/api/admin/users/${editUser._id}`, editUser);
      setEditUser(null);
      fetchUsersAndStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      fetchUsersAndStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading || loadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== 'Admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="modern-card p-8 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            count={stats.totalUsers} 
            icon={Users} 
            color="stat-icon-bg-blue" 
            delay="animate-delay-100"
          />
          <StatCard 
            title="Total Cases" 
            count={stats.totalCases} 
            icon={Activity} 
            color="stat-icon-bg-green" 
            delay="animate-delay-200"
          />
          <StatCard 
            title="Active Users" 
            count={stats.activeUsers} 
            icon={Eye} 
            color="stat-icon-bg-orange" 
            delay="animate-delay-300"
          />
          <StatCard 
            title="System Health" 
            count="98%" 
            icon={Shield} 
            color="stat-icon-bg-purple" 
            delay="animate-delay-400"
          />
        </div>

        {/* Users Management */}
        <div className="premium-card premium-card-hover animate-delay-500">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            <button className="btn-primary" onClick={() => setShowAddUser(true)}>
              Add New User
            </button>
          </div>
          
          {showAddUser && (
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h4 className="text-lg font-bold mb-4">Create New User</h4>
              <form onSubmit={handleAddUser} className="space-y-4 max-w-2xl">
                {errorDetails && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{errorDetails}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="border p-2 rounded-lg"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="border p-2 rounded-lg"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Password"
                    className="border p-2 rounded-lg"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Department"
                    className="border p-2 rounded-lg"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  />
                  <select
                    className="border p-2 rounded-lg"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Staff">Staff</option>
                    <option value="Secretariat">Secretariat</option>
                    <option value="Case Manager">Case Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
                  <button type="submit" className="btn-primary">Create User</button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Password</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any, index: number) => (
                  <tr key={user._id} style={{ animationDelay: `${600 + index * 50}ms` }} className="animate-fadeInUp">
                    <td className="px-6 py-4 text-gray-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{user.plainPassword || '•'.repeat(8)}</td>
                    <td className="px-6 py-4">
                      <span className="badge-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${user.status === 'Active' ? "badge-success" : "badge-danger"} ${user.status === 'Active' ? 'badge-pulse' : ''}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditUser(user)}
                          className="text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 hover:bg-blue-50 rounded-lg hover:scale-110 icon-hover"
                          title="Edit User"
                        >
                          <Settings size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-gray-600 hover:text-red-600 transition-all duration-200 p-2 hover:bg-red-50 rounded-lg hover:scale-110 icon-hover"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {editUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl">
                <h4 className="text-xl font-bold mb-4">Edit User</h4>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="border p-2 rounded-lg"
                      value={editUser.name}
                      onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="border p-2 rounded-lg"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    />
                    <select
                      className="border p-2 rounded-lg"
                      value={editUser.role}
                      onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                    >
                      <option value="Staff">Staff</option>
                      <option value="Secretariat">Secretariat</option>
                      <option value="Case Manager">Case Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <select
                      className="border p-2 rounded-lg"
                      value={editUser.status}
                      onChange={(e) => setEditUser({...editUser, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-8">
                    <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
                    <button type="submit" className="btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Users, 
  Sparkles, 
  BarChart3, 
  LogOut, 
  PlusCircle, 
  Globe, 
  FolderGit, 
  Activity 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock statistics matching layout spec
  const stats = [
    { label: 'Total Campaigns', value: '25', icon: FolderGit, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Campaigns', value: '9', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Audience size', value: '15,000', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Languages Supported', value: '12', icon: Globe, color: 'text-teal-600 bg-teal-50' },
  ];

  // Mock list of recent campaigns for premium dashboard feel
  const recentCampaigns = [
    { id: 1, name: 'Q3 Enterprise Policy Update', language: 'Multilingual (6)', status: 'Active', reach: '4,200', date: 'Jul 10, 2026' },
    { id: 2, name: 'Global Product Safety Bulletin', language: 'English, Spanish', status: 'Active', reach: '8,500', date: 'Jul 08, 2026' },
    { id: 3, name: 'Internal Leadership Announcements', language: 'English, Japanese, Hindi', status: 'Completed', reach: '2,300', date: 'Jun 28, 2026' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.fullname || 'Vishnu'}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700">
              {user?.role || 'Campaign Manager'}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">{user?.organization || 'MassComm Org'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all focus:outline-none"
        >
          <LogOut className="h-4 w-4 mr-2 text-gray-400" />
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover-scale">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Layout for Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate('/campaigns')}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-primary-100 hover:bg-primary-50 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Create Campaign</p>
                  <p className="text-xs text-gray-500">Draft new notification blast</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-primary transition font-bold">→</span>
            </button>

            <button
              onClick={() => navigate('/audience')}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-secondary-100 hover:bg-secondary-50 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-white transition">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Manage Audience</p>
                  <p className="text-xs text-gray-500">Configure target cohorts</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-secondary transition font-bold">→</span>
            </button>

            <button
              onClick={() => navigate('/ai-content')}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Generate AI Content</p>
                  <p className="text-xs text-gray-500">Draft multilingual templates</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-purple-600 transition font-bold">→</span>
            </button>

            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Analytics</p>
                  <p className="text-xs text-gray-500">Analyze campaign telemetry</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-indigo-600 transition font-bold">→</span>
            </button>
          </div>
        </div>

        {/* Recent Campaigns Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Campaigns</h2>
            <button 
              onClick={() => navigate('/campaigns')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              View All Campaigns
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                  <th className="pb-3">Campaign Name</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Reach</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 font-medium text-gray-900">{camp.name}</td>
                    <td className="py-3.5 text-gray-500">{camp.language}</td>
                    <td className="py-3.5 text-gray-600">{camp.reach}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        camp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

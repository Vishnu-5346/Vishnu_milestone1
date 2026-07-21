import React, { useState } from 'react';
import { Users, Plus, Trash2, ShieldAlert } from 'lucide-react';

const Audience = () => {
  const [segments, setSegments] = useState([
    { id: 1, name: 'All Employees', count: '15,000', languages: 'English (82%), Spanish (10%), Other (8%)', department: 'All' },
    { id: 2, name: 'Operations Cohort', count: '4,500', languages: 'English (60%), French (30%), Spanish (10%)', department: 'Operations' },
    { id: 3, name: 'APAC Regional Offices', count: '3,200', languages: 'Japanese (50%), Chinese (40%), English (10%)', department: 'APAC' },
    { id: 4, name: 'LATAM Division', count: '2,800', languages: 'Spanish (75%), Portuguese (25%)', department: 'LATAM' }
  ]);

  const [formData, setFormData] = useState({ name: '', count: '', languages: '', department: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.count) return;

    setSegments([...segments, { id: segments.length + 1, ...formData }]);
    setFormData({ name: '', count: '', languages: '', department: '' });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audience Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Segment and analyze target communication cohorts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 shadow-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Segment
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm mb-8 space-y-4 max-w-2xl">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">Create New Segment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Segment Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sales Team Europe"
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Size (Users)</label>
              <input
                type="text"
                required
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                placeholder="e.g. 1,200"
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Language Composition</label>
              <input
                type="text"
                required
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder="e.g. English (70%), German (30%)"
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Sales"
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
            Save Cohort
          </button>
        </form>
      )}

      {/* Grid of cohort profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((seg) => (
          <div key={seg.id} className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm hover-scale flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{seg.name}</h3>
                  <p className="text-xs text-gray-400">Department: {seg.department}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50 dark:border-[#334155] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Subscribers:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{seg.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Language Breakdown:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 max-w-[200px] text-right truncate" title={seg.languages}>
                    {seg.languages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Audience;

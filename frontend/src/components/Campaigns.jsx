import React, { useState } from 'react';
import { Send, Plus, List, AlertCircle, CheckCircle2 } from 'lucide-react';

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState('list'); // list or create
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'Email',
    audience: 'All Employees',
    message: '',
    languages: ['English']
  });

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Q3 Enterprise Policy Update', channel: 'Email', audience: 'All Staff', reach: '4,200', languages: 6, status: 'Active' },
    { id: 2, name: 'Global Product Safety Bulletin', channel: 'SMS', audience: 'Operations', reach: '8,500', languages: 2, status: 'Active' },
    { id: 3, name: 'Internal Leadership Announcements', channel: 'Push', audience: 'Managers Only', reach: '2,300', languages: 3, status: 'Completed' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name,
      channel: formData.channel,
      audience: formData.audience,
      reach: '1,500',
      languages: formData.languages.length,
      status: 'Active'
    };

    setCampaigns([newCampaign, ...campaigns]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setActiveTab('list');
      setFormData({ name: '', channel: 'Email', audience: 'All Employees', message: '', languages: ['English'] });
    }, 1500);
  };

  const handleLanguageToggle = (lang) => {
    if (formData.languages.includes(lang)) {
      if (formData.languages.length > 1) {
        setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
      }
    } else {
      setFormData({ ...formData, languages: [...formData.languages, lang] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Draft, distribute, and manage multilingual alerts</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              activeTab === 'list' ? 'bg-white dark:bg-[#1E293B] text-primary dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
            All Campaigns
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              activeTab === 'create' ? 'bg-white dark:bg-[#1E293B] text-primary dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#334155] text-xs font-semibold text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4">Campaign Name</th>
                  <th className="p-4">Delivery Channel</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Languages</th>
                  <th className="p-4">Est. Reach</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#334155] text-sm">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition">
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">{camp.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {camp.channel}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{camp.audience}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">{camp.languages} Languages</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{camp.reach} users</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        camp.status === 'Active' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
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
      ) : (
        <div className="bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] max-w-3xl mx-auto">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/20 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Campaign Created Successfully!</p>
                <p className="text-xs mt-0.5">Sending notifications to targeted translation pipelines...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Annual HR Benefits Review Notification"
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] focus:ring-primary p-2.5 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 dark:border-[#334155] focus:ring-primary p-2.5 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="Email">Email Announcement</option>
                  <option value="SMS">SMS Bulletin</option>
                  <option value="Push">Push Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 dark:border-[#334155] focus:ring-primary p-2.5 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="All Employees">All Employees (15k)</option>
                  <option value="Sales & Marketing">Sales & Marketing (2.1k)</option>
                  <option value="Operations Dept">Operations Dept (4.5k)</option>
                  <option value="Executive Board">Executive Board (40)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Languages</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic', 'Japanese'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      formData.languages.includes(lang)
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-primary dark:border-[#3B82F6] text-primary-700 dark:text-primary-400 shadow-sm'
                        : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Content</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your campaign content here..."
                className="w-full rounded-lg border border-gray-200 dark:border-[#334155] focus:ring-primary p-2.5 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Publish Campaign
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Campaigns;

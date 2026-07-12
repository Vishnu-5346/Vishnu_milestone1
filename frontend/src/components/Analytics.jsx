import React from 'react';
import { BarChart3, TrendingUp, MailCheck, AlertTriangle } from 'lucide-react';

const Analytics = () => {
  // Mock metrics
  const cards = [
    { label: 'Overall Open Rate', value: '78.4%', change: '+4.2%', icon: MailCheck, status: 'positive' },
    { label: 'Avg Read Duration', value: '2m 14s', change: '+12s', icon: TrendingUp, status: 'positive' },
    { label: 'Delivery Success', value: '99.9%', change: '0.0%', icon: BarChart3, status: 'neutral' },
    { label: 'Bounced / Unread', value: '1.2%', change: '-0.3%', icon: AlertTriangle, status: 'positive' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
        <p className="text-sm text-gray-500">Monitor read rates and user interaction metrics across channels</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</span>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-500">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                <span className={`text-xs font-bold ${
                  card.status === 'positive' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Language Readership chart (SVG representation) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-md">Readership by Language</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>English</span>
                <span>8,200 reads (78%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>Spanish</span>
                <span>1,500 reads (65%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>French</span>
                <span>950 reads (88%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>Japanese</span>
                <span>800 reads (92%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Read Rates over Time (SVG bar chart representation) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-md">Monthly Message Read Volume</h3>
          <div className="flex justify-between items-end h-40 pt-4 px-2">
            {[45, 60, 55, 70, 85, 95].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 w-1/6">
                <div className="w-8 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-300" style={{ height: `${val}%` }}></div>
                <span className="text-[10px] font-semibold text-gray-400">
                  {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Globe, Users, BarChart3, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
        <div className="absolute top-20 right-10 w-82 h-82 bg-secondary-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center z-10 my-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 text-xs font-semibold text-primary dark:text-primary-400 mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Next-Generation AI Mass Communication Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
          Communicate Smarter with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Technology</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create multilingual campaigns, manage audiences, generate customized AI content, and monitor performance analytics from a single secure platform.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none cursor-pointer"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-[#334155] text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-gray-800 shadow transition-all duration-200 focus:outline-none cursor-pointer"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-[#334155] transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center text-primary dark:text-primary-400 mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Multilingual Delivery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Translate and distribute communication across 12+ standard languages automatically.</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-[#334155] transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-teal-950/40 flex items-center justify-center text-secondary dark:text-teal-400 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Content Engine</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Draft context-aware announcements, emails, or bulletins optimized for engagement.</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-[#334155] transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Audience Profiles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Segment lists based on language, role, and department for targeted outreach.</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-[#334155] transition-all duration-300 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Detailed Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor read rates, user responses, and click-through performance in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

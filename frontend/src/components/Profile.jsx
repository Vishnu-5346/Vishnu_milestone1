import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Globe, Building2, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white dark:bg-[#1E293B] rounded-2xl shadow border border-gray-100 dark:border-[#334155]">
        <p className="text-gray-500 dark:text-gray-400">No profile data available. Please log in.</p>
      </div>
    );
  }

  // Format date nicely
  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'July 12, 2026';

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-md border border-gray-100 dark:border-[#334155] overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          {/* Avatar container */}
          <div className="absolute -top-12 left-8 border-4 border-white dark:border-[#1E293B] bg-blue-100 dark:bg-blue-900/30 rounded-full w-24 h-24 flex items-center justify-center text-primary dark:text-primary-400 shadow">
            <User className="h-12 w-12" />
          </div>

          <div className="pt-16 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullname}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.organization}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Email Address</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Phone Number</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Member Since</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{joinDate}</p>
                </div>
              </div>
            </div>

            {/* Right side settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Role Assignment</p>
                  <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-primary-700 dark:text-primary-400 border border-blue-100 dark:border-blue-900/20">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Preferred Language</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{user.language}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Company / Org</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{user.organization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

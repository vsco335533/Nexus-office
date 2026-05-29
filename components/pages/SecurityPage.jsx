// frontend/components/pages/SecurityPage.jsx
'use client';

import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';

export default function SecurityPage() {
  const handleChangePassword = () => {
    toast.success('Password change feature coming soon');
  };

  const handleEnable2FA = () => {
    toast.success('Two-factor authentication setup coming soon');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Security</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Manage your account security</p>
      </div>

      {/* Security Options */}
      <div className="space-y-4">
        {/* Change Password */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Icons.Lock className="w-6 h-6 text-primary-500" />
              <div>
                <h3 className="font-bold text-ash-900 dark:text-white">Change Password</h3>
                <p className="text-sm text-ash-600 dark:text-ash-400">Update your account password regularly</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            className="btn-secondary px-6 py-2"
          >
            Change Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Icons.Shield className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-bold text-ash-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-ash-600 dark:text-ash-400">Add an extra layer of security to your account</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleEnable2FA}
            className="btn-secondary px-6 py-2"
          >
            Enable 2FA
          </button>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center gap-4 mb-4">
            <Icons.Smartphone className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-bold text-ash-900 dark:text-white">Active Sessions</h3>
              <p className="text-sm text-ash-600 dark:text-ash-400">Manage your active login sessions</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-ash-600 dark:text-ash-400">Current device is logged in</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex gap-4">
          <Icons.AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-ash-900 dark:text-white mb-2">Security Tips</h4>
            <ul className="text-sm text-ash-700 dark:text-ash-300 space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Enable two-factor authentication for extra protection</li>
              <li>• Never share your password with anyone</li>
              <li>• Log out from other devices if you don't recognize them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

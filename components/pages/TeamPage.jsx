// frontend/components/pages/TeamPage.jsx
'use client';

import * as Icons from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Team</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Manage team members and collaboration</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-12 border border-ash-200 dark:border-ash-700 text-center">
        <Icons.Users className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-ash-900 dark:text-white mb-2">Coming Soon</h2>
        <p className="text-ash-600 dark:text-ash-400">Team collaboration features are currently in development.</p>
        <p className="text-sm text-ash-500 dark:text-ash-400 mt-2">Invite team members and collaborate on shared notes.</p>
      </div>
    </div>
  );
}

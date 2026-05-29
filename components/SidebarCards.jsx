// components/SidebarCards.jsx
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../context/AppState';

export default function SidebarCards() {
  const [permission, setPermission] = useState('view');
  const [exportFormat, setExportFormat] = useState('pdf');

  const { notes, setActive } = useAppState();
  const recentNotes = notes.filter(n => !n.trashed).slice(0, 6);

  const shareOptions = [
    { platform: 'Facebook', icon: Icons.Facebook, color: 'text-blue-600' },
    { platform: 'Twitter', icon: Icons.Twitter, color: 'text-blue-400' },
    { platform: 'WhatsApp', icon: Icons.MessageCircle, color: 'text-green-500' },
    { platform: 'Email', icon: Icons.Mail, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* QR Code Card */}
      <div className="bg-white dark:bg-ash-800 rounded-3xl shadow-glossy p-6 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Icons.QrCode className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-ash-900 dark:text-ash-100">Share via QR Code</h3>
        </div>
        
        <div className="text-center p-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg inline-block mb-4">
            {/* QR Code placeholder */}
            <div className="w-48 h-48 bg-ash-200 dark:bg-ash-700 rounded-xl flex items-center justify-center">
              <Icons.QrCode className="w-16 h-16 text-ash-400" />
            </div>
          </div>
          <p className="text-ash-600 dark:text-ash-400 mb-4">
            Scan this QR code to view this note on any device
          </p>
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Icons.Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white dark:bg-ash-800 rounded-3xl shadow-glossy p-6 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Icons.Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-ash-900 dark:text-ash-100">Note Security</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ash-700 dark:text-ash-300 mb-2">
              Password Protection
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Set a password for this note"
                className="w-full px-4 py-3 rounded-xl border border-ash-300 dark:border-ash-600 bg-white dark:bg-ash-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all duration-300"
              />
              <Icons.Lock className="w-4 h-4 text-ash-400 absolute right-3 top-3" />
            </div>
            <div className="mt-2">
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ash-700 dark:text-ash-300 mb-2">
              Share Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPermission('view')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  permission === 'view'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-ash-200 dark:border-ash-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
               >
                <Icons.Eye className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm font-medium">View Only</span>
               </button>
              <button
                onClick={() => setPermission('edit')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  permission === 'edit'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-ash-200 dark:border-ash-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <Icons.Edit className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm font-medium">Can Edit</span>
              </button>
            </div>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Icons.Lock className="w-4 h-4" />
            Apply Security Settings
          </button>
        </div>
      </div>

      {/* Share Options Card */}
      <div className="bg-white dark:bg-ash-800 rounded-3xl shadow-glossy p-6 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Icons.Share2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-ash-900 dark:text-ash-100">Share Options</h3>
        </div>

        <div className="space-y-3">
          {shareOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                className="w-full p-4 rounded-xl bg-ash-50 dark:bg-ash-700 hover:bg-ash-100 dark:hover:bg-ash-600 transition-all duration-300 flex items-center gap-3 group hover:scale-105"
              >
                <Icon className={`w-5 h-5 ${option.color}`} />
                <span className="font-medium text-ash-700 dark:text-ash-300 group-hover:text-ash-900 dark:group-hover:text-ash-100">
                  Share on {option.platform}
                </span>
              </button>
            );
          })}
          
          <button className="w-full p-4 rounded-xl bg-ash-50 dark:bg-ash-700 hover:bg-ash-100 dark:hover:bg-ash-600 transition-all duration-300 flex items-center gap-3 group hover:scale-105">
            <Icons.Link className="w-5 h-5 text-ash-600 dark:text-ash-400" />
            <span className="font-medium text-ash-700 dark:text-ash-300 group-hover:text-ash-900 dark:group-hover:text-ash-100">
              Copy Shareable Link
            </span>
          </button>
        </div>
      </div>

      {/* Recent Notes Card */}
      <div className="bg-white dark:bg-ash-800 rounded-3xl shadow-glossy p-6 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Icons.History className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-ash-900 dark:text-ash-100">Recent Notes</h3>
        </div>

        <div className="space-y-3">
          {recentNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActive('editor', { selectNoteId: note.id })}
              className="w-full p-4 text-left rounded-xl bg-ash-50 dark:bg-ash-700 hover:bg-ash-100 dark:hover:bg-ash-600 transition-all duration-300 border-l-4 border-primary-500 group hover:translate-x-2"
            >
              <h4 className="font-semibold text-ash-900 dark:text-ash-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {note.title}
              </h4>
              <p className="text-sm text-ash-600 dark:text-ash-400 mt-1 line-clamp-2">
                {note.content ? note.content.replace(/<[^>]*>/g, '').slice(0, 120) : 'No preview'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
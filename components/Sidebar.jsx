// components/Sidebar.jsx
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../context/AppState';

export default function Sidebar() {
  const { counts, activeView, setActive, user, setNewNoteDrawerOpen } = useAppState();

  // Get user initials from name or email
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'NU';
  };

  const userName = user?.username || user?.email || 'Not Signed In';
  const userEmail = user?.email || '';

  const handleNewNote = () => {
    setNewNoteDrawerOpen(true);
  };

  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Home, badge: null },
        { id: 'notes', label: 'My Notes', icon: Icons.FileText, badge: 12 },
        { id: 'shared', label: 'Shared with me', icon: Icons.Share2, badge: null },
        { id: 'starred', label: 'Starred', icon: Icons.Star, badge: null },
        { id: 'recent', label: 'Recent', icon: Icons.Clock, badge: null },
      ]
    },
    {
      title: 'Workspace',
      items: [
        { id: 'all-notes', label: 'All Notes', icon: Icons.Folder, badge: null },
        { id: 'projects', label: 'Projects', icon: Icons.Network, badge: null },
        { id: 'todo', label: 'Todo Lists', icon: Icons.CheckSquare, badge: null },
        { id: 'kanban', label: 'Kanban Board', icon: Icons.LayoutDashboard, badge: null },
        { id: 'tags', label: 'Tags', icon: Icons.FileText, badge: null },
        { id: 'archived', label: 'Archived', icon: Icons.Folder, badge: null },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'qr-generator', label: 'QR Generator', icon: Icons.QrCode, badge: null },
        { id: 'export', label: 'Export', icon: Icons.Download, badge: null },
        { id: 'history', label: 'Version History', icon: Icons.History, badge: null },
        { id: 'trash', label: 'Trash', icon: Icons.Trash2, badge: null },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'preferences', label: 'Preferences', icon: Icons.Settings, badge: null },
        { id: 'security', label: 'Security', icon: Icons.Shield, badge: null },
        { id: 'team', label: 'Team', icon: Icons.Users, badge: null },
        { id: 'help', label: 'Help & Support', icon: Icons.LifeBuoy, badge: null },
      ]
    }
  ];

  return (
    <div className="w-80 h-full bg-gradient-to-b from-ash-50 to-ash-100 dark:from-ash-800 dark:to-ash-900 border-r border-ash-200 dark:border-ash-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
            <Icons.Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Nexus</h1>
            <p className="text-ash-500 dark:text-ash-400 text-sm">Note Sharing Platform</p>
          </div>
        </div>
      </div>

      {/* New Note Shortcut - prominent (now opens drawer) */}
      <div className="px-4 py-4">
        <button
          onClick={handleNewNote}
          aria-label="Create new note in drawer"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:scale-[1.02] transform transition-all focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          <Icons.Plus className="w-5 h-5" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-xs font-semibold text-ash-500 dark:text-ash-400 uppercase tracking-wider px-4">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`nav-item w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ash-100 dark:hover:bg-ash-800 transition-colors ${
                      activeView === item.id ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                        {item.badge}
                      </span>
                    )}
                    {/* show computed counts if available */}
                    {item.id === 'notes' && counts?.myNotes !== undefined && (
                      <span className="text-xs text-ash-500 dark:text-ash-400">{counts.myNotes}</span>
                    )}
                    {item.id === 'projects' && counts?.projects !== undefined && (
                      <span className="text-xs text-ash-500 dark:text-ash-400">{counts.projects}</span>
                    )}
                    {item.id === 'archived' && counts?.archived !== undefined && (
                      <span className="text-xs text-ash-500 dark:text-ash-400">{counts.archived}</span>
                    )}
                    {item.id === 'trash' && counts?.trashed !== undefined && (
                      <span className="text-xs text-ash-500 dark:text-ash-400">{counts.trashed}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Links: Share + Tools */}
      <div className="px-4 py-3 border-t border-ash-200 dark:border-ash-700 space-y-1">
        <a href="/publish" target="_blank" rel="noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ash-600 dark:text-ash-300 hover:bg-ash-100 dark:hover:bg-ash-700 transition-colors">
          <Icons.Share2 className="w-4 h-4 text-red-500" />
          <span>Share Text Publicly</span>
          <Icons.ExternalLink className="w-3 h-3 ml-auto opacity-40" />
        </a>
        <a href="/tools" target="_blank" rel="noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ash-600 dark:text-ash-300 hover:bg-ash-100 dark:hover:bg-ash-700 transition-colors">
          <Icons.Wrench className="w-4 h-4 text-primary-500" />
          <span>Free Tools</span>
          <Icons.ExternalLink className="w-3 h-3 ml-auto opacity-40" />
        </a>
      </div>

      {/* User Profile - Bottom */}
      <div className="p-4 border-t border-ash-200 dark:border-ash-700 bg-ash-50 dark:bg-ash-700">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-ash-100 dark:hover:bg-ash-600 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ash-900 dark:text-white truncate text-sm">{userName}</p>
            <p className="text-ash-600 dark:text-white text-xs truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
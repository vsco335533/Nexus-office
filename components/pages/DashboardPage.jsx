// frontend/components/pages/DashboardPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { notes, counts, setActive, setSelectedNoteId, moveToTrash } = useAppState();
  const [hoveredNote, setHoveredNote] = useState(null);

  // Get recent notes for dashboard
  const recentNotes = notes.filter(n => !n.trashed).slice(0, 6);
  const pinnedNotes = notes.filter(n => n.starred && !n.trashed).slice(0, 3);

  const handleNoteClick = (noteId) => {
    setSelectedNoteId(noteId);
    setActive('notes');
  };

  const handleDelete = (noteId) => {
    moveToTrash(noteId);
    toast.success('Note moved to trash');
  };

  const stats = [
    { label: 'My Notes', value: counts?.myNotes || 0, icon: Icons.FileText, color: 'primary' },
    { label: 'Shared', value: counts?.shared || 0, icon: Icons.Share2, color: 'green' },
    { label: 'Starred', value: counts?.starred || 0, icon: Icons.Star, color: 'yellow' },
    { label: 'Archived', value: counts?.archived || 0, icon: Icons.Archive, color: 'blue' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome to Nexus</h1>
        <p className="text-primary-100">Your personal note-taking and sharing platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClass = {
            primary: 'from-primary-500 to-primary-600',
            green: 'from-green-500 to-green-600',
            yellow: 'from-yellow-500 to-yellow-600',
            blue: 'from-blue-500 to-blue-600',
          }[stat.color];

          return (
            <button
              key={idx}
              onClick={() => {
                if (stat.label === 'My Notes') setActive('notes');
                else if (stat.label === 'Shared') setActive('shared');
                else if (stat.label === 'Starred') setActive('starred');
                else if (stat.label === 'Archived') setActive('archived');
              }}
              className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-ash-600 dark:text-ash-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-ash-900 dark:text-white">{stat.value}</p>
            </button>
          );
        })}
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icons.Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-ash-900 dark:text-white">Pinned Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                onMouseEnter={() => setHoveredNote(note.id)}
                onMouseLeave={() => setHoveredNote(null)}
                onClick={() => handleNoteClick(note.id)}
                className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700 hover:shadow-lg transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-ash-900 dark:text-white flex-1 line-clamp-2">
                    {note.title}
                  </h3>
                  {hoveredNote === note.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      className="text-ash-400 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-ash-600 dark:text-ash-400 line-clamp-3">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icons.Clock className="w-5 h-5 text-primary-500" />
            <h2 className="text-2xl font-bold text-ash-900 dark:text-white">Recent Notes</h2>
          </div>
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                onMouseEnter={() => setHoveredNote(note.id)}
                onMouseLeave={() => setHoveredNote(null)}
                onClick={() => handleNoteClick(note.id)}
                className="bg-white dark:bg-ash-800 rounded-lg p-4 border border-ash-200 dark:border-ash-700 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ash-900 dark:text-white truncate">
                    {note.title}
                  </p>
                  <p className="text-sm text-ash-600 dark:text-ash-400 truncate">
                    {note.content}
                  </p>
                </div>
                {hoveredNote === note.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-ash-400 hover:text-red-500 transition-colors ml-4"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentNotes.length === 0 && (
        <div className="bg-white dark:bg-ash-800 rounded-xl p-12 border border-ash-200 dark:border-ash-700 text-center">
          <Icons.FileText className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto mb-4" />
          <p className="text-ash-600 dark:text-ash-400 mb-4">No notes yet. Create your first note to get started!</p>
          <button
            onClick={() => setActive('notes')}
            className="btn-primary px-6 py-2"
          >
            Create Note
          </button>
        </div>
      )}
    </div>
  );
}

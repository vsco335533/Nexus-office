// frontend/components/pages/TrashPage.jsx
'use client';

import { useAppState } from '../../context/AppState';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TrashPage() {
  const { notes, restoreFromTrash } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const trashedNotes = notes.filter(n => n.trashed);
  const filtered = trashedNotes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = (e, noteId) => {
    e.stopPropagation();
    restoreFromTrash(noteId);
    toast.success('Note restored from trash');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Trash</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Permanently deleted notes</p>
        <p className="text-sm text-ash-500 dark:text-ash-400 mt-2">{filtered.length} note{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-4 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 bg-ash-50 dark:bg-ash-700 rounded-lg px-4 py-2">
          <Icons.Search className="w-5 h-5 text-ash-400" />
          <input
            type="text"
            placeholder="Search trash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ash-900 dark:text-white placeholder-ash-400"
          />
        </div>
      </div>

      {/* Trashed Notes */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-ash-800 rounded-xl p-12 border border-ash-200 dark:border-ash-700 text-center">
          <Icons.Trash2 className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto mb-4" />
          <p className="text-ash-500 dark:text-ash-400">Trash is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-ash-800 rounded-lg p-4 border border-ash-200 dark:border-ash-700 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ash-900 dark:text-white truncate">
                  {note.title}
                </p>
                <p className="text-sm text-ash-600 dark:text-ash-400 truncate">
                  {note.content}
                </p>
              </div>
              <button
                onClick={(e) => handleRestore(e, note.id)}
                className="text-ash-400 hover:text-green-500 transition-colors ml-4"
                title="Restore from trash"
              >
                <Icons.RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

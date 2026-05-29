// frontend/components/pages/NotesListPage.jsx
'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../../context/AppState';
import toast from 'react-hot-toast';

export default function NotesListPage({ 
  title, 
  subtitle, 
  getFilteredNotes, 
  emptyMessage = 'No notes found' 
}) {
  const { setActive, selectedNoteId, setSelectedNoteId, moveToTrash, restoreFromTrash } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const notes = getFilteredNotes();
  const filtered = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNoteClick = (noteId) => {
    setSelectedNoteId(noteId);
    setActive('editor', { selectNoteId: noteId });
  };

  const handleDelete = (e, noteId) => {
    e.stopPropagation();
    moveToTrash(noteId);
    toast.success('Note moved to trash');
  };

  const handleRestore = (e, noteId) => {
    e.stopPropagation();
    restoreFromTrash(noteId);
    toast.success('Note restored');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-ash-600 dark:text-ash-400 mt-1">{subtitle}</p>}
        <p className="text-sm text-ash-500 dark:text-ash-400 mt-2">{filtered.length} note{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-4 border border-ash-200 dark:border-ash-700">
        <div className="flex items-center gap-3 bg-ash-50 dark:bg-ash-700 rounded-lg px-4 py-2">
          <Icons.Search className="w-5 h-5 text-ash-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ash-900 dark:text-white placeholder-ash-400"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-ash-800 rounded-xl p-12 border border-ash-200 dark:border-ash-700 text-center">
          <Icons.FileText className="w-16 h-16 text-ash-300 dark:text-ash-600 mx-auto mb-4" />
          <p className="text-ash-500 dark:text-ash-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedNoteId === note.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                  : 'bg-white dark:bg-ash-800 border-ash-200 dark:border-ash-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-ash-900 dark:text-white line-clamp-2 flex-1">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => note.trashed ? handleRestore(e, note.id) : handleDelete(e, note.id)}
                  className="text-ash-400 hover:text-red-500 transition-colors ml-2"
                >
                  {note.trashed ? (
                    <Icons.RotateCcw className="w-4 h-4" />
                  ) : (
                    <Icons.Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-ash-600 dark:text-ash-400 line-clamp-3 mb-3">
                {note.content || 'No content'}
              </p>
              <div className="flex items-center gap-2 text-xs text-ash-500">
                {note.starred && <Icons.Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                {note.shared && <Icons.Share2 className="w-3 h-3 text-green-500" />}
                {note.tags?.length > 0 && (
                  <span className="text-ash-400">({note.tags.length} tags)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

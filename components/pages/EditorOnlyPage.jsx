// frontend/components/pages/EditorOnlyPage.jsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import * as Icons from 'lucide-react';
import { useAppState } from '../../context/AppState';

const Editor = dynamic(() => import('../Editor'), {
  ssr: false,
  loading: () => <div className="min-h-[200px] p-6 text-ash-400 dark:text-ash-300 flex items-center justify-center">Loading editor...</div>
});

export default function EditorOnlyPage() {
  const { setActive, selectedNoteId, notes } = useAppState();

  const currentNote = selectedNoteId ? notes.find(n => n.id === selectedNoteId) : null;
  const noteTitle = currentNote?.title || 'Untitled Note';

  const handleBackClick = () => {
    setActive('notes');
  };

  return (
    <div className="w-full">
      {/* Mini-Toolbar / Header */}
      <div className="bg-white dark:bg-ash-800 border-b border-ash-200 dark:border-ash-700 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Back Button + Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 rounded-lg hover:bg-ash-100 dark:hover:bg-ash-700 transition-colors text-ash-700 dark:text-ash-300 hover:text-ash-900 dark:hover:text-white"
              title="Back to My Notes"
            >
              <Icons.ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setActive('notes')}
                className="text-primary-600 dark:text-primary-400 hover:underline hover:text-primary-700 dark:hover:text-primary-300"
              >
                My Notes
              </button>
              <Icons.ChevronRight className="w-4 h-4 text-ash-400 dark:text-ash-500" />
              <span className="text-ash-700 dark:text-ash-300 max-w-xs truncate">
                {noteTitle}
              </span>
            </div>
          </div>

          {/* Right: Info / Stats (optional) */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-ash-500 dark:text-ash-400 flex gap-4">
              {/* Word count or status can go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="px-4 py-6">
        <Editor />
      </div>
    </div>
  );
}
